using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Actions.Button;

internal sealed class ButtonExampleView : DemoExampleView, IUIViewDefinition
{
    public static string ViewKey => "demo.actions.button.example";

    protected override string ComponentRoute => "/actions/button";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.actions.button.header";
    protected override string HeaderDescription => "demo.actions.button.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateDialogFooterGroup())
            .AddChild(CreateDestructiveGroup())
            .AddChild(CreateTypeReferenceGroup());
    }

    private static ContainerComponent CreateDialogFooterGroup()
    {
        return DemoUI.CreateGroup(null, "Form footer",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetWidth(UILayoutLength.Absolute(320))
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new TextComponent()
                    .SetTitle("Rename workspace")
                    .SetTitleType(UITextAppearance.Subtitle)
                    .SetDescription("The new name is visible to every member.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetHorizontalAlignment(UIAlignment.End)
                    .SetSpacing(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .ConfigureDefaultContent(c => c.SetTitle("Cancel"))
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Primary)
                        .ConfigureDefaultContent(c => c.SetIcon(LucideIcons.Save).SetTitle("Save changes"))
                    )
                )
            ),
            static _ => { },
            contentMinHeight: 140
        );
    }

    private static ContainerComponent CreateDestructiveGroup()
    {
        return DemoUI.CreateGroup(null, "Destructive confirmation",
            content => content.AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Vertical)
                .SetSpacing(12)
                .SetWidth(UILayoutLength.Absolute(320))
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new TextComponent()
                    .SetIcon(LucideIcons.Warning)
                    .SetIconColor(UIThemeColor.Danger)
                    .SetTitle("Delete project \"nova-web\"?")
                    .SetTitleType(UITextAppearance.Subtitle)
                    .SetDescription("All deployments and history will be removed. This cannot be undone.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .AddChild(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(8)
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Danger)
                        .ConfigureDefaultContent(c => c.SetIcon(LucideIcons.Delete).SetTitle("Delete project"))
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Outline)
                        .ConfigureDefaultContent(c => c.SetTitle("Keep it"))
                    )
                )
            ),
            static _ => { },
            contentMinHeight: 140
        );
    }

    private static ContainerComponent CreateTypeReferenceGroup()
    {
        return DemoUI.CreateGroup(null, "Type reference",
            content =>
            {
                StackPanelComponent row = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(12)
                    .SetWrap(true);

                foreach (UIButtonType type in Enum.GetValues<UIButtonType>())
                {
                    _ = row.AddChild(new ButtonComponent()
                        .SetType(type)
                        .ConfigureDefaultContent(c => c.SetTitle(type.ToString()))
                    );
                }

                _ = row.AddChild(new ButtonComponent()
                    .SetEnabled(false)
                    .ConfigureDefaultContent(c => c.SetTitle("Disabled"))
                );

                _ = content.AddChild(row);
            },
            static _ => { },
            contentMinHeight: 100
        );
    }
}
