using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// Defines client effect kinds.
/// </summary>
public enum ClientEffectKind
{
    Navigate = 0,
    Focus = 1,
    ScrollTo = 2,
    Show = 3,
    Hide = 4,
    OpenDialog = 5,
    CloseDialog = 6,
    ShowNotification = 7,
    DownloadFile = 8,
    Scroll = 9
}

/// <summary>
/// Base type for effects that should be executed by the UI client after a command completes.
/// </summary>
[JsonConverter(typeof(ClientEffectJsonConverter))]
public abstract class ClientEffect
{
    /// <summary>
    /// Gets the client effect kind.
    /// </summary>
    public abstract ClientEffectKind Kind { get; }

    /// <summary>
    /// Resolves authoring-time references used by this effect to runtime addresses.
    /// </summary>
    public virtual ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);
        return this;
    }
}
