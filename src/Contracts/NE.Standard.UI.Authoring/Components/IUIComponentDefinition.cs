namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Defines static metadata required by a UI component type.
/// </summary>
public interface IUIComponentDefinition
{
    /// <summary>
    /// Gets the stable component type key used by compilation and property metadata lookup.
    /// </summary>
    static abstract string ComponentTypeKey { get; }
}
