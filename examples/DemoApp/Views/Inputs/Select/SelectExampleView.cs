using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Select;

/// <summary>
/// Select shares its popup, options and trigger-content mechanics with Search — its own binding/test
/// pages land with the selection-input group.
/// </summary>
internal sealed class SelectExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.select.example";

    protected override string ComponentRoute => "/inputs/select";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.select.header";
    protected override string HeaderDescription => "demo.inputs.select.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateEnvironmentGroup())
            .AddChild(CreateStateGroup());
    }

    /// <summary>
    /// The closed trigger shows the selected option through its own item template — icon, title and
    /// description, not a plain string — which is the reason this is not a native <c>&lt;select&gt;</c>.
    /// </summary>
    private static ContainerComponent CreateEnvironmentGroup()
    {
        return DemoUI.CreateGroup(null, "Deploy target",
            content => content.AddChild(CreateStack()
                .AddChild(new SelectComponent()
                    .SetTitle("Environment")
                    .SetValue("staging")
                    .SetOptions(CreateEnvironments())
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Nothing selected yet")
                    .SetPlaceholder("Pick an environment…")
                    .SetOptions(CreateEnvironments())
                )
                .AddChild(new SelectComponent()
                    .SetTitle("With a field icon")
                    .SetPrefixIcon(LucideIcons.Server)
                    .SetValue("staging")
                    .SetOptions(CreateEnvironments())
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
                .AddChild(new SelectComponent()
                    .SetTitle("Clearable")
                    .SetAllowEmptySelection(true)
                    .SetValue("production")
                    .SetOptions(CreateEnvironments())
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Read-only")
                    .SetIsReadOnly(true)
                    .SetValue("staging")
                    .SetOptions(CreateEnvironments())
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Required")
                    .SetPlaceholder("Pick an environment…")
                    .SetOptions(CreateEnvironments())
                    .Required("An environment is required.")
                )
            ),
            static _ => { },
            contentMinHeight: 300
        );
    }

    private static StackPanelComponent CreateStack()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(16)
            .SetPlacement(1, 1, 24, 1);


    private static OptionItem[] CreateEnvironments()
        =>
        [
            new OptionItem { Id = "dev", Title = "Development", Description = "Rebuilt on every push", Icon = LucideIcons.Wrench },
            new OptionItem { Id = "staging", Title = "Staging", Description = "Mirrors production data", Icon = LucideIcons.Upload },
            new OptionItem { Id = "production", Title = "Production", Description = "Live traffic", Icon = LucideIcons.BadgeCheck },
        ];
}
