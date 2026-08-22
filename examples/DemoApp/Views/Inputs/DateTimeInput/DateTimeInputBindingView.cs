using System.Collections.Generic;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.DateTimeInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.DateTimeInput;

/// <summary>See <c>DateInputBindingView</c> for why Step and Culture are not cycled here.</summary>
internal sealed class DateTimeInputBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.date-time-input.binding";

    protected override string ComponentRoute => "/inputs/date-time-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.inputs.date-time-input.header";
    protected override string HeaderDescription => "demo.inputs.date-time-input.description";

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
        => CreateMainGroup(new DateTimeInputComponent().SetTitle("Runs at").SetValue(DateTimeValueGroupContext.Moment(2026, 4, 24, 22, 30)));

    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(DateTimeInputBindingController.ValueGroup), "Value",
            content => content.AddChild(new DateTimeInputComponent()
                .SetTitle("Runs at")
                .BindValue(nameof(DateTimeValueGroupContext.Value), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(DateTimeValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(DateTimeInputBindingController.CycleValue),
                ["Read-only"] = nameof(DateTimeInputBindingController.ToggleIsReadOnly),
            }),
            contentMinHeight: 380
        );
    }

    private static ContainerComponent CreatePickerGroup()
    {
        return DemoUI.CreateGroup(nameof(DateTimeInputBindingController.PickerGroup), "Picker",
            content => content.AddChild(new DateTimeInputComponent()
                .SetTitle("Runs at")
                .SetStepMinutes(15)
                .SetValue(DateTimeValueGroupContext.Moment(2026, 4, 24, 22, 30))
                .BindMin(nameof(DateTimePickerGroupContext.Min), UIBindingScope.Relative)
                .BindMax(nameof(DateTimePickerGroupContext.Max), UIBindingScope.Relative)
                .BindDisplayFormat(nameof(DateTimePickerGroupContext.DisplayFormat), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Min"] = nameof(DateTimeInputBindingController.CycleMin),
                ["Max"] = nameof(DateTimeInputBindingController.CycleMax),
                ["Display format"] = nameof(DateTimeInputBindingController.CycleDisplayFormat),
            }),
            contentMinHeight: 380
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(DateTimeInputBindingController.ContentGroup), "Label",
            content => content.AddChild(new DateTimeInputComponent()
                .SetValue(DateTimeValueGroupContext.Moment(2026, 4, 24, 22, 30))
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
                ["Icon"] = nameof(DateTimeInputBindingController.ToggleIcon),
                ["Icon color"] = nameof(DateTimeInputBindingController.CycleIconColor),
                ["Icon size"] = nameof(DateTimeInputBindingController.CycleIconSize),
                ["Title"] = nameof(DateTimeInputBindingController.ToggleTitle),
                ["Title type"] = nameof(DateTimeInputBindingController.CycleTitleType),
                ["Title color"] = nameof(DateTimeInputBindingController.CycleTitleColor),
                ["Tooltip"] = nameof(DateTimeInputBindingController.ToggleTooltip),
            }),
            contentMinHeight: 380
        );
    }

    private static ContainerComponent CreateBadgeGroup()
    {
        return DemoUI.CreateGroup(nameof(DateTimeInputBindingController.BadgeGroup), "Badge",
            content => content.AddChild(new DateTimeInputComponent()
                .SetTitle("Runs at")
                .SetValue(DateTimeValueGroupContext.Moment(2026, 4, 24, 22, 30))
                .BindBadgeStyle(nameof(InputBadgeGroupContext.BadgeStyle), UIBindingScope.Relative)
                .BindBadgeText(nameof(InputBadgeGroupContext.BadgeText), UIBindingScope.Relative)
                .BindBadgeIcon(nameof(InputBadgeGroupContext.BadgeIcon), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Style"] = nameof(DateTimeInputBindingController.CycleBadgeStyle),
                ["Text"] = nameof(DateTimeInputBindingController.ToggleBadgeText),
                ["Icon"] = nameof(DateTimeInputBindingController.ToggleBadgeIcon),
            }),
            contentMinHeight: 380
        );
    }

    private static ContainerComponent CreateBorderGroup()
    {
        return DemoUI.CreateGroup(nameof(DateTimeInputBindingController.BorderGroup), "Field border",
            content => content.AddChild(new DateTimeInputComponent()
                .SetTitle("Runs at")
                .SetValue(DateTimeValueGroupContext.Moment(2026, 4, 24, 22, 30))
                .BindBorderColor(nameof(InputBorderGroupContext.BorderColor), UIBindingScope.Relative)
                .BindBorderThickness(nameof(InputBorderGroupContext.BorderThickness), UIBindingScope.Relative)
                .BindBorderRadius(nameof(InputBorderGroupContext.BorderRadius), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Color"] = nameof(DateTimeInputBindingController.CycleBorderColor),
                ["Thickness"] = nameof(DateTimeInputBindingController.CycleBorderThickness),
                ["Radius"] = nameof(DateTimeInputBindingController.CycleBorderRadius),
            }),
            contentMinHeight: 380
        );
    }
}
