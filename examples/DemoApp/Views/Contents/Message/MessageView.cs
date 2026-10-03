using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Contents.Message;
using DemoApp.Views.Base;

namespace DemoApp.Views.Contents.Message;

/// <summary>
/// The inline message preset in each severity and every property that can be bound to it; then the messages a page keeps in its flow
/// until they are no longer true, and the banner across this page's own top.
/// </summary>
/// <remarks>A preset, not a component: a Tinted surface holding a mark, the words, an action and a ×, which the browser hides.</remarks>
internal sealed class MessageView : DemoComponentView, IUIViewDefinition
{
    private const string MainGroup = nameof(DemoStandardController.MainGroup);
    private const string MessageGroup = nameof(MessageController.MessageGroup);
    private const string ActionGroup = nameof(MessageController.ActionGroup);
    private const string SyncGroup = nameof(MessageController.SyncGroup);
    private const string ShowAgainId = "message-show-again";

    public static string ViewKey => "demo.contents.message";

    protected override string ComponentRoute => "/contents/message";
    protected override string Header => "demo.contents.message.header";
    protected override string HeaderDescription => "demo.contents.message.description";
    protected override (string Route, string Label)? ComposedIn => ("/screens/checkout", "demo.nav.screens.checkout");

    /// <summary>
    /// A banner across the content's top, over the page's own padded content, so it runs edge to edge at every width. Not in the
    /// sticky header region: there a phone's drawer toggle stands beside it, and a banner held over the page took a third of the screen.
    /// </summary>
    protected override IVisualComponent CreateContent()
        => UILayout.Stack(0,
            UIPage.Banner(UIMessage.Info("demo.contents.message.banner.title", "demo.contents.message.banner.body", dismissible: true)),
            base.CreateContent()
        );

    // The severity is the preset's choice, made once, so the preview draws all four, each bound to the same words.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(640,
            ("Info", frame => frame.AddChild(Bind(UIMessageSeverity.Info))),
            ("Success", frame => frame.AddChild(Bind(UIMessageSeverity.Success))),
            ("Warning", frame => frame.AddChild(Bind(UIMessageSeverity.Warning))),
            ("Danger", frame => frame.AddChild(Bind(UIMessageSeverity.Danger)))
        );

    private static SurfaceComponent Bind(UIMessageSeverity severity)
    {
        TextComponent title = new TextComponent().BindTitle($"{MessageGroup}.{nameof(MessageGroupContext.Title)}");
        ParagraphComponent body = new ParagraphComponent().BindDescription($"{MessageGroup}.{nameof(MessageGroupContext.Body)}");
        ButtonComponent action = UIButtons.Secondary("Upgrade")
            .OnClick(nameof(MessageController.Upgrade))
            .BindVisibility($"{MessageGroup}.{nameof(MessageGroupContext.ActionVisibility)}");

        return UIMessage.Create(severity, title, body, action, dismissible: true)
            .BindVisibility($"{MainGroup}.{nameof(StandardGroupContext.Visibility)}")
            .BindEnabled($"{MainGroup}.{nameof(StandardGroupContext.Enabled)}")
            .BindHorizontalAlignment($"{MainGroup}.{nameof(StandardGroupContext.HorizontalAlignment)}")
            .BindVerticalAlignment($"{MainGroup}.{nameof(StandardGroupContext.VerticalAlignment)}")
            .BindMargin($"{MainGroup}.{nameof(StandardGroupContext.Margin)}")
            .BindWidth($"{MainGroup}.{nameof(StandardGroupContext.Width)}")
            .BindHeight($"{MainGroup}.{nameof(StandardGroupContext.Height)}")
            .BindTheme($"{MainGroup}.{nameof(StandardGroupContext.Theme)}")
            .BindLoading($"{MainGroup}.{nameof(StandardGroupContext.Loading)}")
            .SetPlacement(1, 1, 24, 1);
    }

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", nameof(DemoStandardController.CycleMainOption), "Visibility brings back a message its × put away."),
            DemoUI.CreateOptionSection(MessageGroup, "Message", nameof(MessageController.CycleMessageOption))
        );

    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateSeverityGroup(), CreateDismissGroup()], [CreateActionGroup(), CreateLiveGroup(), CreateBannerGroup()]);

    /// <summary>
    /// The four, each the words it would really carry: a body alone where a title would only repeat it.
    /// </summary>
    private static ContainerComponent CreateSeverityGroup()
    {
        return DemoUI.CreateExample("Each severity",
            UILayout.Stack(12,
                UIMessage.Info(null, "Saved drafts are kept for 30 days, then deleted."),
                UIMessage.Success("Payment received", "INV-2026-0412 is paid; the receipt went to billing@bramble.example."),
                UIMessage.Warning("Certificate expires in 3 days", "bramble.example renews itself on Friday unless the DNS check fails again."),
                UIMessage.Danger("2 errors in the form below", "The postcode and the VAT number were not accepted.")
            ),
            note: "Info and Success are a status to a screen reader, read when it is free; Warning and Danger an alert, read at once. The mark is the framework's own glyph, drawn with no icon pack installed."
        );
    }

    /// <summary>
    /// A message with something to do about it: the button is the author's, with its own command.
    /// </summary>
    private static ContainerComponent CreateActionGroup()
    {
        return DemoUI.CreateExample("With an action",
            UIMessage.Warning("Your trial ends in 3 days", "Billing starts on the 14th.", UIButtons.Secondary("Upgrade").OnClick(nameof(MessageController.Upgrade))),
            note: "The action stands at the message's bottom end, as a toast's does: beside the words from the medium breakpoint, under them on a phone.",
            context: ActionGroup
        );
    }

    /// <summary>
    /// The × hides the message in the browser; a second button shows it again the same way, with nothing sent.
    /// </summary>
    private static ContainerComponent CreateDismissGroup()
    {
        return DemoUI.CreateExample("Dismissible",
            UILayout.Stack(12,
                UIMessage.Info("Two-step sign-in is on", "Every new device asks for a code from your phone.", dismissible: true)
                    .InteractOn(ShowAgainId, EventNames.Click, IVisualComponent.VisibilityProperty, UIVisibility.Visible),
                new ButtonComponent(ShowAgainId).SetType(UIButtonType.Outline).SetTitle("Show it again").SetHorizontalAlignment(UIAlignment.Start)
            ),
            note: "Both presses stay in the page: the server never hears them, so a reload shows the message again. The × hands the keyboard's focus to the next control. A message the server should stop showing binds its Visibility instead."
        );
    }

    /// <summary>
    /// A status whose words the server rewrites on each press: a screen reader reads the new line out without the focus moving.
    /// </summary>
    private static ContainerComponent CreateLiveGroup()
    {
        return DemoUI.CreateExample("Words the server rewrites",
            UIMessage.Create(UIMessageSeverity.Info, null, new ParagraphComponent().BindDescription(nameof(SyncGroupContext.SyncLine), UIBindingScope.Relative)),
            note: "Sync now: the line changes in place and, being a status, is read out when the reader is free.",
            context: SyncGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Sync now"] = nameof(MessageController.Sync)
            })
        );
    }

    /// <summary>
    /// The banner as a page wears it: edge to edge over the content, its words in line with the page's name.
    /// </summary>
    private static ContainerComponent CreateBannerGroup()
    {
        return DemoUI.CreateExample("Across the top of a page",
            new SurfaceComponent()
                .SetPadding(UIThickness.Uniform(0))
                .SetContent(UILayout.Stack(0)
                    .AddChild(UIPage.Banner(UIMessage.Warning("Read-only until 18:00 UTC", "The database is moving to a larger server.", dismissible: true)))
                    .AddChild(UIText.Note("The page's content starts here, its edge where the banner's words start.").SetMargin(UIThickness.All(24, 16, 24, 16)))
                ),
            note: "UIPage.Banner lays a message across: square, a rule under it, its words in line with the page's name. This page wears one over its content."
        );
    }
}
