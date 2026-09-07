namespace NE.Standard.UI.Web.Abstractions.Rendering;

/// <summary>
/// The value readers the client registers by kind (<c>value-readers.ts</c>); a renderer names one in
/// <see cref="WebAttributes.ValueKind"/> beside a two-way binding whose value is not a native field's.
/// </summary>
public static class WebValueKinds
{
    /// <summary>A flyout's open state, read off its root.</summary>
    public const string FlyoutOpen = "flyout-open";

    /// <summary>A tab strip's selected key, read off its root.</summary>
    public const string TabsSelected = "tabs-selected";

    /// <summary>A tab's order, read off the tab's root.</summary>
    public const string TabOrder = "tab-order";

    /// <summary>A tab's caption as renamed, read off its label.</summary>
    public const string TabCaption = "tab-caption";

    /// <summary>A tree node's title as a rename wrote it, on the node's root.</summary>
    public const string TreeTitle = "tree-title";

    /// <summary>The key a tree node was dropped on, on the node's text.</summary>
    public const string TreeDropTarget = "tree-drop-target";

    /// <summary>An items view's one selected key, read off its root.</summary>
    public const string SelectedKey = "selected-key";

    /// <summary>An items view's selected keys, read off its items host as JSON.</summary>
    public const string SelectedKeys = "selected-keys";

    /// <summary>An items component's viewer-set query, read off its query element as JSON.</summary>
    public const string ItemsQuery = "items-query";

    /// <summary>The checked radio under a radio group's root.</summary>
    public const string CheckedRadio = "checked-radio";
}
