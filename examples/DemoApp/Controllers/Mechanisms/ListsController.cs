using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Mechanisms;

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

/// <summary>
/// A checklist of a task: its lines and its comments, and what is being typed under each, which the row's fields write through the
/// source.
/// </summary>
internal sealed partial class DemoChecklist : TextItem
{
    [RecursiveMember]
    public partial string? Draft { get; set; }

    [RecursiveMember]
    public partial string? CommentDraft { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Lines { get; } = [];

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Comments { get; } = [];
}

/// <summary>
/// The tasks' checklists, read as one window: a field in a row writes its draft back through <see cref="TryWriteAsync"/>, as a
/// source over a store would, and the row's Enter finds it there.
/// </summary>
internal sealed class DemoChecklistSource : UIItemSourceBase<DemoChecklist>
{
    private readonly List<DemoChecklist> _checklists =
    [
        Create("move", "Move the billing database", "Freeze writes", "Copy the snapshot"),
        Create("onboard", "Onboard the new on-call engineer", "Pager access"),
        Create("review", "Quarterly access review")
    ];

    private int _lines;
    private int _comments;

    private static DemoChecklist Create(string id, string title, params string[] lines)
    {
        DemoChecklist checklist = new() { Id = id, Title = title, IsContent = true };

        for (var i = 0; i < lines.Length; i++)
            checklist.Lines.Add(new TextItem { Id = string.Create(CultureInfo.InvariantCulture, $"{id}-{i}"), Title = lines[i], IsContent = true });

        return checklist;
    }

    /// <summary>Adds the checklist's draft as its last line and empties the draft; the line added, or null for an empty draft.</summary>
    public string? AddLine(string id)
    {
        DemoChecklist? checklist = Find(id);
        var line = checklist?.Draft?.Trim();

        if (checklist is null || string.IsNullOrEmpty(line))
            return null;

        _lines++;
        checklist.Lines.Add(new TextItem { Id = string.Create(CultureInfo.InvariantCulture, $"{id}-added-{_lines}"), Title = line, IsContent = true });
        checklist.Draft = null;

        return line;
    }

    /// <summary>Adds the checklist's comment draft, every line of it, and empties the draft; the comment, or null for an empty draft.</summary>
    public string? AddComment(string id)
    {
        DemoChecklist? checklist = Find(id);
        var comment = checklist?.CommentDraft?.Trim();

        if (checklist is null || string.IsNullOrEmpty(comment))
            return null;

        _comments++;
        checklist.Comments.Add(new TextItem { Id = string.Create(CultureInfo.InvariantCulture, $"{id}-comment-{_comments}"), Title = comment, IsContent = true });
        checklist.CommentDraft = null;

        return comment;
    }

    protected override Task<UIItemWindow<DemoChecklist>> GetWindowAsync(UIItemWindowRequest request, CancellationToken cancellationToken)
        => Task.FromResult(new UIItemWindow<DemoChecklist>([.. _checklists]) { Offset = 0, TotalCount = _checklists.Count });

    /// <summary>The row's fields write their drafts; nothing else of a checklist is written from the page.</summary>
    protected override Task<bool> TryWriteAsync(DemoChecklist item, string itemProperty, object? value, CancellationToken cancellationToken)
    {
        switch (itemProperty)
        {
            case nameof(DemoChecklist.Draft):
                item.Draft = value as string;
                return Task.FromResult(true);
            case nameof(DemoChecklist.CommentDraft):
                item.CommentDraft = value as string;
                return Task.FromResult(true);
            default:
                return Task.FromResult(false);
        }
    }
}

/// <summary>
/// Sources too large to send whole, read a window at a time — a list's and a table's —, a collection held whole and drawn in part,
/// and a window of checklists whose rows write their drafts back through the source.
/// </summary>
internal sealed partial class ListsController() : DemoController
{
    /// <summary>
    /// What the filter box holds; on the controller because a windowed host's rules are resolved server-side.
    /// </summary>
    [RecursiveMember]
    public partial string RowsFilter { get; set; } = string.Empty;

    [RecursiveMember]
    public partial DemoGroupContext RowsGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext LocalGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext ChecklistGroup { get; set; } = new();

    [RecursiveMember(false)]
    public DemoRowsSource Rows { get; } = new();

    /// <summary>The table's own hundred thousand: a source feeds one host, whose window it holds.</summary>
    [RecursiveMember(false)]
    public DemoRowsSource TableRows { get; } = new();

    /// <summary>
    /// An ordinary bound collection held whole by both sides: two thousand rows costing the layout of thirty.
    /// </summary>
    [RecursiveMember(false)]
    public RecursiveCollection<DemoRowItem> LocalRows { get; } = [.. Enumerable.Range(0, 2_000).Select(static index => new DemoRowItem(index))];

    [RecursiveMember(false)]
    public DemoChecklistSource Checklists { get; } = new();

    /// <summary>
    /// Reads the first window here rather than leaving it to the client, so the page paints with rows in it.
    /// </summary>
    protected override async Task OnInitializeAsync(CancellationToken cancellationToken)
        => await Rows.LoadWindowAsync(new UIItemWindowRequest(UIItemAnchor.Start, 50), cancellationToken).ConfigureAwait(false);

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

    [UICommand]
    public void AddChecklistLine(string id)
    {
        if (Checklists.AddLine(id) is string line)
            ChecklistGroup.LogEvent($"{id}: \"{line}\" added");
    }

    [UICommand]
    public void AddChecklistComment(string id)
    {
        if (Checklists.AddComment(id) is string comment)
            ChecklistGroup.LogEvent($"{id}: comment of {comment.Length} characters added");
    }
}
