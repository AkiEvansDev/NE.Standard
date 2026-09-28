using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.MultiSelect;

/// <summary>
/// What a multi-select is used for: a set of weekdays, regions up to a limit, the people a page reaches drawn with their role, and
/// the field at its three sizes and read-only.
/// </summary>
/// <remarks>The list stays open while options are toggled; a chip's cross, the clear button and Backspace in the field take chips out.</remarks>
internal sealed class MultiSelectExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.multi-select.examples";

    protected override string ComponentRoute => "/inputs/multi-select";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.multi-select.header";
    protected override string HeaderDescription => "demo.inputs.multi-select.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateWeekdaysGroup(), CreateStaffGroup()], [CreateRegionsGroup(), CreateSizesGroup()]));

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
                    .SetValue(["robin", "grace"])
                    .SetWidth(UILayoutLength.Absolute(360))
                )
                .AddChild(UIText.Note("Chips wrap onto another line inside the field rather than run past its edge."))
        );
    }

    /// <summary>The field's three sizes, a caption inside the box, and a field that shows its chips but takes nothing.</summary>
    private static ContainerComponent CreateSizesGroup()
    {
        return DemoUI.CreateExample("Sizes, and read-only",
            UILayout.Stack(12)
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Small, caption inside")
                    .SetSize(UIInputSize.Small)
                    .SetAppearance(UIInputAppearance.Outline)
                    .SetTitlePlacement(UIInputTitlePlacement.Inside)
                    .SetOptions(Weekdays())
                    .SetValue(["mon", "wed", "fri"])
                )
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Large, underlined")
                    .SetSize(UIInputSize.Large)
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetOptions(Weekdays())
                    .SetValue(["tue", "thu"])
                )
                .AddChild(new MultiSelectComponent()
                    .SetTitle("Read-only")
                    .SetIsReadOnly(true)
                    .SetOptions(CloudRegions())
                    .SetValue(["us-east", "ap-south"])
                )
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
}
