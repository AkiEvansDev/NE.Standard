using DemoApp.Controllers.Base;
using DemoApp.Controllers.Layouts.Flyout;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Layouts.Flyout;

/// <summary>
/// One hanging panel, and every property that can be bound to it.
/// </summary>
/// <remarks><c>IsOpen</c> is two-way; the preview reserves a tall box, or the runtime flips a panel placed above its anchor.</remarks>
internal sealed class FlyoutMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string FlyoutGroup = nameof(FlyoutMainController.FlyoutGroup);

    public static string ViewKey => "demo.layouts.flyout.main";

    protected override string ComponentRoute => "/layouts/flyout";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.layouts.flyout.header";
    protected override string HeaderDescription => "demo.layouts.flyout.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new FlyoutComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindIsOpen($"{FlyoutGroup}.{nameof(FlyoutGroupContext.IsOpen)}")
            .BindFlyoutPlacement($"{FlyoutGroup}.{nameof(FlyoutGroupContext.FlyoutPlacement)}")
            .BindCloseOnBackdrop($"{FlyoutGroup}.{nameof(FlyoutGroupContext.CloseOnBackdrop)}")
            .BindCloseOnEscape($"{FlyoutGroup}.{nameof(FlyoutGroupContext.CloseOnEscape)}")
            .SetAnchor(new ButtonComponent()
                .SetType(UIButtonType.Outline)
                .SetIcon(DemoIcons.Outline(DemoIcons.Sliders))
                .SetTitle("Filters")
            )
            // A width and nothing else: the panel already is a surface.
            .SetContent(new ContainerComponent()
                .SetWidth(UILayoutLength.Absolute(220))
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(8)
                    .AddChild(new TextComponent()
                        .SetTitle("Narrow the list")
                        .SetTitleType(UITextAppearance.Overline)
                        .SetTitleColor(UIThemeColor.Muted)
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("All environments")
                        .SetTitleType(UITextAppearance.Body)
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Last seven days")
                        .SetTitleType(UITextAppearance.Body)
                    )
                    .AddChild(new TextComponent()
                        .SetTitle("Successful only")
                        .SetTitleType(UITextAppearance.Body)
                    )
                )
            )
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 360);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(FlyoutGroup, "Flyout", nameof(FlyoutMainController.CycleFlyoutGroupOption))
        );
}
