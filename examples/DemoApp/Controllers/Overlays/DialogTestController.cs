using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Controllers.Overlays;

/// <summary>
/// Builds the page lists, and a dialog that asks before one of them goes: the list is what changes.
/// </summary>
internal sealed partial class ConfirmGroupContext : DemoGroupContext
{
    private static readonly int[] AllBuilds = [479, 480, 481];

    private readonly List<int> _builds = [.. AllBuilds];

    [RecursiveMember]
    public partial string Builds { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string Question { get; set; } = string.Empty;

    public ConfirmGroupContext()
    {
        Describe();
    }

    public bool HasBuilds => _builds.Count > 0;

    public void Ask()
        => Question = $"Build #{_builds[^1]} and its artifacts go for good. The deploys that used it keep their logs.";

    public void Delete()
    {
        var build = _builds[^1];

        _builds.RemoveAt(_builds.Count - 1);
        Describe();
        LogEvent($"deleted #{build}");
    }

    public void Keep()
        => LogEvent("kept — the dialog was answered with Cancel");

    public void Restore()
    {
        _builds.Clear();
        _builds.AddRange(AllBuilds);
        Describe();
        LogEvent("all three are back");
    }

    private void Describe()
        => Builds = _builds.Count == 0
            ? "No builds left."
            : $"{_builds.Count} build{(_builds.Count == 1 ? "" : "s")} kept: {string.Join(", ", _builds.Select(build => $"#{build}"))}";
}

/// <summary>
/// A card the page shows and a draft the dialog edits: Save copies the draft over, Cancel leaves the card as it was.
/// </summary>
internal sealed partial class EditGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string Name { get; set; } = "Payments API";

    [RecursiveMember]
    public partial string Owner { get; set; } = "platform-team";

    [RecursiveMember]
    public partial string DraftName { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string DraftOwner { get; set; } = string.Empty;

    public void BeginEdit()
    {
        DraftName = Name;
        DraftOwner = Owner;
    }

    public void Save()
    {
        Name = DraftName.Trim();
        Owner = DraftOwner.Trim();
        LogEvent($"saved — '{Name}', owned by {Owner}");
    }

    public void Cancel()
        => LogEvent("cancelled — the card kept its values, the draft is thrown away");
}

/// <summary>
/// Filters on a sheet at the left edge: each switch writes straight to the controller, and the count on the page follows
/// while the sheet stays open.
/// </summary>
internal sealed partial class FiltersGroupContext : DemoGroupContext
{
    private const int AllDeploys = 144;

    [RecursiveMember]
    public partial bool OnlyFailures { get; set; } = true;

    [RecursiveMember]
    public partial bool IncludeRetries { get; set; }

    [RecursiveMember]
    public partial bool LastDay { get; set; } = true;

    [RecursiveMember]
    public partial string Summary { get; set; } = string.Empty;

    public FiltersGroupContext()
    {
        Refresh();
    }

    public void Refresh()
    {
        var count = LastDay ? 48 : AllDeploys;

        if (OnlyFailures)
            count /= 4;

        if (!IncludeRetries)
            count -= count / 3;

        List<string> active = [];

        if (OnlyFailures)
            active.Add("failures only");

        if (IncludeRetries)
            active.Add("retries included");

        if (LastDay)
            active.Add("last 24 hours");

        Summary = $"Showing {count} of {AllDeploys} deploys" + (active.Count == 0 ? ", no filter." : $" — {string.Join(", ", active)}.");
    }
}

/// <summary>
/// A list on the page and a sheet at the right edge that opens on a row: what it shows is the row's, and the page keeps the list.
/// </summary>
internal sealed partial class DetailsGroupContext : DemoGroupContext
{
    private static readonly (string Id, string Service, string Status, string Details)[] Deploys =
    [
        ("payments", "payments-api", "healthy", "Build #481 · deployed 14 minutes ago by release-bot · 12 pods, all passing the health check."),
        ("search", "search-indexer", "degraded", "Build #477 · deployed 3 hours ago · 2 of 6 pods restarting; the index rebuild is 60% through."),
        ("mail", "mail-relay", "failed", "Build #480 · rolled back 40 minutes ago · the health check answered 503 for ninety seconds.")
    ];

    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> Rows { get; } = [];

    [RecursiveMember]
    public partial string SelectedService { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string SelectedStatus { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string SelectedDetails { get; set; } = string.Empty;

    [RecursiveMember]
    public partial UIThemeColor? SelectedColor { get; set; }

    public DetailsGroupContext()
    {
        foreach ((var id, var service, var status, _) in Deploys)
        {
            Rows.Add(new KeyValueActionItem
            {
                Id = id,
                Key = new TextItem { Title = service },
                Value = new TextItem { Title = status, TitleColor = ColorOf(status) }
            });
        }
    }

    public void Select(string id)
    {
        (_, var service, var status, var details) = Array.Find(Deploys, deploy => deploy.Id == id);

        SelectedService = service;
        SelectedStatus = status;
        SelectedDetails = details;
        SelectedColor = ColorOf(status);
        LogEvent($"opened {service}");
    }

    private static UIThemeColor ColorOf(string status)
        => status switch
        {
            "healthy" => UIThemeColor.Success,
            "degraded" => UIThemeColor.Warning,
            _ => UIThemeColor.Danger
        };
}

/// <summary>
/// A dialog the command itself shows and hides while it works, and the line on the page that says when it finished.
/// </summary>
internal sealed partial class ProgressGroupContext : DemoGroupContext
{
    [RecursiveMember]
    public partial string Published { get; set; } = "Not published yet.";

    public void Report(string message)
        => LogEvent(message);
}

internal sealed partial class DialogTestController() : DemoController
{
    /// <summary>The keys the view declares its dialogs under.</summary>
    internal const string ConfirmKey = "overlay-dialog-confirm";
    internal const string EditKey = "overlay-dialog-edit";
    internal const string FiltersKey = "overlay-dialog-filters";
    internal const string DetailsKey = "overlay-dialog-details";
    internal const string ProgressKey = "overlay-dialog-progress";

    [RecursiveMember]
    public partial ConfirmGroupContext ConfirmGroup { get; set; } = new();

    [RecursiveMember]
    public partial EditGroupContext EditGroup { get; set; } = new();

    [RecursiveMember]
    public partial FiltersGroupContext FiltersGroup { get; set; } = new();

    [RecursiveMember]
    public partial DetailsGroupContext DetailsGroup { get; set; } = new();

    [RecursiveMember]
    public partial ProgressGroupContext ProgressGroup { get; set; } = new();

    [UICommand]
    public UICommandResult AskBeforeDelete()
    {
        if (!ConfirmGroup.HasBuilds)
            return UICommandResult.Ok([new ShowNotificationEffect("Nothing left to delete.", UIColorStyle.Info)]);

        ConfirmGroup.Ask();

        return UICommandResult.Ok([new OpenDialogEffect(ConfirmKey)]);
    }

    [UICommand]
    public UICommandResult DeleteBuild()
    {
        ConfirmGroup.Delete();

        return UICommandResult.Ok([new CloseDialogEffect(ConfirmKey), new ShowNotificationEffect("The build is gone.", UIColorStyle.Success)]);
    }

    [UICommand]
    public UICommandResult KeepBuild()
    {
        ConfirmGroup.Keep();

        return UICommandResult.Ok([new CloseDialogEffect(ConfirmKey)]);
    }

    [UICommand]
    public void RestoreBuilds()
        => ConfirmGroup.Restore();

    [UICommand]
    public UICommandResult BeginEdit()
    {
        EditGroup.BeginEdit();

        return UICommandResult.Ok([new OpenDialogEffect(EditKey)]);
    }

    /// <summary>
    /// The fields bind to the draft, so it is already written by the time this runs; Save is what moves it onto the card.
    /// </summary>
    [UICommand]
    public UICommandResult SaveEdit()
    {
        EditGroup.Save();

        return UICommandResult.Ok([new CloseDialogEffect(EditKey), new ShowNotificationEffect($"Saved '{EditGroup.Name}'.", UIColorStyle.Success)]);
    }

    [UICommand]
    public UICommandResult CancelEdit()
    {
        EditGroup.Cancel();

        return UICommandResult.Ok([new CloseDialogEffect(EditKey)]);
    }

    [UICommand]
    public static UICommandResult OpenFilters()
        => UICommandResult.Ok([new OpenDialogEffect(FiltersKey)]);

    [UICommand]
    public void ApplyFilters()
        => FiltersGroup.Refresh();

    [UICommand]
    public static UICommandResult CloseFilters()
        => UICommandResult.Ok([new CloseDialogEffect(FiltersKey)]);

    [UICommand]
    public UICommandResult ShowDeploy(string id)
    {
        DetailsGroup.Select(id);

        return UICommandResult.Ok([new OpenDialogEffect(DetailsKey)]);
    }

    [UICommand]
    public static UICommandResult CloseDetails()
        => UICommandResult.Ok([new CloseDialogEffect(DetailsKey)]);

    /// <summary>
    /// The service rather than an effect: it pushes straight to the connection, so the dialog stands while the command
    /// is still running and goes when the command says so.
    /// </summary>
    [UICommand]
    public async Task<UICommandResult> PublishAsync(CancellationToken cancellationToken)
    {
        ProgressGroup.Report("publishing — the dialog was pushed mid-command");

        _ = await Context.Dialogs.ShowAsync(Context.Handle, ProgressKey, cancellationToken).ConfigureAwait(false);

        await Task.Delay(1800, cancellationToken).ConfigureAwait(false);

        _ = await Context.Dialogs.HideAsync(Context.Handle, ProgressKey, cancellationToken).ConfigureAwait(false);

        ProgressGroup.Published = $"Published at {DateTime.Now:HH:mm:ss}.";
        ProgressGroup.Report("done — the same service hid it");

        return UICommandResult.Ok([new ShowNotificationEffect("Build #481 published.", UIColorStyle.Success)]);
    }
}
