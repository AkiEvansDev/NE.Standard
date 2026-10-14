namespace NE.Standard.UI.Extensions;

/// <summary>How large a header band stands (<see cref="UIPage.Header(UIHeaderSize, NE.Standard.UI.Authoring.Components.IVisualComponent?, string, string?, NE.Standard.UI.Authoring.Components.IVisualComponent[])"/>).</summary>
public enum UIHeaderSize
{
    /// <summary>A page's title band: the name in the display role from the medium width, on the content's edge.</summary>
    Page,

    /// <summary>A pane's title row beside a list or a tree: the name in the subtitle role at every width, on the pane's own padding.</summary>
    Pane,

    /// <summary>A panel's caption over the list or the tree in it: the name in the label role, set in as the rows under it are.</summary>
    Strip,
}
