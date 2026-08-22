using DemoApp;
using DemoApp.Web;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Web.Hosting;
using NE.Standard.UI.Web.Startup;

WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();

builder.Logging.AddConsole();

#if DEBUG
builder.Logging.SetMinimumLevel(LogLevel.Debug);
#else
builder.Logging.SetMinimumLevel(LogLevel.Warning);
#endif

WebStartupBuilder.Configure<DemoAppWebStartup, DemoAppStartup>(builder.Services);

WebApplication app = builder.Build();

await app.MapStandardUIWebAsync().ConfigureAwait(false);

await app.RunAsync().ConfigureAwait(false);
