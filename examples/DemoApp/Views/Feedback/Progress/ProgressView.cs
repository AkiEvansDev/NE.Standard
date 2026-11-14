using DemoApp.Controllers.Base;
using DemoApp.Controllers.Feedback.Progress;
using DemoApp.Views.Base;

namespace DemoApp.Views.Feedback.Progress;

/// <summary>
/// One reading and every property that can be bound to it; then where a reading is put, and the question it always answers:
/// how far, out of what.
/// </summary>
/// <remarks>An unset <c>Value</c> is indeterminate rather than empty; <c>Min</c> and <c>Max</c> are the window it is read against. A reading is never alone, and the choice between the two variants is about the room the layout has.</remarks>
internal sealed class ProgressView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ProgressGroup = nameof(ProgressController.ProgressGroup);

    public static string ViewKey => "demo.feedback.progress";

    protected override string ComponentRoute => "/feedback/progress";
    protected override string Header => "demo.feedback.progress.header";
    protected override string HeaderDescription => "demo.feedback.progress.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new ProgressComponent()
            .BindStandard()
            .BindTitle<ProgressController>(static x => x.ProgressGroup.Title)
            .BindValue<ProgressController>(static x => x.ProgressGroup.Value)
            .BindMin<ProgressController>(static x => x.ProgressGroup.Min)
            .BindMax<ProgressController>(static x => x.ProgressGroup.Max)
            .BindVariant<ProgressController>(static x => x.ProgressGroup.Variant)
            .BindColor<ProgressController>(static x => x.ProgressGroup.Color)
            .BindShowValue<ProgressController>(static x => x.ProgressGroup.ShowValue)
            .BindValueUnit<ProgressController>(static x => x.ProgressGroup.ValueUnit)
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(ProgressGroup, "Progress")
        );

    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateQuotaGroup(), CreateKnownGroup()], [CreateScaleGroup(), CreateTileGroup()]);

    /// <summary>
    /// What most readings are: a line of prose with a bar under it.
    /// </summary>
    private static ContainerComponent CreateQuotaGroup()
    {
        return DemoUI.CreateExample("Labeled quota bars",
            new SurfaceComponent()
                .SetContent(UILayout.Stack(16)
                    .SetWidth(UILayoutLength.Absolute(360))
                .SetMaxWidth(UILayoutLength.Fill())
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
    /// The same number against three windows, which is the one thing the value alone never says.
    /// </summary>
    private static ContainerComponent CreateScaleGroup()
    {
        return DemoUI.CreateExample("Custom Min & Max ranges",
            UILayout.Stack(16)
                .SetWidth(UILayoutLength.Absolute(360))
                .SetMaxWidth(UILayoutLength.Fill())
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
    /// A value says how far along; no value says only that something is running.
    /// </summary>
    private static ContainerComponent CreateKnownGroup()
    {
        return DemoUI.CreateExample("Determinate vs indeterminate (null Value)",
            UILayout.Stack(16)
                .SetWidth(UILayoutLength.Absolute(360))
                .SetMaxWidth(UILayoutLength.Fill())
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
                ),
            note: "An unset bar is still a shape that promises a number. Work that will never know its total is a spinner's: it says only that something is running, and implies no total."
        );
    }

    /// <summary>
    /// The circular variant where there is no room for a full-width bar and the number is the content.
    /// </summary>
    private static ContainerComponent CreateTileGroup()
    {
        return DemoUI.CreateExample("Circular variant (UIProgressVariant.Circular)",
            UILayout.Row(12)
                .AddChild(new SurfaceComponent()
                    .SetSurface(UISurfaceStyle.Surface)
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
                    .SetSurface(UISurfaceStyle.Surface)
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
                    .SetSurface(UISurfaceStyle.Surface)
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
