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
    internal const string BoundFormKey = "presets-dialog-bound-form";
    internal const string BoundCreateKey = "presets-dialog-bound-create";
    internal const string BoundContentKey = "presets-dialog-bound-content";

    private static readonly string[] Servers = ["api-eu-west-1", "db-us-east-2"];

    private static readonly string[] Plans = ["Standard", "Pro", "Dedicated"];

    private int _plan;
    private int _scales;
    private int _checks;
    private int _renames;
    private int _opened;

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

    [RecursiveMember]
    public partial string VatLabel { get; set; } = "VAT, 21 %";

    [RecursiveMember]
    public partial string TotalLabel { get; set; } = "Total a month";

    /// <summary>The words the bound twins on the presets page take: a label, an empty state, an outcome, a field's hint.</summary>
    [RecursiveMember]
    public partial string RegionLabel { get; set; } = "Region";

    [RecursiveMember]
    public partial string PhrasesTitle { get; set; } = "No phrases yet";

    [RecursiveMember]
    public partial string PhrasesLine { get; set; } = "A phrase is what a button sends.";

    [RecursiveMember]
    public partial string InviteTitle { get; set; } = "Check your inbox";

    [RecursiveMember]
    public partial string InviteLine { get; set; } = "The link went to robin@bramble.example and works for a day.";

    [RecursiveMember]
    public partial string ServerNameHint { get; set; } = "50 of 63 characters left.";

    /// <summary>The bound confirmation's words, naming the thing it is about.</summary>
    [RecursiveMember]
    public partial string ArchiveQuestion { get; set; } = "api-eu-west-1 and its 14 days of logs go to cold storage; it can be restored within a month.";

    /// <summary>The server the bound dialog and sheet are named by; each opening takes the next one.</summary>
    [RecursiveMember]
    public partial string ServerTitle { get; set; } = string.Empty;

    /// <summary>The bound ⋮'s entries, the controller's.</summary>
    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> ServerActions { get; } = [UIMenuItems.Open(), UIMenuItems.Refresh(), UIMenuItems.Delete()];

    [RecursiveMember]
    public partial string CheckTitle { get; set; } = "Not checked yet";

    [RecursiveMember]
    public partial string CheckBody { get; set; } = "bramble.example's certificate is read at a press.";

    /// <summary>The bound form's title and line, naming the server it renames; each opening takes the next one.</summary>
    [RecursiveMember]
    public partial string RenameTitle { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string RenameLine { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string? RenameName { get; set; }

    /// <summary>The bound header's name: the domain whose certificate the dialog shows.</summary>
    [RecursiveMember]
    public partial string CertificateDomain { get; set; } = "bramble.example";

    /// <summary>The bound icon button's glyph and name, Send or Stop.</summary>
    [RecursiveMember]
    public partial string SendIcon { get; set; } = UIStandardAction.Send.Glyph;

    [RecursiveMember]
    public partial UIPhrase SendTooltip { get; set; } = new(UIStandardAction.Send.Word);

    /// <summary>The news message, gone for good once dismissed.</summary>
    [RecursiveMember]
    public partial UIVisibility NewsVisibility { get; set; } = UIVisibility.Visible;

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

    /// <summary>The bound dialog, opened on the next server: its title names it, and names the dialog.</summary>
    [UICommand]
    public UICommandResult OpenBoundCreate()
    {
        ServerTitle = Servers[_opened++ % Servers.Length];
        return Open(BoundCreateKey);
    }

    /// <summary>The bound sheet, opened on the next server.</summary>
    [UICommand]
    public UICommandResult OpenBoundContent()
    {
        ServerTitle = Servers[_opened++ % Servers.Length];
        return Open(BoundContentKey);
    }

    /// <summary>The bound form, opened on the next server: its title and line name it.</summary>
    [UICommand]
    public UICommandResult OpenBoundForm()
    {
        var server = Servers[_renames++ % Servers.Length];

        RenameTitle = $"Rename {server}";
        RenameLine = $"{server}'s address and its backups keep the old name.";
        RenameName = server;

        return Open(BoundFormKey);
    }

    [UICommand]
    public UICommandResult RenameServer()
    {
        DialogsGroup.LogEvent($"renamed to {RenameName}");
        return UICommandResult.Ok([new CloseDialogEffect(BoundFormKey)]);
    }

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

    /// <summary>The bound icon button: Send turns into Stop and back, its glyph and name together.</summary>
    [UICommand]
    public void ToggleSend()
    {
        UIStandardAction next = SendIcon == UIStandardAction.Send.Glyph ? UIStandardAction.Stop : UIStandardAction.Send;

        SendIcon = next.Glyph;
        SendTooltip = new UIPhrase(next.Word);
    }

    /// <summary>The news message's ×: the page hid it already, and the controller keeps it hidden.</summary>
    [UICommand]
    public void DismissNews()
        => NewsVisibility = UIVisibility.Collapsed;

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
