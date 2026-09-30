using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Timestamp;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Timestamp;

/// <summary>
/// One timestamp, and every property that can be bound to it.
/// </summary>
/// <remarks>The page writes the moment in the reader's zone and language; the server's first paint is UTC and says so.</remarks>
internal sealed class TimestampMainView : DemoMainView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string TimestampGroup = nameof(TimestampMainController.TimestampGroup);

    public static string ViewKey => "demo.contents.timestamp.main";

    protected override string ComponentRoute => "/contents/timestamp";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.timestamp.header";
    protected override string HeaderDescription => "demo.contents.timestamp.description";

    // Format is read once at render, so each of the four is drawn, all bound to the one moment.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(440,
            ("DateTime — the day and the time of day", frame => frame.AddChild(Bind(new TimestampComponent().SetFormat(UITimestampFormat.DateTime)))),
            ("Date — the day alone", frame => frame.AddChild(Bind(new TimestampComponent().SetFormat(UITimestampFormat.Date)))),
            ("Time — the time of day alone", frame => frame.AddChild(Bind(new TimestampComponent().SetFormat(UITimestampFormat.Time)))),
            ("Relative — how long ago, kept current", frame => frame.AddChild(Bind(new TimestampComponent().SetFormat(UITimestampFormat.Relative))))
        );

    private static TimestampComponent Bind(TimestampComponent timestamp)
        => timestamp
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindValue($"{TimestampGroup}.{nameof(TimestampGroupContext.Value)}")
            .BindTextType($"{TimestampGroup}.{nameof(TimestampGroupContext.TextType)}")
            .BindColor($"{TimestampGroup}.{nameof(TimestampGroupContext.Color)}")
            .BindTooltip($"{TimestampGroup}.{nameof(TimestampGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{TimestampGroup}.{nameof(TimestampGroupContext.TooltipPlacement)}")
            .SetPlacement(1, 1, 24, 1);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(TimestampGroup, "Timestamp", nameof(TimestampMainController.CycleTimestampOption), "Value steps through now, yesterday, in two hours, a fixed day, none and five minutes ago, each read at the press.")
        );
}
