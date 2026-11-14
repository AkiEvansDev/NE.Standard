using DemoApp.Controllers.Base;
using DemoApp.Controllers.Choices.MultiSelect;
using DemoApp.Views.Base;

namespace DemoApp.Views.Choices.MultiSelect;

/// <summary>
/// Multi-select preview across <c>Chips</c>, <c>Badges</c> and <c>Checkboxes</c> variants, followed by grouped examples for each variant,
/// free-text tag entry, per-tag regex validation, and read-only states.
/// </summary>
internal sealed class MultiSelectView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string VariantGroup = nameof(MultiSelectController.VariantGroup);
    private const string ValueGroup = nameof(MultiSelectController.ValueGroup);
    private const string FieldGroup = nameof(MultiSelectController.FieldGroup);
    private const string OptionsGroup = nameof(MultiSelectController.OptionsGroup);
    private const string LabelGroup = nameof(MultiSelectController.LabelGroup);
    private const string BorderGroup = nameof(MultiSelectController.BorderGroup);

    public static string ViewKey => "demo.choices.multi-select";

    protected override string ComponentRoute => "/choices/multi-select";
    protected override string Header => "demo.choices.multi-select.header";
    protected override string HeaderDescription => "demo.choices.multi-select.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame
            .AddChild(CreateVariantPane(UIMultiSelectVariant.Chips, nameof(MultiSelectVariantGroupContext.ChipsVisibility)))
            .AddChild(CreateVariantPane(UIMultiSelectVariant.Badges, nameof(MultiSelectVariantGroupContext.BadgesVisibility)))
            .AddChild(CreateVariantPane(UIMultiSelectVariant.Checkboxes, nameof(MultiSelectVariantGroupContext.CheckboxesVisibility)))
            .AddChild(CreateVariantPane(UIMultiSelectVariant.Button, nameof(MultiSelectVariantGroupContext.ButtonVisibility)))
        );

    /// <summary>One variant, shown while the Variant row names it: <c>Variant</c> is decided at render, so each is its own instance on the same rows.</summary>
    private static ContainerComponent CreateVariantPane(UIMultiSelectVariant variant, string visibility)
        => new ContainerComponent()
            .BindVisibility($"{VariantGroup}.{visibility}")
            .SetPlacement(1, 1, 24, 1)
            .AddChild(new MultiSelectComponent()
                .SetVariant(variant)
                .BindButtonVariant<MultiSelectController>(static x => x.VariantGroup.ButtonVariant)
                .BindStandard()
                .BindItems<MultiSelectController>(static x => x.OptionsGroup.Options)
                .BindValue<MultiSelectController>(static x => x.ValueGroup.Value)
                .BindMaxSelected<MultiSelectController>(static x => x.ValueGroup.MaxSelected)
                .BindIsReadOnly<MultiSelectController>(static x => x.ValueGroup.IsReadOnly)
                .BindSize<MultiSelectController>(static x => x.FieldGroup.Size)
                .BindOrientation<MultiSelectController>(static x => x.VariantGroup.Orientation)
                .BindSpacing<MultiSelectController>(static x => x.VariantGroup.Spacing)
                .BindAppearance<MultiSelectController>(static x => x.FieldGroup.Appearance)
                .BindPlaceholder<MultiSelectController>(static x => x.FieldGroup.Placeholder)
                .BindPrefixIcon<MultiSelectController>(static x => x.FieldGroup.PrefixIcon)
                .BindSuffixIcon<MultiSelectController>(static x => x.FieldGroup.SuffixIcon)
                .BindShowClearButton<MultiSelectController>(static x => x.FieldGroup.ShowClearButton)
                .BindShowChevron<MultiSelectController>(static x => x.FieldGroup.ShowChevron)
                .BindLabel(LabelGroup)
                .BindBorder(BorderGroup)
                .SetPlacement(1, 1, 24, 1)
            );

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(VariantGroup, "Variant", "Variant is decided at render: the row shows the preview drawn as chips, badges, checkboxes or a compact filter button. Orientation and Spacing lay out the checkboxes alone."),
            DemoUI.CreateOptionSection(ValueGroup, "Value"),
            DemoUI.CreateOptionSection(FieldGroup, "Field", "The field's own rows; the checkboxes have no field and read none of them."),
            DemoUI.CreateOptionSection(OptionsGroup, "Options", "Each region carries its code as a badge: the badges variant chooses the badge, the others show it beside the name."),
            DemoUI.CreateOptionSection(LabelGroup, "Label"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
        );

    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns(
            [CreateChipsGroup(), CreateBadgesGroup(), CreateCheckboxesGroup()],
            [CreateFreeTextChipsGroup(), CreateBadgeTagsAndFilterGroup(), CreateReadOnlyGroup()]
        );

    /// <summary>
    /// Standard <c>Chips</c> variant: selection order preservation, grouped options with <c>SetMaxSelected</c>, and multi-line chip wrapping.
    /// </summary>
    private static ContainerComponent CreateChipsGroup()
    {
        return DemoUI.CreateExample("Chips, grouped options & max selection",
            UILayout.Stack(14)
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Maintenance window days")
                    .SetPlaceholder("Pick weekdays")
                    .SetOptions(Weekdays())
                    .SetValue(["sat", "sun"])
                    .SetShowClearButton()
                )
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Database replication regions (max 3)")
                    .SetPlaceholder("Pick up to three regions")
                    .SetOptions(CloudRegions())
                    .SetValue(["eu-west", "eu-central"])
                    .SetMaxSelected(3)
                    .SetShowClearButton()
                    .AddTrailingAction(new ButtonComponent()
                        .SetVariant(UIButtonVariant.Ghost)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Refresh))
                        .SetTooltip("Check replication lag")
                    )
                )
                .AddChild(new MultiSelectComponent()
                    .SetTitle("On-call rotation (rich options, wrapping chips)")
                    .SetPlaceholder("Pick on-call staff")
                    .SetPrefixIcon(DemoIcons.Bell)
                    .SetOptions(Staff())
                    .SetValue(["robin", "grace", "alex", "ada"])
                ),
            note: "Values preserve selection order; `OptionItem.Group` groups the dropdown, and `SetMaxSelected(3)` disables remaining items until a chip is removed."
        );
    }

    /// <summary>
    /// <c>UIMultiSelectVariant.Badges</c>: badge-only options (<c>BadgeTitle</c> without <c>Title</c>) and options where <c>Title</c> precedes the badge in the list.
    /// </summary>
    private static ContainerComponent CreateBadgesGroup()
    {
        return DemoUI.CreateExample("Badge variant",
            UILayout.Stack(14)
                .AddChild(new MultiSelectComponent()
                    .SetVariant(UIMultiSelectVariant.Badges)
                    .SetTitle("Ticket labels (badge-only options)")
                    .SetPlaceholder("Pick labels")
                    .SetOptions(BadgeTicketLabels())
                    .SetValue(["outage", "needs-details"])
                    .SetShowClearButton()
                )
                .AddChild(new MultiSelectComponent()
                    .SetVariant(UIMultiSelectVariant.Badges)
                    .SetTitle("Alert severities (Title + BadgeTitle)")
                    .SetPlaceholder("Pick severities")
                    .SetPrefixIcon(DemoIcons.Bell)
                    .SetOptions(
                    [
                        new OptionItem { Id = "p1", Title = "Critical", BadgeTitle = "P1", BadgeVariant = UIBadgeVariant.Danger, Description = "A region or service is down" },
                        new OptionItem { Id = "p2", Title = "High", BadgeTitle = "P2", BadgeVariant = UIBadgeVariant.Warning, Description = "Degraded service, no data loss" },
                        new OptionItem { Id = "p3", Title = "Medium", BadgeTitle = "P3", BadgeVariant = UIBadgeVariant.Info, Description = "Single tenant, workaround available" },
                        new OptionItem { Id = "p4", Title = "Low", BadgeTitle = "P4", BadgeVariant = UIBadgeVariant.Surface, Description = "Handled during working hours" }
                    ])
                    .SetValue(["p1", "p2"])
                ),
            note: "When `Title` is omitted, `BadgeTitle` serves as the option name; when `Title` is set, the dropdown shows `Critical P1` and the field renders `P1`."
        );
    }

    /// <summary>
    /// <c>UIMultiSelectVariant.Checkboxes</c> in vertical checklist and horizontal column grid (<c>SetItemMinWidth</c> + <c>SetMaxSelected</c>) layouts.
    /// </summary>
    private static ContainerComponent CreateCheckboxesGroup()
    {
        return DemoUI.CreateExample("Checkbox variant",
            UILayout.Stack(16)
                .AddChild(new MultiSelectComponent()
                    .SetVariant(UIMultiSelectVariant.Checkboxes)
                    .SetTitle("Email notifications")
                    .SetOptions(
                    [
                        new OptionItem { Id = "deploys", Title = "Finished deploys", Description = "One summary per environment" },
                        new OptionItem { Id = "incidents", Title = "Incidents", Description = "Opened, escalated and resolved" },
                        new OptionItem { Id = "usage", Title = "Weekly usage", Description = "Mondays, previous week metrics" },
                        new OptionItem { Id = "invoices", Title = "Invoices", Description = "Sent as each invoice is issued", BadgeTitle = "Billing", BadgeVariant = UIBadgeVariant.Accent }
                    ])
                    .SetValue(["incidents", "invoices"])
                )
                .AddChild(new SeparatorComponent())
                .AddChild(new MultiSelectComponent()
                    .SetVariant(UIMultiSelectVariant.Checkboxes)
                    .SetTitle("Full backup days (horizontal, max 3)")
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetItemMinWidth(120)
                    .SetOptions(Weekdays())
                    .SetMaxSelected(3)
                    .SetValue(["mon", "wed", "fri"])
                ),
            note: "`SetOrientation(Horizontal)` with `SetItemMinWidth(120)` aligns checkboxes into even wrapping columns; `Tab` enters the group once and arrow keys move focus."
        );
    }

    /// <summary>
    /// Free-text tag creation (<c>SetAllowFreeText</c>), per-item regex validation (<c>RegexEach</c>), and <c>UITagEntry.FirstSuggestion</c>.
    /// </summary>
    private static ContainerComponent CreateFreeTextChipsGroup()
    {
        return DemoUI.CreateExample("Free-text tags & validation",
            UILayout.Stack(14)
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Custom labels (RegexEach, max 5)")
                    .SetPlaceholder("Type or paste comma-separated labels")
                    .SetAllowFreeText()
                    .SetOptions(Labels())
                    .SetValue(["billing", "needs-repro"])
                    .SetMaxSelected(5)
                    .RegexEach(@"^[^\s,]{2,24}$", "Each label must be 2-24 characters with no spaces.")
                    .SetShowClearButton()
                )
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Watchers (FirstSuggestion on Enter)")
                    .SetPlaceholder("Type a name")
                    .SetAllowFreeText()
                    .SetTagEntry(UITagEntry.FirstSuggestion)
                    .SetOptions(Staff())
                    .SetValue(["grace"])
                ),
            note: "`Enter`, comma or pasting `a, b, c` commits tags; `RegexEach` validates every entry inline, and `UITagEntry.FirstSuggestion` pre-highlights the top match."
        );
    }

    /// <summary>
    /// Free-text badge tags alongside a compact list filter bar using <c>UIMultiSelectVariant.Badges</c>.
    /// </summary>
    private static ContainerComponent CreateBadgeTagsAndFilterGroup()
    {
        return DemoUI.CreateExample("Badge free-text tags & list filter",
            UILayout.Stack(14)
                .AddChild(new MultiSelectComponent()
                    .SetVariant(UIMultiSelectVariant.Badges)
                    .SetTitle("Account tags (free text + preset badges)")
                    .SetPlaceholder("Type a tag")
                    .SetAllowFreeText()
                    .SetOptions(
                    [
                        new OptionItem { Id = "enterprise", BadgeTitle = "enterprise", BadgeVariant = UIBadgeVariant.Primary, Description = "Dedicated contract" },
                        new OptionItem { Id = "reseller", BadgeTitle = "reseller", BadgeVariant = UIBadgeVariant.Accent, Description = "Bills downstream tenants" },
                        new OptionItem { Id = "at-risk", BadgeTitle = "at risk", BadgeVariant = UIBadgeVariant.Danger, BadgeFill = UIBadgeFill.Outline, Description = "Declining two-month usage" },
                        new OptionItem { Id = "eu-only", BadgeTitle = "EU only", BadgeVariant = UIBadgeVariant.Surface, Description = "Data pinned to EU regions" }
                    ])
                    .SetValue(["enterprise", "eu-only", "design agency"])
                    .SetShowClearButton()
                )
                .AddChild(DemoUI.CreateLabelled("Compact ticket filter bar", UIPage.Band(UILayout.Stack(10,
                            new TextInputComponent()
                                .SetPlaceholder("Search tickets")
                                .SetPrefixIcon(DemoIcons.Search),
                            UILayout.Row(8,
                                new MultiSelectComponent()
                                    .SetVariant(UIMultiSelectVariant.Button)
                                    .SetButtonVariant(UIButtonVariant.Outline)
                                    .SetIcon(DemoIcons.Outline(DemoIcons.Filter))
                                    .SetTitle("Labels")
                                    .SetOptions(BadgeTicketLabels())
                                    .SetValue(["outage", "docs"]),
                                new MultiSelectComponent()
                                    .SetVariant(UIMultiSelectVariant.Button)
                                    .SetButtonVariant(UIButtonVariant.Ghost)
                                    .SetIcon(DemoIcons.Outline(DemoIcons.Cloud))
                                    .SetTitle("Region")
                                    .SetOptions(CloudRegions())
                                    .SetValue(["eu-west"])
                            )
                        )
                    )
                )),
            note: "Unmatched free-text tags (such as `design agency`) render as neutral surface badges, while `UIMultiSelectVariant.Button` compresses filter pickers into compact toolbar buttons with a live selected-count badge."
        );
    }

    /// <summary>
    /// <c>SetIsReadOnly(true)</c> compared across <c>Chips</c>, <c>Badges</c> and <c>Checkboxes</c> in one place.
    /// </summary>
    private static ContainerComponent CreateReadOnlyGroup()
    {
        return DemoUI.CreateExample("Read-only states",
            UILayout.Stack(14)
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Replicated regions (read-only chips)")
                    .SetIsReadOnly(true)
                    .SetOptions(CloudRegions())
                    .SetValue(["us-east", "ap-south"])
                )
                .AddChild(new MultiSelectComponent()
                    .SetVariant(UIMultiSelectVariant.Badges)
                    .SetTitle("Assigned labels (read-only badges)")
                    .SetIsReadOnly(true)
                    .SetOptions(BadgeTicketLabels())
                    .SetValue(["billing", "resolved"])
                )
                .AddChild(new MultiSelectComponent()
                    .SetVariant(UIMultiSelectVariant.Checkboxes)
                    .SetTitle("Enabled regions (read-only checkboxes)")
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetItemMinWidth(140)
                    .SetIsReadOnly(true)
                    .SetOptions(CloudRegions())
                    .SetValue(["eu-west", "us-east"])
                ),
            note: "`SetIsReadOnly(true)` hides chip/badge remove buttons and prevents toggling while keeping values focusable and legible."
        );
    }

    private static OptionItem[] Weekdays()
        => [
            new() { Id = "mon", Title = "Monday" },
            new() { Id = "tue", Title = "Tuesday" },
            new() { Id = "wed", Title = "Wednesday" },
            new() { Id = "thu", Title = "Thursday" },
            new() { Id = "fri", Title = "Friday" },
            new() { Id = "sat", Title = "Saturday" },
            new() { Id = "sun", Title = "Sunday" }
        ];

    private static OptionItem[] CloudRegions()
        => [
            new() { Id = "eu-west", Title = "Europe West", Description = "Amsterdam", Group = "Europe" },
            new() { Id = "eu-central", Title = "Europe Central", Description = "Frankfurt", Group = "Europe" },
            new() { Id = "eu-north", Title = "Europe North", Description = "Stockholm", Group = "Europe" },
            new() { Id = "us-east", Title = "US East", Description = "Ashburn", Group = "Americas" },
            new() { Id = "ap-south", Title = "Asia South", Description = "Singapore", Group = "Asia Pacific" }
        ];

    private static OptionItem[] Staff()
        => [
            new() { Id = "sam", Icon = DemoIcons.UserRound, Title = "Sam Ortega", Description = "Owner" },
            new() { Id = "robin", Icon = DemoIcons.UserRound, Title = "Robin Hale", Description = "Admin" },
            new() { Id = "alex", Icon = DemoIcons.UserRound, Title = "Alex Warren", Description = "Admin" },
            new() { Id = "grace", Icon = DemoIcons.UserRound, Title = "Grace Kim", Description = "Admin" },
            new() { Id = "ada", Icon = DemoIcons.UserRound, Title = "Ada Lin", Description = "Admin" }
        ];

    private static OptionItem[] BadgeTicketLabels()
        => [
            new() { Id = "outage", BadgeTitle = "outage", BadgeVariant = UIBadgeVariant.Danger, BadgeFill = UIBadgeFill.Tinted, Description = "Service outage affecting customers" },
            new() { Id = "billing", BadgeTitle = "billing", BadgeVariant = UIBadgeVariant.Accent, BadgeFill = UIBadgeFill.Tinted, Description = "Invoice or charge inquiry" },
            new() { Id = "needs-details", BadgeTitle = "needs details", BadgeVariant = UIBadgeVariant.Warning, BadgeFill = UIBadgeFill.Tinted, Description = "Awaiting logs or reproduction steps" },
            new() { Id = "docs", BadgeTitle = "docs", BadgeVariant = UIBadgeVariant.Info, BadgeFill = UIBadgeFill.Tinted, BadgeIcon = DemoIcons.Outline(DemoIcons.File), Description = "Covered by documentation" },
            new() { Id = "resolved", BadgeTitle = "resolved", BadgeVariant = UIBadgeVariant.Success, BadgeFill = UIBadgeFill.Tinted, Description = "Confirmed fixed" }
        ];

    private static OptionItem[] Labels()
        => [
            new() { Id = "billing", Title = "billing" },
            new() { Id = "backend", Title = "backend" },
            new() { Id = "frontend", Title = "frontend" },
            new() { Id = "needs-repro", Title = "needs-repro" },
            new() { Id = "security", Title = "security" },
            new() { Id = "docs", Title = "docs" }
        ];
}
