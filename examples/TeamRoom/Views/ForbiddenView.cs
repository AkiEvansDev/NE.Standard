using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace TeamRoom.Views;

/// <summary>
/// Where a signed-in person lands when a page is not theirs: an administrator's page opened by a member.
/// </summary>
public sealed class ForbiddenView : UIViewBase, IUIViewDefinition
{
    public static string ViewKey => "teamroom.forbidden";

    public override string Title => "Not allowed · TeamRoom";

    protected override IVisualComponent CreateContent()
        => new ContainerComponent()
            .SetPadding(UIThickness.All(24, 96, 24, 24))
            .AddChild(new CardComponent()
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetWidth(UILayoutLength.Absolute(420))
                .ConfigureDefaultHeader(static header => header
                    .SetIcon(AppIcons.Outline(AppIcons.Block))
                    .SetTitle("Not allowed")
                    .SetDescription("This page belongs to the administrators.")
                )
                .SetContent(new LinkComponent()
                    .SetTitle("Back to the files")
                    .SetUrl(AppRoutes.Files)
                )
                .SetPlacement(1, 1, 24, 1)
            );
}
