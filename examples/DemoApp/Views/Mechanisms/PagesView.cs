using DemoApp.Controllers.Mechanisms;
using DemoApp.Views.Base;

namespace DemoApp.Views.Mechanisms;

/// <summary>
/// Reaching pages other than the one that asked: a topic every open copy of this page takes, and every page of the signed-in account.
/// </summary>
/// <remarks>Seen with two pages open — two tabs, or two browsers for two sessions; the chat screen does the same with its rooms.</remarks>
internal sealed class PagesView : DemoMechanismView, IUIViewDefinition
{
    private const string Words = "demo.mechanisms.pages.";

    public static string ViewKey => "demo.mechanisms.pages";

    protected override string ComponentRoute => "/mechanisms/pages";
    protected override string Header => "demo.mechanisms.pages.header";
    protected override string HeaderDescription => "demo.mechanisms.pages.description";

    protected override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChildren(CreateTopicGroup(), CreateUserGroup());

    private static ContainerComponent CreateTopicGroup()
        => DemoUI.CreateExample(Words + "topic.title",
            UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Send))
                    .SetTitle("demo.mechanisms.pages.topic.wave")
                    .OnClick(nameof(PagesController.WaveAsync))
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Outline)
                    .BindTitle(nameof(TopicPagesGroupContext.ListenTitle), UIBindingScope.Relative)
                    .OnClick(nameof(PagesController.ToggleListening))
                )
                .AddChild(new BadgeComponent()
                    .SetVerticalAlignment(UIAlignment.Center)
                    .SetType(UIBadgeType.Surface)
                    .BindText(nameof(TopicPagesGroupContext.Heard), UIBindingScope.Relative)
                ),
            note: Words + "topic.note",
            context: nameof(PagesController.TopicGroup),
            controller: [DemoCode.Of<TopicPagesGroupContext>(), DemoCode.Of<PagesController>(nameof(PagesController.WaveTopic), nameof(PagesController.TopicGroup), "OnInitializeAsync", nameof(PagesController.WaveAsync), "HearWave", nameof(PagesController.ToggleListening))],
            words: true
        );

    private static ContainerComponent CreateUserGroup()
        => DemoUI.CreateExample(Words + "user.title",
            UILayout.Row(12)
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Primary)
                    .SetIcon(DemoIcons.Outline(DemoIcons.Bell))
                    .SetTitle("demo.mechanisms.pages.user.notify")
                    .OnClick(nameof(PagesController.NotifyAccountAsync))
                )
                .AddChild(new LinkComponent()
                    .SetVerticalAlignment(UIAlignment.Center)
                    .SetTitle("demo.mechanisms.pages.user.sign-in")
                    .SetUrl("/screens/sign-in?returnUrl=%2Fmechanisms%2Fpages")
                ),
            note: Words + "user.note",
            context: nameof(PagesController.UserGroup),
            controller: [DemoCode.Of<PagesController>(nameof(PagesController.UserGroup), nameof(PagesController.NotifyAccountAsync))],
            words: true
        );
}
