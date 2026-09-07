namespace NE.Standard.UI.Hosting;

/// <summary>
/// What one runtime belongs to: a client, an address, and — unless the lifetime shares it — a window.
/// </summary>
internal readonly record struct UIRuntimeKey(
    string SessionId,
    string Route,
    string? Identity,
    string? WindowId
);
