using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.Toggle;

/// <summary>
/// The half of a toggle's Examples page that is the same for both of them; the page only says which control to make.
/// </summary>
/// <remarks>Generic over the component rather than an interface, because a fluent setter answers with its own type.</remarks>
internal abstract class ToggleExamplesView<T> : DemoExamplesView
    where T : CheckboxComponent<T>, IUIComponentDefinition
{
    /// <summary>A fresh control of the kind this page is about.</summary>
    protected abstract T Create();

    /// <summary>What several of them are called in the prose on the page.</summary>
    protected abstract string ControlPlural { get; }

    protected sealed override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateSettingsGroup(), CreateRowEndGroup()],
            [CreateLabelGroup(), CreateAgainstRadioGroup()]
        ));
    }

    /// <summary>The ordinary case: a list of independent settings, each answered on its own.</summary>
    private ContainerComponent CreateSettingsGroup()
    {
        return DemoUI.CreateGroup(null, "A list of settings",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(Create()
                    .SetTitle("Require review before deploy")
                    .SetValue(true)
                )
                .AddChild(Create()
                    .SetTitle("Notify the on-call engineer")
                    .SetValue(true)
                )
                .AddChild(Create()
                    .SetTitle("Roll back automatically on a failed health check")
                    .SetValue(false)
                )
                .AddChild(Create()
                    .SetTitle("Keep build artefacts for ninety days")
                    .SetValue(false)
                )
            )
        );
    }

    /// <summary>
    /// The label is a whole text component — icon, second line, badge, tooltip — which is what makes the question answerable.
    /// </summary>
    private ContainerComponent CreateLabelGroup()
    {
        return DemoUI.CreateGroup(null, "The label it carries",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(Create()
                    .SetTitle("Require review before deploy")
                    .SetDescription("**One approval** from someone who did not write it.")
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .SetValue(true)
                )
                .AddChild(Create()
                    .SetIcon(DemoIcons.Shield)
                    .SetTitle("Two-factor authentication")
                    .SetDescription("Adds a *second step* when signing in from a new device.")
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .SetBadgeText("Recommended")
                    .SetBadgeStyle(UIBadgeType.Success)
                    .SetValue(true)
                )
                .AddChild(Create()
                    .SetIcon(DemoIcons.Alert)
                    .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                    .SetTitle("Allow force pushes")
                    .SetDescription("**Anything already pulled stops matching.**")
                    .SetDescriptionColor(UIThemeColor.Muted)
                    .SetBadgeText("Dangerous")
                    .SetBadgeStyle(UIBadgeType.Danger)
                    .SetValue(false)
                )
                .AddChild(Create()
                    .SetTitle("Send a weekly digest")
                    .SetTooltip("Sent on **Monday at 09:00** in the account's own timezone — see [the docs](https://example.com/docs/digest).")
                    .SetValue(true)
                )
            )
        );
    }

    /// <summary>
    /// The other layout a settings screen uses: the control at the far end of the row rather than in front of it.
    /// </summary>
    /// <remarks>Composed by hand, not a property: the control is as wide as itself, so the row is a grid with it in the last column.</remarks>
    private ContainerComponent CreateRowEndGroup()
    {
        return DemoUI.CreateGroup(null, "At the far end of a row",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(DemoUI.CreateStack(4)
                    .AddChild(CreateRowEnd(DemoIcons.Bell, "Deploy notifications", "Sent to #releases", true))
                    .AddChild(CreateRowEnd(DemoIcons.History, "Keep build artefacts", "Ninety days, then they are dropped", false))
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "In front of the text the control is the row's subject; at the far end the text is, and the control only answers it."
        );
    }

    private ContainerComponent CreateRowEnd(string icon, string title, string description, bool value)
        => new ContainerComponent()
            .SetPadding(UIThickness.All(0, 6, 0, 6))
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(new TextComponent()
                .SetIcon(icon)
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Body)
                .SetDescription(description)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.Muted)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetPlacement(1, 1, 23, 1)
            )
            .AddChild(Create()
                .SetValue(value)
                .SetVerticalAlignment(UIAlignment.Center)
                .SetPlacement(24, 1, 1, 1)
            );

    /// <summary>
    /// The control this one is not: one question with several answers is a radio group.
    /// </summary>
    /// <remarks>Side by side rather than stacked, or the two read as one list instead of as a choice between two controls.</remarks>
    private ContainerComponent CreateAgainstRadioGroup()
    {
        return DemoUI.CreateGroup(null, "What it is not",
            content => content.AddChild(DemoUI.CreateRow(32)
                .AddChild(DemoUI.CreateCaptionedItem($"Two {ControlPlural}, two answers", DemoUI.CreateStack(8)
                    .AddChild(Create()
                        .SetTitle("Notify by email")
                        .SetValue(true)
                    )
                    .AddChild(Create()
                        .SetTitle("Notify by chat")
                        .SetValue(true)
                    )
                ))
                .AddChild(DemoUI.CreateCaptionedItem("A radio group, exactly one", new RadioGroupComponent()
                    .SetTitle("Notify me by")
                    .SetOptions(NotifyOptions())
                    .SetValue("email")
                ))
                .SetPlacement(1, 1, 24, 1)
            ),
            note: $"Building a one-of-several choice out of several {ControlPlural} is the mistake this group exists to head off."
        );
    }

    private static OptionItem[] NotifyOptions()
        => [
            new() { Id = "email", Title = "Email" },
            new() { Id = "chat", Title = "Chat" },
            new() { Id = "none", Title = "Not at all" }
        ];
}
