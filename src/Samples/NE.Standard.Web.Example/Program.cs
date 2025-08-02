using NE.Standard.Design.Data;
using NE.Standard.Example;
using NE.Standard.Logging;
using NE.Standard.Web;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddAsyncConsoleLogger(LogLevel.Debug);

WebInit.InitBuilder<TestApp, SessionContext>(builder);

var app = builder.Build();

WebInit.InitApp(app);

app.Run();
