namespace NE.Standard.UI.Primitives.Binding;

/// <summary>
/// Provides helpers for binding mode capability checks.
/// </summary>
public static class UIBindingModeExtensions
{
    /// <summary>
    /// Determines whether the binding mode can be used with the specified capabilities.
    /// </summary>
    public static bool IsSupportedBy(this UIBindingMode mode, UIBindingCapabilities capabilities)
        => mode switch
        {
            UIBindingMode.OneWay =>
                Has(capabilities, UIBindingCapabilities.SourceToTarget),

            UIBindingMode.TwoWay =>
                Has(capabilities, UIBindingCapabilities.SourceToTarget) &&
                Has(capabilities, UIBindingCapabilities.TargetToSource),

            UIBindingMode.OneWayToSource =>
                Has(capabilities, UIBindingCapabilities.TargetToSource),

            UIBindingMode.OnSubmit =>
                Has(capabilities, UIBindingCapabilities.SourceToTarget) &&
                Has(capabilities, UIBindingCapabilities.SubmitBufferedTargetToSource),

            _ => false
        };

    private static bool Has(UIBindingCapabilities capabilities, UIBindingCapabilities required)
        => (capabilities & required) == required;
}
