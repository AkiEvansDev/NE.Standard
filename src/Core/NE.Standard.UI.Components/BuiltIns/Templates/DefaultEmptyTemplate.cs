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
    /// <summary>
    /// The text shown when an items view has nothing to render.
    /// </summary>
    /// <remarks>A plain literal, not a translation key: an untranslated key would surface to the user as the key itself.</remarks>
    public const string DefaultText = "Nothing to show.";

    /// <summary>
    /// Initializes the empty template, giving it its default text unless it binds to an item instead.
    /// </summary>
    protected DefaultEmptyTemplate(string? itemPath = null, bool binds = false) : base(itemPath, binds)
    {
        // The empty state has no item, so the default text only applies to the unbound form.
        if (binds)
            return;

        _ = SetTitle(DefaultText);
        _ = SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted));
    }
}

/// <summary>
/// The built-in template rendered in place of items when an items view's collection is empty.
/// </summary>
public sealed class DefaultEmptyTemplate(string? itemPath = null, bool binds = false) : DefaultEmptyTemplate<DefaultEmptyTemplate>(itemPath, binds), IUIComponentDefinition
{
    /// <summary>
    /// Gets the component type key used to identify this component in the compiled graph.
    /// </summary>
    public static string ComponentTypeKey => "standard.default.empty.template";
}
