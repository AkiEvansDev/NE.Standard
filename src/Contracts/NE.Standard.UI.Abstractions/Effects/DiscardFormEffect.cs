using System;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Requests the UI client to discard a form's unsent edits: every <c>OnSubmit</c> field reverts to the value the server holds.
/// </summary>
public sealed class DiscardFormEffect : ClientEffect
{
    /// <summary>
    /// Creates an effect that discards the edits held by the form identified by <paramref name="formId"/>.
    /// </summary>
    public DiscardFormEffect(string formId)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(formId);
        FormId = formId;
    }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.DiscardForm;

    /// <summary>
    /// Gets the form id the fields share.
    /// </summary>
    public string FormId { get; }
}
