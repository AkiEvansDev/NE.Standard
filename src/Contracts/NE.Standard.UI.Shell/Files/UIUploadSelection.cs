using System;

namespace NE.Standard.UI.Shell.Files;

/// <summary>
/// Represents a validated set of files selected for upload.
/// </summary>
public sealed class UIUploadSelection
{
    /// <summary>
    /// Creates a validated upload selection from the given files.
    /// </summary>
    public UIUploadSelection(UIUploadFile[] files)
    {
        ArgumentNullException.ThrowIfNull(files);

        Files = files;

        for (var i = 0; i < Files.Length; i++)
        {
            ArgumentNullException.ThrowIfNull(Files[i]);
            Files[i].Validate();
        }
    }

    /// <summary>
    /// Gets the selected files.
    /// </summary>
    public UIUploadFile[] Files { get; }

    /// <summary>
    /// Gets the selected file when exactly one file is selected.
    /// </summary>
    public UIUploadFile? SingleFile
        => Files.Length == 1 ? Files[0] : null;
}
