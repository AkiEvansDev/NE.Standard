using System;
using NE.Standard.UI.Primitives.Security;

namespace NE.Standard.UI.Primitives.Annotations;

/// <summary>
/// Defines role and permission requirements for a UI controller or command.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
public sealed class UIAuthorizeAttribute : Attribute
{
    /// <summary>
    /// Initializes the attribute with no role or permission requirements.
    /// </summary>
    public UIAuthorizeAttribute() { }

    /// <summary>
    /// Initializes the attribute with a comma-separated list of required roles.
    /// </summary>
    public UIAuthorizeAttribute(string roles)
    {
        Roles = roles;
    }

    /// <summary>
    /// Gets the comma-separated list of required roles.
    /// </summary>
    public string? Roles { get; }

    /// <summary>
    /// Gets or sets the comma-separated list of required permissions.
    /// </summary>
    public string? Permissions { get; init; }

    /// <summary>
    /// Gets or sets how role requirements are evaluated.
    /// </summary>
    public UIAccessMode RolesMode { get; init; } = UIAccessMode.Any;

    /// <summary>
    /// Gets or sets how permission requirements are evaluated.
    /// </summary>
    public UIAccessMode PermissionsMode { get; init; } = UIAccessMode.Any;
}
