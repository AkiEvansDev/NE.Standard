using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>
/// A full-width row that invokes a command: the button's own content on the left, a trailing chevron — and
/// optionally a value in front of it — on the right.
/// </summary>
/// <remarks>
/// A <see cref="ButtonComponent{T}"/> rather than a thing of its own, because everything left of the chevron
/// already <em>is</em> a button: the same click/submit handling, the same border and background, and the same
/// content region drawing icon, title, description and badge. What this adds is the trailing side and a
/// different set of defaults — stretched, left-aligned and neutral instead of centred and branded.
/// <para>
/// Not to be confused with <c>KeyValueActionComponent</c>, which is a *list* of key/value rows with a trailing
/// action each. This is one control, the way a button is one control.
/// </para>
/// </remarks>
public abstract partial class ActionComponent<T> : ButtonComponent<T>
    where T : ActionComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the text shown in front of the trailing chevron, e.g. the current value of the setting
    /// the row leads to.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? TrailingText { get; set; }

    /// <summary>
    /// Gets or sets the icon replacing the trailing chevron. Unset draws the chevron itself, which is built
    /// from borders rather than a glyph so a row needs no icon package registered to point somewhere.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    public string? TrailingIcon { get; set; }

    /// <summary>
    /// Initializes the row stretched, left-aligned and untinted — a list of these reads as a list of
    /// destinations, not as a stack of call-to-action buttons.
    /// </summary>
    protected ActionComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Stretch;
        Type = UIButtonType.Ghost;

        _ = ConfigureDefaultContent(content => _ = content.SetTextAlignment(UITextAlignment.Start));
    }

    /// <summary>
    /// Sets the row's title, description and leading icon in one call — what an action row carries in
    /// practice, without reaching through <c>ConfigureDefaultContent</c> for each of them.
    /// </summary>
    public T SetAction(string title, string? description = null, string? icon = null)
        => ConfigureDefaultContent(content =>
        {
            _ = content.SetTitle(title);

            if (description is not null)
                _ = content.SetDescription(description);

            if (icon is not null)
                _ = content.SetIcon(icon);
        });
}

/// <summary>
/// A full-width row that invokes a command: content on the left, a trailing chevron on the right.
/// </summary>
public sealed class ActionComponent(string? id = null) : ActionComponent<ActionComponent>(id), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.action";
}
