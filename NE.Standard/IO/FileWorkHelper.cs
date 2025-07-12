using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.IO
{
    /// <summary>
    /// Helper methods for common file operations.
    /// </summary>
    public static class FileWorkHelper
    {
        /// <summary>
        /// Creates a file with the specified content. If the file exists it will be overwritten.
        /// </summary>
        public static void Create(string path, string? content = null)
        {
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentNullException(nameof(path));

            Directory.CreateDirectory(Path.GetDirectoryName(path)!);
            File.WriteAllText(path, content ?? string.Empty);
        }

        /// <summary>
        /// Updates an existing file with the provided content.
        /// </summary>
        /// <exception cref="FileNotFoundException">Thrown when the file does not exist.</exception>
        public static void Update(string path, string content)
        {
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentNullException(nameof(path));
            if (!File.Exists(path))
                throw new FileNotFoundException("File not found", path);

            File.WriteAllText(path, content ?? string.Empty);
        }

        /// <summary>
        /// Reads the entire contents of the file.
        /// </summary>
        /// <exception cref="FileNotFoundException">Thrown when the file does not exist.</exception>
        public static string Read(string path)
        {
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentNullException(nameof(path));
            if (!File.Exists(path))
                throw new FileNotFoundException("File not found", path);

            return File.ReadAllText(path);
        }

        /// <summary>
        /// Deletes the specified file if it exists.
        /// </summary>
        public static void Delete(string path)
        {
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentNullException(nameof(path));

            if (File.Exists(path))
                File.Delete(path);
        }

        /// <summary>
        /// Asynchronously writes content to a file. Overwrites if file exists.
        /// </summary>
        public static async Task WriteAsync(string path, string content, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentNullException(nameof(path));

            Directory.CreateDirectory(Path.GetDirectoryName(path)!);
            await File.WriteAllTextAsync(path, content ?? string.Empty, cancellationToken).ConfigureAwait(false);
        }

        /// <summary>
        /// Asynchronously reads the contents of a file.
        /// </summary>
        public static async Task<string> ReadAsync(string path, CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrWhiteSpace(path))
                throw new ArgumentNullException(nameof(path));
            if (!File.Exists(path))
                throw new FileNotFoundException("File not found", path);

            return await File.ReadAllTextAsync(path, cancellationToken).ConfigureAwait(false);
        }
    }
}
