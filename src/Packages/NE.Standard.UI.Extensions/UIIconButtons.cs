using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// The standard actions as icon-only buttons, the same names and glyphs as <see cref="UIMenuItems"/> (<see cref="UIStandardAction"/>):
/// a ghost button whose tooltip, in the framework's own words, is its name. Prefer these to an icon button written by hand; Delete's
/// glyph is in the danger colour.
/// </summary>
public static class UIIconButtons
{
    /// <summary>Pin the thing the button stands by.</summary>
    public static ButtonComponent Pin()
        => Create(UIStandardAction.Pin);

    /// <summary>Take its pin off.</summary>
    public static ButtonComponent Unpin()
        => Create(UIStandardAction.Unpin);

    /// <summary>Open it.</summary>
    public static ButtonComponent Open()
        => Create(UIStandardAction.Open);

    /// <summary>Edit it.</summary>
    public static ButtonComponent Edit()
        => Create(UIStandardAction.Edit);

    /// <summary>Copy it.</summary>
    public static ButtonComponent Copy()
        => Create(UIStandardAction.Copy);

    /// <summary>Save it.</summary>
    public static ButtonComponent Save()
        => Create(UIStandardAction.Save);

    /// <summary>Give up what is under way.</summary>
    public static ButtonComponent Cancel()
        => Create(UIStandardAction.Cancel);

    /// <summary>Close it.</summary>
    public static ButtonComponent Close()
        => Create(UIStandardAction.Close);

    /// <summary>Delete it: the glyph in the danger colour.</summary>
    public static ButtonComponent Delete()
        => Create(UIStandardAction.Delete);

    private static ButtonComponent Create(UIStandardAction action)
    {
        ButtonComponent button = UIButtons.Icon(action.Glyph, action.Word);

        return action.IsDanger ? button.SetIconColor(UIThemeColor.Danger) : button;
    }
}
