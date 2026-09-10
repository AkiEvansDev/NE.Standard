using System;
using System.Linq;
using System.Reflection;
using NE.Standard.UI.Icons.Material;

namespace DemoApp;

/// <summary>
/// The icons this demo draws, named for what they mean here rather than for what the set calls them.
/// </summary>
/// <remarks>Also the list the host registers, so the constants and what the pack serves cannot drift apart.</remarks>
public static class DemoIcons
{
    public const string Check = MaterialIcons.Check;
    public const string Copy = MaterialIcons.ContentCopy;
    public const string Edit = MaterialIcons.Edit;
    public const string Refresh = MaterialIcons.Refresh;
    public const string Undo = MaterialIcons.Undo;
    public const string Close = MaterialIcons.Close;

    public const string ArrowRight = MaterialIcons.ArrowForward;
    public const string ChevronRight = MaterialIcons.ChevronRight;
    public const string ExternalLink = MaterialIcons.OpenInNew;
    public const string Link = MaterialIcons.Link;
    public const string Navigation = MaterialIcons.Navigation;

    public const string Search = MaterialIcons.Search;
    public const string Filter = MaterialIcons.FilterAlt;
    public const string Sliders = MaterialIcons.Tune;

    public const string Alert = MaterialIcons.Error;
    public const string BadgeCheck = MaterialIcons.Verified;

    public const string File = MaterialIcons.Draft;
    public const string FileText = MaterialIcons.Description;
    public const string Upload = MaterialIcons.Upload;
    public const string Download = MaterialIcons.Download;

    public const string Clock = MaterialIcons.Schedule;
    public const string Folder = MaterialIcons.Folder;
    public const string Cloud = MaterialIcons.Cloud;
    public const string History = MaterialIcons.History;

    public const string User = MaterialIcons.Person;
    public const string UserRound = MaterialIcons.AccountCircle;
    public const string Groups = MaterialIcons.Groups;
    public const string Lock = MaterialIcons.LockIcon;
    public const string Shield = MaterialIcons.Shield;

    public const string Mail = MaterialIcons.Mail;
    public const string MessageSquare = MaterialIcons.Chat;
    public const string Bell = MaterialIcons.Notifications;
    public const string Send = MaterialIcons.Send;

    public const string List = MaterialIcons.List;
    public const string LayoutDashboard = MaterialIcons.Dashboard;

    public const string Home = MaterialIcons.Home;
    public const string Settings = MaterialIcons.Settings;
    public const string Palette = MaterialIcons.Palette;
    public const string LightMode = MaterialIcons.LightMode;
    public const string DarkMode = MaterialIcons.DarkMode;
    public const string Star = MaterialIcons.Star;
    public const string Pin = MaterialIcons.Keep;
    public const string Unpin = MaterialIcons.KeepOff;

    /// <summary>
    /// The outlined drawing of a glyph, which is what a control wears; the filled one is for content.
    /// </summary>
    public static string Outline(string icon)
        => MaterialIcons.Outlined(icon);

    /// <summary>Every name above, for the host to register with the pack.</summary>
    /// <remarks>A registered name serves both drawings, so a value naming one comes back to its base first.</remarks>
    public static string[] All()
        => [.. typeof(DemoIcons)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(field => field.IsLiteral && field.FieldType == typeof(string))
            .Select(field => (string)field.GetRawConstantValue()!)
            .Select(name => name.EndsWith(MaterialIcons.OutlinedSuffix, StringComparison.Ordinal)
                ? name[..^MaterialIcons.OutlinedSuffix.Length]
                : name)
            .Distinct(StringComparer.Ordinal)];
}
