using System;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Contents.Text;

/// <summary>
/// The component every other text-bearing control is made of, seen where it actually appears.
/// </summary>
/// <remarks>The same body rendered as somebody else's header, label or caption, plus the cases the two alignments disagree about.</remarks>
internal sealed class TextExamplesView : DemoExamplesView, IUIViewDefinition
{
    private const string Description = "Adds a second step when signing in from a new device.";

    public static string ViewKey => "demo.contents.text.examples";

    protected override string ComponentRoute => "/contents/text";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.text.header";
    protected override string HeaderDescription => "demo.contents.text.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        // Not every other one: the five hosts are most of a page by themselves, and they take the full width.
        _ = container.AddChild(CreateHostsGroup());

        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateSwappedRolesGroup(), CreateAlignmentEdgesGroup()],
            [CreatePictureIconGroup(), CreateFoldGroup()]
        ));
    }

    /// <summary>
    /// The same four properties set five times on five components that each own a text body inside.
    /// </summary>
    private static ContainerComponent CreateHostsGroup()
    {
        return DemoUI.CreateGroup(null, "The same body, worn by five controls",
            // Across rather than down: six hosts in a column is a page of its own, and the point is that they match.
            content => content.AddChild(DemoUI.CreateRow(24)
                .AddChild(CreateHost("On its own", new TextComponent()
                    .SetIcon(DemoIcons.Shield)
                    .SetTitle("Two-factor authentication")
                    .SetDescription(Description)
                    .SetBadgeText("Recommended")
                    .SetBadgeStyle(UIBadgeType.Info)
                ))
                .AddChild(CreateHost("As a card's header", new CardComponent()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Two-factor authentication")
                        .SetDescription(Description)
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Info)
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("The card gives it a band and a rule; the body inside is unchanged.")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                ))
                .AddChild(CreateHost("As an expander's header", new ExpanderComponent()
                    .SetCollapsed()
                    .ConfigureDefaultHeader(header => header
                        .SetIcon(DemoIcons.Shield)
                        .SetTitle("Two-factor authentication")
                        .SetDescription(Description)
                        .SetBadgeText("Recommended")
                        .SetBadgeStyle(UIBadgeType.Info)
                    )
                    .SetContent(new ParagraphComponent()
                        .SetDescription("And the expander adds a chevron, which is its own and not the text's.")
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                ))
                .AddChild(CreateHost("As a button's label", new ButtonComponent()
                    .SetType(UIButtonType.Outline)
                    .SetHorizontalAlignment(UIAlignment.Stretch)
                    .SetTextAlignment(UITextAlignment.Start)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Shield))
                    .SetTitle("Two-factor authentication")
                    .SetDescription(Description)
                    .SetDescriptionType(UITextAppearance.Caption)
                    .SetBadgeText("Recommended")
                    .SetBadgeStyle(UIBadgeType.Info)
                    .SetBadgePlacement(UITextBadgePlacement.Trailing)
                ))
                .AddChild(CreateHost("As a row that points somewhere", new ActionComponent()
                    .SetIcon(DemoIcons.Shield)
                    .SetTitle("Two-factor authentication")
                    .SetDescription(Description)
                    .SetBadgeText("Recommended")
                    .SetBadgeStyle(UIBadgeType.Info)
                ))
                // The one host that does not carry the whole body: a field's caption has no description.
                .AddChild(CreateHost("As an input's caption — no description", new TextInputComponent()
                    .SetIcon(DemoIcons.Shield)
                    .SetTitle("Two-factor authentication")
                    .SetBadgeText("Recommended")
                    .SetBadgeStyle(UIBadgeType.Info)
                    .SetValue("robin@example.com")
                ))
                .SetPlacement(1, 1, 24, 1)
            ),
            columns: 24,
            note: "One body, one set of four properties, six hosts: what differs between the tiles belongs to the host, never to the text."
        );
    }

    // Wide enough that a header does not ellipsise, which would read as a difference between hosts.
    private static StackPanelComponent CreateHost(string caption, IVisualComponent sample)
        => DemoUI.CreateCaptionedItem(caption, sample)
            .SetWidth(UILayoutLength.Absolute(590));

    /// <summary>
    /// The two slots are two positions, not two importances: an Overline title over a Subtitle description
    /// lets the category lead while the name carries the weight.
    /// </summary>
    /// <remarks>The icon goes to <c>Content</c> alignment, since Title alignment would pin it to the small line.</remarks>
    private static ContainerComponent CreateSwappedRolesGroup()
    {
        return DemoUI.CreateGroup(null, "When the small line comes first",
            content => content.AddChild(DemoUI.CreateRow(16)
                .AddChild(CreateCategoryCard(DemoImages.Logo, "Gaming services", "Build Automation", "Automatically build your project for multiple platforms."))
                .AddChild(CreateCategoryCard(DemoIcons.Shield, "Beta", "Assistant", "Answers about the code in the editor you are already in."))
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static CardComponent CreateCategoryCard(string icon, string category, string name, string body)
        => new CardComponent()
            .SetWidth(UILayoutLength.Absolute(260))
            .ConfigureDefaultHeader(header => header
                .SetIcon(icon)
                .SetIconAlignment(UITextIconAlignment.Content)
                .SetTitle(category)
                .SetTitleType(UITextAppearance.Overline)
                .SetTitleColor(UIThemeColor.Muted)
                .SetDescription(name)
                .SetDescriptionType(UITextAppearance.Subtitle)
                .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.OnSurface))
            )
            .SetContent(new ParagraphComponent()
                .SetDescription(body)
                .SetDescriptionType(UITextAppearance.Caption)
                .SetDescriptionColor(UIThemeColor.Muted)
            );

    /// <summary>
    /// The two alignments where the answer is not obvious: no title, one line, and an inline badge.
    /// </summary>
    private static ContainerComponent CreateAlignmentEdgesGroup()
    {
        return DemoUI.CreateGroup(null, "Alignment, where it is not obvious",
            content =>
            {
                StackPanelComponent stack = DemoUI.CreateRow(16);

                foreach (UITextIconAlignment alignment in Enum.GetValues<UITextIconAlignment>())
                {
                    _ = stack.AddChild(new TextComponent()
                        .SetWidth(UILayoutLength.Absolute(280))
                        .SetIcon(DemoIcons.Shield)
                        .SetIconAlignment(alignment)
                        .SetDescription($"Icon {alignment}, no title — {Description}")
                    );
                }

                foreach (UITextBadgeAlignment alignment in Enum.GetValues<UITextBadgeAlignment>())
                {
                    _ = stack.AddChild(CreateBadgeAlignmentItem(alignment)
                        .SetTitle($"Badge {alignment}, one line")
                    );
                }

                _ = content.AddChild(stack.SetPlacement(1, 1, 24, 1));
            }
        );
    }

    private static TextComponent CreateBadgeAlignmentItem(UITextBadgeAlignment alignment)
        => new TextComponent()
            .SetWidth(UILayoutLength.Absolute(280))
            .SetBadgeAlignment(alignment)
            .SetBadgePlacement(UITextBadgePlacement.Trailing)
            .SetBadgeText("Review")
            .SetBadgeStyle(UIBadgeType.Warning);

    /// <summary>
    /// The same <c>Icon</c> property carrying a picture instead of a glyph name.
    /// </summary>
    /// <remarks>With no size given, text content draws the picture as a square the height of the block.</remarks>
    private static ContainerComponent CreatePictureIconGroup()
    {
        return DemoUI.CreateGroup(null, "An icon that is a picture",
            content =>
            {
                StackPanelComponent stack = DemoUI.CreateRow(16);

                _ = stack
                    .AddChild(CreatePictureIcon(DemoImages.Avatar, "Robin Hale", "A square photograph — no size given, so a square the height of the block."))
                    .AddChild(CreatePictureIcon(DemoImages.SunsetRuins, "A landscape", "Wider than it is tall, in the same square tile."))
                    .AddChild(CreatePictureIcon(DemoImages.Logo, "A size given", "The picture obeys it, like a glyph — no tile, no square.")
                        .SetIconSize(UIIconSize.Medium)
                    )
                    // A line that is already coloured does not get muted on top: it would fall below contrast.
                    .AddChild(CreatePictureIcon(DemoImages.Mask(DemoImages.Mark), "Tinted picture", "Written mask: — a monochrome SVG follows the text's colour.")
                        .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Danger))
                        .SetDescriptionColor(UIThemeColor.FromStyle(UIColorStyle.OnSurface))
                    );

                _ = content.AddChild(stack.SetPlacement(1, 1, 24, 1));
            }
        );
    }

    private static TextComponent CreatePictureIcon(string icon, string title, string description)
        => new TextComponent()
            .SetWidth(UILayoutLength.Absolute(280))
            .SetIcon(icon)
            .SetTitle(title)
            .SetDescription(description);

    /// <summary>
    /// The inline markup's fold in a one-line description: the caption sits in the line, and the text it opens takes a line of its own.
    /// </summary>
    private static ContainerComponent CreateFoldGroup()
    {
        return DemoUI.CreateGroup(null, "A line with more behind it",
            content => content.AddChild(new TextComponent()
                .SetWidth(UILayoutLength.Absolute(470))
                .SetIcon(DemoIcons.Shield)
                .SetTitle("Two-factor authentication")
                .SetDescription("Adds a second step when signing in from a new device. [Which devices count?]{A browser that has not signed in "
                    + "for **thirty days**, or any device after the password changes.}")
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }
}
