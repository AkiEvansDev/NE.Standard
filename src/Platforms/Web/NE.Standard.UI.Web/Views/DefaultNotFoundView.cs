using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Views;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace NE.Standard.UI.Web.Views;

internal sealed class DefaultNotFoundView : UIViewBase, IUIViewDefinition
{
    public static string ViewKey => "standard.not-found";

    protected override IVisualComponent CreateContent()
        => new ContainerComponent()
            .SetPadding(UIThickness.Uniform(24))
            .AddChild(new TextComponent()
                .SetTitle("404")
                .SetTitleType(UITextAppearance.Display)
                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.OnBackground))
                .SetDescription("The page you are looking for does not exist.")
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                .SetPlacement(1, 1, 24, 1)
            );
}
