using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.Logging
{
    /// <summary>
    /// An asynchronous console logger that writes formatted messages with color-coded output
    /// based on <see cref="LogLevel"/> severity.
    /// </summary>
    internal sealed class AsyncConsoleLogger : AsyncBaseLogger
    {
        private readonly BlockingCollection<(LogLevel, string)> _logQueue = new BlockingCollection<(LogLevel, string)>(1024);
        private readonly CancellationTokenSource _cts = new CancellationTokenSource();
        private readonly Task _writerTask;

        public AsyncConsoleLogger(string category, LogLevel minLevel)
            : base(category, minLevel)
        {
            _writerTask = Task.Run(ProcessQueueAsync);
        }

        protected override void EnqueueMessage(LogLevel level, string message)
        {
            try
            {
                _logQueue.TryAdd((level, message), millisecondsTimeout: 1000, cancellationToken: _cts.Token);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[AsyncConsoleLogger] Dropping log: {ex.Message}");
            }
        }

        private async Task ProcessQueueAsync()
        {
            var buffer = new List<(LogLevel, string)>(100);

            try
            {
                while (!_logQueue.IsCompleted)
                {
                    if (_logQueue.TryTake(out var item, Timeout.Infinite, _cts.Token))
                    {
                        buffer.Add(item);
                        while (_logQueue.TryTake(out var next))
                            buffer.Add(next);

                        foreach (var (level, message) in buffer)
                        {
                            Console.ForegroundColor = GetColor(level);
                            Console.WriteLine(message);
                        }

                        Console.ResetColor();
                        buffer.Clear();

                        await Task.Yield();
                    }
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
                LogLevel.Information => ConsoleColor.Blue,
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
                Task.WaitAll(new[] { _writerTask }, TimeSpan.FromSeconds(10));
            }
            catch { }

            _logQueue.Dispose();
            _cts.Dispose();
        }
    }

    /// <summary>
    /// Provides and caches instances of <see cref="AsyncConsoleLogger"/> for use with the logging infrastructure.
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
    /// Provides extension methods for registering <see cref="AsyncConsoleLogger"/> with a logging builder.
    /// </summary>
    public static class AsyncConsoleLoggerExtensions
    {
        /// <summary>
        /// Registers an asynchronous colorized console logger with the logging infrastructure.
        /// </summary>
        /// <param name="builder">The logging builder to configure.</param>
        /// <param name="minLevel">The minimum <see cref="LogLevel"/> to log. Defaults to <see cref="LogLevel.Information"/>.</param>
        /// <returns>The updated <see cref="ILoggingBuilder"/> instance.</returns>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="builder"/> is <c>null</c>.</exception>
        public static ILoggingBuilder AddAsyncConsoleLogger(this ILoggingBuilder builder, LogLevel minLevel = LogLevel.Information)
        {
            if (builder == null) throw new ArgumentNullException(nameof(builder));

            builder
                .AddProvider(new AsyncConsoleLoggerProvider(minLevel))
                .SetMinimumLevel(minLevel);

            return builder;
        }
    }
}
