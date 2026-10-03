using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.Foundation;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Items;

namespace NE.Standard.UI.Components.BuiltIns.Items;

/// <summary>
/// The pages of a paged list: aimed at an items view or a table whose window is a page (<c>BindSource</c> and <c>SetPaging(true)</c>),
/// it shows where that window stands in its source and asks the source for another page by offset, as the host's own window
/// request does.
/// </summary>
/// <remarks>
/// The page is the source's: every window it reads names its offset (<c>UIItemWindowRequest.Offset</c>, then <c>Offset</c>). An
/// application that wants the page in its address writes it from there — <c>Context.SendEffectsAsync</c> with a
/// <c>ReplaceAddressEffect</c> when the source's <c>Offset</c> changes — and reads it back in <c>OnNavigatedAsync</c>, loading the
/// window at that page's offset before the page draws.
/// </remarks>
public abstract partial class PagerComponent<T>(string? id = null) : VisualComponentBase<T>(id)
    where T : PagerComponent<T>, IUIComponentDefinition
{
    /// <summary>
    /// Gets or sets the id of the items view or table whose pages the pager turns; it must be windowed and page, which the view checks
    /// when it compiles.
    /// </summary>
    /// <remarks>Render-time only: the host is looked up in the same view as the page is drawn.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    public string? Target { get; set; }

    /// <summary>
    /// Gets or sets what the pager shows: the pages by number (<see cref="UIPagerMode.Full"/>) or the rows the page holds
    /// (<see cref="UIPagerMode.Compact"/>); on a phone it is compact either way.
    /// </summary>
    [UIComponentProperty(DefaultValue = UIPagerMode.Full)]
    public UIPagerMode? Mode { get; set; }

    /// <summary>
    /// Gets or sets the page sizes the viewer may choose from, in rows; unset, the pager offers no choice and a page is the host's
    /// <c>WindowSize</c>. The viewer's choice is kept in the browser under the target's id; a size no longer offered is ignored.
    /// </summary>
    /// <remarks>Render-time only.</remarks>
    [UIComponentProperty(IsBindable = false, DefaultValue = null)]
    public IReadOnlyList<int>? PageSizes { get; set; }
}

/// <summary>
/// The pages of a paged items view or table.
/// </summary>
public sealed class PagerComponent(string? id = null) : PagerComponent<PagerComponent>(id), IUIComponentDefinition
{
    /// <inheritdoc/>
    public static string ComponentTypeKey => "standard.pager";
}
