using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.KeyValueAction;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Contents.KeyValueAction;

/// <summary>
/// One list, and every property that can be bound to it; the rows come from a bound collection.
/// </summary>
internal sealed class KeyValueActionMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ListGroup = nameof(KeyValueActionMainController.ListGroup);
    private const string ItemsGroup = nameof(KeyValueActionMainController.ItemsGroup);
    private const string BorderGroup = nameof(KeyValueActionMainController.BorderGroup);

    public static string ViewKey => "demo.contents.key-value-action.main";

    protected override string ComponentRoute => "/contents/key-value-action";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.contents.key-value-action.header";
    protected override string HeaderDescription => "demo.contents.key-value-action.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new KeyValueActionComponent()
            .BindItems($"{ItemsGroup}.{nameof(KeyValueActionRowsGroupContext.Items)}")
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSurface($"{ListGroup}.{nameof(KeyValueActionListGroupContext.Surface)}")
            .BindShowRowSeparators($"{ListGroup}.{nameof(KeyValueActionListGroupContext.ShowRowSeparators)}")
            .BindStretchValue($"{ListGroup}.{nameof(KeyValueActionListGroupContext.StretchValue)}")
            .BindShowActions($"{ListGroup}.{nameof(KeyValueActionListGroupContext.ShowActions)}")
            .BindRowHoverable($"{ListGroup}.{nameof(KeyValueActionListGroupContext.RowHoverable)}")
            .BindOverflow($"{ListGroup}.{nameof(KeyValueActionListGroupContext.Overflow)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 260);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ListGroup, "List", nameof(KeyValueActionMainController.CycleListOption)),
            DemoUI.CreateOptionSection(ItemsGroup, "Rows", nameof(KeyValueActionMainController.CycleItemsOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(KeyValueActionMainController.CycleBorderOption))
        );
}
