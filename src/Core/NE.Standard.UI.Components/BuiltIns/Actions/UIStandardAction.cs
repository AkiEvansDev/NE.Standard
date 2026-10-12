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
    // The shell's UIStrings.Action* keys, spelt here because the components cannot reach the shell. The pin's offer is the outlined
    // pin, the unpin's the struck one; Cancel wears the ×; Done ends an
    // edit made in place with a check, where Save writes a document out under its disk.
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

    /// <summary>The action as a menu's entry under <paramref name="id"/>: its words, its glyph, and both in the danger colour where it is one.</summary>
    public MenuItem ToMenuItem(string id)
    {
        UIThemeColor? color = IsDanger ? UIThemeColor.Danger : null;

        return new MenuItem { Id = id, Title = Word, Icon = Glyph, TitleColor = color, IconColor = color };
    }
}
