using Microsoft.Extensions.Logging;
using NE.Standard.Extensions;
using System;

namespace NE.Standard.Logging
{
    public abstract class AsyncBaseLogger : ILogger, IDisposable
    {
        private readonly string _category;
        private readonly LogLevel _minLevel;

        protected AsyncBaseLogger(string category, LogLevel minLevel)
        {
            if (!category.IsNull() && category.Contains('.'))
                category = category.Split('.')[^1];

            _category = category;
            _minLevel = minLevel;
        }

        /// <inheritdoc />
        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

        /// <inheritdoc />
        public bool IsEnabled(LogLevel logLevel) => logLevel >= _minLevel;

        public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception? exception, Func<TState, Exception?, string> formatter)
        {
            if (!IsEnabled(logLevel)) return;

            var message = $"[{DateTime.Now.ToFormat()}][{logLevel}] {_category}: {formatter(state, exception)}";
            if (exception != null)
                message += $" {exception}";

            EnqueueMessage(logLevel, message);
        }

        protected abstract void EnqueueMessage(LogLevel level, string message);

        public virtual void Dispose() { }
    }
}
