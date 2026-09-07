using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// The effect kinds this framework ships; a kind is an open string, so a package can register its own.
/// </summary>
/// <remarks>
/// Prefix a package's own kinds (e.g. <c>"acme.confetti"</c>) so they cannot collide with another package's.
/// </remarks>
public static class ClientEffectKinds
{
    public const string Navigate = "Navigate";
    public const string Focus = "Focus";
    public const string ScrollTo = "ScrollTo";
    public const string Show = "Show";
    public const string Hide = "Hide";
    public const string Collapse = "Collapse";
    public const string OpenDialog = "OpenDialog";
    public const string CloseDialog = "CloseDialog";
    public const string ShowNotification = "ShowNotification";
    public const string DownloadFile = "DownloadFile";
    public const string Scroll = "Scroll";
    public const string SetTheme = "SetTheme";
    public const string RenameTab = "RenameTab";
    public const string RenameNode = "RenameNode";
    public const string CopyToClipboard = "CopyToClipboard";
}

/// <summary>
/// Base type for effects that should be executed by the UI client after a command completes.
/// </summary>
/// <remarks>
/// A platform runs the kinds it implements and ignores the rest with a log line; a kind is a request, not a guarantee.
/// </remarks>
[JsonConverter(typeof(ClientEffectJsonConverter))]
public abstract class ClientEffect
{
    /// <summary>
    /// Gets the client effect kind — see <see cref="ClientEffectKinds"/> for the built-in names and for how
    /// a package names its own.
    /// </summary>
    public abstract string Kind { get; }

    /// <summary>
    /// Whether a <c>UIInteraction</c> may raise this effect on its own, with no command behind it.
    /// </summary>
    /// <remarks>
    /// True only for an effect that completes entirely on the client, with no round trip behind it.
    /// </remarks>
    public virtual bool CanRunInInteraction => false;

    /// <summary>
    /// Resolves authoring-time references used by this effect to runtime addresses.
    /// </summary>
    public virtual ClientEffect Resolve(IUIReferenceResolver resolver)
    {
        ArgumentNullException.ThrowIfNull(resolver);
        return this;
    }
}
