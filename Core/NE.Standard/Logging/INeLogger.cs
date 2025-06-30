using System;

namespace NE.Standard.Logging
{
    /// <summary>
    /// Common logger interface with a category.
    /// </summary>
    public interface INeLogger<out T>
    {
        void Log(LogLevel level, string message);

        void Debug(string message) => Log(LogLevel.Debug, message);
        void Information(string message) => Log(LogLevel.Information, message);
        void Warning(string message) => Log(LogLevel.Warning, message);
        void Error(string message, Exception? exception = null);
    }
}
