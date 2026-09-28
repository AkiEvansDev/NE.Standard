using System.Collections.Generic;
using Microsoft.CodeAnalysis;
using NE.Standard.UI.Generators.Infrastructure;

namespace NE.Standard.UI.Generators.ComponentProperties;

/// <summary>
/// What one <c>[UIComponentProperty]</c> says, read inside a pipeline's transform; it holds symbols, so it never leaves it.
/// </summary>
internal sealed record UIComponentPropertyAttributeValues(INamedTypeSymbol? Contract, string? ContractPropertyName, bool IsBindable, string? BindingCapabilities, bool HasDefaultValue, string? DefaultValueSource, string? DefaultValueMember, bool GenerateSetter, bool GenerateBinder, string? DefaultBindingScope, string? DefaultBindingMode, ITypeSymbol? DefaultValueType = null)
{
    public static UIComponentPropertyAttributeValues From(AttributeData attribute)
    {
        INamedTypeSymbol? contract = null;
        string? contractPropertyName = null;
        var isBindable = true;
        var bindingCapabilities = "global::NE.Standard.UI.Primitives.Binding.UIBindingCapabilities.SourceToTarget";
        var hasDefaultValue = false;
        string? defaultValueSource = null;
        ITypeSymbol? defaultValueType = null;
        string? defaultValueMember = null;
        var generateSetter = true;
        bool? generateBinder = null;
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
                    defaultValueType = pair.Value.IsNull ? null : pair.Value.Type;
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
            // Unset, it follows IsBindable: an unbindable property has nothing to bind, so only an explicit true is a contradiction.
            GenerateBinder: generateBinder ?? isBindable,
            DefaultBindingScope: defaultBindingScope,
            DefaultBindingMode: defaultBindingMode,
            DefaultValueType: defaultValueType
        );
    }
}
