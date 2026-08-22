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
        FileIds = new string[files.Length];

        for (var i = 0; i < Files.Length; i++)
        {
            UIUploadFile file = Files[i];

            ArgumentNullException.ThrowIfNull(file);

            file.Validate();

            FileIds[i] = file.FileId;
        }
    }

    /// <summary>
    /// Gets the selected files.
    /// </summary>
    public UIUploadFile[] Files { get; }

    /// <summary>
    /// Gets selected file ids.
    /// </summary>
    public string[] FileIds { get; }

    /// <summary>
    /// Gets the selected file when exactly one file is selected.
    /// </summary>
    public UIUploadFile? SingleFile
        => Files.Length == 1 ? Files[0] : null;

    /// <summary>
    /// Gets whether at least one file is selected.
    /// </summary>
    public bool HasFiles => Files.Length > 0;

    /// <summary>
    /// Gets whether exactly one file is selected.
    /// </summary>
    public bool IsSingle => Files.Length == 1;
}
