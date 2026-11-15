namespace NE.Standard.UI.Desktop.Hosting;

/// <summary>Specifies how file downloads initiated by a page are saved on the desktop.</summary>
public enum DesktopDownloadMode
{
    /// <summary>Prompts the user with a native Windows Save File dialog and hides the browser download UI.</summary>
    SaveDialog,

    /// <summary>Saves downloaded files directly into <see cref="DesktopHostOptions.DownloadsDirectory"/> without prompting.</summary>
    Directory
}
