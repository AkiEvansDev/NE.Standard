using System.Collections.Generic;
using DemoApp.Controllers.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Binding;

namespace DemoApp.Views.Base;

internal abstract class DemoBindingView : DemoView
{
    protected sealed override DemoViewKind ViewKind => DemoViewKind.Binding;

    /// <summary>
    /// The shared "Standard" group: every bindable property `IVisualComponent` has, driven from the
    /// controller. The component sits inside a frame that does <em>not</em> follow it — without one, hiding it
    /// or moving it left an empty content box that read as nothing having happened, and `Visible` in
    /// particular demonstrated nothing at all.
    /// </summary>
    protected static ContainerComponent CreateMainGroup<T>(VisualComponentBase<T> component)
        where T : VisualComponentBase<T>, IUIComponentDefinition
    {
        return DemoUI.CreateGroup(nameof(DemoBindingController.MainGroup), "Standard",
            content => content.AddChild(new ContainerComponent()
                .SetPadding(UIThickness.Uniform(8))
                .SetBorderThickness(UIThickness.Uniform(1))
                .SetBorderColor(UIThemeColor.Border)
                .SetMinHeight(UILayoutLength.Absolute(120))
                .SetPlacement(1, 1, 24, 1)
                .AddChild(component
                    .BindVisible(nameof(StandardGroupContext.Visible), UIBindingScope.Relative)
                    .BindEnabled(nameof(StandardGroupContext.Enabled), UIBindingScope.Relative)
                    .BindHorizontalAlignment(nameof(StandardGroupContext.HorizontalAlignment), UIBindingScope.Relative)
                    .BindVerticalAlignment(nameof(StandardGroupContext.VerticalAlignment), UIBindingScope.Relative)
                    .BindMargin(nameof(StandardGroupContext.Margin), UIBindingScope.Relative)
                    .BindWidth(nameof(StandardGroupContext.Width), UIBindingScope.Relative)
                    .BindHeight(nameof(StandardGroupContext.Height), UIBindingScope.Relative)
                    .SetPlacement(1, 1, 24, 1)
                )
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Visible"] = nameof(DemoBindingController.ToggleVisible),
                ["Enabled"] = nameof(DemoBindingController.ToggleEnabled),
                ["H align"] = nameof(DemoBindingController.CycleHorizontalAlignment),
                ["V align"] = nameof(DemoBindingController.CycleVerticalAlignment),
                ["Margin"] = nameof(DemoBindingController.CycleMargin),
                ["Width"] = nameof(DemoBindingController.CycleWidth),
                ["Height"] = nameof(DemoBindingController.CycleHeight),
            })
        );
    }
}
