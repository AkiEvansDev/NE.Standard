using System.Linq;
using System.Reflection;
using NE.Colors;

namespace DemoApp;

/// <summary>
/// The icons this demo draws, named for what they mean here rather than for what the set calls them.
/// </summary>
/// <remarks>Also the list the host registers, so the constants and what the pack serves cannot drift apart.</remarks>
public static class DemoIcons
{
    public const string Add = MaterialIcons.Add;
    public const string Check = MaterialIcons.Check;
    public const string Copy = MaterialIcons.ContentCopy;
    public const string Code = MaterialIcons.Code;
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
    public const string Server = MaterialIcons.Dns;
    public const string Region = MaterialIcons.Public;
    public const string Replicas = MaterialIcons.Layers;
    public const string Attach = MaterialIcons.AttachFile;
    public const string Emoji = MaterialIcons.Mood;
    public const string Bolt = MaterialIcons.Bolt;
    public const string Calendar = MaterialIcons.CalendarMonth;
    public const string Admin = MaterialIcons.AdminPanelSettings;

    /// <summary>
    /// The warm light yellow of a folder in a file list (near <c>#FFDD96</c>): the palette's Photon, a light tint on the dark page and
    /// a shade on the light one, since the light yellow itself reads 1.2:1 there and an outlined mark in it vanishes.
    /// </summary>
    public static readonly UIThemeColor Warm = UIThemeColor.Create(new ColorVariant(ColorName.Photon, ColorAdjustment.Shade, 4), new ColorVariant(ColorName.Photon, ColorAdjustment.Tint, 2));

    /// <summary>
    /// The outlined drawing of a glyph, which is what a control wears; the filled one is for content.
    /// </summary>
    public static string Outline(string icon)
        => MaterialIcons.Outlined(icon);

    /// <summary>Every name above, for the host to register with the pack.</summary>
    public static string[] All()
        => [.. typeof(DemoIcons)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(field => field.IsLiteral && field.FieldType == typeof(string))
            .Select(field => (string)field.GetRawConstantValue()!)];
}
