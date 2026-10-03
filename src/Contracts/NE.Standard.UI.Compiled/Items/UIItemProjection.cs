using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Compiled.Items;

/// <summary>
/// What the page reads off the items of one host — each property by its name, what is read inside it, and the value it reads where
/// the property is absent — so a row carries that and nothing else.
/// </summary>
/// <remarks>
/// <see cref="Whole"/> stands for a host whose readers the compile cannot know (a collection sink, a package reading rows raw): its
/// items travel whole, less their nulls and empty collections.
/// </remarks>
public sealed class UIItemProjection
{
    private readonly FrozenDictionary<string, UIItemProjectionMember>? _members;

    /// <summary>
    /// Creates a projection of the given members, matched by their names as the item's type declares them.
    /// </summary>
    public UIItemProjection(IEnumerable<UIItemProjectionMember> members)
    {
        ArgumentNullException.ThrowIfNull(members);

        Dictionary<string, UIItemProjectionMember> builder = new(StringComparer.Ordinal);

        foreach (UIItemProjectionMember member in members)
        {
            ArgumentNullException.ThrowIfNull(member);

            if (!builder.TryAdd(member.Name, member))
                throw new InvalidOperationException($"Item property '{member.Name}' is projected twice.");
        }

        _members = builder.ToFrozenDictionary(StringComparer.Ordinal);
    }

    private UIItemProjection()
    {
    }

    /// <summary>
    /// Gets the projection that keeps every property: the item travels whole.
    /// </summary>
    public static UIItemProjection Whole { get; } = new();

    /// <summary>
    /// Gets whether the item travels whole.
    /// </summary>
    public bool IsWhole => _members is null;

    /// <summary>
    /// Gets the properties kept, empty for <see cref="Whole"/>.
    /// </summary>
    public IReadOnlyCollection<UIItemProjectionMember> Members => _members?.Values ?? [];

    /// <summary>
    /// Attempts to get the member kept under a property name.
    /// </summary>
    public bool TryGetMember(string name, [NotNullWhen(true)] out UIItemProjectionMember? member)
    {
        ArgumentNullException.ThrowIfNull(name);

        if (_members is null)
        {
            member = null;
            return false;
        }

        return _members.TryGetValue(name, out member);
    }

    /// <summary>
    /// Gets every path kept, dotted, outermost first — what a page in development is told to check its reads against.
    /// </summary>
    public IReadOnlyList<string> Paths
    {
        get
        {
            List<string> paths = [];

            AppendPaths(paths, prefix: null);

            return paths;
        }
    }

    private void AppendPaths(List<string> paths, string? prefix)
    {
        foreach (UIItemProjectionMember member in Members)
        {
            var path = prefix is null ? member.Name : $"{prefix}.{member.Name}";

            if (member.Inner is { IsWhole: false } inner)
                inner.AppendPaths(paths, path);
            else
                paths.Add(path);
        }
    }
}

/// <summary>
/// One property a projection keeps.
/// </summary>
public sealed class UIItemProjectionMember
{
    /// <summary>
    /// Gets the property's name as the item's type declares it.
    /// </summary>
    public required string Name { get; init; }

    /// <summary>
    /// Gets what is read inside the value — of an object, or of each element of a list — or <see langword="null"/> when the value
    /// is read whole.
    /// </summary>
    public UIItemProjection? Inner { get; init; }

    /// <summary>
    /// Gets whether every reader reads the absent property as <see cref="Fallback"/>, so a value equal to it is left out.
    /// </summary>
    public bool HasFallback { get; init; }

    /// <summary>
    /// Gets the value every reader reads where the property is absent; meaningful only when <see cref="HasFallback"/> is set.
    /// </summary>
    public object? Fallback { get; init; }
}
