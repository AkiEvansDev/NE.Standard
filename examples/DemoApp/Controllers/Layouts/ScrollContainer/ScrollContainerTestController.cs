using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Layouts.ScrollContainer;

internal sealed partial class DemoScrollMessage : RecursiveObservable, IBindableItem
{
    public DemoScrollMessage() { }

    public DemoScrollMessage(string id, string text)
    {
        Id = id;
        Text = text;
    }

    [RecursiveMember(false)]
    public string Id { get; init; } = "";

    [RecursiveMember]
    public partial string Text { get; set; } = "";
}

/// <summary>
/// Drives the container a <see cref="ScrollEffect"/> targets. Nothing is bound here: what the effect changes
/// is the scroll position, which lives in the DOM and never travels back.
/// </summary>
internal sealed partial class ScrollCommandGroupContext : DemoGroupContext
{
    public void RecordScroll(ScrollPosition position)
        => LogEvent($"Scroll effect returned: {position}");
}

/// <summary>
/// Drives the end-anchored container: appending a message must leave the viewer at the newest one while they
/// are at the bottom, and must leave their position alone once they have scrolled up.
/// </summary>
internal sealed partial class ScrollAnchorGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<DemoScrollMessage> Messages { get; } = [];

    private int _counter;

    public ScrollAnchorGroupContext()
    {
        // Seeded without going through Append, so the page opens with an empty log rather than with the
        // twelve lines that filling the container produced.
        for (var i = 0; i < 12; i++)
            Messages.Add(CreateNext());
    }

    public void Append()
    {
        DemoScrollMessage message = CreateNext();

        Messages.Add(message);

        LogEvent($"Appended '{message.Text}'");
    }

    private DemoScrollMessage CreateNext()
    {
        _counter++;

        return new DemoScrollMessage($"message-{_counter}", $"Message {_counter}");
    }
}

internal sealed partial class ScrollContainerTestController() : DemoController
{
    /// <summary>
    /// Id of the container the scroll commands address. Declared here rather than on the view so the command
    /// and the container it scrolls cannot drift apart.
    /// </summary>
    internal const string ScrollTargetId = "scroll-test-container";

    [RecursiveMember]
    public partial ScrollCommandGroupContext CommandGroup { get; set; } = new();

    [RecursiveMember]
    public partial ScrollAnchorGroupContext AnchorGroup { get; set; } = new();

    [UICommand]
    public UICommandResult ScrollToStart()
        => Scroll(ScrollPosition.Start);

    [UICommand]
    public UICommandResult ScrollToEnd()
        => Scroll(ScrollPosition.End);

    [UICommand]
    public UICommandResult ScrollPageBack()
        => Scroll(ScrollPosition.PageBack);

    [UICommand]
    public UICommandResult ScrollPageForward()
        => Scroll(ScrollPosition.PageForward);

    [UICommand]
    public UICommandResult ScrollToOffset()
        => Scroll(ScrollPosition.Offset, offset: 400);

    private UICommandResult Scroll(ScrollPosition position, double offset = 0)
    {
        CommandGroup.RecordScroll(position);

        // Instant, not the default Smooth: this page is here to prove where a scroll lands, and an animation
        // only makes that harder to read. Smooth stays the default everywhere else.
        return UICommandResult.Ok([new ScrollEffect(ScrollTargetId, position)
        {
            Axis = UIOrientation.Vertical,
            Offset = offset,
            Behavior = ScrollToBehavior.Auto
        }]);
    }

    [UICommand]
    public void AppendMessage()
        => AnchorGroup.Append();
}
