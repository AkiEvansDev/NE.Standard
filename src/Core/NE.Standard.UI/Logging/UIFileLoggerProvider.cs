using System;
using System.Collections.Concurrent;
using System.Globalization;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Channels;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Application;

namespace NE.Standard.UI.Logging;

internal sealed class UIFileLoggerProvider : ILoggerProvider, ISupportExternalScope, IAsyncDisposable
{
    private const int MaxQueuedEntries = 65_536;
    private const int FileBufferSize = 16_384;
    private static readonly UTF8Encoding Utf8NoBom = new(encoderShouldEmitUTF8Identifier: false);

    private readonly record struct FileLogEntry(DateOnly Date, string Line);

    private readonly ConcurrentDictionary<string, UIFileLogger> _loggers = new(StringComparer.Ordinal);
    private readonly Channel<FileLogEntry> _channel;
    private readonly Lock _writeSync = new();
    private readonly CancellationTokenSource _shutdownCts = new();
    private readonly CancellationToken _shutdownToken;
    private readonly Task _processTask;
    private readonly Task? _cleanupTask;
    private readonly TimeProvider _timeProvider;
    private readonly LogLevel? _minimumLevel;
    private readonly long _maxFileSize;
    private readonly TimeSpan? _retention;
    private readonly TimeSpan _cleanupInterval;
    private readonly string _timestampFormat;
    private readonly bool _useUtcTimestamp;
    private readonly bool _fullCategoryName;
    private readonly bool _includeScopes;

    private IExternalScopeProvider? _scopeProvider;
    private StreamWriter? _writer;
    private string? _currentFilePath;
    private DateOnly _currentDate;
    private int _currentIndex;
    private long _currentBytes;
    private long _droppedCount;
    private bool _closed;
    private int _disposed;

    public UIFileLoggerProvider(UIFileLogOptions options, TimeProvider? timeProvider = null)
    {
        ArgumentNullException.ThrowIfNull(options);

        options.Validate();

        _timeProvider = timeProvider ?? TimeProvider.System;
        DirectoryPath = ResolveDirectory(options.DirectoryPath);
        FileNamePrefix = ResolvePrefix(options.FileNamePrefix);
        _minimumLevel = options.MinimumLevel;
        _maxFileSize = options.MaxFileSize;
        _retention = options.Retention == Timeout.InfiniteTimeSpan ? null : options.Retention;
        _cleanupInterval = options.CleanupInterval;
        _timestampFormat = options.TimestampFormat;
        _useUtcTimestamp = options.UseUtcTimestamp;
        _fullCategoryName = options.FullCategoryName;
        _includeScopes = options.IncludeScopes;

        _channel = Channel.CreateBounded<FileLogEntry>(new BoundedChannelOptions(MaxQueuedEntries)
        {
            SingleReader = true,
            SingleWriter = false,
            FullMode = BoundedChannelFullMode.DropWrite
        });

        _shutdownToken = _shutdownCts.Token;
        _processTask = Task.Run(ProcessQueueAsync);

        if (_retention is not null)
            _cleanupTask = Task.Run(RunCleanupLoopAsync);
    }

    internal string DirectoryPath { get; }

    internal string FileNamePrefix { get; }

    internal static string ResolveDirectory(string? directoryPath)
    {
        if (string.IsNullOrWhiteSpace(directoryPath))
            return Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, "logs"));

        return Path.IsPathRooted(directoryPath)
            ? Path.GetFullPath(directoryPath)
            : Path.GetFullPath(Path.Combine(AppContext.BaseDirectory, directoryPath));
    }

    internal static string ResolvePrefix(string? fileNamePrefix)
    {
        var candidate = string.IsNullOrWhiteSpace(fileNamePrefix)
            ? Assembly.GetEntryAssembly()?.GetName().Name ?? "application"
            : fileNamePrefix.Trim();

        return UIApplicationStorage.ToSegment(candidate, "application");
    }

    public ILogger CreateLogger(string categoryName)
    {
        ArgumentNullException.ThrowIfNull(categoryName);

        return _loggers.GetOrAdd(categoryName, static (name, provider) => new UIFileLogger(name, provider), this);
    }

    public void SetScopeProvider(IExternalScopeProvider scopeProvider)
        => _scopeProvider = scopeProvider;

    private bool IsEnabled(LogLevel logLevel)
    {
        if (logLevel == LogLevel.None || Volatile.Read(ref _disposed) != 0)
            return false;

        return _minimumLevel is null || logLevel >= _minimumLevel.Value;
    }

    private void Enqueue(LogLevel logLevel, string category, string? message, Exception? exception)
    {
        if (string.IsNullOrEmpty(message) && exception is null)
            return;

        DateTimeOffset timestamp = GetTimestamp();
        var line = UILogLineFormatter.FormatPlainEntry(
            timestamp,
            _timestampFormat,
            logLevel,
            category,
            _fullCategoryName,
            _scopeProvider,
            _includeScopes,
            message,
            exception
        );

        DateOnly date = DateOnly.FromDateTime(timestamp.DateTime);

        if (!_channel.Writer.TryWrite(new FileLogEntry(date, line)))
            _ = Interlocked.Increment(ref _droppedCount);
    }

    private DateTimeOffset GetTimestamp()
    {
        DateTimeOffset now = _timeProvider.GetUtcNow();

        return _useUtcTimestamp ? now : _timeProvider.GetLocalNow();
    }

    private async Task ProcessQueueAsync()
    {
        try
        {
            while (await _channel.Reader.WaitToReadAsync(_shutdownToken).ConfigureAwait(false))
            {
                lock (_writeSync)
                {
                    if (_closed)
                        return;

                    DrainAvailableNoLock();
                    FlushCurrentNoLock();
                }
            }
        }
        catch (Exception exception) when (exception is OperationCanceledException or ObjectDisposedException)
        {
        }
    }

    private void DrainAvailableNoLock()
    {
        var dropped = Interlocked.Exchange(ref _droppedCount, 0);

        if (dropped > 0)
        {
            DateTimeOffset now = GetTimestamp();
            var notice = UILogLineFormatter.FormatPlainEntry(
                now,
                _timestampFormat,
                LogLevel.Warning,
                nameof(UIFileLoggerProvider),
                fullCategoryName: _fullCategoryName,
                scopeProvider: null,
                includeScopes: false,
                message: string.Create(CultureInfo.InvariantCulture, $"Dropped {dropped} log entries while the file log queue was full."),
                exception: null
            );
            WriteEntryNoLock(new FileLogEntry(DateOnly.FromDateTime(now.DateTime), notice));
        }

        while (_channel.Reader.TryRead(out FileLogEntry entry))
            WriteEntryNoLock(entry);
    }

    private void WriteEntryNoLock(FileLogEntry entry)
    {
        try
        {
            var entryBytes = Utf8NoBom.GetByteCount(entry.Line) + Utf8NoBom.GetByteCount(Environment.NewLine);
            EnsureWriterForEntryNoLock(entry.Date, entryBytes);

            if (_writer is null)
                return;

            _writer.WriteLine(entry.Line);
            _currentBytes += entryBytes;
        }
        catch (IOException)
        {
            CloseWriterNoLock();
        }
        catch (UnauthorizedAccessException)
        {
            CloseWriterNoLock();
        }
    }

    private void EnsureWriterForEntryNoLock(DateOnly date, int entryBytes)
    {
        if (_writer is not null && _currentDate == date && (_currentBytes == 0 || _currentBytes + entryBytes <= _maxFileSize))
            return;

        if (_writer is null || _currentDate != date)
        {
            CloseWriterNoLock();
            _ = Directory.CreateDirectory(DirectoryPath);

            (var resumeIndex, var resumePath, var resumeSize) = FindResumeTarget(date);

            if (resumeSize > 0 && resumeSize + entryBytes > _maxFileSize)
            {
                var nextIndex = resumeIndex + 1;
                OpenWriterNoLock(date, nextIndex, BuildFilePath(date, nextIndex), existingLength: 0);
            }
            else
            {
                OpenWriterNoLock(date, resumeIndex, resumePath, resumeSize);
            }

            return;
        }

        CloseWriterNoLock();
        _ = Directory.CreateDirectory(DirectoryPath);

        var rolledIndex = _currentIndex + 1;
        var rolledPath = BuildFilePath(date, rolledIndex);

        while (File.Exists(rolledPath) && new FileInfo(rolledPath).Length >= _maxFileSize)
        {
            rolledIndex++;
            rolledPath = BuildFilePath(date, rolledIndex);
        }

        var existing = File.Exists(rolledPath) ? new FileInfo(rolledPath).Length : 0;
        OpenWriterNoLock(date, rolledIndex, rolledPath, existing);
    }

    private (int Index, string Path, long Size) FindResumeTarget(DateOnly date)
    {
        var datePart = date.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        var highestIndex = 0;

        try
        {
            foreach (var candidate in Directory.EnumerateFiles(DirectoryPath, $"{FileNamePrefix}-{datePart}*.log"))
            {
                if (TryReadRollIndex(Path.GetFileName(candidate), FileNamePrefix, datePart, out var parsed) && parsed > highestIndex)
                    highestIndex = parsed;
            }
        }
        catch (DirectoryNotFoundException)
        {
        }
        catch (IOException)
        {
        }
        catch (UnauthorizedAccessException)
        {
        }

        var path = BuildFilePath(date, highestIndex);
        var size = File.Exists(path) ? new FileInfo(path).Length : 0;

        return (highestIndex, path, size);
    }

    private static bool TryReadRollIndex(ReadOnlySpan<char> fileName, string prefix, string datePart, out int index)
    {
        index = 0;

        var expectedHeadLength = prefix.Length + 1 + datePart.Length;

        if (fileName.Length < expectedHeadLength + 4
            || !fileName.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)
            || fileName[prefix.Length] != '-'
            || !fileName.Slice(prefix.Length + 1, datePart.Length).Equals(datePart, StringComparison.Ordinal)
            || !fileName.EndsWith(".log", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        ReadOnlySpan<char> tail = fileName.Slice(expectedHeadLength, fileName.Length - expectedHeadLength - 4);

        if (tail.IsEmpty)
            return true;

        return tail[0] == '.' && tail.Length > 1 && int.TryParse(tail[1..], NumberStyles.None, CultureInfo.InvariantCulture, out index);
    }

    private string BuildFilePath(DateOnly date, int index)
    {
        var fileName = index == 0
            ? string.Create(CultureInfo.InvariantCulture, $"{FileNamePrefix}-{date:yyyy-MM-dd}.log")
            : string.Create(CultureInfo.InvariantCulture, $"{FileNamePrefix}-{date:yyyy-MM-dd}.{index:D3}.log");

        return Path.Combine(DirectoryPath, fileName);
    }

    private void OpenWriterNoLock(DateOnly date, int index, string path, long existingLength)
    {
        FileStream? stream = new(path, FileMode.Append, FileAccess.Write, FileShare.ReadWrite, FileBufferSize, FileOptions.SequentialScan);

        try
        {
            _writer = new StreamWriter(stream, Utf8NoBom, FileBufferSize, leaveOpen: false);
            stream = null;
            _currentDate = date;
            _currentIndex = index;
            _currentFilePath = path;
            _currentBytes = existingLength;
        }
        finally
        {
            stream?.Dispose();
        }
    }

    private void CloseWriterNoLock()
    {
        if (_writer is null)
            return;

        var closedPath = _currentFilePath;

        try
        {
            _writer.Flush();
            _writer.Dispose();
        }
        catch (IOException)
        {
        }
        catch (ObjectDisposedException)
        {
        }
        finally
        {
            _writer = null;
            _currentFilePath = null;
            _currentBytes = 0;
        }

        if (closedPath is not null && !ReferenceEquals(_timeProvider, TimeProvider.System))
        {
            try
            {
                File.SetLastWriteTimeUtc(closedPath, _timeProvider.GetUtcNow().UtcDateTime);
            }
            catch (IOException)
            {
            }
            catch (UnauthorizedAccessException)
            {
            }
        }
    }

    private void FlushCurrentNoLock()
    {
        try
        {
            _writer?.Flush();
        }
        catch (IOException)
        {
            CloseWriterNoLock();
        }
    }

    private async Task RunCleanupLoopAsync()
    {
        try
        {
            _ = Cleanup(_timeProvider.GetUtcNow().UtcDateTime);

            using PeriodicTimer timer = new(_cleanupInterval, _timeProvider);

            while (await timer.WaitForNextTickAsync(_shutdownToken).ConfigureAwait(false))
                _ = Cleanup(_timeProvider.GetUtcNow().UtcDateTime);
        }
        catch (Exception exception) when (exception is OperationCanceledException or ObjectDisposedException)
        {
        }
    }

    internal int Cleanup(DateTime utcNow)
    {
        if (_retention is not { } retention)
            return 0;

        string? activeFilePath;

        lock (_writeSync)
        {
            if (_writer is not null && CurrentDate() != _currentDate)
                CloseWriterNoLock();

            activeFilePath = _currentFilePath;
        }

        if (!Directory.Exists(DirectoryPath))
            return 0;

        var removed = 0;

        try
        {
            foreach (var path in Directory.EnumerateFiles(DirectoryPath, $"{FileNamePrefix}-*.log"))
            {
                if (activeFilePath is not null && string.Equals(path, activeFilePath, StringComparison.OrdinalIgnoreCase))
                    continue;

                if (!IsManagedLogFile(Path.GetFileName(path), FileNamePrefix))
                    continue;

                if (File.GetLastWriteTimeUtc(path) + retention > utcNow)
                    continue;

                if (TryDeleteFile(path))
                    removed++;
            }
        }
        catch (DirectoryNotFoundException)
        {
        }
        catch (IOException)
        {
        }
        catch (UnauthorizedAccessException)
        {
        }

        return removed;
    }

    private DateOnly CurrentDate()
        => DateOnly.FromDateTime(GetTimestamp().DateTime);

    internal static bool IsManagedLogFile(ReadOnlySpan<char> fileName, string prefix)
    {
        var minLength = prefix.Length + 1 + 10 + 4;

        if (fileName.Length < minLength
            || !fileName.StartsWith(prefix, StringComparison.OrdinalIgnoreCase)
            || fileName[prefix.Length] != '-'
            || !fileName.EndsWith(".log", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        ReadOnlySpan<char> middle = fileName.Slice(prefix.Length + 1, fileName.Length - prefix.Length - 1 - 4);

        if (!DateOnly.TryParseExact(middle[..10], "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out _))
            return false;

        if (middle.Length == 10)
            return true;

        if (middle[10] != '.' || middle.Length == 11)
            return false;

        for (var i = 11; i < middle.Length; i++)
        {
            if (!char.IsAsciiDigit(middle[i]))
                return false;
        }

        return true;
    }

    private static bool TryDeleteFile(string path)
    {
        try
        {
            File.Delete(path);

            return true;
        }
        catch (FileNotFoundException)
        {
            return false;
        }
        catch (DirectoryNotFoundException)
        {
            return false;
        }
        catch (IOException)
        {
            return false;
        }
        catch (UnauthorizedAccessException)
        {
            return false;
        }
    }

    internal void Flush()
    {
        lock (_writeSync)
        {
            if (_closed)
                return;

            DrainAvailableNoLock();
            FlushCurrentNoLock();
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (Interlocked.Exchange(ref _disposed, 1) != 0)
            return;

        _ = _channel.Writer.TryComplete();
        await _shutdownCts.CancelAsync().ConfigureAwait(false);

        await _processTask.ConfigureAwait(false);

        if (_cleanupTask is not null)
            await _cleanupTask.ConfigureAwait(false);

        lock (_writeSync)
        {
            DrainAvailableNoLock();
            CloseWriterNoLock();
            _closed = true;
        }

        _shutdownCts.Dispose();
    }

    public void Dispose()
    {
        if (Interlocked.Exchange(ref _disposed, 1) != 0)
            return;

        _ = _channel.Writer.TryComplete();
        _shutdownCts.Cancel();

        lock (_writeSync)
        {
            DrainAvailableNoLock();
            CloseWriterNoLock();
            _closed = true;
        }

        _shutdownCts.Dispose();
    }

    private sealed class UIFileLogger(string category, UIFileLoggerProvider provider) : ILogger
    {
        public IDisposable BeginScope<TState>(TState state)
            where TState : notnull
            => provider._scopeProvider?.Push(state) ?? NullScope.Instance;

        public bool IsEnabled(LogLevel logLevel)
            => provider.IsEnabled(logLevel);

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            if (!provider.IsEnabled(logLevel))
                return;

            ArgumentNullException.ThrowIfNull(formatter);

            var message = formatter(state, exception);
            provider.Enqueue(logLevel, category, message, exception);
        }
    }

    private sealed class NullScope : IDisposable
    {
        public static readonly NullScope Instance = new();

        public void Dispose()
        {
        }
    }
}
