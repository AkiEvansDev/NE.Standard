using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.Temporal;

/// <summary>
/// The one temporal control with no popup: a segmented editor, one span per clock unit, built from the
/// <c>DisplayFormat</c> tokens.
/// </summary>
internal sealed class TimeInputExamplesView : DemoExamplesView, IUIViewDefinition
{
    private static readonly TimeOnly Standup = new(9, 30);
    private static readonly TimeOnly Window = new(2, 15, 30);

    public static string ViewKey => "demo.inputs.time-input.examples";

    protected override string ComponentRoute => "/inputs/time-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.time-input.header";
    protected override string HeaderDescription => "demo.inputs.time-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateUsesGroup(), CreateStepGroup()],
            [CreateSegmentsGroup(), CreateBoundsGroup()]
        ));
    }

    /// <summary>The jobs it is given, and the pair that is a window rather than a moment.</summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateGroup(null, "Where it is used",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new TimeInputComponent()
                    .SetTitle("Daily digest is sent at")
                    .SetIcon(DemoIcons.Clock)
                    .SetValue(Standup)
                    .SetStepMinutes(15)
                )
                // One period: two clocks in the row, one stepper, and an end stepped past the start swaps with it.
                .AddChild(new TimeInputComponent()
                    .SetTitle("Maintenance window")
                    .SetIsRange()
                    .SetValue(new TimeOnly(2, 0))
                    .SetEndValue(new TimeOnly(4, 0))
                    .SetStepMinutes(30)
                    .SetBadgeText("UTC")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("Quiet hours end at")
                    .SetPrefixIcon(DemoIcons.Clock)
                    .SetDisplayFormat("HH:mm")
                    .SetValue(new TimeOnly(7, 0))
                    .SetStepMinutes(30)
                )
            )
        );
    }

    /// <summary>
    /// The format decides which segments the editor has; one with no seconds has no seconds segment to tab into.
    /// </summary>
    private static ContainerComponent CreateSegmentsGroup()
    {
        return DemoUI.CreateGroup(null, "Which segments it has",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new TimeInputComponent()
                    .SetTitle("Unset — the culture's short time")
                    .SetValue(Standup)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("HH:mm — two segments, 24 hours")
                    .SetDisplayFormat("HH:mm")
                    .SetValue(Standup)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("HH:mm:ss — three")
                    .SetDisplayFormat("HH:mm:ss")
                    .SetValue(Window)
                )
            )
        );
    }

    /// <summary>
    /// <c>Step</c> is what the arrows and the wheel move by, read once while the editor is built.
    /// </summary>
    private static ContainerComponent CreateStepGroup()
    {
        return DemoUI.CreateGroup(null, "What the arrows move by",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new TimeInputComponent()
                    .SetTitle("A minute at a time")
                    .SetDisplayFormat("HH:mm")
                    .SetStepMinutes(1)
                    .SetValue(Standup)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("A quarter of an hour")
                    .SetDisplayFormat("HH:mm")
                    .SetStepMinutes(15)
                    .SetValue(Standup)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("Five seconds")
                    .SetDisplayFormat("HH:mm:ss")
                    .SetStepSeconds(5)
                    .SetValue(Window)
                )
            )
        );
    }

    /// <summary>
    /// <c>Min</c>/<c>Max</c> on a bounded line rather than a wrapping dial: past midnight needs two fields and a date.
    /// </summary>
    private static ContainerComponent CreateBoundsGroup()
    {
        return DemoUI.CreateGroup(null, "Bounds",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new TimeInputComponent()
                    .SetTitle("Working hours")
                    .SetDisplayFormat("HH:mm")
                    .SetValue(Standup)
                    .SetRange(new TimeOnly(8, 0), new TimeOnly(18, 0))
                    .SetStepMinutes(30)
                )
                .AddChild(new TimeInputComponent()
                    .SetTitle("Not before 08:00")
                    .SetDisplayFormat("HH:mm")
                    .SetValue(Standup)
                    .SetMin(new TimeOnly(8, 0))
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription("The editor is **segments only** — free text is gone for this control, so nothing it produces can fail to parse and `FormatMessage` is never reached from it.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            )
        );
    }
}
