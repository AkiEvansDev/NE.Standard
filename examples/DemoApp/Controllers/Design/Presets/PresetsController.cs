using System.Globalization;
using DemoApp.Controllers.Base;

namespace DemoApp.Controllers.Design.Presets;

/// <summary>
/// What the presets page's samples bind to and report: the details and the badges a press rewrites, a message's bound words, the
/// dialogs the buttons open and the standard actions pressed.
/// </summary>
internal sealed partial class PresetsController() : DemoController
{
    /// <summary>The keys the view declares its dialogs under, one per <c>UIDialogs</c> preset.</summary>
    internal const string CreateKey = "presets-dialog-create";
    internal const string ContentKey = "presets-dialog-content";
    internal const string HeaderKey = "presets-dialog-header";
    internal const string ConfirmKey = "presets-dialog-confirm";
    internal const string LeaveKey = "presets-dialog-leave";
    internal const string FormKey = "presets-dialog-form";
    internal const string BoundConfirmKey = "presets-dialog-bound-confirm";

    private static readonly string[] Plans = ["Standard", "Pro", "Dedicated"];

    private int _plan;
    private int _scales;
    private int _checks;

    [RecursiveMember]
    public partial DemoGroupContext ActionsGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext DialogsGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext DetailsGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext QuoteGroup { get; set; } = new();

    /// <summary>A server's facts, rewritten in place when it is resized.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<KeyValueActionItem> ServerFacts { get; } =
    [
        UIDetails.Row("plan", "Plan", "Standard"),
        UIDetails.Row("region", "Region", "eu-west"),
        UIDetails.Row("price", "Each month", "€18")
    ];

    /// <summary>A release's badges: its environment and its replicas, the second rewritten on each scale.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<BadgeItem> ReleaseBadges { get; } =
    [
        new BadgeItem { Id = "environment", BadgeText = "production", BadgeStyle = UIBadgeType.Success, IsContent = true },
        new BadgeItem { Id = "replicas", BadgeText = "4 replicas", BadgeStyle = UIBadgeType.Surface, IsContent = true }
    ];

    [RecursiveMember]
    public partial string ReleaseTitle { get; set; } = "panel · #212";

    [RecursiveMember]
    public partial string ReleaseLine { get; set; } = "Rolled out to eu-west at 12:04, 4 replicas healthy.";

    /// <summary>The panes sample: which server is open, and which pane a phone shows.</summary>
    [RecursiveMember]
    public partial string? OpenServer { get; set; }

    [RecursiveMember]
    public partial string OpenServerLine { get; set; } = string.Empty;

    /// <summary>The panes sample's state: which side is in front, and whether a server is open.</summary>
    [RecursiveMember]
    public partial UIPanesState ServerPanes { get; set; } = new();

    /// <summary>The sums under a summary, which the controller keeps.</summary>
    [RecursiveMember]
    public partial string SubtotalLine { get; set; } = "€108.00";

    [RecursiveMember]
    public partial string VatLine { get; set; } = "€20.41";

    [RecursiveMember]
    public partial string TotalLine { get; set; } = "€128.41";

    /// <summary>The bound confirmation's words, naming the thing it is about.</summary>
    [RecursiveMember]
    public partial string ArchiveQuestion { get; set; } = "api-eu-west-1 and its 14 days of logs go to cold storage; it can be restored within a month.";

    [RecursiveMember]
    public partial string CheckTitle { get; set; } = "Not checked yet";

    [RecursiveMember]
    public partial string CheckBody { get; set; } = "bramble.example's certificate is read at a press.";

    [UICommand]
    public void RunAction(string entry)
        => ActionsGroup.LogEvent($"{entry} chosen from the menu");

    [UICommand]
    public UICommandResult OpenCreate()
        => Open(CreateKey);

    [UICommand]
    public UICommandResult OpenContent()
        => Open(ContentKey);

    [UICommand]
    public UICommandResult OpenHeader()
        => Open(HeaderKey);

    [UICommand]
    public UICommandResult OpenConfirm()
        => Open(ConfirmKey);

    [UICommand]
    public UICommandResult OpenLeave()
        => Open(LeaveKey);

    [UICommand]
    public UICommandResult OpenForm()
        => Open(FormKey);

    [UICommand]
    public UICommandResult OpenBoundConfirm()
        => Open(BoundConfirmKey);

    private UICommandResult Open(string key)
    {
        DialogsGroup.LogEvent($"{key} opened");
        return UICommandResult.Ok([new OpenDialogEffect(key)]);
    }

    /// <summary>The dialogs' committing button: logs and closes whichever is open.</summary>
    [UICommand]
    public UICommandResult SaveDialog(string key)
    {
        DialogsGroup.LogEvent($"{key} saved");
        return UICommandResult.Ok([new CloseDialogEffect(key)]);
    }

    [UICommand]
    public UICommandResult DeleteServer()
    {
        DialogsGroup.LogEvent("db-us-east-2 deleted");
        return UICommandResult.Ok([new CloseDialogEffect(ConfirmKey)]);
    }

    [UICommand]
    public UICommandResult SaveAndLeave()
    {
        DialogsGroup.LogEvent("saved, then left");
        return UICommandResult.Ok([new CloseDialogEffect(LeaveKey)]);
    }

    [UICommand]
    public UICommandResult LeaveWithoutSaving()
    {
        DialogsGroup.LogEvent("left without saving");
        return UICommandResult.Ok([new CloseDialogEffect(LeaveKey)]);
    }

    [UICommand]
    public UICommandResult ArchiveServer()
    {
        DialogsGroup.LogEvent("api-eu-west-1 archived");
        return UICommandResult.Ok([new CloseDialogEffect(BoundConfirmKey)]);
    }

    /// <summary>A server pressed in the panes sample: it opens beside the list, or on a phone in its place.</summary>
    [UICommand]
    public void ShowServer(string id)
    {
        OpenServer = id;
        OpenServerLine = $"{id} answers in 42 ms; its last restart was 41 days ago.";
        ServerPanes.ShowDetail();
    }

    /// <summary>The panes sample's Back, on a phone: the list again, the server closed.</summary>
    [UICommand]
    public void BackToServers()
    {
        OpenServer = null;
        ServerPanes.ShowNothing();
    }

    /// <summary>The ×, Escape and the safe answer, heard through the dialog's <c>OnClose</c>.</summary>
    [UICommand]
    public void DialogClosed()
        => DialogsGroup.LogEvent("closed without saving");

    [UICommand]
    public void Resize()
    {
        _plan = (_plan + 1) % Plans.Length;

        var plan = Plans[_plan];
        var price = plan switch
        {
            "Pro" => "€64",
            "Dedicated" => "€290",
            _ => "€18"
        };

        ((TextItem)ServerFacts[0].Value).Title = plan;
        ((TextItem)ServerFacts[2].Value).Title = price;
        DetailsGroup.LogEvent($"resized to {plan}");
    }

    [UICommand]
    public void Scale()
    {
        var replicas = 4 + (++_scales % 4 * 2);

        ReleaseBadges[1].BadgeText = $"{replicas.ToString(CultureInfo.InvariantCulture)} replicas";
        ReleaseTitle = $"panel · #{(212 + _scales).ToString(CultureInfo.InvariantCulture)}";
        ReleaseLine = $"Rolled out to eu-west, {replicas.ToString(CultureInfo.InvariantCulture)} replicas healthy.";
    }

    [UICommand]
    public void JumpToQuote()
        => QuoteGroup.LogEvent("jumped to the quoted message");

    [UICommand]
    public void DropQuote()
        => QuoteGroup.LogEvent("reply dropped");

    [UICommand]
    public void CheckCertificate()
    {
        _checks++;
        CheckTitle = "Certificate valid";
        CheckBody = $"Checked {_checks.ToString(CultureInfo.InvariantCulture)} {(_checks == 1 ? "time" : "times")}; bramble.example's certificate from Orvane Trust CA expires on 14 March 2027.";
    }
}
