namespace NE.Standard.UI.Shell.Runtime;

/// <summary>A runtime that takes topics <see cref="IUIBroadcast"/> posts to, each dropped when the runtime ends.</summary>
internal interface IUITopicSubscriber
{
    void Subscribe(string topic);

    void Unsubscribe(string topic);
}
