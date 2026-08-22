using System.Collections.Generic;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.Select;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Select;

/// <summary>
/// <c>AllowEmptySelection</c> is absent for the same reason as on the Search page: it decides whether the
/// clear affordance is rendered at all (<c>SelectComponentRenderer.IsStaticallyClearable</c>), so binding
/// it would produce a control that does nothing. The example page shows it statically.
/// </summary>
internal sealed class SelectBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.select.binding";

    protected override string ComponentRoute => "/inputs/select";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.select.header";
    protected override string HeaderDescription => "demo.inputs.select.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateValueGroup())
            .AddChild(CreatePlaceholderGroup())
            .AddChild(CreateOptionsGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new SelectComponent().SetValue("second").SetOptions(CreateEnvironments()));

    /// <summary>
    /// Cycling <c>Value</c> from the server is the half a click cannot show: the closed trigger has to
    /// pick up an option it was never clicked into, and its last step clears the value entirely.
    /// </summary>
    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(SelectBindingController.ValueGroup), "Value",
            content => content.AddChild(new SelectComponent()
                .SetOptions(CreateEnvironments())
                .BindValue(nameof(OptionsValueGroupContext.Value), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(OptionsValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(SelectBindingController.CycleValue),
                ["Read-only"] = nameof(SelectBindingController.ToggleIsReadOnly),
            }),
            contentMinHeight: 130
        );
    }

    private static ContainerComponent CreatePlaceholderGroup()
    {
        return DemoUI.CreateGroup(nameof(SelectBindingController.PlaceholderGroup), "Placeholder",
            content => content.AddChild(new SelectComponent()
                .SetOptions(CreateEnvironments())
                .BindPlaceholder(nameof(SelectPlaceholderGroupContext.Placeholder), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Placeholder"] = nameof(SelectBindingController.CyclePlaceholder),
            }),
            contentMinHeight: 120
        );
    }

    /// <summary>
    /// Options rendered client-side after attach. "Rename selected" mutates the very option the closed
    /// trigger is showing a clone of, so a clone that had gone stale would be visible at once.
    /// </summary>
    private static ContainerComponent CreateOptionsGroup()
    {
        return DemoUI.CreateGroup(nameof(SelectBindingController.OptionsGroup), "Bound options",
            content => content.AddChild(new SelectComponent()
                .SetPlaceholder("Pick an environment…")
                .SetAllowEmptySelection(true)
                .BindValue(nameof(OptionsCollectionGroupContext.Value), UIBindingScope.Relative)
                .BindOptions(nameof(OptionsCollectionGroupContext.Options), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add"] = nameof(SelectBindingController.AddOption),
                ["Remove"] = nameof(SelectBindingController.RemoveOption),
                ["Select first"] = nameof(SelectBindingController.SelectFirst),
                ["Rename selected"] = nameof(SelectBindingController.RenameSelected),
            }),
            contentMinHeight: 190
        );
    }

    private static OptionItem[] CreateEnvironments()
        =>
        [
            new OptionItem { Id = "first", Title = "Development", Description = "Rebuilt on every push", Icon = LucideIcons.Wrench },
            new OptionItem { Id = "second", Title = "Staging", Description = "Mirrors production data", Icon = LucideIcons.Upload },
            new OptionItem { Id = "third", Title = "Production", Description = "Live traffic", Icon = LucideIcons.BadgeCheck },
        ];
}
