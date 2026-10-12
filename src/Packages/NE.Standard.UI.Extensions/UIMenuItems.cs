using System;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Models;

namespace NE.Standard.UI.Extensions;

/// <summary>
/// The entries menus share, named in the framework's own words and marked by its own glyphs (<see cref="UIStandardAction"/>), so one
/// screen's "Delete" reads as another's: prefer these to an entry written by hand. Each takes the id the menu's click reports, its own
/// name by default; Delete is drawn in the danger colour.
/// </summary>
public static class UIMenuItems
{
    /// <summary>Pin the thing the menu is about.</summary>
    public static MenuItem Pin(string id = "pin")
        => Create(UIStandardAction.Pin, id);

    /// <summary>Take its pin off.</summary>
    public static MenuItem Unpin(string id = "unpin")
        => Create(UIStandardAction.Unpin, id);

    /// <summary>Open it.</summary>
    public static MenuItem Open(string id = "open")
        => Create(UIStandardAction.Open, id);

    /// <summary>Edit it.</summary>
    public static MenuItem Edit(string id = "edit")
        => Create(UIStandardAction.Edit, id);

    /// <summary>Copy it.</summary>
    public static MenuItem Copy(string id = "copy")
        => Create(UIStandardAction.Copy, id);

    /// <summary>Save it.</summary>
    public static MenuItem Save(string id = "save")
        => Create(UIStandardAction.Save, id);

    /// <summary>End an edit made in place with a check; <see cref="Save"/> writes a document out.</summary>
    public static MenuItem Done(string id = "done")
        => Create(UIStandardAction.Done, id);

    /// <summary>Give up what is under way.</summary>
    public static MenuItem Cancel(string id = "cancel")
        => Create(UIStandardAction.Cancel, id);

    /// <summary>Close it.</summary>
    public static MenuItem Close(string id = "close")
        => Create(UIStandardAction.Close, id);

    /// <summary>Go back to where the page was reached from.</summary>
    public static MenuItem Back(string id = "back")
        => Create(UIStandardAction.Back, id);

    /// <summary>Make a new one.</summary>
    public static MenuItem New(string id = "new")
        => Create(UIStandardAction.New, id);

    /// <summary>Delete it: the danger colour on the words and the mark.</summary>
    public static MenuItem Delete(string id = "delete")
        => Create(UIStandardAction.Delete, id);

    private static MenuItem Create(UIStandardAction action, string id)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        return action.ToMenuItem(id);
    }
}
