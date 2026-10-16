using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Localization;

namespace NE.Standard.UI.Views;

/// <summary>
/// The error page an application gets when it registered none: the failure's message under a plain heading.
/// </summary>
internal sealed class DefaultErrorView : UIViewBase, IUIViewDefinition
{
    public static string ViewKey => "standard.error";

    /// <summary>A word, so the tab reads in the page's language rather than the type's name.</summary>
    public override string Title => UIStrings.ErrorTitle;

    protected override IVisualComponent CreateContent()
    {
        StatusComponent status = new StatusComponent(UIGlyphs.Error, UIColorStyle.Danger, UIStrings.ErrorTitle)
            .AddAction(DefaultStatusPage.HomeButton(nameof(DefaultErrorController.GoHome)));

        // The message comes from the address (`?message=`): anyone can write it, so it is shown as written, never as markup.
        _ = status.Words
            .BindDescription(nameof(DefaultErrorController.Message))
            .SetDescriptionPlain(true);

        return DefaultStatusPage.Create(status);
    }
}
