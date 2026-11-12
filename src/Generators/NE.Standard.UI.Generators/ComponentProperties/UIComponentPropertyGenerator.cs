using System.Collections.Generic;
using System.Collections.Immutable;
using System.Text;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using NE.Standard.UI.Generators.Infrastructure;

namespace NE.Standard.UI.Generators.ComponentProperties;

/// <summary>
/// Generates the fluent <c>Set*</c> methods, backing-field storage, property registration, and inherited default overrides for
/// members annotated with <c>[UIComponentProperty]</c>, <c>[UIComponentPropertyBlock]</c>, and <c>[UIComponentPropertyDefault]</c>.
/// </summary>
/// <remarks>
/// Symbols are read and validated in the transforms (<see cref="UIComponentPropertyModelFactory"/>); what reaches the output is
/// equatable data only, so an edit that changes no model re-emits nothing.
/// </remarks>
[Generator(LanguageNames.CSharp)]
public sealed class UIComponentPropertyGenerator : IIncrementalGenerator
{
    // Tracking names the incrementality tests read the steps' run reasons by.
    internal const string PropertyModelsStep = "UIComponentPropertyModels";
    internal const string BlockModelsStep = "UIComponentPropertyBlockModels";
    internal const string DefaultModelsStep = "UIComponentPropertyDefaultModels";
    internal const string CollectedModelsStep = "UIComponentPropertyCollectedModels";

    /// <inheritdoc/>
    public void Initialize(IncrementalGeneratorInitializationContext context)
    {
        IncrementalValuesProvider<UIComponentPropertyModel> properties = context.SyntaxProvider
            .ForAttributeWithMetadataName(
                UIComponentPropertyNames.AttributeMetadataName,
                predicate: static (node, _) => node is PropertyDeclarationSyntax or IndexerDeclarationSyntax,
                transform: static (ctx, ct) => UIComponentPropertyModelFactory.CreatePropertyModel(ctx, ct))
            .Where(static model => model is not null)
            .Select(static (model, _) => model!)
            .WithTrackingName(PropertyModelsStep);

        IncrementalValuesProvider<UIComponentPropertyBlockModel> blocks = context.SyntaxProvider
            .ForAttributeWithMetadataName(
                UIComponentPropertyNames.BlockAttributeMetadataName,
                predicate: static (node, _) => node is ClassDeclarationSyntax,
                transform: static (ctx, ct) => UIComponentPropertyModelFactory.CreateBlockModel(ctx, ct))
            .Where(static model => model is not null)
            .Select(static (model, _) => model!)
            .WithTrackingName(BlockModelsStep);

        IncrementalValuesProvider<UIComponentPropertyDefaultModel> defaults = context.SyntaxProvider
            .ForAttributeWithMetadataName(
                UIComponentPropertyNames.DefaultAttributeMetadataName,
                predicate: static (node, _) => node is ClassDeclarationSyntax,
                transform: static (ctx, ct) => UIComponentPropertyModelFactory.CreateDefaultModel(ctx, ct))
            .Where(static model => model is not null)
            .Select(static (model, _) => model!)
            .WithTrackingName(DefaultModelsStep);

        IncrementalValuesProvider<TypeWorkGroup> types = properties
            .Collect()
            .Combine(blocks.Collect())
            .Combine(defaults.Collect())
            .SelectMany(static (source, _) => GroupByType(source.Left.Left, source.Left.Right, source.Right))
            .WithTrackingName(CollectedModelsStep);

        context.RegisterSourceOutput(types, static (ctx, group) => ExecuteType(ctx, group));
    }

    /// <summary>
    /// Pairs every component type with its own annotated properties, what its <c>[UIComponentPropertyBlock]</c> contracts contribute,
    /// and its inherited <c>[UIComponentPropertyDefault]</c> overrides.
    /// </summary>
    private static ImmutableArray<TypeWorkGroup> GroupByType(ImmutableArray<UIComponentPropertyModel> properties, ImmutableArray<UIComponentPropertyBlockModel> blocks, ImmutableArray<UIComponentPropertyDefaultModel> defaults)
    {
        if (properties.IsDefaultOrEmpty && blocks.IsDefaultOrEmpty && defaults.IsDefaultOrEmpty)
            return [];

        HintNameGroups<UIComponentTypeModel, TypeWorkItem> groups = new();
        Dictionary<string, List<DiagnosticInfo>> diagnosticsByHintName = [with(System.StringComparer.Ordinal)];

        if (!properties.IsDefaultOrEmpty)
        {
            foreach (UIComponentPropertyModel property in properties)
                groups.GetOrAdd(property.Owner, property.Owner.Declaration).Add(new TypeWorkItem(property, null));
        }

        if (!blocks.IsDefaultOrEmpty)
        {
            foreach (UIComponentPropertyBlockModel block in blocks)
            {
                List<TypeWorkItem> target = groups.GetOrAdd(block.Owner, block.Owner.Declaration);
                AppendGroupDiagnostics(diagnosticsByHintName, block.Owner.Declaration.HintName, block.Diagnostics);

                foreach (UIComponentPropertyModel property in block.Properties)
                    target.Add(new TypeWorkItem(property, null));
            }
        }

        if (!defaults.IsDefaultOrEmpty)
        {
            foreach (UIComponentPropertyDefaultModel defaultModel in defaults)
            {
                List<TypeWorkItem> target = groups.GetOrAdd(defaultModel.Owner, defaultModel.Owner.Declaration);
                AppendGroupDiagnostics(diagnosticsByHintName, defaultModel.Owner.Declaration.HintName, defaultModel.Diagnostics);

                foreach (UIComponentPropertyDefaultOverrideModel defaultOverride in defaultModel.Overrides)
                    target.Add(new TypeWorkItem(null, defaultOverride));
            }
        }

        ImmutableArray<TypeWorkGroup>.Builder result = ImmutableArray.CreateBuilder<TypeWorkGroup>(groups.Groups.Count);

        foreach ((UIComponentTypeModel owner, List<TypeWorkItem> items) in groups.Groups)
        {
            EquatableArray<DiagnosticInfo> diagnostics = diagnosticsByHintName.TryGetValue(owner.Declaration.HintName, out List<DiagnosticInfo>? ownerDiagnostics)
                ? ownerDiagnostics.ToEquatableArray()
                : EquatableArray<DiagnosticInfo>.Empty;

            result.Add(new TypeWorkGroup(owner, items.ToEquatableArray(), diagnostics));
        }

        return result.MoveToImmutable();
    }

    private static void AppendGroupDiagnostics(Dictionary<string, List<DiagnosticInfo>> diagnosticsByHintName, string hintName, EquatableArray<DiagnosticInfo> diagnostics)
    {
        if (diagnostics.Count == 0)
            return;

        if (!diagnosticsByHintName.TryGetValue(hintName, out List<DiagnosticInfo>? list))
            diagnosticsByHintName[hintName] = list = [];

        foreach (DiagnosticInfo diagnostic in diagnostics)
            list.Add(diagnostic);
    }

    private static void ExecuteType(SourceProductionContext context, TypeWorkGroup group)
    {
        UIComponentTypeModel type = group.Owner;
        var hasErrors = false;

        foreach (DiagnosticInfo diagnostic in group.Diagnostics)
            context.ReportDiagnostic(diagnostic.ToDiagnostic());

        if (!type.Declaration.IsPartial)
        {
            context.ReportDiagnostic(Diagnostic.Create(UIComponentPropertyDiagnostics.ComponentMustBePartial, type.Declaration.Location?.ToLocation(), type.Declaration.DisplayName));

            hasErrors = true;
        }

        if (string.IsNullOrWhiteSpace(type.SelfType))
        {
            context.ReportDiagnostic(Diagnostic.Create(UIComponentPropertyDiagnostics.InvalidSelfType, type.Declaration.Location?.ToLocation(), type.Declaration.DisplayName));

            hasErrors = true;
        }

        foreach (TypeWorkItem item in group.Items)
        {
            if (item.Property is { } property)
            {
                foreach (DiagnosticInfo diagnostic in property.Diagnostics)
                    context.ReportDiagnostic(diagnostic.ToDiagnostic());

                hasErrors |= property.HasErrors;
            }
            else if (item.DefaultOverride is { } defaultOverride)
            {
                foreach (DiagnosticInfo diagnostic in defaultOverride.Diagnostics)
                    context.ReportDiagnostic(diagnostic.ToDiagnostic());

                hasErrors |= defaultOverride.HasErrors;
            }
        }

        if (hasErrors || group.Items.Count == 0)
            return;

        var source = GenerateType(type, group.Items);

        context.AddSource(type.Declaration.HintName, SourceText.From(source, Encoding.UTF8));
    }

    private static string GenerateType(UIComponentTypeModel type, EquatableArray<TypeWorkItem> items)
    {
        StringBuilder builder = new();

        // No usings: every name is spelled out from global::, so no type an application declares beside its component can take its place.
        _ = builder
            .AppendLine("// <auto-generated />")
            .AppendLine("#nullable enable")
            .AppendLine();

        if (type.Declaration.Namespace is not null)
        {
            _ = builder
                .Append("namespace ")
                .Append(type.Declaration.Namespace)
                .AppendLine(";")
                .AppendLine();
        }

        TypeDeclarationWriter.WriteTypeStart(builder, type.Declaration.Declarations);

        var hasContent = false;

        foreach (TypeWorkItem item in items)
        {
            if (item.Property is { } property)
                GeneratePropertyMembers(builder, property, type.SelfType!, ref hasContent);
            else if (item.DefaultOverride is { } defaultOverride)
                GenerateDefaultOverrideMember(builder, defaultOverride, type.SelfType!, ref hasContent);
        }

        TypeDeclarationWriter.WriteTypeEnd(builder, type.Declaration.Declarations);

        return builder.ToString();
    }

    private static void GeneratePropertyMembers(StringBuilder builder, UIComponentPropertyModel model, string selfType, ref bool hasContent)
    {
        var propertyName = model.Name;
        var propertyType = model.Type;

        var propertyDefinitionName = UIComponentPropertyNames.GetPropertyDefinitionName(propertyName);
        var uiPropertyName = UIComponentPropertyNames.GetUIPropertyName(propertyName);

        if (model.DeclareProperty)
        {
            TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

            _ = builder.AppendLine("    /// <inheritdoc/>");

            // Every attribute the contract member carries but [UIComponentProperty], re-declared on the generated property.
            foreach (var attribute in model.CarriedAttributes)
            {
                _ = builder
                    .Append("    [")
                    .Append(attribute)
                    .AppendLine("]");
            }

            _ = builder
                .Append("    public ")
                .Append(propertyType)
                .Append(' ')
                .Append(propertyName)
                .AppendLine(" { get; set; }");
        }

        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    private static global::NE.Standard.UI.Abstractions.Binding.Properties.UIPropertyDefinition ")
            .Append(propertyDefinitionName)
            .AppendLine(" { get; }")
            .Append("        = global::NE.Standard.UI.Authoring.Infrastructure.UIPropertyRegister.Create<")
            .Append(selfType)
            .Append(", ")
            .Append(propertyType)
            .Append(">(")
            .Append(model.PropertyArgument);

        if (!model.IsBindable)
        {
            _ = builder.Append(", isBindable: false");
        }
        else if (!string.IsNullOrWhiteSpace(model.BindingCapabilities) && model.BindingCapabilities != "global::NE.Standard.UI.Primitives.Binding.UIBindingCapabilities.SourceToTarget")
        {
            _ = builder
                .Append(", bindingCapabilities: ")
                .Append(model.BindingCapabilities);
        }

        if (model.DefaultValue is not null)
        {
            _ = builder
                .Append(", defaultValue: ")
                .Append(model.DefaultValue);
        }

        if (model.IsBindable && !string.IsNullOrWhiteSpace(model.DefaultBindingMode) && model.DefaultBindingMode != "global::NE.Standard.UI.Primitives.Binding.UIBindingMode.OneWay")
        {
            _ = builder
                .Append(", defaultBindingMode: ")
                .Append(model.DefaultBindingMode);
        }

        _ = builder.AppendLine(");");

        _ = builder
            .Append("    /// <summary>Gets the registered property key for <see cref=\"")
            .Append(propertyName)
            .AppendLine("\"/>.</summary>")
            .Append("    public static global::NE.Standard.UI.Abstractions.Binding.Properties.UIProperty ")
            .Append(uiPropertyName)
            .Append(" { get; } = ")
            .Append(propertyDefinitionName)
            .AppendLine(".Property;");

        if (model.GenerateSetter)
        {
            GenerateSetter(builder, model, selfType, ref hasContent);

            if (model.ResponsiveElementType is not null)
                GenerateResponsiveSetter(builder, model, selfType, model.ResponsiveElementType, ref hasContent);
        }

        if (model.GenerateBinder && model.IsBindable)
            GenerateBinders(builder, model, selfType, ref hasContent);
    }

    private static void GenerateSetter(StringBuilder builder, UIComponentPropertyModel model, string selfType, ref bool hasContent)
    {
        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    /// <summary>Sets <see cref=\"")
            .Append(model.Name)
            .AppendLine("\"/>.</summary>")
            .Append("    public ")
            .Append(selfType)
            .Append(' ')
            .Append(UIComponentPropertyNames.GetSetterName(model.Name))
            .Append('(')
            .Append(model.Type)
            .Append(" value)")
            .AppendLine();

        _ = builder.AppendLine("    {");

        if (model.ThrowIfNull)
            _ = builder.AppendLine("        global::System.ArgumentNullException.ThrowIfNull(value);");

        if (model.IsBindable)
        {
            _ = builder
                .Append("        RemoveNonOptionalBinding(")
                .Append(UIComponentPropertyNames.GetUIPropertyName(model.Name))
                .AppendLine(");");
        }

        _ = builder
            .Append("        ")
            .Append(model.Name)
            .AppendLine(" = value;")
            .AppendLine("        return Self;")
            .AppendLine("    }");
    }

    /// <summary>
    /// Emits a convenience overload for <c>UIResponsive&lt;T&gt;</c> properties so callers can write <c>SetWidth(200, md: 400)</c>.
    /// </summary>
    private static void GenerateResponsiveSetter(StringBuilder builder, UIComponentPropertyModel model, string selfType, string elementTypeName, ref bool hasContent)
    {
        var setterName = UIComponentPropertyNames.GetSetterName(model.Name);

        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    /// <summary>Sets <see cref=\"")
            .Append(model.Name)
            .AppendLine("\"/> with a value per breakpoint.</summary>")
            .Append("    public ")
            .Append(selfType)
            .Append(' ')
            .Append(setterName)
            .Append('(')
            .Append(elementTypeName)
            .Append(" value, ")
            .Append(elementTypeName)
            .Append("? sm = null, ")
            .Append(elementTypeName)
            .Append("? md = null, ")
            .Append(elementTypeName)
            .Append("? xl = null, ")
            .Append(elementTypeName)
            .Append("? xxl = null)")
            .AppendLine();

        _ = builder
            .Append("        => ")
            .Append(setterName)
            .Append("(new global::NE.Standard.UI.Abstractions.Styling.UIResponsive<")
            .Append(elementTypeName)
            .AppendLine(">(value, sm, md, xl, xxl));");
    }

    private static void GenerateBinders(StringBuilder builder, UIComponentPropertyModel model, string selfType, ref bool hasContent)
    {
        var propertyName = model.Name;
        var uiPropertyName = UIComponentPropertyNames.GetUIPropertyName(propertyName);
        var binderName = UIComponentPropertyNames.GetBinderName(propertyName);
        var scope = model.DefaultBindingScope ?? "global::NE.Standard.UI.Primitives.Binding.UIBindingScope.Root";
        var mode = model.DefaultBindingMode ?? "global::NE.Standard.UI.Primitives.Binding.UIBindingMode.OneWay";

        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    /// <summary>Binds <see cref=\"")
            .Append(propertyName)
            .AppendLine("\"/> to a path.</summary>")
            .Append("    public ")
            .Append(selfType)
            .Append(' ')
            .Append(binderName)
            .Append("(string path, global::NE.Standard.UI.Primitives.Binding.UIBindingScope scope = ")
            .Append(scope)
            .Append(", global::NE.Standard.UI.Primitives.Binding.UIBindingMode mode = ")
            .Append(mode)
            .Append(", bool optional = false)")
            .AppendLine();

        _ = builder
            .Append("        => Bind(")
            .Append(uiPropertyName)
            .AppendLine(", path, scope, mode, optional);");

        _ = builder
            .Append("    /// <summary>Binds <see cref=\"")
            .Append(propertyName)
            .AppendLine("\"/> to a path.</summary>")
            .Append("    public ")
            .Append(selfType)
            .Append(' ')
            .Append(binderName)
            .Append("(global::NE.Standard.UI.Abstractions.Recursive.RecursivePath path, global::NE.Standard.UI.Primitives.Binding.UIBindingScope scope = ")
            .Append(scope)
            .Append(", global::NE.Standard.UI.Primitives.Binding.UIBindingMode mode = ")
            .Append(mode)
            .Append(", bool optional = false)")
            .AppendLine();

        _ = builder
            .Append("        => Bind(")
            .Append(uiPropertyName)
            .AppendLine(", path, scope, mode, optional);");

        _ = builder
            .Append("    /// <summary>Binds <see cref=\"")
            .Append(propertyName)
            .AppendLine("\"/> to a path.</summary>")
            .Append("    public ")
            .Append(selfType)
            .Append(' ')
            .Append(binderName)
            .Append("<TSource>(global::System.Linq.Expressions.Expression<global::System.Func<TSource, object?>> path, global::NE.Standard.UI.Primitives.Binding.UIBindingScope scope = ")
            .Append(scope)
            .Append(", global::NE.Standard.UI.Primitives.Binding.UIBindingMode mode = ")
            .Append(mode)
            .Append(", bool optional = false)")
            .AppendLine();

        _ = builder
            .Append("        => Bind(")
            .Append(uiPropertyName)
            .AppendLine(", global::NE.Standard.UI.Abstractions.Recursive.RecursivePath.FromExpression(path), scope, mode, optional);");
    }

    private static void GenerateDefaultOverrideMember(StringBuilder builder, UIComponentPropertyDefaultOverrideModel model, string selfType, ref bool hasContent)
    {
        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    private static global::NE.Standard.UI.Abstractions.Binding.Properties.UIPropertyDefinition ")
            .Append(UIComponentPropertyNames.GetPropertyDefaultName(model.Name))
            .AppendLine(" { get; }")
            .Append("        = global::NE.Standard.UI.Authoring.Infrastructure.UIPropertyRegister.OverrideDefault<")
            .Append(selfType)
            .Append(", ")
            .Append(model.Type)
            .Append(">(typeof(")
            .Append(model.DeclaringType)
            .Append("), ")
            .Append(model.PropertyArgument)
            .Append(", ")
            .Append(model.DefaultValue)
            .AppendLine(");");
    }

    private readonly record struct TypeWorkGroup(UIComponentTypeModel Owner, EquatableArray<TypeWorkItem> Items, EquatableArray<DiagnosticInfo> Diagnostics);

    private readonly record struct TypeWorkItem(UIComponentPropertyModel? Property, UIComponentPropertyDefaultOverrideModel? DefaultOverride);
}
