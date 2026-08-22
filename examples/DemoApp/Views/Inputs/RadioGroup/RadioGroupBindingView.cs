using System.Collections.Generic;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.RadioGroup;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.RadioGroup;

internal sealed class RadioGroupBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.radio-group.binding";

    protected override string ComponentRoute => "/inputs/radio-group";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.radio-group.header";
    protected override string HeaderDescription => "demo.inputs.radio-group.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateValueGroup())
            .AddChild(CreateLayoutGroup())
            .AddChild(CreateOptionsGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new RadioGroupComponent().SetValue("second").SetOptions(CreateStrategies()));

    /// <summary>
    /// A radio group has no single value-bearing element — it renders one native radio per option — so a
    /// value arriving from the server has to re-check the right one imperatively (see
    /// <c>RadioGroupSyncEngine</c>). Cycling <c>Value</c> here is what exercises that path.
    /// </summary>
    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(RadioGroupBindingController.ValueGroup), "Value",
            content => content.AddChild(new RadioGroupComponent()
                .SetOptions(CreateStrategies())
                .BindValue(nameof(OptionsValueGroupContext.Value), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(OptionsValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(RadioGroupBindingController.CycleValue),
                ["Read-only"] = nameof(RadioGroupBindingController.ToggleIsReadOnly),
            }),
            contentMinHeight: 190
        );
    }

    private static ContainerComponent CreateLayoutGroup()
    {
        return DemoUI.CreateGroup(nameof(RadioGroupBindingController.LayoutGroup), "Layout",
            content => content.AddChild(new RadioGroupComponent()
                .SetValue("second")
                .SetOptions(CreateShortOptions())
                .BindOrientation(nameof(RadioGroupLayoutGroupContext.Orientation), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Orientation"] = nameof(RadioGroupBindingController.CycleOrientation),
            }),
            contentMinHeight: 150
        );
    }

    /// <summary>
    /// Bound options are cloned client-side and then decorated with the hidden radio input each one needs
    /// — a template shell has no per-item id to bake that input's <c>value</c> into ahead of time, so the
    /// decoration happens after cloning (<c>RadioGroupSyncEngine</c>). Adding and selecting here is what
    /// puts that seam under load.
    /// </summary>
    private static ContainerComponent CreateOptionsGroup()
    {
        return DemoUI.CreateGroup(nameof(RadioGroupBindingController.OptionsGroup), "Bound options",
            content => content.AddChild(new RadioGroupComponent()
                .BindValue(nameof(OptionsCollectionGroupContext.Value), UIBindingScope.Relative)
                .BindOptions(nameof(OptionsCollectionGroupContext.Options), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add"] = nameof(RadioGroupBindingController.AddOption),
                ["Remove"] = nameof(RadioGroupBindingController.RemoveOption),
                ["Select first"] = nameof(RadioGroupBindingController.SelectFirst),
                ["Rename selected"] = nameof(RadioGroupBindingController.RenameSelected),
            }),
            contentMinHeight: 210
        );
    }

    private static OptionItem[] CreateStrategies()
        =>
        [
            new OptionItem { Id = "first", Title = "Rolling", Description = "Replace instances in batches", Icon = LucideIcons.History },
            new OptionItem { Id = "second", Title = "Blue / green", Description = "Switch once the new set is healthy", Icon = LucideIcons.Upload },
            new OptionItem { Id = "third", Title = "Recreate", Description = "Stop everything, then start again", Icon = LucideIcons.Wrench },
        ];

    private static OptionItem[] CreateShortOptions()
        =>
        [
            new OptionItem { Id = "first", Title = "us-east-1" },
            new OptionItem { Id = "second", Title = "eu-west-1" },
            new OptionItem { Id = "third", Title = "ap-south-1" },
        ];
}
