using System;

namespace NE.Standard.Logging
{
    /// <summary>
    /// Base implementation for <see cref="INeLogger{T}"/>.
    /// </summary>
    public abstract class NeLogger<T> : INeLogger<T>
    {
        protected string Category { get; } = typeof(T).Name;

        public virtual void Log(LogLevel level, string message)
        {
            WriteFormatted(level, message);
        }

        public virtual void Error(string message, Exception? exception = null)
        {
            var fullMessage = exception == null
                ? message
                : message + " | " + exception;
            WriteFormatted(LogLevel.Error, fullMessage);
        }

        protected string FormatMessage(LogLevel level, string message)
        {
            return $"[{DateTime.Now:MM.dd.yyyy HH:mm:ss.fff}][{level}][{Category}]: {message}";
        }

        protected abstract void WriteFormatted(LogLevel level, string message);
    }
}
