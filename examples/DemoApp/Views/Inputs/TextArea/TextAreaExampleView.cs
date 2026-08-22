using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.TextArea;

internal sealed class TextAreaExampleView : DemoExampleView, IUIViewDefinition
{
    private const string SampleNotes = "Rolls the API back to 4.8.0 and re-enables the read replica.\nMigrations are reversible.";

    public static string ViewKey => "demo.inputs.text-area.example";

    protected override string ComponentRoute => "/inputs/text-area";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.inputs.text-area.header";
    protected override string HeaderDescription => "demo.inputs.text-area.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateReleaseGroup())
            .AddChild(CreateSizeGroup())
            .AddChild(CreateStateGroup());
    }

    /// <summary>The ordinary case: a labelled multi-line field with a character budget.</summary>
    private static ContainerComponent CreateReleaseGroup()
    {
        return DemoUI.CreateGroup(null, "Release notes",
            content => content.AddChild(new TextAreaComponent()
                .SetTitle("What changed")
                .SetIcon(LucideIcons.History)
                .SetBadgeText("shown to users")
                .SetBadgeStyle(UIBadgeType.Info)
                .SetValue(SampleNotes)
                .SetRows(5)
                .SetMaxLength(280)
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 220
        );
    }

    /// <summary>
    /// <c>Rows</c> sets the field's natural height; <c>Resize</c> decides whether the user may change it
    /// afterwards. The two are worth seeing together, since a fixed <c>Rows</c> with
    /// <c>UITextAreaResizeMode.None</c> is the only truly fixed-height variant.
    /// </summary>
    private static ContainerComponent CreateSizeGroup()
    {
        return DemoUI.CreateGroup(null, "Size and resize",
            content => content.AddChild(CreateStack()
                .AddChild(new TextAreaComponent()
                    .SetTitle("Two rows, fixed")
                    .SetValue("Short summary.")
                    .SetRows(2)
                    .SetResize(UITextAreaResizeMode.None)
                )
                .AddChild(new TextAreaComponent()
                    .SetTitle("Four rows, resizable vertically")
                    .SetValue(SampleNotes)
                    .SetRows(4)
                    .SetResize(UITextAreaResizeMode.Vertical)
                )
            ),
            static _ => { },
            contentMinHeight: 300
        );
    }

    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(CreateStack()
                .AddChild(new TextAreaComponent()
                    .SetTitle("Read-only")
                    .SetValue("Generated from the changelog.")
                    .SetRows(2)
                    .SetIsReadOnly(true)
                )
                .AddChild(new TextAreaComponent()
                    .SetTitle("Disabled")
                    .SetValue("Locked while the deploy runs.")
                    .SetRows(2)
                    .SetEnabled(false)
                )
                .AddChild(new TextAreaComponent()
                    .SetTitle("Required")
                    .SetRows(2)
                    .Required("Describe what changed.")
                )
            ),
            static _ => { },
            contentMinHeight: 380
        );
    }

    private static StackPanelComponent CreateStack()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .SetPlacement(1, 1, 24, 1);
}
