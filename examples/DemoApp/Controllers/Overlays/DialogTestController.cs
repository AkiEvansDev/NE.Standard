using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Overlays;

/// <summary>
/// Releases the page lists, and a dialog that asks before one of them goes: the list is what changes.
/// </summary>
internal sealed partial class ConfirmGroupContext : DemoGroupContext
{
    private const string Words = "demo.overlays.dialog.";

    private static readonly int[] AllReleases = [479, 480, 481];

    private readonly List<int> _releases = [.. AllReleases];

    [RecursiveMember]
    public partial UIPhrase? Releases { get; set; }

    [RecursiveMember]
    public partial UIPhrase? Question { get; set; }

    public ConfirmGroupContext()
    {
        Describe();
    }

    public bool HasReleases => _releases.Count > 0;

    public void Ask()
        => Question = UIPhrase.Of(Words + "confirm.question", ("release", _releases[^1]));

    public void Delete()
    {
        var release = _releases[^1];

        _releases.RemoveAt(_releases.Count - 1);
        Describe();
        LogEvent(UIPhrase.Of(Words + "log.deleted", ("release", release)));
    }

    public void Keep()
        => LogEvent(UIPhrase.Of(Words + "log.kept"));

    public void Restore()
    {
        _releases.Clear();
        _releases.AddRange(AllReleases);
        Describe();
        LogEvent(UIPhrase.Of(Words + "log.restored"));
    }

    private void Describe()
        => Releases = _releases.Count == 0
            ? UIPhrase.Of(Words + "confirm.none")
            : UIPhrase.Of(Words + "confirm.kept", ("releases", string.Join(", ", _releases.Select(release => $"#{release}"))));
}

/// <summary>
/// A card the page shows and a draft the dialog edits: Save copies the draft over, Cancel leaves the card as it was.
/// </summary>
internal sealed partial class EditGroupContext : DemoGroupContext
{
    private const string Words = "demo.overlays.dialog.";

    [RecursiveMember]
    public partial string Name { get; set; } = "Billing";

    [RecursiveMember]
    public partial string Owner { get; set; } = "Priya Nair";

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
        LogEvent(UIPhrase.Of(Words + "log.saved", ("name", Name), ("owner", Owner)));
    }

    public void Cancel()
        => LogEvent(UIPhrase.Of(Words + "log.cancelled"));
}

/// <summary>
/// Filters on a sheet at the left edge: each switch writes straight to the controller, and the count on the page follows
/// while the sheet stays open.
/// </summary>
internal sealed partial class FiltersGroupContext : DemoGroupContext
{
    private const string Words = "demo.overlays.dialog.";
    private const int AllDeploys = 144;

    [RecursiveMember]
    public partial bool OnlyFailures { get; set; } = true;

    [RecursiveMember]
    public partial bool IncludeRetries { get; set; }

    [RecursiveMember]
    public partial bool LastDay { get; set; } = true;

    [RecursiveMember]
    public partial UIPhrase? Summary { get; set; }

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

        List<UIPhrase> active = [];

        if (OnlyFailures)
            active.Add(UIPhrase.Of(Words + "filters.active.failures"));

        if (IncludeRetries)
            active.Add(UIPhrase.Of(Words + "filters.active.retries"));

        if (LastDay)
            active.Add(UIPhrase.Of(Words + "filters.active.last-day"));

        Summary = active.Count == 0
            ? UIPhrase.Of(Words + "filters.summary.none", ("count", count), ("all", AllDeploys))
            : UIPhrase.Of(Words + "filters.summary", ("count", count), ("all", AllDeploys), ("filters", Join(active, 0)));
    }

    // A list in the reader's own way of listing: each pair joined by a phrase, the first to the rest.
    private static UIPhrase Join(List<UIPhrase> parts, int from)
        => from == parts.Count - 1 ? parts[from] : UIPhrase.Of(Words + "filters.join", ("first", parts[from]), ("rest", Join(parts, from + 1)));
}

/// <summary>
/// A list on the page and a sheet at the right edge that opens on a row: what it shows is the row's, and the page keeps the list.
/// </summary>
internal sealed partial class DetailsGroupContext : DemoGroupContext
{
    // The deploys are the sample's data, shown as written in every language; only the page's own words are keys.
    private static readonly (string Id, string Service, string Status, string Details)[] Deploys =
    [
        ("billing", "billing", "healthy", "Release #481 · deployed 14 minutes ago by release-bot · 12 replicas, all passing the health check."),
        ("dns", "dns", "degraded", "Release #477 · deployed 3 hours ago · 1 of 2 replicas restarting; the zone reload is 60% through."),
        ("mail", "mail-relay", "failed", "Release #480 · rolled back 40 minutes ago · the health check answered 503 for ninety seconds.")
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
        LogEvent(UIPhrase.Of("demo.overlays.dialog.log.opened", ("service", service)));
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
    public partial UIPhrase? Published { get; set; } = UIPhrase.Of("demo.overlays.dialog.progress.none");
}

internal sealed partial class DialogTestController() : DemoController
{
    private const string Words = "demo.overlays.dialog.";

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
        if (!ConfirmGroup.HasReleases)
            return UICommandResult.Ok([new ShowNotificationEffect(UIPhrase.Of(Words + "toast.nothing"), UIColorStyle.Info)]);

        ConfirmGroup.Ask();

        return UICommandResult.Ok([new OpenDialogEffect(ConfirmKey)]);
    }

    [UICommand]
    public UICommandResult DeleteRelease()
    {
        // The dialog is asked only while there is a release; a late second press finds none.
        if (!ConfirmGroup.HasReleases)
            return UICommandResult.Ok([new CloseDialogEffect(ConfirmKey)]);

        ConfirmGroup.Delete();

        return UICommandResult.Ok([new CloseDialogEffect(ConfirmKey), new ShowNotificationEffect(UIPhrase.Of(Words + "toast.gone"), UIColorStyle.Success)]);
    }

    [UICommand]
    public UICommandResult KeepRelease()
    {
        ConfirmGroup.Keep();

        return UICommandResult.Ok([new CloseDialogEffect(ConfirmKey)]);
    }

    [UICommand]
    public void RestoreReleases()
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

        return UICommandResult.Ok([new CloseDialogEffect(EditKey), new ShowNotificationEffect(UIPhrase.Of(Words + "toast.saved", ("name", EditGroup.Name)), UIColorStyle.Success)]);
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
        ProgressGroup.LogEvent(UIPhrase.Of(Words + "log.publishing"));

        _ = await Context.Dialogs.ShowAsync(Context.Handle, ProgressKey, cancellationToken).ConfigureAwait(false);

        try
        {
            await Task.Delay(1800, cancellationToken).ConfigureAwait(false);
        }
        finally
        {
            // On every way out: work that throws must not leave the page behind its dialog.
            _ = await Context.Dialogs.HideAsync(Context.Handle, ProgressKey, CancellationToken.None).ConfigureAwait(false);
        }

        ProgressGroup.Published = UIPhrase.Of(Words + "progress.done", ("time", DateTime.Now.ToString("HH:mm:ss", CultureInfo.InvariantCulture)));
        ProgressGroup.LogEvent(UIPhrase.Of(Words + "log.published"));

        return UICommandResult.Ok([new ShowNotificationEffect(UIPhrase.Of(Words + "toast.published"), UIColorStyle.Success)]);
    }
}
