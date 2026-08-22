using System.Collections.Generic;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using NE.Standard.UI.Generators.Infrastructure;

namespace NE.Standard.UI.Generators.ComponentProperties;

internal sealed record UIComponentPropertyModel(
    PropertyDeclarationSyntax PropertySyntax,
    IPropertySymbol Property,
    INamedTypeSymbol ContainingType,
    UIComponentPropertyAttributeValues Values
);

internal sealed record UIComponentPropertyAttributeValues(
    INamedTypeSymbol? Contract,
    string? ContractPropertyName,
    bool IsBindable,
    string? BindingCapabilities,
    bool HasDefaultValue,
    string? DefaultValueSource,
    string? DefaultValueMember,
    bool GenerateSetter,
    bool GenerateBinder,
    string? DefaultBindingScope,
    string? DefaultBindingMode)
{
    public static UIComponentPropertyAttributeValues From(AttributeData attribute)
    {
        INamedTypeSymbol? contract = null;
        string? contractPropertyName = null;
        var isBindable = true;
        var bindingCapabilities = "global::NE.Standard.UI.Primitives.Binding.UIBindingCapabilities.SourceToTarget";
        var hasDefaultValue = false;
        string? defaultValueSource = null;
        string? defaultValueMember = null;
        var generateSetter = true;
        var generateBinder = true;
        var defaultBindingScope = "global::NE.Standard.UI.Primitives.Binding.UIBindingScope.Root";
        var defaultBindingMode = "global::NE.Standard.UI.Primitives.Binding.UIBindingMode.OneWay";

        foreach (KeyValuePair<string, TypedConstant> pair in attribute.NamedArguments)
        {
            switch (pair.Key)
            {
                case UIComponentPropertyNames.Contract:
                    contract = pair.Value.Value as INamedTypeSymbol;
                    break;
                case UIComponentPropertyNames.ContractPropertyName:
                    contractPropertyName = pair.Value.Value as string;
                    break;
                case UIComponentPropertyNames.IsBindable:
                    isBindable = pair.Value.Value is bool bindable && bindable;
                    break;
                case UIComponentPropertyNames.BindingCapabilities:
                    bindingCapabilities = TypedConstantRenderer.Render(pair.Value);
                    break;
                case UIComponentPropertyNames.DefaultValue:
                    hasDefaultValue = true;
                    defaultValueSource = TypedConstantRenderer.Render(pair.Value);
                    break;
                case UIComponentPropertyNames.DefaultValueMember:
                    defaultValueMember = pair.Value.Value as string;
                    break;
                case UIComponentPropertyNames.GenerateSetter:
                    generateSetter = pair.Value.Value is bool setter && setter;
                    break;
                case UIComponentPropertyNames.GenerateBinder:
                    generateBinder = pair.Value.Value is bool binder && binder;
                    break;
                case UIComponentPropertyNames.DefaultBindingScope:
                    defaultBindingScope = TypedConstantRenderer.Render(pair.Value);
                    break;
                case UIComponentPropertyNames.DefaultBindingMode:
                    defaultBindingMode = TypedConstantRenderer.Render(pair.Value);
                    break;
                default:
                    break;
            }
        }

        return new UIComponentPropertyAttributeValues(
            Contract: contract,
            ContractPropertyName: contractPropertyName,
            IsBindable: isBindable,
            BindingCapabilities: bindingCapabilities,
            HasDefaultValue: hasDefaultValue,
            DefaultValueSource: defaultValueSource,
            DefaultValueMember: defaultValueMember,
            GenerateSetter: generateSetter,
            GenerateBinder: generateBinder,
            DefaultBindingScope: defaultBindingScope,
            DefaultBindingMode: defaultBindingMode
        );
    }
}
