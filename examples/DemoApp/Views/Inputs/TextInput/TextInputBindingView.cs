using System.Collections.Generic;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.TextInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.TextInput;

/// <summary>
/// <c>ShowClearButton</c> is deliberately absent: the clear button is an element the renderer either emits
/// or does not (see <c>TextInputComponentRenderer.ShouldRenderClearButton</c> — no DOM operation adds or
/// removes whole elements), so binding it would produce a control that silently does nothing. It is shown
/// statically on the example page instead.
/// </summary>
internal sealed class TextInputBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.text-input.binding";

    protected override string ComponentRoute => "/inputs/text-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.text-input.header";
    protected override string HeaderDescription => "demo.inputs.text-input.description";

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
        => CreateMainGroup(new TextInputComponent().SetTitle("Service name").SetValue("nova-api"));

    /// <summary>
    /// <c>Value</c> is two-way and syncs on the native <c>change</c> event — typing here reaches the
    /// controller when the field is left, not per keystroke. The cycle button drives the same field from
    /// the server side.
    /// </summary>
    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(TextInputBindingController.ValueGroup), "Value",
            content => content.AddChild(new TextInputComponent()
                .SetTitle("Service name")
                .BindValue(nameof(TextValueGroupContext.Value), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(TextValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .BindMaxLength(nameof(TextValueGroupContext.MaxLength), UIBindingScope.Relative)
                .BindTrimInput(nameof(TextValueGroupContext.TrimInput), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(TextInputBindingController.CycleValue),
                ["Read-only"] = nameof(TextInputBindingController.ToggleIsReadOnly),
                ["Max length"] = nameof(TextInputBindingController.CycleMaxLength),
                ["Trim input"] = nameof(TextInputBindingController.ToggleTrimInput),
            }),
            contentMinHeight: 170
        );
    }

    private static ContainerComponent CreateFieldGroup()
    {
        return DemoUI.CreateGroup(nameof(TextInputBindingController.FieldGroup), "Field",
            content => content.AddChild(new TextInputComponent()
                .SetTitle("Health endpoint")
                .SetValue("/healthz")
                .BindType(nameof(TextInputFieldGroupContext.Type), UIBindingScope.Relative)
                .BindPrefixText(nameof(TextInputFieldGroupContext.PrefixText), UIBindingScope.Relative)
                .BindSuffixText(nameof(TextInputFieldGroupContext.SuffixText), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Type"] = nameof(TextInputBindingController.CycleType),
                ["Prefix"] = nameof(TextInputBindingController.TogglePrefixText),
                ["Suffix"] = nameof(TextInputBindingController.ToggleSuffixText),
            }),
            contentMinHeight: 150
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(TextInputBindingController.ContentGroup), "Label",
            content => content.AddChild(new TextInputComponent()
                .SetValue("nova-api")
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
                ["Icon"] = nameof(TextInputBindingController.ToggleIcon),
                ["Icon color"] = nameof(TextInputBindingController.CycleIconColor),
                ["Icon size"] = nameof(TextInputBindingController.CycleIconSize),
                ["Title"] = nameof(TextInputBindingController.ToggleTitle),
                ["Title type"] = nameof(TextInputBindingController.CycleTitleType),
                ["Title color"] = nameof(TextInputBindingController.CycleTitleColor),
                ["Tooltip"] = nameof(TextInputBindingController.ToggleTooltip),
            }),
            contentMinHeight: 250
        );
    }

    private static ContainerComponent CreateBadgeGroup()
    {
        return DemoUI.CreateGroup(nameof(TextInputBindingController.BadgeGroup), "Badge",
            content => content.AddChild(new TextInputComponent()
                .SetTitle("Deploy token")
                .SetValue("s3cr3t-token")
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
                ["Placement"] = nameof(TextInputBindingController.CycleBadgePlacement),
                ["Style"] = nameof(TextInputBindingController.CycleBadgeStyle),
                ["Icon"] = nameof(TextInputBindingController.ToggleBadgeIcon),
                ["Icon color"] = nameof(TextInputBindingController.CycleBadgeIconColor),
                ["Icon size"] = nameof(TextInputBindingController.CycleBadgeIconSize),
                ["Text"] = nameof(TextInputBindingController.ToggleBadgeText),
                ["Text type"] = nameof(TextInputBindingController.CycleBadgeTextType),
                ["Tooltip"] = nameof(TextInputBindingController.ToggleBadgeTooltip),
            }),
            contentMinHeight: 280
        );
    }

    private static ContainerComponent CreateBorderGroup()
    {
        return DemoUI.CreateGroup(nameof(TextInputBindingController.BorderGroup), "Field border",
            content => content.AddChild(new TextInputComponent()
                .SetTitle("Request timeout")
                .SetValue("30")
                .BindBorderColor(nameof(InputBorderGroupContext.BorderColor), UIBindingScope.Relative)
                .BindBorderThickness(nameof(InputBorderGroupContext.BorderThickness), UIBindingScope.Relative)
                .BindBorderRadius(nameof(InputBorderGroupContext.BorderRadius), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Color"] = nameof(TextInputBindingController.CycleBorderColor),
                ["Thickness"] = nameof(TextInputBindingController.CycleBorderThickness),
                ["Radius"] = nameof(TextInputBindingController.CycleBorderRadius),
            }),
            contentMinHeight: 150
        );
    }
}
