using System.Globalization;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Layouts.Scroll;

/// <summary>
/// Content that grows: a conversation whose replies are hidden in the tree, so sending reveals the next one, and output from a
/// job that has not finished, a line per append.
/// </summary>
/// <remarks>Both conversation viewports show the same replies, so the only difference between them is <c>ScrollAnchor</c>.</remarks>
internal sealed partial class ScrollAnchorGroupContext : DemoGroupContext
{
    private static readonly string[] Steps =
    [
        "ordering api-eu-west-1", "creating disk 80 GB", "writing the image",
        "booting", "running the health check", "health check passed"
    ];

    /// <summary>Enough that the pane starts full, so the first append is read as an arrival.</summary>
    private const int Seed = 12;

    private int _sent;
    private int _line = Seed;

    [RecursiveMember]
    public partial UIResponsive<UIVisibility> Reply1 { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial UIResponsive<UIVisibility> Reply2 { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial UIResponsive<UIVisibility> Reply3 { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial UIResponsive<UIVisibility> Reply4 { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial string Output { get; set; } = BuildSeed();

    public void Send()
    {
        if (_sent == 4)
        {
            LogEvent("the conversation is over: all four replies have arrived");
            return;
        }

        _sent++;

        Reply1 = Arrived(1);
        Reply2 = Arrived(2);
        Reply3 = Arrived(3);
        Reply4 = Arrived(4);

        LogEvent($"message {_sent.ToString(CultureInfo.InvariantCulture)} arrived");
    }

    private UIVisibility Arrived(int index)
        => _sent >= index ? UIVisibility.Visible : UIVisibility.Collapsed;

    public void Append()
    {
        Output = $"{Output}\n{Line(++_line)}";
        LogEvent($"line {_line.ToString(CultureInfo.InvariantCulture)} written");
    }

    private static string BuildSeed()
    {
        var log = Line(1);

        for (var line = 2; line <= Seed; line++)
            log = $"{log}\n{Line(line)}";

        return log;
    }

    private static string Line(int number)
        => $"[{number:00}]   {Steps[(number - 1) % Steps.Length]}";
}

/// <summary>
/// One viewport and every property that can be bound to it, and the property that only means something once the content moves.
/// </summary>
internal sealed partial class ScrollController() : DemoStandardController
{
    [RecursiveMember]
    public partial ScrollGroupContext ScrollGroup { get; set; } = new();

    [RecursiveMember]
    public partial ScrollAnchorGroupContext AnchorGroup { get; set; } = new();

    [UICommand]
    public void CycleScrollGroupOption(string id)
        => ScrollGroup.CycleOption(id);

    [UICommand]
    public void SendMessage()
        => AnchorGroup.Send();

    [UICommand]
    public void AppendOutput()
        => AnchorGroup.Append();
}
