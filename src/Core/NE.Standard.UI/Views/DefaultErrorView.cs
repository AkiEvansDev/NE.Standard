using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Views;

/// <summary>
/// The error page an application gets when it registered none: the failure's message under a plain heading.
/// </summary>
internal sealed class DefaultErrorView : UIViewBase, IUIViewDefinition
{
    public static string ViewKey => "standard.error";

    protected override IVisualComponent CreateContent()
        => new ContainerComponent()
            .SetPadding(UIThickness.Uniform(24))
            .AddChild(new TextComponent()
                .SetTitle("Something went wrong")
                .SetTitleType(UITextAppearance.Display)
                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.OnBackground))
                .BindDescription(nameof(DefaultErrorController.Message))
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
                .SetPlacement(1, 1, 24, 1)
            );
}
