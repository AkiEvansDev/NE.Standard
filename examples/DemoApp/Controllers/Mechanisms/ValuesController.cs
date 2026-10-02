using System;
using System.Globalization;
using System.Linq;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Mechanisms;

internal sealed partial class TextInputChangeGroupContext : DemoGroupContext
{
    private const string Words = "demo.mechanisms.values.";

    [RecursiveMember]
    public partial string? Value { get; set; } = "Billing worker";

    public void RecordChange()
        => LogEvent(UIPhrase.Of(Words + "log.change", ("value", Value)));
}

internal sealed partial class TextInputTrimGroupContext : DemoGroupContext
{
    private const string Words = "demo.mechanisms.values.";

    [RecursiveMember]
    public partial string? Value { get; set; } = "   Billing worker   ";

    /// <summary>
    /// Reports the length too, since trimming happens client-side before the value is sent.
    /// </summary>
    public void RecordChange()
        => LogEvent(UIPhrase.Of(Words + "log.trimmed", ("value", Value), ("length", Value?.Length ?? 0)));
}

/// <summary>
/// A list narrowed on the server as the viewer types, the query arriving through the field's debounced value.
/// </summary>
internal sealed partial class TextInputFilterGroupContext : DemoGroupContext
{
    private const string Words = "demo.mechanisms.values.";

    // The services are the sample's data, shown as written in every language; only the page's own words are keys.
    private static readonly (string Id, string Title, string Description)[] Catalogue =
    [
        ("provisioner", "Provisioner", "Creates, resizes and deletes servers"),
        ("api-gateway", "API gateway", "The public API customers script against"),
        ("status-page", "Status page", "status.orvane.example"),
        ("dns", "DNS", "Customers' domains and records"),
        ("identity", "Identity", "Staff sign-in"),
        ("metrics", "Metrics", "The readings the charts draw"),
        ("panel", "Panel", "This admin panel"),
        ("billing", "Billing", "Invoices and dunning")
    ];

    [RecursiveMember]
    public partial string? Query { get; set; }

    [RecursiveMember(false)]
    public RecursiveCollection<TextItem> Services { get; } = [.. Catalogue.Select(ToItem)];

    public void Filter()
    {
        var query = Query?.Trim() ?? string.Empty;

        Services.Clear();

        foreach ((string Id, string Title, string Description) entry in Catalogue)
        {
            if (query.Length == 0 || entry.Title.Contains(query, StringComparison.OrdinalIgnoreCase))
                Services.Add(ToItem(entry));
        }

        LogEvent(UIPhrase.Of(Words + "log.filtered", ("query", query), ("count", Services.Count), ("all", Catalogue.Length)));
    }

    private static TextItem ToItem((string Id, string Title, string Description) entry)
        => new() { Id = entry.Id, Title = entry.Title, Description = entry.Description };
}

internal sealed partial class TextInputSubmitGroupContext : DemoGroupContext
{
    private const string Words = "demo.mechanisms.values.";

    private static readonly string[] TakenEmails = ["owner@orvane.example", "admin@orvane.example"];

    [RecursiveMember]
    public partial string? Email { get; set; }

    /// <summary>What the server has to say about the address: set on submit, cleared by the next one.</summary>
    [RecursiveMember]
    public partial UIValidationMessage? EmailValidation { get; set; }

    /// <summary>
    /// Bound <c>OnSubmit</c>: the client holds what is typed until the form is submitted.
    /// </summary>
    [RecursiveMember]
    public partial string? Notes { get; set; }

    public void Submit()
    {
        if (Email is { } email && Array.Exists(TakenEmails, taken => string.Equals(taken, email.Trim(), StringComparison.OrdinalIgnoreCase)))
        {
            EmailValidation = UIValidationMessage.Error(Words + "submit.taken");
            LogEvent(UIPhrase.Of(Words + "log.submit.refused", ("email", Email)));
            return;
        }

        EmailValidation = null;
        LogEvent(UIPhrase.Of(Words + "log.submit.done", ("email", Email), ("notes", Notes)));
    }
}

/// <summary>The form whose errors stand under it in one paragraph; the submit only says what it received.</summary>
internal sealed partial class TextInputBlockGroupContext : DemoGroupContext
{
    private const string Words = "demo.mechanisms.values.";

    [RecursiveMember]
    public partial string? Name { get; set; }

    [RecursiveMember]
    public partial string? Port { get; set; }

    [RecursiveMember]
    public partial string? Email { get; set; }

    public void Submit()
        => LogEvent(UIPhrase.Of(Words + "log.block.created", ("name", Name), ("port", Port), ("owner", Email is null ? UIPhrase.Of(Words + "log.block.nobody") : Email)));
}

/// <summary>
/// A row whose editor carries a message the controller put on it: in a row a message has no line to sit on, so it is a mark.
/// </summary>
internal sealed partial class NotedRowItem : KeyValueActionItem
{
    [RecursiveMember]
    public partial UIValidationMessage? Note { get; set; }
}

internal sealed partial class KeyValueActionNoteGroupContext : DemoGroupContext
{
    private const string Words = "demo.mechanisms.values.";

    private const string LimitId = "limit";
    private const string OwnerId = "owner";
    private const string DailyLimit = Words + "daily-limit";
    private const string Owner = Words + "owner";

    // A rule the reader cannot satisfy is a rule that says nothing, so the note names the shape it wants.
    private const string OwnerNote = Words + "note.owner";

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        // Opens editing, so the rules the field carries are answering from the first keystroke the reader makes.
        new NotedRowItem
        {
            Id = LimitId,
            Key = new TextItem { Title = DailyLimit, TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "500" },
            EditValue = 500,
            InputTemplate = LimitId,
            ShowInput = true
        },
        new NotedRowItem
        {
            Id = OwnerId,
            Key = new TextItem { Title = Owner, TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "on-call" },
            EditValue = "on-call",
            InputTemplate = OwnerId,
            Note = UIValidationMessage.Warning(OwnerNote)
        }
    ];

    /// <summary>
    /// The limit's mark is the field's own and is answered in the browser, so there is nothing to write here for it; the owner's is
    /// this method's, read off what was actually saved. Either row closes.
    /// </summary>
    public void Save(string id)
    {
        foreach (KeyValueActionItem row in Items)
        {
            if (row.Id != id || row is not NotedRowItem noted)
                continue;

            var text = Convert.ToString(row.EditValue, CultureInfo.InvariantCulture)?.Trim() ?? string.Empty;

            ((TextItem)row.Value).Title = text;

            if (id == OwnerId)
                noted.Note = text.Contains('@', StringComparison.Ordinal) ? null : UIValidationMessage.Warning(OwnerNote);

            row.ShowInput = false;
            LogEvent(UIPhrase.Of(Words + "log.note.saved", ("row", UIPhrase.Of(id == OwnerId ? Owner : DailyLimit)), ("value", text)));
            return;
        }
    }
}

internal sealed partial class KeyValueActionElsewhereGroupContext : DemoGroupContext
{
    private const string Words = "demo.mechanisms.values.";

    private const string LimitId = "limit";
    private const string RetriesId = "retries";

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        new KeyValueActionItem
        {
            Id = LimitId,
            Key = new TextItem { Title = Words + "daily-limit", TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "500" },
            EditValue = 500,
            InputTemplate = LimitId,
            ShowInput = true
        },
        new KeyValueActionItem
        {
            Id = RetriesId,
            Key = new TextItem { Title = Words + "retries", TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "3" },
            EditValue = 3,
            InputTemplate = RetriesId,
            ShowInput = true
        }
    ];

    public void Save(string id)
    {
        foreach (KeyValueActionItem row in Items)
        {
            if (row.Id == id)
                row.ShowInput = false;
        }
    }
}

/// <summary>
/// A count and a day, each with an upper bound, the controller's copy written under the group: whatever is typed, it never holds one
/// past its bound.
/// </summary>
internal sealed partial class ServerBoundsGroupContext : DemoGroupContext
{
    private const string Words = "demo.mechanisms.values.";

    /// <summary>The last day a snapshot may be kept until.</summary>
    public static readonly DateOnly Latest = new(2026, 9, 30);

    [RecursiveMember]
    public partial decimal? Replicas { get; set; } = 4;

    [RecursiveMember]
    public partial DateOnly? KeepUntil { get; set; } = new(2026, 9, 15);

    public void ReplicasChanged()
        => LogEvent(Replicas is { } replicas ? UIPhrase.Of(Words + "log.replicas", ("count", replicas.ToString(CultureInfo.InvariantCulture))) : UIPhrase.Of(Words + "log.replicas.none"));

    public void KeepUntilChanged()
        => LogEvent(KeepUntil is { } day ? UIPhrase.Of(Words + "log.keep-until", ("day", day.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture))) : UIPhrase.Of(Words + "log.keep-until.none"));
}

/// <summary>
/// What the values page needs a controller for: a value as it lands, a submit, a filter, a row's own message and the server's bounds.
/// </summary>
internal sealed partial class ValuesController() : DemoController
{
    [RecursiveMember]
    public partial TextInputChangeGroupContext ChangeGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextInputTrimGroupContext TrimGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextInputSubmitGroupContext SubmitGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextInputFilterGroupContext FilterGroup { get; set; } = new();

    [RecursiveMember]
    public partial TextInputBlockGroupContext BlockGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionNoteGroupContext NoteGroup { get; set; } = new();

    [RecursiveMember]
    public partial KeyValueActionElsewhereGroupContext ElsewhereGroup { get; set; } = new();

    [RecursiveMember]
    public partial ServerBoundsGroupContext BoundsGroup { get; set; } = new();

    [UICommand]
    public void RecordChange()
        => ChangeGroup.RecordChange();

    [UICommand]
    public void RecordTrimmedChange()
        => TrimGroup.RecordChange();

    [UICommand]
    public void Submit()
        => SubmitGroup.Submit();

    [UICommand]
    public void Filter()
        => FilterGroup.Filter();

    [UICommand]
    public void SubmitBlock()
        => BlockGroup.Submit();

    [UICommand]
    public void SaveNotedRow(string id)
        => NoteGroup.Save(id);

    [UICommand]
    public void SaveElsewhereRow(string id)
        => ElsewhereGroup.Save(id);

    [UICommand]
    public void ReplicasChanged()
        => BoundsGroup.ReplicasChanged();

    [UICommand]
    public void KeepUntilChanged()
        => BoundsGroup.KeepUntilChanged();
}
