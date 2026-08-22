using System;
using System.Diagnostics;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Security;

/// <summary>
/// Logs who ran a command and how long it took, and turns a refusal into an audit line rather than letting it
/// pass silently — the shape a real application's audit trail would take.
/// </summary>
/// <remarks>
/// Attached as an attribute, so it needs no registration and no dependencies. A filter that did need services
/// would implement <see cref="IUICommandFilterFactory"/> instead.
/// <para>
/// It cannot undo the command it wraps: by the time the <c>await</c> returns, the command's writes are already
/// queued for the client. Auditing is exactly the kind of work that fits that constraint.
/// </para>
/// <para>
/// An <em>authorization</em> refusal never reaches here, and that is deliberate: the built-in check is pinned
/// outermost so no application filter can run before it and short-circuit past it. What this does see is the
/// command throwing for any other reason.
/// </para>
/// </remarks>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
internal sealed class AuditCommandAttribute : Attribute, IUICommandFilter
{
    public async Task InvokeAsync(UICommandFilterContext context, Func<Task> next)
    {
        ArgumentNullException.ThrowIfNull(context);
        ArgumentNullException.ThrowIfNull(next);

        var startedAt = Stopwatch.GetTimestamp();
        var user = context.Handle.Session.UserId ?? (context.Handle.Session.IsAuthenticated ? "authenticated" : "anonymous");

        try
        {
            await next().ConfigureAwait(false);
        }
        catch (Exception exception)
        {
            DemoAuditLog.Record($"{context.Command.Name} by {user} — {Elapsed(startedAt)}, threw {exception.GetType().Name}");
            throw;
        }

        DemoAuditLog.Record($"{context.Command.Name} by {user} — {Elapsed(startedAt)}, {Outcome(context)}");
    }

    private static string Elapsed(long startedAt)
        => $"{Stopwatch.GetElapsedTime(startedAt).TotalMilliseconds:F0} ms";

    private static string Outcome(UICommandFilterContext context)
    {
        if (!context.Invoked)
            return "short-circuited";

        return context.Result?.Success == true ? "ok" : "failed";
    }
}
