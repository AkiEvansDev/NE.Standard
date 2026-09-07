using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Web.Hosting;
using NE.Standard.UI.Web.Startup;
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

WebStartupBuilder.Configure<TeamRoomWebStartup, TeamRoomStartup>(builder.Services);

WebApplication app = builder.Build();

// The database and the first administrator exist before the first request is answered.
app.Services.GetRequiredService<AppDatabase>().EnsureCreated();
app.Services.GetRequiredService<AccountService>().Seed();
app.Services.GetRequiredService<ChatService>().Seed();

app.UseStaticFiles();
app.UseRouting();

await app.MapStandardUIWebAsync().ConfigureAwait(false);

await app.RunAsync().ConfigureAwait(false);
