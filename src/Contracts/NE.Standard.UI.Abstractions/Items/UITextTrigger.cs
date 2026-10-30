using System;
using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Items;

/// <summary>
/// A character prefix (such as <c>@</c> or <c>/</c>) that opens a text field's suggestion popup while typing.
/// </summary>
public sealed record UITextTrigger
{
    /// <summary>
    /// Creates a text trigger from its prefix, whether it only opens at the start of a line, and whether typing it immediately queries
    /// the server (<c>OnTriggerSearch</c>).
    /// </summary>
    public UITextTrigger(string prefix, bool startOfLineOnly = false, bool loadsFromServer = false)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(prefix);

        for (var i = 0; i < prefix.Length; i++)
        {
            if (char.IsWhiteSpace(prefix[i]))
                throw new ArgumentException("A text trigger prefix cannot contain whitespace.", nameof(prefix));
        }

        Prefix = prefix;
        StartOfLineOnly = startOfLineOnly;
        LoadsFromServer = loadsFromServer;
    }

    /// <summary>
    /// Gets the non-whitespace character sequence (such as <c>@</c> or <c>/</c>) that opens the suggestion popup.
    /// </summary>
    public string Prefix { get; }

    /// <summary>
    /// Gets whether the trigger opens only at the start of the text or immediately after a line break, rather than after any whitespace.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool StartOfLineOnly { get; init; }

    /// <summary>
    /// Gets whether opening or typing under this trigger queries the server (<c>OnTriggerSearch</c>) at the root level.
    /// </summary>
    [JsonIgnore(Condition = JsonIgnoreCondition.WhenWritingDefault)]
    public bool LoadsFromServer { get; init; }
}
