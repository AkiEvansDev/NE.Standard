using System;
using System.Collections;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using NE.Colors;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Abstractions.Styling.Theme;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Items;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Compiled.Views;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Interaction;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Serialization;

/// <summary>
/// Serializes and deserializes the client-facing sections of a <see cref="CompiledView"/> to and from UTF-8 JSON.
/// </summary>
public static class CompiledViewWireSerializer
{
    private const string TypeTagProperty = "$t";
    private const string ValueProperty = "v";
    private const string ResponsivePrefix = "resp:";
    private const string ArrayPrefix = "arr:";
    private const string RecursiveCollectionPrefix = "rcol:";
    private const string NullablePrefix = "nullable:";
    private const string ReadOnlyListPrefix = "ro_list:";
    private const string ReadOnlyDictionaryPrefix = "ro_dict:";
    private const string EnumPrefix = "enum:";
    private const string StructPrefix = "struct:";

    private static readonly Lock RegistrySync = new();
    private static readonly Dictionary<string, Type> TagToType = [with(StringComparer.Ordinal)];
    private static readonly Dictionary<Type, string> TypeToTag = [];
    private static readonly HashSet<Assembly> ScannedAssemblies = [];
    private static readonly JsonSerializerOptions ValueJsonOptions = CreateValueJsonOptions();

    static CompiledViewWireSerializer()
    {
        RegisterScalarTag("bool", typeof(bool));
        RegisterScalarTag("u8", typeof(byte));
        RegisterScalarTag("i8", typeof(sbyte));
        RegisterScalarTag("i16", typeof(short));
        RegisterScalarTag("u16", typeof(ushort));
        RegisterScalarTag("i32", typeof(int));
        RegisterScalarTag("u32", typeof(uint));
        RegisterScalarTag("i64", typeof(long));
        RegisterScalarTag("u64", typeof(ulong));
        RegisterScalarTag("nint", typeof(nint));
        RegisterScalarTag("nuint", typeof(nuint));
        RegisterScalarTag("f64", typeof(double));
        RegisterScalarTag("f32", typeof(float));
        RegisterScalarTag("dec", typeof(decimal));
        RegisterScalarTag("chr", typeof(char));
        RegisterScalarTag("str", typeof(string));
        RegisterScalarTag("obj", typeof(object));
        RegisterScalarTag("guid", typeof(Guid));
        RegisterScalarTag("dt", typeof(DateTime));
        RegisterScalarTag("dto", typeof(DateTimeOffset));
        RegisterScalarTag("do", typeof(DateOnly));
        RegisterScalarTag("to", typeof(TimeOnly));
        RegisterScalarTag("ts", typeof(TimeSpan));
        RegisterScalarTag("item", typeof(IReadOnlyDictionary<string, object?>));
        TypeToTag[typeof(Dictionary<string, object?>)] = "item";
        RegisterScalarTag(nameof(CompiledUIItemsView), typeof(CompiledUIItemsView));
        EnsureLoadedAssembliesScanned();
    }

    private static void RegisterScalarTag(string tag, Type type)
    {
        TagToType[tag] = type;
        TypeToTag[type] = tag;
    }

    private static void EnsureLoadedAssembliesScanned()
    {
        lock (RegistrySync)
        {
            foreach (Assembly assembly in AppDomain.CurrentDomain.GetAssemblies())
            {
                if (assembly.IsDynamic || !ScannedAssemblies.Add(assembly))
                    continue;

                var assemblyName = assembly.GetName().Name;
                if (assemblyName is null || !IsWireValueAssembly(assemblyName))
                    continue;

                Type[] exported;
                try
                {
                    exported = assembly.GetExportedTypes();
                }
                catch (ReflectionTypeLoadException ex)
                {
                    exported = [.. ex.Types.Where(static t => t is not null && t.IsPublic).Select(static t => t!)];
                }

                foreach (Type type in exported)
                {
                    if (type.IsGenericTypeDefinition
                        || (type.IsAbstract && type.IsSealed)
                        || type.FullName is null
                        || type.Name.StartsWith('<', StringComparison.Ordinal)
                        || typeof(Delegate).IsAssignableFrom(type)
                        || typeof(Exception).IsAssignableFrom(type)
                        || typeof(Task).IsAssignableFrom(type))
                    {
                        continue;
                    }

                    if (!TypeToTag.ContainsKey(type))
                    {
                        var tag = TagToType.ContainsKey(type.Name) ? type.FullName : type.Name;
                        _ = TagToType.TryAdd(tag, type);
                        TypeToTag[type] = tag;
                    }
                }
            }
        }
    }

    private static bool IsWireValueAssembly(string assemblyName)
        => string.Equals(assemblyName, "NE.Colors", StringComparison.Ordinal)
            || (assemblyName.StartsWith("NE.Standard.UI.", StringComparison.Ordinal)
                && !string.Equals(assemblyName, "NE.Standard.UI.Shell", StringComparison.Ordinal)
                && !string.Equals(assemblyName, "NE.Standard.UI.Client", StringComparison.Ordinal)
                && !string.Equals(assemblyName, "NE.Standard.UI.Server", StringComparison.Ordinal)
                && !string.Equals(assemblyName, "NE.Standard.UI.Testing", StringComparison.Ordinal)
                && !string.Equals(assemblyName, "NE.Standard.UI.Generators", StringComparison.Ordinal)
                && !assemblyName.StartsWith("NE.Standard.UI.Web", StringComparison.Ordinal));

    private static JsonSerializerOptions CreateValueJsonOptions()
    {
        JsonSerializerOptions options = new(JsonSerializerDefaults.Web)
        {
            NumberHandling = JsonNumberHandling.AllowNamedFloatingPointLiterals,
            PreferredObjectCreationHandling = JsonObjectCreationHandling.Populate,
        };

        options.Converters.Add(new JsonStringEnumConverter());
        options.Converters.Add(new NIntWireJsonConverter());
        options.Converters.Add(new NUIntWireJsonConverter());
        options.Converters.Add(new UIPhraseJsonConverter());
        options.Converters.Add(new UIPhraseValueJsonConverter());
        options.Converters.Add(new UIMomentJsonConverter());
        options.Converters.Add(new UIFileSizeJsonConverter());
        options.Converters.Add(new UIThemeColorsJsonConverter());
        options.Converters.Add(new ClientEffectJsonConverter());
        options.Converters.Add(new UIComponentIdJsonConverter());
        options.Converters.Add(new UIBindingIdJsonConverter());
        options.Converters.Add(new UIBindingSourceIdJsonConverter());
        options.Converters.Add(new UIBindingTemplateIdJsonConverter());
        options.Converters.Add(new UIEventIdJsonConverter());
        options.Converters.Add(new UIContextIdJsonConverter());
        options.Converters.Add(new UIPropertyJsonConverter());
        options.Converters.Add(new UIComponentAddressJsonConverter());
        options.Converters.Add(new ColorVariantWireJsonConverter());
        options.Converters.Add(new UIItemsQueryTermsWireJsonConverter());
        options.Converters.Add(new UIItemReadsWireJsonConverter());
        options.Converters.Add(new CompiledUIItemsViewWireJsonConverter());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<IBadgeModel, BadgeItem>());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<IBreadcrumbItemModel, BreadcrumbItem>());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<IButtonModel, ButtonItem>());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<IFileModel, FileItem>());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<IItemAbilitiesModel, TabItem>());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<IKeyValueActionModel, KeyValueActionItem>());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<IMenuItemModel, MenuItem>());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<IOptionModel, OptionItem>());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<ITabItemModel, TabItem>());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<ITextBaseModel, TextBaseItem>());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<ITextModel, TextItem>());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<ITooltipModel, TextBaseItem>());
        options.Converters.Add(new ModelInterfaceWireJsonConverter<ITreeNodeModel, TreeNode>());
        options.Converters.Add(new ObjectToInferredTypesConverter());
        return options;
    }

    /// <summary>
    /// Serializes a <see cref="CompiledView"/> to a UTF-8 JSON byte array.
    /// </summary>
    public static byte[] SerializeToUtf8Bytes(CompiledView view, bool includeDiagnostics = true)
    {
        ArgumentNullException.ThrowIfNull(view);

        using MemoryStream buffer = new();
        using (Utf8JsonWriter writer = new(buffer))
        {
            Write(writer, view, includeDiagnostics);
        }

        return buffer.ToArray();
    }

    /// <summary>
    /// Writes a <see cref="CompiledView"/> as a JSON object to <paramref name="writer"/>.
    /// </summary>
    public static void Write(Utf8JsonWriter writer, CompiledView view, bool includeDiagnostics = true)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(view);

        writer.WriteStartObject();
        writer.WriteString("title", view.Title);
        writer.WriteString("fingerprint", view.Fingerprint);

        if (view.TitleArguments is { Count: > 0 })
        {
            writer.WritePropertyName("titleArguments");
            WriteTitleArguments(writer, view.TitleArguments);
        }

        writer.WritePropertyName("options");
        JsonSerializer.Serialize(writer, view.Options, ValueJsonOptions);

        writer.WritePropertyName("regions");
        WriteRegions(writer, view.Regions);

        writer.WritePropertyName("dialogs");
        WriteDialogs(writer, view.Dialogs);

        writer.WritePropertyName("graph");
        WriteGraph(writer, view.Graph);

        writer.WritePropertyName("state");
        WriteStates(writer, view.State, view.ItemProjections);

        writer.WritePropertyName("sources");
        WriteSources(writer, view.Sources);

        writer.WritePropertyName("templates");
        WriteTemplates(writer, view.Templates);

        if (view.Contexts.All.Count > 0)
        {
            writer.WritePropertyName("contexts");
            WriteContexts(writer, view.Contexts);
        }

        writer.WritePropertyName("bindings");
        WriteBindings(writer, view.Bindings);

        writer.WritePropertyName("interactions");
        WriteInteractions(writer, view.Interactions);

        writer.WritePropertyName("events");
        WriteEvents(writer, view.Events);

        writer.WritePropertyName("validations");
        WriteValidations(writer, view.Validations);

        if (view.Validations.MessageTargets.Count > 0)
        {
            writer.WritePropertyName("validationMessageTargets");
            WriteValidationMessageTargets(writer, view.Validations.MessageTargets);
        }

        if (includeDiagnostics)
        {
            writer.WritePropertyName("itemProjections");
            WriteItemProjections(writer, view.ItemProjections);

            if (view.Warnings.Count > 0)
            {
                writer.WritePropertyName("warnings");
                WriteWarnings(writer, view.Warnings);
            }
        }

        writer.WriteEndObject();
    }

    private static void WriteTitleArguments(Utf8JsonWriter writer, IReadOnlyDictionary<string, object?> arguments)
    {
        writer.WriteStartObject();

        foreach (KeyValuePair<string, object?> entry in arguments)
        {
            writer.WritePropertyName(entry.Key);
            WriteTypedValue(writer, entry.Value);
        }

        writer.WriteEndObject();
    }

    private static void WriteTypedValue(Utf8JsonWriter writer, object? value, UIItemProjection? itemProjection = null)
    {
        switch (value)
        {
            case null:
                writer.WriteNullValue();
                return;
            case bool flag:
                writer.WriteBooleanValue(flag);
                return;
            case int intValue:
                writer.WriteNumberValue(intValue);
                return;
            case string text:
                writer.WriteStringValue(text);
                return;
            case Type typeValue:
                writer.WriteStartObject();
                writer.WriteString(TypeTagProperty, "type");
                writer.WriteString(ValueProperty, GetTypeTag(typeValue));
                writer.WriteEndObject();
                return;
            default:
                break;
        }

        Type runtimeType = value.GetType();
        if (TryWriteTypedSequence(writer, value, runtimeType, itemProjection))
            return;

        var tag = GetTypeTag(runtimeType);
        writer.WriteStartObject();
        writer.WriteString(TypeTagProperty, tag);
        writer.WritePropertyName(ValueProperty);

        if (string.Equals(tag, "item", StringComparison.Ordinal))
            ServerItemJsonConverter.WriteItem(writer, value, itemProjection, ValueJsonOptions);
        else
            JsonSerializer.Serialize(writer, value, runtimeType, ValueJsonOptions);

        writer.WriteEndObject();
    }

    private static bool TryWriteTypedSequence(Utf8JsonWriter writer, object value, Type runtimeType, UIItemProjection? itemProjection)
    {
        if (runtimeType.IsArray)
        {
            Type elementType = runtimeType.GetElementType()!;
            WriteSequenceEnvelope(writer, $"{ArrayPrefix}{ResolveSequenceElementTag(elementType, (IEnumerable)value)}", (IEnumerable)value, itemProjection);
            return true;
        }

        if (runtimeType.IsGenericType && runtimeType.GetGenericTypeDefinition() == typeof(RecursiveCollection<>))
        {
            Type elementType = runtimeType.GetGenericArguments()[0];
            WriteSequenceEnvelope(writer, $"{RecursiveCollectionPrefix}{ResolveSequenceElementTag(elementType, (IEnumerable)value)}", (IEnumerable)value, itemProjection);
            return true;
        }

        if (value is IEnumerable sequence && value is not IDictionary && !IsCustomStructuredValue(runtimeType))
        {
            Type? elementType = TryGetGenericCollectionElement(runtimeType);
            if (elementType is not null)
            {
                WriteSequenceEnvelope(writer, $"{ArrayPrefix}{ResolveSequenceElementTag(elementType, sequence)}", sequence, itemProjection);
                return true;
            }
        }

        return false;
    }

    private static string ResolveSequenceElementTag(Type elementType, IEnumerable sequence)
    {
        var tag = GetTypeTag(elementType);
        if (elementType.IsInterface || elementType.IsAbstract)
        {
            foreach (var item in sequence)
            {
                if (item is not null && string.Equals(GetTypeTag(item.GetType()), "item", StringComparison.Ordinal))
                    return "item";
            }
        }

        return tag;
    }

    private static void WriteSequenceEnvelope(Utf8JsonWriter writer, string tag, IEnumerable sequence, UIItemProjection? itemProjection)
    {
        writer.WriteStartObject();
        writer.WriteString(TypeTagProperty, tag);
        writer.WritePropertyName(ValueProperty);
        writer.WriteStartArray();

        foreach (var element in sequence)
            WriteTypedValue(writer, element, itemProjection);

        writer.WriteEndArray();
        writer.WriteEndObject();
    }

    private static bool IsCustomStructuredValue(Type runtimeType)
        => runtimeType == typeof(UIItemsQueryTerms)
            || runtimeType == typeof(UIItemsQuery)
            || runtimeType == typeof(UIItemsView)
            || runtimeType == typeof(CompiledUIItemsView)
            || typeof(IDictionary).IsAssignableFrom(runtimeType)
            || TryGetDictionaryArguments(runtimeType, out _, out _);

    private static bool TryGetDictionaryArguments(Type type, [NotNullWhen(true)] out Type? keyType, [NotNullWhen(true)] out Type? valueType)
    {
        if (type.IsGenericType)
        {
            Type genericDef = type.GetGenericTypeDefinition();
            if (genericDef == typeof(IReadOnlyDictionary<,>) || genericDef == typeof(IDictionary<,>) || genericDef == typeof(Dictionary<,>))
            {
                Type[] args = type.GetGenericArguments();
                keyType = args[0];
                valueType = args[1];
                return true;
            }
        }

        foreach (Type contract in type.GetInterfaces())
        {
            if (contract.IsGenericType && (contract.GetGenericTypeDefinition() == typeof(IReadOnlyDictionary<,>) || contract.GetGenericTypeDefinition() == typeof(IDictionary<,>)))
            {
                Type[] args = contract.GetGenericArguments();
                keyType = args[0];
                valueType = args[1];
                return true;
            }
        }

        keyType = null;
        valueType = null;
        return false;
    }

    private static Type? TryGetGenericCollectionElement(Type type)
    {
        if (type == typeof(string))
            return null;

        if (type.IsGenericType)
        {
            Type genericDef = type.GetGenericTypeDefinition();
            if (genericDef == typeof(IReadOnlyList<>) || genericDef == typeof(IList<>) || genericDef == typeof(ICollection<>) || genericDef == typeof(IReadOnlyCollection<>) || genericDef == typeof(IEnumerable<>))
                return type.GetGenericArguments()[0];
        }

        foreach (Type contract in type.GetInterfaces())
        {
            if (contract.IsGenericType && (contract.GetGenericTypeDefinition() == typeof(IReadOnlyList<>) || contract.GetGenericTypeDefinition() == typeof(ICollection<>) || contract.GetGenericTypeDefinition() == typeof(IReadOnlyCollection<>)))
                return contract.GetGenericArguments()[0];
        }

        return null;
    }

    private static string GetTypeTag(Type type)
    {
        if (TypeToTag.TryGetValue(type, out var existing))
            return existing;

        if (Nullable.GetUnderlyingType(type) is Type nullableInner)
            return $"{NullablePrefix}{GetTypeTag(nullableInner)}";

        if (type.IsArray)
            return $"{ArrayPrefix}{GetTypeTag(type.GetElementType()!)}";

        if (type.IsGenericType)
        {
            Type genericDef = type.GetGenericTypeDefinition();
            Type[] args = type.GetGenericArguments();

            if (genericDef == typeof(UIResponsive<>))
                return $"{ResponsivePrefix}{GetTypeTag(args[0])}";

            if (genericDef == typeof(RecursiveCollection<>))
                return $"{RecursiveCollectionPrefix}{GetTypeTag(args[0])}";

            if (genericDef == typeof(IReadOnlyList<>) || genericDef == typeof(List<>))
                return $"{ReadOnlyListPrefix}{GetTypeTag(args[0])}";

            if (genericDef == typeof(IReadOnlyDictionary<,>) || genericDef == typeof(Dictionary<,>))
                return $"{ReadOnlyDictionaryPrefix}{GetTypeTag(args[0])},{GetTypeTag(args[1])}";
        }

        EnsureLoadedAssembliesScanned();
        if (TypeToTag.TryGetValue(type, out existing))
            return existing;

        if (TryGetDictionaryArguments(type, out Type? dictKey, out Type? dictValue))
            return $"{ReadOnlyDictionaryPrefix}{GetTypeTag(dictKey)},{GetTypeTag(dictValue)}";

        if (TryGetGenericCollectionElement(type) is Type collectionElement)
            return $"{ReadOnlyListPrefix}{GetTypeTag(collectionElement)}";

        if (type.IsEnum)
            return $"{EnumPrefix}{GetExternalTypeSpec(type)}";

        if (type.IsValueType && !type.IsPrimitive)
            return $"{StructPrefix}{GetExternalTypeSpec(type)}";

        // Application-defined item models (outside NE.Standard.UI.*) travel as wire item dictionaries on the client.
        if (!type.IsPrimitive && type != typeof(string))
            return "item";

        throw new InvalidOperationException($"Type '{type.FullName}' is not registered for compiled view wire serialization.");
    }

    private static string GetExternalTypeSpec(Type type)
    {
        var spec = type.FullName is string fullName && type.Assembly.GetName().Name is string assemblyName
            ? $"{fullName}, {assemblyName}"
            : type.Name;

        return spec.Replace(',', '|');
    }

    private static void WriteRegions(Utf8JsonWriter writer, CompiledRegion[] regions)
    {
        writer.WriteStartArray();

        for (var i = 0; i < regions.Length; i++)
        {
            CompiledRegion region = regions[i];
            writer.WriteStartObject();
            writer.WriteString("key", region.Key);
            writer.WriteNumber("rootComponentId", region.RootComponentId.Value);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteDialogs(Utf8JsonWriter writer, CompiledDialog[] dialogs)
    {
        writer.WriteStartArray();

        for (var i = 0; i < dialogs.Length; i++)
        {
            CompiledDialog dialog = dialogs[i];
            writer.WriteStartObject();
            writer.WriteString("key", dialog.Key);
            writer.WriteNumber("rootComponentId", dialog.RootComponentId.Value);

            if (dialog.Surface != UISurfaceStyle.Surface)
                writer.WriteString("surface", dialog.Surface.ToString());

            if (dialog.Placement != UIDialogPlacement.Center)
                writer.WriteString("placement", dialog.Placement.ToString());

            if (dialog.Width is { } width)
            {
                writer.WritePropertyName("width");
                JsonSerializer.Serialize(writer, width, ValueJsonOptions);
            }

            if (dialog.MinWidth is { } minWidth)
            {
                writer.WritePropertyName("minWidth");
                JsonSerializer.Serialize(writer, minWidth, ValueJsonOptions);
            }

            if (dialog.MaxWidth is { } maxWidth)
            {
                writer.WritePropertyName("maxWidth");
                JsonSerializer.Serialize(writer, maxWidth, ValueJsonOptions);
            }

            if (dialog.Height is { } height)
            {
                writer.WritePropertyName("height");
                JsonSerializer.Serialize(writer, height, ValueJsonOptions);
            }

            if (dialog.MinHeight is { } minHeight)
            {
                writer.WritePropertyName("minHeight");
                JsonSerializer.Serialize(writer, minHeight, ValueJsonOptions);
            }

            if (dialog.MaxHeight is { } maxHeight)
            {
                writer.WritePropertyName("maxHeight");
                JsonSerializer.Serialize(writer, maxHeight, ValueJsonOptions);
            }

            if (dialog.HorizontalAlignment is { } horizontalAlignment)
                writer.WriteString("horizontalAlignment", horizontalAlignment.ToString());

            if (dialog.VerticalAlignment is { } verticalAlignment)
                writer.WriteString("verticalAlignment", verticalAlignment.ToString());

            if (dialog.Margin is { } margin)
            {
                writer.WritePropertyName("margin");
                JsonSerializer.Serialize(writer, margin, ValueJsonOptions);
            }

            if (!dialog.Modal)
                writer.WriteBoolean("modal", false);

            if (dialog.AccessibleName is not null)
            {
                writer.WritePropertyName("accessibleName");
                JsonSerializer.Serialize(writer, dialog.AccessibleName, ValueJsonOptions);
            }

            if (dialog.TitleComponentId is UIComponentId titleId)
                writer.WriteNumber("titleComponentId", titleId.Value);

            writer.WriteBoolean("closeOnEscape", dialog.CloseOnEscape);
            writer.WriteBoolean("closeOnBackdrop", dialog.CloseOnBackdrop);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteGraph(Utf8JsonWriter writer, UIComponentGraph graph)
    {
        writer.WriteStartArray();

        foreach (UIComponentNode node in graph.All)
        {
            writer.WriteStartObject();
            writer.WriteNumber("componentId", node.ComponentId.Value);
            writer.WriteNumber("contextId", node.ContextId.Value);
            writer.WriteString("authoringId", node.AuthoringId);
            if (node.HasAuthoredId)
                writer.WriteBoolean("hasAuthoredId", true);
            writer.WriteString("typeKey", node.TypeKey);

            if (node.ParentId is UIComponentId parentId)
                writer.WriteNumber("parentId", parentId.Value);
            if (node.ContextParameterCount != 0)
                writer.WriteNumber("contextParameterCount", node.ContextParameterCount);
            if (node.DefinesContextParameter)
                writer.WriteBoolean("definesContextParameter", true);
            if (node.IsContentTree)
                writer.WriteBoolean("isContentTree", true);

            if (node.Children.Length > 0)
            {
                writer.WritePropertyName("children");
                writer.WriteStartArray();
                for (var i = 0; i < node.Children.Length; i++)
                    writer.WriteNumberValue(node.Children[i].Value);
                writer.WriteEndArray();
            }

            if (node.Slots.Length > 0)
            {
                writer.WritePropertyName("slots");
                writer.WriteStartArray();
                for (var i = 0; i < node.Slots.Length; i++)
                {
                    UIComponentSlot slot = node.Slots[i];
                    writer.WriteStartObject();
                    writer.WriteString("kind", slot.Kind.ToString());
                    writer.WriteNumber("rootComponentId", slot.RootComponentId.Value);
                    if (slot.Key is not null)
                        writer.WriteString("key", slot.Key);
                    if (slot.KeyProperty is not null)
                        writer.WriteString("keyProperty", slot.KeyProperty);
                    writer.WriteEndObject();
                }

                writer.WriteEndArray();
            }

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteStates(Utf8JsonWriter writer, UIComponentStateIndex stateIndex, UIItemProjectionIndex itemProjections)
    {
        List<LayoutWireEntry> layouts = BuildLayoutEntries(stateIndex.All, out Dictionary<UIComponentStateLayout, int> layoutIndices);

        writer.WriteStartObject();
        writer.WritePropertyName("layouts");
        writer.WriteStartArray();
        for (var i = 0; i < layouts.Count; i++)
            WriteLayoutEntry(writer, layouts[i]);
        writer.WriteEndArray();

        writer.WritePropertyName("components");
        writer.WriteStartArray();
        foreach (UIComponentState state in stateIndex.All)
        {
            var layoutIndex = layoutIndices[state.Layout];
            WriteStateEntry(writer, state, layoutIndex, layouts[layoutIndex].Defaults, itemProjections);
        }

        writer.WriteEndArray();
        writer.WriteEndObject();
    }

    private static List<LayoutWireEntry> BuildLayoutEntries(IReadOnlyList<UIComponentState> states, out Dictionary<UIComponentStateLayout, int> layoutIndices)
    {
        layoutIndices = [with(ReferenceEqualityComparer.Instance)];
        List<LayoutWireEntry> layouts = [];

        foreach (UIComponentState state in states)
        {
            if (layoutIndices.ContainsKey(state.Layout))
                continue;

            var count = state.Layout.Count;
            CompiledUIPropertyValue[] defaults = new CompiledUIPropertyValue[count];
            for (var slot = 0; slot < count; slot++)
            {
                CompiledUIPropertyValue candidate = state.All[slot];
                defaults[slot] = candidate.IsBind || IsServerOnlyProperty(candidate.Property) || IsItemsSlotProperty(candidate.Property)
                    ? CreateEmptySlotValue(candidate)
                    : candidate;
            }

            layoutIndices[state.Layout] = layouts.Count;
            layouts.Add(new LayoutWireEntry(state.Layout, defaults));
        }

        return layouts;
    }

    private static bool IsServerOnlyProperty(UIProperty property)
        => property == IClientWriteCheckComponent.ClientWriteCheckProperty;

    private static bool IsItemsSlotProperty(UIProperty property)
        => property == IItemsComponent.ItemsProperty;

    private static CompiledUIPropertyValue CreateEmptySlotValue(CompiledUIPropertyValue source)
        => new()
        {
            Property = source.Property,
            IsTranslatable = source.IsTranslatable,
            IsContent = false,
            IsBind = false,
            Value = null,
        };

    private static void WriteLayoutEntry(Utf8JsonWriter writer, LayoutWireEntry entry)
    {
        writer.WriteStartObject();
        writer.WritePropertyName("slots");
        writer.WriteStartArray();

        for (var i = 0; i < entry.Defaults.Length; i++)
        {
            CompiledUIPropertyValue slot = entry.Defaults[i];
            writer.WriteStartObject();
            writer.WriteString("p", slot.Property.Name);
            if (slot.IsTranslatable)
                writer.WriteBoolean("tr", true);
            if (slot.IsContent)
                writer.WriteBoolean("ct", true);
            if (slot.Value is not null)
            {
                writer.WritePropertyName("v");
                WriteTypedValue(writer, slot.Value);
            }

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
        writer.WriteEndObject();
    }

    private static void WriteStateEntry(Utf8JsonWriter writer, UIComponentState state, int layoutIndex, CompiledUIPropertyValue[] defaults, UIItemProjectionIndex itemProjections)
    {
        writer.WriteStartObject();
        writer.WriteNumber("id", state.ComponentId.Value);
        writer.WriteNumber("l", layoutIndex);
        writer.WritePropertyName("o");
        writer.WriteStartArray();

        IReadOnlyList<CompiledUIPropertyValue> values = state.All;
        for (var slot = 0; slot < values.Count; slot++)
        {
            CompiledUIPropertyValue current = values[slot];
            if (IsServerOnlyProperty(current.Property) && !current.IsBind && current.Value is not null)
                current = CreateEmptySlotValue(current);

            if (SameSlotValue(current, defaults[slot]))
                continue;

            writer.WriteStartObject();
            writer.WriteNumber("s", slot);
            if (current.IsTranslatable != defaults[slot].IsTranslatable)
                writer.WriteBoolean("tr", current.IsTranslatable);
            if (current.IsContent)
                writer.WriteBoolean("ct", true);
            if (current.IsBind && current.BindingId is UIBindingId bindingId)
            {
                writer.WriteNumber("b", bindingId.Value);
            }
            else
            {
                writer.WritePropertyName("v");
                UIItemProjection? projection = IsItemsSlotProperty(current.Property) ? itemProjections.For(state.ComponentId) : null;
                WriteTypedValue(writer, current.Value, projection);
            }

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
        writer.WriteEndObject();
    }

    private static bool SameSlotValue(CompiledUIPropertyValue left, CompiledUIPropertyValue right)
        => ReferenceEquals(left, right)
            || (left.IsBind == right.IsBind
                && Nullable.Equals(left.BindingId, right.BindingId)
                && left.IsContent == right.IsContent
                && left.IsTranslatable == right.IsTranslatable
                && WireValuesEqual(left.Value, right.Value));

    private static bool WireValuesEqual(object? left, object? right)
    {
        if (Equals(left, right))
            return true;

        if (left is null || right is null)
            return false;

        return TryGetEmptySequenceTag(left, out var leftTag)
            && TryGetEmptySequenceTag(right, out var rightTag)
            && string.Equals(leftTag, rightTag, StringComparison.Ordinal);
    }

    private static bool TryGetEmptySequenceTag(object value, out string tag)
    {
        tag = string.Empty;
        if (value is not ICollection { Count: 0 } or IDictionary)
            return false;

        Type runtimeType = value.GetType();
        if (runtimeType.IsArray)
        {
            tag = $"{ArrayPrefix}{GetTypeTag(runtimeType.GetElementType()!)}";
            return true;
        }

        if (runtimeType.IsGenericType && runtimeType.GetGenericTypeDefinition() == typeof(RecursiveCollection<>))
        {
            tag = $"{RecursiveCollectionPrefix}{GetTypeTag(runtimeType.GetGenericArguments()[0])}";
            return true;
        }

        if (!IsCustomStructuredValue(runtimeType) && TryGetGenericCollectionElement(runtimeType) is Type elementType)
        {
            tag = $"{ArrayPrefix}{GetTypeTag(elementType)}";
            return true;
        }

        return false;
    }

    private static void WriteSources(Utf8JsonWriter writer, UICompiledBindingSourceIndex sources)
    {
        writer.WriteStartArray();

        foreach (CompiledUIBindingSource source in sources.All)
        {
            writer.WriteStartObject();
            writer.WriteNumber("id", source.Id.Value);
            writer.WriteString("kind", source.Kind.ToString());
            if (source.ComponentId is UIComponentId componentId)
                writer.WriteNumber("componentId", componentId.Value);
            if (source.ItemsProperty is not null)
                writer.WriteString("itemsProperty", source.ItemsProperty);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteTemplates(Utf8JsonWriter writer, UICompiledBindingTemplateIndex templates)
    {
        writer.WriteStartArray();

        foreach (CompiledUIBindingTemplate template in templates.All)
        {
            writer.WriteStartObject();
            writer.WriteNumber("id", template.Id.Value);
            writer.WriteNumber("sourceId", template.SourceId.Value);
            writer.WriteString("template", template.Template);
            if (template.ParameterCount != 0)
                writer.WriteNumber("parameterCount", template.ParameterCount);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteContexts(Utf8JsonWriter writer, UIComponentContextIndex contexts)
    {
        writer.WriteStartArray();

        foreach (CompiledUIContext context in contexts.All)
        {
            writer.WriteStartObject();
            writer.WriteNumber("id", context.Id.Value);
            writer.WriteNumber("templateId", context.TemplateId.Value);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteBindings(Utf8JsonWriter writer, UICompiledBindingIndex bindings)
    {
        writer.WriteStartArray();

        foreach (CompiledUIBinding binding in bindings.All)
        {
            writer.WriteStartObject();
            writer.WriteNumber("id", binding.Id.Value);
            writer.WriteString("kind", binding.Kind.ToString());
            writer.WriteNumber("componentId", binding.Address.Component.Id.Value);
            writer.WriteString("property", binding.Address.Property.Name);
            writer.WriteNumber("sourceId", binding.SourceId.Value);
            writer.WriteNumber("templateId", binding.TemplateId.Value);
            writer.WriteString("mode", binding.Mode.ToString());

            if (binding.Optional)
                writer.WriteBoolean("optional", true);
            if (binding.IsTranslatable)
                writer.WriteBoolean("isTranslatable", true);

            if (binding.Parameters.Length > 0)
            {
                writer.WritePropertyName("parameters");
                WriteBindingParameters(writer, binding.Parameters);
            }

            if (binding.DynamicParameterComponentIds.Length > 0)
            {
                writer.WritePropertyName("dynamicParameterComponentIds");
                WriteComponentIdArray(writer, binding.DynamicParameterComponentIds);
            }

            if (binding.TargetValueType is not null)
            {
                writer.WritePropertyName("targetValueType");
                WriteTypedValue(writer, binding.TargetValueType);
            }

            if (binding.TargetFallbackValue is not null)
            {
                writer.WritePropertyName("targetFallbackValue");
                WriteTypedValue(writer, binding.TargetFallbackValue);
            }

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteBindingParameters(Utf8JsonWriter writer, CompiledUIBindingParameter[] parameters)
    {
        writer.WriteStartArray();

        for (var i = 0; i < parameters.Length; i++)
        {
            CompiledUIBindingParameter parameter = parameters[i];
            writer.WriteStartObject();
            writer.WriteString("kind", parameter.Kind.ToString());
            if (parameter.ComponentId is UIComponentId componentId)
                writer.WriteNumber("componentId", componentId.Value);
            if (parameter.Value is not null)
            {
                writer.WritePropertyName("value");
                WriteTypedValue(writer, parameter.Value);
            }

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteComponentIdArray(Utf8JsonWriter writer, UIComponentId[] ids)
    {
        writer.WriteStartArray();
        for (var i = 0; i < ids.Length; i++)
            writer.WriteNumberValue(ids[i].Value);
        writer.WriteEndArray();
    }

    private static void WriteInteractions(Utf8JsonWriter writer, UIInteractionIndex interactions)
    {
        writer.WriteStartObject();
        writer.WritePropertyName("all");
        writer.WriteStartArray();

        foreach (CompiledUIInteraction interaction in interactions.All)
        {
            writer.WriteStartObject();
            writer.WriteString("sourceKind", interaction.SourceKind.ToString());
            writer.WriteString("actionKind", interaction.ActionKind.ToString());
            writer.WriteString("operator", interaction.Operator.ToString());

            if (interaction.Source is UIPropertyAddress sourceAddr)
            {
                writer.WriteNumber("sourceComponentId", sourceAddr.Component.Id.Value);
                writer.WriteString("sourceProperty", sourceAddr.Property.Name);
            }

            if (interaction.SourceEvent is CompiledUIEventAddress sourceEvent)
            {
                writer.WriteNumber("sourceEventComponentId", sourceEvent.ComponentId.Value);
                writer.WriteString("sourceEventName", sourceEvent.EventName);
            }

            if (interaction.Target is UIPropertyAddress targetAddr)
            {
                writer.WriteNumber("targetComponentId", targetAddr.Component.Id.Value);
                writer.WriteString("targetProperty", targetAddr.Property.Name);
            }

            if (interaction.Effect is not null)
            {
                writer.WritePropertyName("effect");
                JsonSerializer.Serialize(writer, interaction.Effect, ValueJsonOptions);
            }

            if (interaction.Value is not null)
            {
                writer.WritePropertyName("value");
                WriteTypedValue(writer, interaction.Value);
            }

            if (interaction.TrueValue is not null)
            {
                writer.WritePropertyName("trueValue");
                WriteTypedValue(writer, interaction.TrueValue);
            }

            if (interaction.FalseValue is not null)
            {
                writer.WritePropertyName("falseValue");
                WriteTypedValue(writer, interaction.FalseValue);
            }

            if (interaction.RowKey is not null)
                writer.WriteString("rowKey", interaction.RowKey);

            writer.WriteEndObject();
        }

        writer.WriteEndArray();

        if (interactions.FirstPaint.Count > 0)
        {
            writer.WritePropertyName("firstPaint");
            writer.WriteStartArray();
            foreach (KeyValuePair<UIPropertyAddress, object?> entry in interactions.FirstPaint.OrderBy(static e => e.Key.Component.Id.Value).ThenBy(static e => e.Key.Property.Name, StringComparer.Ordinal))
            {
                writer.WriteStartObject();
                writer.WriteNumber("componentId", entry.Key.Component.Id.Value);
                writer.WriteString("property", entry.Key.Property.Name);
                writer.WritePropertyName("value");
                WriteTypedValue(writer, entry.Value);
                writer.WriteEndObject();
            }

            writer.WriteEndArray();
        }

        writer.WriteEndObject();
    }

    private static void WriteEvents(Utf8JsonWriter writer, UIEventIndex events)
    {
        writer.WriteStartArray();

        foreach (CompiledUIEvent compiledEvent in events.All)
        {
            writer.WriteStartObject();
            writer.WriteNumber("id", compiledEvent.Id.Value);
            writer.WriteNumber("componentId", compiledEvent.Address.ComponentId.Value);
            writer.WriteString("eventName", compiledEvent.Address.EventName);
            writer.WriteString("command", compiledEvent.Command);
            if (compiledEvent.SubmitsForm)
                writer.WriteBoolean("submitsForm", true);
            if (!compiledEvent.ShowsPending)
                writer.WriteBoolean("showsPending", false);

            if (compiledEvent.Arguments.Length > 0)
            {
                writer.WritePropertyName("arguments");
                writer.WriteStartArray();
                for (var i = 0; i < compiledEvent.Arguments.Length; i++)
                {
                    CompiledUIActionArgument argument = compiledEvent.Arguments[i];
                    writer.WriteStartObject();
                    writer.WriteString("name", argument.Name);
                    writer.WriteString("kind", argument.Kind.ToString());
                    if (argument.Value is not null)
                    {
                        writer.WritePropertyName("value");
                        WriteTypedValue(writer, argument.Value);
                    }

                    if (argument.SourceId is UIBindingSourceId sourceId)
                        writer.WriteNumber("sourceId", sourceId.Value);
                    if (argument.TemplateId is UIBindingTemplateId templateId)
                        writer.WriteNumber("templateId", templateId.Value);

                    if (argument.Parameters.Length > 0)
                    {
                        writer.WritePropertyName("parameters");
                        WriteBindingParameters(writer, argument.Parameters);
                    }

                    if (argument.DynamicParameterComponentIds.Length > 0)
                    {
                        writer.WritePropertyName("dynamicParameterComponentIds");
                        WriteComponentIdArray(writer, argument.DynamicParameterComponentIds);
                    }

                    writer.WriteEndObject();
                }

                writer.WriteEndArray();
            }

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteValidations(Utf8JsonWriter writer, UIValidationIndex validations)
    {
        writer.WriteStartArray();

        foreach (CompiledUIValidationRule rule in validations.All)
        {
            writer.WriteStartObject();
            writer.WriteNumber("componentId", rule.Target.Component.Id.Value);
            writer.WriteString("property", rule.Target.Property.Name);
            writer.WriteString("trigger", rule.Trigger.ToString());
            writer.WriteString("operator", rule.Operator.ToString());
            writer.WriteString("severity", rule.Severity.ToString());
            writer.WritePropertyName("message");
            JsonSerializer.Serialize(writer, rule.Message, ValueJsonOptions);

            if (rule.Value is not null)
            {
                writer.WritePropertyName("value");
                WriteTypedValue(writer, rule.Value);
            }

            if (rule.ValueSource is UIPropertyAddress valueSource)
            {
                writer.WriteNumber("valueSourceComponentId", valueSource.Component.Id.Value);
                writer.WriteString("valueSourceProperty", valueSource.Property.Name);
            }

            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteValidationMessageTargets(Utf8JsonWriter writer, IReadOnlyDictionary<UIComponentId, UIPropertyAddress> messageTargets)
    {
        writer.WriteStartArray();

        foreach (KeyValuePair<UIComponentId, UIPropertyAddress> entry in messageTargets.OrderBy(static pair => pair.Key.Value))
        {
            writer.WriteStartObject();
            writer.WriteNumber("sourceComponentId", entry.Key.Value);
            writer.WriteNumber("targetComponentId", entry.Value.Component.Id.Value);
            writer.WriteString("targetProperty", entry.Value.Property.Name);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    private static void WriteItemProjections(Utf8JsonWriter writer, UIItemProjectionIndex itemProjections)
    {
        writer.WriteStartObject();

        writer.WritePropertyName("projections");
        writer.WriteStartArray();
        foreach (KeyValuePair<UIComponentId, UIItemProjection> entry in itemProjections.Projections.OrderBy(static e => e.Key.Value))
        {
            writer.WriteStartObject();
            writer.WriteNumber("host", entry.Key.Value);
            writer.WritePropertyName("projection");
            WriteItemProjection(writer, entry.Value);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();

        if (itemProjections.RuleReads.Count > 0)
        {
            writer.WritePropertyName("ruleReads");
            writer.WriteStartArray();
            foreach (KeyValuePair<UIComponentId, string[]> entry in itemProjections.RuleReads.OrderBy(static e => e.Key.Value))
            {
                writer.WriteStartObject();
                writer.WriteNumber("host", entry.Key.Value);
                writer.WritePropertyName("paths");
                JsonSerializer.Serialize(writer, entry.Value, ValueJsonOptions);
                writer.WriteEndObject();
            }

            writer.WriteEndArray();
        }

        if (itemProjections.BoundRules.Count > 0)
        {
            writer.WritePropertyName("boundRules");
            writer.WriteStartArray();
            foreach (UIComponentId host in itemProjections.BoundRules.OrderBy(static id => id.Value))
                writer.WriteNumberValue(host.Value);
            writer.WriteEndArray();
        }

        writer.WriteEndObject();
    }

    private static void WriteItemProjection(Utf8JsonWriter writer, UIItemProjection projection)
    {
        writer.WriteStartObject();
        writer.WriteBoolean("isWhole", projection.IsWhole);

        if (!projection.IsWhole)
        {
            writer.WritePropertyName("members");
            writer.WriteStartArray();
            foreach (UIItemProjectionMember member in projection.Members.OrderBy(static m => m.Name, StringComparer.Ordinal))
            {
                writer.WriteStartObject();
                writer.WriteString("name", member.Name);
                if (member.Inner is not null)
                {
                    writer.WritePropertyName("inner");
                    WriteItemProjection(writer, member.Inner);
                }

                if (member.HasFallback)
                {
                    writer.WriteBoolean("hasFallback", true);
                    writer.WritePropertyName("fallback");
                    WriteTypedValue(writer, member.Fallback);
                }

                writer.WriteEndObject();
            }

            writer.WriteEndArray();
        }

        writer.WriteEndObject();
    }

    private static void WriteWarnings(Utf8JsonWriter writer, IReadOnlyList<UICompileWarning> warnings)
    {
        writer.WriteStartArray();

        for (var i = 0; i < warnings.Count; i++)
        {
            UICompileWarning warning = warnings[i];
            writer.WriteStartObject();
            writer.WriteString("kind", warning.Kind.ToString());
            writer.WriteString("message", warning.Message);
            writer.WriteEndObject();
        }

        writer.WriteEndArray();
    }

    /// <summary>
    /// Deserializes a <see cref="CompiledView"/> from UTF-8 JSON bytes.
    /// </summary>
    public static CompiledView Deserialize(ReadOnlySpan<byte> utf8Json)
    {
        using JsonDocument document = JsonDocument.Parse(utf8Json.ToArray());
        return Read(document.RootElement);
    }

    /// <summary>
    /// Reads a <see cref="CompiledView"/> from a <see cref="Utf8JsonReader"/>.
    /// </summary>
    public static CompiledView Read(ref Utf8JsonReader reader)
    {
        using JsonDocument document = JsonDocument.ParseValue(ref reader);
        return Read(document.RootElement);
    }

    /// <summary>
    /// Reads a <see cref="CompiledView"/> from a <see cref="JsonElement"/>.
    /// </summary>
    public static CompiledView Read(JsonElement root)
    {
        if (root.ValueKind != JsonValueKind.Object)
            throw new JsonException("CompiledView wire payload must be a JSON object.");

        var title = root.GetProperty("title").GetString() ?? string.Empty;
        var fingerprint = root.GetProperty("fingerprint").GetString() ?? string.Empty;
        IReadOnlyDictionary<string, object?>? titleArguments = root.TryGetProperty("titleArguments", out JsonElement titleArgsElement)
            ? ReadTitleArguments(titleArgsElement)
            : null;
        UIViewOptions options = root.TryGetProperty("options", out JsonElement optionsElement)
            ? optionsElement.Deserialize<UIViewOptions>(ValueJsonOptions) ?? UIViewOptions.Default
            : UIViewOptions.Default;
        CompiledRegion[] regions = ReadRegions(root.GetProperty("regions"));
        CompiledDialog[] dialogs = ReadDialogs(root.GetProperty("dialogs"));
        UIComponentGraph graph = ReadGraph(root.GetProperty("graph"));
        UIComponentStateIndex state = ReadStates(root.GetProperty("state"));
        UICompiledBindingSourceIndex sources = ReadSources(root.GetProperty("sources"));
        UICompiledBindingTemplateIndex templates = ReadTemplates(root.GetProperty("templates"));
        UIComponentContextIndex contexts = root.TryGetProperty("contexts", out JsonElement contextsElement)
            ? ReadContexts(contextsElement)
            : new UIComponentContextIndex([]);
        UICompiledBindingIndex bindings = ReadBindings(root.GetProperty("bindings"), sources, templates);
        UIInteractionIndex interactions = ReadInteractions(root.GetProperty("interactions"));
        UIEventIndex events = ReadEvents(root.GetProperty("events"), sources, templates, graph);
        KeyValuePair<UIComponentId, UIPropertyAddress>[]? validationMessageTargets = root.TryGetProperty("validationMessageTargets", out JsonElement messageTargetsElement)
            ? ReadValidationMessageTargets(messageTargetsElement)
            : null;
        UIValidationIndex validations = ReadValidations(root.GetProperty("validations"), validationMessageTargets);
        UIItemProjectionIndex itemProjections = root.TryGetProperty("itemProjections", out JsonElement projectionsElement)
            ? ReadItemProjections(projectionsElement)
            : UIItemProjectionIndex.Empty;
        IReadOnlyList<UICompileWarning> warnings = root.TryGetProperty("warnings", out JsonElement warningsElement)
            ? ReadWarnings(warningsElement)
            : [];

        return new CompiledView
        {
            Title = title,
            TitleArguments = titleArguments,
            Options = options,
            Regions = regions,
            Dialogs = dialogs,
            Graph = graph,
            State = state,
            Sources = sources,
            Templates = templates,
            Contexts = contexts,
            Bindings = bindings,
            Interactions = interactions,
            Events = events,
            Validations = validations,
            ItemProjections = itemProjections,
            Warnings = warnings,
            Fingerprint = fingerprint,
        };
    }

    private static Dictionary<string, object?> ReadTitleArguments(JsonElement element)
    {
        Dictionary<string, object?> result = [with(StringComparer.Ordinal)];

        foreach (JsonProperty property in element.EnumerateObject())
            result[property.Name] = ReadTypedValue(property.Value);

        return result;
    }

    private static object? ReadTypedValue(JsonElement element)
    {
        switch (element.ValueKind)
        {
            case JsonValueKind.Null:
            case JsonValueKind.Undefined:
                return null;
            case JsonValueKind.True:
                return true;
            case JsonValueKind.False:
                return false;
            case JsonValueKind.String:
                return element.GetString();
            case JsonValueKind.Number:
                if (element.TryGetInt32(out var intValue))
                    return intValue;
                if (element.TryGetInt64(out var longValue))
                    return longValue;
                return element.GetDouble();
            case JsonValueKind.Object:
                var tag = element.GetProperty(TypeTagProperty).GetString()
                    ?? throw new JsonException("Typed value envelope is missing its type tag.");
                JsonElement valueElement = element.GetProperty(ValueProperty);

                if (string.Equals(tag, "type", StringComparison.Ordinal))
                    return ResolveTypeTag(valueElement.GetString() ?? throw new JsonException("Type value is null."));

                if (string.Equals(tag, "item", StringComparison.Ordinal))
                    return ObjectToInferredTypesConverter.ToInferredValue(valueElement);

                if (tag.StartsWith(ArrayPrefix, StringComparison.Ordinal))
                    return ReadTypedArray(ResolveTypeTag(tag[ArrayPrefix.Length..]), valueElement);

                if (tag.StartsWith(RecursiveCollectionPrefix, StringComparison.Ordinal))
                    return ReadRecursiveCollection(ResolveTypeTag(tag[RecursiveCollectionPrefix.Length..]), valueElement);

                Type targetType = ResolveTypeTag(tag);
                if (targetType == typeof(IReadOnlyDictionary<string, object?>))
                    return ObjectToInferredTypesConverter.ToInferredValue(valueElement);

                if (valueElement.ValueKind == JsonValueKind.Null)
                    return targetType.IsValueType && Nullable.GetUnderlyingType(targetType) is null ? Activator.CreateInstance(targetType) : null;

                return valueElement.Deserialize(targetType, ValueJsonOptions);
            case JsonValueKind.Array:
            default:
                throw new JsonException($"Unsupported JSON token '{element.ValueKind}' in compiled view value.");
        }
    }

    private static Array ReadTypedArray(Type elementType, JsonElement arrayElement)
    {
        var length = arrayElement.GetArrayLength();
        Array array = Array.CreateInstance(elementType, length);
        var index = 0;

        foreach (JsonElement item in arrayElement.EnumerateArray())
        {
            var value = ReadTypedValue(item);
            if (value is not null && !elementType.IsInstanceOfType(value) && RecursiveValueCoercion.TryCoerce(value, elementType, out var coerced))
                value = coerced;

            array.SetValue(value, index++);
        }

        return array;
    }

    private static object ReadRecursiveCollection(Type elementType, JsonElement arrayElement)
    {
        Type collectionType = typeof(RecursiveCollection<>).MakeGenericType(elementType);
        IList collection = (IList)Activator.CreateInstance(collectionType)!;

        foreach (JsonElement item in arrayElement.EnumerateArray())
        {
            var value = ReadTypedValue(item);
            if (value is not null && !elementType.IsInstanceOfType(value) && RecursiveValueCoercion.TryCoerce(value, elementType, out var coerced))
                value = coerced;

            _ = collection.Add(value);
        }

        return collection;
    }

    private static Type ResolveTypeTag(string tag)
    {
        if (TagToType.TryGetValue(tag, out Type? found))
            return found;

        if (tag.StartsWith(NullablePrefix, StringComparison.Ordinal))
        {
            Type inner = ResolveTypeTag(tag[NullablePrefix.Length..]);
            return inner.IsValueType ? typeof(Nullable<>).MakeGenericType(inner) : inner;
        }

        if (tag.StartsWith(ArrayPrefix, StringComparison.Ordinal))
            return ResolveTypeTag(tag[ArrayPrefix.Length..]).MakeArrayType();

        if (tag.StartsWith(ResponsivePrefix, StringComparison.Ordinal))
            return typeof(UIResponsive<>).MakeGenericType(ResolveTypeTag(tag[ResponsivePrefix.Length..]));

        if (tag.StartsWith(RecursiveCollectionPrefix, StringComparison.Ordinal))
            return typeof(RecursiveCollection<>).MakeGenericType(ResolveTypeTag(tag[RecursiveCollectionPrefix.Length..]));

        if (tag.StartsWith(ReadOnlyListPrefix, StringComparison.Ordinal))
            return typeof(IReadOnlyList<>).MakeGenericType(ResolveTypeTag(tag[ReadOnlyListPrefix.Length..]));

        if (tag.StartsWith(ReadOnlyDictionaryPrefix, StringComparison.Ordinal))
        {
            SplitDictionaryTagArguments(tag.AsSpan(ReadOnlyDictionaryPrefix.Length), out ReadOnlySpan<char> keySpan, out ReadOnlySpan<char> valSpan);
            Type keyType = ResolveTypeTag(keySpan.ToString());
            Type valType = ResolveTypeTag(valSpan.ToString());
            return typeof(IReadOnlyDictionary<,>).MakeGenericType(keyType, valType);
        }

        if (tag.StartsWith(EnumPrefix, StringComparison.Ordinal))
            return TryResolveExternalType(tag[EnumPrefix.Length..]) is { IsEnum: true } enumType ? enumType : typeof(string);

        if (tag.StartsWith(StructPrefix, StringComparison.Ordinal))
            return TryResolveExternalType(tag[StructPrefix.Length..]) is { IsValueType: true } structType ? structType : typeof(IReadOnlyDictionary<string, object?>);

        EnsureLoadedAssembliesScanned();
        if (TagToType.TryGetValue(tag, out found))
            return found;

        throw new JsonException($"Unrecognized compiled view type tag '{tag}'.");
    }

    private static void SplitDictionaryTagArguments(ReadOnlySpan<char> body, out ReadOnlySpan<char> keyTag, out ReadOnlySpan<char> valueTag)
    {
        var needed = 1;
        var cursor = 0;

        while (cursor < body.Length)
        {
            while (TryAdvanceTagPrefix(body, ref cursor, out var extraOperand))
            {
                if (extraOperand)
                    needed++;
            }

            var comma = body[cursor..].IndexOf(',');
            if (comma < 0)
                break;

            cursor += comma;
            needed--;

            if (needed == 0)
            {
                keyTag = body[..cursor];
                valueTag = body[(cursor + 1)..];
                return;
            }

            cursor++;
        }

        throw new JsonException($"Malformed dictionary type tag 'ro_dict:{body}'.");
    }

    private static bool TryAdvanceTagPrefix(ReadOnlySpan<char> body, ref int cursor, out bool extraOperand)
    {
        extraOperand = false;
        ReadOnlySpan<char> slice = body[cursor..];

        if (slice.StartsWith(ReadOnlyDictionaryPrefix, StringComparison.Ordinal))
        {
            cursor += ReadOnlyDictionaryPrefix.Length;
            extraOperand = true;
            return true;
        }

        if (slice.StartsWith(NullablePrefix, StringComparison.Ordinal))
        {
            cursor += NullablePrefix.Length;
            return true;
        }

        if (slice.StartsWith(ArrayPrefix, StringComparison.Ordinal))
        {
            cursor += ArrayPrefix.Length;
            return true;
        }

        if (slice.StartsWith(ResponsivePrefix, StringComparison.Ordinal))
        {
            cursor += ResponsivePrefix.Length;
            return true;
        }

        if (slice.StartsWith(RecursiveCollectionPrefix, StringComparison.Ordinal))
        {
            cursor += RecursiveCollectionPrefix.Length;
            return true;
        }

        if (slice.StartsWith(ReadOnlyListPrefix, StringComparison.Ordinal))
        {
            cursor += ReadOnlyListPrefix.Length;
            return true;
        }

        return false;
    }

    private static Type? TryResolveExternalType(string encodedSpec)
    {
        var spec = encodedSpec.Replace('|', ',');
        if (Type.GetType(spec, throwOnError: false) is Type direct)
            return direct;

        var comma = spec.IndexOf(',', StringComparison.Ordinal);
        var fullName = (comma >= 0 ? spec[..comma] : spec).Trim();

        foreach (Assembly assembly in AppDomain.CurrentDomain.GetAssemblies())
        {
            if (!assembly.IsDynamic && assembly.GetType(fullName, throwOnError: false) is Type loaded)
                return loaded;
        }

        return null;
    }

    private static CompiledRegion[] ReadRegions(JsonElement element)
    {
        CompiledRegion[] regions = new CompiledRegion[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
        {
            regions[index++] = new CompiledRegion
            {
                Key = item.GetProperty("key").GetString()!,
                RootComponentId = new UIComponentId(item.GetProperty("rootComponentId").GetInt32()),
            };
        }

        return regions;
    }

    private static CompiledDialog[] ReadDialogs(JsonElement element)
    {
        CompiledDialog[] dialogs = new CompiledDialog[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
        {
            UIComponentId? titleId = item.TryGetProperty("titleComponentId", out JsonElement titleElement)
                ? new UIComponentId(titleElement.GetInt32())
                : null;

            dialogs[index++] = new CompiledDialog
            {
                Key = item.GetProperty("key").GetString()!,
                RootComponentId = new UIComponentId(item.GetProperty("rootComponentId").GetInt32()),
                Surface = item.TryGetProperty("surface", out JsonElement surfaceEl) ? Enum.Parse<UISurfaceStyle>(surfaceEl.GetString()!) : UISurfaceStyle.Surface,
                Placement = item.TryGetProperty("placement", out JsonElement placementEl) ? Enum.Parse<UIDialogPlacement>(placementEl.GetString()!) : UIDialogPlacement.Center,
                Width = item.TryGetProperty("width", out JsonElement widthEl) ? widthEl.Deserialize<UIResponsive<UILayoutLength>>(ValueJsonOptions) : null,
                MinWidth = item.TryGetProperty("minWidth", out JsonElement minWidthEl) ? minWidthEl.Deserialize<UIResponsive<UILayoutLength>>(ValueJsonOptions) : null,
                MaxWidth = item.TryGetProperty("maxWidth", out JsonElement maxWidthEl) ? maxWidthEl.Deserialize<UIResponsive<UILayoutLength>>(ValueJsonOptions) : null,
                Height = item.TryGetProperty("height", out JsonElement heightEl) ? heightEl.Deserialize<UIResponsive<UILayoutLength>>(ValueJsonOptions) : null,
                MinHeight = item.TryGetProperty("minHeight", out JsonElement minHeightEl) ? minHeightEl.Deserialize<UIResponsive<UILayoutLength>>(ValueJsonOptions) : null,
                MaxHeight = item.TryGetProperty("maxHeight", out JsonElement maxHeightEl) ? maxHeightEl.Deserialize<UIResponsive<UILayoutLength>>(ValueJsonOptions) : null,
                HorizontalAlignment = item.TryGetProperty("horizontalAlignment", out JsonElement hAlignEl) ? Enum.Parse<UIAlignment>(hAlignEl.GetString()!) : null,
                VerticalAlignment = item.TryGetProperty("verticalAlignment", out JsonElement vAlignEl) ? Enum.Parse<UIAlignment>(vAlignEl.GetString()!) : null,
                Margin = item.TryGetProperty("margin", out JsonElement marginEl) ? marginEl.Deserialize<UIResponsive<UIThickness>>(ValueJsonOptions) : null,
                Modal = !item.TryGetProperty("modal", out JsonElement modalEl) || modalEl.GetBoolean(),
                AccessibleName = item.TryGetProperty("accessibleName", out JsonElement accNameEl) ? accNameEl.Deserialize<UIPhrase>(ValueJsonOptions) : null,
                TitleComponentId = titleId,
                CloseOnEscape = item.GetProperty("closeOnEscape").GetBoolean(),
                CloseOnBackdrop = item.GetProperty("closeOnBackdrop").GetBoolean(),
            };
        }

        return dialogs;
    }

    private static UIComponentGraph ReadGraph(JsonElement element)
    {
        UIComponentNode[] nodes = new UIComponentNode[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
        {
            UIComponentId componentId = new(item.GetProperty("componentId").GetInt32());
            UIContextId contextId = item.TryGetProperty("contextId", out JsonElement ctxElement)
                ? new UIContextId(ctxElement.GetInt32())
                : new UIContextId(1);
            UIComponentId? parentId = item.TryGetProperty("parentId", out JsonElement parentElement)
                ? new UIComponentId(parentElement.GetInt32())
                : null;

            UIComponentId[] children = item.TryGetProperty("children", out JsonElement childrenElement)
                ? ReadComponentIdArray(childrenElement)
                : [];

            UIComponentSlot[] slots = [];
            if (item.TryGetProperty("slots", out JsonElement slotsElement))
            {
                slots = new UIComponentSlot[slotsElement.GetArrayLength()];
                var slotIndex = 0;
                foreach (JsonElement slotItem in slotsElement.EnumerateArray())
                {
                    slots[slotIndex++] = new UIComponentSlot
                    {
                        OwnerComponentId = componentId,
                        Kind = Enum.Parse<UIComponentSlotKind>(slotItem.GetProperty("kind").GetString()!),
                        RootComponentId = new UIComponentId(slotItem.GetProperty("rootComponentId").GetInt32()),
                        Key = slotItem.TryGetProperty("key", out JsonElement keyElement) ? keyElement.GetString() : null,
                        KeyProperty = slotItem.TryGetProperty("keyProperty", out JsonElement keyPropElement) ? keyPropElement.GetString() : null,
                    };
                }
            }

            nodes[index++] = new UIComponentNode
            {
                ComponentId = componentId,
                ContextId = contextId,
                AuthoringId = item.GetProperty("authoringId").GetString()!,
                HasAuthoredId = item.TryGetProperty("hasAuthoredId", out JsonElement authoredElement) && authoredElement.GetBoolean(),
                TypeKey = item.GetProperty("typeKey").GetString()!,
                ParentId = parentId,
                ContextParameterCount = item.TryGetProperty("contextParameterCount", out JsonElement countElement) ? countElement.GetInt32() : 0,
                DefinesContextParameter = item.TryGetProperty("definesContextParameter", out JsonElement definesElement) && definesElement.GetBoolean(),
                IsContentTree = item.TryGetProperty("isContentTree", out JsonElement contentTreeElement) && contentTreeElement.GetBoolean(),
                Children = children,
                Slots = slots,
            };
        }

        return new UIComponentGraph(nodes);
    }

    private static UIComponentId[] ReadComponentIdArray(JsonElement element)
    {
        UIComponentId[] ids = new UIComponentId[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
            ids[index++] = new UIComponentId(item.GetInt32());

        return ids;
    }

    private static UIComponentStateIndex ReadStates(JsonElement element)
    {
        JsonElement layoutsElement = element.GetProperty("layouts");
        LayoutWireEntry[] layouts = new LayoutWireEntry[layoutsElement.GetArrayLength()];
        var layoutIndex = 0;

        foreach (JsonElement layoutItem in layoutsElement.EnumerateArray())
        {
            JsonElement slotsElement = layoutItem.GetProperty("slots");
            var slotCount = slotsElement.GetArrayLength();
            UIProperty[] properties = new UIProperty[slotCount];
            CompiledUIPropertyValue[] defaults = new CompiledUIPropertyValue[slotCount];
            var s = 0;

            foreach (JsonElement slotItem in slotsElement.EnumerateArray())
            {
                UIProperty property = new(slotItem.GetProperty("p").GetString()!);
                var isTranslatable = slotItem.TryGetProperty("tr", out JsonElement trElement) && trElement.GetBoolean();
                var isContent = slotItem.TryGetProperty("ct", out JsonElement ctElement) && ctElement.GetBoolean();
                var value = slotItem.TryGetProperty("v", out JsonElement valElement) ? ReadTypedValue(valElement) : null;

                properties[s] = property;
                defaults[s] = new CompiledUIPropertyValue
                {
                    Property = property,
                    IsTranslatable = isTranslatable,
                    IsContent = isContent,
                    IsBind = false,
                    Value = value,
                };
                s++;
            }

            layouts[layoutIndex++] = new LayoutWireEntry(new UIComponentStateLayout(properties), defaults);
        }

        JsonElement componentsElement = element.GetProperty("components");
        UIComponentState[] states = new UIComponentState[componentsElement.GetArrayLength()];
        var stateIdx = 0;

        foreach (JsonElement compItem in componentsElement.EnumerateArray())
        {
            UIComponentId componentId = new(compItem.GetProperty("id").GetInt32());
            LayoutWireEntry layoutEntry = layouts[compItem.GetProperty("l").GetInt32()];
            CompiledUIPropertyValue[] values = [.. layoutEntry.Defaults];

            foreach (JsonElement overrideItem in compItem.GetProperty("o").EnumerateArray())
            {
                var slot = overrideItem.GetProperty("s").GetInt32();
                CompiledUIPropertyValue baseline = layoutEntry.Defaults[slot];
                var isTranslatable = overrideItem.TryGetProperty("tr", out JsonElement trElement)
                    ? trElement.GetBoolean()
                    : baseline.IsTranslatable;
                var isContent = overrideItem.TryGetProperty("ct", out JsonElement ctElement) && ctElement.GetBoolean();

                if (overrideItem.TryGetProperty("b", out JsonElement bindElement))
                {
                    values[slot] = new CompiledUIPropertyValue
                    {
                        Property = baseline.Property,
                        IsTranslatable = isTranslatable,
                        IsContent = isContent,
                        IsBind = true,
                        BindingId = new UIBindingId(bindElement.GetInt32()),
                    };
                }
                else
                {
                    var val = overrideItem.TryGetProperty("v", out JsonElement valElement) ? ReadTypedValue(valElement) : null;
                    values[slot] = new CompiledUIPropertyValue
                    {
                        Property = baseline.Property,
                        IsTranslatable = isTranslatable,
                        IsContent = isContent,
                        IsBind = false,
                        Value = val,
                    };
                }
            }

            states[stateIdx++] = new UIComponentState(componentId, layoutEntry.Layout, values);
        }

        return new UIComponentStateIndex(states);
    }

    private static UICompiledBindingSourceIndex ReadSources(JsonElement element)
    {
        CompiledUIBindingSource[] sources = new CompiledUIBindingSource[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
        {
            UIComponentId? componentId = item.TryGetProperty("componentId", out JsonElement compElement)
                ? new UIComponentId(compElement.GetInt32())
                : null;

            sources[index++] = new CompiledUIBindingSource
            {
                Id = new UIBindingSourceId(item.GetProperty("id").GetInt32()),
                Kind = Enum.Parse<CompiledUIBindingSourceKind>(item.GetProperty("kind").GetString()!),
                ComponentId = componentId,
                ItemsProperty = item.TryGetProperty("itemsProperty", out JsonElement itemsPropElement) ? itemsPropElement.GetString() : null,
            };
        }

        return new UICompiledBindingSourceIndex(sources);
    }

    private static UICompiledBindingTemplateIndex ReadTemplates(JsonElement element)
    {
        CompiledUIBindingTemplate[] templates = new CompiledUIBindingTemplate[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
        {
            templates[index++] = new CompiledUIBindingTemplate
            {
                Id = new UIBindingTemplateId(item.GetProperty("id").GetInt32()),
                SourceId = new UIBindingSourceId(item.GetProperty("sourceId").GetInt32()),
                Template = item.GetProperty("template").GetString()!,
                ParameterCount = item.TryGetProperty("parameterCount", out JsonElement countElement) ? countElement.GetInt32() : 0,
            };
        }

        return new UICompiledBindingTemplateIndex(templates);
    }

    private static UIComponentContextIndex ReadContexts(JsonElement element)
    {
        CompiledUIContext[] contexts = new CompiledUIContext[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
        {
            contexts[index++] = new CompiledUIContext
            {
                Id = new UIContextId(item.GetProperty("id").GetInt32()),
                TemplateId = new UIBindingTemplateId(item.GetProperty("templateId").GetInt32()),
            };
        }

        return new UIComponentContextIndex(contexts);
    }

    private static UICompiledBindingIndex ReadBindings(JsonElement element, UICompiledBindingSourceIndex sources, UICompiledBindingTemplateIndex templates)
    {
        CompiledUIBinding[] bindings = new CompiledUIBinding[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
        {
            CompiledUIBindingParameter[] parameters = item.TryGetProperty("parameters", out JsonElement paramsElement)
                ? ReadBindingParameters(paramsElement)
                : [];

            UIComponentId[] dynamicComponentIds = item.TryGetProperty("dynamicParameterComponentIds", out JsonElement dynElement)
                ? ReadComponentIdArray(dynElement)
                : [];

            Type? targetValueType = item.TryGetProperty("targetValueType", out JsonElement targetTypeElement)
                ? ReadTypedValue(targetTypeElement) as Type
                : null;

            var targetFallbackValue = item.TryGetProperty("targetFallbackValue", out JsonElement fallbackElement)
                ? ReadTypedValue(fallbackElement)
                : null;

            bindings[index++] = new CompiledUIBinding
            {
                Id = new UIBindingId(item.GetProperty("id").GetInt32()),
                Kind = Enum.Parse<CompiledUIBindingKind>(item.GetProperty("kind").GetString()!),
                Address = new UIPropertyAddress(new UIComponentId(item.GetProperty("componentId").GetInt32()), new UIProperty(item.GetProperty("property").GetString()!)),
                SourceId = new UIBindingSourceId(item.GetProperty("sourceId").GetInt32()),
                TemplateId = new UIBindingTemplateId(item.GetProperty("templateId").GetInt32()),
                Mode = Enum.Parse<UIBindingMode>(item.GetProperty("mode").GetString()!),
                Optional = item.TryGetProperty("optional", out JsonElement optElement) && optElement.GetBoolean(),
                IsTranslatable = item.TryGetProperty("isTranslatable", out JsonElement trElement) && trElement.GetBoolean(),
                Parameters = parameters,
                DynamicParameterComponentIds = dynamicComponentIds,
                TargetValueType = targetValueType,
                TargetFallbackValue = targetFallbackValue,
            };
        }

        return new UICompiledBindingIndex(bindings, sources, templates);
    }

    private static CompiledUIBindingParameter[] ReadBindingParameters(JsonElement element)
    {
        CompiledUIBindingParameter[] parameters = new CompiledUIBindingParameter[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
        {
            parameters[index++] = new CompiledUIBindingParameter
            {
                Kind = Enum.Parse<CompiledUIBindingParameterKind>(item.GetProperty("kind").GetString()!),
                ComponentId = item.TryGetProperty("componentId", out JsonElement compElement)
                    ? new UIComponentId(compElement.GetInt32())
                    : null,
                Value = item.TryGetProperty("value", out JsonElement valElement) ? ReadTypedValue(valElement) : null,
            };
        }

        return parameters;
    }

    private static UIInteractionIndex ReadInteractions(JsonElement element)
    {
        JsonElement allElement = element.GetProperty("all");
        CompiledUIInteraction[] interactions = new CompiledUIInteraction[allElement.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in allElement.EnumerateArray())
        {
            UIPropertyAddress? source = item.TryGetProperty("sourceComponentId", out JsonElement srcCompElement)
                ? new UIPropertyAddress(new UIComponentId(srcCompElement.GetInt32()), new UIProperty(item.GetProperty("sourceProperty").GetString()!))
                : null;
            CompiledUIEventAddress? sourceEvent = item.TryGetProperty("sourceEventComponentId", out JsonElement srcEvCompElement)
                ? new CompiledUIEventAddress(new UIComponentId(srcEvCompElement.GetInt32()), item.GetProperty("sourceEventName").GetString()!)
                : null;
            UIPropertyAddress? target = item.TryGetProperty("targetComponentId", out JsonElement tgtCompElement)
                ? new UIPropertyAddress(new UIComponentId(tgtCompElement.GetInt32()), new UIProperty(item.GetProperty("targetProperty").GetString()!))
                : null;
            ClientEffect? effect = item.TryGetProperty("effect", out JsonElement effectElement)
                ? effectElement.Deserialize<ClientEffect>(ValueJsonOptions)
                : null;

            interactions[index++] = new CompiledUIInteraction
            {
                SourceKind = Enum.Parse<UIInteractionSourceKind>(item.GetProperty("sourceKind").GetString()!),
                ActionKind = Enum.Parse<UIInteractionActionKind>(item.GetProperty("actionKind").GetString()!),
                Operator = Enum.Parse<UIComparisonOperator>(item.GetProperty("operator").GetString()!),
                Source = source,
                SourceEvent = sourceEvent,
                Target = target,
                Effect = effect,
                Value = item.TryGetProperty("value", out JsonElement valElement) ? ReadTypedValue(valElement) : null,
                TrueValue = item.TryGetProperty("trueValue", out JsonElement trueElement) ? ReadTypedValue(trueElement) : null,
                FalseValue = item.TryGetProperty("falseValue", out JsonElement falseElement) ? ReadTypedValue(falseElement) : null,
                RowKey = item.TryGetProperty("rowKey", out JsonElement rowKeyElement) ? rowKeyElement.GetString() : null,
            };
        }

        Dictionary<UIPropertyAddress, object?>? firstPaint = null;
        if (element.TryGetProperty("firstPaint", out JsonElement fpElement))
        {
            firstPaint = [with(fpElement.GetArrayLength())];
            foreach (JsonElement fpItem in fpElement.EnumerateArray())
            {
                UIPropertyAddress address = new(new UIComponentId(fpItem.GetProperty("componentId").GetInt32()), new UIProperty(fpItem.GetProperty("property").GetString()!));
                firstPaint[address] = ReadTypedValue(fpItem.GetProperty("value"));
            }
        }

        return new UIInteractionIndex(interactions, firstPaint);
    }

    private static UIEventIndex ReadEvents(JsonElement element, UICompiledBindingSourceIndex sources, UICompiledBindingTemplateIndex templates, UIComponentGraph graph)
    {
        CompiledUIEvent[] events = new CompiledUIEvent[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
        {
            CompiledUIActionArgument[] arguments = [];
            if (item.TryGetProperty("arguments", out JsonElement argsElement))
            {
                arguments = new CompiledUIActionArgument[argsElement.GetArrayLength()];
                var argIndex = 0;
                foreach (JsonElement argItem in argsElement.EnumerateArray())
                {
                    arguments[argIndex++] = new CompiledUIActionArgument
                    {
                        Name = argItem.GetProperty("name").GetString()!,
                        Kind = Enum.Parse<CompiledUIActionArgumentKind>(argItem.GetProperty("kind").GetString()!),
                        Value = argItem.TryGetProperty("value", out JsonElement valElement) ? ReadTypedValue(valElement) : null,
                        SourceId = argItem.TryGetProperty("sourceId", out JsonElement srcIdElement)
                            ? new UIBindingSourceId(srcIdElement.GetInt32())
                            : null,
                        TemplateId = argItem.TryGetProperty("templateId", out JsonElement tplIdElement)
                            ? new UIBindingTemplateId(tplIdElement.GetInt32())
                            : null,
                        Parameters = argItem.TryGetProperty("parameters", out JsonElement paramsElement)
                            ? ReadBindingParameters(paramsElement)
                            : [],
                        DynamicParameterComponentIds = argItem.TryGetProperty("dynamicParameterComponentIds", out JsonElement dynElement)
                            ? ReadComponentIdArray(dynElement)
                            : [],
                    };
                }
            }

            events[index++] = new CompiledUIEvent
            {
                Id = new UIEventId(item.GetProperty("id").GetInt32()),
                Address = new CompiledUIEventAddress(new UIComponentId(item.GetProperty("componentId").GetInt32()), item.GetProperty("eventName").GetString()!),
                Command = item.GetProperty("command").GetString()!,
                Arguments = arguments,
                SubmitsForm = item.TryGetProperty("submitsForm", out JsonElement submitsElement) && submitsElement.GetBoolean(),
                ShowsPending = !item.TryGetProperty("showsPending", out JsonElement pendingElement) || pendingElement.GetBoolean(),
            };
        }

        return new UIEventIndex(events, sources, templates, graph);
    }

    private static KeyValuePair<UIComponentId, UIPropertyAddress>[] ReadValidationMessageTargets(JsonElement element)
    {
        KeyValuePair<UIComponentId, UIPropertyAddress>[] targets = new KeyValuePair<UIComponentId, UIPropertyAddress>[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
        {
            UIComponentId sourceId = new(item.GetProperty("sourceComponentId").GetInt32());
            UIPropertyAddress target = new(
                new UIComponentId(item.GetProperty("targetComponentId").GetInt32()),
                new UIProperty(item.GetProperty("targetProperty").GetString()!)
            );
            targets[index++] = new KeyValuePair<UIComponentId, UIPropertyAddress>(sourceId, target);
        }

        return targets;
    }

    private static UIValidationIndex ReadValidations(JsonElement element, KeyValuePair<UIComponentId, UIPropertyAddress>[]? messageTargets)
    {
        JsonElement rulesElement = element;
        if (element.ValueKind == JsonValueKind.Object)
        {
            rulesElement = element.GetProperty("rules");
            if (messageTargets is null && element.TryGetProperty("messageTargets", out JsonElement inlineTargets))
                messageTargets = ReadValidationMessageTargets(inlineTargets);
        }

        CompiledUIValidationRule[] rules = new CompiledUIValidationRule[rulesElement.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in rulesElement.EnumerateArray())
        {
            UIPropertyAddress? valueSource = item.TryGetProperty("valueSourceComponentId", out JsonElement vsCompElement)
                ? new UIPropertyAddress(new UIComponentId(vsCompElement.GetInt32()), new UIProperty(item.GetProperty("valueSourceProperty").GetString()!))
                : null;

            rules[index++] = new CompiledUIValidationRule
            {
                Target = new UIPropertyAddress(new UIComponentId(item.GetProperty("componentId").GetInt32()), new UIProperty(item.GetProperty("property").GetString()!)),
                Trigger = Enum.Parse<UIValidationTrigger>(item.GetProperty("trigger").GetString()!),
                Operator = Enum.Parse<UIComparisonOperator>(item.GetProperty("operator").GetString()!),
                Severity = Enum.Parse<UIValidationSeverity>(item.GetProperty("severity").GetString()!),
                Message = item.GetProperty("message").Deserialize<UIPhrase>(ValueJsonOptions)!,
                Value = item.TryGetProperty("value", out JsonElement valElement) ? ReadTypedValue(valElement) : null,
                ValueSource = valueSource,
            };
        }

        return messageTargets is { Length: > 0 } ? new UIValidationIndex(rules, messageTargets) : new UIValidationIndex(rules);
    }

    private static UIItemProjectionIndex ReadItemProjections(JsonElement element)
    {
        Dictionary<UIComponentId, UIItemProjection> projections = [];
        if (element.TryGetProperty("projections", out JsonElement projArray))
        {
            foreach (JsonElement item in projArray.EnumerateArray())
            {
                UIComponentId host = new(item.GetProperty("host").GetInt32());
                projections[host] = ReadItemProjection(item.GetProperty("projection"));
            }
        }

        Dictionary<UIComponentId, string[]>? ruleReads = null;
        if (element.TryGetProperty("ruleReads", out JsonElement readsArray))
        {
            ruleReads = [];
            foreach (JsonElement item in readsArray.EnumerateArray())
            {
                UIComponentId host = new(item.GetProperty("host").GetInt32());
                ruleReads[host] = item.GetProperty("paths").Deserialize<string[]>(ValueJsonOptions) ?? [];
            }
        }

        List<UIComponentId>? boundRules = null;
        if (element.TryGetProperty("boundRules", out JsonElement boundArray))
        {
            boundRules = [with(boundArray.GetArrayLength())];
            foreach (JsonElement item in boundArray.EnumerateArray())
                boundRules.Add(new UIComponentId(item.GetInt32()));
        }

        return new UIItemProjectionIndex(projections, ruleReads, boundRules);
    }

    private static UIItemProjection ReadItemProjection(JsonElement element)
    {
        if (element.GetProperty("isWhole").GetBoolean())
            return UIItemProjection.Whole;

        JsonElement membersElement = element.GetProperty("members");
        List<UIItemProjectionMember> members = [with(membersElement.GetArrayLength())];

        foreach (JsonElement memberItem in membersElement.EnumerateArray())
        {
            var hasFallback = memberItem.TryGetProperty("hasFallback", out JsonElement fbFlag) && fbFlag.GetBoolean();
            members.Add(new UIItemProjectionMember
            {
                Name = memberItem.GetProperty("name").GetString()!,
                Inner = memberItem.TryGetProperty("inner", out JsonElement innerElement) ? ReadItemProjection(innerElement) : null,
                HasFallback = hasFallback,
                Fallback = hasFallback && memberItem.TryGetProperty("fallback", out JsonElement fbElement) ? ReadTypedValue(fbElement) : null,
            });
        }

        return new UIItemProjection(members);
    }

    private static UICompileWarning[] ReadWarnings(JsonElement element)
    {
        UICompileWarning[] warnings = new UICompileWarning[element.GetArrayLength()];
        var index = 0;

        foreach (JsonElement item in element.EnumerateArray())
        {
            warnings[index++] = new UICompileWarning(
                Enum.Parse<UICompileWarningKind>(item.GetProperty("kind").GetString()!),
                item.GetProperty("message").GetString()!
            );
        }

        return warnings;
    }

    /// <summary>
    /// Coerces an untyped wire value (deserialized from a <c>ServerValueUIUpdate</c> or a
    /// wire item dictionary) into the target property's <paramref name="targetValueType"/>.
    /// </summary>
    public static object? CoerceWireValue(Type? targetValueType, object? value)
    {
        if (value is null || targetValueType is null)
            return value;

        Type targetType = Nullable.GetUnderlyingType(targetValueType) ?? targetValueType;

        if (targetType == typeof(UIItemsView))
        {
            if (value is CompiledUIItemsView or UIItemsView)
                return value;

            if (value is IReadOnlyDictionary<string, object?>)
                return DeserializeWireObject(value, typeof(CompiledUIItemsView));
        }

        if (targetType == typeof(UIPhrase))
        {
            if (value is UIPhrase or string)
                return value;

            if (value is IReadOnlyDictionary<string, object?>)
                return DeserializeWireObject(value, typeof(UIPhrase));
        }

        if (targetType.IsInstanceOfType(value))
            return value;

        if (targetType.IsGenericType && targetType.GetGenericTypeDefinition() == typeof(UIResponsive<>) && value is IReadOnlyDictionary<string, object?>)
            return DeserializeWireObject(value, targetType);

        if (RecursiveValueCoercion.TryCoerce(value, targetType, out var coerced) && coerced is not null)
            return coerced;

        if (value is IReadOnlyDictionary<string, object?> or IReadOnlyList<object?> or string)
            return DeserializeWireObject(value, targetType);

        return value;
    }

    private static object? DeserializeWireObject(object value, Type targetType)
    {
        try
        {
            var utf8 = JsonSerializer.SerializeToUtf8Bytes(value, ValueJsonOptions);
            return JsonSerializer.Deserialize(utf8, targetType, ValueJsonOptions);
        }
        catch (JsonException)
        {
            return value;
        }
        catch (NotSupportedException)
        {
            return value;
        }
    }

    /// <summary>
    /// Materializes a strongly-typed row item <typeparamref name="TItem"/> from a wire dictionary when needed.
    /// </summary>
    public static bool TryMaterializeItem<TItem>(object? item, out TItem? materialized)
    {
        if (item is TItem typed)
        {
            materialized = typed;
            return true;
        }

        if (item is IReadOnlyDictionary<string, object?>)
        {
            try
            {
                var utf8 = JsonSerializer.SerializeToUtf8Bytes(item, ValueJsonOptions);
                materialized = JsonSerializer.Deserialize<TItem>(utf8, ValueJsonOptions);
                return materialized is not null;
            }
            catch (JsonException)
            {
            }
            catch (NotSupportedException)
            {
            }
        }

        materialized = default;
        return false;
    }

    private sealed record LayoutWireEntry(UIComponentStateLayout Layout, CompiledUIPropertyValue[] Defaults);

    private sealed class NIntWireJsonConverter : JsonConverter<nint>
    {
        public override nint Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            => checked((nint)reader.GetInt64());

        public override void Write(Utf8JsonWriter writer, nint value, JsonSerializerOptions options)
            => writer.WriteNumberValue(value);
    }

    private sealed class NUIntWireJsonConverter : JsonConverter<nuint>
    {
        public override nuint Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            => checked((nuint)reader.GetUInt64());

        public override void Write(Utf8JsonWriter writer, nuint value, JsonSerializerOptions options)
            => writer.WriteNumberValue(value);
    }

    private sealed class ColorVariantWireJsonConverter : JsonConverter<ColorVariant>
    {
        public override ColorVariant Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var text = reader.GetString();
            return UIThemeColor.TryParse(text, out UIThemeColor parsed) && parsed.Light is ColorVariant color
                ? color
                : throw new JsonException($"'{text}' is not a valid ColorVariant.");
        }

        public override void Write(Utf8JsonWriter writer, ColorVariant value, JsonSerializerOptions options)
            => writer.WriteStringValue(UIThemeColor.FromColorVariant(value).ToCanonical());
    }

    private sealed class UIItemsQueryTermsWireJsonConverter : JsonConverter<UIItemsQueryTerms>
    {
        public override UIItemsQueryTerms? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Null)
                return null;

            using JsonDocument doc = JsonDocument.ParseValue(ref reader);
            JsonElement root = doc.RootElement;
            var sortProperties = root.TryGetProperty("sortProperties", out JsonElement sp) ? sp.Deserialize<string[]>(options) ?? [] : [];
            var allowSearch = root.TryGetProperty("allowSearch", out JsonElement asEl) && asEl.GetBoolean();

            if (root.TryGetProperty("operatorsByProperty", out JsonElement opsByPropEl) && opsByPropEl.ValueKind == JsonValueKind.Object)
            {
                List<KeyValuePair<string, IEnumerable<UIComparisonOperator>>> filters = [];
                foreach (JsonProperty prop in opsByPropEl.EnumerateObject())
                    filters.Add(new KeyValuePair<string, IEnumerable<UIComparisonOperator>>(prop.Name, prop.Value.Deserialize<UIComparisonOperator[]>(options) ?? []));

                return new UIItemsQueryTerms(filters, sortProperties, allowSearch);
            }

            var filterProperties = root.TryGetProperty("filterProperties", out JsonElement fp) ? fp.Deserialize<string[]>(options) ?? [] : [];
            UIComparisonOperator[] operators = root.TryGetProperty("operators", out JsonElement opsEl) ? opsEl.Deserialize<UIComparisonOperator[]>(options) ?? [] : [];
            return new UIItemsQueryTerms(filterProperties, operators, sortProperties, allowSearch);
        }

        public override void Write(Utf8JsonWriter writer, UIItemsQueryTerms value, JsonSerializerOptions options)
        {
            writer.WriteStartObject();
            writer.WritePropertyName("filterProperties");
            JsonSerializer.Serialize(writer, value.FilterProperties.OrderBy(static p => p, StringComparer.Ordinal), options);
            writer.WritePropertyName("operators");
            JsonSerializer.Serialize(writer, value.Operators.OrderBy(static op => op), options);
            writer.WritePropertyName("sortProperties");
            JsonSerializer.Serialize(writer, value.SortProperties.OrderBy(static p => p, StringComparer.Ordinal), options);
            if (value.AllowSearch)
                writer.WriteBoolean("allowSearch", true);

            if (value.OperatorsByProperty is { Count: > 0 })
            {
                writer.WritePropertyName("operatorsByProperty");
                writer.WriteStartObject();
                foreach (KeyValuePair<string, FrozenSet<UIComparisonOperator>> entry in value.OperatorsByProperty.OrderBy(static e => e.Key, StringComparer.Ordinal))
                {
                    writer.WritePropertyName(entry.Key);
                    JsonSerializer.Serialize(writer, entry.Value.OrderBy(static op => op), options);
                }

                writer.WriteEndObject();
            }

            writer.WriteEndObject();
        }
    }

    private sealed class CompiledUIItemsViewWireJsonConverter : JsonConverter<CompiledUIItemsView>
    {
        public override CompiledUIItemsView? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Null)
                return null;

            using JsonDocument doc = JsonDocument.ParseValue(ref reader);
            JsonElement root = doc.RootElement;
            CompiledUIItemsFilter[]? filters = root.TryGetProperty("filters", out JsonElement f) ? f.Deserialize<CompiledUIItemsFilter[]>(options) : null;
            CompiledUIItemsSort[]? sorts = root.TryGetProperty("sorts", out JsonElement s) ? s.Deserialize<CompiledUIItemsSort[]>(options) : null;

            return new CompiledUIItemsView(filters, sorts);
        }

        public override void Write(Utf8JsonWriter writer, CompiledUIItemsView value, JsonSerializerOptions options)
        {
            writer.WriteStartObject();
            if (value.Filters.Length > 0)
            {
                writer.WritePropertyName("filters");
                JsonSerializer.Serialize(writer, value.Filters, options);
            }

            if (value.Sorts.Length > 0)
            {
                writer.WritePropertyName("sorts");
                JsonSerializer.Serialize(writer, value.Sorts, options);
            }

            writer.WriteEndObject();
        }
    }

    private sealed class ModelInterfaceWireJsonConverter<TInterface, TModel> : JsonConverter<TInterface>
        where TInterface : class
        where TModel : class, TInterface
    {
        public override TInterface? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            => JsonSerializer.Deserialize<TModel>(ref reader, options);

        public override void Write(Utf8JsonWriter writer, TInterface value, JsonSerializerOptions options)
            => JsonSerializer.Serialize(writer, value, value.GetType(), options);
    }

    private sealed class UIItemReadsWireJsonConverter : JsonConverter<UIItemReads>
    {
        public override UIItemReads? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            if (reader.TokenType == JsonTokenType.Null)
                return null;

            using JsonDocument doc = JsonDocument.ParseValue(ref reader);
            JsonElement root = doc.RootElement;
            if (root.TryGetProperty("isWhole", out JsonElement whole) && whole.GetBoolean())
                return UIItemReads.Whole;

            var paths = root.TryGetProperty("paths", out JsonElement pathsEl) ? pathsEl.Deserialize<string[]>(options) ?? [] : [];
            return new UIItemReads(paths);
        }

        public override void Write(Utf8JsonWriter writer, UIItemReads value, JsonSerializerOptions options)
        {
            writer.WriteStartObject();
            if (value.IsWhole)
            {
                writer.WriteBoolean("isWhole", true);
            }
            else
            {
                writer.WritePropertyName("paths");
                JsonSerializer.Serialize(writer, value.Paths.OrderBy(static p => p, StringComparer.Ordinal), options);
            }

            writer.WriteEndObject();
        }
    }
}
