using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.KeyValueAction;
using DemoApp.Views.Base;

namespace DemoApp.Views.Items.KeyValueAction;

/// <summary>
/// One list and every property that can be bound to it, the rows from a bound collection; then key/value/action structure, row and
/// action commands, layout modes, in-place editing, in-row validation, and typed row editors.
/// </summary>
internal sealed class KeyValueActionView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ListGroup = nameof(KeyValueActionController.ListGroup);
    private const string ItemsGroup = nameof(KeyValueActionController.ItemsGroup);
    private const string BorderGroup = nameof(KeyValueActionController.BorderGroup);
    private const string ClickGroup = nameof(KeyValueActionController.ClickGroup);
    private const string EditGroup = nameof(KeyValueActionController.EditGroup);
    private const string ValidationGroup = nameof(KeyValueActionController.ValidationGroup);
    private const string InputsGroup = nameof(KeyValueActionController.InputsGroup);

    public static string ViewKey => "demo.items.key-value-action";

    protected override string ComponentRoute => "/items/key-value-action";
    protected override string Header => "demo.items.key-value-action.header";
    protected override string HeaderDescription => "demo.items.key-value-action.description";
    protected override (string Route, string Title)? ComposedIn => ("/screens/settings", "demo.nav.screens.settings");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new KeyValueActionComponent()
            .BindItems<KeyValueActionController>(static x => x.ItemsGroup.Items)
            .BindStandard()
            .BindSurface<KeyValueActionController>(static x => x.ListGroup.Surface)
            .BindShowRowSeparators<KeyValueActionController>(static x => x.ListGroup.ShowRowSeparators)
            .BindStretchValue<KeyValueActionController>(static x => x.ListGroup.StretchValue)
            .BindShowActions<KeyValueActionController>(static x => x.ListGroup.ShowActions)
            .BindRowHoverable<KeyValueActionController>(static x => x.ListGroup.RowHoverable)
            .BindOverflow<KeyValueActionController>(static x => x.ListGroup.Overflow)
            .BindBorder(BorderGroup)
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 260);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(ListGroup, "List"),
            DemoUI.CreateOptionSection(ItemsGroup, "Rows"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
        );

    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateDetailsGroup(), CreateClicksGroup(), CreateSummaryGroup()], [CreateEditGroup(), CreateValidationGroup(), CreateInputsGroup()]);

    /// <summary>
    /// The ordinary case — key, value and a per-row action — with a badge in either slot and a description under either title.
    /// </summary>
    private static ContainerComponent CreateDetailsGroup()
    {
        return DemoUI.CreateExample("Key, value & action rows",
            new KeyValueActionComponent()
                .SetRowHoverable(true)
                .SetItems(
                [
                    new KeyValueActionItem
                    {
                        Id = "ipv4",
                        Key = new TextItem { Title = "IPv4", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "203.0.113.24" },
                        Action = new ButtonItem { Id = "ipv4", Tooltip = "Copy the IPv4 address", Icon = DemoIcons.Outline(DemoIcons.Copy), Variant = UIButtonVariant.Ghost, Size = UISize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "endpoint",
                        Key = new TextItem { Title = "Endpoint", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "api.orvane.example", BadgeTitle = "live", BadgeVariant = UIBadgeVariant.Success },
                        Action = new ButtonItem { Id = "endpoint", Tooltip = "Endpoint settings", Icon = DemoIcons.Outline(DemoIcons.Settings), Variant = UIButtonVariant.Ghost, Size = UISize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "ipv6",
                        Key = new TextItem { Title = "IPv6", TitleColor = UIThemeColor.Muted, BadgeTitle = "beta", BadgeVariant = UIBadgeVariant.Surface, BadgePlacement = UITextBadgePlacement.Inline },
                        Value = new TextItem { Title = "rolling out", BadgeTitle = "42 %", BadgeVariant = UIBadgeVariant.Warning },
                        Action = new ButtonItem { Id = "ipv6", Tooltip = "IPv6 settings", Icon = DemoIcons.Outline(DemoIcons.Settings), Variant = UIButtonVariant.Ghost, Size = UISize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "retention",
                        Key = new TextItem { Title = "Retention", TitleColor = UIThemeColor.Muted, Description = "Deleted after this long" },
                        Value = new TextItem { Title = "30 days", Description = "Counted from the last write" },
                        Action = new ButtonItem { Id = "retention", Tooltip = "Edit the retention", Icon = DemoIcons.Outline(DemoIcons.Edit), Variant = UIButtonVariant.Ghost, Size = UISize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "snapshot",
                        Key = new TextItem { Title = "Snapshot", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "api-eu-west-1.snap" },
                        Action = new ButtonItem { Id = "snapshot", Tooltip = "Download the snapshot", Icon = DemoIcons.Outline(DemoIcons.Download), Variant = UIButtonVariant.Ghost, Size = UISize.Small }
                    },
                ])
        );
    }

    /// <summary>
    /// A press on a client-composed row and one on its action button both resolve against the same item: the row hands over the whole
    /// item, the action its key.
    /// </summary>
    private static ContainerComponent CreateClicksGroup()
    {
        return DemoUI.CreateExample("Row & action commands",
            UILayout.Stack(16)
                .AddChild(DemoUI.CreateLabelled("Row click: whole item", new KeyValueActionComponent()
                    .SetRowHoverable(true)
                    .BindItems<KeyValueActionArgumentGroupContext>(static x => x.Items, UIBindingScope.Relative)
                    .OnItemClickWithItem(nameof(KeyValueActionController.ClickRowWithItem))
                    )
                )
                .AddChild(DemoUI.CreateLabelled("Action click: item key", new KeyValueActionComponent()
                    .SetRowHoverable(true)
                    .BindItems<KeyValueActionArgumentGroupContext>(static x => x.Items, UIBindingScope.Relative)
                    .OnActionClickWithItemKey(nameof(KeyValueActionController.ClickActionWithKey))
                    )
                ),
            note: "Press a row in the first list to send the full item model, or press an edit button in the second list to send its key.",
            context: ClickGroup
        );
    }

    /// <summary>
    /// <c>StretchValue</c> off shrinks the value column to its content, and <c>ShowActions</c> off with no separators renders a definition list.
    /// </summary>
    private static ContainerComponent CreateSummaryGroup()
    {
        return DemoUI.CreateExample("Layout modes",
            UILayout.Stack(16)
                .AddChild(DemoUI.CreateLabelled("StretchValue(false): compact value width", new KeyValueActionComponent()
                    .SetStretchValue(false)
                    .SetRowHoverable(true)
                    .SetItems(
                    [
                        new KeyValueActionItem
                        {
                            Id = "region",
                            Key = new TextItem { Title = "Region", TitleColor = UIThemeColor.Muted },
                            Value = new TextItem { Title = "eu-west" },
                            Action = new ButtonItem { Id = "region", Tooltip = "Edit the region", Icon = DemoIcons.Outline(DemoIcons.Edit), Variant = UIButtonVariant.Ghost, Size = UISize.Small }
                        },
                        new KeyValueActionItem
                        {
                            Id = "replicas",
                            Key = new TextItem { Title = "Replicas", TitleColor = UIThemeColor.Muted },
                            Value = new TextItem { Title = "4" },
                            Action = new ButtonItem { Id = "replicas", Tooltip = "Edit the replicas", Icon = DemoIcons.Outline(DemoIcons.Edit), Variant = UIButtonVariant.Ghost, Size = UISize.Small }
                        },
                        new KeyValueActionItem
                        {
                            Id = "plan",
                            Key = new TextItem { Title = "Plan", TitleColor = UIThemeColor.Muted },
                            Value = new TextItem { Title = "standard" },
                            Action = new ButtonItem { Id = "plan", Tooltip = "Edit the plan", Icon = DemoIcons.Outline(DemoIcons.Edit), Variant = UIButtonVariant.Ghost, Size = UISize.Small }
                        },
                    ])
                    )
                )
                .AddChild(DemoUI.CreateLabelled("ShowActions(false) & no separators: definition list", new KeyValueActionComponent()
                    .SetShowActions(false)
                    .SetShowRowSeparators(false)
                    .SetBorderThickness(UIThickness.Uniform(0))
                    .SetItems(
                    [
                        new KeyValueActionItem
                        {
                            Id = "owner",
                            Key = new TextItem { Title = "Owner", TitleColor = UIThemeColor.Muted },
                            Value = new TextItem { Title = "Robin Hale" }
                        },
                        new KeyValueActionItem
                        {
                            Id = "created",
                            Key = new TextItem { Title = "Created", TitleColor = UIThemeColor.Muted },
                            Value = new TextItem { Title = "2026-04-02" }
                        },
                        new KeyValueActionItem
                        {
                            Id = "visibility",
                            Key = new TextItem { Title = "Visibility", TitleColor = UIThemeColor.Muted },
                            Value = new TextItem { Title = "internal" }
                        },
                    ])
                    )
                )
        );
    }

    /// <summary>
    /// Rows edited in place: either opened by a controller command that seeds typed drafts, or toggled directly on the client.
    /// </summary>
    private static ContainerComponent CreateEditGroup()
    {
        return DemoUI.CreateExample("In-place editing",
            UILayout.Stack(16)
                .AddChild(DemoUI.CreateLabelled("Server-seeded draft: EnableEditing(save, open)", new KeyValueActionComponent()
                    .BindItems<KeyValueActionEditGroupContext>(static x => x.Items, UIBindingScope.Relative)
                    .AddValueInputTemplate("number", new NumberInputComponent().SetAppearance(UIInputAppearance.Ghost))
                    .AddValueInputTemplate("switch", new SwitchComponent())
                    .AddValueInputTemplate("avatar", new ImageInputComponent()
                        .SetVariant(UIImageInputVariant.Avatar)
                        .SetMaxFileSize(DemoImages.MaxInlinePictureBytes)
                        .BindSelectionId<AvatarRowItem>(static x => x.SelectionId, UIBindingScope.Relative)
                    )
                    .SetValueInputTemplate(new TextInputComponent())
                    .EnableEditing(nameof(KeyValueActionController.SaveRowAsync), nameof(KeyValueActionController.OpenRow))
                    )
                )
                .AddChild(DemoUI.CreateLabelled("Client-opened draft: EnableEditing(save)", new KeyValueActionComponent()
                    .BindItems<KeyValueActionEditGroupContext>(static x => x.LocalItems, UIBindingScope.Relative)
                    .SetValueInputTemplate(new TextInputComponent())
                    .EnableEditing(nameof(KeyValueActionController.SaveLocalRow))
                    )
                ),
            note: "`EnableEditing(save, open)` asks the controller to seed `EditValue` when a row opens; `EnableEditing(save)` opens on the client and round-trips only on Save (`Enter` saves, `Escape` cancels).",
            context: EditGroup
        );
    }

    /// <summary>
    /// Client-side rules and server-bound validation messages inside editable rows: Error blocks saving, Warning and Info allow saving
    /// and leave a severity indicator beside the closed value.
    /// </summary>
    private static ContainerComponent CreateValidationGroup()
    {
        return DemoUI.CreateExample("Row validation",
            new KeyValueActionComponent()
                .BindItems<KeyValueActionValidationGroupContext>(static x => x.Items, UIBindingScope.Relative)
                .AddValueInputTemplate("limit", new NumberInputComponent()
                    .SetShowStepper()
                    .SetStep(50)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.Greater, 0, "Daily limit must be above 0.", UIValidationSeverity.Error)
                    .Validate(UIValidationTrigger.Change, UIComparisonOperator.LessOrEqual, 200, "Above 200 requires quota approval.", UIValidationSeverity.Warning)
                )
                .AddValueInputTemplate("owner", new TextInputComponent()
                    .Required("An owner is required.")
                    .Regex("@", "Use an email address to page an individual.", UIValidationTrigger.Change, UIValidationSeverity.Warning)
                )
                .AddValueInputTemplate("region", new TextInputComponent()
                    .BindValidation<ValidatedRowItem>(static x => x.Validation, UIBindingScope.Relative)
                )
                .EnableEditing(nameof(KeyValueActionController.SaveValidatedRow)),
            note: "Rules on `AddValueInputTemplate` validate live inside the row (`0` blocks Save with an Error; `> 200` or a team handle shows a Warning). `BindValidation` on `Region` displays server messages (`ap-south` is refused on Save).",
            context: ValidationGroup
        );

    }

    /// <summary>
    /// Representative typed editors mapped via <c>AddValueInputTemplate</c>; each field adopts Ghost chrome automatically inside a row.
    /// </summary>
    private static ContainerComponent CreateInputsGroup()
    {
        OptionItem[] fits =
        [
            new OptionItem { Id = "cover", Title = "Cover" },
            new OptionItem { Id = "contain", Title = "Contain" },
            new OptionItem { Id = "fill", Title = "Stretch" }
        ];

        return DemoUI.CreateExample("Typed row editors",
            new KeyValueActionComponent()
                .BindItems<KeyValueActionInputsGroupContext>(static x => x.Items, UIBindingScope.Relative)
                .AddValueInputTemplate("number", new NumberInputComponent().Required("A number is required").SetMax(12).SetMin(0))
                .AddValueInputTemplate("select", new SelectComponent().SetOptions(fits))
                .AddValueInputTemplate("switch", new SwitchComponent())
                .AddValueInputTemplate("date", new DateInputComponent())
                .AddValueInputTemplate("color", new ColorInputComponent())
                .SetValueInputTemplate(new TextInputComponent())
                .EnableEditing(nameof(KeyValueActionController.SaveInputRow), nameof(KeyValueActionController.OpenInputRow)),
            note: "`AddValueInputTemplate` maps each row's `InputTemplate` key to a typed editor without setting `Appearance` manually.",
            context: InputsGroup
        );
    }
}
