using System.Collections.Generic;
using DemoApp.Controllers.Contents.Link;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.Link;

internal sealed class LinkBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.link.binding";

    protected override string ComponentRoute => "/contents/link";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.contents.link.header";
    protected override string HeaderDescription => "demo.contents.link.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateTypographyGroup())
            .AddChild(CreateIconGroup());
    }

    private static ContainerComponent CreateMainGroup()
    {
        return CreateMainGroup(new LinkComponent()
            .SetText("Learn more")
            .SetUrl("#")
            .SetIcon(LucideIcons.ExternalLink)
        );
    }

    private static ContainerComponent CreateTypographyGroup()
    {
        return DemoUI.CreateGroup(nameof(LinkBindingController.TypographyGroup), "Typography",
            content => content.AddChild(new LinkComponent()
                .SetText("Documentation")
                .BindTextType(nameof(LinkTypographyGroupContext.TextType), UIBindingScope.Relative)
                .BindTextColor(nameof(LinkTypographyGroupContext.TextColor), UIBindingScope.Relative)
                .BindUrl(nameof(LinkTypographyGroupContext.Url), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Text type"] = nameof(LinkBindingController.CycleTextType),
                ["Text style"] = nameof(LinkBindingController.CycleTextStyle),
                ["Text color"] = nameof(LinkBindingController.CycleTextColor),
                ["Url"] = nameof(LinkBindingController.ToggleUrl),
            })
        );
    }

    private static ContainerComponent CreateIconGroup()
    {
        return DemoUI.CreateGroup(nameof(LinkBindingController.IconGroup), "Icon",
            content => content.AddChild(new LinkComponent()
                .SetText("Download")
                .SetUrl("#")
                .BindIcon(nameof(LinkIconGroupContext.Icon), UIBindingScope.Relative)
                .BindIconColor(nameof(LinkIconGroupContext.IconColor), UIBindingScope.Relative)
                .BindIconSize(nameof(LinkIconGroupContext.IconSize), UIBindingScope.Relative)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Icon"] = nameof(LinkBindingController.ToggleIcon),
                ["Icon style"] = nameof(LinkBindingController.CycleIconColor),
                ["Icon size"] = nameof(LinkBindingController.CycleIconSize),
            })
        );
    }
}
