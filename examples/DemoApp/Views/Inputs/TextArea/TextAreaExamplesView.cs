using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.TextArea;

/// <summary>
/// The multi-line field: how tall it starts, whether the reader may pull it taller, and what a limit looks like.
/// </summary>
internal sealed class TextAreaExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string Incident = "The scheduler stopped acknowledging heartbeats at 09:14 UTC. Three regions failed over cleanly; eu-west-1 held its lease for another ninety seconds and served stale reads for the duration.";

    public static string ViewKey => "demo.inputs.text-area.examples";

    protected override string ComponentRoute => "/inputs/text-area";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.text-area.header";
    protected override string HeaderDescription => "demo.inputs.text-area.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateFormGroup(), CreateResizeGroup()],
            [CreateRowsGroup(), CreateStateGroup()]
        ));
    }

    /// <summary>The ordinary case: a labelled box of prose, and the same box with nothing in it yet.</summary>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateGroup(null, "Where it is used",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new TextAreaComponent()
                    .SetTitle("Incident summary")
                    .SetIcon(DemoIcons.FileText)
                    .SetValue(Incident)
                    .SetRows(4)
                )
                .AddChild(new TextAreaComponent()
                    .SetTitle("Follow-up actions")
                    .SetPlaceholder("One per line — owner, then what they are doing about it.")
                    .SetRows(3)
                )
            ),
            contentMinHeight: 320
        );
    }

    /// <summary>
    /// <c>Rows</c> is the height the field is drawn at with nothing in it, not where it stays.
    /// </summary>
    private static ContainerComponent CreateRowsGroup()
    {
        return DemoUI.CreateGroup(null, "Rows",
            content =>
            {
                StackPanelComponent stack = DemoUI.CreateStack();

                foreach (var rows in (int[])[2, 4, 6])
                {
                    _ = stack.AddChild(new TextAreaComponent()
                        .SetTitle($"Rows = {rows}")
                        .SetValue(Incident)
                        .SetRows(rows)
                    );
                }

                _ = content.AddChild(stack);
            },
            contentMinHeight: 420
        );
    }

    /// <summary>
    /// Whether the box may be dragged bigger, and along which axis; only <c>Vertical</c> keeps it in its column.
    /// </summary>
    private static ContainerComponent CreateResizeGroup()
    {
        return DemoUI.CreateGroup(null, "Resize",
            content =>
            {
                StackPanelComponent stack = DemoUI.CreateStack();

                foreach (UITextAreaResizeMode mode in Enum.GetValues<UITextAreaResizeMode>())
                {
                    _ = stack.AddChild(new TextAreaComponent()
                        .SetTitle(mode.ToString())
                        .SetValue("Drag the corner.")
                        .SetResize(mode)
                        .SetRows(2)
                    );
                }

                _ = content.AddChild(stack);
            },
            contentMinHeight: 460
        );
    }

    /// <summary>
    /// The field's own surface and states; <c>Underline</c> runs its rule under the whole box.
    /// </summary>
    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "Appearance and states",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new TextAreaComponent()
                    .SetTitle("Underline")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetValue("An edit-in-place note.")
                    .SetRows(2)
                )
                .AddChild(new TextAreaComponent()
                    .SetTitle("Read-only")
                    .SetValue(Incident)
                    .SetIsReadOnly(true)
                    .SetRows(3)
                )
                .AddChild(new TextAreaComponent()
                    .SetTitle("Disabled")
                    .SetValue("Locked while the incident is open.")
                    .SetEnabled(false)
                    .SetRows(2)
                )
                .AddChild(new TextAreaComponent()
                    .SetTitle("Required, and limited to 60 characters")
                    .SetBadgeText("60 max")
                    .SetBadgeStyle(UIBadgeType.Info)
                    .SetPlaceholder("One sentence.")
                    .SetMaxLength(60)
                    .SetRows(2)
                    .Required("A summary is required.")
                )
            ),
            contentMinHeight: 460
        );
    }
}
