using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A component drawn as a link where it is given an address — a surface, a card, a file tile, a button, an action row, a link, a menu's
/// entry, a trail's step: its root is an anchor, so the address can be opened in a new tab, copied or followed in place. Whatever is
/// clickable as a whole (<see cref="IClickableComponent"/>) is linkable.
/// </summary>
public interface ILinkableComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Url"/>.
    /// </summary>
    static UIProperty UrlProperty { get; } = new UIProperty(nameof(Url));

    /// <summary>
    /// Gets the address the component opens when it is pressed, written into the anchor's <c>href</c>; set or bound, the component takes
    /// no command on its click — but a host's entry drawn per entry (<see cref="IEntryLinkComponent"/>) — and holds no control of its
    /// own, which an anchor cannot.
    /// </summary>
    [SuppressMessage("Design", "CA1056:URI-like properties should not be strings", Justification = "The value is only ever written verbatim into an href attribute; a Uri type would require additional rendering/converter plumbing with no benefit here.")]
    [Translatable]
    [UIComponentProperty(DefaultValue = null)]
    string? Url { get; }
}
