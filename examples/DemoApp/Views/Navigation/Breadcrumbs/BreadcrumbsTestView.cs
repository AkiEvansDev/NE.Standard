using DemoApp.Controllers.Navigation.Breadcrumbs;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Navigation.Breadcrumbs;

internal sealed class BreadcrumbsTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.breadcrumbs.test";

    protected override string ComponentRoute => "/navigation/breadcrumbs";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.navigation.breadcrumbs.header";
    protected override string HeaderDescription => "demo.navigation.breadcrumbs.description";

    protected override void DrawContent(WrapPanelComponent container) => container.AddChild(CreateWalkGroup());

    /// <summary>
    /// The trail and a list of what is inside the current folder. Opening one appends a step; clicking a step
    /// drops everything past it. Both are commands carrying the item's own key.
    /// </summary>
    private static ContainerComponent CreateWalkGroup()
    {
        return DemoUI.CreateGroup(nameof(BreadcrumbsTestController.WalkGroup), "Walk a folder tree",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(8)
                .AddChild(new BreadcrumbsComponent()
                    .BindItems(nameof(BreadcrumbsTestGroupContext.Trail), UIBindingScope.Relative)
                    .OnItemClickWithItemKey(nameof(BreadcrumbsTestController.GoTo))
                )
                .AddChild(new TextComponent()
                    .SetTitle("Inside")
                    .SetTitleType(UITextAppearance.Caption)
                    .SetTitleColor(UIThemeColor.Muted)
                )
                .AddChild(new MenuComponent()
                    .BindItems(nameof(BreadcrumbsTestGroupContext.Children), UIBindingScope.Relative)
                    .OnItemClickWithItemKey(nameof(BreadcrumbsTestController.Open))
                    .SetEmptyTemplate(new TextComponent()
                        .SetDescription("Nothing deeper — click a step above to go back.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 260
        );
    }
}
