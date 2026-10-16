using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Views;

/// <summary>
/// The not-found page an application gets when it registered none.
/// </summary>
internal sealed class DefaultNotFoundView : UIViewBase, IUIViewDefinition
{
    public static string ViewKey => "standard.not-found";

    /// <summary>A word, so the tab reads in the page's language rather than the type's name.</summary>
    public override string Title => UIStrings.NotFoundPageTitle;

    protected override IVisualComponent CreateContent()
        => DefaultStatusPage.Create(new StatusComponent(UIGlyphs.Search, UIColorStyle.Primary, UIStrings.NotFoundTitle, UIStrings.NotFoundDescription)
            .AddAction(DefaultStatusPage.HomeButton(nameof(DefaultNotFoundController.GoHome)))
        );
}
