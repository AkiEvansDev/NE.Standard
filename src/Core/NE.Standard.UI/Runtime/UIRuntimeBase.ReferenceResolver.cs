using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Items;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase : IUIReferenceResolver
{
    UIComponentId IUIReferenceResolver.ResolveComponentId(string componentId)
    {
        ThrowIfDisposed();

        return View.Graph.GetRequiredComponentId(componentId);
    }

    object IUIReferenceResolver.ResolveItemsView(UIItemsView itemsView)
    {
        ThrowIfDisposed();

        return UIItemsViewResolver.Resolve(itemsView, this);
    }

    private ServerValueUIUpdate ResolveServerValueUpdateNoLock(ServerValueUIUpdate update)
    {
        ArgumentNullException.ThrowIfNull(update);

        var value = ResolveRuntimeValue(update.Value);

        if (ReferenceEquals(value, update.Value))
            return update;

        return new ServerValueUIUpdate
        {
            Address = update.Address,
            Value = value,
            Content = update.Content
        };
    }

    private object? ResolveRuntimeValue(object? value)
    {
        if (value is not IUIResolvableValue resolvable)
            return value;

        try
        {
            return resolvable.Resolve(this);
        }
        catch (Exception exception)
        {
            TryLogRuntimeResolutionFailure("value", nameof(ResolveRuntimeValue), exception);
            return value;
        }
    }

    private UICommandResult ResolveRuntimeCommandResult(UICommandResult result)
    {
        ArgumentNullException.ThrowIfNull(result);

        return ResolveRuntimeEffects(result.Effects) is { } effects
            ? new UICommandResult(result.Success, effects, result.Error)
            : result;
    }

    /// <summary>The effects resolved, or <see langword="null"/> where none changed, so the caller keeps what it holds.</summary>
    private ClientEffect[]? ResolveRuntimeEffects(IReadOnlyList<ClientEffect> effects)
    {
        if (effects.Count == 0)
            return null;

        ClientEffect[] resolved = new ClientEffect[effects.Count];
        var changed = false;

        for (var i = 0; i < resolved.Length; i++)
        {
            resolved[i] = ResolveRuntimeEffect(effects[i]);
            changed |= !ReferenceEquals(effects[i], resolved[i]);
        }

        return changed ? resolved : null;
    }

    private ClientEffect ResolveRuntimeEffect(ClientEffect effect)
    {
        ArgumentNullException.ThrowIfNull(effect);

        try
        {
            return effect.Resolve(this);
        }
        catch (Exception exception)
        {
            TryLogRuntimeResolutionFailure("effect", nameof(ResolveRuntimeEffect), exception);
            return effect;
        }
    }
}
