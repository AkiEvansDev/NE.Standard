namespace NE.Standard.UI.Abstractions.Styling.Theme;

/// <summary>The colour a theme draws one kind of mark in: the keyboard's frame, a field's focused edge or a selection's line.</summary>
public enum UIMarkTone
{
    /// <summary>The brand's colour: the primary, or its ink where the mark is read as words are.</summary>
    Brand,

    /// <summary>The mode's text colour: near-white on a dark page, near-black on a light one.</summary>
    Neutral
}
