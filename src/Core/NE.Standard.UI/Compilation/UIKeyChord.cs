using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Globalization;

namespace NE.Standard.UI.Compilation;

/// <summary>
/// An authored key chord (<c>Ctrl+Shift+P</c>) as the page reads it: the physical key and the modifiers. The client's twin is
/// <c>keyboard-shortcut.ts</c>, whose names this mirrors, so a chord refused here would name no key there either.
/// </summary>
internal readonly record struct UIKeyChord(string Code, bool Ctrl, bool Shift, bool Alt, bool Meta)
{
    // Case-blind past the first letter, as the client folds a name to one capital before it looks it up.
    private static readonly FrozenDictionary<string, string> NamedCodes = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
    {
        [","] = "Comma",
        ["."] = "Period",
        ["/"] = "Slash",
        ["\\"] = "Backslash",
        [";"] = "Semicolon",
        ["'"] = "Quote",
        ["["] = "BracketLeft",
        ["]"] = "BracketRight",
        ["-"] = "Minus",
        ["="] = "Equal",
        ["`"] = "Backquote",
        ["Delete"] = "Delete",
        ["Backspace"] = "Backspace",
        ["Enter"] = "Enter",
        ["Escape"] = "Escape",
        ["Esc"] = "Escape",
        ["Space"] = "Space",
        ["Tab"] = "Tab",
        ["Insert"] = "Insert",
        ["Home"] = "Home",
        ["End"] = "End",
        ["PageUp"] = "PageUp",
        ["PageDown"] = "PageDown",
        ["Up"] = "ArrowUp",
        ["Down"] = "ArrowDown",
        ["Left"] = "ArrowLeft",
        ["Right"] = "ArrowRight",
        ["ArrowUp"] = "ArrowUp",
        ["ArrowDown"] = "ArrowDown",
        ["ArrowLeft"] = "ArrowLeft",
        ["ArrowRight"] = "ArrowRight"
    }.ToFrozenDictionary(StringComparer.OrdinalIgnoreCase);

    /// <summary>The form two authored chords are compared by, so <c>ctrl+s</c> and <c>Ctrl+S</c> are one claim.</summary>
    public string Key
        => string.Concat(Ctrl ? "ctrl+" : string.Empty, Shift ? "shift+" : string.Empty, Alt ? "alt+" : string.Empty, Meta ? "meta+" : string.Empty, Code);

    /// <summary>
    /// Whether the browser keeps the chord for itself and never hands it to a page: a new, closed or restored tab or window, the next
    /// or previous tab, quitting. Ctrl stands for ⌘ on macOS, as the page matches it, so ⌘Q counts.
    /// </summary>
    public bool IsReservedByBrowser
    {
        get
        {
            if (Alt)
                return !Ctrl && !Shift && !Meta && Code == "F4";

            // One command modifier, Ctrl or ⌘, never both.
            if (Ctrl == Meta)
                return false;

            return Shift
                ? Code is "KeyN" or "KeyT" or "KeyW" or "KeyQ" or "Tab"
                : Code is "KeyN" or "KeyT" or "KeyW" or "KeyQ" or "Tab" or "PageUp" or "PageDown" or "F4";
        }
    }

    /// <summary>The chord an authored string describes, or false when it names no key.</summary>
    public static bool TryParse(string? value, out UIKeyChord chord)
    {
        chord = default;

        var ctrl = false;
        var shift = false;
        var alt = false;
        var meta = false;
        string? code = null;
        var any = false;

        foreach (var raw in (value ?? string.Empty).Split('+'))
        {
            var part = raw.Trim();

            if (part.Length == 0)
                continue;

            any = true;

            switch (part.ToUpperInvariant())
            {
                case "CTRL":
                case "CONTROL":
                    ctrl = true;
                    break;
                case "SHIFT":
                    shift = true;
                    break;
                case "ALT":
                case "OPTION":
                    alt = true;
                    break;
                case "META":
                case "CMD":
                case "COMMAND":
                case "WIN":
                    meta = true;
                    break;
                default:
                    // The last key wins, as the client reads it, so a malformed "S+Ctrl" still names S.
                    code = ResolveCode(part);
                    break;
            }
        }

        if (!any || code is null)
            return false;

        chord = new UIKeyChord(code, ctrl, shift, alt, meta);
        return true;
    }

    /// <summary>A key name as authored, mapped to the physical code the browser reports for it.</summary>
    private static string? ResolveCode(string name)
    {
        if (name.Length == 1)
        {
            var character = char.ToUpperInvariant(name[0]);

            if (character is >= 'A' and <= 'Z')
                return "Key" + character;

            if (character is >= '0' and <= '9')
                return "Digit" + character;

            return NamedCodes.GetValueOrDefault(name);
        }

        var upper = name.ToUpperInvariant();

        // F1 to F24, never a leading zero.
        if (upper.Length <= 3 && upper[0] == 'F' && upper[1] is >= '1' and <= '9' && int.TryParse(upper.AsSpan(1), NumberStyles.None, CultureInfo.InvariantCulture, out var number) && number <= 24)
            return upper;

        return NamedCodes.GetValueOrDefault(name);
    }
}
