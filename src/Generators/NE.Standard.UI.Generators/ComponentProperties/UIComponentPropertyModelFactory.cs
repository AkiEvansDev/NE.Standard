using System.Collections.Generic;
using System.Threading;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Operations;
using NE.Standard.UI.Generators.Infrastructure;

namespace NE.Standard.UI.Generators.ComponentProperties;

/// <summary>
/// The property generator's transforms: everything read off symbols and the compilation — the validation included — so the
/// models that leave them are plain data the incremental driver can compare.
/// </summary>
internal static class UIComponentPropertyModelFactory
{
    private const string HintSuffix = "UIComponentProperties";
    private const string ResponsiveMetadataName = "NE.Standard.UI.Abstractions.Styling.UIResponsive`1";

    public static UIComponentPropertyModel? CreatePropertyModel(GeneratorAttributeSyntaxContext context, CancellationToken cancellationToken)
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

        PropertySymbols symbols = new(propertySymbol, containingType, UIComponentPropertyAttributeValues.From(attribute));

        return CreateModel(context.SemanticModel.Compilation, CreateTypeModel(containingType), symbols);
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

    private static UIComponentTypeModel CreateTypeModel(INamedTypeSymbol type)
        => new(GeneratedTypeModel.From(type, HintSuffix), GetSelfType(type));

    /// <summary>
    /// The type a fluent setter returns: the type parameter constrained to the type itself (<c>where T : Foo&lt;T&gt;</c>), else
    /// one named <c>T</c> or <c>TComponent</c>, else the type when it is not generic. A generic type with neither is reported
    /// rather than guessed at, since any other parameter is as likely an item or a value type as the component.
    /// </summary>
    private static string? GetSelfType(INamedTypeSymbol type)
    {
        foreach (ITypeParameterSymbol parameter in type.TypeParameters)
        {
            foreach (ITypeSymbol constraint in parameter.ConstraintTypes)
            {
                if (SymbolEqualityComparer.Default.Equals(constraint.OriginalDefinition, type.OriginalDefinition))
                    return parameter.Name;
            }
        }

        foreach (ITypeParameterSymbol parameter in type.TypeParameters)
        {
            if (parameter.Name is "T" or "TComponent")
                return parameter.Name;
        }

        return type.TypeParameters.Length == 0 ? type.ToDisplayString(SymbolDisplayFormats.GlobalNonNullableType) : null;
    }

    private static UIComponentPropertyModel CreateModel(Compilation compilation, UIComponentTypeModel owner, PropertySymbols symbols)
    {
        IPropertySymbol property = symbols.Property;
        UIComponentPropertyAttributeValues values = symbols.Values;
        List<DiagnosticInfo> diagnostics = [];

        ValidateProperty(compilation, symbols, diagnostics);

        return new UIComponentPropertyModel(
            Owner: owner,
            Name: property.Name,
            Type: property.Type.ToGlobalTypeDisplayString(),
            DeclareProperty: symbols.DeclareProperty,
            CarriedAttributes: symbols.DeclareProperty ? GetCarriedAttributes(property) : EquatableArray<string>.Empty,
            PropertyArgument: BuildPropertyArgument(symbols),
            IsBindable: values.IsBindable,
            BindingCapabilities: values.BindingCapabilities,
            DefaultValue: GetDefaultValue(symbols),
            DefaultBindingScope: values.DefaultBindingScope,
            DefaultBindingMode: values.DefaultBindingMode,
            GenerateSetter: values.GenerateSetter,
            GenerateBinder: values.GenerateBinder,
            ThrowIfNull: property.Type.IsNonNullableReferenceType(),
            ResponsiveElementType: GetResponsiveElementType(property.Type, compilation.GetTypeByMetadataName(ResponsiveMetadataName)),
            Diagnostics: diagnostics.ToEquatableArray()
        );
    }

    private static void ValidateProperty(Compilation compilation, PropertySymbols model, List<DiagnosticInfo> diagnostics)
    {
        UIComponentPropertyAttributeValues values = model.Values;

        ValidateDefaultValueConfiguration(compilation, model, diagnostics);

        if (model.Property.DeclaredAccessibility != Accessibility.Public)
            diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.PropertyMustBePublic, model.Property, model.Property.Name));

        if (model.Property.IsStatic)
            diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.PropertyCannotBeStatic, model.Property, model.Property.Name));

        if (model.Property.Parameters.Length != 0)
            diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.PropertyCannotBeIndexer, model.Property, model.Property.Name));

        if (!values.IsBindable && values.GenerateBinder)
            diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.InvalidBindableConfiguration, model.Property, model.Property.Name));

        // A block property is declared by the generator, so it always gets a setter even though the contract member is get-only;
        // an init accessor cannot be assigned from the generated setter.
        if (!model.DeclareProperty && values.GenerateSetter && model.Property.SetMethod is null or { IsInitOnly: true })
            diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.PropertyMustBeSettable, model.Property, model.Property.Name));

        ValidateGeneratedPropertyMember(model, UIComponentPropertyNames.GetPropertyDefinitionName(model.Property.Name), diagnostics);
        ValidateGeneratedPropertyMember(model, UIComponentPropertyNames.GetUIPropertyName(model.Property.Name), diagnostics);

        if (values.GenerateSetter)
            ValidateGeneratedSetterMember(model, diagnostics);

        if (values.GenerateBinder && values.IsBindable)
            ValidateGeneratedBinderMembers(compilation, model, diagnostics);

        if (values.Contract is not null)
            ValidateContractProperty(compilation, model, diagnostics);

        if (!string.IsNullOrWhiteSpace(values.DefaultValueMember))
            ValidateDefaultValueMember(model, diagnostics);
    }

    private static void ValidateDefaultValueConfiguration(Compilation compilation, PropertySymbols model, List<DiagnosticInfo> diagnostics)
    {
        UIComponentPropertyAttributeValues values = model.Values;

        if (values.HasDefaultValue && !string.IsNullOrWhiteSpace(values.DefaultValueMember))
        {
            ReportInvalidDefaultValueConfiguration(model, $"Property '{model.Property.Name}' cannot specify both DefaultValue and DefaultValueMember", diagnostics);
            return;
        }

        if (values.HasDefaultValue)
        {
            if (values.DefaultValueType is ITypeSymbol valueType && !IsDefaultValueAssignable(compilation, valueType, model.Property.Type))
                ReportInvalidDefaultValueConfiguration(model, $"Property '{model.Property.Name}' DefaultValue of type '{valueType.ToDisplayString()}' is not a '{model.Property.Type.ToDisplayString()}'", diagnostics);

            return;
        }

        if (values.DefaultValueMember is null)
            return;

        if (string.IsNullOrWhiteSpace(values.DefaultValueMember))
        {
            ReportInvalidDefaultValueConfiguration(model, $"Property '{model.Property.Name}' cannot specify an empty DefaultValueMember", diagnostics);
            return;
        }

        if (!IdentifierValidator.IsSimpleIdentifier(values.DefaultValueMember))
            ReportInvalidDefaultValueConfiguration(model, $"Property '{model.Property.Name}' DefaultValueMember must be a static member name declared on the component type", diagnostics);
    }

    private static void ReportInvalidDefaultValueConfiguration(PropertySymbols model, string message, List<DiagnosticInfo> diagnostics)
        => diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.InvalidDefaultValueConfiguration, model.Property, message));

    /// <summary>
    /// What the registration accepts at run time, checked here so a mismatch fails the build rather than the component type's
    /// initializer: the property's own type, an instance of it, or a number a decimal property widens.
    /// </summary>
    private static bool IsDefaultValueAssignable(Compilation compilation, ITypeSymbol valueType, ITypeSymbol propertyType)
    {
        ITypeSymbol target = propertyType is INamedTypeSymbol { OriginalDefinition.SpecialType: SpecialType.System_Nullable_T } nullable
            ? nullable.TypeArguments[0]
            : propertyType;

        if (SymbolEqualityComparer.Default.Equals(valueType, target))
            return true;

        if (target.SpecialType == SpecialType.System_Decimal && valueType.SpecialType is SpecialType.System_Int32 or SpecialType.System_Int64 or SpecialType.System_Single or SpecialType.System_Double)
            return true;

        CommonConversion conversion = compilation.ClassifyCommonConversion(valueType, target);

        // Identity, reference or boxing: an instance of the property type as it is, never a number converted to another.
        return conversion.Exists && conversion.IsImplicit && !conversion.IsNumeric && !conversion.IsUserDefined && !conversion.IsNullable;
    }

    private static void ValidateGeneratedPropertyMember(PropertySymbols model, string memberName, List<DiagnosticInfo> diagnostics)
    {
        foreach (ISymbol member in model.ContainingType.GetMembers(memberName))
        {
            if (SymbolEqualityComparer.Default.Equals(member, model.Property))
                continue;

            diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.GeneratedMemberConflict, model.Property, memberName, model.ContainingType.ToDisplayString()));
            return;
        }
    }

    private static void ValidateGeneratedSetterMember(PropertySymbols model, List<DiagnosticInfo> diagnostics)
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

            diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.GeneratedMemberConflict, model.Property, memberName, model.ContainingType.ToDisplayString()));
            return;
        }
    }

    private static void ValidateGeneratedBinderMembers(Compilation compilation, PropertySymbols model, List<DiagnosticInfo> diagnostics)
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

            diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.GeneratedMemberConflict, model.Property, memberName, model.ContainingType.ToDisplayString()));
            return;
        }
    }

    private static void ValidateContractProperty(Compilation compilation, PropertySymbols model, List<DiagnosticInfo> diagnostics)
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

        diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.ContractPropertyNotFound, model.Property, contract.ToDisplayString(), contractPropertyName));
    }

    private static string GetContractPropertyName(PropertySymbols model)
        => !string.IsNullOrWhiteSpace(model.Values.ContractPropertyName)
            ? model.Values.ContractPropertyName!
            : model.Property.Name + "Property";

    private static void ValidateDefaultValueMember(PropertySymbols model, List<DiagnosticInfo> diagnostics)
    {
        var memberName = model.Values.DefaultValueMember!;

        // A block property's default lives with the contract that declares it, not with the type it lands on.
        INamedTypeSymbol owner = model.DefaultValueOwner ?? model.ContainingType;

        foreach (ISymbol member in owner.GetMembers(memberName))
        {
            if (member is IFieldSymbol field)
            {
                if (!field.IsStatic)
                    ReportInvalidDefaultValueMemberKind(model, owner, memberName, diagnostics);

                return;
            }

            if (member is IPropertySymbol property)
            {
                if (!property.IsStatic)
                    ReportInvalidDefaultValueMemberKind(model, owner, memberName, diagnostics);

                return;
            }

            if (member is IMethodSymbol method)
            {
                if (!method.IsStatic || method.Parameters.Length != 0)
                    ReportInvalidDefaultValueMemberKind(model, owner, memberName, diagnostics);

                return;
            }
        }

        diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.DefaultValueMemberNotFound, model.Property, memberName, owner.ToDisplayString()));
    }

    private static void ReportInvalidDefaultValueMemberKind(PropertySymbols model, INamedTypeSymbol owner, string memberName, List<DiagnosticInfo> diagnostics)
        => diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.InvalidDefaultValueMemberKind, model.Property, memberName, owner.ToDisplayString()));

    /// <summary>
    /// Every attribute the contract member carries except <c>[UIComponentProperty]</c>, spelled as the generated property re-declares it.
    /// </summary>
    private static EquatableArray<string> GetCarriedAttributes(IPropertySymbol property)
    {
        List<string> carried = [];

        foreach (AttributeData attribute in property.GetAttributes())
        {
            if (attribute.AttributeClass is null || attribute.AttributeClass.ToDisplayString() == UIComponentPropertyNames.AttributeMetadataName)
                continue;

            // Nullability attributes are compiler bookkeeping; re-declaring one is a compile error rather than a copy.
            if (attribute.AttributeClass.ContainingNamespace?.ToDisplayString() == "System.Runtime.CompilerServices")
                continue;

            var name = attribute.AttributeClass.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat);
            List<string> arguments = [];

            foreach (TypedConstant argument in attribute.ConstructorArguments)
                arguments.Add(TypedConstantRenderer.Render(argument));

            foreach (KeyValuePair<string, TypedConstant> argument in attribute.NamedArguments)
                arguments.Add(argument.Key + " = " + TypedConstantRenderer.Render(argument.Value));

            carried.Add(arguments.Count > 0 ? name + "(" + string.Join(", ", arguments) + ")" : name);
        }

        return carried.ToEquatableArray();
    }

    private static string BuildPropertyArgument(PropertySymbols model)
    {
        if (model.Values.Contract is null)
            return "nameof(" + model.Property.Name + ")";

        var contractType = model.Values.Contract.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat);
        var contractPropertyName = GetContractPropertyName(model);

        return contractType + "." + contractPropertyName;
    }

    /// <summary>The registration's default value expression: the literal given, else the member named, qualified by the type a block's default lives on.</summary>
    private static string? GetDefaultValue(PropertySymbols model)
    {
        UIComponentPropertyAttributeValues values = model.Values;

        if (values.HasDefaultValue)
            return values.DefaultValueSource;

        if (string.IsNullOrWhiteSpace(values.DefaultValueMember))
            return null;

        return model.DefaultValueOwner is null
            ? values.DefaultValueMember
            : model.DefaultValueOwner.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat) + "." + values.DefaultValueMember;
    }

    /// <summary>
    /// The <c>T</c> of a (nullable-)<c>UIResponsive&lt;T&gt;</c> property type, which earns the property a responsive setter overload.
    /// </summary>
    private static string? GetResponsiveElementType(ITypeSymbol propertyType, INamedTypeSymbol? responsiveTypeDefinition)
    {
        if (responsiveTypeDefinition is null)
            return null;

        ITypeSymbol unwrapped = propertyType is INamedTypeSymbol { OriginalDefinition.SpecialType: SpecialType.System_Nullable_T } nullable
            ? nullable.TypeArguments[0]
            : propertyType;

        if (unwrapped is not INamedTypeSymbol { IsGenericType: true } named || !SymbolEqualityComparer.Default.Equals(named.OriginalDefinition, responsiveTypeDefinition))
            return null;

        return named.TypeArguments[0].ToGlobalNonNullableTypeDisplayString();
    }

    public static UIComponentPropertyBlockModel? CreateBlockModel(GeneratorAttributeSyntaxContext context, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (context.TargetSymbol is not INamedTypeSymbol type)
            return null;

        List<INamedTypeSymbol> contracts = [];

        foreach (AttributeData attribute in context.Attributes)
        {
            if (attribute.ConstructorArguments.Length == 1 && attribute.ConstructorArguments[0].Value is INamedTypeSymbol contract)
                contracts.Add(contract);
        }

        if (contracts.Count == 0)
            return null;

        Compilation compilation = context.SemanticModel.Compilation;
        UIComponentTypeModel owner = CreateTypeModel(type);
        List<UIComponentPropertyModel> properties = [];
        List<DiagnosticInfo> diagnostics = [];
        Dictionary<string, string> defaults = ReadOwnDefaults(type);

        foreach (INamedTypeSymbol contract in contracts)
            AppendBlockProperties(compilation, owner, type, contract, properties, diagnostics, defaults);

        // What is left named a property no block generated here: a typo, or one declared by hand or by a base.
        foreach (var propertyName in defaults.Keys)
            diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.BlockDefaultNotFound, type, propertyName, type.ToDisplayString()));

        return new UIComponentPropertyBlockModel(owner, properties.ToEquatableArray(), diagnostics.ToEquatableArray());
    }

    /// <summary>The type's own defaults for its block properties, by property name, from its <c>[UIComponentPropertyDefault]</c>s.</summary>
    private static Dictionary<string, string> ReadOwnDefaults(INamedTypeSymbol type)
    {
        Dictionary<string, string> defaults = [];

        foreach (AttributeData attribute in type.GetAttributes())
        {
            if (attribute.AttributeClass?.ToDisplayString() == UIComponentPropertyNames.DefaultAttributeMetadataName
                && attribute.ConstructorArguments.Length == 2
                && attribute.ConstructorArguments[0].Value is string propertyName
                && attribute.ConstructorArguments[1].Value is string valueMember)
            {
                defaults[propertyName] = valueMember;
            }
        }

        return defaults;
    }

    /// <summary>Adds the contract's properties the type does not declare itself; a default the type gives one is taken out of <paramref name="defaults"/>.</summary>
    private static void AppendBlockProperties(Compilation compilation, UIComponentTypeModel owner, INamedTypeSymbol type, INamedTypeSymbol contract, List<UIComponentPropertyModel> target, List<DiagnosticInfo> diagnostics, Dictionary<string, string> defaults)
    {
        if (contract.TypeKind != TypeKind.Interface)
        {
            diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.BlockContractNotAnInterface, type, contract.ToDisplayString(), type.ToDisplayString()));

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

            if (IsDeclaredByHand(type, contract, property, diagnostics) || IsDeclaredByBase(type, property))
                continue;

            UIComponentPropertyAttributeValues values = UIComponentPropertyAttributeValues.From(attribute);

            if (values.Contract is null)
                values = values with { Contract = contract };

            // The type's own default is read off the type; the contract's off the declaring interface, not the one the block names,
            // since interface statics are not inherited.
            INamedTypeSymbol defaultValueOwner = property.ContainingType;

            if (defaults.TryGetValue(property.Name, out var valueMember))
            {
                _ = defaults.Remove(property.Name);
                values = values with { HasDefaultValue = false, DefaultValueSource = null, DefaultValueType = null, DefaultValueMember = valueMember };
                defaultValueOwner = type;
            }

            PropertySymbols symbols = new(property, type, values, DeclareProperty: true, DefaultValueOwner: defaultValueOwner);

            target.Add(CreateModel(compilation, owner, symbols));
        }

        if (!found)
            diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.BlockContractHasNoProperties, type, contract.ToDisplayString(), type.ToDisplayString()));
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
    private static bool IsDeclaredByHand(INamedTypeSymbol type, INamedTypeSymbol contract, IPropertySymbol property, List<DiagnosticInfo> diagnostics)
    {
        foreach (ISymbol member in type.GetMembers(property.Name))
        {
            if (member is not IPropertySymbol declared)
                continue;

            if (!SymbolEqualityComparer.Default.Equals(declared.Type.WithNullableAnnotation(NullableAnnotation.NotAnnotated), property.Type.WithNullableAnnotation(NullableAnnotation.NotAnnotated)))
            {
                diagnostics.Add(DiagnosticInfo.Create(UIComponentPropertyDiagnostics.BlockPropertyTypeMismatch, declared, property.Name, type.ToDisplayString(), declared.Type.ToDisplayString(), contract.ToDisplayString(), property.Type.ToDisplayString()));
            }

            return true;
        }

        return false;
    }

    /// <summary>Whether a base type already carries this property; read from its attributes, not members, since a generator can't see what another pass produced.</summary>
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

    /// <summary>One property as its symbols give it; it never leaves the transform.</summary>
    private sealed record PropertySymbols(IPropertySymbol Property, INamedTypeSymbol ContainingType, UIComponentPropertyAttributeValues Values, bool DeclareProperty = false, INamedTypeSymbol? DefaultValueOwner = null);
}
