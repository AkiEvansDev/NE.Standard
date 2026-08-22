using System.Collections.Generic;
using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Items.ItemsView;

internal sealed class ItemsViewBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.items.items-view.binding";

    protected override string ComponentRoute => "/items/items-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test, DemoViewKind.Window];
    protected override string Header => "demo.items.items-view.header";
    protected override string HeaderDescription => "demo.items.items-view.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateTasksGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new ItemsViewComponent()
            .SetSpacing(4)
            .AddItem(new DemoStepItem("Sample item 1"))
            .AddItem(new DemoStepItem("Sample item 2"))
            .SetItemTemplate(new TextComponent().BindTitle(nameof(DemoStepItem.Title), UIBindingScope.Relative))
        );
    }

    private static ContainerComponent CreateTasksGroup()
    {
        return DemoUI.CreateGroup(nameof(ItemsViewBindingController.TasksGroup), "Tasks",
            content => content.AddChild(new ItemsViewComponent()
                .BindItems(nameof(ItemsViewGroupContext.Tasks), UIBindingScope.Relative)
                .SetSpacing(12)
                .SetItemTemplate(CreateTaskTemplate())
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add task"] = nameof(ItemsViewBindingController.AddTask),
            }),
            contentMinHeight: 320
        );
    }

    private static ContainerComponent CreateTaskTemplate()
    {
        return new ContainerComponent()
            .SetPadding(UIThickness.Uniform(8))
            .SetBorderColor(UIThemeColor.Border)
            .SetBorderThickness(UIThickness.Uniform(1))
            .SetBorderRadius(UICornerRadius.Uniform(6))
            .AddRow(UIGridUnit.Auto())
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new TextComponent()
                    .BindTitle(nameof(DemoTaskItem.Title), UIBindingScope.Relative)
                    .SetWidth(UILayoutLength.Absolute(140))
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .OnClick(nameof(ItemsViewBindingController.RenameTask), UIAction.ArgCurrentItem("task"))
                    .ConfigureDefaultContent(c => c.SetTitle("Rename").SetTitleType(UITextAppearance.Caption))
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .OnClick(nameof(ItemsViewBindingController.AddStep), UIAction.ArgCurrentItem("task"))
                    .ConfigureDefaultContent(c => c.SetTitle("Add step").SetTitleType(UITextAppearance.Caption))
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .OnClick(nameof(ItemsViewBindingController.RemoveTask), UIAction.ArgCurrentItem("task"))
                    .ConfigureDefaultContent(c => c.SetTitle("Remove").SetTitleType(UITextAppearance.Caption))
                )
            )
            .AddChild(new ItemsViewComponent()
                .BindItems(nameof(DemoTaskItem.Steps), UIBindingScope.Relative)
                .SetSpacing(4)
                .SetMargin(UIThickness.All(16, 8, 0, 0))
                .SetItemTemplate(CreateStepTemplate())
                .SetPlacement(1, 2, 24, 1)
            );
    }

    private static StackPanelComponent CreateStepTemplate()
    {
        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(8)
            .AddChild(new TextComponent()
                .BindTitle(nameof(DemoStepItem.Title), UIBindingScope.Relative)
                .SetTitleType(UITextAppearance.Caption)
                .SetWidth(UILayoutLength.Absolute(120))
            )
            .AddChild(new ButtonComponent()
                .SetType(UIButtonType.Ghost)
                .OnClick(
                    nameof(ItemsViewBindingController.RemoveStep),
                    UIAction.ArgCurrentItem("step"),
                    UIAction.ArgParent("taskId", nameof(DemoTaskItem.Id))
                )
                .ConfigureDefaultContent(c => c.SetTitle("Remove").SetTitleType(UITextAppearance.Caption))
            );
    }
}
