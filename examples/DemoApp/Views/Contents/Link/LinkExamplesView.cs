using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Contents.Link;

/// <summary>
/// What a link is for, and the two things it is confused with.
/// </summary>
/// <remarks>A link is an address, so it is followed rather than dispatched — which is what separates it from the two.</remarks>
internal sealed class LinkExamplesView : DemoExamplesView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.link.examples";

    protected override string ComponentRoute => "/contents/link";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples];
    protected override string Header => "demo.contents.link.header";
    protected override string HeaderDescription => "demo.contents.link.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [CreateUsesGroup(), CreateAgainstButtonGroup()],
            [CreateListGroup(), CreateAgainstMarkupGroup()]
        ));
    }

    /// <summary>
    /// The jobs it is given: a reference under a paragraph, an address that leaves the application, and a file.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateGroup(null, "What it is for",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(14)
                    .SetWidth(UILayoutLength.Absolute(340))
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Rollout paused")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("The error rate doubled in eu-west-1 and the scheduler stopped itself.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new LinkComponent()
                        .SetTitle("The rollout plan")
                        .SetUrl("https://example.com/docs/rollout")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new LinkComponent()
                        // The glyph is what says the address is not one of this application's own pages.
                        .SetIcon(DemoIcons.Outline(DemoIcons.ExternalLink))
                        .SetTitle("Open the incident in Statuspage")
                        .SetUrl("https://example.com/incidents/4812")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new LinkComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                        .SetTitle("payments-481.zip")
                        .SetUrl("https://example.com/artifacts/payments-481.zip")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// A column of them — a footer, a help panel, a related-reading list — divided only by section rules.
    /// </summary>
    private static ContainerComponent CreateListGroup()
    {
        return DemoUI.CreateGroup(null, "A column of them",
            content => content.AddChild(new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetWidth(UILayoutLength.Absolute(260))
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(10)
                    .AddChild(DemoUI.CreateCaption("Documentation"))
                    .AddChild(CreateEntry("Getting started", "https://example.com/docs/start"))
                    .AddChild(CreateEntry("The binding model", "https://example.com/docs/binding"))
                    .AddChild(CreateEntry("Writing a component", "https://example.com/docs/components"))
                    .AddChild(new SeparatorComponent())
                    .AddChild(DemoUI.CreateCaption("Elsewhere"))
                    .AddChild(new LinkComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.ExternalLink))
                        .SetTitle("The repository")
                        .SetUrl("https://example.com/repo")
                        .SetTitleType(UITextAppearance.Body)
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    private static LinkComponent CreateEntry(string text, string url)
        => new LinkComponent()
            .SetTitle(text)
            .SetUrl(url)
            .SetTitleType(UITextAppearance.Body)
            .SetHorizontalAlignment(UIAlignment.Start);

    /// <summary>
    /// The pair that look the same: a Link-typed button runs a command, a link is an address the browser owns.
    /// </summary>
    private static ContainerComponent CreateAgainstButtonGroup()
    {
        return DemoUI.CreateGroup(null, "Against a Link-typed button",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetWidth(UILayoutLength.Absolute(340))
                    .AddChild(DemoUI.CreateCaption("LinkComponent — an address"))
                    .AddChild(new LinkComponent()
                        .SetTitle("Read the review policy")
                        .SetUrl("https://example.com/docs/review")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(DemoUI.CreateCaption("ButtonComponent, Type = Link — a command"))
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Link)
                        .SetTitle("Request a review")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }

    /// <summary>
    /// Inline markup, which is what to prefer inside prose; the component is for an address outside a sentence.
    /// </summary>
    private static ContainerComponent CreateAgainstMarkupGroup()
    {
        return DemoUI.CreateGroup(null, "Against a link inside a sentence",
            content => content.AddChild(new SurfaceComponent()
                .SetContent(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(12)
                    .SetWidth(UILayoutLength.Absolute(340))
                    .AddChild(DemoUI.CreateCaption("Inside the sentence"))
                    .AddChild(new ParagraphComponent()
                        .SetDescription("The rollout pauses itself if the error rate doubles in any region, and the thresholds are in [the rollout plan](https://example.com/docs/rollout).")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(DemoUI.CreateCaption("Beside it"))
                    .AddChild(new ParagraphComponent()
                        .SetDescription("The rollout pauses itself if the error rate doubles in any region.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                    .AddChild(new LinkComponent()
                        .SetTitle("The rollout plan")
                        .SetUrl("https://example.com/docs/rollout")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            )
        );
    }
}
