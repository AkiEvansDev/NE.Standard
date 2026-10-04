using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Text.Json.Serialization;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Abstractions.Interaction;

/// <summary>
/// Items dragged from one host and dropped on a component taking their kind (<c>OnDrop</c>): what a drop command receives.
/// </summary>
/// <remarks>
/// Written by the page, so every field is the reader's word, not a fact: a command checks the keys against its own collections, and
/// the effect against what its source allows.
/// </remarks>
public sealed record UIDrop
{
    private static readonly JsonSerializerOptions ReadOptions = new(JsonSerializerDefaults.Web) { RespectNullableAnnotations = true, Converters = { new JsonStringEnumConverter(allowIntegerValues: false) } };

    /// <summary>Gets the kind the items were offered as (<c>DragKind</c>).</summary>
    public required string Kind { get; init; }

    /// <summary>Gets the id the source host was given in the view, or null for a host given none.</summary>
    public string? Source { get; init; }

    /// <summary>Gets the dragged items' keys, in the order they stand in the source: the chosen rows when the dragged row is one of them.</summary>
    public required IReadOnlyList<string> Keys { get; init; }

    /// <summary>
    /// Gets the index the first item takes among the target's items — their end where no place is marked; in a tree, among the
    /// folder's — or null for a target that is no list.
    /// </summary>
    public int? Index { get; init; }

    /// <summary>Gets the folder of a tree the items were dropped into, empty for its top level; null for any other target.</summary>
    public string? Folder { get; init; }

    /// <summary>Gets whether the items leave their source or the target takes a copy.</summary>
    public UIDropEffect Effect { get; init; }

    /// <summary>Reads a drop as the page sends it with the event; throws on one that is not a drop.</summary>
    public static UIDrop Read(string json)
    {
        ArgumentNullException.ThrowIfNull(json);

        UIDrop drop = JsonSerializer.Deserialize<UIDrop>(json, ReadOptions) ?? throw new FormatException("A drop is an object.");

        // The nullable annotations reach the list, not its items.
        if (drop.Keys.Count == 0 || drop.Keys.Any(static key => key is null))
            throw new FormatException("A drop carries the keys of the items it moves.");

        if (drop.Index < 0)
            throw new FormatException("A drop's index is a place among the target's items.");

        return drop;
    }
}
