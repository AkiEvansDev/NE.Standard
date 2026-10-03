using System;
using System.Collections;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.Json.Serialization.Metadata;
using NE.Standard.UI.Compiled.Items;

namespace NE.Standard.UI.Shell.Updates.Server;

/// <summary>
/// Writes an item as the page reads it: a property holding null or an empty collection is left out, at every depth of the item, and
/// under a host's projection only what the host reads travels — less a value its readers read the same from an absent key.
/// </summary>
/// <remarks>
/// The page reads a property an item does not carry as null, and a collection it does not carry as empty. Without a projection a
/// <see langword="false"/>, a zero or a model's own default is written: the page would read its absence as null, which is not what
/// it says; a projection knows where it is (<see cref="UIItemProjectionMember.Fallback"/>). The item is written with options derived
/// once from the caller's, so its converters and naming hold for the item as well.
/// </remarks>
public sealed class ServerItemJsonConverter : JsonConverter<object>
{
    private static readonly ConditionalWeakTable<JsonSerializerOptions, ItemWriter> Writers = [];

    private static readonly MethodInfo GenericCount = typeof(ServerItemJsonConverter).GetMethod(nameof(CountOf), BindingFlags.NonPublic | BindingFlags.Static)!;

    private static readonly MethodInfo GenericPropertyWriter = typeof(ServerItemJsonConverter).GetMethod(nameof(CreatePropertyWriter), BindingFlags.NonPublic | BindingFlags.Static)!;

    /// <inheritdoc />
    public override object? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        => JsonSerializer.Deserialize<object>(ref reader, options);

    /// <inheritdoc />
    public override void Write(Utf8JsonWriter writer, object value, JsonSerializerOptions options)
        => WriteItem(writer, value, projection: null, options);

    /// <summary>Writes an item under a host's projection; a null or whole projection writes it whole.</summary>
    public static void WriteItem(Utf8JsonWriter writer, object item, UIItemProjection? projection, JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(writer);
        ArgumentNullException.ThrowIfNull(item);
        ArgumentNullException.ThrowIfNull(options);

        WriterFor(options).Write(writer, item, projection);
    }

    /// <summary>The options an item is written with under <paramref name="options"/>, made once per options instance.</summary>
    public static JsonSerializerOptions For(JsonSerializerOptions options)
        => WriterFor(options).Options;

    /// <summary>A property name as <paramref name="options"/> write it, encoded once per options instance.</summary>
    public static JsonEncodedText PropertyName(JsonSerializerOptions options, string name)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return WriterFor(options).Name(name);
    }

    private static ItemWriter WriterFor(JsonSerializerOptions options)
    {
        ArgumentNullException.ThrowIfNull(options);

        return Writers.GetValue(options, static source => new ItemWriter(source, Create(source)));
    }

    private static JsonSerializerOptions Create(JsonSerializerOptions source)
    {
        IJsonTypeInfoResolver resolver = source.TypeInfoResolver ?? new DefaultJsonTypeInfoResolver();

        return new JsonSerializerOptions(source)
        {
            // The options' own null rule: decided on the property's type, so a value-type property is never boxed to ask.
            DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
            TypeInfoResolver = resolver.WithAddedModifier(OmitEmptyCollections)
        };
    }

    private static void OmitEmptyCollections(JsonTypeInfo typeInfo)
    {
        if (typeInfo.Kind != JsonTypeInfoKind.Object)
            return;

        foreach (JsonPropertyInfo property in typeInfo.Properties)
        {
            if (CounterFor(property.PropertyType) is not { } count)
                continue;

            Func<object, object?, bool>? declared = property.ShouldSerialize;

            // The predicate replaces the null rule for this property, so it leaves a null out itself.
            property.ShouldSerialize = (owner, value) => value is not null && count(value) > 0 && (declared is null || declared(owner, value));
        }
    }

    /// <summary>How a property's collection is counted without walking it; null for a type that is no collection, or one only a walk counts.</summary>
    private static Func<object, int>? CounterFor(Type type)
    {
        if (type == typeof(string) || type.IsValueType)
            return null;

        if (typeof(ICollection).IsAssignableFrom(type))
            return static value => ((ICollection)value).Count;

        Type? element = ElementOf(type, typeof(ICollection<>)) ?? ElementOf(type, typeof(IReadOnlyCollection<>));

        return element is null ? null : GenericCount.MakeGenericMethod(element).CreateDelegate<Func<object, int>>();
    }

    private static Type? ElementOf(Type type, Type collection)
    {
        if (type.IsInterface && type.IsGenericType && type.GetGenericTypeDefinition() == collection)
            return type.GetGenericArguments()[0];

        foreach (Type contract in type.GetInterfaces())
        {
            if (contract.IsGenericType && contract.GetGenericTypeDefinition() == collection)
                return contract.GetGenericArguments()[0];
        }

        return null;
    }

    private static int CountOf<T>(object value)
        => value is ICollection<T> collection ? collection.Count : ((IReadOnlyCollection<T>)value).Count;

    /// <summary>
    /// Writes items under one caller's options: whole, or under a projection by a plan made once per projection and item type.
    /// </summary>
    private sealed class ItemWriter(JsonSerializerOptions source, JsonSerializerOptions options)
    {
        private readonly ConcurrentDictionary<(UIItemProjection Projection, Type Type), ItemPlan> _plans = new();
        private readonly ConcurrentDictionary<string, JsonEncodedText> _names = new(StringComparer.Ordinal);

        public JsonSerializerOptions Options { get; } = options;

        public JsonEncodedText Name(string name)
            => _names.GetOrAdd(name, static (key, naming) => JsonEncodedText.Encode(naming?.ConvertName(key) ?? key), source.PropertyNamingPolicy);

        public void Write(Utf8JsonWriter writer, object item, UIItemProjection? projection)
        {
            if (projection is null || projection.IsWhole)
            {
                JsonSerializer.Serialize(writer, item, item.GetType(), Options);
                return;
            }

            _plans.GetOrAdd((projection, item.GetType()), static (key, self) => self.CreatePlan(key.Projection, key.Type), this).Write(writer, item, this);
        }

        /// <summary>Writes a value something inside it is read of: an object under the projection, a list each element under it.</summary>
        public void WriteInner(Utf8JsonWriter writer, object value, UIItemProjection projection)
        {
            if (value is string or IDictionary)
            {
                JsonSerializer.Serialize(writer, value, value.GetType(), Options);
                return;
            }

            if (value is IList list)
            {
                writer.WriteStartArray();

                for (var i = 0; i < list.Count; i++)
                    WriteElement(writer, list[i], projection);

                writer.WriteEndArray();
                return;
            }

            if (value is IEnumerable elements)
            {
                writer.WriteStartArray();

                foreach (var element in elements)
                    WriteElement(writer, element, projection);

                writer.WriteEndArray();
                return;
            }

            Write(writer, value, projection);
        }

        private void WriteElement(Utf8JsonWriter writer, object? element, UIItemProjection projection)
        {
            if (element is null)
                writer.WriteNullValue();
            else
                Write(writer, element, projection);
        }

        private ItemPlan CreatePlan(UIItemProjection projection, Type type)
        {
            JsonTypeInfo typeInfo = Options.GetTypeInfo(type);

            // A list, a dictionary, a type with a converter of its own or a polymorphic one is written as its contract says.
            if (typeInfo.Kind != JsonTypeInfoKind.Object || typeInfo.PolymorphismOptions is not null)
                return ItemPlan.WholeItem;

            List<PropertyWriter> properties = [];

            foreach (JsonPropertyInfo property in typeInfo.Properties)
            {
                if (property.Get is null || FindMember(projection, property) is not { } member)
                    continue;

                properties.Add((PropertyWriter)GenericPropertyWriter.MakeGenericMethod(type, property.PropertyType).Invoke(null, [property, member, Name(property.Name), Options])!);
            }

            return new ItemPlan([.. properties]);
        }

        /// <summary>The member a property is kept by: by the name the type declares it under, as the page's templates name it.</summary>
        private static UIItemProjectionMember? FindMember(UIItemProjection projection, JsonPropertyInfo property)
        {
            var declared = (property.AttributeProvider as MemberInfo)?.Name ?? property.Name;

            if (projection.TryGetMember(declared, out UIItemProjectionMember? member))
                return member;

            // The page matches a name in any case; the plan is made once, so the walk costs nothing per item.
            foreach (UIItemProjectionMember candidate in projection.Members)
            {
                if (string.Equals(candidate.Name, declared, StringComparison.OrdinalIgnoreCase) || string.Equals(candidate.Name, property.Name, StringComparison.OrdinalIgnoreCase))
                    return candidate;
            }

            return null;
        }
    }

    /// <summary>How one item type is written under one projection: the properties it keeps, in the contract's order.</summary>
    private sealed class ItemPlan(PropertyWriter[]? properties)
    {
        public static ItemPlan WholeItem { get; } = new(null);

        public void Write(Utf8JsonWriter writer, object item, ItemWriter owner)
        {
            if (properties is null)
            {
                JsonSerializer.Serialize(writer, item, item.GetType(), owner.Options);
                return;
            }

            writer.WriteStartObject();

            for (var i = 0; i < properties.Length; i++)
                properties[i].Write(writer, item, owner);

            writer.WriteEndObject();
        }
    }

    private static PropertyWriter<TOwner, TValue> CreatePropertyWriter<TOwner, TValue>(JsonPropertyInfo property, UIItemProjectionMember member, JsonEncodedText name, JsonSerializerOptions options)
        => new(property, member, name, options);

    private abstract class PropertyWriter
    {
        public abstract void Write(Utf8JsonWriter writer, object item, ItemWriter owner);
    }

    /// <summary>One kept property, read through a typed getter so a value-type property is never boxed.</summary>
    private sealed class PropertyWriter<TOwner, TValue> : PropertyWriter
    {
        private readonly Func<TOwner, TValue>? _get;
        private readonly Func<object, object?> _getBoxed;
        private readonly Func<object, object?, bool>? _shouldSerialize;
        private readonly JsonEncodedText _name;
        private readonly UIItemProjection? _inner;
        private readonly bool _hasFallback;
        private readonly TValue _fallback = default!;
        private readonly JsonConverter<TValue>? _converter;
        private readonly JsonTypeInfo<TValue> _typeInfo;

        public PropertyWriter(JsonPropertyInfo property, UIItemProjectionMember member, JsonEncodedText name, JsonSerializerOptions options)
        {
            _getBoxed = property.Get!;
            _shouldSerialize = property.ShouldSerialize;
            _name = name;
            _inner = member.Inner is { IsWhole: false } inner ? inner : null;
            _converter = property.CustomConverter as JsonConverter<TValue>;
            _typeInfo = (JsonTypeInfo<TValue>)options.GetTypeInfo(typeof(TValue));

            // An overridable getter is read through the contract, which dispatches as the type does.
            if (!typeof(TOwner).IsValueType && property.AttributeProvider is PropertyInfo { GetMethod: { IsStatic: false } getter } && (!getter.IsVirtual || getter.IsFinal))
                _get = getter.CreateDelegate<Func<TOwner, TValue>>();

            if (member.HasFallback && member.Fallback is { } fallback && (fallback.GetType() == typeof(TValue) || fallback.GetType() == Nullable.GetUnderlyingType(typeof(TValue))))
            {
                _hasFallback = true;
                _fallback = (TValue)fallback;
            }
        }

        public override void Write(Utf8JsonWriter writer, object item, ItemWriter owner)
        {
            TValue value = _get is null ? (TValue)_getBoxed(item)! : _get((TOwner)item);

            if (value is null)
                return;

            if (_hasFallback && EqualityComparer<TValue>.Default.Equals(value, _fallback))
                return;

            if (_shouldSerialize is not null && !_shouldSerialize(item, value))
                return;

            if (_inner is not null)
            {
                if (value is ICollection { Count: 0 })
                    return;

                writer.WritePropertyName(_name);
                owner.WriteInner(writer, value, _inner);
                return;
            }

            writer.WritePropertyName(_name);

            if (_converter is not null)
                _converter.Write(writer, value, owner.Options);
            else
                JsonSerializer.Serialize(writer, value, _typeInfo);
        }
    }
}
