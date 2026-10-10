using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Opens the file chooser of a file or image input from elsewhere — a composer's clip opening its attachments' shelf.
/// </summary>
/// <remarks>
/// A browser opens a chooser only inside the reader's own gesture: raised by an interaction (<c>InteractOn("click", …)</c>) it
/// runs in the press itself; returned from a command it runs after the round trip, which a browser may refuse to honour.
/// </remarks>
public sealed class OpenPickerEffect(UIComponentReference target) : TargetedClientEffect(target)
{
    /// <summary>
    /// Creates an effect that opens the chooser of the input identified by <paramref name="targetComponentId"/>.
    /// </summary>
    public OpenPickerEffect(string targetComponentId, params object?[]? dynamicParameters)
        : this(new UIComponentReference(targetComponentId, dynamicParameters))
    { }

    /// <inheritdoc />
    public override string Kind => ClientEffectKinds.OpenPicker;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;

    /// <inheritdoc />
    public override ClientEffect Resolve(IUIReferenceResolver resolver)
        => new CompiledOpenPickerEffect(resolver.ResolveComponent(Target));
}

internal sealed class CompiledOpenPickerEffect(UIComponentAddress target) : CompiledTargetedClientEffect(target)
{
    public override string Kind => ClientEffectKinds.OpenPicker;

    /// <inheritdoc />
    [JsonIgnore]
    public override bool CanRunInInteraction => true;
}
