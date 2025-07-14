using NE.Standard.Extensions;
using System;
using System.Collections.Generic;
using System.IO;

namespace NE.Standard.IO
{
    /// <summary>
    /// Provides helper methods for performing common directory operations,
    /// such as creating, deleting, copying, moving, and listing contents.
    /// </summary>
    public static class DirectoryHelper
    {
        /// <summary>
        /// Creates a directory at the specified <paramref name="path"/> if it doesn't already exist.
        /// </summary>
        /// <param name="path">The path of the directory to create.</param>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="path"/> is null or whitespace.</exception>
        public static void Create(string path)
        {
            ValidatePath(path);
            Directory.CreateDirectory(path);
        }

        /// <summary>
        /// Deletes the directory at the specified <paramref name="path"/> if it exists.
        /// </summary>
        /// <param name="path">The path of the directory to delete.</param>
        /// <param name="recursive">Whether to delete subdirectories and files.</param>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="path"/> is null or whitespace.</exception>
        public static void Delete(string path, bool recursive = true)
        {
            ValidatePath(path);
            if (Directory.Exists(path))
                Directory.Delete(path, recursive);
        }

        /// <summary>
        /// Copies the contents of one directory to another location.
        /// </summary>
        /// <param name="sourcePath">The source directory path.</param>
        /// <param name="destinationPath">The destination directory path.</param>
        /// <param name="overwrite">Whether to overwrite existing files.</param>
        /// <exception cref="ArgumentNullException">Thrown if any path is null or whitespace.</exception>
        /// <exception cref="DirectoryNotFoundException">Thrown if the source directory does not exist.</exception>
        public static void Copy(string sourcePath, string destinationPath, bool overwrite = true)
        {
            ValidatePath(sourcePath);
            ValidatePath(destinationPath);

            if (!Directory.Exists(sourcePath))
                throw new DirectoryNotFoundException($"Source directory not found: {sourcePath}");

            Directory.CreateDirectory(destinationPath);

            foreach (var file in Directory.GetFiles(sourcePath))
            {
                var destFile = Path.Combine(destinationPath, Path.GetFileName(file));
                File.Copy(file, destFile, overwrite);
            }

            foreach (var dir in Directory.GetDirectories(sourcePath))
            {
                var destDir = Path.Combine(destinationPath, Path.GetFileName(dir));
                Copy(dir, destDir, overwrite);
            }
        }

        /// <summary>
        /// Moves a directory to a new location.
        /// </summary>
        /// <param name="sourcePath">The source directory path.</param>
        /// <param name="destinationPath">The destination directory path.</param>
        /// <exception cref="ArgumentNullException">Thrown if any path is null or whitespace.</exception>
        /// <exception cref="DirectoryNotFoundException">Thrown if the source directory does not exist.</exception>
        public static void Move(string sourcePath, string destinationPath)
        {
            ValidatePath(sourcePath);
            ValidatePath(destinationPath);

            if (!Directory.Exists(sourcePath))
                throw new DirectoryNotFoundException($"Source directory not found: {sourcePath}");

            Directory.Move(sourcePath, destinationPath);
        }

        /// <summary>
        /// Searches for files in the specified directory matching the given <paramref name="searchPattern"/>.
        /// </summary>
        /// <param name="path">The root directory to search in.</param>
        /// <param name="searchPattern">
        /// The search string to match against the names of files. 
        /// Example: "*.txt" or "report-*.log"
        /// </param>
        /// <param name="includeSubdirectories">
        /// If <c>true</c>, includes all subdirectories recursively in the search.
        /// </param>
        /// <returns>An enumerable of full file paths that match the pattern.</returns>
        /// <exception cref="ArgumentNullException">Thrown if <paramref name="path"/> or <paramref name="searchPattern"/> is null or whitespace.</exception>
        public static IEnumerable<string> Search(string path, string searchPattern, bool includeSubdirectories = false)
        {
            ValidatePath(path);

            if (searchPattern.IsNull())
                throw new ArgumentNullException(nameof(searchPattern));

            if (!Directory.Exists(path))
                yield break;

            var option = includeSubdirectories
                ? SearchOption.AllDirectories
                : SearchOption.TopDirectoryOnly;

            foreach (var file in Directory.EnumerateFiles(path, searchPattern, option))
            {
                yield return file;
            }
        }

        private static void ValidatePath(string path)
        {
            if (path.IsNull())
                throw new ArgumentNullException(nameof(path));
        }
    }
}
