using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Templates;

/// <summary>
/// The built-in template rendered in place of items when an items view's collection is empty.
/// </summary>
public abstract class DefaultEmptyTemplate<TTemplate> : DefaultTextTemplate<TTemplate>
    where TTemplate : DefaultEmptyTemplate<TTemplate>, IUIComponentDefinition
{
    /// <summary>The words shown when an items view has nothing to render.</summary>
    /// <remarks>
    /// <c>UIStrings.ItemsEmpty</c>, spelled here since the components reference no shell — the framework's own English
    /// ("Nothing to show.") wherever the application has no word for it.
    /// </remarks>
    public const string DefaultText = "ui.items.empty";

    /// <summary>
    /// Initializes the empty template, giving it its default text unless it binds to an item instead.
    /// </summary>
    protected DefaultEmptyTemplate(string? itemPath = null, bool binds = false) : base(itemPath, binds)
    {
        // The empty state has no item, so the default text only applies to the unbound form.
        if (binds)
            return;

        // The title in the text's own ink and a description an author adds muted under it, as every row's: a muted title read weaker
        // than the line explaining it.
        _ = SetTitle(DefaultText);
        _ = SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted));
    }
}

/// <summary>
/// The built-in template rendered in place of items when an items view's collection is empty.
/// </summary>
public sealed class DefaultEmptyTemplate(string? itemPath = null, bool binds = false) : DefaultEmptyTemplate<DefaultEmptyTemplate>(itemPath, binds), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.default.empty.template";
}
