using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>A button that switches the page to another language in place: two languages switch on a press, more open a list.</summary>
/// <remarks>
/// It tells the session, so the next page renders in the language too. The choices are the translator's languages, each named in
/// itself and never translated; with one language there is nothing to switch and the button is not drawn. A switch rewrites the
/// page's words where they stand; numbers and dates keep their culture until the next render.
/// </remarks>
[UIComponentPropertyBlock(typeof(ISurfaceComponent))]
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
[UIComponentPropertyBlock(typeof(ITooltipComponent))]
[UIComponentPropertyBlock(typeof(ISwitcherComponent))]
public abstract partial class LanguageSwitcherComponent<T> : VisualComponentBase<T>, ISurfaceComponent, IBorderedComponent, ITooltipComponent, ISwitcherComponent
    where T : LanguageSwitcherComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Initializes the switcher centred, as a button.
    /// </summary>
    protected LanguageSwitcherComponent(string? id = null) : base(id)
    {
        HorizontalAlignment = UIAlignment.Center;
        VerticalAlignment = UIAlignment.Center;
    }

    /// <summary>
    /// Gets or sets the glyph drawn before the language; none by default.
    /// </summary>
    [UIComponentProperty]
    public string? Icon { get; set; }

    /// <summary>
    /// Gets or sets what the button shows for the page's language: its code or its name.
    /// </summary>
    [UIComponentProperty(IsBindable = false, DefaultValue = UILanguageDisplay.Code)]
    public UILanguageDisplay? Display { get; set; }

    /// <summary>
    /// Gets or sets the languages offered and their order; by default every language the translator lists, in its order. A
    /// language the translator does not list is left out.
    /// </summary>
    [UIComponentProperty(IsBindable = false)]
    public IReadOnlyList<string>? Languages { get; set; }
}

/// <summary>
/// A button that switches the page to another language in place, and tells the session.
/// </summary>
public sealed class LanguageSwitcherComponent(string? id = null) : LanguageSwitcherComponent<LanguageSwitcherComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.language-switcher";
}
