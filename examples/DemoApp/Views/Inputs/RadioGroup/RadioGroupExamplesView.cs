using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.Foundation;
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
            [CreatePlainGroup()],
            [CreateOrientationGroup()]
        ));

        _ = container.AddChild(CreateItemGroup());
    }

    /// <summary>The ordinary case: a name per answer, and the same question with nothing answered yet.</summary>
    /// <remarks>Across rather than down, since a group of short answers is a third of its column wide.</remarks>
    private static ContainerComponent CreatePlainGroup()
    {
        return DemoUI.CreateGroup(null, "A list of answers",
            content => content.AddChild(DemoUI.CreateRow(48)
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Deploy strategy")
                    .SetOptions(Strategies())
                    .SetValue("rolling")
                )
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Nothing chosen yet")
                    .SetOptions(Strategies())
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// Laid out across instead of down, which suits short answers and never two-line ones.
    /// </summary>
    private static ContainerComponent CreateOrientationGroup()
    {
        return DemoUI.CreateGroup(null, "Laid out down, or across",
            content => content.AddChild(DemoUI.CreateRow(48)
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
                .SetPlacement(1, 1, 24, 1)
            ),
            note: "Horizontal is for answers of a word or two: a second line under one of them puts the row's baselines out."
        );
    }

    /// <summary>
    /// What an option carries beyond its name, drawn by the default row and then by a template of the author's own.
    /// </summary>
    /// <remarks>The same three options both times, or the difference between the two rows cannot be read.</remarks>
    private static ContainerComponent CreateItemGroup()
    {
        return DemoUI.CreateGroup(null, "More than a name",
            content => content.AddChild(DemoUI.CreateRow(48)
                .AddChild(DemoUI.CreateCaptionedItem("The default row — glyph, second line and badge", new RadioGroupComponent()
                    .SetTitle("Target environment")
                    .SetIcon(DemoIcons.Navigation)
                    .SetOptions(Environments())
                    .SetValue("staging")
                ))
                .AddChild(DemoUI.CreateCaptionedItem("A template of your own, over the same options", new RadioGroupComponent()
                    .SetTitle("Target environment")
                    .SetIcon(DemoIcons.Navigation)
                    .SetTemplate(new TextComponent()
                        .BindText()
                        .SetIconSize(UIIconSize.Large)
                        .SetIconColor(UIThemeColor.FromStyle(UIColorStyle.Accent))
                        .SetTitleType(UITextAppearance.Body)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                        .SetBadgePlacement(UITextBadgePlacement.Trailing)
                    )
                    .SetOptions(Environments())
                    .SetValue("staging")
                ))
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24,
            note: "The template binds what the item says and decides everything the item does not: the glyph's size, which line is quiet, where the badge sits."
        );
    }

    private static OptionItem[] Strategies()
        => [
            new() { Id = "rolling", Title = "Rolling" },
            new() { Id = "blue-green", Title = "Blue / green" },
            new() { Id = "recreate", Title = "Recreate" }
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
}
