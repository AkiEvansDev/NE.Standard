using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using TeamRoom;
using TeamRoom.Data;
using TeamRoom.Services;
using TeamRoom.Web;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

#if DEBUG
builder.Logging.SetMinimumLevel(LogLevel.Debug);
#else
builder.Logging.SetMinimumLevel(LogLevel.Warning);
#endif

// A button per test account on the sign-in page, and the accounts behind them: a demo's convenience, never a deployed room's.
builder.Services.AddSingleton(new QuickSignIn { Enabled = builder.Environment.IsDevelopment() });

WebStartupBuilder.Configure<TeamRoomWebStartup, TeamRoomStartup>(builder.Services);

WebApplication app = builder.Build();

// The database and the first administrator exist before the first request is answered.
app.Services.GetRequiredService<AppDatabase>().EnsureCreated();
app.Services.GetRequiredService<AccountService>().Seed();

if (app.Services.GetRequiredService<QuickSignIn>().Enabled)
    app.Services.GetRequiredService<AccountService>().SeedTestAccounts();
app.Services.GetRequiredService<ChatService>().Seed();

await app.MapStandardUIWebAsync().ConfigureAwait(false);

await app.RunAsync().ConfigureAwait(false);
