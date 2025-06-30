using System;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;

namespace NE.Standard.Logging
{
    /// <summary>
    /// Simple console logger that writes colored output.
    /// </summary>
    internal sealed class ConsoleLogger : ILogger
    {
        private readonly string _categoryName;
        private readonly object _lock = new();

        public ConsoleLogger(string categoryName)
        {
            _categoryName = categoryName;
        }

        /// <inheritdoc />
        public IDisposable BeginScope<TState>(TState state) => NullScope.Instance;

        /// <inheritdoc />
        public bool IsEnabled(LogLevel logLevel) => logLevel != LogLevel.None;

        /// <inheritdoc />
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            if (!IsEnabled(logLevel))
                return;

            if (formatter == null)
                throw new ArgumentNullException(nameof(formatter));

            string message = formatter(state, exception);
            if (string.IsNullOrEmpty(message) && exception == null)
                return;

            lock (_lock)
            {
                var originalColor = Console.ForegroundColor;
                Console.ForegroundColor = GetColor(logLevel);
                Console.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff} [{logLevel}] {_categoryName}: {message}");
                if (exception != null)
                    Console.WriteLine(exception);
                Console.ForegroundColor = originalColor;
            }
        }

        private static ConsoleColor GetColor(LogLevel level)
        {
            return level switch
            {
                LogLevel.Trace => ConsoleColor.DarkGray,
                LogLevel.Debug => ConsoleColor.Gray,
                LogLevel.Information => ConsoleColor.White,
                LogLevel.Warning => ConsoleColor.Yellow,
                LogLevel.Error => ConsoleColor.Red,
                LogLevel.Critical => ConsoleColor.Magenta,
                _ => ConsoleColor.White,
            };
        }
    }

    /// <summary>
    /// Provides <see cref="ConsoleLogger"/> instances.
    /// </summary>
    internal sealed class ConsoleLoggerProvider : ILoggerProvider
    {
        /// <inheritdoc />
        public ILogger CreateLogger(string categoryName) => new ConsoleLogger(categoryName);

        /// <inheritdoc />
        public void Dispose() { }
    }

    /// <summary>
    /// Logging builder extensions for the console logger.
    /// </summary>
    public static class ConsoleLoggerExtensions
    {
        /// <summary>
        /// Adds the console logger to the logging builder.
        /// </summary>
        public static ILoggingBuilder AddConsoleLogger(this ILoggingBuilder builder)
        {
            if (builder == null) throw new ArgumentNullException(nameof(builder));
            builder.Services.AddSingleton<ILoggerProvider, ConsoleLoggerProvider>();
            return builder;
        }
    }

    internal sealed class NullScope : IDisposable
    {
        public static readonly NullScope Instance = new();
        private NullScope() { }
        public void Dispose() { }
    }
}
