using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Base;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Actions;

/// <summary>
/// One theme switcher, and every property that can be bound to it.
/// </summary>
/// <remarks>Pressing it switches the whole page, not the preview: the theme is the document's state.</remarks>
internal sealed class ThemeSwitcherMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SwitcherGroup = nameof(ThemeSwitcherMainController.SwitcherGroup);
    private const string BorderGroup = nameof(ThemeSwitcherMainController.BorderGroup);

    public static string ViewKey => "demo.actions.theme-switcher.main";

    protected override string ComponentRoute => "/actions/theme-switcher";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main];
    protected override string Header => "demo.actions.theme-switcher.header";
    protected override string HeaderDescription => "demo.actions.theme-switcher.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ThemeSwitcherComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindLightIcon($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.LightIcon)}")
            .BindDarkIcon($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.DarkIcon)}")
            .BindIconSize($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.IconSize)}")
            .BindType($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.Type)}")
            .BindSize($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.Size)}")
            .BindPadding($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.Padding)}")
            .BindTooltip($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.TooltipPlacement)}")
            .BindBackground($"{SwitcherGroup}.{nameof(ThemeSwitcherGroupContext.Background)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(SwitcherGroup, "Theme switcher", nameof(ThemeSwitcherMainController.CycleSwitcherGroupOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ThemeSwitcherMainController.CycleBorderGroupOption))
        );
}
