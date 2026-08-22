using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.Text;

internal sealed class TextExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.text.example";

    protected override string ComponentRoute => "/contents/text";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.contents.text.header";
    protected override string HeaderDescription => "demo.contents.text.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateGalleryItem("Icon + title", new TextComponent()
                .SetIcon(LucideIcons.Bell)
                .SetTitle("New message")
            ))
            .AddChild(CreateGalleryItem("Title + description", new TextComponent()
                .SetTitle("Weekly report")
                .SetDescription("Generated automatically every Monday at 9:00 AM.")
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
            ))
            .AddChild(CreateGalleryItem("Title + badge", new TextComponent()
                .SetTitle("Release 2.4")
                .SetBadgeText("New")
                .SetBadgeStyle(UIBadgeType.Success)
            ))
            .AddChild(CreateGalleryItem("Icon + title + description + badge", new TextComponent()
                .SetIcon(LucideIcons.Shield)
                .SetTitle("Two-factor auth")
                .SetDescription("Adds an extra layer of security to your account.")
                .SetBadgeText("Recommended")
                .SetBadgeStyle(UIBadgeType.Info)
            ))
            .AddChild(CreateGalleryItem("Emphasis / danger variant", new TextComponent()
                .SetIcon(LucideIcons.Alert)
                .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                .SetTitle("Storage full")
                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                .SetDescription("You're using 98% of your allotted storage.")
                .SetBadgeText("Action needed")
                .SetBadgeStyle(UIBadgeType.Danger)
            ))
            .AddChild(CreateWrapGallery());
    }

    private static ContainerComponent CreateGalleryItem(string label, TextComponent text)
    {
        return DemoUI.CreateGroup(null, label,
            content => content.AddChild(text
                .SetWidth(UILayoutLength.Absolute(320))
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 120
        );
    }

    private static ContainerComponent CreateWrapGallery()
    {
        const string longText = "A longer supporting description that is long enough to actually wrap across multiple lines in a narrow column.";

        return DemoUI.CreateGroup(null, "Alignment & wrap",
            content =>
            {
                StackPanelComponent stack = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(16)
                    .SetWrap(true);

                foreach (UITextAlignment alignment in Enum.GetValues<UITextAlignment>())
                {
                    _ = stack.AddChild(new TextComponent()
                        .SetWidth(UILayoutLength.Absolute(160))
                        .SetTitle(alignment.ToString())
                        .SetDescription(longText)
                        .SetTextAlignment(alignment)
                        .SetWrapMode(UITextWrapMode.Wrap)
                    );
                }

                _ = stack.AddChild(new TextComponent()
                    .SetWidth(UILayoutLength.Absolute(160))
                    .SetTitle("NoWrap")
                    .SetDescription(longText)
                    .SetWrapMode(UITextWrapMode.NoWrap)
                );

                _ = stack.AddChild(new TextComponent()
                    .SetWidth(UILayoutLength.Absolute(160))
                    .SetTitle("WrapEllipsis")
                    .SetDescription(longText)
                    .SetWrapMode(UITextWrapMode.WrapEllipsis)
                    .SetMaxLines(2)
                );

                _ = content.AddChild(stack.SetPlacement(1, 1, 24, 1));
            },
            static _ => { },
            contentMinHeight: 160
        );
    }
}
