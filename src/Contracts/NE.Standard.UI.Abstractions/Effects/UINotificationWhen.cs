using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>When a <see cref="ShowSystemNotificationEffect"/> shows as the system's notification rather than its fallback.</summary>
[JsonConverter(typeof(JsonStringEnumConverter<UINotificationWhen>))]
public enum UINotificationWhen
{
    /// <summary>Only while the page is off screen — another tab, a minimised window: a reader looking at it gets the fallback.</summary>
    WhenHidden,

    /// <summary>Whether or not the page is on screen.</summary>
    Always
}
