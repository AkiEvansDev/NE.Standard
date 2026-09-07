using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// One entry of a <see cref="MenuComponent"/>: the button's own content plus a destination and a current
/// state.
/// </summary>
/// <remarks>Rendered as an anchor; an entry with a command and no <see cref="Url"/> is still one, just without an <c>href</c>.</remarks>
public abstract partial class MenuItemComponent<T> : ButtonComponent<T>
    where T : MenuItemComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets whether this entry renders as an entry, a section caption or a rule.
    /// </summary>
    /// <remarks>Render-time only, not bindable: the menu already picks a template variant from <c>IMenuItemModel.Kind</c>.</remarks>
    [UIComponentProperty(IsBindable = false, GenerateBinder = false, DefaultValue = UIMenuItemKind.Item)]
    public UIMenuItemKind? Kind { get; set; }

    /// <summary>
    /// Gets or sets the destination this entry navigates to.
    /// </summary>
    [SuppressMessage("Design", "CA1056:URI-like properties should not be strings", Justification = "The value is only ever written verbatim into an href attribute; a Uri type would require additional rendering/converter plumbing with no benefit here.")]
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Url { get; set; }

    /// <summary>
    /// Gets or sets whether this entry is the current one.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Selected { get; set; }

    /// <summary>
    /// Gets or sets the key combination that fires this entry, written as <c>Ctrl+Shift+P</c>.
    /// </summary>
    /// <remarks>Not translatable: a combination names physical keys.</remarks>
    [UIComponentProperty(DefaultValue = null)]
    public string? Shortcut { get; set; }

    /// <summary>
    /// Gets or sets whether a <see cref="UIMenuItemKind.Check"/> entry is on.
    /// </summary>
    [UIComponentProperty(DefaultValue = false)]
    public bool? Checked { get; set; }

    /// <summary>
    /// Gets or sets what a <see cref="UIMenuItemKind.Select"/> entry says at its end.
    /// </summary>
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    public string? Value { get; set; }

    /// <summary>
    /// Initializes the entry stretched, left-aligned and untinted.
    /// </summary>
    protected MenuItemComponent(string? id = null) : base(id)
    {
        // Both axes: a vertical menu lays out with flexbox, so the entry's width comes from align-self.
        HorizontalAlignment = UIAlignment.Stretch;
        VerticalAlignment = UIAlignment.Stretch;
        Type = UIButtonType.Ghost;

        TextAlignment = UITextAlignment.Start;
    }
}

/// <summary>
/// One entry of a <see cref="MenuComponent"/>.
/// </summary>
public sealed class MenuItemComponent(string? id = null) : MenuItemComponent<MenuItemComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.menu.item";
}
