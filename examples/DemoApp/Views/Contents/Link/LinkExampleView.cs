using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.Link;

internal sealed class LinkExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.link.example";

    protected override string ComponentRoute => "/contents/link";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.contents.link.header";
    protected override string HeaderDescription => "demo.contents.link.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateFooterNavGroup())
            .AddChild(CreateResourceLinksGroup());
    }

    private static ContainerComponent CreateFooterNavGroup()
    {
        return DemoUI.CreateGroup(null, "Footer navigation",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(48)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(CreateLinkColumn("Product", ["Overview", "Components", "Theming", "Roadmap"]))
                .AddChild(CreateLinkColumn("Resources", ["Documentation", "Samples", "Changelog"]))
                .AddChild(CreateLinkColumn("Company", ["About", "Contact"]))
            ),
            static _ => { },
            contentMinHeight: 200
        );
    }

    private static StackPanelComponent CreateLinkColumn(string heading, string[] labels)
    {
        StackPanelComponent column = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(6)
            .AddChild(new TextComponent()
                .SetTitle(heading)
                .SetTitleType(UITextAppearance.Overline)
                .SetTitleColor(UIThemeColor.Muted)
                .SetMargin(UIThickness.All(0, 0, 0, 4))
            );

        foreach (var label in labels)
            _ = column.AddChild(new LinkComponent().SetText(label).SetUrl("#").SetTextType(UITextAppearance.Body).SetHorizontalAlignment(UIAlignment.Start));

        return column;
    }

    private static ContainerComponent CreateResourceLinksGroup()
    {
        return DemoUI.CreateGroup(null, "With icons",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(10)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new LinkComponent().SetText("Read the architecture guide").SetUrl("#").SetIcon(LucideIcons.FileText).SetHorizontalAlignment(UIAlignment.Start))
                .AddChild(new LinkComponent().SetText("Open repository").SetUrl("#").SetIcon(LucideIcons.ExternalLink).SetHorizontalAlignment(UIAlignment.Start))
                .AddChild(new LinkComponent().SetText("Download release 2.4").SetUrl("#").SetIcon(LucideIcons.Download).SetHorizontalAlignment(UIAlignment.Start))
                .AddChild(new LinkComponent()
                    .SetText("Delete workspace")
                    .SetUrl("#")
                    .SetIcon(LucideIcons.Delete)
                    .SetTextColor(UIThemeColor.Danger)
                    .SetHorizontalAlignment(UIAlignment.Start)
                )
            ),
            static _ => { },
            contentMinHeight: 160
        );
    }
}
