using System.Collections.Generic;
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

        IncrementalValuesProvider<UIComponentPropertyBlockModel?> blocks = context.SyntaxProvider.ForAttributeWithMetadataName(
            UIComponentPropertyNames.BlockAttributeMetadataName,
            predicate: static (node, _) => node is ClassDeclarationSyntax,
            transform: static (ctx, ct) => CreateBlockModel(ctx, ct));

        IncrementalValueProvider<(Compilation Compilation, ImmutableArray<UIComponentPropertyModel> Properties, ImmutableArray<UIComponentPropertyBlockModel> Blocks)> source =
            context.CompilationProvider
                .Combine(properties
                    .Where(static model => model is not null)
                    .Select(static (model, _) => model!)
                    .Collect()
                )
                .Combine(blocks
                    .Where(static model => model is not null)
                    .Select(static (model, _) => model!)
                    .Collect()
                )
                .Select(static (pair, _) => (pair.Left.Left, pair.Left.Right, pair.Right));

        context.RegisterSourceOutput(source, static (ctx, source) => Execute(ctx, source.Compilation, source.Properties, source.Blocks));
    }

    private static UIComponentPropertyModel? CreatePropertyModel(GeneratorAttributeSyntaxContext context, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (context.TargetNode is not PropertyDeclarationSyntax)
            return null;

        if (context.TargetSymbol is not IPropertySymbol propertySymbol)
            return null;

        INamedTypeSymbol? containingType = propertySymbol.ContainingType;

        if (containingType is null)
            return null;

        // An annotated interface member is a property block's source, not a component of its own — it is
        // generated onto whoever carries [UIComponentPropertyBlock] for that contract.
        if (containingType.TypeKind == TypeKind.Interface)
            return null;

        AttributeData? attribute = FindComponentPropertyAttribute(propertySymbol);

        if (attribute is null)
            return null;

        return new UIComponentPropertyModel(
            Property: propertySymbol,
            ContainingType: containingType,
            Values: UIComponentPropertyAttributeValues.From(attribute)
        );
    }

    private static UIComponentPropertyBlockModel? CreateBlockModel(GeneratorAttributeSyntaxContext context, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (context.TargetSymbol is not INamedTypeSymbol type)
            return null;

        ImmutableArray<INamedTypeSymbol>.Builder contracts = ImmutableArray.CreateBuilder<INamedTypeSymbol>();

        foreach (AttributeData attribute in context.Attributes)
        {
            if (attribute.ConstructorArguments.Length == 1 && attribute.ConstructorArguments[0].Value is INamedTypeSymbol contract)
                contracts.Add(contract);
        }

        return contracts.Count == 0 ? null : new UIComponentPropertyBlockModel(type, contracts.ToImmutable());
    }

    private static void Execute(SourceProductionContext context, Compilation compilation, ImmutableArray<UIComponentPropertyModel> properties, ImmutableArray<UIComponentPropertyBlockModel> blocks)
    {
        if (properties.IsDefaultOrEmpty && blocks.IsDefaultOrEmpty)
            return;

        INamedTypeSymbol? responsiveTypeDefinition = compilation.GetTypeByMetadataName("NE.Standard.UI.Abstractions.Styling.UIResponsive`1");

        foreach ((INamedTypeSymbol type, ImmutableArray<UIComponentPropertyModel> groupProperties) in GroupByType(context, properties, blocks))
        {
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

    /// <summary>
    /// Pairs every component type with its own annotated properties plus what its <c>[UIComponentPropertyBlock]</c> contracts contribute.
    /// </summary>
    private static List<(INamedTypeSymbol Type, ImmutableArray<UIComponentPropertyModel> Properties)> GroupByType(
        SourceProductionContext context,
        ImmutableArray<UIComponentPropertyModel> properties,
        ImmutableArray<UIComponentPropertyBlockModel> blocks)
    {
        Dictionary<ISymbol, List<UIComponentPropertyModel>> byType = new(SymbolEqualityComparer.Default);
        List<INamedTypeSymbol> order = [];

        if (!properties.IsDefaultOrEmpty)
        {
            foreach (UIComponentPropertyModel property in properties)
                GetOrAddType(byType, order, property.ContainingType).Add(property);
        }

        if (!blocks.IsDefaultOrEmpty)
        {
            foreach (UIComponentPropertyBlockModel block in blocks)
            {
                List<UIComponentPropertyModel> target = GetOrAddType(byType, order, block.Type);

                foreach (INamedTypeSymbol contract in block.Contracts)
                    AppendBlockProperties(context, block.Type, contract, target);
            }
        }

        List<(INamedTypeSymbol Type, ImmutableArray<UIComponentPropertyModel> Properties)> grouped = [];

        foreach (INamedTypeSymbol type in order)
            grouped.Add((type, [.. byType[type]]));

        return grouped;
    }

    private static List<UIComponentPropertyModel> GetOrAddType(Dictionary<ISymbol, List<UIComponentPropertyModel>> byType, List<INamedTypeSymbol> order, INamedTypeSymbol type)
    {
        if (byType.TryGetValue(type, out List<UIComponentPropertyModel> existing))
            return existing;

        List<UIComponentPropertyModel> created = [];

        byType.Add(type, created);
        order.Add(type);

        return created;
    }

    private static void AppendBlockProperties(SourceProductionContext context, INamedTypeSymbol type, INamedTypeSymbol contract, List<UIComponentPropertyModel> target)
    {
        if (contract.TypeKind != TypeKind.Interface)
        {
            context.ReportDiagnostic(Diagnostic.Create(
                UIComponentPropertyDiagnostics.BlockContractNotAnInterface,
                type.Locations.FirstOrDefault(),
                contract.ToDisplayString(),
                type.ToDisplayString()
            ));

            return;
        }

        var found = false;
        HashSet<string> seen = [];

        // Properties are often declared one interface further down (ITextBaseComponent over ITextBaseModel), so the whole chain is walked.
        foreach (ISymbol member in EnumerateContractMembers(contract))
        {
            if (member is not IPropertySymbol property || property.IsStatic)
                continue;

            AttributeData? attribute = FindComponentPropertyAttribute(property);

            if (attribute is null || !seen.Add(property.Name))
                continue;

            found = true;

            if (IsDeclaredByHand(context, type, contract, property) || IsDeclaredByBase(type, property))
                continue;

            UIComponentPropertyAttributeValues values = UIComponentPropertyAttributeValues.From(attribute);

            // DefaultValueOwner is the declaring interface, not the one the block names, since interface statics are not inherited.
            target.Add(new UIComponentPropertyModel(
                Property: property,
                ContainingType: type,
                Values: values.Contract is null ? values with { Contract = contract } : values,
                DeclareProperty: true,
                DefaultValueOwner: property.ContainingType
            ));
        }

        if (!found)
        {
            context.ReportDiagnostic(Diagnostic.Create(
                UIComponentPropertyDiagnostics.BlockContractHasNoProperties,
                type.Locations.FirstOrDefault(),
                contract.ToDisplayString(),
                type.ToDisplayString()
            ));
        }
    }

    private static IEnumerable<ISymbol> EnumerateContractMembers(INamedTypeSymbol contract)
    {
        foreach (ISymbol member in contract.GetMembers())
            yield return member;

        foreach (INamedTypeSymbol inherited in contract.AllInterfaces)
        {
            foreach (ISymbol member in inherited.GetMembers())
                yield return member;
        }
    }

    /// <summary>
    /// Whether the consuming type already declares the block member by hand, which wins over the generated one.
    /// </summary>
    private static bool IsDeclaredByHand(SourceProductionContext context, INamedTypeSymbol type, INamedTypeSymbol contract, IPropertySymbol property)
    {
        foreach (ISymbol member in type.GetMembers(property.Name))
        {
            if (member is not IPropertySymbol declared)
                continue;

            if (!SymbolEqualityComparer.Default.Equals(
                declared.Type.WithNullableAnnotation(NullableAnnotation.NotAnnotated),
                property.Type.WithNullableAnnotation(NullableAnnotation.NotAnnotated)))
            {
                context.ReportDiagnostic(Diagnostic.Create(
                    UIComponentPropertyDiagnostics.BlockPropertyTypeMismatch,
                    declared.Locations.FirstOrDefault(),
                    property.Name,
                    type.ToDisplayString(),
                    declared.Type.ToDisplayString(),
                    contract.ToDisplayString(),
                    property.Type.ToDisplayString()
                ));
            }

            return true;
        }

        return false;
    }

    /// <summary>
    /// Whether a base type already carries this property, so a wider block only adds what the base does not already have.
    /// </summary>
    /// <remarks>
    /// The base's blocks are read from its attributes rather than its members, since a generator cannot see what another pass produced.
    /// </remarks>
    private static bool IsDeclaredByBase(INamedTypeSymbol type, IPropertySymbol property)
    {
        for (INamedTypeSymbol? current = type.BaseType; current is not null; current = current.BaseType)
        {
            foreach (ISymbol member in current.GetMembers(property.Name))
            {
                if (member is IPropertySymbol)
                    return true;
            }

            foreach (AttributeData attribute in current.GetAttributes())
            {
                if (attribute.AttributeClass?.ToDisplayString() != UIComponentPropertyNames.BlockAttributeMetadataName)
                    continue;

                if (attribute.ConstructorArguments.Length == 1
                    && attribute.ConstructorArguments[0].Value is INamedTypeSymbol contract
                    && ContractDeclares(contract, property.Name))
                {
                    return true;
                }
            }
        }

        return false;
    }

    private static bool ContractDeclares(INamedTypeSymbol contract, string name)
    {
        foreach (ISymbol member in EnumerateContractMembers(contract))
        {
            if (member is IPropertySymbol candidate && !candidate.IsStatic && candidate.Name == name && FindComponentPropertyAttribute(candidate) is not null)
                return true;
        }

        return false;
    }

    private static AttributeData? FindComponentPropertyAttribute(IPropertySymbol property)
    {
        foreach (AttributeData candidate in property.GetAttributes())
        {
            if (candidate.AttributeClass?.ToDisplayString() == UIComponentPropertyNames.AttributeMetadataName)
                return candidate;
        }

        return null;
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

        // A block property is declared by the generator, so it always gets a setter even though the contract member is get-only.
        if (!model.DeclareProperty && values.GenerateSetter && model.Property.SetMethod is null)
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

        // A block property's default lives with the contract that declares it, not with the type it lands on.
        INamedTypeSymbol owner = model.DefaultValueOwner ?? model.ContainingType;

        foreach (ISymbol member in owner.GetMembers(memberName))
        {
            if (member is IFieldSymbol field)
            {
                if (field.IsStatic)
                    return;

                ReportInvalidDefaultValueMemberKind(context, model, owner, memberName);
                hasErrors = true;
                return;
            }

            if (member is IPropertySymbol property)
            {
                if (property.IsStatic)
                    return;

                ReportInvalidDefaultValueMemberKind(context, model, owner, memberName);
                hasErrors = true;
                return;
            }

            if (member is IMethodSymbol method)
            {
                if (method.IsStatic && method.Parameters.Length == 0)
                    return;

                ReportInvalidDefaultValueMemberKind(context, model, owner, memberName);
                hasErrors = true;
                return;
            }
        }

        context.ReportDiagnostic(Diagnostic.Create(
            UIComponentPropertyDiagnostics.DefaultValueMemberNotFound,
            model.Property.Locations.FirstOrDefault(),
            memberName,
            owner.ToDisplayString()
        ));

        hasErrors = true;
    }

    private static void ReportInvalidDefaultValueMemberKind(SourceProductionContext context, UIComponentPropertyModel model, INamedTypeSymbol owner, string memberName)
    {
        context.ReportDiagnostic(Diagnostic.Create(
            UIComponentPropertyDiagnostics.InvalidDefaultValueMemberKind,
            model.Property.Locations.FirstOrDefault(),
            memberName,
            owner.ToDisplayString()
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
        // Nullable, since null is the only spelling of "not set" a fluent setter can accept.
        var setterType = property.Type.ToGlobalTypeDisplayString();

        var propertyDefinitionName = UIComponentPropertyNames.GetPropertyDefinitionName(propertyName);
        var uiPropertyName = UIComponentPropertyNames.GetUIPropertyName(propertyName);

        if (model.DeclareProperty)
        {
            TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

            _ = builder.AppendLine("    /// <inheritdoc/>");

            AppendCarriedAttributes(builder, property);

            _ = builder
                .Append("    public ")
                .Append(propertyType)
                .Append(' ')
                .Append(propertyName)
                .AppendLine(" { get; set; }");
        }

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
            _ = builder.Append(", defaultValue: ");

            if (model.DefaultValueOwner is not null)
            {
                _ = builder
                    .Append(model.DefaultValueOwner.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat))
                    .Append('.');
            }

            _ = builder.Append(values.DefaultValueMember);
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

    /// <summary>
    /// Re-declares every attribute the contract member carries except <c>[UIComponentProperty]</c>, onto the generated property.
    /// </summary>
    private static void AppendCarriedAttributes(StringBuilder builder, IPropertySymbol property)
    {
        foreach (AttributeData attribute in property.GetAttributes())
        {
            if (attribute.AttributeClass is null || attribute.AttributeClass.ToDisplayString() == UIComponentPropertyNames.AttributeMetadataName)
                continue;

            // Nullability attributes are compiler bookkeeping; re-declaring one is a compile error rather than a copy.
            if (attribute.AttributeClass.ContainingNamespace?.ToDisplayString() == "System.Runtime.CompilerServices")
                continue;

            _ = builder
                .Append("    [")
                .Append(attribute.AttributeClass.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat));

            List<string> arguments = [];

            foreach (TypedConstant argument in attribute.ConstructorArguments)
                arguments.Add(TypedConstantRenderer.Render(argument));

            foreach (KeyValuePair<string, TypedConstant> argument in attribute.NamedArguments)
                arguments.Add(argument.Key + " = " + TypedConstantRenderer.Render(argument.Value));

            if (arguments.Count > 0)
            {
                _ = builder
                    .Append('(')
                    .Append(string.Join(", ", arguments))
                    .Append(')');
            }

            _ = builder.AppendLine("]");
        }
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
    /// Detects whether a property's type is (nullable-)<c>UIResponsive&lt;T&gt;</c> and, if so, returns its <c>T</c> element type.
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
    /// Emits a convenience overload for <c>UIResponsive&lt;T&gt;</c> properties so callers can write <c>SetWidth(200, md: 400)</c>.
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
