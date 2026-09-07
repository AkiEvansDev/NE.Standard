using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Card;

/// <summary>
/// The shapes a card is actually written in — an article, a person, a reading, a request waiting on someone.
/// </summary>
/// <remarks>Which of the three regions a kind of content belongs in, and what happens to the bands when one is left out.</remarks>
internal sealed class CardExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.card.examples";

    protected override string ComponentRoute => "/layouts/card";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.layouts.card.header";
    protected override string HeaderDescription => "demo.layouts.card.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateArticleGroup(), CreateReadingGroup(), CreateControlGroup()],
            [CreatePersonGroup(), CreateWaitingGroup(), CreateBandsGroup()]
        ));
    }

    private static ContainerComponent CreateArticleGroup()
        => CreateGalleryItem("An article", new CardComponent()
            .ConfigureDefaultHeader(header => header
                .SetTitle("Server-driven UI")
                .SetDescription("8 min read · Architecture")
            )
            // A paragraph rather than a text component: a card's body is prose, and text content keeps one line.
            .SetContent(new ParagraphComponent()
                .SetDescription("Views are authored in C#, compiled into a component graph on the server, and rendered to the browser as incremental DOM updates over SignalR.")
                .SetDescriptionType(UITextAppearance.Body)
            )
        );

    private static ContainerComponent CreatePersonGroup()
        => CreateGalleryItem("A person", new CardComponent()
            .ConfigureDefaultHeader(header => header
                .SetTitle("Robin Hale")
                .SetDescription("Client runtime")
                // The same Icon property carrying a picture, which with no size given fills the header's height.
                .SetIcon(DemoImages.Avatar)
                .SetBadgeText("Admin")
            )
            .SetContent(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .AddChild(new TextComponent().SetIcon(DemoIcons.Mail).SetTitle("robin@example.com").SetTitleType(UITextAppearance.Caption))
                .AddChild(new TextComponent().SetIcon(DemoIcons.Clock).SetTitle("UTC+2 · usually online 9-17").SetTitleType(UITextAppearance.Caption))
            )
        );

    private static ContainerComponent CreateReadingGroup()
        => CreateGalleryItem("A reading", new CardComponent()
            .ConfigureDefaultHeader(header => header
                .SetTitle("Deploys this week")
                .SetBadgeText("+18%")
                .SetBadgeStyle(UIBadgeType.Success)
            )
            .SetContent(new TextComponent()
                .SetTitle("47")
                .SetTitleType(UITextAppearance.Display)
                .SetDescription("12 to production, 35 to staging")
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.Muted)
            )
        );

    private static ContainerComponent CreateWaitingGroup()
        => CreateGalleryItem("Something waiting on you", new CardComponent()
            .ConfigureDefaultHeader(header => header
                .SetTitle("Web Portal · #482")
                .SetDescription("Fix circular progress anti-aliasing")
                .SetIcon(DemoIcons.Check)
                .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Success))
            )
            .SetContent(new ParagraphComponent()
                .SetDescription("All checks passed. Two approvals, no requested changes — ready to merge.")
                .SetDescriptionType(UITextAppearance.Body)
            )
            // The footer is where what you can do about the card goes, as one row of answers.
            .SetFooter(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetSize(UIButtonSize.Small)
                    .SetTitle("Merge")
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .SetSize(UIButtonSize.Small)
                    .SetTitle("View diff")
                )
            )
        );

    private static ContainerComponent CreateControlGroup()
        => CreateGalleryItem("A control that acts on the card", new CardComponent()
            .ConfigureDefaultHeader(header => header
                .SetTitle("Release 2.4")
                .SetDescription("Scheduled for Friday")
            )
            // The header's own slot: what it does is close this card, not act on its content.
            .SetHeaderAction(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetIcon(DemoIcons.Outline(DemoIcons.Close))
                .SetTooltip("Dismiss")
            )
            .SetContent(new ParagraphComponent()
                .SetDescription("The header keeps its own text on one line and the control takes only what it needs.")
                .SetDescriptionType(UITextAppearance.Body)
            )
        );

    private static ContainerComponent CreateBandsGroup()
        => CreateGalleryItem("The bands that are not there", new CardComponent()
            .SetHeaderAction(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .SetIcon(DemoIcons.Outline(DemoIcons.Close))
                .SetTooltip("Dismiss")
            )
            .SetContent(new ParagraphComponent()
                .SetDescription("No header text and no footer: a region is drawn only where there is something to draw, and a band that is nothing but a control keeps neither the rule nor the room a header would take.")
                .SetDescriptionType(UITextAppearance.Body)
            )
        );

    private static ContainerComponent CreateGalleryItem(string label, CardComponent card)
    {
        return DemoUI.CreateGroup(null, label,
            content => content.AddChild(card
                .SetWidth(UILayoutLength.Absolute(340))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }
}
