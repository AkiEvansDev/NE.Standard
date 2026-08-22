using System.Collections.Generic;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.NumberInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.NumberInput;

/// <summary>
/// <c>Min</c>/<c>Max</c>/<c>Step</c> are absent on purpose: this renderer resolves them once, statically,
/// to feed the stepper buttons (see <c>NumberInputComponentRenderer</c>), so binding them would produce
/// controls that do nothing. The Slider page cycles its own Min/Max/Step, which *are* live-patched.
/// </summary>
internal sealed class NumberInputBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.number-input.binding";

    protected override string ComponentRoute => "/inputs/number-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.number-input.header";
    protected override string HeaderDescription => "demo.inputs.number-input.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateValueGroup())
            .AddChild(CreateFieldGroup())
            .AddChild(CreateContentGroup())
            .AddChild(CreateBadgeGroup())
            .AddChild(CreateBorderGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new NumberInputComponent().SetTitle("Replicas").SetValue(3));

    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(NumberInputBindingController.ValueGroup), "Value",
            content => content.AddChild(new NumberInputComponent()
                .SetTitle("Replicas")
                .BindValue(nameof(NumberValueGroupContext.Value), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(NumberValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(NumberInputBindingController.CycleValue),
                ["Read-only"] = nameof(NumberInputBindingController.ToggleIsReadOnly),
            }),
            contentMinHeight: 130
        );
    }

    private static ContainerComponent CreateFieldGroup()
    {
        return DemoUI.CreateGroup(nameof(NumberInputBindingController.FieldGroup), "Field",
            content => content.AddChild(new NumberInputComponent()
                .SetTitle("Monthly budget")
                .SetValue(1250.50m)
                .BindAllowDecimals(nameof(NumberFieldGroupContext.AllowDecimals), UIBindingScope.Relative)
                .BindAllowNegative(nameof(NumberFieldGroupContext.AllowNegative), UIBindingScope.Relative)
                .BindAllowThousandsSeparator(nameof(NumberFieldGroupContext.AllowThousandsSeparator), UIBindingScope.Relative)
                .BindTrimTrailingZeros(nameof(NumberFieldGroupContext.TrimTrailingZeros), UIBindingScope.Relative)
                .BindShowStepper(nameof(NumberFieldGroupContext.ShowStepper), UIBindingScope.Relative)
                .BindPrefixText(nameof(NumberFieldGroupContext.PrefixText), UIBindingScope.Relative)
                .BindSuffixText(nameof(NumberFieldGroupContext.SuffixText), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Decimals"] = nameof(NumberInputBindingController.ToggleAllowDecimals),
                ["Negative"] = nameof(NumberInputBindingController.ToggleAllowNegative),
                ["Thousands"] = nameof(NumberInputBindingController.ToggleAllowThousandsSeparator),
                ["Trim zeros"] = nameof(NumberInputBindingController.ToggleTrimTrailingZeros),
                ["Stepper"] = nameof(NumberInputBindingController.ToggleShowStepper),
                ["Prefix"] = nameof(NumberInputBindingController.TogglePrefixText),
                ["Suffix"] = nameof(NumberInputBindingController.ToggleSuffixText),
            }),
            contentMinHeight: 250
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(NumberInputBindingController.ContentGroup), "Label",
            content => content.AddChild(new NumberInputComponent()
                .SetValue(3)
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
                ["Icon"] = nameof(NumberInputBindingController.ToggleIcon),
                ["Icon color"] = nameof(NumberInputBindingController.CycleIconColor),
                ["Icon size"] = nameof(NumberInputBindingController.CycleIconSize),
                ["Title"] = nameof(NumberInputBindingController.ToggleTitle),
                ["Title type"] = nameof(NumberInputBindingController.CycleTitleType),
                ["Title color"] = nameof(NumberInputBindingController.CycleTitleColor),
                ["Tooltip"] = nameof(NumberInputBindingController.ToggleTooltip),
            }),
            contentMinHeight: 250
        );
    }

    private static ContainerComponent CreateBadgeGroup()
    {
        return DemoUI.CreateGroup(nameof(NumberInputBindingController.BadgeGroup), "Badge",
            content => content.AddChild(new NumberInputComponent()
                .SetTitle("Monthly budget")
                .SetValue(2500)
                .BindBadgeStyle(nameof(InputBadgeGroupContext.BadgeStyle), UIBindingScope.Relative)
                .BindBadgeText(nameof(InputBadgeGroupContext.BadgeText), UIBindingScope.Relative)
                .BindBadgeIcon(nameof(InputBadgeGroupContext.BadgeIcon), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Style"] = nameof(NumberInputBindingController.CycleBadgeStyle),
                ["Text"] = nameof(NumberInputBindingController.ToggleBadgeText),
                ["Icon"] = nameof(NumberInputBindingController.ToggleBadgeIcon),
            }),
            contentMinHeight: 150
        );
    }

    private static ContainerComponent CreateBorderGroup()
    {
        return DemoUI.CreateGroup(nameof(NumberInputBindingController.BorderGroup), "Field border",
            content => content.AddChild(new NumberInputComponent()
                .SetTitle("Replicas")
                .SetValue(3)
                .BindBorderColor(nameof(InputBorderGroupContext.BorderColor), UIBindingScope.Relative)
                .BindBorderThickness(nameof(InputBorderGroupContext.BorderThickness), UIBindingScope.Relative)
                .BindBorderRadius(nameof(InputBorderGroupContext.BorderRadius), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Color"] = nameof(NumberInputBindingController.CycleBorderColor),
                ["Thickness"] = nameof(NumberInputBindingController.CycleBorderThickness),
                ["Radius"] = nameof(NumberInputBindingController.CycleBorderRadius),
            }),
            contentMinHeight: 150
        );
    }
}
