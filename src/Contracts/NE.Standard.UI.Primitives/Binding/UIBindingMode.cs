namespace NE.Standard.UI.Primitives.Binding;

/// <summary>
/// Defines how data flows between a binding source and a UI target.
/// </summary>
public enum UIBindingMode
{
    /// <summary>
    /// Updates flow only from the binding source to the UI target.
    /// </summary>
    OneWay = 0,

    /// <summary>
    /// Updates flow in both directions between the binding source and the UI target.
    /// </summary>
    TwoWay = 1,

    /// <summary>
    /// Updates flow only from the UI target to the binding source.
    /// </summary>
    OneWayToSource = 2,

    /// <summary>
    /// Target-to-source updates are buffered until an explicit submit occurs.
    /// </summary>
    OnSubmit = 3,
}
