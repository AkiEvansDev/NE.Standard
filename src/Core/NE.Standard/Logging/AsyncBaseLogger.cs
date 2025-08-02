using Microsoft.Extensions.Logging;
using NE.Standard.Extensions;
using System;

namespace NE.Standard.Logging
{
    /// <summary>
    /// Provides a base implementation of <see cref="ILogger"/> for asynchronous logging scenarios.
    /// Formats messages with timestamp, log level, and category, and defers actual log handling to subclasses via <see cref="EnqueueMessage"/>.
    /// </summary>
    public abstract class AsyncBaseLogger : ILogger, IDisposable
    {
        private readonly string _category;
        private readonly LogLevel _minLevel;

        /// <summary>
        /// Initializes a new instance of the <see cref="AsyncBaseLogger"/> class with the specified logging <paramref name="category"/> and minimum <paramref name="minLevel"/>.
        /// </summary>
        /// <param name="category">
        /// The logging category. If it contains a dot ('.'), only the last segment will be used as the internal category label.
        /// </param>
        /// <param name="minLevel">The minimum <see cref="LogLevel"/> required for a message to be logged.</param>
        protected AsyncBaseLogger(string category, LogLevel minLevel)
        {
            if (!category.IsNull() && category.Contains('.'))
                category = category.Split('.')[^1];

            _category = category;
            _minLevel = minLevel;
        }

        /// <inheritdoc/>
        /// <remarks>Scopes are not supported by this logger and this method returns <c>null</c>.</remarks>
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

        /// <inheritdoc/>
        public bool IsEnabled(LogLevel logLevel) => logLevel >= _minLevel;

        /// <inheritdoc/>
        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            if (!IsEnabled(logLevel)) return;

            var message = $"[{DateTime.UtcNow.ToFormat("yyyy-MM-dd HH:mm:ss")}][{logLevel}] {_category}: {formatter(state, exception)}";
            if (exception != null)
                message += $" {exception}";

            EnqueueMessage(logLevel, message);
        }

        /// <summary>
        /// When implemented in a derived class, enqueues the formatted log <paramref name="message"/> for asynchronous handling.
        /// </summary>
        /// <param name="level">The severity level of the message.</param>
        /// <param name="message">The fully formatted log message.</param>
        protected abstract void EnqueueMessage(LogLevel level, string message);

        /// <summary>
        /// Releases any unmanaged resources used by the logger. This base implementation is a no-op.
        /// Override if resource cleanup is required.
        /// </summary>
        public virtual void Dispose() { }
    }
}
