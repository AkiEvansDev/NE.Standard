using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.Logging
{
    /// <summary>
    /// Async console logger that writes colored output.
    /// </summary>
    internal sealed class AsyncConsoleLogger : AsyncBaseLogger
    {
        private readonly BlockingCollection<(LogLevel, string)> _logQueue = new BlockingCollection<(LogLevel, string)>();
        private readonly CancellationTokenSource _cts = new CancellationTokenSource();
        private readonly Task _writerTask;

        public AsyncConsoleLogger(string category, LogLevel minLevel)
            : base(category, minLevel)
        {
            _writerTask = Task.Run(ProcessQueueAsync);
        }

        protected override void EnqueueMessage(LogLevel level, string message)
        {
            _logQueue.Add((level, message));
        }

        private async Task ProcessQueueAsync()
        {
            try
            {
                foreach (var (level, message) in _logQueue.GetConsumingEnumerable(_cts.Token))
                {
                    Console.ForegroundColor = GetColor(level);
                    Console.WriteLine(message);
                    Console.ResetColor();

                    await Task.Yield();
                }
            }
            catch (OperationCanceledException) { }
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

        public override void Dispose()
        {
            _logQueue.CompleteAdding();
            _cts.Cancel();

            try
            {
                _writerTask.Wait();
            }
            catch { }

            _logQueue.Dispose();
            _cts.Dispose();
        }
    }

    /// <summary>
    /// Provides <see cref="AsyncConsoleLogger"/> instances.
    /// </summary>
    internal sealed class AsyncConsoleLoggerProvider : ILoggerProvider
    {
        private readonly LogLevel _minLevel;
        private readonly ConcurrentDictionary<string, AsyncConsoleLogger> _loggers = new ConcurrentDictionary<string, AsyncConsoleLogger>();

        public AsyncConsoleLoggerProvider(LogLevel minLevel)
        {
            _minLevel = minLevel;
        }

        public ILogger CreateLogger(string categoryName)
            => _loggers.GetOrAdd(categoryName, name => new AsyncConsoleLogger(name, _minLevel));

        public void Dispose()
        {
            foreach (var logger in _loggers.Values)
                logger.Dispose();
        }
    }

    /// <summary>
    /// Logging builder extensions for the console logger.
    /// </summary>
    public static class AsyncConsoleLoggerExtensions
    {
        /// <summary>
        /// Adds an asynchronous console logger to the logging builder.
        /// </summary>
        public static ILoggingBuilder AddAsyncConsoleLogger(this ILoggingBuilder builder, LogLevel minLevel = LogLevel.Information)
        {
            if (builder == null) throw new ArgumentNullException(nameof(builder));

            builder.AddProvider(new AsyncConsoleLoggerProvider(minLevel));
            return builder;
        }
    }
}
