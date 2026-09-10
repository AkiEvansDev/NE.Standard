using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Contents.Badge;

/// <summary>
/// Where a badge is, and when it is a component rather than a property.
/// </summary>
/// <remarks>Most badges are a text control's own <c>BadgeText</c>; the component is for the cases that are not.</remarks>
internal sealed class BadgeExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.badge.examples";

    protected override string ComponentRoute => "/contents/badge";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.badge.header";
    protected override string HeaderDescription => "demo.contents.badge.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateCarriedGroup(), CreateCountGroup()],
            [CreateStatusGroup(), CreateCategoryGroup()]
        ));
    }

    /// <summary>
    /// The badge as a property of something else: a <c>BadgeText</c> laid out with the words it qualifies.
    /// </summary>
    private static ContainerComponent CreateCarriedGroup()
    {
        return DemoUI.CreateGroup(null, "Carried by something else",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetWidth(UILayoutLength.Absolute(400))
                .AddChild(new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle("Release 2.4")
                        .SetDescription("Scheduled for Friday")
                        .SetBadgeText("Latest")
                        .SetBadgeStyle(UIBadgeType.Success)
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("A card header is a text component, so its badge is the same pair of properties.")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new ExpanderComponent()
                    .SetCollapsed()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Access")
                        .SetBadgeText("Owner only")
                        .SetBadgeStyle(UIBadgeType.Warning)
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("So is an expander's, which is why the two look identical closed.")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .AddChild(new ActionComponent()
                    .SetIcon(DemoIcons.Bell)
                    .SetTitle("Notifications")
                    .SetDescription("Sent to #releases")
                    .SetBadgeText("3 new")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Mail))
                        .SetTitle("Inbox")
                        .SetBadgeText("12")
                        .SetBadgeStyle(UIBadgeType.Danger)
                    )
                    .AddChild(new TextComponent()
                        .SetIcon(DemoIcons.User)
                        .SetTitle("Robin Hale")
                        .SetBadgeText("Admin")
                        .SetVerticalAlignment(UIAlignment.Center)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A reading and a pill saying whether it is all right; the pill belongs to the value column, not the name.
    /// </summary>
    private static ContainerComponent CreateStatusGroup()
    {
        return DemoUI.CreateGroup(null, "A value, and what it means",
            // On a panel: the pills only read as one column of verdicts sharing a right edge and a ground.
            content => content.AddChild(new SurfaceComponent()
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(4)
                    .SetWidth(UILayoutLength.Absolute(360))
                    .AddChild(CreateReading("Error rate", "0.4%", "Normal", UIBadgeType.Success))
                    .AddChild(CreateReading("p95 latency", "412 ms", "Watch", UIBadgeType.Warning))
                    .AddChild(CreateReading("Queue depth", "18 400", "Over", UIBadgeType.Danger))
                    .AddChild(CreateReading("Certificate", "expires in 3 days", "Renew", UIBadgeType.Warning))
                    .AddChild(CreateReading("Last deploy", "4 minutes ago", "Healthy", UIBadgeType.Success))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static ContainerComponent CreateReading(string name, string value, string state, UIBadgeType style)
        => new ContainerComponent()
            .SetPadding(UIThickness.All(0, 6, 0, 6))
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(new TextComponent()
                .SetTitle(name)
                .SetTitleType(UITextAppearance.Caption)
                .SetDescription(value)
                .SetDescriptionType(UITextAppearance.Body)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetPlacement(1, 1, 23, 1)
            )
            .AddChild(new BadgeComponent()
                .SetStyle(style)
                .SetText(state)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetHorizontalAlignment(UIAlignment.End)
                .SetPlacement(24, 1, 1, 1)
            );

    /// <summary>
    /// A count with nothing to be a property of; with no text the pill is drawn as a circle.
    /// </summary>
    private static ContainerComponent CreateCountGroup()
    {
        return DemoUI.CreateGroup(null, "A count on its own",
            content => content.AddChild(new SurfaceComponent()
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetPadding(UIThickness.Uniform(8))
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(4)
                    .AddChild(CreateRail(DemoIcons.Mail, "Inbox", "12", UIBadgeType.Danger))
                    .AddChild(CreateRail(DemoIcons.Bell, "Alerts", "3", UIBadgeType.Warning))
                    .AddChild(CreateRail(DemoIcons.Check, "Done", null, UIBadgeType.Success))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    // No text on the last one: the pill is a dot, for when the number does not matter.
    private static ContainerComponent CreateRail(string icon, string title, string? count, UIBadgeType style)
        => new ContainerComponent()
            .SetWidth(UILayoutLength.Absolute(200))
            .SetPadding(UIThickness.All(4, 4, 4, 4))
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(new TextComponent()
                .SetIcon(icon)
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Body)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetPlacement(1, 1, 23, 1)
            )
            .AddChild(new BadgeComponent()
                .SetStyle(style)
                .SetText(count)
                .SetTooltip(count is null ? "Nothing waiting" : null)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetHorizontalAlignment(UIAlignment.End)
                .SetPlacement(24, 1, 1, 1)
            );

    /// <summary>
    /// A row of pills, each one a thing rather than a state; this is where <c>Color</c> earns its place over <c>Style</c>.
    /// </summary>
    private static ContainerComponent CreateCategoryGroup()
    {
        return DemoUI.CreateGroup(null, "A row of them, one thing each",
            // The head of an issue, which is where a row of tags actually lives.
            content => content.AddChild(new CardComponent()
                .SetWidth(UILayoutLength.Absolute(420))
                .ConfigureDefaultHeader(header => header
                    .SetTitle("Web Portal · #482")
                    .SetDescription("Fix circular progress anti-aliasing")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(6)
                    .SetWrap(true)
                    .AddChild(CreateTag("client", UIColorStyle.Info))
                    .AddChild(CreateTag("rendering", UIColorStyle.Accent))
                    .AddChild(CreateTag("good first issue", UIColorStyle.Success))
                    .AddChild(CreateTag("needs design", UIColorStyle.Warning))
                    .AddChild(new BadgeComponent()
                        .SetStyle(UIBadgeType.Surface)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Clock))
                        .SetText("opened 6 days ago")
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static BadgeComponent CreateTag(string name, UIColorStyle color)
        => new BadgeComponent()
            .SetColor(UIThemeColor.FromStyle(color))
            .SetText(name);
}
