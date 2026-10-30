using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Feedback.Message;
using DemoApp.Views.Base;

namespace DemoApp.Views.Feedback.Message;

/// <summary>
/// The inline message preset in each tone and every property that can be bound to it; then the messages a page keeps in its flow
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

    public static string ViewKey => "demo.feedback.message";

    protected override string ComponentRoute => "/feedback/message";
    protected override string Header => "demo.feedback.message.header";
    protected override string HeaderDescription => "demo.feedback.message.description";
    protected override (string Route, string Title)? ComposedIn => ("/screens/checkout", "demo.nav.screens.checkout");

    /// <summary>
    /// A banner across the content's top, over the page's own padded content, so it runs edge to edge at every width. Not in the
    /// sticky header region: there a phone's drawer toggle stands beside it, and a banner held over the page took a third of the screen.
    /// </summary>
    protected override IVisualComponent CreateContent()
        => UILayout.Stack(0,
            UIPage.Banner(UIMessage.Info("demo.feedback.message.banner.title", "demo.feedback.message.banner.body", dismissible: true)),
            base.CreateContent()
        );

    // The tone is the preset's choice, made once, so the preview draws all four, each bound to the same words.
    protected override ContainerComponent CreatePreview()
        => DemoUI.CreatePreview(640,
            ("Info", frame => frame.AddChild(Bind(UIColorStyle.Info))),
            ("Success", frame => frame.AddChild(Bind(UIColorStyle.Success))),
            ("Warning", frame => frame.AddChild(Bind(UIColorStyle.Warning))),
            ("Danger", frame => frame.AddChild(Bind(UIColorStyle.Danger)))
        );

    private static SurfaceComponent Bind(UIColorStyle tone)
    {
        ButtonComponent action = UIButtons.Outline("Upgrade")
            .OnClick(nameof(MessageController.Upgrade))
            .BindVisibility<MessageController>(static x => x.MessageGroup.ActionVisibility);

        return UIMessage.BoundCreate(tone, $"{MessageGroup}.{nameof(MessageGroupContext.Title)}", $"{MessageGroup}.{nameof(MessageGroupContext.Body)}", action: action, dismissible: true)
            .BindStandard()
            .SetPlacement(1, 1, 24, 1);
    }

    protected override ContainerComponent CreateOptions()
        => DemoUI.CreateOptions(
            DemoUI.CreateOptionSection(MainGroup, "Standard", "Visibility brings back a message its × put away."),
            DemoUI.CreateOptionSection(MessageGroup, "Message")
        );

    protected override IVisualComponent[] CreateExamples()
        => DemoUI.CreateColumns([CreateToneGroup(), CreateDismissGroup()], [CreateActionGroup(), CreateLiveGroup(), CreateBannerGroup()]);

    /// <summary>
    /// The four, each the words it would really carry: a body alone where a title would only repeat it.
    /// </summary>
    private static ContainerComponent CreateToneGroup()
    {
        return DemoUI.CreateExample("Severities",
            UILayout.Stack(12,
                UIMessage.Info(null, "Saved drafts are kept for 30 days, then deleted."),
                UIMessage.Success("Payment received", "INV-2026-0412 is paid; the receipt went to billing@bramble.example."),
                UIMessage.Warning("Certificate expires in 3 days", "bramble.example renews itself on Friday unless the DNS check fails again."),
                UIMessage.Danger("2 errors in the form below", "The postcode and the VAT number were not accepted.")
            ),
            note: "Info and Success announce as `status`; Warning and Danger announce immediately as `alert`. The leading glyph is built in with no icon pack required."
        );
    }

    /// <summary>
    /// The × hides the message in the browser; a second button shows it again the same way, with nothing sent.
    /// </summary>
    private static ContainerComponent CreateDismissGroup()
    {
        return DemoUI.CreateExample("Client-side dismiss",
            UILayout.Stack(12,
                UIMessage.Info("Two-step sign-in is on", "Every new device asks for a code from your phone.", dismissible: true)
                    .InteractOn(ShowAgainId, EventNames.Click, IVisualComponent.VisibilityProperty, UIVisibility.Visible),
                new ButtonComponent(ShowAgainId).SetVariant(UIButtonVariant.Ghost).SetTitle("Show it again").SetHorizontalAlignment(UIAlignment.Start)
            ),
            note: "Dismissing hides the message client-side without a server round trip and moves focus to the next control. Bind `Visibility` when dismissal should persist across reloads."
        );
    }

    /// <summary>
    /// A message with something to do about it: the button is the author's, with its own command.
    /// </summary>
    private static ContainerComponent CreateActionGroup()
    {
        return DemoUI.CreateExample("Inline action",
            UIMessage.Warning("Your trial ends in 3 days", "Billing starts on the 14th.", UIButtons.Outline("Upgrade").OnClick(nameof(MessageController.Upgrade))),
            note: "The action button defaults to `UISize.Small` and shares one vertical centreline with the icon, text and dismiss button from the medium breakpoint up, moving under the text on narrow screens.",
            context: ActionGroup
        );
    }

    /// <summary>
    /// A status whose words the server rewrites on each press: a screen reader reads the new line out without the focus moving.
    /// </summary>
    private static ContainerComponent CreateLiveGroup()
    {
        return DemoUI.CreateExample("Live status updates",
            UIMessage.BoundCreate(UIColorStyle.Info, null, nameof(SyncGroupContext.SyncLine), UIBindingScope.Relative),
            note: "Press Sync now: the bound status line updates in place and announces to assistive technology.",
            context: SyncGroup,
            initControls: controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Sync now"] = nameof(MessageController.Sync)
            })
        );
    }

    /// <summary>
    /// The banner as a page wears it: edge to edge over the content, its mark in line with the page's name.
    /// </summary>
    private static ContainerComponent CreateBannerGroup()
    {
        return DemoUI.CreateExample("Page banner (UIPage.Banner)",
            new SurfaceComponent()
                .SetPadding(UIThickness.Uniform(0))
                .SetContent(UILayout.Stack(0)
                    .AddChild(UIPage.Banner(UIMessage.Warning("Read-only until 18:00 UTC", "The database is moving to a larger server.", dismissible: true)))
                    .AddChild(UIText.Note("The page's content starts here, its edge where the banner's mark stands.").SetMargin(UIThickness.All(24, 16, 24, 16)))
                ),
            note: "`UIPage.Banner` renders a full-bleed square strip with a bottom rule, aligning its leading icon with the page header."
        );
    }
}
