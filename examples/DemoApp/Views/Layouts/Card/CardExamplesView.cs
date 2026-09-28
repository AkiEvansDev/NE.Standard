using DemoApp.Views.Base;

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
            )
        );
    }

    private static ContainerComponent CreateArticleGroup()
        => DemoUI.CreateExample("An article",
            new CardComponent()
                .SetWidth(UILayoutLength.Absolute(340))
                .ConfigureDefaultHeader(header => header
                    .SetTitle("Why Europe North runs on new disks")
                    .SetDescription("6 min read · Infrastructure")
                )
                // A paragraph rather than a text component: a card's body is prose, and text content keeps one line.
                .SetContent(new ParagraphComponent()
                    .SetDescription("Stockholm opened in 2023 on new disks from the first day, so its databases read faster than any other region's, and the older regions now move over one server at a time.")
                    .SetDescriptionType(UITextAppearance.Body)
                )
        );

    private static ContainerComponent CreatePersonGroup()
        => DemoUI.CreateExample("A person",
            new CardComponent()
                .SetWidth(UILayoutLength.Absolute(340))
                .ConfigureDefaultHeader(header => header
                    .SetTitle("Robin Hale")
                    .SetDescription("Orvane Cloud staff")
                    // The same Icon property carrying a picture, which with no size given fills the header's height.
                    .SetIcon(DemoImages.Avatar)
                    .SetBadgeText("Admin")
                )
                .SetContent(UILayout.Stack(8)
                    .AddChild(new TextComponent().SetIcon(DemoIcons.Mail).SetTitle("robin@orvane.example").SetTitleType(UITextAppearance.Caption))
                    .AddChild(new TextComponent().SetIcon(DemoIcons.Clock).SetTitle("UTC+2 · usually online 9-17").SetTitleType(UITextAppearance.Caption))
                )
        );

    private static ContainerComponent CreateReadingGroup()
        => DemoUI.CreateExample("A reading",
            new CardComponent()
                .SetWidth(UILayoutLength.Absolute(340))
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
        => DemoUI.CreateExample("Something waiting on you",
            new CardComponent()
                .SetWidth(UILayoutLength.Absolute(340))
                .ConfigureDefaultHeader(header => header
                    .SetTitle("Change request · CHG-482")
                    .SetDescription("Resize db-us-east-2 to Dedicated")
                    .SetIcon(DemoIcons.Check)
                    .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Success))
                )
                .SetContent(new ParagraphComponent()
                    .SetDescription("Plan checked and the maintenance window booked — one approval left, and it is yours.")
                    .SetDescriptionType(UITextAppearance.Body)
                )
                // The footer is where what you can do about the card goes, as one row of answers.
                .SetFooter(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetSize(UIButtonSize.Small)
                        .SetTitle("Approve")
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetSize(UIButtonSize.Small)
                        .SetTitle("View plan")
                    )
                )
        );

    private static ContainerComponent CreateControlGroup()
        => DemoUI.CreateExample("A control that acts on the card",
            new CardComponent()
                .SetWidth(UILayoutLength.Absolute(340))
                .ConfigureDefaultHeader(header => header
                    .SetTitle("Release 483")
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
        => DemoUI.CreateExample("The bands that are not there",
            new CardComponent()
                .SetWidth(UILayoutLength.Absolute(340))
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
}
