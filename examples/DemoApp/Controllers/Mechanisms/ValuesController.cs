using System;
using System.Globalization;
using System.Linq;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Mechanisms;

/// <summary>A name the field sends when it is left, not on every key.</summary>
internal sealed partial class ChangeGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Name { get; set; } = "Billing worker";
}

/// <summary>A name the field trims before it sends it.</summary>
internal sealed partial class TrimGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Name { get; set; } = "   Billing worker   ";
}

/// <summary>
/// A list narrowed on the server as the viewer types, the query arriving through the field's debounced value.
/// </summary>
internal sealed partial class FilterGroupContext : DemoGroupContext
{
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

    /// <summary>Rebuilds the list from the query; the count found, of all.</summary>
    public (int Found, int All) Apply()
    {
        var query = Query?.Trim() ?? string.Empty;

        Services.Clear();

        foreach ((string Id, string Title, string Description) entry in Catalogue)
        {
            if (query.Length == 0 || entry.Title.Contains(query, StringComparison.OrdinalIgnoreCase))
                Services.Add(ToItem(entry));
        }

        return (Services.Count, Catalogue.Length);
    }

    private static TextItem ToItem((string Id, string Title, string Description) entry)
        => new() { Id = entry.Id, Title = entry.Title, Description = entry.Description };
}

/// <summary>A note the page holds until the form is submitted (<c>UIBindingMode.OnSubmit</c>).</summary>
internal sealed partial class OnSubmitGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Note { get; set; }
}

/// <summary>Three fields whose rules run at three different moments; the controller only hears the submit.</summary>
internal sealed partial class TriggersGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial decimal? Limit { get; set; } = 500;

    [RecursiveMember]
    public partial string? Email { get; set; }

    [RecursiveMember]
    public partial string? Name { get; set; }
}

/// <summary>An owner's address, required on submit and warned about when it is outside the company.</summary>
internal sealed partial class SubmitGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Email { get; set; }
}

/// <summary>An address the server checks on submit, its answer written on the field.</summary>
internal sealed partial class ServerGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Email { get; set; }

    /// <summary>What the server has to say about the address: set on submit, cleared by the next one.</summary>
    [RecursiveMember]
    public partial UIValidationMessage? EmailValidation { get; set; }
}

/// <summary>The form whose errors stand under it in one paragraph; the submit only says what it received.</summary>
internal sealed partial class UnderFormGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Name { get; set; }

    [RecursiveMember]
    public partial string? Port { get; set; }

    [RecursiveMember]
    public partial string? Email { get; set; }
}

/// <summary>A row whose editor carries the controller's message: a line under the open field, a dot beside the closed row's value.</summary>
internal sealed partial class NotedRowItem : KeyValueActionItem
{
    [RecursiveMember]
    public partial UIValidationMessage? Note { get; set; }
}

/// <summary>
/// Three rows, each opening an editor of its own: the limit and the owner judged by their fields' rules, the region marked by the
/// controller; the owner open.
/// </summary>
internal sealed partial class RowMarksGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        Row(new KeyValueActionItem { Id = "limit", EditValue = 100 }, "demo.mechanisms.values.daily-limit", "100"),
        Row(new KeyValueActionItem { Id = "owner" }, "demo.mechanisms.values.owner", "on-call", open: true),
        // Whether the service holds data yet is the server's to know, so the region's word is the controller's, not a rule's.
        Row(new NotedRowItem { Id = "region", Note = UIValidationMessage.Info("demo.mechanisms.values.region.info") }, "demo.mechanisms.values.region", "eu-west")
    ];

    private static KeyValueActionItem Row(KeyValueActionItem row, string key, string value, bool open = false)
    {
        row.Key = new TextItem { Title = key, TitleColor = UIThemeColor.Muted };
        row.Value = new TextItem { Title = value };
        row.EditValue ??= value;
        row.InputTemplate = row.Id;
        row.ShowInput = open;

        return row;
    }
}

/// <summary>A row whose field carries rules of its own, answered in the browser on every key.</summary>
internal sealed partial class RowRulesGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        new KeyValueActionItem
        {
            Id = "limit",
            Key = new TextItem { Title = "demo.mechanisms.values.daily-limit", TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "150" },
            EditValue = 150,
            InputTemplate = "limit",
            ShowInput = true
        }
    ];
}

/// <summary>Two rows whose rules write their words into one paragraph beside the list.</summary>
internal sealed partial class BesideListGroupContext : DemoGroupContext
{
    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Items { get; } =
    [
        new KeyValueActionItem
        {
            Id = "limit",
            Key = new TextItem { Title = "demo.mechanisms.values.daily-limit", TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "500" },
            EditValue = 500,
            InputTemplate = "limit",
            ShowInput = true
        },
        new KeyValueActionItem
        {
            Id = "retries",
            Key = new TextItem { Title = "demo.mechanisms.values.retries", TitleColor = UIThemeColor.Muted },
            Value = new TextItem { Title = "3" },
            EditValue = 3,
            InputTemplate = "retries",
            ShowInput = true
        }
    ];
}

/// <summary>A count with bounds on both sides; the line under the group is what the controller holds.</summary>
internal sealed partial class NumberBoundsGroupContext : DemoGroupContext
{
    public NumberBoundsGroupContext()
    {
        Report();
    }

    [RecursiveMember]
    public partial decimal? Replicas { get; set; } = 4;

    public void Report()
        => LogEvent(Replicas is { } replicas ? UIPhrase.Of("demo.mechanisms.values.log.replicas", ("count", replicas.ToString(CultureInfo.InvariantCulture))) : UIPhrase.Of("demo.mechanisms.values.log.replicas.none"));
}

/// <summary>A day with a latest bound; the line under the group is what the controller holds.</summary>
internal sealed partial class DayBoundsGroupContext : DemoGroupContext
{
    /// <summary>The last day a snapshot may be kept until.</summary>
    public static readonly DateOnly Latest = new(2026, 12, 31);

    public DayBoundsGroupContext()
    {
        Report();
    }

    [RecursiveMember]
    public partial DateOnly? KeepUntil { get; set; } = new(2026, 11, 15);

    public void Report()
        => LogEvent(KeepUntil is { } day ? UIPhrase.Of("demo.mechanisms.values.log.keep-until", ("day", day.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture))) : UIPhrase.Of("demo.mechanisms.values.log.keep-until.none"));
}

/// <summary>
/// The values page: what reaches the controller and when, the rules that judge a value, where their words stand, and bounds.
/// </summary>
internal sealed partial class ValuesController() : DemoController
{
    private static readonly string[] TakenEmails = ["owner@orvane.example", "admin@orvane.example"];

    [RecursiveMember]
    public partial ChangeGroupContext ChangeGroup { get; set; } = new();

    [RecursiveMember]
    public partial TrimGroupContext TrimGroup { get; set; } = new();

    [RecursiveMember]
    public partial FilterGroupContext FilterGroup { get; set; } = new();

    [RecursiveMember]
    public partial OnSubmitGroupContext OnSubmitGroup { get; set; } = new();

    [RecursiveMember]
    public partial TriggersGroupContext TriggersGroup { get; set; } = new();

    [RecursiveMember]
    public partial SubmitGroupContext SubmitGroup { get; set; } = new();

    [RecursiveMember]
    public partial ServerGroupContext ServerGroup { get; set; } = new();

    [RecursiveMember]
    public partial UnderFormGroupContext UnderFormGroup { get; set; } = new();

    [RecursiveMember]
    public partial RowMarksGroupContext RowMarksGroup { get; set; } = new();

    [RecursiveMember]
    public partial RowRulesGroupContext RowRulesGroup { get; set; } = new();

    [RecursiveMember]
    public partial BesideListGroupContext BesideListGroup { get; set; } = new();

    [RecursiveMember]
    public partial NumberBoundsGroupContext NumberBoundsGroup { get; set; } = new();

    [RecursiveMember]
    public partial DayBoundsGroupContext DayBoundsGroup { get; set; } = new();

    /// <summary>The field's change: by now the bound <c>Name</c> holds what was typed.</summary>
    [UICommand]
    public void NameChanged()
        => ChangeGroup.LogEvent(UIPhrase.Of("demo.mechanisms.values.log.change", ("value", ChangeGroup.Name)));

    /// <summary>Reports the length too, since the browser trimmed the value before sending it.</summary>
    [UICommand]
    public void TrimmedNameChanged()
        => TrimGroup.LogEvent(UIPhrase.Of("demo.mechanisms.values.log.trimmed", ("value", TrimGroup.Name), ("length", TrimGroup.Name?.Length ?? 0)));

    [UICommand]
    public void Filter()
    {
        (var found, var all) = FilterGroup.Apply();

        FilterGroup.LogEvent(UIPhrase.Of("demo.mechanisms.values.log.filtered", ("query", FilterGroup.Query?.Trim() ?? string.Empty), ("count", found), ("all", all)));
    }

    /// <summary>The note arrives with the command, not before it.</summary>
    [UICommand]
    public void SendNote()
        => OnSubmitGroup.LogEvent(UIPhrase.Of("demo.mechanisms.values.log.sent", ("note", OnSubmitGroup.Note)));

    /// <summary>Runs only once no rule of the form holds an error.</summary>
    [UICommand]
    public void CheckTriggers()
        => TriggersGroup.LogEvent(UIPhrase.Of("demo.mechanisms.values.log.checked", ("name", TriggersGroup.Name)));

    /// <summary>Runs only once no rule of the form holds an error; a warning lets it through.</summary>
    [UICommand]
    public void SaveOwner()
        => SubmitGroup.LogEvent(UIPhrase.Of("demo.mechanisms.values.log.saved-owner", ("email", SubmitGroup.Email)));

    /// <summary>The server's own check, its answer on the field: a message the next submit clears.</summary>
    [UICommand]
    public void ClaimEmail()
    {
        if (ServerGroup.Email is { } email && Array.Exists(TakenEmails, taken => string.Equals(taken, email.Trim(), StringComparison.OrdinalIgnoreCase)))
        {
            ServerGroup.EmailValidation = UIValidationMessage.Error("demo.mechanisms.values.server.taken");
            ServerGroup.LogEvent(UIPhrase.Of("demo.mechanisms.values.log.taken", ("email", email)));
            return;
        }

        ServerGroup.EmailValidation = null;
        ServerGroup.LogEvent(UIPhrase.Of("demo.mechanisms.values.log.claimed", ("email", ServerGroup.Email)));
    }

    [UICommand]
    public void CreateService()
        => UnderFormGroup.LogEvent(UIPhrase.Of("demo.mechanisms.values.log.created", ("name", UnderFormGroup.Name), ("port", UnderFormGroup.Port)));

    /// <summary>Runs only once no rule of the row holds an error; the row's draft becomes its value and the row closes.</summary>
    [UICommand]
    public void SaveMarkedRow(string id)
        => RowMarksGroup.LogEvent(UIPhrase.Of("demo.mechanisms.values.log.row-saved", ("value", SaveRow(RowMarksGroup.Items, id))));

    private static string? SaveRow(RecursiveCollection<KeyValueActionItem> rows, string id)
    {
        KeyValueActionItem? row = rows.FirstOrDefault(row => row.Id == id);

        if (row is null)
            return null;

        var text = Convert.ToString(row.EditValue, CultureInfo.InvariantCulture)?.Trim() ?? string.Empty;

        ((TextItem)row.Value).Title = text;
        row.ShowInput = false;

        return text;
    }

    [UICommand]
    public void SaveRuledRow(string id)
        => RowRulesGroup.LogEvent(UIPhrase.Of("demo.mechanisms.values.log.row-saved", ("value", SaveRow(RowRulesGroup.Items, id))));

    [UICommand]
    public void SaveListedRow(string id)
        => BesideListGroup.LogEvent(UIPhrase.Of("demo.mechanisms.values.log.row-saved", ("value", SaveRow(BesideListGroup.Items, id))));

    [UICommand]
    public void ReplicasChanged()
        => NumberBoundsGroup.Report();

    [UICommand]
    public void KeepUntilChanged()
        => DayBoundsGroup.Report();
}
