namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// Defines below which width a view's sides leave the page's columns and slide over the content as drawers, each opened by a button.
/// </summary>
public enum UISideDrawers
{
    /// <summary>Below the medium breakpoint: a phone's drawers, a tablet's and a desktop's columns.</summary>
    BelowMd = 0,

    /// <summary>Below the extra-large breakpoint: a tablet held either way keeps the content's whole width too.</summary>
    BelowXl = 1,

    /// <summary>Below the extra-extra-large breakpoint.</summary>
    BelowXxl = 2,

    /// <summary>At every width: the sides are drawers on the widest screen too, unless the reader pins one.</summary>
    Always = 3,

    /// <summary>At no width: the sides keep their columns on a phone too.</summary>
    Never = 4,
}
