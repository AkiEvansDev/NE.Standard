using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

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

    // Static: the source matches a query against rows it has not built, so nothing is allocated per row.
    public static string FormatTitle(int index)
        => string.Create(CultureInfo.InvariantCulture, $"Row {index:N0}");

    public static string FormatDetail(int index)
        => string.Create(CultureInfo.InvariantCulture, $"generated · index {index}");

    public static int ParseIndex(string id)
        => int.TryParse(id.AsSpan("row-".Length), CultureInfo.InvariantCulture, out var index) ? index : 0;
}

/// <summary>
/// A hundred thousand rows of which only the window is ever realized; the source reports the total.
/// </summary>
internal sealed class DemoRowsSource : UIItemSourceBase<DemoRowItem>
{
    public const int TotalRows = 100_000;

    /// <summary>The last query's matches: a scroll through a filtered list asks for window after window of the same query.</summary>
    private MatchedRows? _matched;

    protected override Task<UIItemWindow<DemoRowItem>> GetWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken)
    {
        // The rows the query leaves, or null for the whole hundred thousand, which is never materialized.
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
    /// Applies the query the host's rules resolved to, which the client could not since it holds only a window; the matches are
    /// kept until the query changes.
    /// </summary>
    /// <remarks>A scan, because these rows are generated; a source over a database would translate the terms instead.</remarks>
    private int[]? Match(UIItemsQuery query)
    {
        if (query.Filters.Length == 0)
            return null;

        var key = KeyOf(query);

        // One reference read: two window reads racing each other see either the old matches or the new, never half of each.
        if (_matched is { } matched && matched.Key == key)
            return matched.Rows;

        List<int> matches = [];

        for (var index = 0; index < TotalRows; index++)
        {
            if (Matches(index, query))
                matches.Add(index);
        }

        _matched = new MatchedRows(key, [.. matches]);

        return _matched.Rows;
    }

    /// <summary>What the scan reads of a query: each term's property and value.</summary>
    private static string KeyOf(UIItemsQuery query)
    {
        var parts = new string[query.Filters.Length];

        for (var i = 0; i < parts.Length; i++)
            parts[i] = $"{query.Filters[i].ItemProperty}\u001f{Convert.ToString(query.Filters[i].Value, CultureInfo.InvariantCulture)}";

        return string.Join('\u001e', parts);
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

    /// <summary>Where a row stands in the list the reader sees; the matches are in order, and a row the filter left out stands where it would be.</summary>
    private static int PositionOf(int[]? matches, string key)
    {
        var index = DemoRowItem.ParseIndex(key);

        if (matches is null)
            return index;

        var position = Array.BinarySearch(matches, index);

        return position >= 0 ? position : ~position;
    }

    private sealed record MatchedRows(string Key, int[] Rows);
}

/// <summary>A message of the conversation, grouped by the day it was sent so a day header stands over each day's first.</summary>
internal sealed partial class DemoChatMessage(string id, string author, string text, DateTimeOffset sent) : RecursiveObservable, IBindableGroup
{
    [RecursiveMember(false)]
    public string Id { get; } = id;

    [RecursiveMember]
    public partial string Author { get; set; } = author;

    [RecursiveMember]
    public partial string Text { get; set; } = text;

    /// <summary>When it was sent; the day header draws it as a date.</summary>
    [RecursiveMember(false)]
    public DateTimeOffset Sent { get; } = sent;

    /// <summary>The day it was sent, <c>yyyy-MM-dd</c>: the group, and what a press on its header hands the command.</summary>
    /// <remarks>
    /// A UTC day, since the history is written before the reader's zone is heard; an application that knows the zone keys by the
    /// reader's day (<c>UIContext.ToLocalTime</c>).
    /// </remarks>
    [RecursiveMember(false)]
    public string Group { get; } = sent.UtcDateTime.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
}

/// <summary>
/// The other shape of the same feature: a conversation read from its end backwards, carrying a total, and a day header over the first
/// message of each day.
/// </summary>
internal sealed class DemoChatSource : UIItemSourceBase<DemoChatMessage>
{
    /// <summary>How many messages the history gives each of its days.</summary>
    private const int MessagesPerDay = 24;

    private readonly List<DemoChatMessage> _history = CreateHistory(400);

    /// <summary>
    /// Days that end yesterday, so the first message received today starts a day of its own; a day is shorter than the first window,
    /// which opens on one header and in the middle of the day before it.
    /// </summary>
    /// <remarks>Sent between 06:00 and 12:00 UTC: the same date for a reader anywhere from UTC−6 to UTC+12.</remarks>
    private static List<DemoChatMessage> CreateHistory(int count)
    {
        var days = (count + MessagesPerDay - 1) / MessagesPerDay;
        DateTimeOffset firstDay = new(DateTime.UtcNow.Date.AddDays(-days), TimeSpan.Zero);
        List<DemoChatMessage> history = new(count);

        for (var i = 1; i <= count; i++)
        {
            var day = (i - 1) / MessagesPerDay;
            var minutes = 360 + ((i - 1) % MessagesPerDay * 15);

            history.Add(new DemoChatMessage(
                string.Create(CultureInfo.InvariantCulture, $"msg-{i}"),
                i % 3 == 0 ? "Ada" : "Grace",
                string.Create(CultureInfo.InvariantCulture, $"Message {i} of the conversation."),
                firstDay.AddDays(day).AddMinutes(minutes)
            ));
        }

        return history;
    }

    public DemoChatMessage Receive(string author, string text)
    {
        DemoChatMessage message = new(
            string.Create(CultureInfo.InvariantCulture, $"msg-{_history.Count + 1}"),
            author,
            text,
            DateTimeOffset.UtcNow
        );

        _history.Add(message);

        // Only into the window the viewer is holding: a new message must not jump them to the end.
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
            HasMoreAfter = start + items.Length < _history.Count,
            // Only the source knows the day of the message just above the window: the window's first row is headed when that differs.
            GroupBefore = start > 0 ? _history[start - 1].Group : null
        });
    }

    private int IndexOf(string key)
        => _history.FindIndex(message => string.Equals(message.Id, key, StringComparison.Ordinal));
}

internal sealed partial class ItemsViewScenariosController() : DemoController
{
    /// <summary>
    /// Id of the chat's items view, so the jump command can scroll it.
    /// </summary>
    internal const string ChatViewId = "items-view-chat";

    private int _received;

    /// <summary>
    /// What the filter box holds; on the controller because a windowed host's rules are resolved server-side.
    /// </summary>
    [RecursiveMember]
    public partial string RowsFilter { get; set; } = string.Empty;

    [RecursiveMember]
    public partial DemoGroupContext RowsGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext ChatGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext LocalGroup { get; set; } = new();

    [RecursiveMember(false)]
    public DemoRowsSource Rows { get; } = new();

    [RecursiveMember(false)]
    public DemoChatSource Chat { get; } = new();

    /// <summary>
    /// An ordinary bound collection held whole by both sides: two thousand rows costing the layout of thirty.
    /// </summary>
    [RecursiveMember(false)]
    public RecursiveCollection<DemoRowItem> LocalRows { get; } = [.. Enumerable.Range(0, 2_000).Select(static index => new DemoRowItem(index))];

    /// <summary>
    /// Reads the first window here rather than leaving it to the client, so the page paints with rows in it.
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

        RowsGroup.LogEvent($"Jumped to offset {Rows.Offset} of {Rows.TotalCount}.");
    }

    [UICommand]
    public async Task BackToStartAsync(CancellationToken cancellationToken)
    {
        await Rows.LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.Start, 50), cancellationToken).ConfigureAwait(false);

        RowsGroup.LogEvent($"Back at offset {Rows.Offset}.");
    }

    [UICommand]
    public void AddLocalRow()
    {
        LocalRows.Add(new DemoRowItem(LocalRows.Count));

        LocalGroup.LogEvent($"{LocalRows.Count} rows held, and as many laid out as fit.");
    }

    /// <summary>
    /// No scroll effect: the items view is anchored to its end, so a pushed message follows on its own.
    /// </summary>
    [UICommand]
    public void ReceiveMessage()
    {
        _received++;

        DemoChatMessage message = Chat.Receive("Server", $"Pushed message #{_received}.");

        ChatGroup.LogEvent($"Received '{message.Text}'");
    }

    /// <summary>
    /// A press on a day header: the group names the day whichever message the header is drawn from, the key names that message.
    /// </summary>
    [UICommand]
    public void ShowDay(string day, string id)
        => ChatGroup.LogEvent($"The header of {day}, drawn from {id}.");

    [UICommand]
    public static UICommandResult JumpToNewest()
        => UICommandResult.Ok([new ScrollEffect(ChatViewId, ScrollPosition.End) { Behavior = ScrollToBehavior.Auto }]);
}
