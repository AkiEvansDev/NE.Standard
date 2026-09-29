namespace NE.Standard.UI.Abstractions.Binding;

/// <summary>An item that can say its words are content: shown as written, never looked up as a translation key.</summary>
/// <remarks>
/// What <c>AsContent(property)</c> says for a component's own property, for an item a template draws (a select's option, a menu entry).
/// </remarks>
public interface IContentItem
{
    /// <summary>
    /// Gets whether every word read off the item is shown as written — a name such as <c>UTF-8</c> or <c>C#</c>, never a key.
    /// </summary>
    bool IsContent { get; }
}
