using DemoApp.Views.Base;

namespace DemoApp.Views.Indicators.Progress;

/// <summary>
/// Where a reading is put, and the question it always answers: how far, out of what.
/// </summary>
/// <remarks>A reading is never alone, and the choice between the two variants is about the room the layout has.</remarks>
internal sealed class ProgressExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.indicators.progress.examples";

    protected override string ComponentRoute => "/indicators/progress";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.indicators.progress.header";
    protected override string HeaderDescription => "demo.indicators.progress.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateQuotaGroup(), CreateKnownGroup()], [CreateScaleGroup(), CreateTileGroup()]));

    /// <summary>
    /// What most readings are: a line of prose with a bar under it.
    /// </summary>
    private static ContainerComponent CreateQuotaGroup()
    {
        return DemoUI.CreateExample("Under the thing it measures",
            new SurfaceComponent()
                .SetContent(UILayout.Stack(16)
                    .SetWidth(UILayoutLength.Absolute(360))
                    .AddChild(UILayout.Stack(6)
                        .AddChild(new TextComponent()
                            .SetTitle("Bandwidth")
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription("1 240 GB of 2 000 GB this month")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                        .AddChild(new ProgressComponent()
                            .SetValue(62)
                            .SetHorizontalAlignment(UIAlignment.Stretch)
                        )
                    )
                    .AddChild(UILayout.Stack(6)
                        .AddChild(new TextComponent()
                            .SetTitle("Snapshots")
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription("47 GB of 50 GB")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                        .AddChild(new ProgressComponent()
                            .SetValue(94)
                            .SetColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                            .SetHorizontalAlignment(UIAlignment.Stretch)
                        )
                    )
                    .AddChild(UILayout.Stack(6)
                        .AddChild(new TextComponent()
                            .SetTitle("Servers in use")
                            .SetTitleType(UITextAppearance.Body)
                            .SetDescription("8 of 25")
                            .SetDescriptionType(UITextAppearance.Caption)
                            .SetDescriptionColor(UIThemeColor.Muted)
                        )
                        .AddChild(new ProgressComponent()
                            .SetValue(32)
                            .SetColor(UIThemeColor.FromStyle(UIColorStyle.Success))
                            .SetHorizontalAlignment(UIAlignment.Stretch)
                        )
                    )
                )
        );
    }

    /// <summary>
    /// A value says how far along; no value says only that something is running.
    /// </summary>
    private static ContainerComponent CreateKnownGroup()
    {
        return DemoUI.CreateExample("How far, and whether that is known",
            UILayout.Stack(16)
                .SetWidth(UILayoutLength.Absolute(360))
                .AddChild(UIText.Label("Known — the value is a number"))
                .AddChild(new ProgressComponent()
                    .SetValue(62)
                    .SetShowValue(true)
                    .SetHorizontalAlignment(UIAlignment.Stretch)
                )
                .AddChild(UIText.Label("Not known — the value is unset"))
                // No SetValue: null is indeterminate, where zero would be a bar that is simply empty.
                .AddChild(new ProgressComponent()
                    .SetHorizontalAlignment(UIAlignment.Stretch)
                )
        );
    }

    /// <summary>
    /// The same number against three windows, which is the one thing the value alone never says.
    /// </summary>
    private static ContainerComponent CreateScaleGroup()
    {
        return DemoUI.CreateExample("The same value, three windows",
            UILayout.Stack(16)
                .SetWidth(UILayoutLength.Absolute(360))
                .AddChild(UILayout.Stack(6)
                    .AddChild(UIText.Label("0 to 100"))
                    .AddChild(new ProgressComponent()
                        .SetRange(0, 100)
                        .SetValue(62)
                        .SetShowValue(true)
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                    )
                )
                .AddChild(UILayout.Stack(6)
                    .AddChild(UIText.Label("0 to 200"))
                    .AddChild(new ProgressComponent()
                        .SetRange(0, 200)
                        .SetValue(62)
                        .SetShowValue(true)
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                    )
                )
                .AddChild(UILayout.Stack(6)
                    .AddChild(UIText.Label("50 to 100"))
                    .AddChild(new ProgressComponent()
                        .SetRange(50, 100)
                        .SetValue(62)
                        .SetShowValue(true)
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                    )
                )
        );
    }

    /// <summary>
    /// The circular variant where there is no room for a full-width bar and the number is the content.
    /// </summary>
    private static ContainerComponent CreateTileGroup()
    {
        return DemoUI.CreateExample("A ring, where a bar has no room",
            UILayout.Row(12)
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(150))
                    .SetContent(UILayout.Stack(10)
                        .SetHorizontalAlignment(UIAlignment.Center)
                        .AddChild(new ProgressComponent()
                            .SetVariant(UIProgressVariant.Circular)
                            .SetValue(87)
                            .SetShowValue(true)
                            .SetColor(UIThemeColor.FromStyle(UIColorStyle.Success))
                        )
                        .AddChild(new TextComponent()
                            .SetTitle("Health checks")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                            .SetTextAlignment(UITextAlignment.Center)
                        )
                    )
                )
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(150))
                    .SetContent(UILayout.Stack(10)
                        .SetHorizontalAlignment(UIAlignment.Center)
                        .AddChild(new ProgressComponent()
                            .SetVariant(UIProgressVariant.Circular)
                            .SetValue(41)
                            .SetShowValue(true)
                            .SetColor(UIThemeColor.FromStyle(UIColorStyle.Warning))
                        )
                        .AddChild(new TextComponent()
                            .SetTitle("Error budget")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                            .SetTextAlignment(UITextAlignment.Center)
                        )
                    )
                )
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Raised)
                    .SetWidth(UILayoutLength.Absolute(150))
                    .SetContent(UILayout.Stack(10)
                        .SetHorizontalAlignment(UIAlignment.Center)
                        .AddChild(new ProgressComponent()
                            .SetVariant(UIProgressVariant.Circular)
                            .SetValue(96)
                            .SetShowValue(true)
                            .SetColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        )
                        .AddChild(new TextComponent()
                            .SetTitle("Disk")
                            .SetTitleType(UITextAppearance.Caption)
                            .SetTitleColor(UIThemeColor.Muted)
                            .SetTextAlignment(UITextAlignment.Center)
                        )
                    )
                )
        );
    }
}
