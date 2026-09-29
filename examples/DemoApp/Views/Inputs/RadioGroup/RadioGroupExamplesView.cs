using DemoApp.Views.Base;
using NE.Standard.UI.Components.Foundation;

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
        _ = container.AddChildren(DemoUI.CreateColumns([CreatePlainGroup()], [CreateOrientationGroup()]));

        _ = container.AddChild(CreateItemGroup());
    }

    /// <summary>The ordinary case: a name per answer, and the same question with nothing answered yet.</summary>
    /// <remarks>Across rather than down, since a group of short answers is a third of its column wide.</remarks>
    private static ContainerComponent CreatePlainGroup()
    {
        return DemoUI.CreateExample("A list of answers",
            UILayout.Row(48)
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Deploy strategy")
                    .SetOptions(Strategies())
                    .SetValue("rolling")
                )
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Nothing chosen yet")
                    .SetOptions(Strategies())
                )
        );
    }

    /// <summary>
    /// Laid out across instead of down, which suits short answers and never two-line ones.
    /// </summary>
    private static ContainerComponent CreateOrientationGroup()
    {
        // Both from the top: a row centres its children, which would drop the shorter group's title below the taller one's.
        return DemoUI.CreateExample("Laid out down, or across",
            UILayout.Row(48)
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Vertical — the default")
                    .SetOptions(Plans())
                    .SetValue("standard")
                    .SetVerticalAlignment(UIAlignment.Start)
                )
                .AddChild(new RadioGroupComponent()
                    .SetTitle("Horizontal")
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetOptions(Plans())
                    .SetValue("standard")
                    .SetVerticalAlignment(UIAlignment.Start)
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
        return DemoUI.CreateExample("More than a name",
            UILayout.Row(48)
                .AddChild(UIPage.Labelled("The default row — glyph, second line and badge", new RadioGroupComponent()
                    .SetTitle("Target environment")
                    .SetIcon(DemoIcons.Navigation)
                    .SetOptions(DemoSamples.Environments())
                    .SetValue("staging")
                    )
                )
                .AddChild(UIPage.Labelled("A template of your own, over the same options", new RadioGroupComponent()
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
                    .SetOptions(DemoSamples.Environments())
                    .SetValue("staging")
                    )
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

    private static OptionItem[] Plans()
        => [
            new() { Id = "starter", Title = "Starter" },
            new() { Id = "standard", Title = "Standard" },
            new() { Id = "pro", Title = "Pro" }
        ];
}
