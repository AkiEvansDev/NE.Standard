using NE.Standard.Example;

var builder = WebApplication.CreateBuilder(args);

builder.Logging.AddAsyncConsoleLogger();

WebInit.InitBuilder<TestApp>(builder);

var app = builder.Build();

WebInit.InitApp(app);

app.Run();
