using NE.Standard.UI.Primitives.Localization;

namespace NE.Standard.UI.Extensions;

/// <summary>How large a person stands (<see cref="UIText.Person(string?, UIPhrase, UIPhrase?, UIPersonSize)"/>): one of two sizes.</summary>
public enum UIPersonSize
{
    /// <summary>A list's row, a byline: a 40 px picture.</summary>
    Medium,

    /// <summary>A dense row, a menu, a table's cell, a comment: a 32 px picture.</summary>
    Small,
}
