namespace NE.Standard.UI.Views;

/// <summary>
/// Defines static metadata required by a UI view type.
/// </summary>
public interface IUIViewDefinition
{
    /// <summary>
    /// Gets the stable view key used by route registration and view lookup.
    /// </summary>
    static abstract string ViewKey { get; }
}
