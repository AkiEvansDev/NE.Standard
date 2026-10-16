using System;
using System.Threading;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Shell.Sessions;

/// <summary>Signs a page's session in: the host's, which holds the pages a new id has to reach.</summary>
internal interface IUISessionSignIn
{
    /// <summary>
    /// Moves the session of <paramref name="handle"/> to a new id carrying <paramref name="update"/>, the old id gone at once, and hands
    /// the page the new key; false where the session is gone. <paramref name="invoked"/> says whether the page's own command asks.
    /// </summary>
    /// <exception cref="InvalidOperationException">Not <paramref name="invoked"/>, and another page shares the runtime.</exception>
    ValueTask<bool> SignInAsync(UIHandle handle, bool invoked, Func<UserSessionState, UserSessionState> update, CancellationToken cancellationToken);
}
