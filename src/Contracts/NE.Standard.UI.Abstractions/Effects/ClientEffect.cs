using System;
using System.Text.Json.Serialization;
using NE.Standard.UI.Abstractions.Binding.Addresses;

namespace NE.Standard.UI.Abstractions.Effects;

/// <summary>
/// The effect kinds this framework ships; a kind is an open string, so a package may register its own, prefixed
/// (e.g. <c>"acme.confetti"</c>) to avoid collisions.
/// </summary>
public static class ClientEffectKinds
{
    public const string Navigate = "Navigate";
    public const string Focus = "Focus";
    public const string ScrollTo = "ScrollTo";
    public const string ScrollToItem = "ScrollToItem";
    public const string Show = "Show";
    public const string Hide = "Hide";
    public const string Collapse = "Collapse";
    public const string OpenDialog = "OpenDialog";
    public const string CloseDialog = "CloseDialog";
    public const string ShowNotification = "ShowNotification";
    public const string Announce = "Announce";
    public const string DownloadFile = "DownloadFile";
    public const string Scroll = "Scroll";
    public const string SetTheme = "SetTheme";
    public const string SetThemeColors = "SetThemeColors";
    public const string SetLanguage = "SetLanguage";
    public const string RenameTab = "RenameTab";
    public const string RenameNode = "RenameNode";
    public const string CopyToClipboard = "CopyToClipboard";
    public const string InsertText = "InsertText";
    public const string DiscardForm = "DiscardForm";
    public const string OpenPicker = "OpenPicker";
    public const string ConfirmLeave = "ConfirmLeave";
    public const string ReplaceAddress = "ReplaceAddress";
    public const string PushAddress = "PushAddress";
    public const string RequestNotificationPermission = "RequestNotificationPermission";
    public const string ShowSystemNotification = "ShowSystemNotification";
}

/// <summary>
/// Base type for effects the UI client runs after a command; a platform ignores kinds it doesn't implement, since a kind
/// is a request, not a guarantee.
/// </summary>
[JsonConverter(typeof(ClientEffectJsonConverter))]
public abstract class ClientEffect
{
    /// <summary>
    /// Gets the client effect kind — see <see cref="ClientEffectKinds"/> for the built-in names and for how
    /// a package names its own.
    /// </summary>
    public abstract string Kind { get; }

    /// <summary>
    /// Whether a <c>UIInteraction</c> may raise this effect on its own, with no command or round trip behind it.
    /// </summary>
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
