using System;
using NE.Standard.UI.Primitives.Items;

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>
/// The two mutually exclusive host modes, factored out here since the hosts that offer <c>Virtualized()</c> and
/// <c>BindSource(...)</c> share no base to hold this.
/// </summary>
internal static class ItemsHostModes
{
    /// <summary>The mode after <c>Virtualized()</c>: refused on a windowed host, which already keeps only its window.</summary>
    public static UIItemsHostMode Virtualize(UIItemsHostMode current)
    {
        if (current == UIItemsHostMode.Windowed)
            throw new InvalidOperationException("A windowed host already keeps only its window; it cannot be virtualized as well.");

        return UIItemsHostMode.Virtualized;
    }

    /// <summary>The mode after <c>BindSource(...)</c>: refused on a virtualized host, which holds its collection whole.</summary>
    public static UIItemsHostMode Window(UIItemsHostMode current)
    {
        if (current == UIItemsHostMode.Virtualized)
            throw new InvalidOperationException("A virtualized host holds its collection whole; a source hands over one window at a time instead.");

        return UIItemsHostMode.Windowed;
    }
}
