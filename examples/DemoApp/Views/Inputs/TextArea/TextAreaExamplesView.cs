using DemoApp.Views.Base;

namespace DemoApp.Views.Inputs.TextArea;

/// <summary>
/// The multi-line field: how tall it starts, whether the reader may pull it taller, and what a limit looks like.
/// </summary>
internal sealed class TextAreaExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string Incident = "The scheduler stopped acknowledging heartbeats at 09:14 UTC. Three regions failed over cleanly; eu-west held its lease for another ninety seconds and served stale reads for the duration.";

    public static string ViewKey => "demo.inputs.text-area.examples";

    protected override string ComponentRoute => "/inputs/text-area";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.text-area.header";
    protected override string HeaderDescription => "demo.inputs.text-area.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns([CreateFormGroup()], [CreateCommentGroup()]));

        _ = container.AddChild(CreateHeightGroup());
    }

    /// <summary>The ordinary case: a labelled box of prose, and the same box with nothing in it yet.</summary>
    private static ContainerComponent CreateFormGroup()
    {
        return DemoUI.CreateExample("Where it is used",
            UILayout.Stack(12)
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
        );
    }

    /// <summary>
    /// The other place it lives: a box that is sent rather than saved, kept small so the thread stays readable.
    /// </summary>
    private static ContainerComponent CreateCommentGroup()
    {
        return DemoUI.CreateExample("A box that is sent",
            new CardComponent()
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
                .SetFooter(UILayout.Row(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .SetIcon(DemoIcons.Outline(DemoIcons.Send))
                        .SetTitle("Comment")
                    )
                    .AddChild(UIButtons.Ghost("Discard"))
                )
        );
    }

    /// <summary>
    /// The two decisions the author makes once: how tall the box starts, and whether the reader may change that.
    /// </summary>
    /// <remarks>Side by side, because the pair is a choice — stacked, three boxes of prose read as one long form.</remarks>
    private static ContainerComponent CreateHeightGroup()
    {
        return DemoUI.CreateExample("How tall it starts, and who may change it",
            UILayout.Row(24)
                .AddChild(UIPage.Labelled("Two rows, fixed — a line in a dense form", new TextAreaComponent()
                    .SetWidth(UILayoutLength.Absolute(340))
                    .SetValue("A note nobody should turn into an essay.")
                    .SetRows(2)
                    .SetResize(UITextAreaResizeMode.None)
                    )
                )
                .AddChild(UIPage.Labelled("Four rows, the reader may pull it taller", new TextAreaComponent()
                    .SetWidth(UILayoutLength.Absolute(340))
                    .SetValue(Incident)
                    .SetRows(4)
                    .SetResize(UITextAreaResizeMode.Vertical)
                    )
                )
                .AddChild(UIPage.Labelled("Six rows — the writing is the page", new TextAreaComponent()
                    .SetWidth(UILayoutLength.Absolute(340))
                    .SetValue(Incident)
                    .SetRows(6)
                    .SetResize(UITextAreaResizeMode.Vertical)
                    )
                ),
            columns: 24,
            note: "`Rows` is the height the box is drawn at, not where it stays; `Vertical` is the only resize a column survives, since the other two let the box push its neighbours out."
        );
    }
}
