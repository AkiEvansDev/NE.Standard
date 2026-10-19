using System;
using System.Collections.Generic;
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

    /// <summary>An entry that opens a submenu of more actions, <paramref name="items"/>.</summary>
    public static MenuItem More(IEnumerable<MenuItem> items, string id = "more")
    {
        ArgumentNullException.ThrowIfNull(items);

        MenuItem more = More(id);

        foreach (MenuItem item in items)
            more.Items.Add(item);

        return more;
    }

    /// <summary>The entry that opens a submenu, its entries added later — a controller filling <c>Items</c> as it shapes a row's menu.</summary>
    public static MenuItem More(string id = "more")
        => Create(UIStandardAction.More, id);

    /// <summary>Load it afresh.</summary>
    public static MenuItem Refresh(string id = "refresh")
        => Create(UIStandardAction.Refresh, id);

    /// <summary>Search it.</summary>
    public static MenuItem Search(string id = "search")
        => Create(UIStandardAction.Search, id);

    /// <summary>Narrow what is shown.</summary>
    public static MenuItem Filter(string id = "filter")
        => Create(UIStandardAction.Filter, id);

    /// <summary>Open its settings.</summary>
    public static MenuItem Settings(string id = "settings")
        => Create(UIStandardAction.Settings, id);

    /// <summary>Share it.</summary>
    public static MenuItem Share(string id = "share")
        => Create(UIStandardAction.Share, id);

    /// <summary>Download it.</summary>
    public static MenuItem Download(string id = "download")
        => Create(UIStandardAction.Download, id);

    /// <summary>Upload a file.</summary>
    public static MenuItem Upload(string id = "upload")
        => Create(UIStandardAction.Upload, id);

    /// <summary>Rename it.</summary>
    public static MenuItem Rename(string id = "rename")
        => Create(UIStandardAction.Rename, id);

    /// <summary>Put one more in the list; <see cref="New"/> makes a new thing.</summary>
    public static MenuItem Add(string id = "add")
        => Create(UIStandardAction.Add, id);

    /// <summary>Take it out of the list, the thing itself kept; <see cref="Delete"/> destroys it.</summary>
    public static MenuItem Remove(string id = "remove")
        => Create(UIStandardAction.Remove, id);

    /// <summary>Send it: a composer's message, a form's answer.</summary>
    public static MenuItem Send(string id = "send")
        => Create(UIStandardAction.Send, id);

    /// <summary>Attach a file.</summary>
    public static MenuItem Attach(string id = "attach")
        => Create(UIStandardAction.Attach, id);

    /// <summary>Open the application's menu.</summary>
    public static MenuItem Menu(string id = "menu")
        => Create(UIStandardAction.Menu, id);

    /// <summary>Stop what is running.</summary>
    public static MenuItem Stop(string id = "stop")
        => Create(UIStandardAction.Stop, id);

    /// <summary>Undo the last change.</summary>
    public static MenuItem Undo(string id = "undo")
        => Create(UIStandardAction.Undo, id);

    /// <summary>Redo what was undone.</summary>
    public static MenuItem Redo(string id = "redo")
        => Create(UIStandardAction.Redo, id);

    /// <summary>Sign out.</summary>
    public static MenuItem SignOut(string id = "sign-out")
        => Create(UIStandardAction.SignOut, id);

    private static MenuItem Create(UIStandardAction action, string id)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(id);

        return action.ToMenuItem(id);
    }
}
