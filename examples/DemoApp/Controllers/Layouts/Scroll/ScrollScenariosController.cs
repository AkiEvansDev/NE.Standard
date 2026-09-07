using System.Globalization;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Controllers.Layouts.Scroll;

/// <summary>
/// A conversation that is still going: the replies are hidden in the tree, and sending reveals the next one.
/// </summary>
/// <remarks>Both viewports show the same conversation, so the only difference between them is <c>ScrollAnchor</c>.</remarks>
internal sealed partial class ChatGroupContext : DemoGroupContext
{
    private int _sent;

    [RecursiveMember]
    public partial UIResponsive<UIVisibility> Reply1 { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial UIResponsive<UIVisibility> Reply2 { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial UIResponsive<UIVisibility> Reply3 { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial UIResponsive<UIVisibility> Reply4 { get; set; } = UIVisibility.Collapsed;

    [RecursiveMember]
    public partial bool CanSend { get; set; } = true;

    public void Send()
    {
        _sent++;

        Reply1 = Arrived(1);
        Reply2 = Arrived(2);
        Reply3 = Arrived(3);
        Reply4 = Arrived(4);
        CanSend = _sent < 4;

        LogEvent($"message {_sent.ToString(CultureInfo.InvariantCulture)} arrived");
    }

    private UIVisibility Arrived(int index)
        => _sent >= index ? UIVisibility.Visible : UIVisibility.Collapsed;
}

/// <summary>
/// The other end-anchored case: output from a job that has not finished, a line per append.
/// </summary>
internal sealed partial class BuildLogGroupContext : DemoGroupContext
{
    private static readonly string[] Steps =
    [
        "restoring packages", "building NE.Standard.UI", "building NE.Standard.UI.Web",
        "running 514 tests", "packing artifacts", "uploading to the staging registry"
    ];

    private int _line = Seed;

    /// <summary>Enough that the pane starts full, so the first append is read as an arrival.</summary>
    private const int Seed = 12;

    [RecursiveMember]
    public partial string Output { get; set; } = BuildSeed();

    public void Append()
        => Output = $"{Output}\n{Line(++_line)}";

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
/// One viewport, and the property that only means something once the content moves.
/// </summary>
internal sealed partial class ScrollScenariosController() : DemoController
{
    [RecursiveMember]
    public partial ChatGroupContext ChatGroup { get; set; } = new();

    [RecursiveMember]
    public partial BuildLogGroupContext LogGroup { get; set; } = new();

    [UICommand]
    public void SendMessage()
        => ChatGroup.Send();

    [UICommand]
    public void AppendOutput()
        => LogGroup.Append();
}
