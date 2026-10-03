using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Interaction;

namespace NE.Standard.UI.Authoring.Views;

/// <summary>
/// A key chord of the view's own (<c>UIViewBase.CreateShortcuts</c>): it runs a command, or an effect on the page with no round trip.
/// </summary>
/// <remarks>
/// The chord is written as a control's is, <c>Ctrl+S</c> or <c>/</c>, and answers the page's rules for one: an unmodified key typed into
/// a field is the field's, and an open modal dialog keeps it out of reach.
/// </remarks>
public sealed class UIShortcut
{
    /// <summary>
    /// A chord that runs a controller's command.
    /// </summary>
    public UIShortcut(string chord, string command, params KeyValuePair<string, UIActionArgument>[] arguments)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(chord);
        ArgumentException.ThrowIfNullOrWhiteSpace(command);
        ArgumentNullException.ThrowIfNull(arguments);

        Chord = chord;
        Action = new UIAction(command, arguments.Length == 0 ? null : new Dictionary<string, UIActionArgument>(arguments, StringComparer.Ordinal));
    }

    /// <summary>
    /// A chord that runs an effect on the page, as an interaction does: <c>/</c> focusing the search.
    /// </summary>
    public UIShortcut(string chord, ClientEffect effect)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(chord);
        ArgumentNullException.ThrowIfNull(effect);

        Chord = chord;
        Effect = effect;
    }

    /// <summary>
    /// Gets the chord, as authored.
    /// </summary>
    public string Chord { get; }

    /// <summary>
    /// Gets the command the chord runs, or <see langword="null"/> for an effect.
    /// </summary>
    public UIAction? Action { get; }

    /// <summary>
    /// Gets the effect the chord runs, or <see langword="null"/> for a command.
    /// </summary>
    public ClientEffect? Effect { get; }
}
