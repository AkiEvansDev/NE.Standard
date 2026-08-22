using System;
using DemoApp.Controllers.Inputs.DateInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.DateInput;

/// <summary>
/// The two seams worth clicking, and the only place the whole value path is visible end to end. Shared by
/// all three temporal components rather than repeated per type: Time and DateTime run the same engine, the
/// same normalizer and the same formatter, so a third copy of this page would re-verify one code path.
/// <list type="bullet">
/// <item>
/// <b>Typed input.</b> The field is read under <c>Format</c> "dd.MM.yyyy" but displayed under
/// <c>DisplayFormat</c> "MMM d, yyyy" — deliberately different, so the log proves the server parsed what was
/// typed rather than echoing it back. Type <c>03.04.2026</c> and the calendar must land on 3 April, not
/// 4 March.
/// </item>
/// <item>
/// <b>Range.</b> Days outside <c>Min</c>/<c>Max</c> are unclickable in the grid, and arrow keys skip past
/// them — a native date input enforced nothing here.
/// </item>
/// </list>
/// </summary>
internal sealed class DateInputTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.date-input.test";

    protected override string ComponentRoute => "/inputs/date-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.date-input.header";
    protected override string HeaderDescription => "demo.inputs.date-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateCommitGroup())
            .AddChild(CreateRangeGroup());
    }

    private static ContainerComponent CreateCommitGroup()
    {
        return DemoUI.CreateGroup(nameof(DateInputTestController.CommitGroup), "Typed input and picking",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new TextComponent()
                    .SetDescription("Typed as dd.MM.yyyy, shown as MMM d, yyyy. Type 03.04.2026 and commit — the log should read 2026-04-03. Type 31.02.2026 and the server refuses it: the message below appears, the text you typed stays, and the log does not move.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetWrapMode(UITextWrapMode.Wrap)
                    .SetPlacement(1, 1, 24, 1)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Ships on")
                    .SetFormat("dd.MM.yyyy")
                    .SetDisplayFormat("MMM d, yyyy")
                    .SetFormatMessage("Enter a date as DD.MM.YYYY.")
                    .BindValue(nameof(DateCommitGroupContext.Value), UIBindingScope.Relative)
                    .OnChange(nameof(DateInputTestController.RecordChange))
                    .SetPlacement(1, 2, 24, 1)
                )
            ),
            static _ => { },
            contentMinHeight: 420
        );
    }

    private static ContainerComponent CreateRangeGroup()
    {
        return DemoUI.CreateGroup(nameof(DateInputTestController.RangeGroup), "Range and keyboard",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new TextComponent()
                    .SetDescription("Limited to 10–24 April 2026. Open with ArrowDown, move with the arrows, PageUp/PageDown by month, Enter to commit.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetWrapMode(UITextWrapMode.Wrap)
                    .SetPlacement(1, 1, 24, 1)
                )
                .AddChild(new DateInputComponent()
                    .SetTitle("Ships on")
                    .SetRange(new DateOnly(2026, 4, 10), new DateOnly(2026, 4, 24))
                    .BindValue(nameof(DateCommitGroupContext.Value), UIBindingScope.Relative)
                    .OnChange(nameof(DateInputTestController.RecordRangeChange))
                    .SetPlacement(1, 2, 24, 1)
                )
            ),
            static _ => { },
            contentMinHeight: 420
        );
    }
}
