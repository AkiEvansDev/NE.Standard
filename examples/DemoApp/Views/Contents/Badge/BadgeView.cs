using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Badge;
using DemoApp.Views.Base;
using NE.Colors;

namespace DemoApp.Views.Contents.Badge;

/// <summary>
/// One badge and every property that can be bound to it; then where a badge is, and when it is a component rather than a property.
/// </summary>
/// <remarks>Most badges are a text control's own <c>BadgeTitle</c>; the component is for the cases that are not.</remarks>
internal sealed class BadgeView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string BadgeGroup = nameof(BadgeController.BadgeGroup);

    private static readonly UIBadgeVariant[] FillRowVariants = [UIBadgeVariant.Primary, UIBadgeVariant.Accent, UIBadgeVariant.Info, UIBadgeVariant.Warning, UIBadgeVariant.Success, UIBadgeVariant.Danger, UIBadgeVariant.Surface];

    public static string ViewKey => "demo.contents.badge";

    protected override string ComponentRoute => "/contents/badge";
    protected override string Header => "demo.contents.badge.header";
    protected override string HeaderDescription => "demo.contents.badge.description";
    protected override (string Route, string Title)? ComposedIn => ("/screens/chat", "demo.nav.screens.chat");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new BadgeComponent()
            .BindStandard()
            .BindVariant<BadgeController>(static x => x.BadgeGroup.Variant)
            .BindColor<BadgeController>(static x => x.BadgeGroup.Color)
            .BindFill<BadgeController>(static x => x.BadgeGroup.Fill)
            .BindIcon<BadgeController>(static x => x.BadgeGroup.Icon)
            .BindIconColor<BadgeController>(static x => x.BadgeGroup.IconColor)
            .BindIconSize<BadgeController>(static x => x.BadgeGroup.IconSize)
            .BindTitle<BadgeController>(static x => x.BadgeGroup.Title)
            .BindTitleType<BadgeController>(static x => x.BadgeGroup.TitleType)
            .BindTooltip<BadgeController>(static x => x.BadgeGroup.Tooltip)
            .BindTooltipPlacement<BadgeController>(static x => x.BadgeGroup.TooltipPlacement)
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
    /// The badge as a property of something else: a <c>BadgeTitle</c> laid out with the words it qualifies, or several under a title.
    /// </summary>
    private static ContainerComponent CreateCarriedGroup()
    {
        return DemoUI.CreateExample("Inline component badges & UIText.WithBadges",
            UILayout.Stack(12)
                .SetWidth(UILayoutLength.Absolute(400))
                .SetMaxWidth(UILayoutLength.Fill())
                .AddChild(new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.FileText)
                        .SetTitle("Release 2.4")
                        .SetDescription("Scheduled for Friday")
                        .SetBadgeTitle("Latest")
                        .SetBadgeVariant(UIBadgeVariant.Success)
                    )
                    .SetContent(UIText.Note("A card header is a text component, so its badge is the same pair of properties."))
                )
                .AddChild(new ExpanderComponent()
                    .SetCollapsed()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Access")
                        .SetBadgeTitle("Owner only")
                        .SetBadgeVariant(UIBadgeVariant.Warning)
                    )
                    .SetContent(UIText.Note("So is an expander's, which is why the two look identical closed."))
                )
                .AddChild(new ActionComponent()
                    .SetIcon(DemoIcons.Bell)
                    .SetTitle("Notifications")
                    .SetDescription("Mailed to on-call")
                    .SetBadgeTitle("3 new")
                    .SetBadgeVariant(UIBadgeVariant.Info)
                )
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetWrap(true)
                    .SetSpacing(8)
                    .AddChild(new ButtonComponent()
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Mail))
                        .SetTitle("Inbox")
                        .SetBadgeTitle("12")
                        .SetBadgeVariant(UIBadgeVariant.Danger)
                    )
                    .AddChild(new TextComponent()
                        .SetIcon(DemoIcons.User)
                        .SetTitle("Robin Hale")
                        .SetBadgeTitle("Admin")
                        .SetVerticalAlignment(UIAlignment.Center)
                    )
                )
                // A list's row: the badges under the title in place of a description, the row's actions at its end.
                .AddChild(UILayout.Ends(
                    UIText.WithBadges("billing · #481", [
                        new BadgeItem { BadgeTitle = "production", BadgeVariant = UIBadgeVariant.Success },
                        new BadgeItem { BadgeTitle = "12 of 12", BadgeIcon = DemoIcons.Outline(DemoIcons.Check) },
                        new BadgeItem { BadgeTitle = "eu-west", BadgeVariant = UIBadgeVariant.Surface }
                    ], DemoIcons.Outline(DemoIcons.Server)),
                    UIIconButtons.Edit(),
                    UIIconButtons.Delete()
                    )
                ),
            note: "A text's BadgeTitle is one badge beside its title; UIText.WithBadges puts several under it, a service's state at a glance."
        );
    }

    /// <summary>
    /// A reading and a pill saying whether it is all right; the pill belongs to the value column, not the name.
    /// </summary>
    private static ContainerComponent CreateStatusGroup()
    {
        return DemoUI.CreateExample("Status badges on metric rows",
            // On a panel: the pills only read as one column of verdicts sharing a right edge and a ground.
            new SurfaceComponent()
                .SetHorizontalAlignment(UIAlignment.Start)
                .SetMaxWidth(UILayoutLength.Fill())
                .SetContent(UILayout.Stack(4)
                    .SetWidth(UILayoutLength.Absolute(360))
                    .SetMaxWidth(UILayoutLength.Fill())
                    .AddChild(UILayout.Ends(
                        new TextComponent()
                            .SetTitle("Error rate")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetDescription("0.4%")
                            .SetDescriptionType(UITextAppearance.Body),
                        new BadgeComponent()
                            .SetVariant(UIBadgeVariant.Success)
                            .SetTitle("Normal")
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
                            .SetVariant(UIBadgeVariant.Warning)
                            .SetTitle("Watch")
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
                            .SetVariant(UIBadgeVariant.Danger)
                            .SetTitle("Over")
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
                            .SetVariant(UIBadgeVariant.Warning)
                            .SetTitle("Renew")
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
                            .SetVariant(UIBadgeVariant.Success)
                            .SetTitle("Healthy")
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
        return DemoUI.CreateExample("Numeric counters & dot indicators",
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
                            .SetVariant(UIBadgeVariant.Danger)
                            .SetTitle("12")
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
                            .SetVariant(UIBadgeVariant.Warning)
                            .SetTitle("3")
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
                            .SetVariant(UIBadgeVariant.Success)
                            .SetTooltip("Nothing waiting")
                        )
                        .SetWidth(UILayoutLength.Absolute(200))
                        .SetPadding(UIThickness.All(4, 4, 4, 4))
                    )
                )
        );
    }

    /// <summary>
    /// A row of pills, each one a thing rather than a state; this is where <c>Color</c> earns its place over <c>Variant</c>.
    /// </summary>
    private static ContainerComponent CreateCategoryGroup()
    {
        return DemoUI.CreateExample("Tag strips with custom colors",
            // The head of a server's page, which is where a row of tags actually lives.
            new CardComponent()
                .SetWidth(UILayoutLength.Absolute(420))
                .SetMaxWidth(UILayoutLength.Fill())
                .ConfigureDefaultHeader(header => header
                    .SetTitle("db-us-east-2")
                    .SetDescription("Pinecrest Clinic's primary database")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .SetContent(UILayout.Row(6)
                    .AddChild(new BadgeComponent().SetColor(UIThemeColor.FromStyle(UIColorStyle.Info)).SetTitle("Pro"))
                    .AddChild(new BadgeComponent().SetColor(UIThemeColor.FromStyle(UIColorStyle.Accent)).SetTitle("us-east"))
                    .AddChild(new BadgeComponent().SetColor(UIThemeColor.FromStyle(UIColorStyle.Success)).SetTitle("backups on"))
                    .AddChild(new BadgeComponent().SetColor(UIThemeColor.FromStyle(UIColorStyle.Warning)).SetTitle("Degraded"))
                    .AddChild(new BadgeComponent()
                        .SetVariant(UIBadgeVariant.Surface)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Clock))
                        .SetTitle("maintenance tonight")
                    )
                )
        );
    }

    /// <summary>
    /// The three fills across the styles: the colour as the ground, a tint of it, or its edge alone.
    /// </summary>
    private static ContainerComponent CreateFillGroup()
    {
        return DemoUI.CreateExample("Fill styles (Filled, Tinted, Outline)",
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

        foreach (UIBadgeVariant variant in FillRowVariants)
            _ = row.AddChild(new BadgeComponent().SetVariant(variant).SetFill(fill).SetTitle(variant.ToString()));

        return row
            .AddChild(new BadgeComponent().SetColor(UIThemeColor.FromColorVariant(ColorName.NebulaRose)).SetFill(fill).SetTitle("Tag"))
            .AddChild(new BadgeComponent().SetVariant(UIBadgeVariant.Danger).SetFill(fill).SetTitle("12"));
    }
}
