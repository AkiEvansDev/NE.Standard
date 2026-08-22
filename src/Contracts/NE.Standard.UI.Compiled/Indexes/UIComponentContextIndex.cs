using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Compiled.Indexes;

/// <summary>
/// Provides lookup access to compiled component contexts.
/// </summary>
public sealed class UIComponentContextIndex
{
    private readonly FrozenDictionary<UIContextId, CompiledUIContext> _contexts;
    private readonly CompiledUIContext[] _all;

    /// <summary>
    /// Initializes the component context index and validates context uniqueness.
    /// </summary>
    public UIComponentContextIndex(CompiledUIContext[] contexts)
    {
        ArgumentNullException.ThrowIfNull(contexts);

        _all = [.. contexts];

        Dictionary<UIContextId, CompiledUIContext> byId = new(contexts.Length);

        for (var i = 0; i < contexts.Length; i++)
        {
            CompiledUIContext context = contexts[i];

            if (context.Id.IsEmpty)
                throw new InvalidOperationException("Context id must not be empty.");

            if (context.TemplateId.IsEmpty)
                throw new InvalidOperationException($"Context '{context.Id}' template id must not be empty.");

            if (!byId.TryAdd(context.Id, context))
                throw new InvalidOperationException($"Context '{context.Id}' is already registered.");
        }

        _contexts = byId.ToFrozenDictionary();
    }

    /// <summary>
    /// Gets all registered contexts.
    /// </summary>
    public IReadOnlyList<CompiledUIContext> All => _all;

    /// <summary>
    /// Attempts to get a context by id.
    /// </summary>
    public bool TryGet(UIContextId contextId, [NotNullWhen(true)] out CompiledUIContext? context)
        => contextId.IsEmpty
            ? throw new ArgumentException("Context id must not be empty.", nameof(contextId))
            : _contexts.TryGetValue(contextId, out context);

    /// <summary>
    /// Gets a context by id or throws when it is not registered.
    /// </summary>
    public CompiledUIContext GetRequired(UIContextId contextId)
        => TryGet(contextId, out CompiledUIContext? context)
            ? context
            : throw new InvalidOperationException($"Context '{contextId}' was not found.");
}
