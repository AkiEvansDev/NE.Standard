using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
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
            [CreateFormGroup()],
            [CreateCommentGroup()]
        ));

        _ = container.AddChild(CreateHeightGroup());
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
            )
        );
    }

    /// <summary>
    /// The other place it lives: a box that is sent rather than saved, kept small so the thread stays readable.
    /// </summary>
    private static ContainerComponent CreateCommentGroup()
    {
        return DemoUI.CreateGroup(null, "A box that is sent",
            content => content.AddChild(new CardComponent()
                .ConfigureDefaultHeader(header => header
                    .SetIcon(DemoIcons.MessageSquare)
                    .SetTitle("Add a comment")
                    .SetDescription("Everyone watching the incident is notified")
                )
                .SetContent(new TextAreaComponent()
                    .SetPlaceholder("What did you find?")
                    .SetRows(3)
                    .SetMaxLength(280)
                )
                .SetFooter(DemoUI.CreateRow(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Send))
                        .SetTitle("Comment")
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .SetTitle("Discard")
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// The two decisions the author makes once: how tall the box starts, and whether the reader may change that.
    /// </summary>
    /// <remarks>Side by side, because the pair is a choice — stacked, three boxes of prose read as one long form.</remarks>
    private static ContainerComponent CreateHeightGroup()
    {
        return DemoUI.CreateGroup(null, "How tall it starts, and who may change it",
            content => content.AddChild(DemoUI.CreateRow(24)
                .AddChild(CreateSized("Two rows, fixed — a line in a dense form", 2, UITextAreaResizeMode.None, "A note nobody should turn into an essay."))
                .AddChild(CreateSized("Four rows, the reader may pull it taller", 4, UITextAreaResizeMode.Vertical, Incident))
                .AddChild(CreateSized("Six rows — the writing is the page", 6, UITextAreaResizeMode.Vertical, Incident))
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24,
            note: "`Rows` is the height the box is drawn at, not where it stays; `Vertical` is the only resize a column survives, since the other two let the box push its neighbours out."
        );
    }

    private static StackPanelComponent CreateSized(string caption, int rows, UITextAreaResizeMode resize, string value)
        => DemoUI.CreateCaptionedItem(caption, new TextAreaComponent()
            .SetWidth(UILayoutLength.Absolute(340))
            .SetValue(value)
            .SetRows(rows)
            .SetResize(resize)
        );
}
