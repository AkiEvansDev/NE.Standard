using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Badge;
using DemoApp.Views.Base;
using NE.Colors;

namespace DemoApp.Views.Contents.Badge;

/// <summary>
/// One badge and every property that can be bound to it; then where a badge is, and when it is a component rather than a property.
/// </summary>
/// <remarks>Most badges are a text control's own <c>BadgeText</c>; the component is for the cases that are not.</remarks>
internal sealed class BadgeView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string BadgeGroup = nameof(BadgeController.BadgeGroup);

    private static readonly UIBadgeType[] FillRowTypes = [UIBadgeType.Primary, UIBadgeType.Accent, UIBadgeType.Info, UIBadgeType.Warning, UIBadgeType.Success, UIBadgeType.Danger, UIBadgeType.Surface];

    public static string ViewKey => "demo.contents.badge";

    protected override string ComponentRoute => "/contents/badge";
    protected override string Header => "demo.contents.badge.header";
    protected override string HeaderDescription => "demo.contents.badge.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/chat", "demo.nav.screens.chat");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new BadgeComponent()
            .BindStandard()
            .BindType($"{BadgeGroup}.{nameof(BadgeGroupContext.Type)}")
            .BindColor($"{BadgeGroup}.{nameof(BadgeGroupContext.Color)}")
            .BindFill($"{BadgeGroup}.{nameof(BadgeGroupContext.Fill)}")
            .BindIcon($"{BadgeGroup}.{nameof(BadgeGroupContext.Icon)}")
            .BindIconColor($"{BadgeGroup}.{nameof(BadgeGroupContext.IconColor)}")
            .BindIconSize($"{BadgeGroup}.{nameof(BadgeGroupContext.IconSize)}")
            .BindText($"{BadgeGroup}.{nameof(BadgeGroupContext.Text)}")
            .BindTextType($"{BadgeGroup}.{nameof(BadgeGroupContext.TextType)}")
            .BindTooltip($"{BadgeGroup}.{nameof(BadgeGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{BadgeGroup}.{nameof(BadgeGroupContext.TooltipPlacement)}")
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge")
        );

    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateCarriedGroup(), CreateCountGroup()], [CreateStatusGroup(), CreateCategoryGroup(), CreateFillGroup()]);

    /// <summary>
    /// The badge as a property of something else: a <c>BadgeText</c> laid out with the words it qualifies, or several under a title.
    /// </summary>
    private static ContainerComponent CreateCarriedGroup()
    {
        return DemoUI.CreateExample("Carried by something else",
            UILayout.Stack(12)
                .SetWidth(UILayoutLength.Absolute(400))
                .AddChild(new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle("Release 2.4")
                        .SetDescription("Scheduled for Friday")
                        .SetBadgeText("Latest")
                        .SetBadgeStyle(UIBadgeType.Success)
                    )
                    .SetContent(UIText.Note("A card header is a text component, so its badge is the same pair of properties."))
                )
                .AddChild(new ExpanderComponent()
                    .SetCollapsed()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Access")
                        .SetBadgeText("Owner only")
                        .SetBadgeStyle(UIBadgeType.Warning)
                    )
                    .SetContent(UIText.Note("So is an expander's, which is why the two look identical closed."))
                )
                .AddChild(new ActionComponent()
                    .SetIcon(DemoIcons.Bell)
                    .SetTitle("Notifications")
                    .SetDescription("Mailed to on-call")
                    .SetBadgeText("3 new")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetWrap(true)
                    .SetSpacing(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
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
                // A list's row: the badges under the title in place of a description, the row's actions at its end.
                .AddChild(UILayout.Ends(
                    UIText.WithBadges("billing · #481", [
                        new BadgeItem { BadgeText = "production", BadgeStyle = UIBadgeType.Success },
                        new BadgeItem { BadgeText = "12 of 12", BadgeIcon = DemoIcons.Outline(DemoIcons.Check) },
                        new BadgeItem { BadgeText = "eu-west", BadgeStyle = UIBadgeType.Surface }
                    ], DemoIcons.Outline(DemoIcons.Server)),
                    UIIconButtons.Edit(),
                    UIIconButtons.Delete()
                    )
                ),
            note: "A text's BadgeText is one badge beside its title; UIText.WithBadges puts several under it, a service's state at a glance."
        );
    }

    /// <summary>
    /// A reading and a pill saying whether it is all right; the pill belongs to the value column, not the name.
    /// </summary>
    private static ContainerComponent CreateStatusGroup()
    {
        return DemoUI.CreateExample("A value, and what it means",
            // On a panel: the pills only read as one column of verdicts sharing a right edge and a ground.
            new SurfaceComponent()
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetContent(UILayout.Stack(4)
                    .SetWidth(UILayoutLength.Absolute(360))
                    .AddChild(UILayout.Ends(
                        new TextComponent()
                            .SetTitle("Error rate")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetDescription("0.4%")
                            .SetDescriptionType(UITextAppearance.Body),
                        new BadgeComponent()
                            .SetType(UIBadgeType.Success)
                            .SetText("Normal")
                        )
                        .SetPadding(UIThickness.All(0, 6, 0, 6))
                    )
                    .AddChild(UILayout.Ends(
                        new TextComponent()
                            .SetTitle("p95 latency")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetDescription("412 ms")
                            .SetDescriptionType(UITextAppearance.Body),
                        new BadgeComponent()
                            .SetType(UIBadgeType.Warning)
                            .SetText("Watch")
                        )
                        .SetPadding(UIThickness.All(0, 6, 0, 6))
                    )
                    .AddChild(UILayout.Ends(
                        new TextComponent()
                            .SetTitle("Queue depth")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetDescription("18 400")
                            .SetDescriptionType(UITextAppearance.Body),
                        new BadgeComponent()
                            .SetType(UIBadgeType.Danger)
                            .SetText("Over")
                        )
                        .SetPadding(UIThickness.All(0, 6, 0, 6))
                    )
                    .AddChild(UILayout.Ends(
                        new TextComponent()
                            .SetTitle("Certificate")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetDescription("expires in 3 days")
                            .SetDescriptionType(UITextAppearance.Body),
                        new BadgeComponent()
                            .SetType(UIBadgeType.Warning)
                            .SetText("Renew")
                        )
                        .SetPadding(UIThickness.All(0, 6, 0, 6))
                    )
                    .AddChild(UILayout.Ends(
                        new TextComponent()
                            .SetTitle("Last deploy")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetDescription("4 minutes ago")
                            .SetDescriptionType(UITextAppearance.Body),
                        new BadgeComponent()
                            .SetType(UIBadgeType.Success)
                            .SetText("Healthy")
                        )
                        .SetPadding(UIThickness.All(0, 6, 0, 6))
                    )
                )
        );
    }

    /// <summary>
    /// A count with nothing to be a property of; with no text the pill is drawn as a circle.
    /// </summary>
    private static ContainerComponent CreateCountGroup()
    {
        return DemoUI.CreateExample("A count on its own",
            new SurfaceComponent()
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetPadding(UIThickness.Uniform(8))
                .SetContent(UILayout.Stack(4)
                    .AddChild(UILayout.Ends(
                        new TextComponent()
                            .SetIcon(DemoIcons.Mail)
                            .SetTitle("Inbox")
                            .SetTitleType(UITextAppearance.Body),
                        new BadgeComponent()
                            .SetType(UIBadgeType.Danger)
                            .SetText("12")
                        )
                        .SetWidth(UILayoutLength.Absolute(200))
                        .SetPadding(UIThickness.All(4, 4, 4, 4))
                    )
                    .AddChild(UILayout.Ends(
                        new TextComponent()
                            .SetIcon(DemoIcons.Bell)
                            .SetTitle("Alerts")
                            .SetTitleType(UITextAppearance.Body),
                        new BadgeComponent()
                            .SetType(UIBadgeType.Warning)
                            .SetText("3")
                        )
                        .SetWidth(UILayoutLength.Absolute(200))
                        .SetPadding(UIThickness.All(4, 4, 4, 4))
                    )
                    // No text on the last one: the pill is a dot, for when the number does not matter.
                    .AddChild(UILayout.Ends(
                        new TextComponent()
                            .SetIcon(DemoIcons.Check)
                            .SetTitle("Done")
                            .SetTitleType(UITextAppearance.Body),
                        new BadgeComponent()
                            .SetType(UIBadgeType.Success)
                            .SetTooltip("Nothing waiting")
                        )
                        .SetWidth(UILayoutLength.Absolute(200))
                        .SetPadding(UIThickness.All(4, 4, 4, 4))
                    )
                )
        );
    }

    /// <summary>
    /// A row of pills, each one a thing rather than a state; this is where <c>Color</c> earns its place over <c>Type</c>.
    /// </summary>
    private static ContainerComponent CreateCategoryGroup()
    {
        return DemoUI.CreateExample("A row of them, one thing each",
            // The head of a server's page, which is where a row of tags actually lives.
            new CardComponent()
                .SetWidth(UILayoutLength.Absolute(420))
                .ConfigureDefaultHeader(header => header
                    .SetTitle("db-us-east-2")
                    .SetDescription("Pinecrest Clinic's primary database")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .SetContent(UILayout.Row(6)
                    .AddChild(new BadgeComponent().SetColor(UIThemeColor.FromStyle(UIColorStyle.Info)).SetText("Pro"))
                    .AddChild(new BadgeComponent().SetColor(UIThemeColor.FromStyle(UIColorStyle.Accent)).SetText("us-east"))
                    .AddChild(new BadgeComponent().SetColor(UIThemeColor.FromStyle(UIColorStyle.Success)).SetText("backups on"))
                    .AddChild(new BadgeComponent().SetColor(UIThemeColor.FromStyle(UIColorStyle.Warning)).SetText("Degraded"))
                    .AddChild(new BadgeComponent()
                        .SetType(UIBadgeType.Surface)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Clock))
                        .SetText("maintenance tonight")
                    )
                )
        );
    }

    /// <summary>
    /// The three fills across the styles: the colour as the ground, a tint of it, or its edge alone.
    /// </summary>
    private static ContainerComponent CreateFillGroup()
    {
        return DemoUI.CreateExample("Filled, tinted or outlined",
            // Unset, a Type fills and a Color tints; Fill names one for either, so a tag can be outlined and a status tinted.
            new SurfaceComponent()
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetContent(UILayout.Stack(10)
                    .AddChild(CreateFillRow(UIBadgeFill.Filled))
                    .AddChild(CreateFillRow(UIBadgeFill.Tinted))
                    .AddChild(CreateFillRow(UIBadgeFill.Outline))
                )
        );
    }

    private static StackPanelComponent CreateFillRow(UIBadgeFill fill)
    {
        StackPanelComponent row = UILayout.Row(6).SetWrap(true);

        foreach (UIBadgeType type in FillRowTypes)
            _ = row.AddChild(new BadgeComponent().SetType(type).SetFill(fill).SetText(type.ToString()));

        return row
            .AddChild(new BadgeComponent().SetColor(UIThemeColor.FromColorVariant(ColorName.NebulaRose)).SetFill(fill).SetText("Tag"))
            .AddChild(new BadgeComponent().SetType(UIBadgeType.Danger).SetFill(fill).SetText("12"));
    }
}
