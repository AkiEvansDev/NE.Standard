using System.Collections.Generic;
using NE.Standard.UI.Icons.Material;

namespace TeamRoom;

/// <summary>
/// The glyphs the application draws, named for what they stand for; the web host registers exactly these.
/// </summary>
public static class AppIcons
{
    public const string Files = MaterialIcons.Folder;
    public const string Folder = MaterialIcons.Folder;
    public const string File = MaterialIcons.Description;
    public const string NewFolder = MaterialIcons.CreateNewFolder;
    public const string NewFile = MaterialIcons.NoteAdd;
    public const string Save = MaterialIcons.Save;
    public const string Rename = MaterialIcons.Edit;
    public const string Delete = MaterialIcons.Delete;
    public const string Chat = MaterialIcons.Forum;
    public const string Room = MaterialIcons.Group;
    public const string Direct = MaterialIcons.Person;
    public const string Send = MaterialIcons.Send;
    public const string Attach = MaterialIcons.AttachFile;
    public const string Search = MaterialIcons.Search;
    public const string Download = MaterialIcons.Download;
    public const string Accounts = MaterialIcons.AdminPanelSettings;
    public const string Settings = MaterialIcons.Settings;
    public const string SignOut = MaterialIcons.Logout;
    public const string Add = MaterialIcons.Add;
    public const string Block = MaterialIcons.Block;
    public const string Unblock = MaterialIcons.LockOpen;
    public const string Key = MaterialIcons.Key;
    public const string Shield = MaterialIcons.Shield;
    public const string Picture = MaterialIcons.Image;
    public const string Wallpaper = MaterialIcons.Wallpaper;
    public const string LightMode = MaterialIcons.LightMode;
    public const string DarkMode = MaterialIcons.DarkMode;
    public const string Close = MaterialIcons.Close;
    public const string Check = MaterialIcons.Check;

    public static string Outline(string icon)
        => MaterialIcons.Outlined(icon);

    /// <summary>Every glyph above, for the host's registration.</summary>
    public static string[] All()
    {
        List<string> icons = [];

        foreach (System.Reflection.FieldInfo field in typeof(AppIcons).GetFields(System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Static))
        {
            if (field.IsLiteral && field.GetRawConstantValue() is string icon && !icons.Contains(icon))
                icons.Add(icon);
        }

        return [.. icons];
    }
}
