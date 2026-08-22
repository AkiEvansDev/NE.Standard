using System;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to close a dialog.
/// </summary>
public sealed class CloseDialogEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that closes the dialog identified by <paramref name="dialogKey"/>.
    /// </summary>
    public CloseDialogEffect(string dialogKey)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(dialogKey);
        DialogKey = dialogKey;
    }

    /// <inheritdoc />
    public override ClientEffectKind Kind => ClientEffectKind.CloseDialog;

    /// <summary>
    /// Gets the dialog key.
    /// </summary>
    public string DialogKey { get; }
}
