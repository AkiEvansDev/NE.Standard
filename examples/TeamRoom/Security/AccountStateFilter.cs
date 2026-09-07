using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Sessions;
using TeamRoom.Services;

namespace TeamRoom.Security;

/// <summary>
/// A session says who signed in; the account says whether they still may. Every page request and every command is held
/// against the account as it is now, so a block or a deletion reaches an open tab on its next move, not at its next sign-in.
/// </summary>
public sealed class AccountStateFilter(AccountService accounts) : IUIViewFilter, IUICommandFilter
{
    public async Task InvokeAsync(UIViewFilterContext context, Func<Task> next)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(next);

        if (context.Session.IsAuthenticated && !IsActive(context.Session.UserId))
        {
            await SignOutAsync(context.Services, context.Session.SessionId, CancellationToken.None).ConfigureAwait(false);
            context.Redirect(new UINavigationRequest { Route = AppRoutes.SignIn, Parameters = new Dictionary<string, object?> { ["reason"] = "blocked" } });

            return;
        }

        await next().ConfigureAwait(false);
    }

    public async Task InvokeAsync(UICommandFilterContext context, Func<Task> next)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(next);

        if (context.Handle.Session.IsAuthenticated && !IsActive(context.Handle.Session.UserId))
        {
            await SignOutAsync(context.Services, context.Handle.Session.SessionId, CancellationToken.None).ConfigureAwait(false);
            context.Result = UICommandResult.Fail("This account is no longer allowed in.", [new NavigateEffect(new UINavigationRequest { Route = AppRoutes.SignIn })]);

            return;
        }

        await next().ConfigureAwait(false);
    }

    private bool IsActive(string? accountId)
        => accountId is not null && accounts.Find(accountId) is { IsBlocked: false };

    private static ValueTask SignOutAsync(IServiceProvider services, string sessionId, CancellationToken cancellationToken)
        => services.GetRequiredService<IUserSessionStore>().RemoveAsync(sessionId, cancellationToken);
}
