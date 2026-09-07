using DemoApp.Controllers.Base;
using DemoApp.Controllers.Navigation.ButtonGroup;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;

namespace DemoApp.Views.Navigation.ButtonGroup;

/// <summary>
/// One strip of three views, and every property that can be bound to it.
/// </summary>
/// <remarks><c>SelectedKey</c> is two-way; the segments themselves are items, so their look is the template's and not a row here.</remarks>
internal sealed class ButtonGroupMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string SegmentGroup = nameof(ButtonGroupMainController.SegmentGroup);
    private const string BorderGroup = nameof(ButtonGroupMainController.BorderGroup);

    public static string ViewKey => "demo.navigation.button-group.main";

    protected override string ComponentRoute => "/navigation/button-group";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.navigation.button-group.header";
    protected override string HeaderDescription => "demo.navigation.button-group.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ButtonGroupComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSelectedKey($"{SegmentGroup}.{nameof(SegmentGroupContext.SelectedKey)}")
            .BindSize($"{SegmentGroup}.{nameof(SegmentGroupContext.Size)}")
            .BindSelectionStyle($"{SegmentGroup}.{nameof(SegmentGroupContext.SelectionStyle)}")
            .BindPadding($"{SegmentGroup}.{nameof(SegmentGroupContext.Padding)}")
            .BindBackground($"{SegmentGroup}.{nameof(SegmentGroupContext.Background)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetItems([
                new ButtonItem { Id = SegmentGroupContext.ListKey, Icon = DemoIcons.Outline(DemoIcons.List), Title = "List" },
                new ButtonItem { Id = SegmentGroupContext.BoardKey, Icon = DemoIcons.Outline(DemoIcons.LayoutDashboard), Title = "Board" },
                new ButtonItem { Id = SegmentGroupContext.TimelineKey, Icon = DemoIcons.Outline(DemoIcons.History), Title = "Timeline" }
            ])
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(SegmentGroup, "Group", nameof(ButtonGroupMainController.CycleSegmentOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(ButtonGroupMainController.CycleBorderOption))
        );
}
