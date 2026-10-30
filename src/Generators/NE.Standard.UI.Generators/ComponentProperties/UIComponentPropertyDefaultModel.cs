using NE.Standard.UI.Generators.Infrastructure;

namespace NE.Standard.UI.Generators.ComponentProperties;

/// <summary>
/// One inherited component property default override to generate for one component type, with the diagnostics its validation reported.
/// </summary>
internal sealed record UIComponentPropertyDefaultOverrideModel(string Name, string Type, string DeclaringType, string PropertyArgument, string DefaultValue, EquatableArray<DiagnosticInfo> Diagnostics)
{
    /// <summary>Whether validation refused the default override; every diagnostic it reports is an error.</summary>
    public bool HasErrors
        => Diagnostics.Count > 0;
}

/// <summary>
/// A component type with the inherited property default overrides its <c>[UIComponentPropertyDefault]</c> attributes contribute.
/// </summary>
internal sealed record UIComponentPropertyDefaultModel(UIComponentTypeModel Owner, EquatableArray<UIComponentPropertyDefaultOverrideModel> Overrides, EquatableArray<DiagnosticInfo> Diagnostics);
