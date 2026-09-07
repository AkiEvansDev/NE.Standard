using DemoApp.Controllers.Base;
using DemoApp.Controllers.Navigation.Tabs;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;

namespace DemoApp.Views.Navigation.Tabs;

/// <summary>
/// One strip over three fixed pages, and every property that can be bound to it.
/// </summary>
/// <remarks><c>SelectedKey</c> is two-way; <c>SelectionStyle</c> is the strip's other row, and everything past those two belongs to a caption.</remarks>
internal sealed class TabsMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string TabsGroup = nameof(TabsMainController.TabsGroup);

    public static string ViewKey => "demo.navigation.tabs.main";

    protected override string ComponentRoute => "/navigation/tabs";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.navigation.tabs.header";
    protected override string HeaderDescription => "demo.navigation.tabs.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TabsComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSelectedKey($"{TabsGroup}.{nameof(TabsGroupContext.SelectedKey)}")
            .BindSelectionStyle($"{TabsGroup}.{nameof(TabsGroupContext.SelectionStyle)}")
            .BindShowOverflow($"{TabsGroup}.{nameof(TabsGroupContext.ShowOverflow)}")
            .AddTab(TabsGroupContext.OverviewKey,
                new TabHeaderComponent()
                    .SetTitle("Overview")
                    .BindIcon($"{TabsGroup}.{nameof(TabsGroupContext.OverviewIcon)}"),
                CreateOverviewPage()
            )
            .AddTab(TabsGroupContext.ActivityKey,
                new TabHeaderComponent()
                    .SetTitle("Activity")
                    .BindBadgeText($"{TabsGroup}.{nameof(TabsGroupContext.ActivityBadge)}"),
                CreateActivityPage()
            )
            .AddTab(TabsGroupContext.SettingsKey,
                new TabHeaderComponent()
                    .SetTitle("Settings")
                    .BindVisibility($"{TabsGroup}.{nameof(TabsGroupContext.SettingsVisible)}"),
                CreateSettingsPage()
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    /// <summary>The facts of a deploy: what went out, where, and when.</summary>
    private static StackPanelComponent CreateOverviewPage()
        => TabsDemo.CreatePage()
            .AddChild(CreateReading("Environment", "production · eu-west-1"))
            .AddChild(CreateReading("Version", "2.14.0 (build 481)"))
            .AddChild(CreateReading("Started", "Today at 12:04 by Robin Hale"))
            .AddChild(CreateReading("State", "Healthy — 12 of 12 replicas ready"));

    private static TextComponent CreateReading(string name, string value)
        => new TextComponent()
            .SetTitle(value)
            .SetDescription(name)
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted);

    /// <summary>What happened, newest first; the page the badge counts for.</summary>
    private static StackPanelComponent CreateActivityPage()
        => TabsDemo.CreatePage()
            .AddChild(CreateEvent("12:31", "Replica 7 restarted after a failed readiness probe."))
            .AddChild(CreateEvent("12:19", "Traffic shifted to 100 %."))
            .AddChild(CreateEvent("12:04", "Rollout started from build #481."));

    private static TextComponent CreateEvent(string time, string text)
        => new TextComponent()
            .SetIcon(DemoIcons.Outline(DemoIcons.Clock))
            .SetTitle(text)
            .SetDescription(time)
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted);

    /// <summary>The knobs a deploy has: inputs, so the page holds state of its own across a switch.</summary>
    private static StackPanelComponent CreateSettingsPage()
        => TabsDemo.CreatePage()
            .AddChild(new SwitchComponent().SetTitle("Roll back on a failed probe").SetValue(true))
            .AddChild(new SwitchComponent().SetTitle("Notify #releases"))
            .AddChild(new TextInputComponent().SetTitle("Probe path").SetValue("/healthz"));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(TabsGroup, "Tabs", nameof(TabsMainController.CycleTabsGroupOption))
        );
}
