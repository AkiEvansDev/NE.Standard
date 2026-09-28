using DemoApp.Views.Base;

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
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateUsesGroup(), CreateAgainstButtonGroup()], [CreateListGroup(), CreateAgainstMarkupGroup()]));

    /// <summary>
    /// The jobs it is given: a reference under a paragraph, an address that leaves the application, and a file.
    /// </summary>
    private static ContainerComponent CreateUsesGroup()
    {
        return DemoUI.CreateExample("What it is for",
            new SurfaceComponent()
                .SetContent(UILayout.Stack(14)
                    .SetWidth(UILayoutLength.Absolute(340))
                    .AddChild(new ParagraphComponent()
                        .SetTitle("Rollout paused")
                        .SetTitleType(UITextAppearance.Subtitle)
                        .SetDescription("The error rate doubled in eu-west and the scheduler stopped itself.")
                        .SetDescriptionType(UITextAppearance.Body)
                        .SetDescriptionColor(UIThemeColor.Muted)
                    )
                    .AddChild(new LinkComponent()
                        .SetTitle("The rollout plan")
                        .SetUrl("https://docs.orvane.example/rollout")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new LinkComponent()
                        // The glyph is what says the address is not one of this application's own pages.
                        .SetIcon(DemoIcons.Outline(DemoIcons.ExternalLink))
                        .SetTitle("Open the incident on the status page")
                        .SetUrl("https://status.orvane.example/incidents/4812")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new LinkComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.Download))
                        .SetTitle("db-us-east-2.snapshot")
                        .SetUrl("https://orvane.example/snapshots/db-us-east-2.snapshot")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
        );
    }

    /// <summary>
    /// The pair that look the same: a Link-typed button runs a command, a link is an address the browser owns.
    /// </summary>
    private static ContainerComponent CreateAgainstButtonGroup()
    {
        return DemoUI.CreateExample("Against a Link-typed button",
            new SurfaceComponent()
                .SetContent(UILayout.Stack(12)
                    .SetWidth(UILayoutLength.Absolute(340))
                    .AddChild(UIText.Label("LinkComponent — an address"))
                    .AddChild(new LinkComponent()
                        .SetTitle("Read the change policy")
                        .SetUrl("https://docs.orvane.example/changes")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(UIText.Label("ButtonComponent, Type = Link — a command"))
                    .AddChild(UIButtons.Link("Request a change")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
        );
    }

    /// <summary>
    /// A column of them — a footer, a help panel, a related-reading list — divided only by section rules.
    /// </summary>
    private static ContainerComponent CreateListGroup()
    {
        return DemoUI.CreateExample("A column of them",
            new SurfaceComponent()
                .SetSurface(UISurfaceStyle.Raised)
                .SetWidth(UILayoutLength.Absolute(260))
                .SetContent(UILayout.Stack(10)
                    .AddChild(UIText.Label("Documentation"))
                    .AddChild(new LinkComponent()
                        .SetTitle("Creating a server")
                        .SetUrl("https://docs.orvane.example/servers")
                        .SetTitleType(UITextAppearance.Body)
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new LinkComponent()
                        .SetTitle("Plans and billing")
                        .SetUrl("https://docs.orvane.example/billing")
                        .SetTitleType(UITextAppearance.Body)
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new LinkComponent()
                        .SetTitle("Uploading a certificate")
                        .SetUrl("https://docs.orvane.example/certificates")
                        .SetTitleType(UITextAppearance.Body)
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(UIText.Label("Elsewhere"))
                    .AddChild(new LinkComponent()
                        .SetIcon(DemoIcons.Outline(DemoIcons.ExternalLink))
                        .SetTitle("The status page")
                        .SetUrl("https://status.orvane.example")
                        .SetTitleType(UITextAppearance.Body)
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
        );
    }

    /// <summary>
    /// Inline markup, which is what to prefer inside prose; the component is for an address outside a sentence.
    /// </summary>
    private static ContainerComponent CreateAgainstMarkupGroup()
    {
        return DemoUI.CreateExample("Against a link inside a sentence",
            new SurfaceComponent()
                .SetContent(UILayout.Stack(12)
                    .SetWidth(UILayoutLength.Absolute(340))
                    .AddChild(UIText.Label("Inside the sentence"))
                    .AddChild(new ParagraphComponent()
                        .SetDescription("The rollout pauses itself if the error rate doubles in any region, and the thresholds are in [the rollout plan](https://docs.orvane.example/rollout).")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                    .AddChild(new SeparatorComponent())
                    .AddChild(UIText.Label("Beside it"))
                    .AddChild(new ParagraphComponent()
                        .SetDescription("The rollout pauses itself if the error rate doubles in any region.")
                        .SetDescriptionType(UITextAppearance.Body)
                    )
                    .AddChild(new LinkComponent()
                        .SetTitle("The rollout plan")
                        .SetUrl("https://docs.orvane.example/rollout")
                        .SetHorizontalAlignment(UIAlignment.Start)
                    )
                )
        );
    }
}
