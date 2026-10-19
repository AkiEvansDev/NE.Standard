using System.Collections.Generic;
using System.Runtime.CompilerServices;
using DemoApp.Controllers.Design.Presets;
using DemoApp.Views.Base;

namespace DemoApp.Views.Design.Presets;

/// <summary>
/// Every preset of <c>NE.Standard.UI.Extensions</c>, a section per preset and a tab per few families, as the Colors page is: each
/// sample built through the preset alone and its source a press away. The tabs' views list their sections; the sections live here.
/// </summary>
/// <remarks>
/// The family names, the samples and their notes are API names and sample data, shown as written: content, as a component page's
/// examples are. Only the header and the tabs' names are keys.
/// </remarks>
internal abstract class PresetsViewBase : DemoView
{
    protected override string ComponentRoute => "/design/presets";
    protected override string Header => "demo.design.presets.header";
    protected override string HeaderDescription => "demo.design.presets.description";

    protected abstract string CurrentTabUrl { get; }

    protected sealed override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChild(DemoUI.CreateTabs(
        [
            ("demo.presets.page", "/design/presets"),
            ("demo.presets.headers", "/design/presets/headers"),
            ("demo.presets.layout", "/design/presets/layout"),
            ("demo.presets.form", "/design/presets/form"),
            ("demo.presets.text", "/design/presets/text"),
            ("demo.presets.buttons", "/design/presets/buttons"),
            ("demo.presets.messages", "/design/presets/messages"),
        ], CurrentTabUrl));

        DrawPresetsContent(container);
    }

    protected abstract void DrawPresetsContent(WrapPanelComponent container);

    /// <summary>The dialogs the UIDialogs group opens, for the tab that holds it.</summary>
    protected static IReadOnlyList<UIDialog> CreateSampleDialogs()
    {
        UIDialog[] dialogs = CreatePresetDialogs().Dialogs;

        // Their words are sample data, as the page's samples are: content for the unkeyed report. Every preset's content is a stack.
        foreach (UIDialog dialog in dialogs)
        {
            if (dialog.Content is StackPanelComponent stack)
                _ = stack.AsContentTree();
        }

        return dialogs;
    }

    /// <summary>
    /// The dialogs the UIDialogs group opens, with their own source, so the group's code popup shows the dialogs rather than
    /// the buttons that open them.
    /// </summary>
    protected static (UIDialog[] Dialogs, string Code) CreatePresetDialogs()
        => Capture([
            UIDialogs.Create(PresetsController.CreateKey, "Rename api-eu-west-1", UILayout.Stack(16,
                new TextInputComponent().SetTitle("Name").SetValue("api-eu-west-1"),
                UIButtons.Pair(
                    UIDialogs.CloseButton(PresetsController.CreateKey),
                    UIButtons.Primary("Save").OnClickLiteral(nameof(PresetsController.SaveDialog), new KeyValuePair<string, object?>("key", PresetsController.CreateKey))
                )
            ), DemoIcons.Outline(DemoIcons.Edit), UIColumnWidth.Form)
            .OnClose(nameof(PresetsController.DialogClosed)),
            (UIDialogs.Create(PresetsController.ContentKey, "Resize db-us-east-2", UILayout.Stack(16,
                UIText.Paragraph("The database restarts once, for about a minute, while its disk moves to the larger plan."),
                UIForm.Row(
                    new TextInputComponent().SetTitle("From").SetValue("Pro").SetIsReadOnly(true),
                    new TextInputComponent().SetTitle("To").SetValue("Dedicated").SetIsReadOnly(true)
                ),
                UIButtons.Pair(
                    UIDialogs.CloseButton(PresetsController.ContentKey),
                    UIButtons.Primary("Resize").OnClickLiteral(nameof(PresetsController.SaveDialog), new KeyValuePair<string, object?>("key", PresetsController.ContentKey))
                )
            ), DemoIcons.Outline(DemoIcons.Server), UIColumnWidth.Reading) with { CloseOnBackdrop = false }).OnClose(nameof(PresetsController.DialogClosed)),
            UIDialogs.BoundCreate(PresetsController.BoundCreateKey, nameof(PresetsController.ServerTitle), UILayout.Stack(16,
                UIText.Paragraph("The title is the controller's: each opening names the next server, and the dialog is named by it."),
                UIButtons.Pair(
                    UIDialogs.CloseButton(PresetsController.BoundCreateKey, UIStandardAction.Close),
                    UIButtons.Primary(UIStandardAction.Open).OnClickLiteral(nameof(PresetsController.SaveDialog), new KeyValuePair<string, object?>("key", PresetsController.BoundCreateKey))
                )
            ), DemoIcons.Outline(DemoIcons.Server), UIColumnWidth.Form),
            new UIDialog
            {
                Key = PresetsController.BoundContentKey,
                TitleId = UIDialogs.TitleId(PresetsController.BoundContentKey),
                Placement = UIDialogPlacement.Right,
                Content = UIDialogs.BoundContent(PresetsController.BoundContentKey, nameof(PresetsController.ServerTitle), UILayout.Stack(16,
                    UIDetails.List(("Region", "eu-west"), ("Plan", "Pro"), ("Uptime", "41 days")),
                    UIText.Note("A sheet, laid out by the dialog itself, headed by the controller's name for it.")
                ), DemoIcons.Outline(DemoIcons.Server))
            }.OnClose(nameof(PresetsController.DialogClosed)),
            new UIDialog
            {
                Key = PresetsController.HeaderKey,
                TitleId = UIDialogs.TitleId(PresetsController.HeaderKey),
                Content = UILayout.Stack(16,
                    UIDialogs.BoundHeader(PresetsController.HeaderKey, nameof(PresetsController.CertificateDomain), DemoIcons.Outline(DemoIcons.Shield)),
                    UIDetails.List(("Issuer", "Orvane Trust CA"), ("Expires", "14 March 2027"), ("Status", "Valid")),
                    UIText.Note("The header alone, its name the controller's, over content laid out by the dialog itself.")
                )
            }.OnClose(nameof(PresetsController.DialogClosed)),
            UIDialogs.Confirm(PresetsController.ConfirmKey, "Delete db-us-east-2?", "Its snapshots go with it; the nightly backups stay in object-storage for 30 days.", "Delete", nameof(PresetsController.DeleteServer), cancelCommand: nameof(PresetsController.DialogClosed)),
            UIDialogs.Confirm(PresetsController.LeaveKey, "Save the changes to provision.sh?", "The script runs on every new server in eu-north from the next provisioning run.", "Save", nameof(PresetsController.SaveAndLeave),
                UIButtonType.Primary,
                nameof(PresetsController.DialogClosed),
                UIButtons.Ghost("Don't save").OnClick(nameof(PresetsController.LeaveWithoutSaving))
            ),
            UIDialogs.Form(PresetsController.FormKey, "Rename api-eu-west-1", "Its address and its backups keep the old name.",
                new TextInputComponent().SetTitle("Name").SetValue("api-eu-west-1").Required("A server needs a name.", UIValidationTrigger.Submit),
                UIButtons.Primary("Rename").OnClickLiteral(nameof(PresetsController.SaveDialog), new KeyValuePair<string, object?>("key", PresetsController.FormKey))
            )
            .OnClose(nameof(PresetsController.DialogClosed)),
            UIDialogs.BoundForm(PresetsController.BoundFormKey, nameof(PresetsController.RenameTitle), nameof(PresetsController.RenameLine),
                new TextInputComponent().SetTitle("Name").BindValue(nameof(PresetsController.RenameName)),
                UIButtons.Primary("Rename").OnClickShowingLoading(nameof(PresetsController.RenameServer))
            )
            .OnClose(nameof(PresetsController.DialogClosed)),
            UIDialogs.BoundConfirm(PresetsController.BoundConfirmKey, "Archive api-eu-west-1?", nameof(PresetsController.ArchiveQuestion), "Archive", nameof(PresetsController.ArchiveServer), UIButtonType.Primary, nameof(PresetsController.DialogClosed))
        ]);

    private static (UIDialog[] Dialogs, string Code) Capture(UIDialog[] dialogs, [CallerArgumentExpression(nameof(dialogs))] string code = "")
        => (dialogs, code);

    /// <summary>
    /// A family's heading under a rule, as <c>DemoUI.CreateSectionHeading</c> draws one but wrapping: a family's name and what it builds
    /// run past a phone's line. An API name, content rather than a key.
    /// </summary>
    protected static StackPanelComponent CreateHeading(string title)
        => UILayout.Stack(16,
                new SeparatorComponent(),
                UIText.Subtitle(title).SetTitleWrap(true)
            )
            .SetPlacement(1, 1, 24, 1)
            .AsContentTree();

    protected static ContainerComponent CreateHeaderGroup()
        => DemoUI.CreateExample("Header",
            UILayout.Stack(12,
                new SurfaceComponent()
                    .SetPadding(UIThickness.All(0, 0, 0, 16))
                    .SetContent(UIPage.Header("Servers", "Every server in the fleet, by region and role: 214 running, 3 degraded, 2 in maintenance.",
                        UIButtons.Ghost("Export", DemoIcons.Outline(DemoIcons.Download)),
                        UIButtons.Primary("New server", DemoIcons.Outline(DemoIcons.Add))
                    )),
                new SurfaceComponent()
                    .SetPadding(UIThickness.All(0, 0, 0, 16))
                    .SetContent(UIPage.Header("Invoices"))
            ),
            note: "The band a page is headed by, usually from CreateHeader(): this page's own is one, the language and theme switchers at its far end. From md the name is in the display role and the line runs to three lines; on a phone the name is a title's size and the line one line, cut. Without a description or a far end, the name alone.",
            columns: 24
        );

    protected static ContainerComponent CreateSectionGroup()
        => DemoUI.CreateExample("Section",
            UILayout.Stack(24,
                UIPage.Section("Recipient", "Who signs for the parcel at the door.",
                    UIForm.Row(
                        new TextInputComponent().SetTitle("First name").SetValue("Robin"),
                        new TextInputComponent().SetTitle("Last name").SetValue("Hale")
                    )
                ),
                UIPage.BoundSection(nameof(PresetsController.ReleaseTitle), nameof(PresetsController.ReleaseLine),
                    UIDetails.List(("Region", "eu-west"), ("Replicas", "4"))
                )
            ),
            note: "A titled part of a page: the heading, an optional muted line, and the content below it. The heading and its line sit closer to each other than to the content. BoundSection, the second, takes the controller's words, drawn as written."
        );

    protected static ContainerComponent CreateLabelledGroup()
        => DemoUI.CreateExample("Labelled",
            UILayout.Row(32,
                UIPage.Labelled("Monthly revenue", UIText.Title("€68.9k")),
                UIPage.Labelled("Servers", UIText.Title("214")),
                UIPage.Labelled("Region", new BadgeComponent().SetType(UIBadgeType.Surface).SetText("eu-west"))
            ),
            note: "A component under an overline label: a value, a sample, a control with no title of its own. The label keeps one line; wrap: true lets a label that is a sentence run on."
        );

    protected static ContainerComponent CreateCardGroup()
        => DemoUI.CreateExample("Card",
            UICard.Create("api-eu-west-1", "Pro · 4 vCPU · 16 GB · 240 GB, running for 41 days in Amsterdam since the last restart.",
                UIDetails.List(("CPU", "42 %"), ("Memory", "61 %"), ("Requests a minute", "1,280")),
                DemoIcons.Outline(DemoIcons.Server)
            ),
            note: "A card with its name, an optional line and an optional icon in the default header, and one component as its content. The line is prose and wraps; the name keeps one line."
        );

    protected static ContainerComponent CreateBannerGroup()
        => DemoUI.CreateExample("Banner",
            new SurfaceComponent()
                .SetPadding(UIThickness.Uniform(0))
                .SetContent(UILayout.Stack(0,
                    UIPage.Banner(UIMessage.Warning("Read-only until 18:00 UTC", "The database is moving to a larger server.", dismissible: true)),
                    UIText.Note("The page's content starts here, its edge where the banner's mark stands.").SetMargin(UIThickness.All(24, 16, 24, 16))
                )
            ),
            note: "A UIMessage laid across the top of the content: edge to edge, square, a rule under it, its mark in line with the header's name. The content's first child, outside its padding."
        );

    protected static ContainerComponent CreateLeadingHeaderGroup()
        => DemoUI.CreateExample("Header with a leading action",
            new SurfaceComponent()
                .SetPadding(UIThickness.All(0, 0, 0, 16))
                .SetContent(UIPage.Header(
                    UIIconButtons.Back().InteractOn(EventNames.Click, new NavigateBackEffect("/")),
                    "api-eu-north-1",
                    "Pro · 4 vCPU · 16 GB in Stockholm, running for 12 days since the last restart.",
                    UIIconButtons.Edit(),
                    UIIconButtons.Delete()
                )),
            note: "A page reached from another leads its header with Back: the action before the name, its glyph on the content's edge, the name and the line after it. NavigateBackEffect is the browser's Back where a page of this site stands behind, the fallback address where none does; it runs in the press, with no round trip. UIPage.BoundHeader binds the name and the line to the controller.",
            columns: 24
        );

    protected static ContainerComponent CreatePaneHeaderGroup()
        => DemoUI.CreateExample("Header for a pane",
            new SurfaceComponent()
                .SetPadding(UIThickness.Uniform(8))
                .SetContent(UIPage.Header(
                    UIHeaderSize.Pane,
                    UILayout.Row(4,
                        UIIconButtons.Back().ShownBelow(UIResponsiveTier.Md),
                        new ImageComponent().SetShape(UIImageShape.Circle).SetAltText("Avatar").SetWidth(UILayoutLength.Absolute(32)).SetVerticalAlignment(UIAlignment.Center)
                    ),
                    "Meri Tanaka, the nightly build's owner",
                    "Not saved",
                    UIIconButtons.Search(),
                    UIIconButtons.More([UIMenuItems.Rename(), UIMenuItems.Share(), UIMenuItems.Delete()])
                        .OnItemClickWithItemKey(nameof(PresetsController.RunAction), "entry")
                )),
            note: "UIHeaderSize.Pane: the title row of a pane beside a list or a tree — a conversation's, an open note's. The name one line in the subtitle role, cut with its whole words as its tooltip; the line a muted caption beside it; the far end on the same row at every width; no edge of its own. Back is shown below the medium width only (ShownBelow), where the list is not beside it; a round picture with no source shows the person glyph.",
            columns: 24
        );

    protected static ContainerComponent CreateFoldGroup()
        => DemoUI.CreateExample("Fold",
            UILayout.Stack(12,
                UIPage.Fold("Health check", true,
                    new TextInputComponent().SetTitle("Probe path").SetValue("/healthz"),
                    new NumberInputComponent().SetTitle("Every, in seconds").SetValue(30)
                ),
                UIPage.Fold("Firewall rules", false,
                    UIDetails.List(("22/tcp", "Staff VPN only"), ("443/tcp", "Anyone"), ("5432/tcp", "eu-west servers"))
                )
            ),
            note: "A part folded under its name, the collapsible sibling of Section: the quiet expander — a muted caption with the chevron after it, no card — over the content in a stack, open or folded to begin with."
        );

    protected static ContainerComponent CreateBoundHeaderGroup()
        => DemoUI.CreateExample("BoundHeader",
            new SurfaceComponent()
                .SetPadding(UIThickness.All(0, 0, 0, 16))
                .SetContent(UIPage.BoundHeader(null, nameof(PresetsController.ReleaseTitle), nameof(PresetsController.ReleaseLine), UIIconButtons.Open())),
            note: "The band with a name and a line the controller holds — a note's name, a release's status — led by an action where one is given. Scale rewrites both.",
            controlsBelow: true,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Scale"] = nameof(PresetsController.Scale)
            })
        );

    protected static ContainerComponent CreateHeadingGroup()
        => DemoUI.CreateExample("Heading, and Section under it",
            UILayout.Stack(24,
                UIPage.Section(
                    UIPage.Heading("Firewall rules", "Applied to every server in eu-west within a minute.", UIIconButtons.Add(), UIIconButtons.More([UIMenuItems.Download(), UIMenuItems.Share()])),
                    UIDetails.List(("22/tcp", "Staff VPN only"), ("443/tcp", "Anyone"))
                ),
                UIPage.Section(
                    UIPage.BoundHeading(nameof(PresetsController.ReleaseTitle), nameof(PresetsController.ReleaseLine), UIIconButtons.Refresh().OnClick(nameof(PresetsController.Scale))),
                    UIPage.BoundLabelled(nameof(PresetsController.RegionLabel), UIText.Body("eu-north"))
                )
            ),
            note: "A section's heading with things at its far end — the + that adds to the list under it, a menu — the title taking the rest of the row, the far end on its line and the muted line under both. Section(heading, content) stands it over the content as Section(title, line, content) does; BoundHeading and BoundLabelled, the second, take the controller's words, which its refresh rewrites."
        );

    protected static ContainerComponent CreateStripGroup()
        => DemoUI.CreateExample("Header for a strip",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetPadding(UIThickness.All(8, 8, 8, 12))
                .SetContent(UILayout.Stack(4,
                    UIPage.Header(UIHeaderSize.Strip, null, "Explorer", null, UIIconButtons.New(), UIIconButtons.Refresh()),
                    new TreeComponent().SetItems([new TreeNode { Id = "incidents", Title = "incidents" }, new TreeNode { Id = "checks", Title = "checks" }])
                )),
            note: "UIHeaderSize.Strip: a panel's caption over the list or the tree in it — an explorer's. The name a muted label, set in by a list row's 8 px so it stands over a list's words, and over a tree's chevrons as here; the far end's icon buttons on its row, small unless their size is said."
        );

    protected static ContainerComponent CreateBandGroup()
        => DemoUI.CreateExample("Band",
            UIPage.Band(UILayout.Ends(UIText.Body("Was this release note useful?"), UIButtons.Outline("Yes"), UIButtons.Ghost("Not really"))),
            note: "A band across the content in the brand's faint tint, 16 px in and 12 down: the filters over a list, the question at an article's foot."
        );

    protected static ContainerComponent CreateEmptyGroup()
        => DemoUI.CreateExample("Empty",
            UILayout.Stack(12,
                EmptyRoom(UIPage.Empty(DemoIcons.Outline(DemoIcons.Mail), "Pick a message", "It opens here, and stays open while you narrow the list.", UIButtons.Outline("New message"))),
                EmptyRoom(UIPage.BoundEmpty(null, nameof(PresetsController.PhrasesTitle), nameof(PresetsController.PhrasesLine), UIButtons.Primary("Add a phrase"), UIButtons.Ghost("Import")))
            ),
            note: "Where something would be and nothing is yet: the list's own empty state (DefaultEmptyTemplate) — the brand's icon where one is given, words alone where not, the title, the caption — the ways on in a row under it, each as wide as it is, in the middle of the room it is given, and running on past its foot where the room is shorter. A pane's placeholder in UILayout.Panes; BoundEmpty, the second, takes the controller's words."
        );

    // Each state in a room of its own, at least as tall as the sample wants and taller where the words wrap on a phone.
    private static SurfaceComponent EmptyRoom(ContainerComponent empty)
        => new SurfaceComponent()
            .SetSurface(UISurfaceStyle.Background)
            .SetMinHeight(UILayoutLength.Absolute(180))
            .SetContent(empty);

    protected static ContainerComponent CreateOutcomeGroup()
        => DemoUI.CreateExample("Outcome",
            UILayout.Stack(16,
                UIPage.Outcome(null, UIMessageSeverity.Success, "Order placed", "Six servers on Standard in eu-north start within two minutes; the invoice went to billing@bramble.example.",
                    UIButtons.Ghost("Back to the catalogue"),
                    UIButtons.Primary("Open the servers")
                ),
                UIPage.BoundOutcome(DemoIcons.Outline(DemoIcons.Mail), UIMessageSeverity.Info, nameof(PresetsController.InviteTitle), nameof(PresetsController.InviteLine),
                    UIButtons.Ghost("Send another")
                )
            ),
            note: "What came of a press, in place of the form it ends: the tone's mark (or one of your own) before the title, the line, the ways on at the far end. Read out as it replaces the form; on an empty page, UICard.Centered holds it. BoundOutcome, the second, takes the controller's words, drawn as written."
        );

    protected static ContainerComponent CreateStatusGroup()
        => DemoUI.CreateExample("Status",
            UIPage.Status(DemoIcons.Outline(DemoIcons.Lock), UIMessageSeverity.Warning, "Not for this account", "The billing pages need the Finance role, which this account does not have.",
                UIButtons.Ghost("Back to the dashboard"),
                UIButtons.Primary("Sign in as someone else")
            ),
            note: "A page's state standing in for all of it — not found, refused, failed: the tone's mark (or one of your own) on a faint disc, the centred words, the ways on under them, the safe one first. The framework's own not-found and error pages are drawn alike."
        );

    protected static ContainerComponent CreateColumnGroup()
        => DemoUI.CreateExample("Column",
            UILayout.Stack(16,
                UIPage.Column(UIColumnWidth.Reading, UILayout.Stack(12,
                    UIText.Title("Rolling out without a window"),
                    UIText.Paragraph("The content kept to a column of a fixed width from the content's edge, however wide the page: Reading (720 px, an article, a settings page), Form (440 px, a short form, a card alone on a page) or Wide (1080 px, a form beside its summary). One of three, never a width of the page's own.")
                )),
                UIPage.Header("Release notes", "Version 2.4, out on Thursday.").InColumn(UIColumnWidth.Form),
                UIPage.Column(UIColumnWidth.Form, UIText.Paragraph("Centred, the column stands in the middle; a header band over it takes the column's width with its own padding outside, so their edges meet."), centered: true)
            ),
            note: "Three widths, so two pages of the same kind stand alike; centered: true and InColumn for a column in the middle and the band over it.",
            columns: 24
        );

    protected static ContainerComponent CreateCenteredGroup()
        => DemoUI.CreateExample("Centered",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Background)
                .SetPadding(UIThickness.All(16, 0, 16, 0))
                .SetContent(UICard.Centered(UICard.Create("Sign in", null, UILayout.Stack(16,
                    new TextInputComponent().SetTitle("User name").SetAppearance(UIInputAppearance.Tonal),
                    UIButtons.Primary("Sign in").SetHorizontalAlignment(UIAlignment.Stretch)
                ), DemoIcons.Outline(DemoIcons.Lock)))),
            note: "One card alone on an otherwise empty page — a sign-in, an outcome: a form's column (440 px, the whole width on a phone) in the middle, 24 px under the top on a phone and 96 px from md."
        );

    protected static ContainerComponent CreateFieldGroup()
        => DemoUI.CreateExample("Field",
            UILayout.Stack(16,
                UIForm.Field(new TextAreaComponent()
                    .SetTitle("Invoice note")
                    .SetMaxLength(200)
                    .SetValue("Bramble Studio · PO 4471"),
                    "Printed on every invoice, two hundred characters at most."
                ),
                UIForm.BoundField(new TextInputComponent().SetTitle("Server name").SetValue("api-eu-west-1"), nameof(PresetsController.ServerNameHint))
            ),
            note: "The input with a muted, wrapping hint under it: what may be typed, what it is for. The hint may be left out, be a paragraph of your own, or the controller's words, as the second's (BoundField)."
        );

    protected static ContainerComponent CreateFormRowGroup()
        => DemoUI.CreateExample("Row",
            UILayout.Stack(16,
                UIForm.Row(
                    new TextInputComponent().SetTitle("City").SetValue("Amsterdam"),
                    new TextInputComponent().SetTitle("Postcode").SetValue("1017 CT")
                ),
                UIForm.Row(12,
                    new TextInputComponent().SetTitle("vCPU").SetValue("4"),
                    new TextInputComponent().SetTitle("Memory").SetValue("16 GB"),
                    new TextInputComponent().SetTitle("Disk").SetValue("240 GB")
                ),
                UIForm.Row(
                    new TextInputComponent().SetTitle("Port").SetValue("5432"),
                    UIForm.Field(new SwitchComponent().SetTitle("Use TLS"), "Encrypts the connection.")
                ),
                UIForm.Row(
                    UIPage.Labelled("Plan", new BadgeComponent().SetType(UIBadgeType.Surface).SetText("Standard").SetHorizontalAlignment(UIAlignment.Start)),
                    UILayout.Ends(new SelectComponent().SetTitle("Template").SetItems([new OptionItem { Id = "web", Title = "Web server" }]), UIIconButtons.New(), UIIconButtons.Copy())
                )
            ),
            note: "Fields side by side in equal columns, their tops level, 16 apart unless the spacing says otherwise; two, three, four or six of them. Below md they stand one under another."
        );

    protected static ContainerComponent CreateSearchGroup()
        => DemoUI.CreateExample("SetSearch",
            UIForm.Row(
                new TextInputComponent().SetSearch("Search servers"),
                new TextInputComponent().SetSearch()
            ),
            note: "A text input made a search box: the search type, the search glyph before the text, a clear button, and the placeholder given or the framework's word \"Search\".",
            columns: 24
        );

    protected static ContainerComponent CreateStackGroup()
        => DemoUI.CreateExample("Stack and Row",
            UILayout.Stack(8,
                UIText.Subtitle("db-us-east-2"),
                UIText.Note("Stack: children down a column, the same spacing between each pair. Row: along a line, wrapping when it is too narrow."),
                UILayout.Row(8,
                    new BadgeComponent().SetType(UIBadgeType.Success).SetText("Running"),
                    new BadgeComponent().SetType(UIBadgeType.Primary).SetText("Dedicated"),
                    new BadgeComponent().SetType(UIBadgeType.Surface).SetText("us-east"),
                    new BadgeComponent().SetType(UIBadgeType.Surface).SetText("16 vCPU · 64 GB")
                )
            ),
            note: "The spacing comes first, so a stack with children always names it."
        );

    protected static ContainerComponent CreateColumnsGroup()
        => DemoUI.CreateExample("Columns",
            UILayout.Stack(24,
                UILayout.Columns(16,
                    UIPage.Labelled("CPU", UIText.Title("42 %")),
                    UIPage.Labelled("Memory", UIText.Title("61 %")),
                    UIPage.Labelled("Disk", UIText.Title("78 %"))
                ),
                UILayout.Columns(16, UIAlignment.Start,
                    UIPage.Labelled("Follow-up", UIText.Paragraph("Move the slow query off the primary, and alert at 85 % disk rather than 95 %.")),
                    UIPage.Labelled("Owner", UIText.Body("Grace Kim"))
                )
            ),
            note: "Equal columns, side by side from md (two or three) or xl (four or six). The second overload stands every cell at one alignment: Start holds a short cell at the top beside a tall one."
        );

    protected static ContainerComponent CreateSplitGroup()
        => DemoUI.CreateExample("Split",
            UILayout.Split(
                UIPage.Section("Subscription SUB-000015", "Copperline Retail · 6 servers on Standard in eu-north.",
                    UIDetails.List(("Plan", "Standard"), ("Servers", "6"), ("Billed", "Directly"))
                ),
                UICard.Create("Summary", "VAT at 21 % on the subtotal after the discount.",
                    UIDetails.List(("Subtotal", "€108.00"), ("ORVANE10", "−€10.80"), ("Total", "€117.61"))
                ),
                sideSpan: 9
            ),
            note: "A main part with a side part to its right, the side taking sideSpan of the twenty-four columns; one under the other below xl.",
            columns: 24
        );

    protected static ContainerComponent CreateSidebarGroup()
        => DemoUI.CreateExample("Sidebar",
            UILayout.Sidebar(
                UIPage.Section("Regions", null,
                    UIText.Body("Europe West", "Amsterdam"),
                    UIText.Body("Europe Central", "Frankfurt"),
                    UIText.Body("US East", "Ashburn")
                ),
                UIPage.Section("Europe West", "Opened 2019 · 214 servers · 12 billing replicas.",
                    UIText.Paragraph("The largest region by revenue, and the one the panel itself runs in.")
                ),
                sideSpan: 6
            ),
            note: "The other way round: the side part first — a list, a tree, a filter rail — and the main part beside it.",
            columns: 24
        );

    protected static ContainerComponent CreateEndsGroup()
        => DemoUI.CreateExample("Ends",
            UILayout.Stack(16,
                UILayout.Ends(UIText.Body("Signed-in devices", "Three, the last in Lisbon an hour ago.").SetDescriptionColor(UIThemeColor.Muted), UIIconButtons.Refresh(), UIIconButtons.SignOut()),
                UILayout.Ends(UIText.Body("Nightly backups", "Kept for 14 days.").SetDescriptionColor(UIThemeColor.Muted), UIButtons.Ghost("Restore one")),
                UILayout.Ends(new SelectComponent().SetTitle("Document").SetItems([new OptionItem { Id = "terms", Title = "Terms of service" }]), UIIconButtons.New(), UIIconButtons.Copy()),
                UILayout.Row(12,
                    new SelectComponent().SetTitle("Status").SetItems([new OptionItem { Id = "any", Title = "Any" }]),
                    UIButtons.Ghost("Reset")
                )
            ),
            note: "Something at the start and things at the far end of one row: the end as wide as it is, the start the rest, never half and half. On a phone buttons with words stand under the start at the far end; icons keep the row. Beside a titled field the end stands level with its box, as a form row's control does, and so does a thing with no caption in a Row; the last icon's glyph and the last quiet words stand on the row's edge."
        );

    protected static ContainerComponent CreateBoardGroup()
        => DemoUI.CreateExample("Board",
            UILayout.Board(
                [
                    UICard.Create("Profile", null, UIText.Note("How you appear to the staff.")),
                    UICard.Create("Security", null, UIText.Note("What you sign in with."))
                ],
                [
                    UICard.Create("Notifications", null, UIText.Note("What reaches your mail, and when it stays quiet."))
                ]
            ),
            note: "Cards on two columns, each a stack read top to bottom, held by their tops, 16 px apart; one column under the other below xl, the start's first."
        );

    protected static ContainerComponent CreatePanesGroup()
        => DemoUI.CreateExample("Panes",
            UILayout.Stack(8,
                UIPage.Header(UIHeaderSize.Strip, null, "Servers", null, UIIconButtons.Refresh())
                    .InPanesList()
                    .BindVisibility($"{nameof(PresetsController.ServerPanes)}.{nameof(UIPanesState.ListVisibility)}"),
                UILayout.Panes(
                    new MenuComponent()
                        .SetItems(
                        [
                            new MenuItem { Id = "api-eu-west-1", Title = "api-eu-west-1", Icon = DemoIcons.Outline(DemoIcons.Server) },
                            new MenuItem { Id = "db-us-east-2", Title = "db-us-east-2", Icon = DemoIcons.Outline(DemoIcons.Server) },
                            new MenuItem { Id = "cache-eu-north-1", Title = "cache-eu-north-1", Icon = DemoIcons.Outline(DemoIcons.Server) }
                        ])
                        .OnItemClickWithItemKey(nameof(PresetsController.ShowServer)),
                    UILayout.Stack(12,
                        UIPage.BoundHeader(UIHeaderSize.Pane, UIIconButtons.Back().OnClick(nameof(PresetsController.BackToServers)).ShownBelow(UIResponsiveTier.Md), nameof(PresetsController.OpenServer)),
                        UIText.Paragraph().BindDescription(nameof(PresetsController.OpenServerLine))
                    ),
                    nameof(PresetsController.ServerPanes),
                    UIPage.Empty(DemoIcons.Outline(DemoIcons.Server), "Pick a server", "Its health opens here.")
                )
                .SetHeight(UILayoutLength.Absolute(220))
            ),
            note: "A list and the thing chosen in it: side by side from md, the list 280 px and 16 px of air (a bound splitter between them where given); below md one at a time, the detail in the list's place with its own Back. The controller holds a UIPanesState and moves it by ShowDetail, ShowList and ShowNothing; the placeholder is UIPage.Empty. The strip over them is the list's header, as wide as the list from md (InPanesList), shown while the list is.",
            columns: 24
        );

    protected static ContainerComponent CreatePanesVisibilityGroup()
        => DemoUI.CreateExample("Panes visibilities",
            UILayout.Stack(8,
                UIText.Body("The list").SetVisibility(UILayout.PanesListVisibility(detailInFront: true)),
                UIText.Body("The detail").SetVisibility(UILayout.PanesDetailVisibility(detailInFront: true)),
                UIText.Body("The placeholder").SetVisibility(UILayout.PanesPlaceholderVisibility(chosen: true))
            ),
            note: "PanesListVisibility, PanesDetailVisibility and PanesPlaceholderVisibility: the visibilities a UIPanesState holds, for a part of the page that follows a pane — a header over the list. Here the detail is in front and something is chosen: below md the detail alone shows, from md the list beside it, and the placeholder stays hidden."
        );

    protected static ContainerComponent CreateRolesGroup()
        => DemoUI.CreateExample("Display, Title, Subtitle, Body, Caption",
            UILayout.Stack(12,
                UIText.Display("Orvane Cloud"),
                UIText.Title("Servers", "214 running in five regions"),
                UIText.Subtitle("api-eu-west-1", "Pro · Europe West"),
                UIText.Body("Robin Hale", "Admin · on call this week"),
                UIText.Caption("Last check 12:04", "All 14 health checks green")
            ),
            note: "A TextComponent in each role, the description under the title. A heading keeps one line and ends in an ellipsis; SetTitleWrap(true) lets it wrap."
        );

    protected static ContainerComponent CreateProseGroup()
        => DemoUI.CreateExample("Label, Paragraph, Note",
            UILayout.Stack(8,
                UIText.Label("Incident · eu-west"),
                UIText.Paragraph("The API in Europe West answered slowly for 14 minutes while db-eu-west-2's disk was full. Writes queued and none were lost; the follow-ups move the slow query off the primary."),
                UIText.Note("Opened by Grace Kim at 09:12 UTC, closed at 09:26.")
            ),
            note: "Label is the muted overline a thing is labelled by; Paragraph is prose that wraps; Note a muted caption that wraps — the line that explains rather than names."
        );

    protected static ContainerComponent CreateBadgesGroup()
        => DemoUI.CreateExample("WithBadges",
            UILayout.Stack(16,
                UIText.WithBadges("billing · #481", [
                    new BadgeItem { BadgeText = "production", BadgeStyle = UIBadgeType.Success },
                    new BadgeItem { BadgeText = "12 of 12", BadgeIcon = DemoIcons.Outline(DemoIcons.Check) },
                    new BadgeItem { BadgeText = "eu-west", BadgeStyle = UIBadgeType.Surface }
                ], DemoIcons.Outline(DemoIcons.Server)),
                UIText.BoundWithBadges(nameof(PresetsController.ReleaseTitle), nameof(PresetsController.ReleaseBadges), icon: DemoIcons.Outline(DemoIcons.Replicas))
            ),
            note: "A title over its badges, a mark before both. The second binds its title and its badges to the controller: Scale rewrites both in place.",
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Scale"] = nameof(PresetsController.Scale)
            })
        );

    protected static ContainerComponent CreateRoleExtensionsGroup()
        => DemoUI.CreateExample("AsDisplay … AsOverline, Muted",
            UILayout.Stack(8,
                new TextComponent().SetTitle("€68.9k").AsDisplay(),
                new TextComponent().SetTitle("Revenue this month").AsTitle(),
                new TextComponent().SetTitle("Standard plan").AsSubtitle(),
                new TextComponent().SetTitle("26.4k from 1,466 seats").AsBody(),
                new TextComponent().SetTitle("Up 8 % on September").AsCaption().Muted(),
                new TextComponent().SetTitle("Plans' share").AsOverline()
            ),
            note: "The same roles on a text of your own — one bound rather than written. Muted puts both lines in the muted colour."
        );

    protected static ContainerComponent CreateQuoteGroup()
        => DemoUI.CreateExample("Quote",
            UILayout.Stack(12,
                UIText.Quote("Grace Kim", "Move the slow query off the primary before Friday's release.", clickCommand: nameof(PresetsController.JumpToQuote), closeCommand: nameof(PresetsController.DropQuote)),
                UIText.Quote("Editing", "Alert at 85 % disk rather than 95 %.", UIThemeColor.Accent),
                UIText.BoundQuote(nameof(PresetsController.ReleaseTitle), nameof(PresetsController.ReleaseLine)),
                UIText.Quote(UILayout.Stack(4,
                    UIText.Paragraph("Staging freezes on Wednesday at noon; the release window moves to Thursday."),
                    UIText.Caption("Release notes · 2.4")
                ))
            ),
            note: "A quote as a messenger draws a reply or an edit: a stroke in the accent, who in a caption, one muted line of the words. The first jumps at a press and drops at its ×, its glyph on the quote's end; the third is BoundQuote — Scale above rewrites it; the last quotes content of its own, in the neutral stroke a quotation inside text takes.",
            columns: 24,
            context: nameof(PresetsController.QuoteGroup)
        );

    protected static ContainerComponent CreatePersonGroup()
        => DemoUI.CreateExample("Person",
            UILayout.Row(32,
                UIText.Person(DemoImages.Avatar, "Robin Hale", "Admin · on call this week"),
                UIText.Person(null, "Mika Laine", "Viewer", UIPersonSize.Small),
                UIText.Person(DemoImages.Avatar, UILayout.Row(8, UIText.Body("Grace Kim"), new BadgeComponent().SetType(UIBadgeType.Success).SetText("On call")))
            ),
            note: "A person as a list's row or a byline shows one: the round picture (the person glyph where there is none), the name in the body's role and a muted caption beside it. Medium is 40 px, Small 32; BoundPerson takes the paths, as a chat's row does, and an overload takes words of your own.",
            columns: 24
        );

    protected static ContainerComponent CreateButtonTypesGroup()
        => DemoUI.CreateExample("Primary … Link: the six types",
            UILayout.Stack(12,
                UILayout.Row(8,
                    UIButtons.Primary("Deploy"),
                    UIButtons.Accent("Upgrade", DemoIcons.Outline(DemoIcons.Bolt)),
                    UIButtons.Outline("Export", DemoIcons.Outline(DemoIcons.Download)),
                    UIButtons.Ghost("Not now"),
                    UIButtons.Danger("Delete server", DemoIcons.Outline(DemoIcons.FolderRemove)),
                    UIButtons.Link("View plan")
                ),
                UILayout.Row(8,
                    UIButtons.Primary(UIStandardAction.Save),
                    UIButtons.Outline(UIStandardAction.Download, glyph: true),
                    UIButtons.Ghost(UIStandardAction.Cancel),
                    UIButtons.Ghost(UIStandardAction.Delete, glyph: true)
                )
            ),
            note: "A ButtonComponent of that type, with an optional icon; or a standard action in the framework's words and, where asked, its glyph — Delete in the danger colour, filled on a filled type."
        );

    protected static ContainerComponent CreatePairGroup()
        => DemoUI.CreateExample("Pair",
            UIButtons.Pair(
                UIButtons.Ghost("Keep it"),
                UIButtons.Danger("Delete db-us-east-2")
            ),
            note: "The pair at a form's foot: the safe answer first, the committing one last, both pushed to the far edge.",
            columns: 24
        );

    protected static ContainerComponent CreateToolbarGroup()
        => DemoUI.CreateExample("Icon and Toolbar",
            UILayout.Stack(12,
                UIButtons.Toolbar(
                    UIButtons.Icon(DemoIcons.Outline(DemoIcons.Undo), "Undo"),
                    UIButtons.Icon(DemoIcons.Outline(DemoIcons.Refresh), "Refresh"),
                    UIButtons.Icon(DemoIcons.Outline(DemoIcons.Filter), "Filter"),
                    UIButtons.Icon(DemoIcons.Outline(DemoIcons.MoreVertical), "More"),
                    UIButtons.Icon(UIStandardAction.Send.Glyph, UIStandardAction.Send.Word)
                        .BindIcon(nameof(PresetsController.SendIcon))
                        .BindTooltip(nameof(PresetsController.SendTooltip))
                        .OnClick(nameof(PresetsController.ToggleSend))
                ),
                UIButtons.Toolbar(
                    UIButtons.Ghost("Start"),
                    UIButtons.Ghost("Stop"),
                    UIButtons.Ghost("Restart", DemoIcons.Outline(DemoIcons.Refresh))
                )
            ),
            note: "Icon: an icon-only ghost button whose tooltip is its only name, so it is required; a glyph and a name the controller holds are bound on the button it returns, the written ones their fallback — the last one turns Send into Stop and back. Toolbar: a row of buttons with a toolbar's tight spacing, from the near edge, the first one's glyph or quiet words on it."
        );

    protected static ContainerComponent CreateIconButtonsGroup()
        => DemoUI.CreateExample("UIIconButtons in a toolbar",
            UIButtons.Toolbar(
                UIIconButtons.Pin(),
                UIIconButtons.Unpin(),
                UIIconButtons.Open(),
                UIIconButtons.Edit(),
                UIIconButtons.Copy(),
                UIIconButtons.Save(),
                UIIconButtons.Done(),
                UIIconButtons.Cancel(),
                UIIconButtons.Close(),
                UIIconButtons.Back(),
                UIIconButtons.New(),
                UIIconButtons.Refresh(),
                UIIconButtons.Search(),
                UIIconButtons.Filter(),
                UIIconButtons.Settings(),
                UIIconButtons.Share(),
                UIIconButtons.Download(),
                UIIconButtons.Upload(),
                UIIconButtons.Rename(),
                UIIconButtons.Add(),
                UIIconButtons.Remove(),
                UIIconButtons.Send(),
                UIIconButtons.Attach(),
                UIIconButtons.Menu(),
                UIIconButtons.Stop(),
                UIIconButtons.Undo(),
                UIIconButtons.Redo(),
                UIIconButtons.SignOut(),
                UIIconButtons.Delete(),
                UIIconButtons.More([UIMenuItems.Rename(), UIMenuItems.Share(), UIMenuItems.Delete()])
                    .OnItemClickWithItemKey(nameof(PresetsController.RunAction), "entry"),
                UIIconButtons.More()
                    .BindItems(nameof(PresetsController.ServerActions))
                    .OnItemClickWithItemKey(nameof(PresetsController.RunAction), "entry")
            ),
            note: "Every standard action as an icon button: a ghost button named by its tooltip, in the framework's words; Delete's glyph in the danger colour. Give each its command with OnClick. Done ends an edit made in place with a check, where Save writes a document out; Back takes a NavigateBackEffect or a command of its own. The last ⋮ is More() over entries the controller holds (BindItems)."
        );

    protected static ContainerComponent CreateMenuItemsGroup()
        => DemoUI.CreateExample("UIMenuItems in a context menu",
            new CardComponent()
                .SetContextMenu(new MenuComponent()
                    .SetItems(
                    [
                        UIMenuItems.Pin(),
                        UIMenuItems.Unpin(),
                        UIMenuItems.Open(),
                        UIMenuItems.Edit(),
                        UIMenuItems.Copy(),
                        UIMenuItems.Save(),
                        UIMenuItems.Done(),
                        UIMenuItems.Cancel(),
                        UIMenuItems.Close(),
                        UIMenuItems.Back(),
                        UIMenuItems.New(),
                        UIMenuItems.Refresh(),
                        UIMenuItems.Search(),
                        UIMenuItems.Filter(),
                        UIMenuItems.Settings(),
                        UIMenuItems.Share(),
                        UIMenuItems.Download(),
                        UIMenuItems.Upload(),
                        UIMenuItems.Rename(),
                        UIMenuItems.Add(),
                        UIMenuItems.Remove(),
                        UIMenuItems.Send(),
                        UIMenuItems.Attach(),
                        UIMenuItems.Menu(),
                        UIMenuItems.Stop(),
                        UIMenuItems.Undo(),
                        UIMenuItems.Redo(),
                        UIMenuItems.SignOut(),
                        UIMenuItems.Delete(),
                        UIMenuItems.More([UIMenuItems.Share(), UIMenuItems.Download()])
                    ])
                    .OnItemClickWithItemKey(nameof(PresetsController.RunAction), "entry")
                )
                .SetContent(new ParagraphComponent()
                    .SetTitle("Right-click or long-press")
                    .SetDescription("Every standard action as a menu entry, the same names and glyphs as the buttons beside; an entry's id is its action's name unless given.")
                ),
            note: "The menu's click reports the entry's id; Delete is drawn in the danger colour.",
            context: nameof(PresetsController.ActionsGroup)
        );

    protected static ContainerComponent CreateDialogsGroup()
        => DemoUI.CreateExample("Create, Content, Header, Confirm, Form",
            UILayout.Row(8,
                UIButtons.Ghost("UIDialogs.Create", DemoIcons.Outline(DemoIcons.Edit)).OnClick(nameof(PresetsController.OpenCreate)),
                UIButtons.Ghost("Create … with { }", DemoIcons.Outline(DemoIcons.Server)).OnClick(nameof(PresetsController.OpenContent)),
                UIButtons.Ghost("UIDialogs.BoundCreate", DemoIcons.Outline(DemoIcons.Server)).OnClick(nameof(PresetsController.OpenBoundCreate)),
                UIButtons.Ghost("UIDialogs.BoundContent", DemoIcons.Outline(DemoIcons.Server)).OnClick(nameof(PresetsController.OpenBoundContent)),
                UIButtons.Ghost("UIDialogs.BoundHeader", DemoIcons.Outline(DemoIcons.Shield)).OnClick(nameof(PresetsController.OpenHeader)),
                UIButtons.Ghost("UIDialogs.Confirm", DemoIcons.Outline(DemoIcons.Alert)).OnClick(nameof(PresetsController.OpenConfirm)),
                UIButtons.Ghost("Confirm with a middle answer", DemoIcons.Outline(DemoIcons.FileText)).OnClick(nameof(PresetsController.OpenLeave)),
                UIButtons.Ghost("UIDialogs.BoundConfirm", DemoIcons.Outline(DemoIcons.Folder)).OnClick(nameof(PresetsController.OpenBoundConfirm)),
                UIButtons.Ghost("UIDialogs.Form", DemoIcons.Outline(DemoIcons.Edit)).OnClick(nameof(PresetsController.OpenForm)),
                UIButtons.Ghost("UIDialogs.BoundForm", DemoIcons.Outline(DemoIcons.Server)).OnClick(nameof(PresetsController.OpenBoundForm))
            ),
            note: "Create is the whole dialog, named by its title, its content in a named column (UIColumnWidth), the rest set with `with { … }` — the second keeps its fields from a press on the backdrop; BoundCreate takes its title from the controller and is still named by it. Content, BoundContent and Header, BoundHeader are the parts, for a dialog laid out or set otherwise — a sheet, a certificate; the header's × closes the dialog as Escape does and raises OnClose. Confirm asks a question answered by Cancel and one committing button, a middle answer between where given; BoundConfirm takes the words under its question from the controller, kept as written. Form is a form: its title, line, fields — joined to the dialog's form, so Enter presses its primary and the press judges their rules first — and the standard Cancel beside its primary, a form's column wide, closed by Cancel or Escape and not by the backdrop; BoundForm takes its title and line from the controller. CloseButton is the Cancel, Close or Done that closes a dialog as the viewer does. The code is the dialogs as the view declares them.",
            columns: 24,
            context: nameof(PresetsController.DialogsGroup),
            code: CreatePresetDialogs().Code
        );

    protected static ContainerComponent CreateSeverityGroup()
        => DemoUI.CreateExample("Info, Success, Warning, Danger",
            UILayout.Stack(12,
                UIMessage.Info(null, "Saved drafts are kept for 30 days, then deleted."),
                UIMessage.Success("Payment received", "INV-2026-0412 is paid; the receipt went to billing@bramble.example."),
                UIMessage.Warning("Your trial ends in 3 days", "Billing starts on the 14th.", UIButtons.Outline("Upgrade")),
                UIMessage.Danger("2 errors in the form below", "The postcode and the VAT number were not accepted.", dismissible: true),
                UIMessage.Info("Dark mode is here", "Pick it under Settings, or keep following the system.", dismissCommand: nameof(PresetsController.DismissNews))
                    .BindVisibility(nameof(PresetsController.NewsVisibility))
            ),
            note: "A title, a body or both; an optional action at the bottom end and an optional ×, which hides the message on the page at once and, given a dismiss command, runs it — the last one is gone for good, the controller holding its Visibility. Info and Success are a status to a screen reader, Warning and Danger an alert."
        );

    protected static ContainerComponent CreateMessageCreateGroup()
        => DemoUI.CreateExample("Create",
            UILayout.Stack(12,
                UIMessage.Create(UIMessageSeverity.Info, "Maintenance on Sunday", "eu-central's databases restart between 02:00 and 03:00 UTC.", icon: DemoIcons.Outline(DemoIcons.Calendar)),
                UIMessage.BoundCreate(UIMessageSeverity.Success,
                    nameof(PresetsController.CheckTitle),
                    nameof(PresetsController.CheckBody),
                    action: UIButtons.Outline("Check now").OnClick(nameof(PresetsController.CheckCertificate))
                ),
                UIMessage.Create(UIMessageSeverity.Warning, null, new ParagraphComponent().SetDescription("Billing moves to the 14th of each month: **nothing to do**, the [plan page](/design/presets) says the rest."))
            ),
            note: "The severity as an argument and an icon in place of its mark; BoundCreate takes the title and the body from the controller, as its own words drawn plain, for words that change — Check now rewrites them; a body beyond words — a link, an emphasis — is a paragraph of your own."
        );

    protected static ContainerComponent CreateDetailsListGroup()
        => DemoUI.CreateExample("List",
            UIDetails.List(("Plan", "Pro"), ("Region", "Europe West"), ("Seats", "12"), ("Billed", "Monthly")),
            note: "A key-value list without the action column or a border of its own — an order's summary, a record's facts — for a card or a surface to hold."
        );

    protected static ContainerComponent CreateDetailsRowGroup()
        => DemoUI.CreateExample("Row, bound",
            UIDetails.List().BindItems(nameof(PresetsController.ServerFacts)),
            note: "For values that change, the items bound and each row built with UIDetails.Row on the controller: Resize rewrites the plan and the price in place.",
            context: nameof(PresetsController.DetailsGroup),
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Resize"] = nameof(PresetsController.Resize)
            })
        );

    protected static ContainerComponent CreateSumsGroup()
        => DemoUI.CreateExample("Amount and Total",
            UILayout.Stack(8,
                UIDetails.Amount("Subtotal", nameof(PresetsController.SubtotalLine)),
                UIDetails.BoundAmount(nameof(PresetsController.VatLabel), nameof(PresetsController.VatLine)),
                new SeparatorComponent(),
                UIDetails.BoundTotal(nameof(PresetsController.TotalLabel), nameof(PresetsController.TotalLine))
            ),
            note: "The sums over a total, bound to what the controller keeps: the name muted at the start, the amount at the far end as wide as it is, one line at every width; the total both in the subtitle role. BoundAmount and BoundTotal take the name from the controller too, as the VAT's rate and the total's here."
        );

    protected static ContainerComponent CreateShownGroup()
        => DemoUI.CreateExample("ShownWhen, HiddenWhen",
            UILayout.Stack(16,
                new SwitchComponent("presets-backups").SetTitle("Nightly backups"),
                UIText.Note("Kept for 14 days in object-storage, eu-west.").ShownWhen("presets-backups"),
                new RadioGroupComponent("presets-billed")
                    .SetTitle("Billed")
                    .SetOptions(
                    [
                        new OptionItem { Id = "direct", Title = "Directly" },
                        new OptionItem { Id = "reseller", Title = "Through a reseller" }
                    ])
                    .SetValue("direct"),
                new TextInputComponent().SetTitle("VAT number").HiddenWhen("presets-billed", "reseller")
            ),
            note: "Shown while the switch is on; the VAT number hidden while the reseller is chosen. Each is one interaction, run in the browser without a round trip, and drawn from the source's own value on the first paint: the note starts hidden while the switch is off."
        );

    protected static ContainerComponent CreateEnabledGroup()
        => DemoUI.CreateExample("EnabledWhen, and a comparison",
            UILayout.Stack(16,
                new CheckboxComponent("presets-terms").SetTitle("I accept the terms"),
                UIButtons.Primary("Subscribe").EnabledWhen("presets-terms").SetHorizontalAlignment(UIAlignment.Start),
                new NumberInputComponent("presets-seats").SetTitle("Servers").SetRange(1, 40).SetValue(4),
                UIText.Note("Over 20 servers, Dedicated costs less a seat than Pro.").ShownWhen("presets-seats", IInputComponent.ValueProperty, UIComparisonOperator.Greater, 20)
            ),
            note: "Subscribe enabled while the box is ticked; the note shown while the number is over 20 — the overload that names the property and the comparison."
        );

    protected static ContainerComponent CreateResponsiveGroup()
        => DemoUI.CreateExample("ShownBelow, ShownFrom",
            UILayout.Stack(12,
                UIText.Note("Shown below the medium width: a phone's Back, the list's own title over a pane.").ShownBelow(UIResponsiveTier.Md),
                UIText.Note("Shown from the medium width: what has room beside the list.").ShownFrom(UIResponsiveTier.Md)
            ),
            note: "One of the two lines at any width: ShownBelow hides a part from the tier up, ShownFrom below it. Narrow the window past 768 px and they swap."
        );
}
