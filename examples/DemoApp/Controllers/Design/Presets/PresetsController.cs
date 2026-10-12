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
