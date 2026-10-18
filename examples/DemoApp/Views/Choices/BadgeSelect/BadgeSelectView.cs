using DemoApp.Controllers.Base;
using DemoApp.Controllers.Choices.BadgeSelect;
using DemoApp.Views.Base;

namespace DemoApp.Views.Choices.BadgeSelect;

/// <summary>
/// One badge select and every property that can be bound to it; then a ticket's labels, severities whose badge is not their name, a
/// customer's tags typed as well as picked, and labels filtering a list.
/// </summary>
/// <remarks>
/// It is the multi-select with its options drawn as badges, so what the family shares — a limit, groups, read-only, the keys — is the
/// Multi-Select page's; this page shows what the badges change.
/// </remarks>
internal sealed class BadgeSelectView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(BadgeSelectController.ValueGroup);
    private const string FieldGroup = nameof(BadgeSelectController.FieldGroup);
    private const string OptionsGroup = nameof(BadgeSelectController.OptionsGroup);
    private const string ContentGroup = nameof(BadgeSelectController.ContentGroup);
    private const string BadgeGroup = nameof(BadgeSelectController.BadgeGroup);
    private const string BorderGroup = nameof(BadgeSelectController.BorderGroup);

    public static string ViewKey => "demo.choices.badge-select";

    protected override string ComponentRoute => "/choices/badge-select";
    protected override string Header => "demo.choices.badge-select.header";
    protected override string HeaderDescription => "demo.choices.badge-select.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new BadgeSelectComponent()
            .BindStandard()
            .BindItems($"{OptionsGroup}.{nameof(BadgeOptionsGroupContext.Options)}")
            .BindValue($"{ValueGroup}.{nameof(BadgeSelectValueGroupContext.Value)}")
            .BindMaxSelected($"{ValueGroup}.{nameof(BadgeSelectValueGroupContext.MaxSelected)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(BadgeSelectValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(BadgeSelectValueGroupContext.Size)}")
            .BindAppearance($"{FieldGroup}.{nameof(BadgeSelectFieldGroupContext.Appearance)}")
            .BindPlaceholder($"{FieldGroup}.{nameof(BadgeSelectFieldGroupContext.Placeholder)}")
            .BindPrefixIcon($"{FieldGroup}.{nameof(BadgeSelectFieldGroupContext.PrefixIcon)}")
            .BindSuffixIcon($"{FieldGroup}.{nameof(BadgeSelectFieldGroupContext.SuffixIcon)}")
            .BindShowClearButton($"{FieldGroup}.{nameof(BadgeSelectFieldGroupContext.ShowClearButton)}")
            .BindShowChevron($"{FieldGroup}.{nameof(BadgeSelectFieldGroupContext.ShowChevron)}")
            .BindTextContent(ContentGroup)
            .BindBadge(BadgeGroup)
            .BindBorder(BorderGroup)
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard"),
            DemoUI.CreateOptionSection(ValueGroup, "Value"),
            DemoUI.CreateOptionSection(FieldGroup, "Field"),
            DemoUI.CreateOptionSection(OptionsGroup, "Options"),
            DemoUI.CreateOptionSection(ContentGroup, "Content"),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge"),
            DemoUI.CreateOptionSection(BorderGroup, "Border")
        );

    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateLabelsGroup(), CreateTagsGroup()], [CreateSeveritiesGroup(), CreateFilterGroup()]);

    /// <summary>
    /// The ordinary case: each option is its badge, so no Title — the badge's words are the option's name, its Description what it means.
    /// </summary>
    private static ContainerComponent CreateLabelsGroup()
    {
        return DemoUI.CreateExample("A ticket's labels",
            new BadgeSelectComponent()
                .SetTitle("Labels on the ticket")
                .SetPlaceholder("Pick labels")
                .SetOptions(
                [
                    new OptionItem { Id = "outage", BadgeText = "outage", BadgeStyle = UIBadgeType.Danger, BadgeFill = UIBadgeFill.Tinted, Description = "A service is down for the customer" },
                    new OptionItem { Id = "billing", BadgeText = "billing", BadgeStyle = UIBadgeType.Accent, BadgeFill = UIBadgeFill.Tinted, Description = "An invoice or a charge" },
                    new OptionItem { Id = "needs-details", BadgeText = "needs details", BadgeStyle = UIBadgeType.Warning, BadgeFill = UIBadgeFill.Tinted, Description = "Logs or steps wanted before work starts" },
                    new OptionItem { Id = "docs", BadgeText = "docs", BadgeStyle = UIBadgeType.Info, BadgeFill = UIBadgeFill.Tinted, BadgeIcon = DemoIcons.Outline(DemoIcons.File), Description = "Answered by a page of the docs" },
                    new OptionItem { Id = "resolved", BadgeText = "resolved", BadgeStyle = UIBadgeType.Success, BadgeFill = UIBadgeFill.Tinted, Description = "The customer confirmed the fix" },
                    new OptionItem { Id = "declined", BadgeText = "declined", BadgeStyle = UIBadgeType.Surface, Description = "Kept as it is" }
                ])
                .SetValue(["outage", "needs-details"])
                .SetShowClearButton(),
            note: "Options are badges: BadgeText is the words, BadgeStyle, BadgeColor, BadgeFill and BadgeIcon the look, a Description what the label means. A chosen one stands in the field as that badge, its remove inside it."
        );
    }

    /// <summary>
    /// A badge that is not the option's name: the title stands before it on the row, and the field shows the badge alone.
    /// </summary>
    private static ContainerComponent CreateSeveritiesGroup()
    {
        return DemoUI.CreateExample("Severities, the badge before the name",
            new BadgeSelectComponent()
                .SetTitle("Page the on-call for")
                .SetPlaceholder("Pick severities")
                .SetPrefixIcon(DemoIcons.Bell)
                .SetOptions(
                [
                    new OptionItem { Id = "p1", Title = "Critical", BadgeText = "P1", BadgeStyle = UIBadgeType.Danger, Description = "A region or a service is down" },
                    new OptionItem { Id = "p2", Title = "High", BadgeText = "P2", BadgeStyle = UIBadgeType.Warning, Description = "Customers notice, nothing is lost" },
                    new OptionItem { Id = "p3", Title = "Medium", BadgeText = "P3", BadgeStyle = UIBadgeType.Info, Description = "One customer, a way round it" },
                    new OptionItem { Id = "p4", Title = "Low", BadgeText = "P4", BadgeStyle = UIBadgeType.Surface, Description = "Waits for working hours" }
                ])
                .SetValue(["p1", "p2"]),
            note: "A Title is for an option whose badge is not its name: the list reads \"Critical P1\", the field the P1 alone. Where the badge is the name, leave Title unset, or the same words read twice."
        );
    }

    /// <summary>Free text: a customer's tags, the options standing as suggestions, a tag nobody has yet taken as typed.</summary>
    private static ContainerComponent CreateTagsGroup()
    {
        return DemoUI.CreateExample("A customer's tags, typed",
            new BadgeSelectComponent()
                .SetTitle("Tags on Bramble Studio")
                .SetPlaceholder("Type a tag")
                .SetAllowFreeText()
                .SetOptions(
                [
                    new OptionItem { Id = "enterprise", BadgeText = "enterprise", BadgeStyle = UIBadgeType.Primary, Description = "A contract of its own" },
                    new OptionItem { Id = "reseller", BadgeText = "reseller", BadgeStyle = UIBadgeType.Accent, Description = "Bills its own customers" },
                    new OptionItem { Id = "at-risk", BadgeText = "at risk", BadgeStyle = UIBadgeType.Danger, BadgeFill = UIBadgeFill.Outline, Description = "Usage falling for two months" },
                    new OptionItem { Id = "eu-only", BadgeText = "EU only", BadgeStyle = UIBadgeType.Surface, Description = "Data stays in the EU regions" }
                ])
                .SetValue(["enterprise", "eu-only", "design agency"])
                .SetShowClearButton(),
            note: "SetAllowFreeText: Enter or a comma makes a tag of the text, the options suggesting as you type. A tag no option has — \"design agency\" — stands as a badge of its own words with no look of its own."
        );
    }

    /// <summary>The labels a list's rows wear, chosen over the list to keep only the rows wearing them.</summary>
    private static ContainerComponent CreateFilterGroup()
    {
        return DemoUI.CreateExample("Filtering a list by its labels",
            UIPage.Band(UILayout.Stack(12,
                new TextInputComponent()
                    .SetPlaceholder("Search tickets")
                    .SetPrefixIcon(DemoIcons.Search),
                new BadgeSelectComponent()
                    .SetPlaceholder("Any label")
                    .SetPrefixIcon(DemoIcons.Filter)
                    .SetOptions(
                    [
                        new OptionItem { Id = "outage", BadgeText = "outage", BadgeStyle = UIBadgeType.Danger, BadgeFill = UIBadgeFill.Tinted },
                        new OptionItem { Id = "billing", BadgeText = "billing", BadgeStyle = UIBadgeType.Accent, BadgeFill = UIBadgeFill.Tinted },
                        new OptionItem { Id = "needs-details", BadgeText = "needs details", BadgeStyle = UIBadgeType.Warning, BadgeFill = UIBadgeFill.Tinted },
                        new OptionItem { Id = "resolved", BadgeText = "resolved", BadgeStyle = UIBadgeType.Success, BadgeFill = UIBadgeFill.Tinted }
                    ])
                    .SetValue(["outage"])
                    .SetShowClearButton()
                )
            ),
            note: "The filter wears the same badges as the rows it keeps, so a chosen one reads as the rows it means; with no title, the placeholder says what the empty field does."
        );
    }
}
