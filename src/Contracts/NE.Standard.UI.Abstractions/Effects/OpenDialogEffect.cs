using System;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to open a dialog.
/// </summary>
public sealed class OpenDialogEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that opens the dialog identified by <paramref name="dialogKey"/>.
    /// </summary>
    public OpenDialogEffect(string dialogKey)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(dialogKey);

        DialogKey = dialogKey;
    }

    /// <inheritdoc />
    public override ClientEffectKind Kind => ClientEffectKind.OpenDialog;

    /// <summary>
    /// Gets the dialog key.
    /// </summary>
    public string DialogKey { get; }
}
