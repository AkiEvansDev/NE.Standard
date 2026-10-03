using System;
using System.Threading;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase : IUITopicSubscriber
{
    // The host's topics, which this runtime's own are kept in; null for a runtime built outside a host.
    private UIBroadcast? _broadcast;

    /// <summary>Hands this runtime the host's topics, which drop its own when it is asked to go.</summary>
    internal void JoinBroadcast(UIBroadcast broadcast)
    {
        ArgumentNullException.ThrowIfNull(broadcast);

        _broadcast = broadcast;
    }

    /// <summary>Whether the runtime was asked to go: a topic taken from then on would outlive it.</summary>
    internal bool IsAskedToGo => Volatile.Read(ref _disposeRequested) != 0;

    void IUITopicSubscriber.Subscribe(string topic)
        => (_broadcast ?? throw new InvalidOperationException("This runtime was built outside a host and takes no topics.")).Subscribe(this, topic);

    void IUITopicSubscriber.Unsubscribe(string topic)
        => _broadcast?.Unsubscribe(this, topic);

    /// <summary>Drops every topic the runtime took, as it is asked to go: whatever is posted from then on would be dropped anyway.</summary>
    private void LeaveBroadcast()
        => _broadcast?.Leave(this);
}
