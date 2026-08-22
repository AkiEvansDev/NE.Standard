using System.Collections.Generic;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.FileInput;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Inputs.FileInput;

/// <summary>
/// The label, badge and border groups drive the same shared contexts as the other input pages — FileInput
/// derives from <c>TextInputComponentBase</c>, so once its renderer grew the header those properties behave
/// exactly like a text input's.
/// </summary>
internal sealed class FileInputBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.file-input.binding";

    protected override string ComponentRoute => "/inputs/file-input";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.inputs.file-input.header";
    protected override string HeaderDescription => "demo.inputs.file-input.description";

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
        => CreateMainGroup(new FileInputComponent().SetTitle("Build output").SetValue("nova-api-4.8.1.zip"));

    private static ContainerComponent CreateValueGroup()
    {
        return DemoUI.CreateGroup(nameof(FileInputBindingController.ValueGroup), "Value and picker",
            content => content.AddChild(new FileInputComponent()
                .SetTitle("Build output")
                .BindValue(nameof(FileInputValueGroupContext.Value), UIBindingScope.Relative)
                .BindIsReadOnly(nameof(FileInputValueGroupContext.IsReadOnly), UIBindingScope.Relative)
                .BindAccept(nameof(FileInputValueGroupContext.Accept), UIBindingScope.Relative)
                .BindMultiple(nameof(FileInputValueGroupContext.Multiple), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Value"] = nameof(FileInputBindingController.CycleValue),
                ["Read-only"] = nameof(FileInputBindingController.ToggleIsReadOnly),
                ["Accept"] = nameof(FileInputBindingController.CycleAccept),
                ["Multiple"] = nameof(FileInputBindingController.ToggleMultiple),
            }),
            contentMinHeight: 190
        );
    }

    private static ContainerComponent CreateContentGroup()
    {
        return DemoUI.CreateGroup(nameof(FileInputBindingController.ContentGroup), "Label",
            content => content.AddChild(new FileInputComponent()
                .SetValue("nova-api-4.8.1.zip")
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
                ["Icon"] = nameof(FileInputBindingController.ToggleIcon),
                ["Icon color"] = nameof(FileInputBindingController.CycleIconColor),
                ["Icon size"] = nameof(FileInputBindingController.CycleIconSize),
                ["Title"] = nameof(FileInputBindingController.ToggleTitle),
                ["Title type"] = nameof(FileInputBindingController.CycleTitleType),
                ["Title color"] = nameof(FileInputBindingController.CycleTitleColor),
                ["Tooltip"] = nameof(FileInputBindingController.ToggleTooltip),
            }),
            contentMinHeight: 260
        );
    }

    private static ContainerComponent CreateBadgeGroup()
    {
        return DemoUI.CreateGroup(nameof(FileInputBindingController.BadgeGroup), "Badge",
            content => content.AddChild(new FileInputComponent()
                .SetTitle("Build output")
                .SetValue("nova-api-4.8.1.zip")
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
                ["Placement"] = nameof(FileInputBindingController.CycleBadgePlacement),
                ["Style"] = nameof(FileInputBindingController.CycleBadgeStyle),
                ["Icon"] = nameof(FileInputBindingController.ToggleBadgeIcon),
                ["Icon color"] = nameof(FileInputBindingController.CycleBadgeIconColor),
                ["Icon size"] = nameof(FileInputBindingController.CycleBadgeIconSize),
                ["Text"] = nameof(FileInputBindingController.ToggleBadgeText),
                ["Text type"] = nameof(FileInputBindingController.CycleBadgeTextType),
                ["Tooltip"] = nameof(FileInputBindingController.ToggleBadgeTooltip),
            }),
            contentMinHeight: 290
        );
    }

    private static ContainerComponent CreateBorderGroup()
    {
        return DemoUI.CreateGroup(nameof(FileInputBindingController.BorderGroup), "Field border",
            content => content.AddChild(new FileInputComponent()
                .SetTitle("Signed manifest")
                .SetValue("signed-manifest.json")
                .BindBorderColor(nameof(InputBorderGroupContext.BorderColor), UIBindingScope.Relative)
                .BindBorderThickness(nameof(InputBorderGroupContext.BorderThickness), UIBindingScope.Relative)
                .BindBorderRadius(nameof(InputBorderGroupContext.BorderRadius), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Color"] = nameof(FileInputBindingController.CycleBorderColor),
                ["Thickness"] = nameof(FileInputBindingController.CycleBorderThickness),
                ["Radius"] = nameof(FileInputBindingController.CycleBorderRadius),
            }),
            contentMinHeight: 190
        );
    }
}
