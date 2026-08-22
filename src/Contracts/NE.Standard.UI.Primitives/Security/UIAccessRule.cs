using System;
using System.Collections.Generic;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Primitives.Security;

/// <summary>
/// Defines how multiple access requirements are evaluated.
/// </summary>
public enum UIAccessMode
{
    /// <summary>
    /// At least one of the required values must be satisfied.
    /// </summary>
    Any = 0,

    /// <summary>
    /// All of the required values must be satisfied.
    /// </summary>
    All = 1
}

/// <summary>
/// Represents role and permission requirements for a UI endpoint.
/// </summary>
public sealed class UIAccessRule
{
    /// <summary>
    /// Gets the roles required by the rule.
    /// </summary>
    public IReadOnlyList<string>? Roles { get; init; }

    /// <summary>
    /// Gets the permissions required by the rule.
    /// </summary>
    public IReadOnlyList<string>? Permissions { get; init; }

    /// <summary>
    /// Gets how role requirements are evaluated.
    /// </summary>
    public UIAccessMode RolesMode { get; init; } = UIAccessMode.Any;

    /// <summary>
    /// Gets how permission requirements are evaluated.
    /// </summary>
    public UIAccessMode PermissionsMode { get; init; } = UIAccessMode.Any;

    /// <summary>
    /// Validates that the rule contains no empty role or permission entries.
    /// </summary>
    /// <exception cref="ArgumentException">
    /// The rule contains an empty role or permission collection, or a null, empty, or whitespace entry.
    /// </exception>
    public void Validate()
    {
        if (Roles is not null && Roles.Count == 0)
            throw new ArgumentException("Roles must not be empty when specified.", nameof(Roles));

        if (Permissions is not null && Permissions.Count == 0)
            throw new ArgumentException("Permissions must not be empty when specified.", nameof(Permissions));

        ValidateValues(Roles, nameof(Roles));
        ValidateValues(Permissions, nameof(Permissions));
    }

    /// <summary>
    /// Creates access rules from authorization attributes.
    /// </summary>
    /// <exception cref="ArgumentNullException">
    /// <paramref name="attributes"/> or one of its elements is <see langword="null"/>.
    /// </exception>
    /// <exception cref="ArgumentException">
    /// An attribute contains invalid role or permission values.
    /// </exception>
    public static UIAccessRule[] FromAttributes(IEnumerable<UIAuthorizeAttribute> attributes)
    {
        ArgumentNullException.ThrowIfNull(attributes);

        List<UIAccessRule> rules = [];

        foreach (UIAuthorizeAttribute attribute in attributes)
        {
            ArgumentNullException.ThrowIfNull(attribute);

            UIAccessRule rule = new()
            {
                Roles = Split(attribute.Roles),
                Permissions = Split(attribute.Permissions),
                RolesMode = attribute.RolesMode,
                PermissionsMode = attribute.PermissionsMode
            };

            rule.Validate();

            rules.Add(rule);
        }

        return [.. rules];
    }

    /// <summary>
    /// Creates access rules from multiple authorization attribute groups.
    /// </summary>
    /// <exception cref="ArgumentNullException">
    /// <paramref name="attributeGroups"/> is <see langword="null"/>.
    /// </exception>
    /// <exception cref="ArgumentException">
    /// An attribute contains invalid role or permission values.
    /// </exception>
    public static UIAccessRule[] FromAttributes(params IEnumerable<UIAuthorizeAttribute>[] attributeGroups)
    {
        ArgumentNullException.ThrowIfNull(attributeGroups);

        List<UIAccessRule> rules = [];

        for (var i = 0; i < attributeGroups.Length; i++)
        {
            UIAccessRule[] groupRules = FromAttributes(attributeGroups[i]);

            if (groupRules.Length != 0)
                rules.AddRange(groupRules);
        }

        return [.. rules];
    }

    private static void ValidateValues(IReadOnlyList<string>? values, string paramName)
    {
        if (values is null)
            return;

        for (var i = 0; i < values.Count; i++)
        {
            if (string.IsNullOrWhiteSpace(values[i]))
                throw new ArgumentException("Access rule values must not contain null, empty, or whitespace entries.", paramName);
        }
    }

    private static string[]? Split(string? value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return null;

        var parts = value.Split(',', StringSplitOptions.TrimEntries | StringSplitOptions.RemoveEmptyEntries);

        return parts.Length == 0 ? null : parts;
    }
}
