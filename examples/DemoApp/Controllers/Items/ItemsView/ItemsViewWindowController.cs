using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Data;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Data;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Items.ItemsView;

internal sealed partial class DemoRowItem(int index) : RecursiveObservable, IBindableItem
{
    [RecursiveMember(false)]
    public string Id { get; } = FormatId(index);

    [RecursiveMember]
    public partial string Title { get; set; } = FormatTitle(index);

    [RecursiveMember]
    public partial string Detail { get; set; } = FormatDetail(index);

    public static string FormatId(int index)
        => string.Create(CultureInfo.InvariantCulture, $"row-{index}");

    // Static because the source matches a query against rows it has not built: a filter over a hundred
    // thousand of them would otherwise allocate one item per row per keystroke, and only to read one field.
    public static string FormatTitle(int index)
        => string.Create(CultureInfo.InvariantCulture, $"Row {index:N0}");

    public static string FormatDetail(int index)
        => string.Create(CultureInfo.InvariantCulture, $"generated · index {index}");

    public static int ParseIndex(string id)
        => int.TryParse(id.AsSpan("row-".Length), CultureInfo.InvariantCulture, out var index) ? index : 0;
}

/// <summary>
/// A hundred thousand rows that exist only when someone looks at them: the window is the only part ever
/// realized, and the scrollbar is honest because the source reports the total.
/// </summary>
internal sealed class DemoRowsSource : UIItemSourceBase<DemoRowItem>
{
    public const int TotalRows = 100_000;

    protected override Task<UIItemWindow<DemoRowItem>> GetWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken)
    {
        // The rows the query leaves, or null when it asks for nothing in particular — which is the whole
        // hundred thousand and never materialized.
        var matches = Match(request.Query);
        var total = matches?.Length ?? TotalRows;

        var start = request.Anchor.Kind switch
        {
            UIItemAnchorKind.Start => 0,
            UIItemAnchorKind.End => total - request.Count,
            UIItemAnchorKind.Offset => request.Anchor.Offset,
            UIItemAnchorKind.Before => PositionOf(matches, request.Anchor.Key!) - request.Count,
            UIItemAnchorKind.After => PositionOf(matches, request.Anchor.Key!) + 1,
            _ => 0
        };

        start = Math.Clamp(start, 0, Math.Max(0, total - 1));

        var count = Math.Max(0, Math.Min(request.Count, total - start));

        DemoRowItem[] items = matches is null
            ? [.. Enumerable.Range(start, count).Select(static index => new DemoRowItem(index))]
            : [.. matches.Skip(start).Take(count).Select(static index => new DemoRowItem(index))];

        return Task.FromResult(new UIItemWindow<DemoRowItem>(items)
        {
            Offset = start,
            TotalCount = total,
            HasMoreBefore = start > 0,
            HasMoreAfter = start + count < total
        });
    }

    /// <summary>
    /// Applies the query the host's rules resolved to, which is the whole point of answering it here: the
    /// client holds fifty rows and could only ever have filtered those.
    /// </summary>
    /// <remarks>
    /// A scan, because these rows are generated rather than stored. A source over a database translates the
    /// terms into its own language instead — <c>Like</c> is a <c>LIKE</c>, and the count is a <c>COUNT</c>.
    /// </remarks>
    private static int[]? Match(UIItemsQuery query)
    {
        if (query.Filters.Length == 0)
            return null;

        List<int> matches = [];

        for (var index = 0; index < TotalRows; index++)
        {
            if (Matches(index, query))
                matches.Add(index);
        }

        return [.. matches];
    }

    private static bool Matches(int index, UIItemsQuery query)
    {
        for (var i = 0; i < query.Filters.Length; i++)
        {
            UIItemFilterTerm term = query.Filters[i];

            var value = string.Equals(term.ItemProperty, nameof(DemoRowItem.Detail), StringComparison.Ordinal)
                ? DemoRowItem.FormatDetail(index)
                : DemoRowItem.FormatTitle(index);

            if (!value.Contains(Convert.ToString(term.Value, CultureInfo.InvariantCulture) ?? string.Empty, StringComparison.OrdinalIgnoreCase))
                return false;
        }

        return true;
    }

    private static int PositionOf(int[]? matches, string key)
    {
        var index = DemoRowItem.ParseIndex(key);

        return matches is null ? index : Array.IndexOf(matches, index);
    }
}

internal sealed partial class DemoChatMessage(string id, string author, string text) : RecursiveObservable, IBindableItem
{
    [RecursiveMember(false)]
    public string Id { get; } = id;

    [RecursiveMember]
    public partial string Author { get; set; } = author;

    [RecursiveMember]
    public partial string Text { get; set; } = text;
}

/// <summary>
/// The other shape of the same feature: a conversation read from its end backwards. It carries a total, so
/// the scrollbar is proportional — a source that cannot count would leave it as "there is more above", which
/// the client also handles.
/// </summary>
internal sealed class DemoChatSource : UIItemSourceBase<DemoChatMessage>
{
    private readonly List<DemoChatMessage> _history =
    [
        .. Enumerable.Range(1, 400).Select(static i => new DemoChatMessage(
            string.Create(CultureInfo.InvariantCulture, $"msg-{i}"),
            i % 3 == 0 ? "Ada" : "Grace",
            string.Create(CultureInfo.InvariantCulture, $"Message {i} of the conversation.")
        ))
    ];

    public DemoChatMessage Receive(string author, string text)
    {
        DemoChatMessage message = new(
            string.Create(CultureInfo.InvariantCulture, $"msg-{_history.Count + 1}"),
            author,
            text
        );

        _history.Add(message);

        // Only into the window the viewer is holding — a message that arrives while they are reading further
        // up must not jump them to the end, and the count alone tells them there is more.
        if (!HasMoreAfter)
            Append(message);
        else if (TotalCount is int total)
            TotalCount = total + 1;

        return message;
    }

    protected override Task<UIItemWindow<DemoChatMessage>> GetWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken)
    {
        var start = request.Anchor.Kind switch
        {
            UIItemAnchorKind.Start => 0,
            UIItemAnchorKind.End => _history.Count - request.Count,
            UIItemAnchorKind.Offset => request.Anchor.Offset,
            UIItemAnchorKind.Before => IndexOf(request.Anchor.Key!) - request.Count,
            UIItemAnchorKind.After => IndexOf(request.Anchor.Key!) + 1,
            _ => 0
        };

        start = Math.Clamp(start, 0, Math.Max(0, _history.Count - 1));

        DemoChatMessage[] items = [.. _history.Skip(start).Take(request.Count)];

        return Task.FromResult(new UIItemWindow<DemoChatMessage>(items)
        {
            Offset = start,
            TotalCount = _history.Count,
            HasMoreBefore = start > 0,
            HasMoreAfter = start + items.Length < _history.Count
        });
    }

    private int IndexOf(string key)
        => _history.FindIndex(message => string.Equals(message.Id, key, StringComparison.Ordinal));
}

internal sealed partial class WindowGroupContext : DemoGroupContext
{
    public void Report(string message)
        => LogEvent(message);
}

internal sealed partial class ItemsViewWindowController() : DemoController
{
    /// <summary>
    /// Id of the chat's items view, so the jump command can scroll it without a component reference on the
    /// view drifting away from the command.
    /// </summary>
    internal const string ChatViewId = "items-window-chat";

    private int _received;

    /// <summary>
    /// What the filter box holds. On the controller because a windowed host's rules are resolved on the
    /// server — the source is asked for the rows that match, since it is the only thing that can see them all.
    /// </summary>
    [RecursiveMember]
    public partial string RowsFilter { get; set; } = string.Empty;

    [RecursiveMember]
    public partial WindowGroupContext RowsGroup { get; set; } = new();

    [RecursiveMember]
    public partial WindowGroupContext ChatGroup { get; set; } = new();

    [RecursiveMember]
    public partial WindowGroupContext LocalGroup { get; set; } = new();

    [RecursiveMember(false)]
    public DemoRowsSource Rows { get; } = new();

    [RecursiveMember(false)]
    public DemoChatSource Chat { get; } = new();

    /// <summary>
    /// An ordinary bound collection, held whole by both sides. Nothing is windowed here — the point is that
    /// two thousand rows can be sent and still cost the layout of the thirty on screen.
    /// </summary>
    [RecursiveMember(false)]
    public RecursiveCollection<DemoRowItem> LocalRows { get; } = [.. Enumerable.Range(0, 2_000).Select(static index => new DemoRowItem(index))];

    /// <summary>
    /// The first window is read here rather than left to the client: the page then paints with rows already in
    /// it, and the chat opens where a conversation is meant to open — at the newest message.
    /// </summary>
    protected override async Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        await Rows.LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.Start, 50), cancellationToken).ConfigureAwait(false);
        await Chat.LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.End, 30), cancellationToken).ConfigureAwait(false);
    }

    [UICommand]
    public async Task JumpToMiddleAsync(CancellationToken cancellationToken)
    {
        await Rows.LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.At(50_000), 50), cancellationToken).ConfigureAwait(false);

        RowsGroup.Report($"Jumped to offset {Rows.Offset} of {Rows.TotalCount}.");
    }

    [UICommand]
    public async Task BackToStartAsync(CancellationToken cancellationToken)
    {
        await Rows.LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.Start, 50), cancellationToken).ConfigureAwait(false);

        RowsGroup.Report($"Back at offset {Rows.Offset}.");
    }

    [UICommand]
    public void AddLocalRow()
    {
        LocalRows.Add(new DemoRowItem(LocalRows.Count));

        LocalGroup.Report($"{LocalRows.Count} rows held, and as many laid out as fit.");
    }

    /// <summary>
    /// No scroll effect: the items view is anchored to its end, so a pushed message follows on its own while
    /// the viewer is at the bottom and does not yank the view while they are reading further up.
    /// </summary>
    [UICommand]
    public void ReceiveMessage()
    {
        _received++;

        DemoChatMessage message = Chat.Receive("Server", $"Pushed message #{_received}.");

        ChatGroup.Report($"Received '{message.Text}'");
    }

    [UICommand]
    public static UICommandResult JumpToNewest()
        => UICommandResult.Ok([new ScrollEffect(ChatViewId, ScrollPosition.End) { Behavior = ScrollToBehavior.Auto }]);
}
