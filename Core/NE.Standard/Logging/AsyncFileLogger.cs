using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.Logging
{
    /// <summary>
    /// Async file logger that writes each entry to the configured file.
    /// </summary>
    internal sealed class AsyncFileLogger : AsyncBaseLogger
    {
        private readonly string _logDir;
        private readonly BlockingCollection<(LogLevel, string)> _logQueue = new BlockingCollection<(LogLevel, string)>();
        private readonly CancellationTokenSource _cts = new CancellationTokenSource();
        private readonly Task _writerTask;
        private readonly Task _cleanupTask;
        private readonly int _retentionDays;

        public AsyncFileLogger(string logDir, string category, LogLevel minLevel, int retentionDays)
            : base(category, minLevel)
        {
            _logDir = logDir;
            _retentionDays = retentionDays;

            Directory.CreateDirectory(logDir);
            _writerTask = Task.Run(ProcessQueueAsync);
            _cleanupTask = Task.Run(CleanupOldLogsAsync);
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
                    var filePath = Path.Combine(_logDir, $"log-{DateTime.Now:yyyy-MM-dd}.txt");

                    using var stream = new FileStream(filePath, FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
                    using var writer = new StreamWriter(stream) { AutoFlush = true };

                    await writer.WriteLineAsync(message);
                }
            }
            catch (OperationCanceledException) { }
        }

        private async Task CleanupOldLogsAsync()
        {
            try
            {
                while (!_cts.Token.IsCancellationRequested)
                {
                    var cutoff = DateTime.Now.AddDays(-_retentionDays);

                    var files = Directory
                        .EnumerateFiles(_logDir, "log-*.txt")
                        .Where(f =>
                        {
                            var fileName = Path.GetFileNameWithoutExtension(f);
                            var datePart = fileName?.Replace("log-", "");
                            return DateTime.TryParse(datePart, out var fileDate) && fileDate < cutoff;
                        });

                    foreach (var file in files)
                    {
                        try { File.Delete(file); } catch { }
                    }

                    await Task.Delay(TimeSpan.FromHours(12), _cts.Token);
                }
            }
            catch (OperationCanceledException) { }
        }

        public override void Dispose()
        {
            _logQueue.CompleteAdding();
            _cts.Cancel();

            try 
            { 
                Task.WaitAll(new[] { _writerTask, _cleanupTask }, TimeSpan.FromSeconds(5));
            } 
            catch { }

            _logQueue.Dispose();
            _cts.Dispose();
        }
    }

    /// <summary>
    /// Provides <see cref="AsyncFileLogger"/> instances.
    /// </summary>
    internal sealed class AsyncFileLoggerProvider : ILoggerProvider
    {
        private readonly string _logDir;
        private readonly LogLevel _minLevel;
        private readonly int _retentionDays;
        private readonly ConcurrentDictionary<string, AsyncFileLogger> _loggers = new ConcurrentDictionary<string, AsyncFileLogger>();

        public AsyncFileLoggerProvider(string logDir, LogLevel minLevel, int retentionDays)
        {
            _logDir = logDir;
            _minLevel = minLevel;
            _retentionDays = retentionDays;
        }

        public ILogger CreateLogger(string categoryName)
            => _loggers.GetOrAdd(categoryName, name => new AsyncFileLogger(_logDir, name, _minLevel, _retentionDays));

        public void Dispose()
        {
            foreach (var logger in _loggers.Values)
                logger.Dispose();
        }
    }

    /// <summary>
    /// Logging builder extensions for the file logger.
    /// </summary>
    public static class AsyncFileLoggerExtensions
    {
        /// <summary>
        /// Adds an asynchronous file logger to the logging builder.
        /// </summary>
        /// <param name="builder">ILoggingBuilder</param>
        /// <param name="logDir">Directory to store logs</param>
        /// <param name="minLevel">Minimum log level to write</param>
        /// <param name="retentionDays">How many days to retain log files</param>
        public static ILoggingBuilder AddAsyncFileLogger(this ILoggingBuilder builder, string logDir, LogLevel minLevel = LogLevel.Information, int retentionDays = 7)
        {
            if (builder == null) throw new ArgumentNullException(nameof(builder));
            if (string.IsNullOrWhiteSpace(logDir)) throw new ArgumentException("Path required", nameof(logDir));
            if (retentionDays < 1) throw new ArgumentOutOfRangeException(nameof(retentionDays), "Retention must be at least 1 day");

            builder.Services.AddSingleton<ILoggerProvider>(_ => new AsyncFileLoggerProvider(logDir, minLevel, retentionDays));
            return builder;
        }
    }
}
