using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using NE.Standard.UI.Generators.Infrastructure;

namespace NE.Standard.UI.Generators.ComponentProperties;

/// <summary>
/// Generates the fluent <c>Set*</c> methods, backing-field storage, and property registration for
/// members annotated with <c>[UIComponentProperty]</c>.
/// </summary>
[Generator(LanguageNames.CSharp)]
public sealed class UIComponentPropertyGenerator : IIncrementalGenerator
{
    /// <inheritdoc/>
    public void Initialize(IncrementalGeneratorInitializationContext context)
    {
        IncrementalValuesProvider<UIComponentPropertyModel?> properties = context.SyntaxProvider.ForAttributeWithMetadataName(
            UIComponentPropertyNames.AttributeMetadataName,
            predicate: static (node, _) => node is PropertyDeclarationSyntax,
            transform: static (ctx, ct) => CreatePropertyModel(ctx, ct));

        IncrementalValueProvider<(Compilation Compilation, ImmutableArray<UIComponentPropertyModel> Properties)> source =
            context.CompilationProvider.Combine(properties
                .Where(static model => model is not null)
                .Select(static (model, _) => model!)
                .Collect()
            );

        context.RegisterSourceOutput(source, static (ctx, source) => Execute(ctx, source.Compilation, source.Properties));
    }

    private static UIComponentPropertyModel? CreatePropertyModel(GeneratorAttributeSyntaxContext context, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (context.TargetNode is not PropertyDeclarationSyntax propertySyntax)
            return null;

        if (context.TargetSymbol is not IPropertySymbol propertySymbol)
            return null;

        INamedTypeSymbol? containingType = propertySymbol.ContainingType;

        if (containingType is null)
            return null;

        AttributeData? attribute = null;

        foreach (AttributeData candidate in propertySymbol.GetAttributes())
        {
            if (candidate.AttributeClass?.ToDisplayString() == UIComponentPropertyNames.AttributeMetadataName)
            {
                attribute = candidate;
                break;
            }
        }

        if (attribute is null)
            return null;

        return new UIComponentPropertyModel(
            PropertySyntax: propertySyntax,
            Property: propertySymbol,
            ContainingType: containingType,
            Values: UIComponentPropertyAttributeValues.From(attribute)
        );
    }

    private static void Execute(SourceProductionContext context, Compilation compilation, ImmutableArray<UIComponentPropertyModel> properties)
    {
        if (properties.IsDefaultOrEmpty)
            return;

        INamedTypeSymbol? responsiveTypeDefinition = compilation.GetTypeByMetadataName("NE.Standard.UI.Abstractions.Styling.UIResponsive`1");

        foreach (IGrouping<ISymbol?, UIComponentPropertyModel> group in properties.GroupBy(static property => property.ContainingType, SymbolEqualityComparer.Default))
        {
            if (group.Key is not INamedTypeSymbol type)
                continue;

            ImmutableArray<UIComponentPropertyModel> groupProperties = [.. group];

            var hasErrors = false;

            if (!type.IsPartial())
            {
                context.ReportDiagnostic(Diagnostic.Create(
                    UIComponentPropertyDiagnostics.ComponentMustBePartial,
                    type.Locations.FirstOrDefault(),
                    type.ToDisplayString()));

                hasErrors = true;
            }

            var selfType = GetSelfType(type);

            if (string.IsNullOrWhiteSpace(selfType))
            {
                context.ReportDiagnostic(Diagnostic.Create(
                    UIComponentPropertyDiagnostics.InvalidSelfType,
                    type.Locations.FirstOrDefault(),
                    type.ToDisplayString()
                ));

                hasErrors = true;
            }

            foreach (UIComponentPropertyModel property in groupProperties)
                ValidateProperty(context, compilation, property, ref hasErrors);

            if (hasErrors)
                continue;

            var source = GenerateType(type, groupProperties, selfType!, responsiveTypeDefinition);
            var hintName = HintNameBuilder.Build(type, "UIComponentProperties");

            context.AddSource(hintName, SourceText.From(source, Encoding.UTF8));
        }
    }

    private static string? GetSelfType(INamedTypeSymbol type)
    {
        foreach (ITypeParameterSymbol parameter in type.TypeParameters)
        {
            if (parameter.Name is "T" or "TComponent")
                return parameter.Name;
        }

        return type.TypeParameters.Length == 0
            ? type.ToDisplayString(SymbolDisplayFormats.GlobalNonNullableType)
            : type.TypeParameters.Length == 1 ? type.TypeParameters[0].Name : null;
    }

    private static void ValidateProperty(SourceProductionContext context, Compilation compilation, UIComponentPropertyModel model, ref bool hasErrors)
    {
        UIComponentPropertyAttributeValues values = model.Values;

        ValidateDefaultValueConfiguration(context, model, ref hasErrors);

        if (model.Property.DeclaredAccessibility != Accessibility.Public)
        {
            context.ReportDiagnostic(Diagnostic.Create(
                UIComponentPropertyDiagnostics.PropertyMustBePublic,
                model.Property.Locations.FirstOrDefault(),
                model.Property.Name
            ));

            hasErrors = true;
        }

        if (model.Property.IsStatic)
        {
            context.ReportDiagnostic(Diagnostic.Create(
                UIComponentPropertyDiagnostics.PropertyCannotBeStatic,
                model.Property.Locations.FirstOrDefault(),
                model.Property.Name
            ));

            hasErrors = true;
        }

        if (model.Property.Parameters.Length != 0)
        {
            context.ReportDiagnostic(Diagnostic.Create(
                UIComponentPropertyDiagnostics.PropertyCannotBeIndexer,
                model.Property.Locations.FirstOrDefault(),
                model.Property.Name
            ));

            hasErrors = true;
        }

        if (!values.IsBindable && values.GenerateBinder)
        {
            context.ReportDiagnostic(Diagnostic.Create(
                UIComponentPropertyDiagnostics.InvalidBindableConfiguration,
                model.Property.Locations.FirstOrDefault(),
                model.Property.Name
            ));

            hasErrors = true;
        }

        if (values.GenerateSetter && model.Property.SetMethod is null)
        {
            context.ReportDiagnostic(Diagnostic.Create(
                UIComponentPropertyDiagnostics.PropertyMustBeSettable,
                model.Property.Locations.FirstOrDefault(),
                model.Property.Name
            ));

            hasErrors = true;
        }

        ValidateGeneratedPropertyMember(context, model, UIComponentPropertyNames.GetPropertyDefinitionName(model.Property.Name), ref hasErrors);
        ValidateGeneratedPropertyMember(context, model, UIComponentPropertyNames.GetUIPropertyName(model.Property.Name), ref hasErrors);

        if (values.GenerateSetter)
            ValidateGeneratedSetterMember(context, model, ref hasErrors);

        if (values.GenerateBinder && values.IsBindable)
            ValidateGeneratedBinderMembers(context, compilation, model, ref hasErrors);

        if (values.Contract is not null)
            ValidateContractProperty(context, compilation, model, ref hasErrors);

        if (!string.IsNullOrWhiteSpace(values.DefaultValueMember))
            ValidateDefaultValueMember(context, model, ref hasErrors);
    }

    private static void ValidateDefaultValueConfiguration(SourceProductionContext context, UIComponentPropertyModel model, ref bool hasErrors)
    {
        UIComponentPropertyAttributeValues values = model.Values;

        if (values.HasDefaultValue && !string.IsNullOrWhiteSpace(values.DefaultValueMember))
        {
            ReportInvalidDefaultValueConfiguration(context, model, $"Property '{model.Property.Name}' cannot specify both DefaultValue and DefaultValueMember");

            hasErrors = true;
            return;
        }

        if (values.HasDefaultValue)
            return;

        if (values.DefaultValueMember is null)
            return;

        if (string.IsNullOrWhiteSpace(values.DefaultValueMember))
        {
            ReportInvalidDefaultValueConfiguration(context, model, $"Property '{model.Property.Name}' cannot specify an empty DefaultValueMember");

            hasErrors = true;
            return;
        }

        if (!IdentifierValidator.IsSimpleIdentifier(values.DefaultValueMember))
        {
            ReportInvalidDefaultValueConfiguration(context, model, $"Property '{model.Property.Name}' DefaultValueMember must be a static member name declared on the component type");

            hasErrors = true;
        }
    }

    private static void ReportInvalidDefaultValueConfiguration(SourceProductionContext context, UIComponentPropertyModel model, string message)
        => context.ReportDiagnostic(Diagnostic.Create(UIComponentPropertyDiagnostics.InvalidDefaultValueConfiguration, model.Property.Locations.FirstOrDefault(), message));

    private static void ValidateGeneratedPropertyMember(SourceProductionContext context, UIComponentPropertyModel model, string memberName, ref bool hasErrors)
    {
        foreach (ISymbol member in model.ContainingType.GetMembers(memberName))
        {
            if (SymbolEqualityComparer.Default.Equals(member, model.Property))
                continue;

            context.ReportDiagnostic(Diagnostic.Create(
                UIComponentPropertyDiagnostics.GeneratedMemberConflict,
                model.Property.Locations.FirstOrDefault(),
                memberName,
                model.ContainingType.ToDisplayString()
            ));

            hasErrors = true;
            return;
        }
    }

    private static void ValidateGeneratedSetterMember(SourceProductionContext context, UIComponentPropertyModel model, ref bool hasErrors)
    {
        var memberName = UIComponentPropertyNames.GetSetterName(model.Property.Name);

        foreach (ISymbol member in model.ContainingType.GetMembers(memberName))
        {
            if (member is not IMethodSymbol method)
                continue;

            if (method.Parameters.Length != 1)
                continue;

            if (!SymbolEqualityComparer.Default.Equals(method.Parameters[0].Type.WithNullableAnnotation(NullableAnnotation.NotAnnotated), model.Property.Type.WithNullableAnnotation(NullableAnnotation.NotAnnotated)))
                continue;

            context.ReportDiagnostic(Diagnostic.Create(
                UIComponentPropertyDiagnostics.GeneratedMemberConflict,
                model.Property.Locations.FirstOrDefault(),
                memberName,
                model.ContainingType.ToDisplayString()
            ));

            hasErrors = true;
            return;
        }
    }

    private static void ValidateGeneratedBinderMembers(SourceProductionContext context, Compilation compilation, UIComponentPropertyModel model, ref bool hasErrors)
    {
        var memberName = UIComponentPropertyNames.GetBinderName(model.Property.Name);

        INamedTypeSymbol? recursivePathType = compilation.GetTypeByMetadataName(UIComponentPropertyNames.RecursivePathMetadataName);

        foreach (ISymbol member in model.ContainingType.GetMembers(memberName))
        {
            if (member is not IMethodSymbol method)
                continue;

            if (method.Parameters.Length != 3)
                continue;

            ITypeSymbol firstParameterType = method.Parameters[0].Type;

            var conflictsWithStringOverload = firstParameterType.SpecialType == SpecialType.System_String;

            var conflictsWithRecursivePathOverload =
                recursivePathType is not null &&
                SymbolEqualityComparer.Default.Equals(firstParameterType, recursivePathType);

            if (!conflictsWithStringOverload && !conflictsWithRecursivePathOverload)
                continue;

            context.ReportDiagnostic(Diagnostic.Create(
                UIComponentPropertyDiagnostics.GeneratedMemberConflict,
                model.Property.Locations.FirstOrDefault(),
                memberName,
                model.ContainingType.ToDisplayString()
            ));

            hasErrors = true;
            return;
        }
    }

    private static void ValidateContractProperty(SourceProductionContext context, Compilation compilation, UIComponentPropertyModel model, ref bool hasErrors)
    {
        INamedTypeSymbol contract = model.Values.Contract!;
        var contractPropertyName = GetContractPropertyName(model);
        INamedTypeSymbol? uiPropertyType = compilation.GetTypeByMetadataName(UIComponentPropertyNames.UIPropertyMetadataName);

        foreach (ISymbol member in contract.GetMembers(contractPropertyName))
        {
            if (member is not IPropertySymbol property)
                continue;

            if (!property.IsStatic)
                continue;

            if (uiPropertyType is not null && !SymbolEqualityComparer.Default.Equals(property.Type, uiPropertyType))
                continue;

            return;
        }

        context.ReportDiagnostic(Diagnostic.Create(
            UIComponentPropertyDiagnostics.ContractPropertyNotFound,
            model.Property.Locations.FirstOrDefault(),
            contract.ToDisplayString(),
            contractPropertyName
        ));

        hasErrors = true;
    }

    private static string GetContractPropertyName(UIComponentPropertyModel model)
        => !string.IsNullOrWhiteSpace(model.Values.ContractPropertyName)
            ? model.Values.ContractPropertyName!
            : model.Property.Name + "Property";

    private static void ValidateDefaultValueMember(SourceProductionContext context, UIComponentPropertyModel model, ref bool hasErrors)
    {
        var memberName = model.Values.DefaultValueMember!;

        foreach (ISymbol member in model.ContainingType.GetMembers(memberName))
        {
            if (member is IFieldSymbol field)
            {
                if (field.IsStatic)
                    return;

                ReportInvalidDefaultValueMemberKind(context, model, memberName);
                hasErrors = true;
                return;
            }

            if (member is IPropertySymbol property)
            {
                if (property.IsStatic)
                    return;

                ReportInvalidDefaultValueMemberKind(context, model, memberName);
                hasErrors = true;
                return;
            }

            if (member is IMethodSymbol method)
            {
                if (method.IsStatic && method.Parameters.Length == 0)
                    return;

                ReportInvalidDefaultValueMemberKind(context, model, memberName);
                hasErrors = true;
                return;
            }
        }

        context.ReportDiagnostic(Diagnostic.Create(
            UIComponentPropertyDiagnostics.DefaultValueMemberNotFound,
            model.Property.Locations.FirstOrDefault(),
            memberName,
            model.ContainingType.ToDisplayString()
        ));

        hasErrors = true;
    }

    private static void ReportInvalidDefaultValueMemberKind(SourceProductionContext context, UIComponentPropertyModel model, string memberName)
    {
        context.ReportDiagnostic(Diagnostic.Create(
            UIComponentPropertyDiagnostics.InvalidDefaultValueMemberKind,
            model.Property.Locations.FirstOrDefault(),
            memberName,
            model.ContainingType.ToDisplayString()
        ));
    }

    private static string GenerateType(INamedTypeSymbol type, ImmutableArray<UIComponentPropertyModel> properties, string selfType, INamedTypeSymbol? responsiveTypeDefinition)
    {
        StringBuilder builder = new();

        _ = builder
            .AppendLine("// <auto-generated />")
            .AppendLine("#nullable enable")
            .AppendLine()
            .AppendLine("using System;")
            .AppendLine("using NE.Standard.UI.Abstractions.Binding;")
            .AppendLine("using NE.Standard.UI.Abstractions.Binding.Properties;")
            .AppendLine("using NE.Standard.UI.Abstractions.Recursive;")
            .AppendLine("using NE.Standard.UI.Authoring.Infrastructure;")
            .AppendLine("using NE.Standard.UI.Primitives.Binding;")
            .AppendLine();

        var ns = type.ContainingNamespace.IsGlobalNamespace
            ? null
            : type.ContainingNamespace.ToDisplayString();

        if (ns is not null)
        {
            _ = builder
                .Append("namespace ")
                .Append(ns)
                .AppendLine(";")
                .AppendLine();
        }

        TypeDeclarationWriter.WriteContainingTypesStart(builder, type);
        TypeDeclarationWriter.WritePartialTypeStart(builder, type);

        var hasContent = false;

        foreach (UIComponentPropertyModel property in properties)
            GeneratePropertyMembers(builder, property, selfType, responsiveTypeDefinition, ref hasContent);

        _ = builder.AppendLine("}");

        TypeDeclarationWriter.WriteContainingTypesEnd(builder, type);

        return builder.ToString();
    }

    private static void GeneratePropertyMembers(StringBuilder builder, UIComponentPropertyModel model, string selfType, INamedTypeSymbol? responsiveTypeDefinition, ref bool hasContent)
    {
        IPropertySymbol property = model.Property;
        UIComponentPropertyAttributeValues values = model.Values;

        var propertyName = property.Name;
        var propertyType = property.Type.ToGlobalTypeDisplayString();
        var setterType = property.Type.ToPatternTypeDisplayString();

        var propertyDefinitionName = UIComponentPropertyNames.GetPropertyDefinitionName(propertyName);
        var uiPropertyName = UIComponentPropertyNames.GetUIPropertyName(propertyName);

        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    private static UIPropertyDefinition ")
            .Append(propertyDefinitionName)
            .AppendLine(" { get; }")
            .Append("        = UIPropertyRegister.Create<")
            .Append(selfType)
            .Append(", ")
            .Append(propertyType)
            .Append(">(")
            .Append(BuildPropertyArgument(model));

        if (!values.IsBindable)
        {
            _ = builder.Append(", isBindable: false");
        }
        else if (!string.IsNullOrWhiteSpace(values.BindingCapabilities) && values.BindingCapabilities != "global::NE.Standard.UI.Primitives.Binding.UIBindingCapabilities.SourceToTarget")
        {
            _ = builder
                .Append(", bindingCapabilities: ")
                .Append(values.BindingCapabilities);
        }

        if (values.HasDefaultValue)
        {
            _ = builder
                .Append(", defaultValue: ")
                .Append(values.DefaultValueSource);
        }
        else if (!string.IsNullOrWhiteSpace(values.DefaultValueMember))
        {
            _ = builder
                .Append(", defaultValue: ")
                .Append(values.DefaultValueMember);
        }

        _ = builder.AppendLine(");");

        _ = builder
            .Append("    public static UIProperty ")
            .Append(uiPropertyName)
            .Append(" { get; } = ")
            .Append(propertyDefinitionName)
            .AppendLine(".Property;");

        if (values.GenerateSetter)
        {
            GenerateSetter(builder, model, selfType, setterType, ref hasContent);

            if (TryGetResponsiveElementType(property.Type, responsiveTypeDefinition, out ITypeSymbol elementType))
                GenerateResponsiveSetter(builder, model, selfType, elementType, ref hasContent);
        }

        if (values.GenerateBinder && values.IsBindable)
            GenerateBinders(builder, model, selfType, ref hasContent);
    }

    private static string BuildPropertyArgument(UIComponentPropertyModel model)
    {
        if (model.Values.Contract is null)
            return "nameof(" + model.Property.Name + ")";

        var contractType = model.Values.Contract.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat);
        var contractPropertyName = GetContractPropertyName(model);

        return contractType + "." + contractPropertyName;
    }

    private static void GenerateSetter(StringBuilder builder, UIComponentPropertyModel model, string selfType, string setterType, ref bool hasContent)
    {
        IPropertySymbol property = model.Property;

        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    public ")
            .Append(selfType)
            .Append(' ')
            .Append(UIComponentPropertyNames.GetSetterName(property.Name))
            .Append('(')
            .Append(setterType)
            .Append(" value)")
            .AppendLine();

        _ = builder.AppendLine("    {");

        if (property.Type.IsNonNullableReferenceType())
            _ = builder.AppendLine("        ArgumentNullException.ThrowIfNull(value);");

        _ = builder
            .Append("        ")
            .Append(property.Name)
            .AppendLine(" = value;")
            .AppendLine("        return Self;")
            .AppendLine("    }");
    }

    /// <summary>
    /// Detects whether a property's type is (nullable-)<c>UIResponsive&lt;T&gt;</c> and, if so, returns
    /// its <c>T</c> element type — the signal for <see cref="GenerateResponsiveSetter"/> to additionally
    /// emit a per-breakpoint setter overload alongside the ordinary one-value setter.
    /// </summary>
    private static bool TryGetResponsiveElementType(ITypeSymbol propertyType, INamedTypeSymbol? responsiveTypeDefinition, out ITypeSymbol elementType)
    {
        elementType = null!;

        if (responsiveTypeDefinition is null)
            return false;

        ITypeSymbol unwrapped = propertyType is INamedTypeSymbol { OriginalDefinition.SpecialType: SpecialType.System_Nullable_T } nullable
            ? nullable.TypeArguments[0]
            : propertyType;

        if (unwrapped is not INamedTypeSymbol { IsGenericType: true } named || !SymbolEqualityComparer.Default.Equals(named.OriginalDefinition, responsiveTypeDefinition))
            return false;

        elementType = named.TypeArguments[0];
        return true;
    }

    /// <summary>
    /// Emits a convenience overload for <c>UIResponsive&lt;T&gt;</c>-typed properties so callers can
    /// write <c>SetWidth(200, md: 400)</c> instead of constructing the struct by hand — mirrors how
    /// value types like <c>UIGridPlacement</c>/<c>UIThemeColor</c> expose their own convenience factories,
    /// just generated instead of hand-written since the shape is fixed (one base value, four optional
    /// breakpoint overrides) for every <c>UIResponsive&lt;T&gt;</c> property.
    /// </summary>
    private static void GenerateResponsiveSetter(StringBuilder builder, UIComponentPropertyModel model, string selfType, ITypeSymbol elementType, ref bool hasContent)
    {
        var elementTypeName = elementType.ToGlobalNonNullableTypeDisplayString();
        var setterName = UIComponentPropertyNames.GetSetterName(model.Property.Name);

        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
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
        var propertyName = model.Property.Name;
        var uiPropertyName = UIComponentPropertyNames.GetUIPropertyName(propertyName);
        var binderName = UIComponentPropertyNames.GetBinderName(propertyName);
        var scope = model.Values.DefaultBindingScope ?? "global::NE.Standard.UI.Primitives.Binding.UIBindingScope.Root";
        var mode = model.Values.DefaultBindingMode ?? "global::NE.Standard.UI.Primitives.Binding.UIBindingMode.OneWay";

        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    public ")
            .Append(selfType)
            .Append(' ')
            .Append(binderName)
            .Append("(string path, UIBindingScope scope = ")
            .Append(scope)
            .Append(", UIBindingMode mode = ")
            .Append(mode)
            .Append(')')
            .AppendLine();

        _ = builder
            .Append("        => Bind(")
            .Append(uiPropertyName)
            .AppendLine(", path, scope, mode);");

        _ = builder
            .Append("    public ")
            .Append(selfType)
            .Append(' ')
            .Append(binderName)
            .Append("(RecursivePath path, UIBindingScope scope = ")
            .Append(scope)
            .Append(", UIBindingMode mode = ")
            .Append(mode)
            .Append(')')
            .AppendLine();

        _ = builder
            .Append("        => Bind(")
            .Append(uiPropertyName)
            .AppendLine(", path, scope, mode);");
    }
}
