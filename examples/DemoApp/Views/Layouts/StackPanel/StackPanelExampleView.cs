using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.StackPanel;

internal sealed class StackPanelExampleView : DemoExampleView, IUIViewDefinition
{
    private static readonly string[] Tags = ["design", "frontend", "signalr", "performance", "good first issue", "docs", "breaking"];

    public static string ViewKey => "demo.layouts.stack-panel.example";

    protected override string ComponentRoute => "/layouts/stack-panel";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.layouts.stack-panel.header";
    protected override string HeaderDescription => "demo.layouts.stack-panel.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateToolbarGroup())
            .AddChild(CreateActivityFeedGroup())
            .AddChild(CreateTagChipsGroup());
    }

    private static ContainerComponent CreateToolbarGroup()
    {
        return DemoUI.CreateGroup(null, "Toolbar (horizontal)",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetSpacing(4)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(CreateToolButton(LucideIcons.Edit, "Edit"))
                .AddChild(CreateToolButton(LucideIcons.Copy, "Duplicate"))
                .AddChild(new SeparatorComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetHeight(UILayoutLength.Absolute(24))
                    .SetMargin(UIThickness.All(4, 0, 4, 0))
                )
                .AddChild(CreateToolButton(LucideIcons.Send, "Share"))
                .AddChild(CreateToolButton(LucideIcons.Delete, "Delete"))
            ),
            static _ => { },
            contentMinHeight: 80
        );
    }

    private static ButtonComponent CreateToolButton(string icon, string title)
        => new ButtonComponent()
            .SetType(UIButtonType.Ghost)
            .ConfigureDefaultContent(c => c.SetIcon(icon).SetTitle(title).SetTitleType(UITextAppearance.Caption));

    private static ContainerComponent CreateActivityFeedGroup()
    {
        return DemoUI.CreateGroup(null, "Activity feed (vertical)",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetWidth(UILayoutLength.Absolute(340))
                .SetPlacement(1, 1, 24, 1)
                .AddChild(CreateActivityRow(LucideIcons.Check, UIColorStyle.Success, "Robin merged #482", "Fix circular progress anti-aliasing · 5 min ago"))
                .AddChild(CreateActivityRow(LucideIcons.MessageSquare, UIColorStyle.Info, "Sam commented", "\"Can we ship the theme override today?\" · 22 min ago"))
                .AddChild(CreateActivityRow(LucideIcons.Upload, UIColorStyle.Primary, "Aki deployed to staging", "Build 2.4.108 · 1 h ago"))
            ),
            static _ => { },
            contentMinHeight: 160
        );
    }

    private static TextComponent CreateActivityRow(string icon, UIColorStyle iconStyle, string title, string detail)
        => new TextComponent()
            .SetIcon(icon)
            .SetIconColor(UIThemeColor.FromStyle(iconStyle))
            .SetTitle(title)
            .SetTitleType(UITextAppearance.Body)
            .SetDescription(detail)
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted);

    private static ContainerComponent CreateTagChipsGroup()
    {
        return DemoUI.CreateGroup(null, "Tag chips (wrapping, narrow)",
            content =>
            {
                StackPanelComponent chips = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(6)
                    .SetWrap(true)
                    .SetWidth(UILayoutLength.Absolute(220))
                    .SetPlacement(1, 1, 24, 1);

                foreach (var tag in Tags)
                {
                    _ = chips.AddChild(new ContainerComponent()
                        .SetPadding(UIThickness.All(8, 3, 8, 3))
                        .SetBackground(UIThemeColor.Surface)
                        .SetBorderColor(UIThemeColor.Border)
                        .SetBorderThickness(UIThickness.Uniform(1))
                        .SetBorderRadius(UICornerRadius.Uniform(999))
                        .AddRow(UIGridUnit.Auto())
                        .AddChild(new TextComponent()
                            .SetTitle(tag)
                            .SetTitleType(UITextAppearance.Caption)
                            .SetPlacement(1, 1, 24, 1)
                        ));
                }

                _ = content.AddChild(chips);
            },
            static _ => { },
            contentMinHeight: 120
        );
    }
}
