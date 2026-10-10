using System.Collections.Generic;

namespace NE.Standard.UI.Generators.Infrastructure;

/// <summary>
/// Models grouped by the type they generate into, keyed by its hint name (one per type), in the order the types first appear.
/// </summary>
internal sealed class HintNameGroups<TOwner, TItem>
{
    private readonly Dictionary<string, List<TItem>> _byHintName = [];

    /// <summary>Gets every owner with its items, in the order the owners were first met.</summary>
    public List<(TOwner Owner, List<TItem> Items)> Groups { get; } = [];

    /// <summary>The items of the type <paramref name="declaration"/> generates, started for <paramref name="owner"/> when first met.</summary>
    public List<TItem> GetOrAdd(TOwner owner, GeneratedTypeModel declaration)
    {
        if (_byHintName.TryGetValue(declaration.HintName, out List<TItem> existing))
            return existing;

        List<TItem> created = [];

        _byHintName.Add(declaration.HintName, created);
        Groups.Add((owner, created));

        return created;
    }
}
