using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.KeyValueAction;

internal sealed class KeyValueActionExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.key-value-action.example";

    protected override string ComponentRoute => "/contents/key-value-action";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.contents.key-value-action.header";
    protected override string HeaderDescription => "demo.contents.key-value-action.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateDetailsGroup())
            .AddChild(CreateSettingsGroup())
            .AddChild(CreateReadOnlyGroup());
    }

    /// <summary>The ordinary case: key, value and a per-row action.</summary>
    private static ContainerComponent CreateDetailsGroup()
    {
        return DemoUI.CreateGroup(null, "Build details",
            content => content.AddChild(new KeyValueActionComponent()
                .SetPlacement(1, 1, 24, 1)
                .SetItems(
                [
                    Row("commit", "Commit", "a079856", LucideIcons.Copy),
                    Row("branch", "Branch", "master", LucideIcons.ExternalLink),
                    Row("duration", "Duration", "4 m 12 s", LucideIcons.History),
                    Row("artifact", "Artifact", "nova-481.zip", LucideIcons.Download),
                ])
            ),
            static _ => { },
            contentMinHeight: 210
        );
    }

    /// <summary>
    /// <c>StretchValue</c> off, so the value column shrinks to its content instead of pushing the action
    /// to the far edge — the difference is only visible against a row whose value is short.
    /// </summary>
    private static ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateGroup(null, "Compact values",
            content => content.AddChild(new KeyValueActionComponent()
                .SetStretchValue(false)
                .SetRowHoverable(true)
                .SetPlacement(1, 1, 24, 1)
                .SetItems(
                [
                    Row("region", "Region", "eu-west-1", LucideIcons.Edit),
                    Row("replicas", "Replicas", "3", LucideIcons.Edit),
                    Row("tier", "Tier", "standard", LucideIcons.Edit),
                ])
            ),
            static _ => { },
            contentMinHeight: 180
        );
    }

    /// <summary>
    /// <c>ShowActions</c> off turns the same component into a plain definition list — worth showing
    /// because it is the variant with no button at all, not merely a disabled one.
    /// </summary>
    private static ContainerComponent CreateReadOnlyGroup()
    {
        return DemoUI.CreateGroup(null, "Read-only, no separators",
            content => content.AddChild(new KeyValueActionComponent()
                .SetShowActions(false)
                .SetShowRowSeparators(false)
                .SetShowBorder(false)
                .SetPlacement(1, 1, 24, 1)
                .SetItems(
                [
                    Row("owner", "Owner", "platform-team"),
                    Row("created", "Created", "2026-04-02"),
                    Row("visibility", "Visibility", "internal"),
                ])
            ),
            static _ => { },
            contentMinHeight: 170
        );
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
            item.Action = new ButtonItem { Id = id, Icon = actionIcon, Type = UIButtonType.Ghost };

        return item;
    }
}
