using NE.Standard.UI.Generators.Infrastructure;

namespace NE.Standard.UI.Generators.ComponentProperties;

/// <summary>
/// A component type the property generator writes into, and the type its fluent setters return.
/// </summary>
internal sealed record UIComponentTypeModel(GeneratedTypeModel Declaration, string? SelfType);

/// <summary>
/// One property to generate for one component type, with every string the emitter writes and the diagnostics its validation reported.
/// </summary>
internal sealed record UIComponentPropertyModel(UIComponentTypeModel Owner, string Name, string Type, bool DeclareProperty, EquatableArray<string> CarriedAttributes, string PropertyArgument, bool IsBindable, string? BindingCapabilities, string? DefaultValue, string? DefaultBindingScope, string? DefaultBindingMode, bool GenerateSetter, bool GenerateBinder, bool ThrowIfNull, string? ResponsiveElementType, EquatableArray<DiagnosticInfo> Diagnostics)
{
    /// <summary>Whether validation refused the property; every diagnostic it reports is an error.</summary>
    public bool HasErrors
        => Diagnostics.Count > 0;
}
