using System.Collections.Generic;
using DemoApp.Controllers.Navigation.TabsView;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Navigation.TabsView;

internal sealed class TabsViewBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.tabs-view.binding";

    protected override string ComponentRoute => "/navigation/tabs-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.navigation.tabs-view.header";
    protected override string HeaderDescription => "demo.navigation.tabs-view.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateTabsGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new TabsViewComponent()
            .SetItems(
            [
                new TabItem { Id = "one", Title = "One", Order = 1, Closable = false },
                new TabItem { Id = "two", Title = "Two", Order = 2, Closable = false }
            ])
            .SetPageTemplate(CreatePage()));

    /// <summary>
    /// Every fact about a tab driven from the server, so each has a visible counterpart to the client-side
    /// gesture: the key a click writes back, the order a drag writes back, and the flag behind the control a
    /// close uses.
    /// </summary>
    private static ContainerComponent CreateTabsGroup()
    {
        return DemoUI.CreateGroup(nameof(TabsViewBindingController.TabsViewGroup), "Collection, selection and order",
            content => content.AddChild(new TabsViewComponent()
                .BindItems(nameof(TabsViewBindingGroupContext.Tabs), UIBindingScope.Relative)
                .BindSelectedKey(nameof(TabsViewBindingGroupContext.SelectedKey), UIBindingScope.Relative)
                .OnItemClose(nameof(TabsViewBindingController.CloseTab))
                .SetPageTemplate(CreatePage())
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Select next"] = nameof(TabsViewBindingController.SelectNext),
                ["Add tab"] = nameof(TabsViewBindingController.AddTab),
                ["Move to end"] = nameof(TabsViewBindingController.MoveSelectedToEnd),
                ["Closable"] = nameof(TabsViewBindingController.ToggleClosable),
            }),
            contentMinHeight: 240
        );
    }

    private static ContainerComponent CreatePage()
        => new ContainerComponent()
            .AddChild(new TextComponent()
                .BindTitle(nameof(TabItem.Title), UIBindingScope.Relative)
                .SetTitleType(UITextAppearance.Subtitle)
                .SetPlacement(1, 1, 24, 1)
            );
}
