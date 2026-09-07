using DemoApp.Controllers.Base;
using DemoApp.Controllers.Navigation.Breadcrumbs;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;

namespace DemoApp.Views.Navigation.Breadcrumbs;

/// <summary>
/// One trail, and every property that can be bound to it.
/// </summary>
/// <remarks>Most rows move a step rather than the trail; the mark is not bindable, so the preview is drawn with each.</remarks>
internal sealed class BreadcrumbsMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string TrailGroup = nameof(BreadcrumbsMainController.TrailGroup);

    public static string ViewKey => "demo.navigation.breadcrumbs.main";

    protected override string ComponentRoute => "/navigation/breadcrumbs";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.navigation.breadcrumbs.header";
    protected override string HeaderDescription => "demo.navigation.breadcrumbs.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(260,
            ("The default mark", frame => frame.AddChild(Bind(new BreadcrumbsComponent()))),
            ("Separator = \"/\"", frame => frame.AddChild(Bind(new BreadcrumbsComponent().SetSeparator("/"))))
        );

    private static BreadcrumbsComponent Bind(BreadcrumbsComponent trail)
        => trail
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSpacing($"{TrailGroup}.{nameof(BreadcrumbsGroupContext.Spacing)}")
            .BindItems($"{TrailGroup}.{nameof(BreadcrumbsGroupContext.Steps)}")
            .SetPlacement(1, 1, 24, 1);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(TrailGroup, "Trail", nameof(BreadcrumbsMainController.CycleTrailGroupOption))
        );
}
