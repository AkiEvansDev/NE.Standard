namespace NE.Standard.UI.Primitives.Styling;

/// <summary>
/// What a multi-select is drawn as.
/// </summary>
public enum UIMultiSelectVariant
{
    /// <summary>
    /// A field holding a chip per chosen option, each with its remove, over a list that marks the chosen ones with a check and stays
    /// open while options are toggled.
    /// </summary>
    Chips = 0,

    /// <summary>
    /// The chips' field and list with each option a badge — a ticket's labels, a contact's tags — chosen into the field as the badge
    /// itself, its remove inside it.
    /// </summary>
    /// <remarks>
    /// An option is its badge: its <c>BadgeTitle</c> the words, its style, colour, fill and icon the look, a <c>Description</c> under it
    /// what it means — the shape a <c>BadgeItem</c> gives a row of badges to read. The list draws each badge at the start of its row,
    /// and the field each chosen one with its remove inside it; in the field, an option with no badge words stands as a badge of its
    /// title. Leave <c>Title</c> unset where the badge is the option's name: a title stands before the badge on its row, so the same
    /// words would read twice. It is for an option whose badge is not its name — a priority's <c>P1</c> badge before "Critical".
    /// </remarks>
    Badges = 1,

    /// <summary>
    /// Every option standing in the field as a checkbox, with no list and no chips: the value is the checked keys. Takes no free
    /// text; past <c>MaxSelected</c> the unchecked boxes are off.
    /// </summary>
    Checkboxes = 2
}
