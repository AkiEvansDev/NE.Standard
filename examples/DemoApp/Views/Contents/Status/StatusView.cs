using DemoApp.Controllers.Base;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Status;

/// <summary>
/// One status and every property that can be bound to it; then the states a page stands in for, with as many ways on as each has.
/// </summary>
/// <remarks>The mark, the words and the ways on are set once, so the preview binds the standard rows alone; a line the controller says is bound through <c>Words</c>, as the forbidden screen binds its own.</remarks>
internal sealed class StatusView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);

    public static string ViewKey => "demo.contents.status";

    protected override string ComponentRoute => "/contents/status";
    protected override string Header => "demo.contents.status.header";
    protected override string HeaderDescription => "demo.contents.status.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/forbidden", "demo.screens.forbidden.header");

    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(frame => frame.AddChild(UIPage.Status(DemoIcons.Outline(DemoIcons.Search), UIMessageSeverity.Info, "Nothing at this address", "The page was moved or the link was mistyped.", UIButtons.Primary("Go to the home page"))
            .BindStandard()
            .SetPlacement(1, 1, 24, 1)
        ), contentMinHeight: 280);

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(DemoUI.CreateOptionSection(MainGroup, "Standard"));

    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateNotFoundGroup(), CreateFailureGroup()], [CreateRefusalGroup(), CreateSuccessGroup()]);

    /// <summary>
    /// An address that leads nowhere: one way on, back to where the application starts.
    /// </summary>
    private static ContainerComponent CreateNotFoundGroup()
    {
        return DemoUI.CreateExample("A page not found, one way on",
            UIPage.Status(
                DemoIcons.Outline(DemoIcons.Search),
                UIMessageSeverity.Info,
                "This project is gone",
                "It was deleted or moved; the address you followed points nowhere now.",
                UIButtons.Primary("Go to the home page")
            )
        );
    }

    /// <summary>
    /// A page the session may not open: the safe way back first, quiet, then the way through, in the brand's colour.
    /// </summary>
    private static ContainerComponent CreateRefusalGroup()
    {
        return DemoUI.CreateExample("A refusal, two ways on",
            UIPage.Status(
                DemoIcons.Outline(DemoIcons.Lock),
                UIMessageSeverity.Warning,
                "Billing is for the owners",
                "Ask one of the workspace's owners to open it for you, or sign in as one.",
                UIButtons.Ghost("Back to the dashboard"),
                UIButtons.Primary("Sign in as someone else")
            ),
            note: "The safe way on stands first and quiet; the one that changes something is the Primary after it."
        );
    }

    /// <summary>
    /// A failure the reader can do nothing about: no buttons, so no row under the words. Built on the component itself, without the preset.
    /// </summary>
    private static ContainerComponent CreateFailureGroup()
    {
        return DemoUI.CreateExample("A failure, no way on",
            new StatusComponent(DemoIcons.Outline(DemoIcons.Alert), UIColorStyle.Danger, "The report could not be built", "The warehouse did not answer in time. Nothing was lost; it is tried again in a minute."),
            note: "new StatusComponent(icon, tone, title, line) is what UIPage.Status builds; AddAction adds a way on."
        );
    }

    /// <summary>
    /// A state that is good news: with no icon given the mark is the tone's own glyph.
    /// </summary>
    private static ContainerComponent CreateSuccessGroup()
    {
        return DemoUI.CreateExample("Done, and the way in",
            UIPage.Status(
                null,
                UIMessageSeverity.Success,
                "Your workspace is ready",
                "Three projects and the team's invitations were copied from the old one.",
                UIButtons.Primary("Open the workspace")
            )
        );
    }
}
