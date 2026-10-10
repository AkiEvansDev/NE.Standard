using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Logging.Abstractions;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Application;
using NE.Standard.UI.Hosting;
using NE.Standard.UI.Navigation;
using NE.Standard.UI.Shell.Hosting;
using NE.Standard.UI.Shell.Navigation;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Services;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Shell.Updates;
using NE.Standard.UI.Startup;

namespace NE.Standard.UI.Testing;

/// <summary>An application booted from its own startup with no platform under it, whose pages a test opens and drives.</summary>
/// <remarks>
/// The scheduler is parked: nothing flushes a <c>Batch</c> runtime but <see cref="UITestPage.FlushAsync"/>, so a test reads what a
/// command answered and what waits for the flush apart. Framework-agnostic: a failed expectation is the test's to assert, and a
/// misuse — a component that is not there, a press on a disabled button — throws <see cref="InvalidOperationException"/>.
/// </remarks>
public sealed class UITestApp : IAsyncDisposable, IDisposable
{
    private readonly UITestBuiltHost _built;
    private int _pages;

    private UITestApp(UITestBuiltHost built, UITestClient client)
    {
        _built = built;
        Client = client;
    }

    /// <summary>Gets the application's services, the fakes the test registered included.</summary>
    public IServiceProvider Services => _built.Services;

    /// <summary>Gets the built application: its routes, options and translator.</summary>
    public UIApplication Application => _built.Application;

    internal UIHost Host => _built.Host;

    internal UITestClient Client { get; }

    /// <summary>
    /// Boots <typeparamref name="TStartup"/> as its host would; <paramref name="configureServices"/> runs after the startup's own
    /// registrations, so a fake registered there replaces the real service.
    /// </summary>
    public static UITestApp Create<TStartup>(Action<IServiceCollection>? configureServices = null, Action<UIApplicationBuilder>? configureApplication = null)
        where TStartup : UIStartupBase, new()
    {
        UITestClient client = new();

        UITestBuiltHost built = UITestHostBuilder.Build<TStartup>(
            services => AddClient(services, client),
            services =>
            {
                // Over whatever the startup registered for a platform: the pages are the platform here.
                _ = services.RemoveAll<IUIUpdateSink>();
                _ = services.RemoveAll<IUIDialogService>();
                _ = services.RemoveAll<IUIDownloadService>();
                _ = services.RemoveAll<IUIUploadService>();
                AddClient(services, client);

                configureServices?.Invoke(services);
            },
            configureApplication,
            static provider => provider.GetService<ILogger<UIHost>>() ?? NullLogger<UIHost>.Instance
        );

        return new UITestApp(built, client);
    }

    private static void AddClient(IServiceCollection services, UITestClient client)
    {
        services.TryAddSingleton<IUIUpdateSink>(client);
        services.TryAddSingleton<IUIDialogService>(client);
        services.TryAddSingleton<IUIDownloadService>(client);
        services.TryAddSingleton<IUIUploadService>(client);
    }

    /// <summary>
    /// Opens the page at <paramref name="address"/> — a route, with a query if it has one — in a new session that
    /// <paramref name="session"/> describes, or an anonymous first visit's.
    /// </summary>
    /// <remarks>
    /// Resolved through the host's real path — the view filters, the route's authorization, a refusal sent to sign in or to the
    /// forbidden page — then attached and started from the snapshot a connecting page is sent. <see cref="UITestPage.Route"/> says
    /// where it landed.
    /// </remarks>
    public async Task<UITestPage> OpenAsync(string address, Action<UITestSession>? session = null, CancellationToken cancellationToken = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(address);

        UITestSession described = new();

        session?.Invoke(described);

        string? sessionId = null;

        if (described.IsDescribed)
        {
            UserSessionState state = described.ToState(Application.Translator.DefaultLanguage);

            await Services.GetRequiredService<IUserSessionStore>().SaveAsync(state, cancellationToken).ConfigureAwait(false);
            sessionId = state.SessionId;
        }

        return await OpenAsync(UINavigationAddress.Parse(address), sessionId, described, cancellationToken).ConfigureAwait(false);
    }

    /// <summary>Opens a page in the session <paramref name="sessionId"/> names, or a new anonymous one.</summary>
    internal async Task<UITestPage> OpenAsync(UINavigationRequest navigation, string? sessionId, UITestSession session, CancellationToken cancellationToken)
    {
        var number = Interlocked.Increment(ref _pages);
        var instanceId = $"test-page-{number}";
        var windowId = $"test-window-{number}";

        // The one step a platform with no separate page load takes: the request that opens the view, which can also hand out a session.
        UIViewResolution view = await Host.ResolveViewAsync(
            navigation,
            new UserSessionInitData
            {
                SessionId = sessionId,
                ConnectionId = instanceId,
                ClientWindowId = windowId,
                Principal = session.ToPrincipal(Application.Security.PermissionClaimType),
                Languages = session.Language is null ? [] : [session.Language],
                TimeZone = session.TimeZone
            },
            UIViewRequestPhase.Open,
            cancellationToken
        ).ConfigureAwait(false);

        UITestPage page = new(this, instanceId, session);

        // Before the attach: a controller's OnAttachedAsync may already push to the page.
        Client.Add(instanceId, page);

        try
        {
            RuntimeResolution runtime = await Host.AttachRuntimeAsync(
                view,
                new UIInstance
                {
                    Id = instanceId,
                    WindowId = windowId,
                    Navigation = view.Navigation,
                    StartsFromSnapshot = true,
                    ClientState = new UIClientState(IsVisible: true, session.NotificationPermission)
                },
                cancellationToken
            ).ConfigureAwait(false);

            await page.StartAsync(runtime, cancellationToken).ConfigureAwait(false);
        }
        catch
        {
            Client.Remove(instanceId);
            throw;
        }

        return page;
    }

    /// <summary>Stops the host and every runtime it holds.</summary>
    public async ValueTask DisposeAsync()
    {
        await Host.DisposeAsync().ConfigureAwait(false);
        await _built.Services.DisposeAsync().ConfigureAwait(false);
    }

    /// <summary>Stops the host and every runtime it holds.</summary>
    public void Dispose()
    {
        Host.Dispose();
        _built.Services.Dispose();
    }
}
