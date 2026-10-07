using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>What a <see cref="ShowSystemNotificationEffect"/> shows where it does not show as the system's notification.</summary>
[JsonConverter(typeof(JsonStringEnumConverter<UINotificationFallback>))]
public enum UINotificationFallback
{
    /// <summary>The page's own toast, its title over its body; one raised off screen waits until the page is shown.</summary>
    Toast,

    /// <summary>Nothing.</summary>
    None
}
