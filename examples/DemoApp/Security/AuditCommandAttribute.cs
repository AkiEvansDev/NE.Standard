using System;
using System.Diagnostics;
using System.Threading.Tasks;
using NE.Standard.UI.Shell.Commands;

namespace DemoApp.Security;

/// <summary>
/// Records who ran a command, how long it took and how it ended — the shape a real application's audit trail takes, as a
/// command filter attached by attribute.
/// </summary>
/// <remarks>
/// An attribute needs no registration and no dependencies; a filter that needed services would implement
/// <see cref="IUICommandFilterFactory"/> instead. It cannot undo the command it wraps: by the time the <c>await</c> returns, the
/// command's writes are queued for the client — auditing is exactly the work that fits. An <em>authorization</em> refusal never
/// reaches it: the built-in check is pinned outermost, so no application filter runs before it; what this sees is a command
/// throwing for any other reason.
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
            DemoAuditLog.Record($"{context.Command.Name} by {user}: threw {exception.GetType().Name} after {Elapsed(startedAt)}");
            throw;
        }

        DemoAuditLog.Record($"{context.Command.Name} by {user}: {Outcome(context)} in {Elapsed(startedAt)}");
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
