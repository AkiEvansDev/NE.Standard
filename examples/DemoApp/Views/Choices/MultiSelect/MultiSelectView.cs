using DemoApp.Controllers.Base;
using DemoApp.Controllers.Choices.MultiSelect;
using DemoApp.Controllers.Inputs;
using DemoApp.Views.Base;

namespace DemoApp.Views.Choices.MultiSelect;

/// <summary>
/// One multi-select and every property that can be bound to it; then a set of weekdays, regions up to a limit, the people a page reaches drawn with their role, labels the reader types, and the field as a viewer sees it, read-only.
/// </summary>
/// <remarks>The value is bound both ways, so the Value row follows every chip the preview takes or lets go. The list stays open while options are toggled; a chip's cross, the clear button and Backspace in the field take chips out, and the arrows walk the chips.</remarks>
internal sealed class MultiSelectView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(MultiSelectController.ValueGroup);
    private const string FieldGroup = nameof(MultiSelectController.FieldGroup);
    private const string OptionsGroup = nameof(MultiSelectController.OptionsGroup);
    private const string ContentGroup = nameof(MultiSelectController.ContentGroup);
    private const string BadgeGroup = nameof(MultiSelectController.BadgeGroup);
    private const string BorderGroup = nameof(MultiSelectController.BorderGroup);

    public static string ViewKey => "demo.choices.multi-select";

    protected override string ComponentRoute => "/choices/multi-select";
    protected override string Header => "demo.choices.multi-select.header";
    protected override string HeaderDescription => "demo.choices.multi-select.description";

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new MultiSelectComponent()
            .BindStandard()
            .BindItems($"{OptionsGroup}.{nameof(OptionListGroupContext.Options)}")
            .BindValue($"{ValueGroup}.{nameof(OptionKeysValueGroupContext.Value)}")
            .BindMaxSelected($"{ValueGroup}.{nameof(OptionKeysValueGroupContext.MaxSelected)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(OptionKeysValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(OptionKeysValueGroupContext.Size)}")
            .BindAppearance($"{FieldGroup}.{nameof(MultiSelectFieldGroupContext.Appearance)}")
            .BindPlaceholder($"{FieldGroup}.{nameof(MultiSelectFieldGroupContext.Placeholder)}")
            .BindPrefixIcon($"{FieldGroup}.{nameof(MultiSelectFieldGroupContext.PrefixIcon)}")
            .BindSuffixIcon($"{FieldGroup}.{nameof(MultiSelectFieldGroupContext.SuffixIcon)}")
            .BindShowClearButton($"{FieldGroup}.{nameof(MultiSelectFieldGroupContext.ShowClearButton)}")
            .BindShowChevron($"{FieldGroup}.{nameof(MultiSelectFieldGroupContext.ShowChevron)}")
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
        // The staff and the read-only field stacked beside the labels, about as tall together; a field's sizes are the Text Input
        // page's, and options as badges the Badge Select page's.
        => [.. DemoUI.CreateColumns([CreateWeekdaysGroup()], [CreateRegionsGroup()]), DemoUI.CreateHalf(CreateStaffGroup(), CreateReadOnlyGroup()), CreateLabelsGroup()];

    /// <summary>The ordinary case: a set out of a short list, kept in the order it was chosen.</summary>
    private static ContainerComponent CreateWeekdaysGroup()
    {
        return DemoUI.CreateExample("Maintenance days",
            UILayout.Stack(12)
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Maintenance window runs on")
                    .SetPlaceholder("Pick the days")
                    .SetOptions(Weekdays())
                    .SetValue(["sat", "sun"])
                    .SetShowClearButton()
                )
                .AddChild(UIText.Note("The value is the chosen days' keys, each once, in the order they were picked — not the list's order."))
        );
    }

    /// <summary>A limit: past it the list refuses the options not chosen, and letting one go frees a place.</summary>
    private static ContainerComponent CreateRegionsGroup()
    {
        return DemoUI.CreateExample("Regions, at most three",
            UILayout.Stack(12)
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Replicate the database to")
                    .SetPlaceholder("Pick up to three regions")
                    .SetOptions(CloudRegions())
                    .SetValue(["eu-west", "eu-central"])
                    .SetMaxSelected(3)
                    .SetShowClearButton()
                )
                .AddChild(UIText.Note("Options are grouped by their own Group, as a select's are; a full field dims the rest until a chip goes."))
        );
    }

    /// <summary>Options carrying a glyph and a second line: the list draws them whole, a chip keeps only the name.</summary>
    private static ContainerComponent CreateStaffGroup()
    {
        return DemoUI.CreateExample("Who is paged",
            UILayout.Stack(12)
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Page on an incident")
                    .SetPlaceholder("Pick the on-call staff")
                    .SetPrefixIcon(DemoIcons.Bell)
                    .SetOptions(Staff())
                    .SetValue(["robin", "grace", "alex", "ada"])
                    .SetWidth(UILayoutLength.Absolute(360))
                )
                .AddChild(UIText.Note("Chips wrap onto another line inside the field rather than run past its edge."))
        );
    }

    /// <summary>A field that shows its chips but takes nothing: the same form as a viewer sees it.</summary>
    private static ContainerComponent CreateReadOnlyGroup()
    {
        return DemoUI.CreateExample("As a viewer sees it",
            UILayout.Stack(12)
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Replicated to")
                    .SetIsReadOnly(true)
                    .SetOptions(CloudRegions())
                    .SetValue(["us-east", "ap-south"])
                )
                .AddChild(UIText.Note("SetIsReadOnly(true): the chips stand without their remove and nothing can be added — the form a Viewer opens, the value still there to read."))
        );
    }

    /// <summary>
    /// Free text: the reader's own labels as chips — Enter or a comma adds one, a pasted list adds each — the options standing as
    /// suggestions, a rule every label must match and a limit, both refusing a label on the field's line; then a field whose Enter
    /// takes the first suggestion rather than the text.
    /// </summary>
    private static ContainerComponent CreateLabelsGroup()
    {
        return DemoUI.CreateExample("Labels, typed",
            UILayout.Stack(12)
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Labels on the ticket")
                    .SetPlaceholder("Type a label")
                    .SetAllowFreeText()
                    .SetOptions(Labels())
                    .SetValue(["billing", "needs-repro"])
                    .SetMaxSelected(5)
                    .RegexEach(@"^[^\s,]{2,24}$", "A label is 2 to 24 characters, with no spaces.")
                    .SetShowClearButton()
                )
                .AddChild(UIText.Note("SetAllowFreeText: Enter or a comma makes a chip of the text, and a pasted \"a, b, c\" three; the options are suggestions as you type, an arrow picks one. RegexEach refuses \"q 4\", and a sixth label is refused too — each stays in the entry, said on the field's line."))
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Watchers, the first suggestion taken")
                    .SetPlaceholder("Type a name")
                    .SetAllowFreeText()
                    .SetTagEntry(UITagEntry.FirstSuggestion)
                    .SetOptions(Staff())
                    .SetValue(["grace"])
                )
                .AddChild(UIText.Note("SetTagEntry(UITagEntry.FirstSuggestion): the first person the text names is marked as you type, and Enter takes them; a name nobody has is taken as typed, and Escape takes the mark off first."))
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

    private static OptionItem[] Labels()
        => [
            new() { Id = "billing", Title = "billing" },
            new() { Id = "backend", Title = "backend" },
            new() { Id = "frontend", Title = "frontend" },
            new() { Id = "needs-repro", Title = "needs-repro" },
            new() { Id = "security", Title = "security" },
            new() { Id = "docs", Title = "docs" }
        ];

    private static OptionItem[] Staff()
        => [
            new() { Id = "sam", Icon = DemoIcons.UserRound, Title = "Sam Ortega", Description = "Owner" },
            new() { Id = "robin", Icon = DemoIcons.UserRound, Title = "Robin Hale", Description = "Admin" },
            new() { Id = "alex", Icon = DemoIcons.UserRound, Title = "Alex Warren", Description = "Admin" },
            new() { Id = "grace", Icon = DemoIcons.UserRound, Title = "Grace Kim", Description = "Admin" },
            new() { Id = "ada", Icon = DemoIcons.UserRound, Title = "Ada Lin", Description = "Admin" }
        ];
}
