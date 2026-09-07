using System;
using System.Linq;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Inputs.TextInput;

internal sealed partial class TextInputChangeGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; } = "Payments API";

    public void RecordChange()
        => LogEvent($"change -> \"{Value}\"");
}

internal sealed partial class TextInputTrimGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string? Value { get; set; } = "   Payments API   ";

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
        ("payments", "Payments API", "Card and wallet charges"),
        ("ledger", "Ledger", "Double-entry book of record"),
        ("notifications", "Notifications", "Mail, push and in-app"),
        ("search", "Search", "The catalogue index"),
        ("identity", "Identity", "Sign-in and sessions"),
        ("reports", "Reports", "Nightly aggregates"),
        ("web-portal", "Web Portal", "The customer site"),
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
    private static readonly string[] TakenEmails = ["owner@example.com", "admin@example.com"];

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
}
