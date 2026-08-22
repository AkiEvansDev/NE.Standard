using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Checkbox;

internal sealed class CheckboxExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.checkbox.example";

    protected override string ComponentRoute => "/inputs/checkbox";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.checkbox.header";
    protected override string HeaderDescription => "demo.inputs.checkbox.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateDeployGroup())
            .AddChild(CreateContentGroup())
            .AddChild(CreateStateGroup());
    }

    /// <summary>The ordinary case: a short list of options, some of them already on.</summary>
    private static ContainerComponent CreateDeployGroup()
    {
        return DemoUI.CreateGroup(null, "Deploy options",
            content => content.AddChild(CreateStack()
                .AddChild(Option("Run migrations", value: true))
                .AddChild(Option("Invalidate CDN cache", value: false))
                .AddChild(Option("Notify the team channel", value: true))
                .AddChild(Option("Tag the release", value: false))
            ),
            static _ => { },
            contentMinHeight: 160
        );
    }

    /// <summary>
    /// The label is a full text surface, not a plain string — icon, title and badge all render inside it,
    /// which is what makes a checkbox usable as a settings row rather than only as a form field.
    /// </summary>
    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(null, "Labelled options",
            content => content.AddChild(CreateStack()
                .AddChild(new CheckboxComponent()
                    .SetTitle("Require review before deploy")
                    .SetIcon(LucideIcons.BadgeCheck)
                    .SetValue(true)
                )
                .AddChild(new CheckboxComponent()
                    .SetTitle("Keep build artifacts")
                    .SetIcon(LucideIcons.Download)
                    .SetBadgeText("30 days")
                    .SetBadgeStyle(UIBadgeType.Info)
                )
                .AddChild(new CheckboxComponent()
                    .SetTitle("Allow force push")
                    .SetIcon(LucideIcons.Wrench)
                    .SetBadgeText("risky")
                    .SetBadgeStyle(UIBadgeType.Danger)
                )
            ),
            static _ => { },
            contentMinHeight: 160
        );
    }

    /// <summary>
    /// The reference strip. <c>IsReadOnly</c> and <c>Enabled = false</c> are worth showing side by side:
    /// they look similar but differ in intent — a read-only box still reads as a value being reported,
    /// a disabled one as a control that is currently out of reach.
    /// </summary>
    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(CreateStack()
                .AddChild(Option("Unchecked", value: false))
                .AddChild(Option("Checked", value: true))
                .AddChild(Option("Read-only", value: true).SetIsReadOnly(true))
                .AddChild(Option("Disabled", value: false).SetEnabled(false))
                .AddChild(Option("Required", value: false).Required("Confirm to continue."))
            ),
            static _ => { },
            contentMinHeight: 190
        );
    }

    private static StackPanelComponent CreateStack()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(10)
            .SetPlacement(1, 1, 24, 1);

    private static CheckboxComponent Option(string title, bool value)
        => new CheckboxComponent()
            .SetTitle(title)
            .SetValue(value);
}
