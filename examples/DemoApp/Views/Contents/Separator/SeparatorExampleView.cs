using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.Separator;

internal sealed class SeparatorExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.separator.example";

    protected override string ComponentRoute => "/contents/separator";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.contents.separator.header";
    protected override string HeaderDescription => "demo.contents.separator.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateSettingsSectionsGroup())
            .AddChild(CreateColorGallery());
    }

    private static ContainerComponent CreateSettingsSectionsGroup()
    {
        return DemoUI.CreateGroup(null, "Section breaks in a settings list",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(10)
                .SetWidth(UILayoutLength.Absolute(320))
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new SeparatorComponent().SetLabel("Profile"))
                .AddChild(CreateSettingRow(LucideIcons.User, "Display name", "Aki Evans"))
                .AddChild(CreateSettingRow(LucideIcons.Mail, "Email", "aki@nova.dev"))
                .AddChild(new SeparatorComponent().SetLabel("Security"))
                .AddChild(CreateSettingRow(LucideIcons.Lock, "Two-factor auth", "Enabled"))
                .AddChild(CreateSettingRow(LucideIcons.Key, "API keys", "2 active"))
                .AddChild(new SeparatorComponent())
                .AddChild(CreateSettingRow(LucideIcons.Delete, "Delete account", "Irreversible"))
            ),
            static _ => { },
            contentMinHeight: 280
        );
    }

    private static TextComponent CreateSettingRow(string icon, string title, string value)
        => new TextComponent()
            .SetIcon(icon)
            .SetTitle(title)
            .SetTitleType(UITextAppearance.Body)
            .SetDescription(value)
            .SetDescriptionType(UITextAppearance.Caption)
            .SetDescriptionColor(UIThemeColor.Muted);

    private static ContainerComponent CreateColorGallery()
    {
        return DemoUI.CreateGroup(null, "Color styles & orientation",
            content =>
            {
                StackPanelComponent stack = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(16)
                    .SetWidth(UILayoutLength.Absolute(240));

                foreach (UIColorStyle style in new[] { UIColorStyle.Muted, UIColorStyle.Primary, UIColorStyle.Accent, UIColorStyle.Danger })
                    _ = stack.AddChild(new SeparatorComponent().SetLabel(style.ToString()).SetColor(UIThemeColor.FromStyle(style)));

                StackPanelComponent row = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(24)
                    .SetHeight(UILayoutLength.Absolute(60))
                    .AddChild(new SeparatorComponent().SetOrientation(UIOrientation.Vertical))
                    .AddChild(new SeparatorComponent().SetOrientation(UIOrientation.Vertical).SetLabel("Or"));

                _ = content
                    .AddRow(UIGridUnit.Star())
                    .AddChild(stack.SetPlacement(1, 1, 24, 1))
                    .AddChild(row.SetPlacement(1, 2, 24, 1));
            },
            static _ => { },
            contentMinHeight: 240
        );
    }
}
