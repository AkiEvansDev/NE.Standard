using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Indicators;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

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
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateQuotaGroup(), CreateKnownGroup()],
            [CreateScaleGroup(), CreateTileGroup()]
        ));
    }

    /// <summary>
    /// What most readings are: a line of prose with a bar under it.
    /// </summary>
    private static ContainerComponent CreateQuotaGroup()
    {
        return DemoUI.CreateGroup(null, "Under the thing it measures",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(16)
                    .SetWidth(UILayoutLength.Absolute(360))
                    .AddChild(CreateQuota("Build minutes", "1 240 of 2 000 this month", 62, null))
                    .AddChild(CreateQuota("Artifact storage", "47 GB of 50 GB", 94, UIColorStyle.Danger))
                    .AddChild(CreateQuota("Seats in use", "8 of 25", 32, UIColorStyle.Success))
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static StackPanelComponent CreateQuota(string title, string reading, decimal value, UIColorStyle? style)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(6)
            .AddChild(new TextComponent()
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Body)
                .SetDescription(reading)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.Muted)
            )
            .AddChild(new ProgressComponent()
                .SetValue(value)
                .SetColor(style is UIColorStyle colour ? UIThemeColor.FromStyle(colour) : null)
                .SetHorizontalAlignment(UIAlignment.Stretch)
            );

    /// <summary>
    /// A value says how far along; no value says only that something is running.
    /// </summary>
    private static ContainerComponent CreateKnownGroup()
    {
        return DemoUI.CreateGroup(null, "How far, and whether that is known",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(16)
                .SetWidth(UILayoutLength.Absolute(360))
                .AddChild(DemoUI.CreateCaption("Known — the value is a number"))
                .AddChild(new ProgressComponent()
                    .SetValue(62)
                    .SetShowValue(true)
                    .SetHorizontalAlignment(UIAlignment.Stretch)
                )
                .AddChild(DemoUI.CreateCaption("Not known — the value is unset"))
                // No SetValue: null is indeterminate, where zero would be a bar that is simply empty.
                .AddChild(new ProgressComponent()
                    .SetHorizontalAlignment(UIAlignment.Stretch)
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// The circular variant where there is no room for a full-width bar and the number is the content.
    /// </summary>
    private static ContainerComponent CreateTileGroup()
    {
        return DemoUI.CreateGroup(null, "A ring, where a bar has no room",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(12)
                .SetWrap(true)
                .AddChild(CreateTile("Coverage", 87, UIColorStyle.Success))
                .AddChild(CreateTile("Error budget", 41, UIColorStyle.Warning))
                .AddChild(CreateTile("Disk", 96, UIColorStyle.Danger))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static SurfaceComponent CreateTile(string label, decimal value, UIColorStyle style)
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Raised)
            .SetWidth(UILayoutLength.Absolute(150))
            .SetContent(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(10)
                .SetHorizontalAlignment(UIAlignment.Center)
                .AddChild(new ProgressComponent()
                    .SetVariant(UIProgressVariant.Circular)
                    .SetValue(value)
                    .SetShowValue(true)
                    .SetColor(UIThemeColor.FromStyle(style))
                )
                .AddChild(new TextComponent()
                    .SetTitle(label)
                    .SetTitleType(UITextAppearance.Caption)
                    .SetTitleColor(UIThemeColor.Muted)
                    .SetTextAlignment(UITextAlignment.Center)
                )
            );

    /// <summary>
    /// The same number against three windows, which is the one thing the value alone never says.
    /// </summary>
    private static ContainerComponent CreateScaleGroup()
    {
        return DemoUI.CreateGroup(null, "The same value, three windows",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(16)
                .SetWidth(UILayoutLength.Absolute(360))
                .AddChild(CreateScale("0 to 100", 0, 100))
                .AddChild(CreateScale("0 to 200", 0, 200))
                .AddChild(CreateScale("50 to 100", 50, 100))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static StackPanelComponent CreateScale(string label, decimal min, decimal max)
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(6)
            .AddChild(DemoUI.CreateCaption(label))
            .AddChild(new ProgressComponent()
                .SetRange(min, max)
                .SetValue(62)
                .SetShowValue(true)
                .SetHorizontalAlignment(UIAlignment.Stretch)
            );
}
