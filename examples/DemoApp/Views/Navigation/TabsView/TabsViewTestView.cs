using System.Collections.Generic;
using DemoApp.Controllers.Navigation.TabsView;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Navigation.TabsView;

internal sealed class TabsViewTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.tabs-view.test";

    protected override string ComponentRoute => "/navigation/tabs-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.navigation.tabs-view.header";
    protected override string HeaderDescription => "demo.navigation.tabs-view.description";

    protected override void DrawContent(WrapPanelComponent container)
        => container.AddChild(CreateDocumentsGroup());

    /// <summary>
    /// One collection, one template: every open document is a caption in the strip and a page under it, and
    /// opening, closing or renaming one is a change to the collection rather than to the view.
    /// </summary>
    private static ContainerComponent CreateDocumentsGroup()
    {
        return DemoUI.CreateGroup(nameof(TabsViewTestController.TabsViewGroup), "Open documents",
            content => content.AddChild(new TabsViewComponent()
                .BindItems(nameof(TabsViewGroupContext.Documents), UIBindingScope.Relative)
                .BindSelectedKey(nameof(TabsViewGroupContext.SelectedKey), UIBindingScope.Relative)
                .SetRenamable(true)
                .SetReorderable(true)
                .OnItemClose(nameof(TabsViewTestController.CloseTab))
                // The new text is already on the item by the time the command runs — the value the caption
                // wrote back settles first, and this reads it from there rather than from the event.
                .OnItemRename(nameof(TabsViewTestController.RenameTab), UIAction.ArgCurrentItemKey("id"), UIAction.ArgRelative("title", nameof(DemoDocumentTab.Title)))
                .SetPageTemplate(CreatePageTemplate())
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Open document"] = nameof(TabsViewTestController.AddTab),
            }),
            contentMinHeight: 260
        );
    }

    private static ContainerComponent CreatePageTemplate()
        => new ContainerComponent()
            .AddChild(new TextComponent()
                .BindTitle(nameof(DemoDocumentTab.Title), UIBindingScope.Relative)
                .SetTitleType(UITextAppearance.Subtitle)
                .BindDescription(nameof(DemoDocumentTab.Body), UIBindingScope.Relative)
                .SetDescriptionType(UITextAppearance.Body)
                .SetDescriptionColor(UIThemeColor.Muted)
                .SetPlacement(1, 1, 24, 1)
            );
}
