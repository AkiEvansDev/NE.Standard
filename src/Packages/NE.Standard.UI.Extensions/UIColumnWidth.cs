namespace NE.Standard.UI.Extensions;

/// <summary>How wide a column of content stands (<see cref="UIPage.Column"/>): one of three, never a width of the page's own.</summary>
public enum UIColumnWidth
{
    /// <summary>A text read line after line, and a page of cards and fields: 720 px, about seventy characters of body text a line.</summary>
    Reading,

    /// <summary>A short form, a card alone on a page (<see cref="UICard.Centered"/>), a dialog's form: 440 px.</summary>
    Form,

    /// <summary>A form beside its summary, panes that should not run to a wide screen's edges: 1080 px.</summary>
    Wide,
}
