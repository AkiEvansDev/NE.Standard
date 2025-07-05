using NE.Standard.Example;
using NE.Standard.Logging;
using NE.Standard.Web;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddAsyncConsoleLogger();

WebInit.InitBuilder<TestApp>(builder);

var app = builder.Build();

WebInit.InitApp(app);

app.Run();
