using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Globalization;

namespace NE.Standard.UI.Primitives.Interaction;

/// <summary>
/// An authored key chord (<c>Ctrl+Shift+P</c>) as the page reads it: the physical key and the modifiers. The Web client's twin is
/// <c>keyboard-shortcut.ts</c>, whose names this mirrors, so a chord refused at compile time would name no key on any platform host.
/// </summary>
/// <param name="Code">Normalized physical key code (such as <c>KeyS</c>, <c>Digit1</c>, <c>Enter</c>, or <c>F2</c>).</param>
/// <param name="Ctrl">Whether the Control modifier is required.</param>
/// <param name="Shift">Whether the Shift modifier is required.</param>
/// <param name="Alt">Whether the Alt/Option modifier is required.</param>
/// <param name="Meta">Whether the Meta/Command/Windows modifier is required.</param>
public readonly record struct UIKeyChord(string Code, bool Ctrl, bool Shift, bool Alt, bool Meta)
{
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

    /// <summary>The canonical form two authored chords are compared by, so <c>ctrl+s</c> and <c>Ctrl+S</c> match as one claim.</summary>
    public string Key
        => string.Concat(Ctrl ? "ctrl+" : string.Empty, Shift ? "shift+" : string.Empty, Alt ? "alt+" : string.Empty, Meta ? "meta+" : string.Empty, Code);

    /// <summary>Whether browsers reserve this chord and never hand it to a web page.</summary>
    public bool IsReservedByBrowser
    {
        get
        {
            if (Alt)
                return !Ctrl && !Shift && !Meta && Code == "F4";

            if (Ctrl == Meta)
                return false;

            return Shift
                ? Code is "KeyN" or "KeyT" or "KeyW" or "KeyQ" or "Tab"
                : Code is "KeyN" or "KeyT" or "KeyW" or "KeyQ" or "Tab" or "PageUp" or "PageDown" or "F4";
        }
    }

    /// <summary>Parses <paramref name="value"/> into a normalized <see cref="UIKeyChord"/>, or returns <see langword="false"/> when it names no key.</summary>
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
                    code = ResolveCode(part);
                    break;
            }
        }

        if (!any || code is null)
            return false;

        chord = new UIKeyChord(code, ctrl, shift, alt, meta);
        return true;
    }

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

        if (upper.Length <= 3 && upper[0] == 'F' && upper[1] is >= '1' and <= '9' && int.TryParse(upper.AsSpan(1), NumberStyles.None, CultureInfo.InvariantCulture, out var number) && number <= 24)
            return upper;

        return NamedCodes.GetValueOrDefault(name);
    }
}
