using System;
using System.Linq;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Inputs.TextInput;

internal sealed partial class TextInputChangeGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; } = "Billing worker";

    public void RecordChange()
        => LogEvent($"change -> \"{Value}\"");
}

internal sealed partial class TextInputTrimGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; } = "   Billing worker   ";

    /// <summary>
    /// Reports the length too, since trimming happens client-side before the value is sent.
    /// </summary>
    public void RecordChange()
        => LogEvent($"received -> \"{Value}\" (length {Value?.Length ?? 0})");
}

/// <summary>
/// A list narrowed on the server as the viewer types, the query arriving through the field's debounced value.
/// </summary>
internal sealed partial class TextInputFilterGroupContext : DemoGroupContext
{
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

        LogEvent($"filtered by \"{query}\" -> {Services.Count} of {Catalogue.Length}");
    }

    private static TextItem ToItem((string Id, string Title, string Description) entry)
        => new() { Id = entry.Id, Title = entry.Title, Description = entry.Description };
}

internal sealed partial class TextInputSubmitGroupContext : DemoGroupContext
{
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
            EmailValidation = UIValidationMessage.Error("That address already owns a service.");
            LogEvent($"refused -> \"{Email}\" is taken");
            return;
        }

        EmailValidation = null;
        LogEvent($"submitted -> \"{Email}\", notes \"{Notes}\"");
    }
}

/// <summary>The form whose errors stand under it in one paragraph; the submit only says what it received.</summary>
internal sealed partial class TextInputBlockGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Name { get; set; }

    [RecursiveMember]
    public partial string? Port { get; set; }

    [RecursiveMember]
    public partial string? Email { get; set; }

    public void Submit()
        => LogEvent($"created -> {Name} on {Port}, owner {Email ?? "nobody"}");
}

internal sealed partial class TextInputScenariosController() : DemoController
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
}
