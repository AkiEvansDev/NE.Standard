namespace NE.Standard.UI.Abstractions.Identity;

/// <summary>
/// Defines the kind of slot a component fills in its owner: a child, a region, a template, a context menu.
/// </summary>
public enum UIComponentSlotKind
{
    Child = 0,
    Region = 1,
    Template = 2,
    TemplateVariant = 3,
    EmptyTemplate = 4,
    GroupTemplate = 5,

    /// <summary>
    /// The component shown when the owner is right-clicked.
    /// </summary>
    ContextMenu = 6
}
