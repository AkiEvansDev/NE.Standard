using System;

namespace NE.Standard.Logging
{
    /// <summary>
    /// Thread-safe console logger with color support.
    /// </summary>
    public class ConsoleLogger<T> : NeLogger<T>
    {
        private static readonly object _lock = new();

        protected override void WriteFormatted(LogLevel level, string message)
        {
            var output = FormatMessage(level, message);
            lock (_lock)
            {
                var color = Console.ForegroundColor;
                Console.ForegroundColor = GetColor(level);
                Console.WriteLine(output);
                Console.ForegroundColor = color;
            }
        }

        private static ConsoleColor GetColor(LogLevel level) => level switch
        {
            LogLevel.Debug => ConsoleColor.Gray,
            LogLevel.Information => ConsoleColor.Green,
            LogLevel.Warning => ConsoleColor.Yellow,
            LogLevel.Error => ConsoleColor.Red,
            _ => Console.ForegroundColor
        };
    }
}
