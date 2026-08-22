namespace NE.Standard.UI.Hosting;

internal readonly record struct UIRuntimeKey(
    string SessionId,
    string Route,
    string? ClientTabId,
    string? InstanceId
);
