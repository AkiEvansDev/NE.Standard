using DemoApp.Controllers.Base;
using DemoApp.Controllers.Navigation.TabsView;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;

namespace DemoApp.Views.Navigation.TabsView;

/// <summary>
/// One strip over a collection of documents, and every property that can be bound to it.
/// </summary>
/// <remarks>Two sections: the strip's own properties, and one document's, which the second section acts on alone.</remarks>
internal sealed class TabsViewMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string TabsViewGroup = nameof(TabsViewMainController.TabsViewGroup);
    private const string FirstTabGroup = nameof(TabsViewMainController.FirstTabGroup);

    public static string ViewKey => "demo.navigation.tabs-view.main";

    protected override string ComponentRoute => "/navigation/tabs-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.navigation.tabs-view.header";
    protected override string HeaderDescription => "demo.navigation.tabs-view.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new TabsViewComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSelectedKey($"{TabsViewGroup}.{nameof(TabsViewGroupContext.SelectedKey)}")
            .BindRenamable($"{TabsViewGroup}.{nameof(TabsViewGroupContext.Renamable)}")
            .BindDraggable($"{TabsViewGroup}.{nameof(TabsViewGroupContext.Draggable)}")
            .BindRemovable($"{TabsViewGroup}.{nameof(TabsViewGroupContext.Removable)}")
            .BindShowOverflow($"{TabsViewGroup}.{nameof(TabsViewGroupContext.ShowOverflow)}")
            .BindItems(nameof(TabsViewMainController.Documents))
            // The page is a template over the item, bound to whichever document the tab stands for.
            .SetPageTemplate(new ParagraphComponent()
                .BindDescription(nameof(DemoDocumentItem.Body), UIBindingScope.Relative)
                .SetDescriptionType(UITextAppearance.Body)
                .SetMargin(UIThickness.All(0, 4, 0, 0))
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 300);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(TabsViewGroup, "Tabs view", nameof(TabsViewMainController.CycleTabsViewGroupOption)),
            DemoUI.CreateOptionSection(FirstTabGroup, "First tab", nameof(TabsViewMainController.CycleFirstTabGroupOption))
        );
}
