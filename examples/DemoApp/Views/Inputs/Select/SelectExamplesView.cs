using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Inputs.Select;

/// <summary>
/// What a dropdown is used for: a list of plain names, a list where every option carries a glyph, a second
/// line and a badge, and a template written by hand for the ones where the default's order is wrong.
/// </summary>
/// <remarks>The closed trigger draws the chosen option through the same template the list used, so it stays rich.</remarks>
internal sealed class SelectExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.inputs.select.examples";

    protected override string ComponentRoute => "/inputs/select";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.inputs.select.header";
    protected override string HeaderDescription => "demo.inputs.select.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreatePlainGroup(), CreateTemplateGroup()],
            [CreateRichGroup(), CreateFieldGroup()]
        ));
    }

    /// <summary>The ordinary case: a name per option, headed by the group each belongs to.</summary>
    private static ContainerComponent CreatePlainGroup()
    {
        return DemoUI.CreateGroup(null, "A list of names",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new SelectComponent()
                    .SetTitle("Region")
                    .SetPlaceholder("Pick a region")
                    .SetOptions(RegionOptions())
                    .SetValue("eu-west-1")
                    .SetShowClearButton()
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Nothing chosen yet")
                    .SetPlaceholder("Pick a region")
                    .SetOptions(RegionOptions())
                )
            ),
            contentMinHeight: 240
        );
    }

    /// <summary>
    /// The same control over options carrying every text surface, with no template of its own.
    /// </summary>
    private static ContainerComponent CreateRichGroup()
    {
        return DemoUI.CreateGroup(null, "An option with more than a name",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new SelectComponent()
                    .SetTitle("Target environment")
                    .SetPlaceholder("Pick an environment")
                    .SetOptions(Environments())
                    .SetValue("prod")
                    .SetShowClearButton()
                )
                .AddChild(new ParagraphComponent()
                    .SetDescription("The trigger shows the chosen option through the list's own template — icon, second line and badge included.")
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetDescriptionColor(UIThemeColor.Muted)
                )
            ),
            contentMinHeight: 260
        );
    }

    /// <summary>
    /// A template of the author's own: it binds the same item properties through <c>BindText</c> and then says how a row is drawn.
    /// </summary>
    /// <remarks>A literal here wins wherever the item says nothing, and a template of your own starts from a bare <c>TextComponent</c>.</remarks>
    private static ContainerComponent CreateTemplateGroup()
    {
        return DemoUI.CreateGroup(null, "A template of your own",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new SelectComponent()
                    .SetTitle("On call")
                    .SetPlaceholder("Pick an engineer")
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
            contentMinHeight: 220
        );
    }

    /// <summary>The trigger's own surface: the two appearances, an affix icon, and a read-only dropdown.</summary>
    private static ContainerComponent CreateFieldGroup()
    {
        return DemoUI.CreateGroup(null, "The field it sits in",
            content => content.AddChild(DemoUI.CreateStack()
                .AddChild(new SelectComponent()
                    .SetTitle("Filled")
                    .SetOptions(RegionOptions())
                    .SetValue("us-east-1")
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Underline")
                    .SetAppearance(UIInputAppearance.Underline)
                    .SetOptions(RegionOptions())
                    .SetValue("us-east-1")
                )
                .AddChild(new SelectComponent()
                    .SetTitle("With an affix icon")
                    .SetPrefixIcon(DemoIcons.Navigation)
                    .SetOptions(RegionOptions())
                    .SetValue("ap-south-1")
                )
                .AddChild(new SelectComponent()
                    .SetTitle("Read-only")
                    .SetOptions(RegionOptions())
                    .SetValue("eu-west-1")
                    .SetIsReadOnly(true)
                )
            ),
            contentMinHeight: 320
        );
    }

    private static OptionItem[] RegionOptions()
        => [
            new() { Id = "eu-west-1", Title = "Ireland", Group = "Europe" },
            new() { Id = "eu-central-1", Title = "Frankfurt", Group = "Europe" },
            new() { Id = "us-east-1", Title = "N. Virginia", Group = "Americas" },
            new() { Id = "ap-south-1", Title = "Mumbai", Group = "Asia Pacific" }
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
