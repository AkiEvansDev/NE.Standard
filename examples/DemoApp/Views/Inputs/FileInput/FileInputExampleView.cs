using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.FileInput;

/// <summary>
/// Picker-only: the control opens the OS file dialog and shows what was chosen, but nothing is uploaded —
/// that arrives with <c>docs/PLAN.md</c> §4, and so does the <c>test</c> page.
/// </summary>
internal sealed class FileInputExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.file-input.example";

    protected override string ComponentRoute => "/inputs/file-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.file-input.header";
    protected override string HeaderDescription => "demo.inputs.file-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateReleaseGroup())
            .AddChild(CreateAcceptGroup())
            .AddChild(CreateStateGroup());
    }

    /// <summary>The ordinary case: a labelled picker with a file already attached.</summary>
    private static ContainerComponent CreateReleaseGroup()
    {
        return DemoUI.CreateGroup(null, "Release artifact",
            content => content.AddChild(new FileInputComponent()
                .SetTitle("Build output")
                .SetIcon(LucideIcons.Package)
                .SetBadgeText("required to ship")
                .SetBadgeStyle(UIBadgeType.Info)
                .SetValue("nova-api-4.8.1.zip")
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 160
        );
    }

    /// <summary>
    /// <c>Accept</c> narrows the OS dialog's own filter; <c>Multiple</c> decides whether more than one file
    /// can come back. Both are worth seeing together, since the field's text is what tells the two apart
    /// once a selection exists — one name, or a count.
    /// </summary>
    private static ContainerComponent CreateAcceptGroup()
    {
        return DemoUI.CreateGroup(null, "Accepted files",
            content => content.AddChild(CreateStack()
                .AddChild(new FileInputComponent()
                    .SetTitle("Changelog (.md or .txt)")
                    .SetAccept(".md,.txt")
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Screenshots (images only, several)")
                    .SetAccept("image/*")
                    .SetMultiple(true)
                )
            ),
            static _ => { },
            contentMinHeight: 240
        );
    }

    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(CreateStack()
                .AddChild(new FileInputComponent()
                    .SetTitle("Read-only")
                    .SetValue("signed-manifest.json")
                    .SetIsReadOnly(true)
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Disabled")
                    .SetValue("signed-manifest.json")
                    .SetEnabled(false)
                )
                .AddChild(new FileInputComponent()
                    .SetTitle("Required")
                    .Required("Attach the build output.")
                )
            ),
            static _ => { },
            contentMinHeight: 340
        );
    }

    private static StackPanelComponent CreateStack()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(12)
            .SetPlacement(1, 1, 24, 1);
}
