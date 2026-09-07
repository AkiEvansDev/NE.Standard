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
/// A moment rather than a day or a time of day: one popup, and one value that carries an offset.
/// </summary>
internal sealed class DateTimeInputExamplesView : DemoExamplesView, IUIViewDefinition
{
    private static readonly DateTimeOffset Cutover = new(2026, 8, 12, 2, 30, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset WindowOpens = new(2026, 8, 12, 1, 0, 0, TimeSpan.Zero);
    private static readonly DateTimeOffset WindowCloses = new(2026, 8, 12, 5, 0, 0, TimeSpan.Zero);

    public static string ViewKey => "demo.inputs.date-time-input.examples";

    protected override string ComponentRoute => "/inputs/date-time-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.date-time-input.header";
    protected override string HeaderDescription => "demo.inputs.date-time-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateUsesGroup(), CreateBoundsGroup(), CreateAgainstNarrowerGroup()],
            [CreateFormatGroup(), CreateStateGroup()]
        ));
    }

    /// <summary>
    /// The jobs it is given: a scheduled moment, and the two ends of a window that may cross midnight.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateGroup(null, "Where it is used",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Cutover starts")
                    .SetIcon(DemoIcons.Clock)
                    .SetValue(Cutover)
                    .SetStepMinutes(15)
                )
                // One period: the calendar takes both ends, the clock the end being set, and the two fields cannot cross.
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Deploy freeze")
                    .SetIsRange()
                    .SetValue(WindowOpens)
                    .SetEndValue(WindowCloses)
                    .SetStepMinutes(30)
                    .SetBadgeText("UTC")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
            ),
            contentMinHeight: 300
        );
    }

    /// <summary>
    /// The format carries both halves at once; unset, the culture's short date and short time.
    /// </summary>
    private static ContainerComponent CreateFormatGroup()
    {
        return DemoUI.CreateGroup(null, "How it is written down",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Unset — the culture's short date and time")
                    .SetValue(Cutover)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("yyyy-MM-dd HH:mm")
                    .SetDisplayFormat("yyyy-MM-dd HH:mm")
                    .SetValue(Cutover)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("dd MMM yyyy, HH:mm:ss")
                    .SetDisplayFormat("dd MMM yyyy, HH:mm:ss")
                    .SetValue(Cutover)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("ddd d MMM, h:mm tt")
                    .SetDisplayFormat("ddd d MMM, h:mm tt")
                    .SetValue(Cutover)
                )
            ),
            contentMinHeight: 340
        );
    }

    /// <summary>
    /// Bounded at both ends, which greys out the calendar as well as refusing what is typed.
    /// </summary>
    private static ContainerComponent CreateBoundsGroup()
    {
        return DemoUI.CreateGroup(null, "Bounds, and the calendar it opens",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Inside the maintenance window")
                    .SetDisplayFormat("yyyy-MM-dd HH:mm")
                    .SetValue(Cutover)
                    .SetRange(WindowOpens, WindowCloses)
                    .SetStepMinutes(15)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Weeks starting Monday")
                    .SetFirstDayOfWeek(UIDayOfWeek.Monday)
                    .SetValue(Cutover)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Weeks starting Sunday")
                    .SetFirstDayOfWeek(UIDayOfWeek.Sunday)
                    .SetValue(Cutover)
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
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Underline")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetValue(Cutover)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("With an affix glyph")
                    .SetPrefixIcon(DemoIcons.Clock)
                    .SetValue(Cutover)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Read-only")
                    .SetValue(Cutover)
                    .SetIsReadOnly(true)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Disabled")
                    .SetValue(Cutover)
                    .SetEnabled(false)
                )
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("Required, nothing chosen yet")
                    .Required("A moment is required.")
                )
            ),
            contentMinHeight: 400
        );
    }

    /// <summary>
    /// The same moment expressed three ways; two narrow fields fail as soon as the time can belong to the next day.
    /// </summary>
    private static ContainerComponent CreateAgainstNarrowerGroup()
    {
        return DemoUI.CreateGroup(null, "Against a date and a time",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new DateTimeInputComponent()
                    .SetTitle("One field")
                    .SetDisplayFormat("yyyy-MM-dd HH:mm")
                    .SetValue(Cutover)
                    .SetStepMinutes(15)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Two fields — the day")
                    .SetDisplayFormat("yyyy-MM-dd")
                    .SetValue(new DateOnly(2026, 8, 12))
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("and the time of day")
                    .SetDisplayFormat("HH:mm")
                    .SetValue(new TimeOnly(2, 30))
                    .SetStepMinutes(15)
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription("**Split them** while the two answers are independent — a birthday and a reminder time. **Keep them together** when one is meaningless without the other, or when the window runs past midnight.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            ),
            contentMinHeight: 360
        );
    }
}
