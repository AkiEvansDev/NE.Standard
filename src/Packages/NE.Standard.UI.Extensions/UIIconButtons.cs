using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Primitives.Styling;

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

    /// <summary>End an edit made in place — a message's words, a cell, a title — with a check; <see cref="Save"/> writes a document out.</summary>
    public static ButtonComponent Done()
        => Create(UIStandardAction.Done);

    /// <summary>Give up what is under way.</summary>
    public static ButtonComponent Cancel()
        => Create(UIStandardAction.Cancel);

    /// <summary>Close it.</summary>
    public static ButtonComponent Close()
        => Create(UIStandardAction.Close);

    /// <summary>
    /// Go back to where the page was reached from: give it <c>.InteractOn(EventNames.Click, new NavigateBackEffect(fallback))</c> for
    /// the browser's Back, or a command of its own where back means a place of the application's.
    /// </summary>
    public static ButtonComponent Back()
        => Create(UIStandardAction.Back);

    /// <summary>Make a new one.</summary>
    public static ButtonComponent New()
        => Create(UIStandardAction.New);

    /// <summary>Delete it: the glyph in the danger colour.</summary>
    public static ButtonComponent Delete()
        => Create(UIStandardAction.Delete);

    /// <summary>
    /// The ⋮ that opens more actions: a menu button with no chevron, its entries <paramref name="items"/> — the standard ones
    /// (<see cref="UIMenuItems"/>) where they fit; give it <c>.OnItemClickWithItemKey(command)</c> for the entry's id.
    /// </summary>
    public static SplitButtonComponent More(IEnumerable<MenuItem> items)
        => new SplitButtonComponent()
            .SetMode(UISplitButtonMode.Menu)
            .SetShowChevron(false)
            .SetType(UIButtonType.Ghost)
            .SetIcon(UIStandardAction.More.Glyph)
            .SetTooltip(UIStandardAction.More.Word)
            .SetItems(items);

    /// <summary>Load it afresh.</summary>
    public static ButtonComponent Refresh()
        => Create(UIStandardAction.Refresh);

    /// <summary>Search it: the button that opens a search, where a field is not shown.</summary>
    public static ButtonComponent Search()
        => Create(UIStandardAction.Search);

    /// <summary>Narrow what is shown.</summary>
    public static ButtonComponent Filter()
        => Create(UIStandardAction.Filter);

    /// <summary>Open its settings.</summary>
    public static ButtonComponent Settings()
        => Create(UIStandardAction.Settings);

    /// <summary>Share it.</summary>
    public static ButtonComponent Share()
        => Create(UIStandardAction.Share);

    /// <summary>Download it.</summary>
    public static ButtonComponent Download()
        => Create(UIStandardAction.Download);

    /// <summary>Upload a file.</summary>
    public static ButtonComponent Upload()
        => Create(UIStandardAction.Upload);

    /// <summary>Rename it.</summary>
    public static ButtonComponent Rename()
        => Create(UIStandardAction.Rename);

    /// <summary>Put one more in the list; <see cref="New"/> makes a new thing.</summary>
    public static ButtonComponent Add()
        => Create(UIStandardAction.Add);

    /// <summary>Take it out of the list, the thing itself kept; <see cref="Delete"/> destroys it.</summary>
    public static ButtonComponent Remove()
        => Create(UIStandardAction.Remove);

    /// <summary>Send it: a composer's message, a form's answer.</summary>
    public static ButtonComponent Send()
        => Create(UIStandardAction.Send);

    /// <summary>Attach a file: give it <c>.InteractOn(EventNames.Click, new OpenPickerEffect(shelfId))</c> for an image input's picker.</summary>
    public static ButtonComponent Attach()
        => Create(UIStandardAction.Attach);

    /// <summary>Open the application's menu: give it <c>.SetOpensDrawer(side)</c> for a side drawer.</summary>
    public static ButtonComponent Menu()
        => Create(UIStandardAction.Menu);

    /// <summary>Stop what is running.</summary>
    public static ButtonComponent Stop()
        => Create(UIStandardAction.Stop);

    /// <summary>Undo the last change.</summary>
    public static ButtonComponent Undo()
        => Create(UIStandardAction.Undo);

    /// <summary>Redo what was undone.</summary>
    public static ButtonComponent Redo()
        => Create(UIStandardAction.Redo);

    /// <summary>Sign out.</summary>
    public static ButtonComponent SignOut()
        => Create(UIStandardAction.SignOut);

    private static ButtonComponent Create(UIStandardAction action)
    {
        ButtonComponent button = UIButtons.Icon(action.Glyph, action.Word);

        return action.IsDanger ? button.SetIconColor(UIThemeColor.Danger) : button;
    }
}
