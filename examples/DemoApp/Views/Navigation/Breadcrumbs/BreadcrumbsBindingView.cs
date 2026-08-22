using System.Collections.Generic;
using DemoApp.Controllers.Navigation.Breadcrumbs;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Navigation.Breadcrumbs;

internal sealed class BreadcrumbsBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.breadcrumbs.binding";

    protected override string ComponentRoute => "/navigation/breadcrumbs";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.navigation.breadcrumbs.header";
    protected override string HeaderDescription => "demo.navigation.breadcrumbs.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateTrailGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new BreadcrumbsComponent()
            .SetItems(
            [
                new BreadcrumbItem { Id = "one", Title = "One" },
                new BreadcrumbItem { Id = "two", Title = "Two" }
            ]));

    /// <summary>
    /// The trail as data: the collection decides how many steps there are, and which one is current follows
    /// from that — no property says it, so nothing can disagree with the order.
    /// </summary>
    private static ContainerComponent CreateTrailGroup()
    {
        return DemoUI.CreateGroup(nameof(BreadcrumbsBindingController.BreadcrumbsGroup), "Collection and steps",
            content => content.AddChild(new BreadcrumbsComponent()
                .BindItems(nameof(BreadcrumbsBindingGroupContext.Trail), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Deeper"] = nameof(BreadcrumbsBindingController.GoDeeper),
                ["Up"] = nameof(BreadcrumbsBindingController.GoUp),
                ["Rename current"] = nameof(BreadcrumbsBindingController.RenameCurrent),
                ["Hide middle"] = nameof(BreadcrumbsBindingController.ToggleMiddle),
            }),
            contentMinHeight: 140
        );
    }
}
