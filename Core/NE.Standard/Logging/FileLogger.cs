using System;
using System.IO;
using System.Linq;

namespace NE.Standard.Logging
{
    /// <summary>
    /// Thread-safe file logger that cleans old log files.
    /// </summary>
    public class FileLogger<T> : NeLogger<T>
    {
        private readonly string _directory;
        private readonly int _retentionDays;
        private readonly object _lock = new();
        private DateTime _lastCleanup = DateTime.MinValue;

        public FileLogger(string directory, int retentionDays = 7)
        {
            _directory = directory;
            _retentionDays = retentionDays;
            Directory.CreateDirectory(_directory);
        }

        protected override void WriteFormatted(LogLevel level, string message)
        {
            var output = FormatMessage(level, message);
            var file = Path.Combine(_directory, $"{DateTime.Now:yyyy-MM-dd}.log");
            lock (_lock)
            {
                File.AppendAllText(file, output + Environment.NewLine);
                CleanupIfNeeded();
            }
        }

        private void CleanupIfNeeded()
        {
            if ((DateTime.Now - _lastCleanup).TotalHours < 1) return;
            _lastCleanup = DateTime.Now;
            try
            {
                var threshold = DateTime.Now.AddDays(-_retentionDays);
                var files = Directory.GetFiles(_directory, "*.log")
                    .Select(f => new FileInfo(f));
                foreach (var f in files)
                    if (f.CreationTime < threshold)
                        f.Delete();
            }
            catch
            {
                // ignore cleanup errors
            }
        }
    }
}
