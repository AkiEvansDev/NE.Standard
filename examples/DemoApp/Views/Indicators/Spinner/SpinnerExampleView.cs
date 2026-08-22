using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Indicators.Spinner;

internal sealed class SpinnerExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.indicators.spinner.example";

    protected override string ComponentRoute => "/indicators/spinner";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.indicators.spinner.header";
    protected override string HeaderDescription => "demo.indicators.spinner.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateLoadingStatesGroup())
            .AddChild(CreateSizeReferenceGroup());
    }

    private static ContainerComponent CreateLoadingStatesGroup()
    {
        return DemoUI.CreateGroup(null, "Loading states",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(16)
                .SetWrap(true)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(CreateLoadingCard(new SpinnerComponent()
                    .SetLabel("Loading dashboard...")
                    .SetHorizontalAlignment(UIAlignment.Center)
                    .SetVerticalAlignment(UIAlignment.Center)
                ))
                .AddChild(CreateLoadingCard(new SpinnerComponent()
                    .SetSize(UIIconSize.Small)
                    .SetLabel("Syncing 3 of 12 files")
                    .SetColor(UIThemeColor.Primary)
                    .SetHorizontalAlignment(UIAlignment.Center)
                    .SetVerticalAlignment(UIAlignment.Center)
                ))
            ),
            static _ => { },
            contentMinHeight: 160
        );
    }

    private static ContainerComponent CreateLoadingCard(SpinnerComponent spinner)
        => new ContainerComponent()
            .SetBackground(UIThemeColor.Surface)
            .SetBorderColor(UIThemeColor.Border)
            .SetBorderThickness(UIThickness.Uniform(1))
            .SetBorderRadius(UICornerRadius.Uniform(8))
            .SetWidth(UILayoutLength.Absolute(220))
            .SetHeight(UILayoutLength.Absolute(120))
            .AddRow(UIGridUnit.Star())
            .AddChild(spinner.SetPlacement(1, 1, 24, 1));

    private static ContainerComponent CreateSizeReferenceGroup()
    {
        return DemoUI.CreateGroup(null, "Size & color reference",
            content =>
            {
                StackPanelComponent sizes = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(24)
                    .SetVerticalAlignment(UIAlignment.Center);

                foreach (UIIconSize size in Enum.GetValues<UIIconSize>())
                    _ = sizes.AddChild(new SpinnerComponent().SetSize(size));

                StackPanelComponent colors = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(24)
                    .SetVerticalAlignment(UIAlignment.Center)
                    .SetWrap(true);

                foreach (UIColorStyle style in new[] { UIColorStyle.Default, UIColorStyle.Primary, UIColorStyle.Accent, UIColorStyle.Info, UIColorStyle.Warning, UIColorStyle.Success, UIColorStyle.Danger })
                    _ = colors.AddChild(new SpinnerComponent().SetSize(UIIconSize.Large).SetColor(UIThemeColor.FromStyle(style)));

                _ = content
                    .AddRow(UIGridUnit.Star())
                    .AddChild(sizes.SetPlacement(1, 1, 24, 1))
                    .AddChild(colors.SetPlacement(1, 2, 24, 1));
            },
            static _ => { },
            contentMinHeight: 140
        );
    }
}
