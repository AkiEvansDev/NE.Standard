using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;

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
    public override string Kind => ClientEffectKinds.CloseDialog;

    /// <summary>
    /// Gets the dialog key.
    /// </summary>
    public string DialogKey { get; }

    /// <summary>
    /// Gets whether the close is the viewer's own — an × in the dialog — raising the dialog's <c>OnClose</c> as Escape and the
    /// backdrop do; a close the server asks for raises nothing.
    /// </summary>
    public bool RaisesClose { get; init; }

    /// <summary>
    /// A close of the viewer's own is a gesture complete on the page, as Escape is, so an interaction may raise it; one the server asks
    /// for goes from a command.
    /// </summary>
    [JsonIgnore]
    public override bool CanRunInInteraction => RaisesClose;

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);

        resolver.EnsureDialogDeclared(DialogKey);
        return this;
    }
}
