using System;
using System.IO;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;

namespace NE.Standard.Logging
{
    /// <summary>
    /// Simple file logger that writes each entry to the configured file.
    /// </summary>
    internal sealed class FileLogger : ILogger
    {
        private readonly string _categoryName;
        private readonly string _filePath;
        private readonly object _lock = new();

        public FileLogger(string categoryName, string filePath)
        {
            _categoryName = categoryName;
            _filePath = filePath;
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
                Directory.CreateDirectory(Path.GetDirectoryName(_filePath)!);
                using var writer = File.AppendText(_filePath);
                writer.WriteLine($"{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff} [{logLevel}] {_categoryName}: {message}");
                if (exception != null)
                    writer.WriteLine(exception);
            }
        }
    }

    /// <summary>
    /// Provides <see cref="FileLogger"/> instances.
    /// </summary>
    internal sealed class FileLoggerProvider : ILoggerProvider
    {
        private readonly string _filePath;

        public FileLoggerProvider(string filePath)
        {
            _filePath = filePath;
        }

        /// <inheritdoc />
        public ILogger CreateLogger(string categoryName) => new FileLogger(categoryName, _filePath);

        /// <inheritdoc />
        public void Dispose() { }
    }

    /// <summary>
    /// Logging builder extensions for the file logger.
    /// </summary>
    public static class FileLoggerExtensions
    {
        /// <summary>
        /// Adds a file logger to the logging builder.
        /// </summary>
        public static ILoggingBuilder AddFileLogger(this ILoggingBuilder builder, string filePath)
        {
            if (builder == null) throw new ArgumentNullException(nameof(builder));
            if (string.IsNullOrWhiteSpace(filePath)) throw new ArgumentException("File path is required", nameof(filePath));

            builder.Services.AddSingleton<ILoggerProvider>(sp => new FileLoggerProvider(filePath));
            return builder;
        }
    }
}
