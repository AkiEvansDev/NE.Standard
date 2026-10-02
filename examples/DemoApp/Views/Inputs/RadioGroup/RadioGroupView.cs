using DemoApp.Controllers.Base;
using DemoApp.Controllers.Inputs;
using DemoApp.Controllers.Inputs.RadioGroup;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.Foundation;

namespace DemoApp.Views.Inputs.RadioGroup;

/// <summary>
/// One radio group and every property that can be bound to it; then one question with several answers, all on screen at once, which is the choice against a dropdown.
/// </summary>
/// <remarks>Every option is on screen, so there is no placeholder, nothing to clear and no field to border — only <c>Orientation</c> and <c>Spacing</c>.</remarks>
internal sealed class RadioGroupView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string ValueGroup = nameof(RadioGroupController.ValueGroup);
    private const string OptionsGroup = nameof(RadioGroupController.OptionsGroup);
    private const string ContentGroup = nameof(RadioGroupController.ContentGroup);
    private const string BadgeGroup = nameof(RadioGroupController.BadgeGroup);

    public static string ViewKey => "demo.inputs.radio-group";

    protected override string ComponentRoute => "/inputs/radio-group";
    protected override string Header => "demo.inputs.radio-group.header";
    protected override string HeaderDescription => "demo.inputs.radio-group.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/checkout", "demo.nav.screens.checkout");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(new RadioGroupComponent()
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .BindValue($"{ValueGroup}.{nameof(OptionValueGroupContext.Value)}")
            .BindIsReadOnly($"{ValueGroup}.{nameof(OptionValueGroupContext.IsReadOnly)}")
            .BindSize($"{ValueGroup}.{nameof(OptionValueGroupContext.Size)}")
            .BindItems($"{OptionsGroup}.{nameof(OptionListGroupContext.Options)}")
            .BindOrientation($"{OptionsGroup}.{nameof(RadioOptionsGroupContext.Orientation)}")
            .BindSpacing($"{OptionsGroup}.{nameof(RadioOptionsGroupContext.Spacing)}")
            .BindIcon($"{ContentGroup}.{nameof(TextContentGroupContext.Icon)}")
            .BindIconColor($"{ContentGroup}.{nameof(TextContentGroupContext.IconColor)}")
            .BindIconSize($"{ContentGroup}.{nameof(TextContentGroupContext.IconSize)}")
            .BindTitle($"{ContentGroup}.{nameof(TextContentGroupContext.Title)}")
            .BindTitleType($"{ContentGroup}.{nameof(TextContentGroupContext.TitleType)}")
            .BindTitleColor($"{ContentGroup}.{nameof(TextContentGroupContext.TitleColor)}")
            .BindTooltip($"{ContentGroup}.{nameof(TextContentGroupContext.Tooltip)}")
            .BindTooltipPlacement($"{ContentGroup}.{nameof(TextContentGroupContext.TooltipPlacement)}")
            .BindBadgePlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgePlacement)}")
            .BindBadgeStyle($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeStyle)}")
            .BindBadgeColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeColor)}")
            .BindBadgeIcon($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIcon)}")
            .BindBadgeIconColor($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconColor)}")
            .BindBadgeIconSize($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeIconSize)}")
            .BindBadgeText($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeText)}")
            .BindBadgeTextType($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTextType)}")
            .BindBadgeTooltip($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltip)}")
            .BindBadgeTooltipPlacement($"{BadgeGroup}.{nameof(TextBadgeGroupContext.BadgeTooltipPlacement)}")
            .SetPlacement(1, 1, 24, 1)
        ));

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption)),
            DemoUI.CreateOptionSection(ValueGroup, "Value", nameof(RadioGroupController.CycleValueOption)),
            DemoUI.CreateOptionSection(OptionsGroup, "Options", nameof(RadioGroupController.CycleOptionsOption)),
            DemoUI.CreateOptionSection(ContentGroup, "Content", nameof(RadioGroupController.CycleContentOption)),
            DemoUI.CreateOptionSection(BadgeGroup, "Badge", nameof(RadioGroupController.CycleBadgeOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => [.. DemoUI.CreateColumns([CreatePlainGroup()], [CreateOrientationGroup()]), CreateItemGroup()];

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
                .AddChild(DemoUI.CreateLabelled("The default row — glyph, second line and badge", new RadioGroupComponent()
                    .SetTitle("Target environment")
                    .SetIcon(DemoIcons.Navigation)
                    .SetOptions(DemoSamples.Environments())
                    .SetValue("staging")
                    )
                )
                .AddChild(DemoUI.CreateLabelled("A template of your own, over the same options", new RadioGroupComponent()
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
