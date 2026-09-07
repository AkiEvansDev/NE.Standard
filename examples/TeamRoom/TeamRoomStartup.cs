using System;
using System.IO;
using Microsoft.Extensions.DependencyInjection;
using NE.Standard.UI.Application;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Shell.Files;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Sessions;
using NE.Standard.UI.Startup;
using TeamRoom.Controllers;
using TeamRoom.Data;
using TeamRoom.Security;
using TeamRoom.Services;
using TeamRoom.Views;

namespace TeamRoom;

/// <summary>
/// A small team's room: text files the administrators keep, a chat everyone talks in, and the accounts that get in.
/// Built on the framework alone, as the place where the whole of it is judged.
/// </summary>
public sealed class TeamRoomStartup : UIStartupBase
{
    /// <summary>Where the database lives: beside the host, under <c>data/</c>, unless the environment names another place.</summary>
    public static string DataDirectory
        => Environment.GetEnvironmentVariable("TEAMROOM_DATA") is { Length: > 0 } configured ? configured : Path.Combine(Directory.GetCurrentDirectory(), "data");

    protected override void ConfigureServices(IServiceCollection services)
    {
        ArgumentNullException.ThrowIfNull(services);

        _ = services.AddSingleton(new AppDatabase(DataDirectory));
        _ = services.AddSingleton<AppEvents>();
        _ = services.AddSingleton<AccountService>();
        _ = services.AddSingleton<DocumentService>();
        _ = services.AddSingleton<ChatService>();
        _ = services.AddSingleton<MediaService>();
        _ = services.AddSingleton<IUIContentProvider>(static provider => provider.GetRequiredService<MediaService>());
        _ = services.AddSingleton<AccountStateFilter>();
        // The framework's sessions in the application's database: signed in stays signed in across the host's restarts.
        _ = services.AddSingleton<IUserSessionStore, SqliteSessionStore>();
    }

    protected override void ConfigureApplication(UIApplicationBuilder application)
    {
        ArgumentNullException.ThrowIfNull(application);

        // Closed by default: a page or a command that forgot its attribute is refused, not open.
        _ = application.ConfigureSecurity(static security => security.DefaultPolicy = UIAuthorizationDefault.Authenticated);

        // A month of quiet before a session is dropped, and the browser keeps the id as long: closing the window is not a sign-out.
        _ = application.ConfigureSessions(static sessions =>
        {
            sessions.IdleTimeout = TimeSpan.FromDays(30);
            sessions.ClientKeyLifetime = TimeSpan.FromDays(30);
        });

        // One runtime per client per address: every tab of a person shows the same page, and a message pushed once reaches them all.
        _ = application.ConfigurePersistence(static persistence => persistence.Lifetime = UIRuntimeLifetime.PerClient);

        _ = application.AddViewFilter<AccountStateFilter>();
        _ = application.AddCommandFilter<AccountStateFilter>();

        _ = application.SignInView<SignInView, SignInController>(AppRoutes.SignIn);
        _ = application.ForbiddenView<ForbiddenView>(AppRoutes.Forbidden);

        _ = application.Route<FilesView, FilesController>(AppRoutes.Files);
        _ = application.Route<ChatView, ChatController>(AppRoutes.Chat, static route => route.Identity(AppRoutes.ConversationParameter));
        _ = application.Route<AccountsView, AccountsController>(AppRoutes.Accounts);
        _ = application.Route<SettingsView, SettingsController>(AppRoutes.Settings);
    }
}
