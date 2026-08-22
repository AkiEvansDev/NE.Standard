using System.Collections.Generic;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.TextArea;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.TextArea;

/// <summary>
/// The label, badge and border groups drive the same shared contexts as the other input pages — after
/// this component was narrowed to <c>TextInputComponentBase</c> and its renderer completed, a text area's
/// header behaves exactly like a text input's.
/// </summary>
internal sealed class TextAreaBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.text-area.binding";

    protected override string ComponentRoute => "/inputs/text-area";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.inputs.text-area.header";
    protected override string HeaderDescription => "demo.inputs.text-area.description";

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
        => CreateMainGroup(new TextAreaComponent().SetTitle("What changed").SetValue("Short summary.").SetRows(2));

    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(TextAreaBindingController.ValueGroup), "Value",
            content => content.AddChild(new TextAreaComponent()
                .SetTitle("What changed")
                .SetRows(2)
                .BindValue(nameof(TextValueGroupContext.Value), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(TextValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .BindMaxLength(nameof(TextValueGroupContext.MaxLength), UIBindingScope.Relative)
                .BindTrimInput(nameof(TextValueGroupContext.TrimInput), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(TextAreaBindingController.CycleValue),
                ["Read-only"] = nameof(TextAreaBindingController.ToggleIsReadOnly),
                ["Max length"] = nameof(TextAreaBindingController.CycleMaxLength),
                ["Trim input"] = nameof(TextAreaBindingController.ToggleTrimInput),
            }),
            contentMinHeight: 190
        );
    }

    private static ContainerComponent CreateFieldGroup()
    {
        return DemoUI.CreateGroup(nameof(TextAreaBindingController.FieldGroup), "Field",
            content => content.AddChild(new TextAreaComponent()
                .SetTitle("Release notes")
                .SetValue("Rolls the API back to 4.8.0.")
                .BindRows(nameof(TextAreaFieldGroupContext.Rows), UIBindingScope.Relative)
                .BindResize(nameof(TextAreaFieldGroupContext.Resize), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Rows"] = nameof(TextAreaBindingController.CycleRows),
                ["Resize"] = nameof(TextAreaBindingController.CycleResize),
            }),
            contentMinHeight: 230
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(TextAreaBindingController.ContentGroup), "Label",
            content => content.AddChild(new TextAreaComponent()
                .SetValue("Rolls the API back to 4.8.0.")
                .SetRows(2)
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
                ["Icon"] = nameof(TextAreaBindingController.ToggleIcon),
                ["Icon color"] = nameof(TextAreaBindingController.CycleIconColor),
                ["Icon size"] = nameof(TextAreaBindingController.CycleIconSize),
                ["Title"] = nameof(TextAreaBindingController.ToggleTitle),
                ["Title type"] = nameof(TextAreaBindingController.CycleTitleType),
                ["Title color"] = nameof(TextAreaBindingController.CycleTitleColor),
                ["Tooltip"] = nameof(TextAreaBindingController.ToggleTooltip),
            }),
            contentMinHeight: 260
        );
    }

    private static ContainerComponent CreateBadgeGroup()
    {
        return DemoUI.CreateGroup(nameof(TextAreaBindingController.BadgeGroup), "Badge",
            content => content.AddChild(new TextAreaComponent()
                .SetTitle("What changed")
                .SetValue("Rolls the API back to 4.8.0.")
                .SetRows(2)
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
                ["Placement"] = nameof(TextAreaBindingController.CycleBadgePlacement),
                ["Style"] = nameof(TextAreaBindingController.CycleBadgeStyle),
                ["Icon"] = nameof(TextAreaBindingController.ToggleBadgeIcon),
                ["Icon color"] = nameof(TextAreaBindingController.CycleBadgeIconColor),
                ["Icon size"] = nameof(TextAreaBindingController.CycleBadgeIconSize),
                ["Text"] = nameof(TextAreaBindingController.ToggleBadgeText),
                ["Text type"] = nameof(TextAreaBindingController.CycleBadgeTextType),
                ["Tooltip"] = nameof(TextAreaBindingController.ToggleBadgeTooltip),
            }),
            contentMinHeight: 290
        );
    }

    private static ContainerComponent CreateBorderGroup()
    {
        return DemoUI.CreateGroup(nameof(TextAreaBindingController.BorderGroup), "Field border",
            content => content.AddChild(new TextAreaComponent()
                .SetTitle("Rollback plan")
                .SetValue("Re-enable the read replica.")
                .SetRows(2)
                .BindBorderColor(nameof(InputBorderGroupContext.BorderColor), UIBindingScope.Relative)
                .BindBorderThickness(nameof(InputBorderGroupContext.BorderThickness), UIBindingScope.Relative)
                .BindBorderRadius(nameof(InputBorderGroupContext.BorderRadius), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Color"] = nameof(TextAreaBindingController.CycleBorderColor),
                ["Thickness"] = nameof(TextAreaBindingController.CycleBorderThickness),
                ["Radius"] = nameof(TextAreaBindingController.CycleBorderRadius),
            }),
            contentMinHeight: 190
        );
    }
}
