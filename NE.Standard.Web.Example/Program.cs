using NE.Standard.Example;
using NE.Standard.Web;
using NE.Standard.Design;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents();
builder.Services.AddSingleton<IUIApp, TestApp>();

var app = builder.Build();

app.MapRazorComponents<AppHost>();

app.Run();
