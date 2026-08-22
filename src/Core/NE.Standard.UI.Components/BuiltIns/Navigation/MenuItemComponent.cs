using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Authoring.BuiltIns.Models;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Navigation;

/// <summary>
/// One entry of a <see cref="MenuComponent"/>: the button's own content plus a destination and a current
/// state.
/// </summary>
/// <remarks>
/// A <see cref="ButtonComponent{T}"/> because an entry is click-shaped and already needs the icon/title/badge
/// content region, but rendered as an anchor: a menu entry usually navigates, and an anchor is what gives it a
/// real URL to middle-click, copy or open in a new tab. An entry with a command and no <see cref="Url"/> is
/// still an anchor, just without an <c>href</c>.
/// </remarks>
public abstract partial class MenuItemComponent<T> : ButtonComponent<T>
    where T : MenuItemComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets whether this entry renders as an entry, a section caption or a rule.
    /// </summary>
    /// <remarks>
    /// Render-time only, and deliberately not bindable: the menu selects a <em>template variant</em> per
    /// entry from <c>IMenuItemModel.Kind</c>, so the variant already is the kind and each one sets
    /// this statically. Binding it too would mean a second, redundant channel for the same fact — and one
    /// that would need its own enum converter on both sides of the wire to say nothing new.
    /// </remarks>
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
    /// <remarks>
    /// Not translatable: a combination names physical keys, and translating "Ctrl" would break the match as
    /// well as the label. See <see cref="IMenuItemModel.Shortcut"/> for what claiming one twice means.
    /// </remarks>
    [UIComponentProperty(DefaultValue = null)]
    public string? Shortcut { get; set; }

    /// <summary>
    /// Initializes the entry stretched, left-aligned and untinted, the way a row of them has to read.
    /// </summary>
    protected MenuItemComponent(string? id = null) : base(id)
    {
        // Both axes, not just the horizontal one: a menu lays its entries out with flexbox, so in a vertical
        // menu the entry's *width* is the cross axis and comes from align-self — which the runtime maps from
        // VerticalAlignment. Left at the button's Center, every entry shrank to its text and sat in the middle.
        HorizontalAlignment = UIAlignment.Stretch;
        VerticalAlignment = UIAlignment.Stretch;
        Type = UIButtonType.Ghost;

        _ = ConfigureDefaultContent(content => _ = content.SetTextAlignment(UITextAlignment.Start));
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
