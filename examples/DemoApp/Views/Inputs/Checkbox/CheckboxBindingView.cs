using System.Collections.Generic;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.Checkbox;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Checkbox;

internal sealed class CheckboxBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.checkbox.binding";

    protected override string ComponentRoute => "/inputs/checkbox";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.checkbox.header";
    protected override string HeaderDescription => "demo.inputs.checkbox.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateValueGroup())
            .AddChild(CreateContentGroup())
            .AddChild(CreateBadgeGroup())
            .AddChild(CreateBorderGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new CheckboxComponent().SetTitle("Require review before deploy"));

    /// <summary>
    /// <c>Value</c> is two-way, so this group's toggle and a click on the box itself write to the same
    /// controller field — the log line under the title reports only the server-driven half, which is what
    /// makes the difference visible.
    /// </summary>
    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(CheckboxBindingController.ValueGroup), "Value",
            content => content.AddChild(new CheckboxComponent()
                .SetTitle("Require review before deploy")
                .BindValue(nameof(CheckableValueGroupContext.Value), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(CheckableValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(CheckboxBindingController.ToggleValue),
                ["Read-only"] = nameof(CheckboxBindingController.ToggleIsReadOnly),
            }),
            contentMinHeight: 120
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(CheckboxBindingController.ContentGroup), "Label",
            content => content.AddChild(new CheckboxComponent()
                .SetValue(true)
                .BindIcon(nameof(InputContentGroupContext.Icon), UIBindingScope.Relative)
                .BindIconColor(nameof(InputContentGroupContext.IconColor), UIBindingScope.Relative)
                .BindIconSize(nameof(InputContentGroupContext.IconSize), UIBindingScope.Relative)
                .BindTitle(nameof(InputContentGroupContext.Title), UIBindingScope.Relative)
                .BindTitleType(nameof(InputContentGroupContext.TitleType), UIBindingScope.Relative)
                .BindTitleColor(nameof(InputContentGroupContext.TitleColor), UIBindingScope.Relative)
                .BindTooltip(nameof(InputContentGroupContext.Tooltip), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Icon"] = nameof(CheckboxBindingController.ToggleIcon),
                ["Icon color"] = nameof(CheckboxBindingController.CycleIconColor),
                ["Icon size"] = nameof(CheckboxBindingController.CycleIconSize),
                ["Title"] = nameof(CheckboxBindingController.ToggleTitle),
                ["Title type"] = nameof(CheckboxBindingController.CycleTitleType),
                ["Title color"] = nameof(CheckboxBindingController.CycleTitleColor),
                ["Tooltip"] = nameof(CheckboxBindingController.ToggleTooltip),
            }),
            contentMinHeight: 240
        );
    }

    private static ContainerComponent CreateBadgeGroup()
    {
        return DemoUI.CreateGroup(nameof(CheckboxBindingController.BadgeGroup), "Badge",
            content => content.AddChild(new CheckboxComponent()
                .SetTitle("Keep build artifacts")
                .SetValue(true)
                .BindBadgePlacement(nameof(InputBadgeGroupContext.BadgePlacement), UIBindingScope.Relative)
                .BindBadgeStyle(nameof(InputBadgeGroupContext.BadgeStyle), UIBindingScope.Relative)
                .BindBadgeIcon(nameof(InputBadgeGroupContext.BadgeIcon), UIBindingScope.Relative)
                .BindBadgeIconColor(nameof(InputBadgeGroupContext.BadgeIconColor), UIBindingScope.Relative)
                .BindBadgeIconSize(nameof(InputBadgeGroupContext.BadgeIconSize), UIBindingScope.Relative)
                .BindBadgeText(nameof(InputBadgeGroupContext.BadgeText), UIBindingScope.Relative)
                .BindBadgeTextType(nameof(InputBadgeGroupContext.BadgeTextType), UIBindingScope.Relative)
                .BindBadgeTooltip(nameof(InputBadgeGroupContext.BadgeTooltip), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Placement"] = nameof(CheckboxBindingController.CycleBadgePlacement),
                ["Style"] = nameof(CheckboxBindingController.CycleBadgeStyle),
                ["Icon"] = nameof(CheckboxBindingController.ToggleBadgeIcon),
                ["Icon color"] = nameof(CheckboxBindingController.CycleBadgeIconColor),
                ["Icon size"] = nameof(CheckboxBindingController.CycleBadgeIconSize),
                ["Text"] = nameof(CheckboxBindingController.ToggleBadgeText),
                ["Text type"] = nameof(CheckboxBindingController.CycleBadgeTextType),
                ["Tooltip"] = nameof(CheckboxBindingController.ToggleBadgeTooltip),
            }),
            contentMinHeight: 270
        );
    }

    private static ContainerComponent CreateBorderGroup()
    {
        return DemoUI.CreateGroup(nameof(CheckboxBindingController.BorderGroup), "Box border",
            content => content.AddChild(new CheckboxComponent()
                .SetTitle("Tag the release")
                .BindBorderColor(nameof(InputBorderGroupContext.BorderColor), UIBindingScope.Relative)
                .BindBorderThickness(nameof(InputBorderGroupContext.BorderThickness), UIBindingScope.Relative)
                .BindBorderRadius(nameof(InputBorderGroupContext.BorderRadius), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Color"] = nameof(CheckboxBindingController.CycleBorderColor),
                ["Thickness"] = nameof(CheckboxBindingController.CycleBorderThickness),
                ["Radius"] = nameof(CheckboxBindingController.CycleBorderRadius),
            }),
            contentMinHeight: 140
        );
    }
}
