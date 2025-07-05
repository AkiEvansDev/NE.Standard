using NE.Standard.Example;
using NE.Standard.Web;
using NE.Standard.Design;
using NE.Standard.Logging;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddAsyncConsoleLogger();

builder.Services
    .AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddSingleton<IUIApp, TestApp>();

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();

app.UseAntiforgery();

app.MapRazorComponents<AppHost>();

app.Run();
