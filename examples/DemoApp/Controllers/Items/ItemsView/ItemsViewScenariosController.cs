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
    /// Applies the query the host's rules resolved to, which the client could not since it holds only a window.
    /// </summary>
    /// <remarks>A scan, because these rows are generated; a source over a database would translate the terms instead.</remarks>
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
/// The other shape of the same feature: a conversation read from its end backwards, carrying a total.
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
    /// No scroll effect: the items view is anchored to its end, so a pushed message follows on its own.
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
