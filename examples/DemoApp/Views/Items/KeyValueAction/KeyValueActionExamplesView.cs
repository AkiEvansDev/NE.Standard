using DemoApp.Views.Base;

namespace DemoApp.Views.Items.KeyValueAction;

/// <summary>
/// What a row can be made of: key, value and action are each a whole text model rather than a string.
/// </summary>
internal sealed class KeyValueActionExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.items.key-value-action.examples";

    protected override string ComponentRoute => "/items/key-value-action";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.items.key-value-action.header";
    protected override string HeaderDescription => "demo.items.key-value-action.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateDetailsGroup(), CreateBadgedGroup(), CreateCompactGroup()],
            [CreateCardGroup(), CreateDescribedGroup(), CreateReadOnlyGroup()]
            )
        );
    }

    /// <summary>The ordinary case: key, value and a per-row action.</summary>
    private static ContainerComponent CreateDetailsGroup()
    {
        return DemoUI.CreateExample("Server details",
            new KeyValueActionComponent()
                .SetItems(
                [
                    new KeyValueActionItem
                    {
                        Id = "ipv4",
                        Key = new TextItem { Title = "IPv4", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "203.0.113.24" },
                        Action = new ButtonItem { Id = "ipv4", Icon = DemoIcons.Outline(DemoIcons.Copy), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "plan",
                        Key = new TextItem { Title = "Plan", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "Pro" },
                        Action = new ButtonItem { Id = "plan", Icon = DemoIcons.Outline(DemoIcons.ExternalLink), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "uptime",
                        Key = new TextItem { Title = "Uptime", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "41 d" },
                        Action = new ButtonItem { Id = "uptime", Icon = DemoIcons.Outline(DemoIcons.History), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "snapshot",
                        Key = new TextItem { Title = "Snapshot", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "api-eu-west-1.snap" },
                        Action = new ButtonItem { Id = "snapshot", Icon = DemoIcons.Outline(DemoIcons.Download), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                ])
        );
    }

    /// <summary>
    /// A badge in either slot; the key's is <c>Inline</c>, since <c>Trailing</c> would send it to the value's doorstep.
    /// </summary>
    private static ContainerComponent CreateBadgedGroup()
    {
        return DemoUI.CreateExample("Flagged rows",
            new KeyValueActionComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetItems(
                [
                    new KeyValueActionItem
                    {
                        Id = "endpoint",
                        Key = new TextItem { Title = "Endpoint", TitleColor = UIThemeColor.Muted, BadgeStyle = UIBadgeType.Surface, BadgePlacement = UITextBadgePlacement.Inline },
                        Value = new TextItem { Title = "api.orvane.example", BadgeText = "live", BadgeStyle = UIBadgeType.Success },
                        Action = new ButtonItem { Id = "endpoint", Icon = DemoIcons.Outline(DemoIcons.Settings), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "beta",
                        Key = new TextItem { Title = "IPv6", TitleColor = UIThemeColor.Muted, BadgeText = "beta", BadgeStyle = UIBadgeType.Surface, BadgePlacement = UITextBadgePlacement.Inline },
                        Value = new TextItem { Title = "rolling out", BadgeText = "42 %", BadgeStyle = UIBadgeType.Warning },
                        Action = new ButtonItem { Id = "beta", Icon = DemoIcons.Outline(DemoIcons.Settings), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "legacy",
                        Key = new TextItem { Title = "Legacy export", TitleColor = UIThemeColor.Muted, BadgeText = "deprecated", BadgeStyle = UIBadgeType.Surface, BadgePlacement = UITextBadgePlacement.Inline },
                        Value = new TextItem { Title = "off", BadgeStyle = UIBadgeType.Danger },
                        Action = new ButtonItem { Id = "legacy", Icon = DemoIcons.Outline(DemoIcons.Settings), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                ])
        );
    }

    /// <summary>
    /// <c>StretchValue</c> off, so the value column shrinks to its content instead of pushing the action out.
    /// </summary>
    private static ContainerComponent CreateCompactGroup()
    {
        return DemoUI.CreateExample("Compact values",
            new KeyValueActionComponent()
                .SetStretchValue(false)
                .SetRowHoverable(true)
                .SetItems(
                [
                    new KeyValueActionItem
                    {
                        Id = "region",
                        Key = new TextItem { Title = "Region", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "eu-west" },
                        Action = new ButtonItem { Id = "region", Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "replicas",
                        Key = new TextItem { Title = "Replicas", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "3" },
                        Action = new ButtonItem { Id = "replicas", Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "plan",
                        Key = new TextItem { Title = "Plan", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "standard" },
                        Action = new ButtonItem { Id = "plan", Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                ])
        );
    }

    /// <summary>
    /// The list where it usually lives: a card's body, so the card draws the edge and the rows run to its sides.
    /// </summary>
    private static ContainerComponent CreateCardGroup()
    {
        return DemoUI.CreateExample("In a card",
            new CardComponent()
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.Cloud)
                    .SetTitle("billing")
                    .SetDescription("What the panel reads off the service")
                )
                // UIDetails.List: no action column and no edge of its own, since a summary is read, not operated.
                .SetContent(UIDetails.List(("Region", "eu-west"), ("Replicas", "12"), ("Image", "billing:2.4.1"))),
            note: "No edge of its own inside a card, and no action column: a summary is read, not operated."
        );
    }

    /// <summary>
    /// A description in either slot, which wraps under its title inside the column rather than widening the row.
    /// </summary>
    private static ContainerComponent CreateDescribedGroup()
    {
        return DemoUI.CreateExample("Explained settings",
            new KeyValueActionComponent()
                .SetRowHoverable(true)
                .SetItems(
                [
                    new KeyValueActionItem
                    {
                        Id = "retention",
                        Key = new TextItem { Title = "Retention", TitleColor = UIThemeColor.Muted, Description = "Deleted after this long" },
                        Value = new TextItem { Title = "30 days", Description = "Counted from the last write" },
                        Action = new ButtonItem { Id = "retention", Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "replicas",
                        Key = new TextItem { Title = "Replicas", TitleColor = UIThemeColor.Muted, Description = "Copies kept in the region" },
                        Value = new TextItem { Title = "3", Description = "One per availability zone" },
                        Action = new ButtonItem { Id = "replicas", Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "plan",
                        Key = new TextItem { Title = "Plan", TitleColor = UIThemeColor.Muted, Description = "What the quota is drawn from" },
                        Value = new TextItem { Title = "Standard", Description = "2 vCPU, 4 GB, 80 GB" },
                        Action = new ButtonItem { Id = "plan", Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                ])
        );
    }

    /// <summary>
    /// <c>ShowActions</c> off turns the same component into a plain definition list with no button at all.
    /// </summary>
    private static ContainerComponent CreateReadOnlyGroup()
    {
        return DemoUI.CreateExample("Read-only, no separators",
            new KeyValueActionComponent()
                .SetShowActions(false)
                .SetShowRowSeparators(false)
                .SetBorderThickness(UIThickness.Uniform(0))
                .SetItems(
                [
                    new KeyValueActionItem
                    {
                        Id = "owner",
                        Key = new TextItem { Title = "Owner", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "Robin Hale" }
                    },
                    new KeyValueActionItem
                    {
                        Id = "created",
                        Key = new TextItem { Title = "Created", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "2026-04-02" }
                    },
                    new KeyValueActionItem
                    {
                        Id = "visibility",
                        Key = new TextItem { Title = "Visibility", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "internal" }
                    },
                ])
        );
    }
}
