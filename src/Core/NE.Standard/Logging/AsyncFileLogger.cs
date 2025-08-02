using Microsoft.Extensions.Logging;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.Logging
{
    /// <summary>
    /// An asynchronous file logger that writes log messages to daily log files in a specified directory.
    /// Supports log level filtering and automatic cleanup of expired log files.
    /// </summary>
    internal sealed class AsyncFileLogger : AsyncBaseLogger
    {
        private readonly string _logDir;
        private readonly BlockingCollection<(LogLevel level, string message)> _logQueue = new BlockingCollection<(LogLevel, string)>(2048);
        private readonly CancellationTokenSource _cts = new CancellationTokenSource();
        private readonly Task _writerTask;
        private readonly Task _cleanupTask;
        private readonly Task _flushTask;
        private readonly int _retentionDays;

        private StreamWriter? _currentWriter;
        private string? _currentLogFileDate;
        private readonly SemaphoreSlim _writeLock = new SemaphoreSlim(1, 1);
        private readonly TimeSpan _flushInterval = TimeSpan.FromSeconds(5);

        public AsyncFileLogger(string logDir, string category, LogLevel minLevel, int retentionDays)
            : base(category, minLevel)
        {
            _logDir = logDir;
            _retentionDays = retentionDays;

            Directory.CreateDirectory(logDir);

            _writerTask = Task.Run(ProcessQueueAsync, _cts.Token);
            _flushTask = Task.Run(FlushLoopAsync, _cts.Token);
            _cleanupTask = Task.Run(CleanupOldLogsAsync, _cts.Token);
        }

        protected override void EnqueueMessage(LogLevel level, string message)
        {
            try
            {
                _logQueue.TryAdd((level, message), millisecondsTimeout: 1000, cancellationToken: _cts.Token);
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"[AsyncFileLogger] Failed to enqueue log: {ex.Message}");
            }
        }

        private async Task ProcessQueueAsync()
        {
            var batch = new List<string>(100);

            try
            {
                while (!_logQueue.IsCompleted)
                {
                    if (_logQueue.TryTake(out var item, Timeout.Infinite, _cts.Token))
                    {
                        batch.Add(item.message);

                        while (_logQueue.TryTake(out var moreItem))
                            batch.Add(moreItem.message);

                        await WriteBatchAsync(batch).ConfigureAwait(false);
                        batch.Clear();
                    }
                }
            }
            catch (OperationCanceledException) { }
            finally
            {
                await FlushAndCloseAsync().ConfigureAwait(false);
            }
        }

        private async Task WriteBatchAsync(List<string> messages)
        {
            var today = DateTime.UtcNow.ToString("yyyy-MM-dd");

            if (_currentLogFileDate != today)
            {
                await _writeLock.WaitAsync().ConfigureAwait(false);
                try
                {
                    if (_currentLogFileDate != today)
                    {
                        await FlushAndCloseAsync().ConfigureAwait(false);

                        var filePath = Path.Combine(_logDir, $"log-{today}.txt");
                        var stream = new FileStream(filePath, FileMode.Append, FileAccess.Write, FileShare.ReadWrite);
                        _currentWriter = new StreamWriter(stream) { AutoFlush = false };
                        _currentLogFileDate = today;
                    }
                }
                finally
                {
                    _writeLock.Release();
                }
            }

            foreach (var msg in messages)
            {
                await _currentWriter!.WriteLineAsync(msg).ConfigureAwait(false);
            }
        }

        private async Task FlushLoopAsync()
        {
            try
            {
                while (!_cts.Token.IsCancellationRequested)
                {
                    await Task.Delay(_flushInterval, _cts.Token).ConfigureAwait(false);

                    if (_currentWriter != null)
                    {
                        await _writeLock.WaitAsync(_cts.Token).ConfigureAwait(false);
                        try
                        {
                            await _currentWriter.FlushAsync().ConfigureAwait(false);
                        }
                        finally
                        {
                            _writeLock.Release();
                        }
                    }
                }
            }
            catch (OperationCanceledException) { }
        }

        private async Task FlushAndCloseAsync()
        {
            if (_currentWriter != null)
            {
                await _writeLock.WaitAsync().ConfigureAwait(false);
                try
                {
                    await _currentWriter.FlushAsync().ConfigureAwait(false);
                    await _currentWriter.DisposeAsync().ConfigureAwait(false);
                    _currentWriter = null;
                    _currentLogFileDate = null;
                }
                finally
                {
                    _writeLock.Release();
                }
            }
        }

        private async Task CleanupOldLogsAsync()
        {
            try
            {
                while (!_cts.Token.IsCancellationRequested)
                {
                    var cutoff = DateTime.UtcNow.AddDays(-_retentionDays);

                    var files = Directory
                        .EnumerateFiles(_logDir, "log-*.txt")
                        .Where(f =>
                        {
                            var name = Path.GetFileNameWithoutExtension(f).Replace("log-", "");
                            return DateTime.TryParse(name, out var fileDate) && fileDate < cutoff;
                        });

                    foreach (var file in files)
                    {
                        try { File.Delete(file); } catch { }
                    }

                    await Task.Delay(TimeSpan.FromHours(12), _cts.Token).ConfigureAwait(false);
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
                Task.WaitAll(new[] { _writerTask, _flushTask, _cleanupTask }, TimeSpan.FromSeconds(10));
            }
            catch { }

            _logQueue.Dispose();
            _cts.Dispose();
            _writeLock.Dispose();
        }
    }

    /// <summary>
    /// Provides and manages instances of <see cref="AsyncFileLogger"/> for integration with the logging infrastructure.
    /// </summary>
    internal sealed class AsyncFileLoggerProvider : ILoggerProvider
    {
        private readonly string _logDir;
        private readonly LogLevel _minLevel;
        private readonly int _retentionDays;
        private readonly ConcurrentDictionary<string, AsyncFileLogger> _loggers = new ConcurrentDictionary<string, AsyncFileLogger>();

        public AsyncFileLoggerProvider(string logDir, LogLevel minLevel, int retentionDays)
        {
            if (string.IsNullOrWhiteSpace(logDir))
                throw new ArgumentException("Log directory path cannot be null or empty.", nameof(logDir));

            if (retentionDays < 1)
                throw new ArgumentOutOfRangeException(nameof(retentionDays), "Retention days must be at least 1.");

            _logDir = logDir;
            _minLevel = minLevel;
            _retentionDays = retentionDays;
        }

        public ILogger CreateLogger(string categoryName)
            => _loggers.GetOrAdd(categoryName, name => new AsyncFileLogger(_logDir, name, _minLevel, _retentionDays));

        public void Dispose()
        {
            foreach (var logger in _loggers.Values)
            {
                try
                {
                    logger.Dispose();
                }
                catch (Exception ex)
                {
                    Console.Error.WriteLine($"[AsyncFileLoggerProvider] Failed to dispose logger: {ex}");
                }
            }

            _loggers.Clear();
        }
    }

    /// <summary>
    /// Provides extension methods for registering <see cref="AsyncFileLogger"/> with the logging builder infrastructure.
    /// </summary>
    public static class AsyncFileLoggerExtensions
    {
        /// <summary>
        /// Adds an asynchronous file logger to the <see cref="ILoggingBuilder"/>, storing logs in the specified directory.
        /// </summary>
        /// <param name="builder">The logging builder to configure.</param>
        /// <param name="logDir">The directory path where log files will be saved.</param>
        /// <param name="minLevel">The minimum log level to write. Defaults to <see cref="LogLevel.Information"/>.</param>
        /// <param name="retentionDays">The number of days to retain log files. Must be at least 1.</param>
        /// <returns>The same <see cref="ILoggingBuilder"/> for chaining.</returns>
        /// <exception cref="ArgumentNullException">Thrown when <paramref name="builder"/> is <c>null</c>.</exception>
        /// <exception cref="ArgumentException">Thrown when <paramref name="logDir"/> is <c>null</c> or whitespace.</exception>
        /// <exception cref="ArgumentOutOfRangeException">Thrown when <paramref name="retentionDays"/> is less than 1.</exception>
        public static ILoggingBuilder AddAsyncFileLogger(this ILoggingBuilder builder, string logDir, LogLevel minLevel = LogLevel.Information, int retentionDays = 7)
        {
            if (builder == null) throw new ArgumentNullException(nameof(builder));
            if (string.IsNullOrWhiteSpace(logDir)) throw new ArgumentException("Path required", nameof(logDir));
            if (retentionDays < 1) throw new ArgumentOutOfRangeException(nameof(retentionDays), "Retention must be at least 1 day");

            builder
                .AddProvider(new AsyncFileLoggerProvider(logDir, minLevel, retentionDays))
                .SetMinimumLevel(minLevel);

            return builder;
        }
    }
}
