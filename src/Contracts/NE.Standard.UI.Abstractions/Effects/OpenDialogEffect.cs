using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;

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
    public override string Kind => ClientEffectKinds.OpenDialog;

    /// <summary>
    /// Gets the dialog key.
    /// </summary>
    public string DialogKey { get; }

    /// <summary>
    /// An opening is complete on the page — the server keeps no open state — so an interaction may raise it; a dialog the controller
    /// fills first opens from the command that fills it.
    /// </summary>
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);

        resolver.EnsureDialogDeclared(DialogKey);
        return this;
    }
}
