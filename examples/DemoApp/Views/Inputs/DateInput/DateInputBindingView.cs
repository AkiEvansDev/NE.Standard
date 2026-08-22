using System;
using System.Collections.Generic;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.DateInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.DateInput;

/// <summary>
/// <c>Step</c>, <c>FirstDayOfWeek</c> and <c>Culture</c> are absent on purpose: the renderer resolves all
/// three once, statically (see <c>TemporalInputRendererBase</c> for why the culture pack in particular
/// cannot be a live patch), so binding them would produce controls that do nothing. The Example page shows
/// each of them instead.
/// </summary>
internal sealed class DateInputBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.date-input.binding";

    protected override string ComponentRoute => "/inputs/date-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.date-input.header";
    protected override string HeaderDescription => "demo.inputs.date-input.description";

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
        => CreateMainGroup(new DateInputComponent().SetTitle("Ships on").SetValue(new DateOnly(2026, 4, 24)));

    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(DateInputBindingController.ValueGroup), "Value",
            content => content.AddChild(new DateInputComponent()
                .SetTitle("Ships on")
                .BindValue(nameof(DateValueGroupContext.Value), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(DateValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(DateInputBindingController.CycleValue),
                ["Read-only"] = nameof(DateInputBindingController.ToggleIsReadOnly),
            }),
            contentMinHeight: 380
        );
    }

    private static ContainerComponent CreatePickerGroup()
    {
        return DemoUI.CreateGroup(nameof(DateInputBindingController.PickerGroup), "Picker",
            content => content.AddChild(new DateInputComponent()
                .SetTitle("Ships on")
                .SetValue(new DateOnly(2026, 4, 24))
                .BindMin(nameof(DatePickerGroupContext.Min), UIBindingScope.Relative)
                .BindMax(nameof(DatePickerGroupContext.Max), UIBindingScope.Relative)
                .BindDisplayFormat(nameof(DatePickerGroupContext.DisplayFormat), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Min"] = nameof(DateInputBindingController.CycleMin),
                ["Max"] = nameof(DateInputBindingController.CycleMax),
                ["Display format"] = nameof(DateInputBindingController.CycleDisplayFormat),
            }),
            contentMinHeight: 380
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(DateInputBindingController.ContentGroup), "Label",
            content => content.AddChild(new DateInputComponent()
                .SetValue(new DateOnly(2026, 4, 24))
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
                ["Icon"] = nameof(DateInputBindingController.ToggleIcon),
                ["Icon color"] = nameof(DateInputBindingController.CycleIconColor),
                ["Icon size"] = nameof(DateInputBindingController.CycleIconSize),
                ["Title"] = nameof(DateInputBindingController.ToggleTitle),
                ["Title type"] = nameof(DateInputBindingController.CycleTitleType),
                ["Title color"] = nameof(DateInputBindingController.CycleTitleColor),
                ["Tooltip"] = nameof(DateInputBindingController.ToggleTooltip),
            }),
            contentMinHeight: 380
        );
    }

    private static ContainerComponent CreateBadgeGroup()
    {
        return DemoUI.CreateGroup(nameof(DateInputBindingController.BadgeGroup), "Badge",
            content => content.AddChild(new DateInputComponent()
                .SetTitle("Ships on")
                .SetValue(new DateOnly(2026, 4, 24))
                .BindBadgeStyle(nameof(InputBadgeGroupContext.BadgeStyle), UIBindingScope.Relative)
                .BindBadgeText(nameof(InputBadgeGroupContext.BadgeText), UIBindingScope.Relative)
                .BindBadgeIcon(nameof(InputBadgeGroupContext.BadgeIcon), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Style"] = nameof(DateInputBindingController.CycleBadgeStyle),
                ["Text"] = nameof(DateInputBindingController.ToggleBadgeText),
                ["Icon"] = nameof(DateInputBindingController.ToggleBadgeIcon),
            }),
            contentMinHeight: 380
        );
    }

    private static ContainerComponent CreateBorderGroup()
    {
        return DemoUI.CreateGroup(nameof(DateInputBindingController.BorderGroup), "Field border",
            content => content.AddChild(new DateInputComponent()
                .SetTitle("Ships on")
                .SetValue(new DateOnly(2026, 4, 24))
                .BindBorderColor(nameof(InputBorderGroupContext.BorderColor), UIBindingScope.Relative)
                .BindBorderThickness(nameof(InputBorderGroupContext.BorderThickness), UIBindingScope.Relative)
                .BindBorderRadius(nameof(InputBorderGroupContext.BorderRadius), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Color"] = nameof(DateInputBindingController.CycleBorderColor),
                ["Thickness"] = nameof(DateInputBindingController.CycleBorderThickness),
                ["Radius"] = nameof(DateInputBindingController.CycleBorderRadius),
            }),
            contentMinHeight: 380
        );
    }
}
