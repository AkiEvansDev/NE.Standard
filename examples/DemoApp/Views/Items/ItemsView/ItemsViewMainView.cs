using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Binding;

namespace DemoApp.Views.Items.ItemsView;

/// <summary>
/// One list drawn by the built-in text template, and every property that can be bound to the host around it.
/// </summary>
/// <remarks>The list is capped at a height it does not fill, so <c>VerticalScroll</c> has something to do.</remarks>
internal sealed class ItemsViewMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ItemsGroup = nameof(ItemsViewMainController.ItemsGroup);

    public static string ViewKey => "demo.items.items-view.main";

    protected override string ComponentRoute => "/items/items-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.items.items-view.header";
    protected override string HeaderDescription => "demo.items.items-view.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ItemsViewComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindItems($"{ItemsGroup}.{nameof(ItemsViewGroupContext.Items)}")
            .BindLayoutType($"{ItemsGroup}.{nameof(ItemsViewGroupContext.LayoutType)}")
            .BindOrientation($"{ItemsGroup}.{nameof(ItemsViewGroupContext.Orientation)}")
            .BindSpacing($"{ItemsGroup}.{nameof(ItemsViewGroupContext.Spacing)}")
            .BindHorizontalScroll($"{ItemsGroup}.{nameof(ItemsViewGroupContext.HorizontalScroll)}")
            .BindVerticalScroll($"{ItemsGroup}.{nameof(ItemsViewGroupContext.VerticalScroll)}")
            .BindScrollSnap($"{ItemsGroup}.{nameof(ItemsViewGroupContext.ScrollSnap)}")
            .BindScrollAnchor($"{ItemsGroup}.{nameof(ItemsViewGroupContext.ScrollAnchor)}")
            .BindSelectionMode($"{ItemsGroup}.{nameof(ItemsViewGroupContext.SelectionMode)}")
            .BindSelectedKey($"{ItemsGroup}.{nameof(ItemsViewGroupContext.SelectedKey)}")
            .BindSelectedKeys($"{ItemsGroup}.{nameof(ItemsViewGroupContext.SelectedKeys)}")
            .BindSelectionStyle($"{ItemsGroup}.{nameof(ItemsViewGroupContext.SelectionStyle)}")
            // One line per row: the properties are the exhibit here, the richer rows are on Examples.
            .SetTemplate(new TextComponent().SetTitleType(UITextAppearance.Body).BindTitle(nameof(TextItem.Title), UIBindingScope.Relative))
            .SetMaxHeight(UILayoutLength.Absolute(240))
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 320);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ItemsGroup, "Items", nameof(ItemsViewMainController.CycleItemsGroupOption))
        );
}
