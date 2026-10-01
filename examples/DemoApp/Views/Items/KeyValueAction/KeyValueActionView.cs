using DemoApp.Controllers.Base;
using DemoApp.Controllers.Items.KeyValueAction;
using DemoApp.Views.Base;

namespace DemoApp.Views.Items.KeyValueAction;

/// <summary>
/// One list and every property that can be bound to it, the rows from a bound collection; then what a row can be made of — key,
/// value and action are each a whole text model rather than a string — and what a row does: a press on it or on its action, and an
/// input that edits its value in place.
/// </summary>
/// <remarks>A list in a card is on the card's page; a validation message in a row is on the Values page.</remarks>
internal sealed class KeyValueActionView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ListGroup = nameof(KeyValueActionController.ListGroup);
    private const string ItemsGroup = nameof(KeyValueActionController.ItemsGroup);
    private const string BorderGroup = nameof(KeyValueActionController.BorderGroup);
    private const string ClickGroup = nameof(KeyValueActionController.ClickGroup);
    private const string EditGroup = nameof(KeyValueActionController.EditGroup);
    private const string InputsGroup = nameof(KeyValueActionController.InputsGroup);

    public static string ViewKey => "demo.items.key-value-action";

    protected override string ComponentRoute => "/items/key-value-action";
    protected override string Header => "demo.items.key-value-action.header";
    protected override string HeaderDescription => "demo.items.key-value-action.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/settings", "demo.nav.screens.settings");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new KeyValueActionComponent()
            .BindItems($"{ItemsGroup}.{nameof(KeyValueActionRowsGroupContext.Items)}")
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindSurface($"{ListGroup}.{nameof(KeyValueActionListGroupContext.Surface)}")
            .BindShowRowSeparators($"{ListGroup}.{nameof(KeyValueActionListGroupContext.ShowRowSeparators)}")
            .BindStretchValue($"{ListGroup}.{nameof(KeyValueActionListGroupContext.StretchValue)}")
            .BindShowActions($"{ListGroup}.{nameof(KeyValueActionListGroupContext.ShowActions)}")
            .BindRowHoverable($"{ListGroup}.{nameof(KeyValueActionListGroupContext.RowHoverable)}")
            .BindOverflow($"{ListGroup}.{nameof(KeyValueActionListGroupContext.Overflow)}")
            .BindBorderColor($"{BorderGroup}.{nameof(BorderGroupContext.BorderColor)}")
            .BindBorderThickness($"{BorderGroup}.{nameof(BorderGroupContext.BorderThickness)}")
            .BindBorderRadius($"{BorderGroup}.{nameof(BorderGroupContext.BorderRadius)}")
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 260);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ListGroup, "List", nameof(KeyValueActionController.CycleListOption)),
            DemoUI.CreateOptionSection(ItemsGroup, "Rows", nameof(KeyValueActionController.CycleItemsOption)),
            DemoUI.CreateOptionSection(BorderGroup, "Border", nameof(KeyValueActionController.CycleBorderOption))
        );

    protected override IVisualComponent[] CreateExamples()
        // Two stacks as tall as each other: in pairs, the long list of every input stood alone in a row of its own.
        => [DemoUI.CreateHalf(CreateDetailsGroup(), CreateClicksGroup(), CreateSummaryGroup()), DemoUI.CreateHalf(CreateEditGroup(), CreateInputsGroup())];

    /// <summary>
    /// The ordinary case — key, value and a per-row action — with a badge in either slot and a description under either title. The key's
    /// badge is <c>Inline</c>, since <c>Trailing</c> would send it to the value's doorstep; a description wraps under its title inside the
    /// column rather than widening the row.
    /// </summary>
    private static ContainerComponent CreateDetailsGroup()
    {
        return DemoUI.CreateExample("Server details",
            new KeyValueActionComponent()
                .SetRowHoverable(true)
                .SetItems(
                [
                    new KeyValueActionItem
                    {
                        Id = "ipv4",
                        Key = new TextItem { Title = "IPv4", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "203.0.113.24" },
                        Action = new ButtonItem { Id = "ipv4", Icon = DemoIcons.Outline(DemoIcons.Copy), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "endpoint",
                        Key = new TextItem { Title = "Endpoint", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "api.orvane.example", BadgeText = "live", BadgeStyle = UIBadgeType.Success },
                        Action = new ButtonItem { Id = "endpoint", Icon = DemoIcons.Outline(DemoIcons.Settings), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "ipv6",
                        Key = new TextItem { Title = "IPv6", TitleColor = UIThemeColor.Muted, BadgeText = "beta", BadgeStyle = UIBadgeType.Surface, BadgePlacement = UITextBadgePlacement.Inline },
                        Value = new TextItem { Title = "rolling out", BadgeText = "42 %", BadgeStyle = UIBadgeType.Warning },
                        Action = new ButtonItem { Id = "ipv6", Icon = DemoIcons.Outline(DemoIcons.Settings), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "retention",
                        Key = new TextItem { Title = "Retention", TitleColor = UIThemeColor.Muted, Description = "Deleted after this long" },
                        Value = new TextItem { Title = "30 days", Description = "Counted from the last write" },
                        Action = new ButtonItem { Id = "retention", Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                    },
                    new KeyValueActionItem
                    {
                        Id = "snapshot",
                        Key = new TextItem { Title = "Snapshot", TitleColor = UIThemeColor.Muted },
                        Value = new TextItem { Title = "api-eu-west-1.snap" },
                        Action = new ButtonItem { Id = "snapshot", Icon = DemoIcons.Outline(DemoIcons.Download), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
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
        return DemoUI.CreateExample("A row's press and its action's",
            UILayout.Stack(16)
                .AddChild(UIPage.Labelled("Row click: the whole item", new KeyValueActionComponent()
                    .SetRowHoverable(true)
                    .BindItems(nameof(KeyValueActionArgumentGroupContext.Items), UIBindingScope.Relative)
                    .OnRowClickWithItem(nameof(KeyValueActionController.ClickRowWithItem))
                    )
                )
                .AddChild(UIPage.Labelled("Action click: the item key", new KeyValueActionComponent()
                    .SetRowHoverable(true)
                    .BindItems(nameof(KeyValueActionArgumentGroupContext.Items), UIBindingScope.Relative)
                    .OnActionClickWithItemKey(nameof(KeyValueActionController.ClickActionWithKey))
                    )
                ),
            note: "The same rows twice: press a row of the first list, then a pencil of the second, and read what reached the controller.",
            context: ClickGroup
        );
    }

    /// <summary>
    /// Every input the framework has, one per row, none told how to look: a field in a row is a ghost by itself, and what is not a
    /// field sits centred in the cell with the row's own inset.
    /// </summary>
    private static ContainerComponent CreateInputsGroup()
    {
        OptionItem[] fits =
        [
            new OptionItem { Id = "cover", Title = "Cover" },
            new OptionItem { Id = "contain", Title = "Contain" },
            new OptionItem { Id = "fill", Title = "Stretch" }
        ];

        return DemoUI.CreateExample("Every input in a row",
            new KeyValueActionComponent()
                .BindItems(nameof(KeyValueActionInputsGroupContext.Items), UIBindingScope.Relative)
                .AddValueInputTemplate("number", new NumberInputComponent().Required("A number is required").SetMax(9).SetMin(0))
                .AddValueInputTemplate("switch", new SwitchComponent())
                .AddValueInputTemplate("checkbox", new CheckboxComponent())
                .AddValueInputTemplate("select", new SelectComponent().SetOptions(fits))
                .AddValueInputTemplate("search", new SearchComponent().SetOptions(fits))
                .AddValueInputTemplate("radio", new RadioGroupComponent().SetOptions(fits).SetOrientation(UIOrientation.Horizontal))
                .AddValueInputTemplate("slider", new SliderComponent().SetMin(0).SetMax(100))
                .AddValueInputTemplate("date", new DateInputComponent())
                .AddValueInputTemplate("time", new TimeInputComponent())
                .AddValueInputTemplate("datetime", new DateTimeInputComponent())
                .AddValueInputTemplate("color", new ColorInputComponent())
                .AddValueInputTemplate("file", new FileInputComponent().SetPlaceholder("Pick a file"))
                .EnableEditing(nameof(KeyValueActionController.SaveInputRow), nameof(KeyValueActionController.OpenInputRow)),
            note: "AddValueInputTemplate for every kind, with no Appearance set on any of them.",
            context: InputsGroup
        );
    }

    /// <summary>
    /// The same component read rather than operated: <c>StretchValue</c> off lets the value column shrink to its content instead of
    /// pushing the action out, and <c>ShowActions</c> off with no separators turns it into a plain definition list.
    /// </summary>
    private static ContainerComponent CreateSummaryGroup()
    {
        return DemoUI.CreateExample("A summary",
            UILayout.Stack(16)
                .AddChild(UIPage.Labelled("StretchValue off: each value as wide as its words", new KeyValueActionComponent()
                    .SetStretchValue(false)
                    .SetRowHoverable(true)
                    .SetItems(
                    [
                        new KeyValueActionItem
                        {
                            Id = "region",
                            Key = new TextItem { Title = "Region", TitleColor = UIThemeColor.Muted },
                            Value = new TextItem { Title = "eu-west" },
                            Action = new ButtonItem { Id = "region", Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                        },
                        new KeyValueActionItem
                        {
                            Id = "replicas",
                            Key = new TextItem { Title = "Replicas", TitleColor = UIThemeColor.Muted },
                            Value = new TextItem { Title = "3" },
                            Action = new ButtonItem { Id = "replicas", Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                        },
                        new KeyValueActionItem
                        {
                            Id = "plan",
                            Key = new TextItem { Title = "Plan", TitleColor = UIThemeColor.Muted },
                            Value = new TextItem { Title = "standard" },
                            Action = new ButtonItem { Id = "plan", Icon = DemoIcons.Outline(DemoIcons.Edit), Type = UIButtonType.Ghost, Size = UIButtonSize.Small }
                        },
                    ])
                    )
                )
                .AddChild(UIPage.Labelled("ShowActions off, no separators: a definition list", new KeyValueActionComponent()
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
    /// A row that becomes the input editing its value. Opened by the controller, the pencil asks it, and it seeds the draft as the input
    /// wants it: text, a number, a flag, a picture. With no edit command the pencil flips the row's flag on the client, the value's own
    /// text is the draft, and only Save goes to the server. Enter saves, Escape cancels.
    /// </summary>
    private static ContainerComponent CreateEditGroup()
    {
        return DemoUI.CreateExample("Edit in place",
            UILayout.Stack(16)
                .AddChild(UIPage.Labelled("Opened by the controller", new KeyValueActionComponent()
                    .BindItems(nameof(KeyValueActionEditGroupContext.Items), UIBindingScope.Relative)
                    .AddValueInputTemplate("number", new NumberInputComponent().SetAppearance(UIInputAppearance.Ghost))
                    .AddValueInputTemplate("switch", new SwitchComponent())
                    .AddValueInputTemplate("avatar", new ImageInputComponent()
                        .SetShape(UIImageInputShape.Avatar)
                        .SetMaxFileSize(DemoImages.MaxInlinePictureBytes)
                        .BindSelectionId(nameof(AvatarRowItem.SelectionId), UIBindingScope.Relative)
                    )
                    .EnableEditing(nameof(KeyValueActionController.SaveRowAsync), nameof(KeyValueActionController.OpenRow))
                    )
                )
                .AddChild(UIPage.Labelled("Opened on the client", new KeyValueActionComponent()
                    .BindItems(nameof(KeyValueActionEditGroupContext.LocalItems), UIBindingScope.Relative)
                    .EnableEditing(nameof(KeyValueActionController.SaveLocalRow))
                    )
                ),
            note: "EnableEditing(save, edit) with a typed input per row (InputTemplate): the draft comes back as the input sent it, and Cancel is the client's alone. EnableEditing(save) alone: the row's ShowInput still reaches the controller through its two-way binding, so the server knows what the page did.",
            context: EditGroup,
            contentMinHeight: 380
        );
    }
}
