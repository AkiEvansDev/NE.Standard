using NE.Standard.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.IO
{
    /// <summary>
    /// Provides helper methods for performing common file system operations, 
    /// including synchronous and asynchronous read/write utilities.
    /// </summary>
    public static class FileHelper
    {
        /// <summary>
        /// Creates a new file at the specified <paramref name="path"/> with the given <paramref name="content"/>.
        /// If the file already exists, it will be overwritten.
        /// </summary>
        /// <param name="path">The full path where the file will be created.</param>
        /// <param name="content">The content to write to the file. If <c>null</c>, an empty string will be used.</param>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="path"/> is <c>null</c> or whitespace.</exception>
        public static void Create(string path, string? content = null)
        {
            ValidatePath(path);

            Directory.CreateDirectory(Path.GetDirectoryName(path)!);
            File.WriteAllText(path, content ?? string.Empty);
        }

        /// <summary>
        /// Updates the content of an existing file at the specified <paramref name="path"/>.
        /// </summary>
        /// <param name="path">The full path to the file to update.</param>
        /// <param name="content">The new content to write to the file.</param>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="path"/> is <c>null</c> or whitespace.</exception>
        /// <exception cref="FileNotFoundException">Thrown if the file does not exist.</exception>
        public static void Update(string path, string content)
        {
            ValidatePath(path);
            if (!File.Exists(path))
                throw new FileNotFoundException("File not found", path);

            File.WriteAllText(path, content ?? string.Empty);
        }

        /// <summary>
        /// Reads and returns the entire content of the file at the specified <paramref name="path"/>.
        /// </summary>
        /// <param name="path">The full path to the file.</param>
        /// <returns>The file content as a string.</returns>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="path"/> is <c>null</c> or whitespace.</exception>
        /// <exception cref="FileNotFoundException">Thrown if the file does not exist.</exception>
        public static string Read(string path)
        {
            ValidatePath(path);
            if (!File.Exists(path))
                throw new FileNotFoundException("File not found", path);

            return File.ReadAllText(path);
        }

        /// <summary>
        /// Deletes the file at the specified <paramref name="path"/>, if it exists.
        /// </summary>
        /// <param name="path">The full path to the file to delete.</param>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="path"/> is <c>null</c> or whitespace.</exception>
        public static void Delete(string path)
        {
            ValidatePath(path);

            if (File.Exists(path))
                File.Delete(path);
        }

        /// <summary>
        /// Asynchronously writes the specified <paramref name="content"/> to a file at the given <paramref name="path"/>.
        /// If the file already exists, its content will be overwritten.
        /// </summary>
        /// <param name="path">The full path to the file.</param>
        /// <param name="content">The content to write to the file.</param>
        /// <param name="cancellationToken">A cancellation token that can be used to cancel the operation.</param>
        /// <returns>A task representing the asynchronous write operation.</returns>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="path"/> is <c>null</c> or whitespace.</exception>
        public static async Task WriteAsync(string path, string content, CancellationToken cancellationToken = default)
        {
            ValidatePath(path);

            await Task.Run(() => Directory.CreateDirectory(Path.GetDirectoryName(path)!));
            await File.WriteAllTextAsync(path, content ?? string.Empty, cancellationToken).ConfigureAwait(false);
        }

        /// <summary>
        /// Asynchronously reads the entire content of the file at the specified <paramref name="path"/>.
        /// </summary>
        /// <param name="path">The full path to the file.</param>
        /// <param name="cancellationToken">A cancellation token that can be used to cancel the operation.</param>
        /// <returns>A task that represents the asynchronous read operation. The result contains the file content as a string.</returns>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="path"/> is <c>null</c> or whitespace.</exception>
        /// <exception cref="FileNotFoundException">Thrown if the file does not exist.</exception>
        public static async Task<string> ReadAsync(string path, CancellationToken cancellationToken = default)
        {
            ValidatePath(path);
            if (!File.Exists(path))
                throw new FileNotFoundException("File not found", path);

            return await File.ReadAllTextAsync(path, cancellationToken).ConfigureAwait(false);
        }

        /// <summary>
        /// Searches for lines in a file that contain the specified keyword (case-insensitive).
        /// </summary>
        /// <param name="path">The path to the file.</param>
        /// <param name="keyword">The keyword to search for.</param>
        /// <returns>Enumerable of matching lines.</returns>
        public static IEnumerable<string> FindLinesContaining(string path, string keyword)
        {
            if (string.IsNullOrWhiteSpace(keyword))
                throw new ArgumentNullException(nameof(keyword));

            return EnumerateLines(path).Where(line =>
                line.ContainsIgnoreCase(keyword));
        }

        /// <summary>
        /// Processes each line of a large file using the provided <paramref name="lineProcessor"/> action.
        /// </summary>
        /// <param name="path">The path to the file.</param>
        /// <param name="lineProcessor">Action to apply to each line.</param>
        public static void ProcessLines(string path, Action<string> lineProcessor)
        {
            if (lineProcessor is null)
                throw new ArgumentNullException(nameof(lineProcessor));

            foreach (var line in EnumerateLines(path))
            {
                lineProcessor(line);
            }
        }

        /// <summary>
        /// Asynchronously processes each line of a large file using the provided <paramref name="asyncProcessor"/>.
        /// </summary>
        /// <param name="path">The path to the file.</param>
        /// <param name="asyncProcessor">An async delegate to process each line.</param>
        /// <param name="cancellationToken">A cancellation token to cancel the operation.</param>
        public static async Task ProcessLinesAsync(string path, Func<string, Task> asyncProcessor, CancellationToken cancellationToken = default)
        {
            ValidatePath(path);
            if (!File.Exists(path))
                throw new FileNotFoundException("File not found", path);
            if (asyncProcessor == null)
                throw new ArgumentNullException(nameof(asyncProcessor));

            using var stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize: 4096, useAsync: true);
            using var reader = new StreamReader(stream);

            while (!reader.EndOfStream)
            {
                cancellationToken.ThrowIfCancellationRequested();
                var line = await reader.ReadLineAsync();
                if (line != null)
                    await asyncProcessor(line).ConfigureAwait(false);
            }
        }

        /// <summary>
        /// Lazily enumerates lines from the specified file without loading the entire content into memory.
        /// </summary>
        /// <param name="path">The path to the file.</param>
        /// <returns>An enumerable of lines in the file.</returns>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="path"/> is null or whitespace.</exception>
        /// <exception cref="FileNotFoundException">Thrown if the file does not exist.</exception>
        public static IEnumerable<string> EnumerateLines(string path)
        {
            ValidatePath(path);
            if (!File.Exists(path))
                throw new FileNotFoundException("File not found", path);

            using var reader = new StreamReader(path);
            while (!reader.EndOfStream)
            {
                yield return reader.ReadLine()!;
            }
        }

        /// <summary>
        /// Asynchronously and lazily reads lines from a file using <c>IAsyncEnumerable&lt;string&gt;</c>.
        /// </summary>
        /// <param name="path">The path to the file.</param>
        /// <param name="cancellationToken">A cancellation token for the operation.</param>
        /// <returns>An async enumerable of lines in the file.</returns>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="path"/> is null or whitespace.</exception>
        /// <exception cref="FileNotFoundException">Thrown if the file does not exist.</exception>
        public static async IAsyncEnumerable<string> ReadLinesAsync(string path, [EnumeratorCancellation] CancellationToken cancellationToken = default)
        {
            ValidatePath(path);
            if (!File.Exists(path))
                throw new FileNotFoundException("File not found", path);

            using var stream = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize: 8192, useAsync: true);
            using var reader = new StreamReader(stream);

            while (!reader.EndOfStream)
            {
                cancellationToken.ThrowIfCancellationRequested();
                var line = await reader.ReadLineAsync();
                if (line != null)
                    yield return line;
            }
        }

        /// <summary>
        /// Appends multiple lines to a file using buffered streaming.
        /// Creates the file and directory if they do not exist.
        /// </summary>
        /// <param name="path">The path to the target file.</param>
        /// <param name="lines">The collection of lines to append.</param>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="path"/> or <paramref name="lines"/> is null or whitespace.</exception>
        public static void AppendLinesBuffered(string path, IEnumerable<string> lines)
        {
            ValidatePath(path);
            if (lines == null)
                throw new ArgumentNullException(nameof(lines));

            Directory.CreateDirectory(Path.GetDirectoryName(path)!);

            using var writer = new StreamWriter(path, append: true);
            foreach (var line in lines)
            {
                writer.WriteLine(line);
            }
        }

        private static void ValidatePath(string path)
        {
            if (path.IsNull())
                throw new ArgumentNullException(nameof(path));
        }
    }
}
