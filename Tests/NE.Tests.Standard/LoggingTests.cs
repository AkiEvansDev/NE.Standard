using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NE.Standard.Logging;
using System;
using System.IO;
using System.Linq;

namespace NE.Tests.Standard;

public class LoggingTests
{
    [Fact]
    public void AddAsyncFileLogger_ValidatesArguments()
    {
        Assert.Throws<ArgumentException>(() =>
        {
            var services = new ServiceCollection();
            services.AddLogging(b => b.AddAsyncFileLogger(""));
        });

        Assert.Throws<ArgumentOutOfRangeException>(() =>
        {
            var services = new ServiceCollection();
            services.AddLogging(b => b.AddAsyncFileLogger(Path.GetTempPath(), LogLevel.Information, 0));
        });
    }

    [Fact]
    public void AsyncFileLogger_WritesExpectedMessages()
    {
        string logDir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        Directory.CreateDirectory(logDir);

        var services = new ServiceCollection();
        services.AddLogging(b => b.AddAsyncFileLogger(logDir, LogLevel.Information, 1));

        using (var provider = services.BuildServiceProvider())
        {
            var factory = provider.GetRequiredService<ILoggerFactory>();
            var logger = factory.CreateLogger("Test");
            logger.LogInformation("info message");
            logger.LogDebug("debug message");
        }

        var file = Directory.GetFiles(logDir, "log-*.txt").Single();
        var content = File.ReadAllText(file);
        Assert.Contains("info message", content);
        Assert.DoesNotContain("debug message", content);

        Directory.Delete(logDir, true);
    }
}
