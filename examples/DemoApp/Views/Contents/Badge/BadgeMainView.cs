using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Badge;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Contents.Badge;

/// <summary>
/// One badge, and every property that can be bound to it.
/// </summary>
internal sealed class BadgeMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string BadgeGroup = nameof(BadgeMainController.BadgeGroup);

    public static string ViewKey => "demo.contents.badge.main";

    protected override string ComponentRoute => "/contents/badge";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.badge.header";
    protected override string HeaderDescription => "demo.contents.badge.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new BadgeComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindStyle($"{BadgeGroup}.{nameof(BadgeGroupContext.Style)}")
            .BindColor($"{BadgeGroup}.{nameof(BadgeGroupContext.Color)}")
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
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(BadgeMainController.CycleBadgeOption))
        );
}
