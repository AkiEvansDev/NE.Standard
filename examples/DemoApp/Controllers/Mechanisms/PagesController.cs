using System.Threading;
using System.Threading.Tasks;
using DemoApp.Controllers.Base;
using Microsoft.Extensions.DependencyInjection;

namespace DemoApp.Controllers.Mechanisms;

/// <summary>A topic every open copy of this page takes: the waves it heard, and whether it still listens.</summary>
internal sealed partial class TopicPagesGroupContext : DemoGroupContext
{
    private int _heard;

    [RecursiveMember]
    public partial UIPhrase? Heard { get; set; } = HeardPhrase(0);

    [RecursiveMember]
    public partial bool Listening { get; set; } = true;

    /// <summary>The listening switch's words: what pressing it does next.</summary>
    [RecursiveMember]
    public partial string ListenTitle { get; set; } = "demo.mechanisms.pages.topic.stop";

    public void Count()
        => Heard = HeardPhrase(++_heard);

    private static UIPhrase HeardPhrase(int count)
        => UIPhrase.Of("demo.mechanisms.pages.topic.heard", ("count", count));
}

/// <summary>
/// Work handed to other pages: a wave posted to a topic every open copy of this page subscribed to, and a notice posted to every
/// page of the signed-in account, whatever its route.
/// </summary>
internal sealed partial class PagesController : DemoController
{
    /// <summary>The topic every copy of this page takes as it opens, and leaves as its runtime ends.</summary>
    public const string WaveTopic = "demo-pages:wave";

    [RecursiveMember]
    public partial TopicPagesGroupContext TopicGroup { get; set; } = new();

    [RecursiveMember]
    public partial DemoGroupContext UserGroup { get; set; } = new();

    protected override Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        Context.Subscribe(WaveTopic);

        return Task.CompletedTask;
    }

    /// <summary>
    /// A wave to every page on the topic, this one included: posted, so this command answers before any of them runs it, and each
    /// runs it in its own turn, as a command.
    /// </summary>
    [UICommand]
    public async Task WaveAsync(CancellationToken cancellationToken)
    {
        var posted = await Context.Services.GetRequiredService<IUIBroadcast>().PostAsync<PagesController>(WaveTopic, other =>
        {
            other.HearWave(this);

            return Task.CompletedTask;
        }, cancellationToken: cancellationToken).ConfigureAwait(false);

        TopicGroup.LogEvent(UIPhrase.Of("demo.mechanisms.pages.log.waved", ("count", posted)));
    }

    private void HearWave(PagesController from)
    {
        TopicGroup.Count();

        if (!ReferenceEquals(from, this))
            TopicGroup.LogEvent(UIPhrase.Of("demo.mechanisms.pages.log.heard"));
    }

    /// <summary>Leaves the topic or takes it again; the page stays open either way.</summary>
    [UICommand]
    public void ToggleListening()
    {
        TopicGroup.Listening = !TopicGroup.Listening;

        if (TopicGroup.Listening)
            Context.Subscribe(WaveTopic);
        else
            Context.Unsubscribe(WaveTopic);

        TopicGroup.ListenTitle = TopicGroup.Listening ? "demo.mechanisms.pages.topic.stop" : "demo.mechanisms.pages.topic.listen";
        TopicGroup.LogEvent(UIPhrase.Of(TopicGroup.Listening ? "demo.mechanisms.pages.log.listening" : "demo.mechanisms.pages.log.left"));
    }

    /// <summary>A notice on every page the signed-in account has open, any route, each page showing it in its own turn.</summary>
    [UICommand]
    public async Task NotifyAccountAsync(CancellationToken cancellationToken)
    {
        if (Context.Handle.Session.UserId is not string userId)
        {
            UserGroup.LogEvent(UIPhrase.Of("demo.mechanisms.pages.log.sign-in"));
            return;
        }

        // Any page of the account, whatever its route: what every controller built on the base has is its context.
        var posted = await Context.Services.GetRequiredService<IUIBroadcast>().PostToUserAsync<UIControllerBase>(
            userId,
            static other => other.Context.SendEffectsToAllAsync([new ShowNotificationEffect(UIPhrase.Of("demo.mechanisms.pages.user.notice"))]),
            cancellationToken: cancellationToken
        ).ConfigureAwait(false);

        UserGroup.LogEvent(UIPhrase.Of("demo.mechanisms.pages.log.notified", ("count", posted)));
    }
}
