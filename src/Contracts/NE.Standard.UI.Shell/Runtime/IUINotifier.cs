using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Abstractions.Effects;

namespace NE.Standard.UI.Shell.Runtime;

/// <summary>
/// Tells a user something through the pages they have open, whatever their route — a message, a mention — deciding per browser
/// where it shows, so the application does not.
/// </summary>
/// <remarks>
/// Per session (one browser): where a page of it is on screen, only the pages on screen are sent it, and their fallback shows; where
/// none is, one page off screen shows the system notification, so it sounds once. Reaches the pages of this process only.
/// </remarks>
public interface IUINotifier
{
    /// <summary>
    /// Sends <paramref name="notification"/> to the pages of every session signed in as <paramref name="userId"/>; answers how many
    /// pages it was sent to — none where the user has no page open.
    /// </summary>
    /// <remarks>
    /// A page the user looks at already showing what this is about is the application's to know: it does not send. With
    /// <see cref="UINotificationWhen.Always"/>, one page of a session shows it: the first on screen, else one off screen.
    /// The notification's <see cref="ShowSystemNotificationEffect.Address"/> is where a click brings the page that showed it;
    /// none brings that page forward where it stands.
    /// </remarks>
    /// <exception cref="ArgumentException">The notification offers an <see cref="ShowSystemNotificationEffect.Action"/>: a command
    /// belongs to one page's runtime, and this reaches pages of any.</exception>
    ValueTask<int> NotifyUserAsync(string userId, ShowSystemNotificationEffect notification, CancellationToken cancellationToken = default);
}
