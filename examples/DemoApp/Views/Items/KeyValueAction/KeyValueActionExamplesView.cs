using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Styling;

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
        ));
    }

    /// <summary>The ordinary case: key, value and a per-row action.</summary>
    private static ContainerComponent CreateDetailsGroup()
        => CreateListGroup("Build details", list => list
            .SetItems(
            [
                Row("commit", "Commit", "a079856", DemoIcons.Outline(DemoIcons.Copy)),
                Row("branch", "Branch", "master", DemoIcons.Outline(DemoIcons.ExternalLink)),
                Row("duration", "Duration", "4 m 12 s", DemoIcons.Outline(DemoIcons.History)),
                Row("artifact", "Artifact", "payments-481.zip", DemoIcons.Outline(DemoIcons.Download)),
            ]));

    /// <summary>
    /// A description in either slot, which wraps under its title inside the column rather than widening the row.
    /// </summary>
    private static ContainerComponent CreateDescribedGroup()
        => CreateListGroup("Explained settings", list => list
            .SetRowHoverable(true)
            .SetItems(
            [
                Described("retention", "Retention", "Deleted after this long", "30 days", "Counted from the last write"),
                Described("replicas", "Replicas", "Copies kept in the region", "3", "One per availability zone"),
                Described("tier", "Tier", "What the quota is drawn from", "Standard", "Burst up to 2×"),
            ]));

    /// <summary>
    /// A badge in either slot; the key's is <c>Inline</c>, since <c>Trailing</c> would send it to the value's doorstep.
    /// </summary>
    private static ContainerComponent CreateBadgedGroup()
        => CreateListGroup("Flagged rows", list => list
            .SetSurface(UISurfaceStyle.Raised)
            .SetItems(
            [
                Badged("endpoint", "Endpoint", null, "api.example.com", "live", UIBadgeType.Success),
                Badged("beta", "Search index", "beta", "rebuilding", "42 %", UIBadgeType.Warning),
                Badged("legacy", "Legacy export", "deprecated", "off", null, UIBadgeType.Danger),
            ]));

    /// <summary>
    /// <c>StretchValue</c> off, so the value column shrinks to its content instead of pushing the action out.
    /// </summary>
    private static ContainerComponent CreateCompactGroup()
        => CreateListGroup("Compact values", list => list
            .SetStretchValue(false)
            .SetRowHoverable(true)
            .SetItems(
            [
                Row("region", "Region", "eu-west-1", DemoIcons.Outline(DemoIcons.Edit)),
                Row("replicas", "Replicas", "3", DemoIcons.Outline(DemoIcons.Edit)),
                Row("tier", "Tier", "standard", DemoIcons.Outline(DemoIcons.Edit)),
            ]));

    /// <summary>
    /// <c>ShowActions</c> off turns the same component into a plain definition list with no button at all.
    /// </summary>
    private static ContainerComponent CreateReadOnlyGroup()
        => CreateListGroup("Read-only, no separators", list => list
            .SetShowActions(false)
            .SetShowRowSeparators(false)
            .SetBorderThickness(UIThickness.Uniform(0))
            .SetItems(
            [
                Row("owner", "Owner", "platform-team"),
                Row("created", "Created", "2026-04-02"),
                Row("visibility", "Visibility", "internal"),
            ]));

    /// <summary>
    /// The list where it usually lives: a card's body, so the card draws the edge and the rows run to its sides.
    /// </summary>
    private static ContainerComponent CreateCardGroup()
    {
        return DemoUI.CreateGroup(null, "In a card",
            content => content.AddChild(new CardComponent()
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.Cloud)
                    .SetTitle("payments-api")
                    .SetDescription("What the deploy console reads off the service")
                )
                .SetContent(new KeyValueActionComponent()
                    .SetShowActions(false)
                    .SetBorderThickness(UIThickness.Uniform(0))
                    .SetItems(
                    [
                        Row("region", "Region", "eu-west-1"),
                        Row("replicas", "Replicas", "12"),
                        Row("image", "Image", "payments-api:2.4.1"),
                    ])
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "No edge of its own inside a card, and no action column: a summary is read, not operated."
        );
    }

    private static ContainerComponent CreateListGroup(string title, Action<KeyValueActionComponent> configure)
    {
        KeyValueActionComponent list = new KeyValueActionComponent().SetPlacement(1, 1, 24, 1);

        configure(list);

        return DemoUI.CreateGroup(null, title, content => content.AddChild(list));
    }

    private static KeyValueActionItem Row(string id, string key, string value, string? actionIcon = null)
    {
        KeyValueActionItem item = new()
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = value }
        };

        if (actionIcon is not null)
            item.Action = new ButtonItem { Id = id, Icon = actionIcon, Type = UIButtonType.Ghost, Size = UIButtonSize.Small };

        return item;
    }

    private static KeyValueActionItem Described(string id, string key, string keyDescription, string value, string valueDescription)
        => new()
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted, Description = keyDescription },
            Value = new TextItem { Title = value, Description = valueDescription },
            Action = new ButtonItem { Id = id, Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
        };

    private static KeyValueActionItem Badged(string id, string key, string? keyBadge, string value, string? valueBadge, UIBadgeType style)
        => new()
        {
            Id = id,
            Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted, BadgeText = keyBadge, BadgeStyle = UIBadgeType.Surface, BadgePlacement = UITextBadgePlacement.Inline },
            Value = new TextItem { Title = value, BadgeText = valueBadge, BadgeStyle = style },
            Action = new ButtonItem { Id = id, Icon = DemoIcons.Outline(DemoIcons.Settings), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
        };
}
