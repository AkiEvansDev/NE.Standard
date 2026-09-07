using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Components.Foundation.Inputs;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.RadioGroup;

/// <summary>
/// One question with several answers, all on screen at once, which is the choice against a dropdown.
/// </summary>
internal sealed class RadioGroupExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.radio-group.examples";

    protected override string ComponentRoute => "/inputs/radio-group";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.radio-group.header";
    protected override string HeaderDescription => "demo.inputs.radio-group.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreatePlainGroup(), CreateOrientationGroup(), CreateStateGroup()],
            [CreateRichGroup(), CreateTemplateGroup()]
        ));
    }

    /// <summary>The ordinary case: a name per answer, and one of them already chosen.</summary>
    private static ContainerComponent CreatePlainGroup()
    {
        return DemoUI.CreateGroup(null, "A list of answers",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Deploy strategy")
                    .SetOptions(Strategies())
                    .SetValue("rolling")
                )
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Nothing chosen yet")
                    .SetOptions(Strategies())
                )
            ),
            contentMinHeight: 320
        );
    }

    /// <summary>
    /// The same control over options that carry a glyph, a second line and a badge, with no template of its own.
    /// </summary>
    private static ContainerComponent CreateRichGroup()
    {
        return DemoUI.CreateGroup(null, "An answer with more than a name",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Target environment")
                    .SetIcon(DemoIcons.Navigation)
                    .SetOptions(Environments())
                    .SetValue("staging")
                )
            ),
            contentMinHeight: 300
        );
    }

    /// <summary>
    /// Laid out across instead of down, which suits short answers and never two-line ones.
    /// </summary>
    private static ContainerComponent CreateOrientationGroup()
    {
        return DemoUI.CreateGroup(null, "Orientation",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Vertical — the default")
                    .SetOptions(Sizes())
                    .SetValue("m")
                )
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Horizontal")
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetOptions(Sizes())
                    .SetValue("m")
                )
            ),
            contentMinHeight: 280
        );
    }

    /// <summary>
    /// A template of the author's own: it binds what the item says and decides everything the item does not.
    /// </summary>
    private static ContainerComponent CreateTemplateGroup()
    {
        return DemoUI.CreateGroup(null, "A template of your own",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new RadioGroupComponent()
                    .SetTitle("On call")
                    .SetTemplate(new TextComponent()
                        .BindText()
                        .SetIconSize(UIIconSize.Large)
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Accent))
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetBadgePlacement(UITextBadgePlacement.Trailing)
                    )
                    .SetOptions(Engineers())
                    .SetValue("robin")
                )
            ),
            contentMinHeight: 280
        );
    }

    /// <summary>
    /// The states, including a single answer disabled by its item rather than the whole group.
    /// </summary>
    private static ContainerComponent CreateStateGroup()
    {
        return DemoUI.CreateGroup(null, "States",
            content => content.AddChild(DemoUI.CreateStack(16)
                .AddChild(new RadioGroupComponent()
                    .SetTitle("One answer unavailable")
                    .SetOptions(StrategiesWithOneDisabled())
                    .SetValue("rolling")
                )
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Read-only")
                    .SetOptions(Strategies())
                    .SetValue("blue-green")
                    .SetIsReadOnly(true)
                )
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Disabled")
                    .SetOptions(Strategies())
                    .SetValue("rolling")
                    .SetEnabled(false)
                )
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Required")
                    .SetBadgeText("Pick one")
                    .SetBadgeStyle(UIBadgeType.Warning)
                    .SetOptions(Strategies())
                    .Required("A deploy strategy is required.")
                )
            ),
            contentMinHeight: 520
        );
    }

    private static OptionItem[] Strategies()
        => [
            new() { Id = "rolling", Title = "Rolling" },
            new() { Id = "blue-green", Title = "Blue / green" },
            new() { Id = "recreate", Title = "Recreate" }
        ];

    private static OptionItem[] StrategiesWithOneDisabled()
        => [
            new() { Id = "rolling", Title = "Rolling" },
            new() { Id = "blue-green", Title = "Blue / green" },
            new() { Id = "recreate", Title = "Recreate", Description = "Needs a maintenance window", Enabled = false }
        ];

    private static OptionItem[] Sizes()
        => [
            new() { Id = "s", Title = "Small" },
            new() { Id = "m", Title = "Medium" },
            new() { Id = "l", Title = "Large" }
        ];

    private static OptionItem[] Environments()
        => [
            new()
            {
                Id = "prod",
                Icon = DemoIcons.Shield,
                Title = "Production",
                Description = "eu-west-1 · 12 replicas",
                BadgeText = "Locked",
                BadgeStyle = UIBadgeType.Danger
            },
            new()
            {
                Id = "staging",
                Icon = DemoIcons.BadgeCheck,
                Title = "Staging",
                Description = "eu-west-1 · 3 replicas",
                BadgeText = "Open",
                BadgeStyle = UIBadgeType.Success
            },
            new()
            {
                Id = "dev",
                Icon = DemoIcons.Settings,
                Title = "Development",
                Description = "eu-central-1 · 1 replica",
                BadgeText = "Rebuilt daily",
                BadgeStyle = UIBadgeType.Info
            }
        ];

    private static OptionItem[] Engineers()
        => [
            new() { Id = "robin", Icon = DemoIcons.UserRound, Title = "Robin", Description = "Platform · until 18:00" },
            new() { Id = "sam", Icon = DemoIcons.UserRound, Title = "Sam", Description = "Payments · until 22:00" },
            new() { Id = "alex", Icon = DemoIcons.UserRound, Title = "Alex", Description = "Night shift" }
        ];
}
