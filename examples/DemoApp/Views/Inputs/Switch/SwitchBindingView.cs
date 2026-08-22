using System.Collections.Generic;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.Switch;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.Switch;

internal sealed class SwitchBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.switch.binding";

    protected override string ComponentRoute => "/inputs/switch";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.inputs.switch.header";
    protected override string HeaderDescription => "demo.inputs.switch.description";

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
        => CreateMainGroup(new SwitchComponent().SetTitle("Auto-deploy on merge"));

    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(SwitchBindingController.ValueGroup), "Value",
            content => content.AddChild(new SwitchComponent()
                .SetTitle("Auto-deploy on merge")
                .BindValue(nameof(CheckableValueGroupContext.Value), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(CheckableValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(SwitchBindingController.ToggleValue),
                ["Read-only"] = nameof(SwitchBindingController.ToggleIsReadOnly),
            }),
            contentMinHeight: 120
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(SwitchBindingController.ContentGroup), "Label",
            content => content.AddChild(new SwitchComponent()
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
                ["Icon"] = nameof(SwitchBindingController.ToggleIcon),
                ["Icon color"] = nameof(SwitchBindingController.CycleIconColor),
                ["Icon size"] = nameof(SwitchBindingController.CycleIconSize),
                ["Title"] = nameof(SwitchBindingController.ToggleTitle),
                ["Title type"] = nameof(SwitchBindingController.CycleTitleType),
                ["Title color"] = nameof(SwitchBindingController.CycleTitleColor),
                ["Tooltip"] = nameof(SwitchBindingController.ToggleTooltip),
            }),
            contentMinHeight: 240
        );
    }

    private static ContainerComponent CreateBadgeGroup()
    {
        return DemoUI.CreateGroup(nameof(SwitchBindingController.BadgeGroup), "Badge",
            content => content.AddChild(new SwitchComponent()
                .SetTitle("Maintenance mode")
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
                ["Placement"] = nameof(SwitchBindingController.CycleBadgePlacement),
                ["Style"] = nameof(SwitchBindingController.CycleBadgeStyle),
                ["Icon"] = nameof(SwitchBindingController.ToggleBadgeIcon),
                ["Icon color"] = nameof(SwitchBindingController.CycleBadgeIconColor),
                ["Icon size"] = nameof(SwitchBindingController.CycleBadgeIconSize),
                ["Text"] = nameof(SwitchBindingController.ToggleBadgeText),
                ["Text type"] = nameof(SwitchBindingController.CycleBadgeTextType),
                ["Tooltip"] = nameof(SwitchBindingController.ToggleBadgeTooltip),
            }),
            contentMinHeight: 270
        );
    }

    /// <summary>
    /// The border properties land on the track, which is the switch's equivalent of the checkbox's box —
    /// the same <c>BorderStyleRenderer</c> call inside the shared <c>RenderCheckable</c> body.
    /// </summary>
    private static ContainerComponent CreateBorderGroup()
    {
        return DemoUI.CreateGroup(nameof(SwitchBindingController.BorderGroup), "Track border",
            content => content.AddChild(new SwitchComponent()
                .SetTitle("Weekly digest")
                .BindBorderColor(nameof(InputBorderGroupContext.BorderColor), UIBindingScope.Relative)
                .BindBorderThickness(nameof(InputBorderGroupContext.BorderThickness), UIBindingScope.Relative)
                .BindBorderRadius(nameof(InputBorderGroupContext.BorderRadius), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Color"] = nameof(SwitchBindingController.CycleBorderColor),
                ["Thickness"] = nameof(SwitchBindingController.CycleBorderThickness),
                ["Radius"] = nameof(SwitchBindingController.CycleBorderRadius),
            }),
            contentMinHeight: 140
        );
    }
}
