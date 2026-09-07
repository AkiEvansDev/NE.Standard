using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.Temporal;

/// <summary>
/// A calendar date: how it is written down, which dates may be chosen, and which day the week starts on.
/// </summary>
internal sealed class DateInputExamplesView : DemoExamplesView, IUIViewDefinition
{
    private static readonly DateOnly Release = new(2026, 8, 12);
    private static readonly DateOnly QuarterStart = new(2026, 7, 1);
    private static readonly DateOnly QuarterEnd = new(2026, 9, 30);

    public static string ViewKey => "demo.inputs.date-input.examples";

    protected override string ComponentRoute => "/inputs/date-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.date-input.header";
    protected override string HeaderDescription => "demo.inputs.date-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateUsesGroup(), CreateBoundsGroup(), CreateStateGroup()],
            [CreateFormatGroup(), CreateCalendarGroup()]
        ));
    }

    /// <summary>
    /// A period is one field with two ends, chosen on one calendar, rather than two fields kept in step by hand.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateGroup(null, "Where it is used",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new DateInputComponent()
                    .SetTitle("Reporting period")
                    .SetIcon(DemoIcons.History)
                    .SetIsRange()
                    .SetValue(QuarterStart)
                    .SetEndValue(Release)
                    .SetMin(QuarterStart)
                    .SetMax(QuarterEnd)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Release date")
                    .SetValue(Release)
                    .SetBadgeText("frozen")
                    .SetBadgeStyle(UIBadgeType.Warning)
                )
            ),
            contentMinHeight: 300
        );
    }

    /// <summary>
    /// <c>DisplayFormat</c> is what the field reads as; unset, the culture's own short pattern.
    /// </summary>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateGroup(null, "How it is written down",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new DateInputComponent()
                    .SetTitle("Unset — the culture's short date")
                    .SetValue(Release)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("yyyy-MM-dd")
                    .SetDisplayFormat("yyyy-MM-dd")
                    .SetValue(Release)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("dd MMM yyyy")
                    .SetDisplayFormat("dd MMM yyyy")
                    .SetValue(Release)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("dddd, d MMMM")
                    .SetDisplayFormat("dddd, d MMMM")
                    .SetValue(Release)
                )
            ),
            contentMinHeight: 340
        );
    }

    /// <summary>
    /// <c>Min</c>/<c>Max</c> grey out the calendar as well as refusing what is typed.
    /// </summary>
    private static ContainerComponent CreateBoundsGroup()
    {
        return DemoUI.CreateGroup(null, "Bounds",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new DateInputComponent()
                    .SetTitle("Inside one quarter")
                    .SetValue(Release)
                    .SetRange(QuarterStart, QuarterEnd)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Not before the release")
                    .SetValue(Release)
                    .SetMin(Release)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Not after it")
                    .SetValue(Release)
                    .SetMax(Release)
                )
            ),
            contentMinHeight: 280
        );
    }

    /// <summary>
    /// <c>FirstDayOfWeek</c> and <c>Step</c> are read once while the picker is built, so the Main page cannot show them.
    /// </summary>
    private static ContainerComponent CreateCalendarGroup()
    {
        return DemoUI.CreateGroup(null, "The calendar it opens",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new DateInputComponent()
                    .SetTitle("Weeks starting Monday")
                    .SetFirstDayOfWeek(UIDayOfWeek.Monday)
                    .SetValue(Release)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Weeks starting Sunday")
                    .SetFirstDayOfWeek(UIDayOfWeek.Sunday)
                    .SetValue(Release)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Arrow keys move a week at a time")
                    .SetStepDays(7)
                    .SetValue(Release)
                )
            ),
            contentMinHeight: 280
        );
    }

    /// <summary>The field's own surface, its affixes, and the states.</summary>
    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "Appearance and states",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new DateInputComponent()
                    .SetTitle("Underline")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetValue(Release)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("With an affix glyph")
                    .SetPrefixIcon(DemoIcons.History)
                    .SetValue(Release)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Read-only")
                    .SetValue(Release)
                    .SetIsReadOnly(true)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Disabled")
                    .SetValue(Release)
                    .SetEnabled(false)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Required, nothing chosen yet")
                    .Required("A date is required.")
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription("The picker opens aligned to **the toggle button** rather than to the left edge of the field: one anchor cannot both clear the row vertically *and* line up with a button centred inside it.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            ),
            contentMinHeight: 440
        );
    }
}
