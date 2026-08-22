using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Layouts.Card;

internal sealed class CardExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.layouts.card.example";

    protected override string ComponentRoute => "/layouts/card";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.layouts.card.header";
    protected override string HeaderDescription => "demo.layouts.card.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateGalleryItem("Article", new CardComponent()
                .ConfigureDefaultHeader(h => h
                    .SetTitle("Server-driven UI")
                    .SetDescription("8 min read · Architecture")
                )
                .SetContent(new TextComponent()
                    .SetDescription("Views are authored entirely in C#, compiled into a component graph on the server, and rendered to the browser as incremental DOM updates over SignalR.")
                    .SetDescriptionType(UITextAppearance.Body)
                )
            ))
            .AddChild(CreateGalleryItem("Team member", new CardComponent()
                .ConfigureDefaultHeader(h => h
                    .SetTitle("Robin Hale")
                    .SetDescription("Client runtime")
                    .SetIcon(LucideIcons.UserRound)
                    .SetBadgeText("Admin")
                )
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(8)
                    .AddChild(new TextComponent().SetIcon(LucideIcons.Mail).SetTitle("robin@nova.dev").SetTitleType(UITextAppearance.Caption))
                    .AddChild(new TextComponent().SetIcon(LucideIcons.Clock).SetTitle("UTC+2 · usually online 9-17").SetTitleType(UITextAppearance.Caption))
                )
            ))
            .AddChild(CreateGalleryItem("Metric", new CardComponent()
                .ConfigureDefaultHeader(h => h
                    .SetTitle("Deploys this week")
                    .SetBadgeText("+18%")
                )
                .SetContent(new TextComponent()
                    .SetTitle("47")
                    .SetTitleType(UITextAppearance.Display)
                    .SetDescription("12 to production, 35 to staging")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            ))
            .AddChild(CreateGalleryItem("Footer actions (clickable)", new CardComponent()
                .SetClickable(true)
                .ConfigureDefaultHeader(h => h
                    .SetTitle("nova-web · #482")
                    .SetDescription("Fix circular progress anti-aliasing")
                    .SetIcon(LucideIcons.Check)
                )
                .SetContent(new TextComponent()
                    .SetDescription("All checks passed. 2 approvals, no requested changes — ready to merge.")
                    .SetDescriptionType(UITextAppearance.Body)
                )
                .SetFooter(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .ConfigureDefaultContent(c => c.SetTitle("Merge"))
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .ConfigureDefaultContent(c => c.SetTitle("View diff"))
                    )
                )
            ));
    }

    private static ContainerComponent CreateGalleryItem(string label, CardComponent card)
    {
        return DemoUI.CreateGroup(null, label,
            content => content.AddChild(card
                .SetWidth(UILayoutLength.Absolute(300))
                .SetHorizontalAlignment(UIAlignment.Center)
                .SetPlacement(1, 1, 24, 1)
            ),
            static _ => { },
            contentMinHeight: 180
        );
    }
}
