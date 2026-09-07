using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.Foundation.Inputs;
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
            [CreateSettingsGroup(), CreateStateGroup()],
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
            ),
            contentMinHeight: 240
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
                    .SetDescription("Every merge into the release branch waits for **one approval** from someone who did not write it — [the review policy](https://example.com/docs/review).")
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
                    .SetTitle("Allow force pushes to the release branch")
                    .SetDescription("History can be rewritten. **Anything already pulled from it stops matching.**")
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
            ),
            contentMinHeight: 300
        );
    }

    /// <summary>
    /// The three values a toggle can hold and the two ways it can be locked; the third is an unanswered question.
    /// </summary>
    private ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(Create()
                    .SetTitle("On")
                    .SetValue(true)
                )
                .AddChild(Create()
                    .SetTitle("Off")
                    .SetValue(false)
                )
                .AddChild(Create()
                    .SetTitle("Never answered — the value is null")
                    .SetDescription("Not the same as off: *nobody has said either way yet*.")
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .AddChild(Create()
                    .SetTitle("Read-only")
                    .SetValue(true)
                    .SetIsReadOnly(true)
                )
                .AddChild(Create()
                    .SetTitle("Disabled")
                    .SetValue(false)
                    .SetEnabled(false)
                )
                .AddChild(Create()
                    .SetTitle("I accept the terms")
                    .Required("The terms have to be accepted.")
                )
            ),
            contentMinHeight: 340
        );
    }

    /// <summary>
    /// The control this one is not: one question with several answers is a radio group.
    /// </summary>
    private ContainerComponent CreateAgainstRadioGroup()
    {
        return DemoUI.CreateGroup(null, "What it is not",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(Create()
                    .SetTitle("Notify by email")
                    .SetValue(true)
                )
                .AddChild(Create()
                    .SetTitle("Notify by chat")
                    .SetValue(true)
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription($"Two {ControlPlural}, **two independent answers**, and both may be on. A choice where *exactly one* answer is allowed is a **RadioGroup** — building one out of several of these is the mistake this group exists to head off.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Notify me by")
                    .SetOptions(NotifyOptions())
                    .SetValue("email")
                )
            ),
            contentMinHeight: 320
        );
    }

    private static OptionItem[] NotifyOptions()
        => [
            new() { Id = "email", Title = "Email" },
            new() { Id = "chat", Title = "Chat" },
            new() { Id = "none", Title = "Not at all" }
        ];
}
