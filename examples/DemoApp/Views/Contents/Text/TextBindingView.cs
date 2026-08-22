using System.Collections.Generic;
using DemoApp.Controllers.Contents.Text;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.Text;

internal sealed class TextBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.text.binding";

    protected override string ComponentRoute => "/contents/text";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.contents.text.header";
    protected override string HeaderDescription => "demo.contents.text.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateTypographyGroup())
            .AddChild(CreateIconGroup())
            .AddChild(CreateBadgeGroup())
            .AddChild(CreateDescriptionGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new TextComponent()
            .SetTitle("Sample title")
            .SetDescription("A supporting description line.")
        );
    }

    private static ContainerComponent CreateTypographyGroup()
    {
        return DemoUI.CreateGroup(nameof(TextBindingController.TypographyGroup), "Typography",
            content => content.AddChild(new TextComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetTitle("Notifications")
                .SetDescription("You have new messages waiting in your inbox that need your attention soon.")
                .BindTitleType(nameof(TextTypographyGroupContext.TitleType), UIBindingScope.Relative)
                .BindTextAlignment(nameof(TextTypographyGroupContext.TextAlignment), UIBindingScope.Relative)
                .BindWrapMode(nameof(TextTypographyGroupContext.WrapMode), UIBindingScope.Relative)
                .BindSelectable(nameof(TextTypographyGroupContext.Selectable), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Title type"] = nameof(TextBindingController.CycleTitleType),
                ["Text align"] = nameof(TextBindingController.CycleTextAlignment),
                ["Wrap mode"] = nameof(TextBindingController.CycleWrapMode),
                ["Selectable"] = nameof(TextBindingController.ToggleSelectable),
            })
        );
    }

    private static ContainerComponent CreateIconGroup()
    {
        return DemoUI.CreateGroup(nameof(TextBindingController.IconGroup), "Icon",
            content => content.AddChild(new TextComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetTitle("Icon sample")
                .SetDescription("The icon aligns with the title line, not the description below it.")
                .BindIcon(nameof(TextIconGroupContext.Icon), UIBindingScope.Relative)
                .BindIconColor(nameof(TextIconGroupContext.IconColor), UIBindingScope.Relative)
                .BindIconSize(nameof(TextIconGroupContext.IconSize), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Icon"] = nameof(TextBindingController.ToggleIcon),
                ["Icon style"] = nameof(TextBindingController.CycleIconColor),
                ["Icon size"] = nameof(TextBindingController.CycleIconSize),
            })
        );
    }

    private static ContainerComponent CreateBadgeGroup()
    {
        return DemoUI.CreateGroup(nameof(TextBindingController.BadgeGroup), "Badge",
            content => content.AddChild(new TextComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetTitle("Badge sample")
                .SetBadgeText("New")
                .BindBadgePlacement(nameof(TextBadgeGroupContext.BadgePlacement), UIBindingScope.Relative)
                .BindBadgeStyle(nameof(TextBadgeGroupContext.BadgeStyle), UIBindingScope.Relative)
                .BindBadgeIcon(nameof(TextBadgeGroupContext.BadgeIcon), UIBindingScope.Relative)
                .BindBadgeTextType(nameof(TextBadgeGroupContext.BadgeTextType), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Badge placement"] = nameof(TextBindingController.CycleBadgePlacement),
                ["Badge style"] = nameof(TextBindingController.CycleBadgeStyle),
                ["Badge icon"] = nameof(TextBindingController.ToggleBadgeIcon),
                ["Badge text type"] = nameof(TextBindingController.CycleBadgeTextType),
            })
        );
    }

    private static ContainerComponent CreateDescriptionGroup()
    {
        return DemoUI.CreateGroup(nameof(TextBindingController.DescriptionGroup), "Description",
            content => content.AddChild(new TextComponent()
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetTitle("Description sample")
                .BindDescription(nameof(TextDescriptionGroupContext.Description), UIBindingScope.Relative)
                .BindDescriptionType(nameof(TextDescriptionGroupContext.DescriptionType), UIBindingScope.Relative)
                .BindDescriptionColor(nameof(TextDescriptionGroupContext.DescriptionColor), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Description"] = nameof(TextBindingController.ToggleDescription),
                ["Description type"] = nameof(TextBindingController.CycleDescriptionType),
                ["Description style"] = nameof(TextBindingController.CycleDescriptionColor),
            })
        );
    }
}
