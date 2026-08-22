using System;
using System.Collections.Generic;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.TimeInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.TimeInput;

/// <summary>See <c>DateInputBindingView</c> for why Step and Culture are not cycled here.</summary>
internal sealed class TimeInputBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.time-input.binding";

    protected override string ComponentRoute => "/inputs/time-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.inputs.time-input.header";
    protected override string HeaderDescription => "demo.inputs.time-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateValueGroup())
            .AddChild(CreatePickerGroup())
            .AddChild(CreateContentGroup())
            .AddChild(CreateBadgeGroup())
            .AddChild(CreateBorderGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new TimeInputComponent().SetTitle("Opens at").SetValue(new TimeOnly(22, 0)));

    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(TimeInputBindingController.ValueGroup), "Value",
            content => content.AddChild(new TimeInputComponent()
                .SetTitle("Opens at")
                .BindValue(nameof(TimeValueGroupContext.Value), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(TimeValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(TimeInputBindingController.CycleValue),
                ["Read-only"] = nameof(TimeInputBindingController.ToggleIsReadOnly),
            }),
            contentMinHeight: 340
        );
    }

    private static ContainerComponent CreatePickerGroup()
    {
        return DemoUI.CreateGroup(nameof(TimeInputBindingController.PickerGroup), "Picker",
            content => content.AddChild(new TimeInputComponent()
                .SetTitle("Opens at")
                .SetStepMinutes(15)
                .SetValue(new TimeOnly(22, 0))
                .BindMin(nameof(TimePickerGroupContext.Min), UIBindingScope.Relative)
                .BindMax(nameof(TimePickerGroupContext.Max), UIBindingScope.Relative)
                .BindDisplayFormat(nameof(TimePickerGroupContext.DisplayFormat), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Min"] = nameof(TimeInputBindingController.CycleMin),
                ["Max"] = nameof(TimeInputBindingController.CycleMax),
                ["Display format"] = nameof(TimeInputBindingController.CycleDisplayFormat),
            }),
            contentMinHeight: 340
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(TimeInputBindingController.ContentGroup), "Label",
            content => content.AddChild(new TimeInputComponent()
                .SetValue(new TimeOnly(22, 0))
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
                ["Icon"] = nameof(TimeInputBindingController.ToggleIcon),
                ["Icon color"] = nameof(TimeInputBindingController.CycleIconColor),
                ["Icon size"] = nameof(TimeInputBindingController.CycleIconSize),
                ["Title"] = nameof(TimeInputBindingController.ToggleTitle),
                ["Title type"] = nameof(TimeInputBindingController.CycleTitleType),
                ["Title color"] = nameof(TimeInputBindingController.CycleTitleColor),
                ["Tooltip"] = nameof(TimeInputBindingController.ToggleTooltip),
            }),
            contentMinHeight: 340
        );
    }

    private static ContainerComponent CreateBadgeGroup()
    {
        return DemoUI.CreateGroup(nameof(TimeInputBindingController.BadgeGroup), "Badge",
            content => content.AddChild(new TimeInputComponent()
                .SetTitle("Opens at")
                .SetValue(new TimeOnly(22, 0))
                .BindBadgeStyle(nameof(InputBadgeGroupContext.BadgeStyle), UIBindingScope.Relative)
                .BindBadgeText(nameof(InputBadgeGroupContext.BadgeText), UIBindingScope.Relative)
                .BindBadgeIcon(nameof(InputBadgeGroupContext.BadgeIcon), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Style"] = nameof(TimeInputBindingController.CycleBadgeStyle),
                ["Text"] = nameof(TimeInputBindingController.ToggleBadgeText),
                ["Icon"] = nameof(TimeInputBindingController.ToggleBadgeIcon),
            }),
            contentMinHeight: 340
        );
    }

    private static ContainerComponent CreateBorderGroup()
    {
        return DemoUI.CreateGroup(nameof(TimeInputBindingController.BorderGroup), "Field border",
            content => content.AddChild(new TimeInputComponent()
                .SetTitle("Opens at")
                .SetValue(new TimeOnly(22, 0))
                .BindBorderColor(nameof(InputBorderGroupContext.BorderColor), UIBindingScope.Relative)
                .BindBorderThickness(nameof(InputBorderGroupContext.BorderThickness), UIBindingScope.Relative)
                .BindBorderRadius(nameof(InputBorderGroupContext.BorderRadius), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Color"] = nameof(TimeInputBindingController.CycleBorderColor),
                ["Thickness"] = nameof(TimeInputBindingController.CycleBorderThickness),
                ["Radius"] = nameof(TimeInputBindingController.CycleBorderRadius),
            }),
            contentMinHeight: 340
        );
    }
}
