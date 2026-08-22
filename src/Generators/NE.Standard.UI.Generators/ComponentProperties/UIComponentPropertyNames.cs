namespace NE.Standard.UI.Generators.ComponentProperties;

internal static class UIComponentPropertyNames
{
    public const string AttributeMetadataName = "NE.Standard.UI.Primitives.Annotations.UIComponentPropertyAttribute";
    public const string UIPropertyMetadataName = "NE.Standard.UI.Abstractions.Binding.Properties.UIProperty";
    public const string RecursivePathMetadataName = "NE.Standard.UI.Abstractions.Recursive.RecursivePath";

    public const string Contract = "Contract";
    public const string ContractPropertyName = "ContractPropertyName";
    public const string IsBindable = "IsBindable";
    public const string BindingCapabilities = "BindingCapabilities";
    public const string DefaultValue = "DefaultValue";
    public const string DefaultValueMember = "DefaultValueMember";
    public const string GenerateSetter = "GenerateSetter";
    public const string GenerateBinder = "GenerateBinder";
    public const string DefaultBindingScope = "DefaultBindingScope";
    public const string DefaultBindingMode = "DefaultBindingMode";

    public static string GetPropertyDefinitionName(string propertyName)
        => propertyName + "PropertyDefinition";

    public static string GetUIPropertyName(string propertyName)
        => propertyName + "Property";

    public static string GetSetterName(string propertyName)
        => "Set" + propertyName;

    public static string GetBinderName(string propertyName)
        => "Bind" + propertyName;
}
