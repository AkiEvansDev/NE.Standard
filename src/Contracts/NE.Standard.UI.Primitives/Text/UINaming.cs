using System;
using System.Text;

namespace NE.Standard.UI.Primitives.Text;

/// <summary>How a name written in code is read as words, for a caption an author did not write.</summary>
public static class UINaming
{
    /// <summary><c>InProgress</c> as "In progress": a capital inside the name starts a new word, lower-cased; a run of capitals stays as it is.</summary>
    public static string Humanize(string name)
    {
        ArgumentNullException.ThrowIfNull(name);

        StringBuilder words = new(name.Length + 4);

        for (var i = 0; i < name.Length; i++)
        {
            var current = name[i];

            if (i > 0 && char.IsUpper(current) && !char.IsUpper(name[i - 1]))
            {
                _ = words.Append(' ');
                _ = words.Append(char.ToLowerInvariant(current));
            }
            else
            {
                _ = words.Append(current);
            }
        }

        return words.ToString();
    }
}
