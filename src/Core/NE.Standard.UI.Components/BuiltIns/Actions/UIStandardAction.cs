using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Constants;

namespace NE.Standard.UI.Components.BuiltIns.Actions;

/// <summary>
/// One standard action — its name in the framework's words, its glyph, and whether it is drawn in the danger colour — the one
/// source a built-in menu's entry, a row's button and the Extensions presets name and mark it from.
/// </summary>
public readonly record struct UIStandardAction(string Word, string Glyph, bool IsDanger = false)
{
    // The shell's UIStrings.Action* keys, spelt here because the components cannot reach the shell; UIStringsSyncTests holds the
    // two together. The pin's offer is the outlined pin, the unpin's the struck one; Cancel wears the ×; Done ends an edit made in
    // place with a check, where Save writes a document out under its disk. New makes one and Add puts one more in a list, both under
    // the plus; Remove takes one out of a list under the minus, where Delete destroys it. More is the vertical ⋮.
    public static readonly UIStandardAction Pin = new("ui.action.pin", UIGlyphs.PinOutlined);
    public static readonly UIStandardAction Unpin = new("ui.action.unpin", UIGlyphs.PinOff);
    public static readonly UIStandardAction Open = new("ui.action.open", UIGlyphs.OpenInNew);
    public static readonly UIStandardAction Edit = new("ui.action.edit", UIGlyphs.Edit);
    public static readonly UIStandardAction Copy = new("ui.action.copy", UIGlyphs.Copy);
    public static readonly UIStandardAction Save = new("ui.action.save", UIGlyphs.Save);
    public static readonly UIStandardAction Done = new("ui.action.done", UIGlyphs.Check);
    public static readonly UIStandardAction Cancel = new("ui.action.cancel", UIGlyphs.Close);
    public static readonly UIStandardAction Close = new("ui.action.close", UIGlyphs.Close);
    public static readonly UIStandardAction Back = new("ui.action.back", UIGlyphs.ArrowBack);
    public static readonly UIStandardAction New = new("ui.action.new", UIGlyphs.Add);
    public static readonly UIStandardAction Delete = new("ui.action.delete", UIGlyphs.Delete, IsDanger: true);
    public static readonly UIStandardAction More = new("ui.action.more", UIGlyphs.MoreVertical);
    public static readonly UIStandardAction Refresh = new("ui.action.refresh", UIGlyphs.Refresh);
    public static readonly UIStandardAction Search = new("ui.action.search", UIGlyphs.Search);
    public static readonly UIStandardAction Filter = new("ui.action.filter", UIGlyphs.Filter);
    public static readonly UIStandardAction Settings = new("ui.action.settings", UIGlyphs.Settings);
    public static readonly UIStandardAction Share = new("ui.action.share", UIGlyphs.Share);
    public static readonly UIStandardAction Download = new("ui.action.download", UIGlyphs.Download);
    public static readonly UIStandardAction Upload = new("ui.action.upload", UIGlyphs.Upload);
    public static readonly UIStandardAction Rename = new("ui.action.rename", UIGlyphs.Rename);
    public static readonly UIStandardAction Add = new("ui.action.add", UIGlyphs.Add);
    public static readonly UIStandardAction Remove = new("ui.action.remove", UIGlyphs.Remove);
    public static readonly UIStandardAction Send = new("ui.action.send", UIGlyphs.Send);
    public static readonly UIStandardAction Attach = new("ui.action.attach", UIGlyphs.AttachFile);
    public static readonly UIStandardAction Menu = new("ui.action.menu", UIGlyphs.Menu);
    public static readonly UIStandardAction Stop = new("ui.action.stop", UIGlyphs.Stop);
    public static readonly UIStandardAction Undo = new("ui.action.undo", UIGlyphs.Undo);
    public static readonly UIStandardAction Redo = new("ui.action.redo", UIGlyphs.Redo);
    public static readonly UIStandardAction SignOut = new("ui.action.signout", UIGlyphs.Logout);

    /// <summary>The action as a menu's entry under <paramref name="id"/>: its words, its glyph, and both in the danger colour where it is one.</summary>
    public MenuItem ToMenuItem(string id)
    {
        UIThemeColor? color = IsDanger ? UIThemeColor.Danger : null;

        return new MenuItem { Id = id, Title = Word, Icon = Glyph, TitleColor = color, IconColor = color };
    }
}
