using System;
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
            Value = value
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
        catch
        {
            return value;
        }
    }

    private UICommandResult ResolveRuntimeCommandResult(UICommandResult result)
    {
        ArgumentNullException.ThrowIfNull(result);

        if (result.Effects.Length == 0)
            return result;

        ClientEffect[] effects = new ClientEffect[result.Effects.Length];
        var changed = false;

        for (var i = 0; i < effects.Length; i++)
        {
            ClientEffect effect = result.Effects[i];
            ClientEffect resolved = ResolveRuntimeEffect(effect);

            effects[i] = resolved;
            changed |= !ReferenceEquals(effect, resolved);
        }

        return changed
            ? new UICommandResult(result.Success, effects, result.Error)
            : result;
    }

    private ClientEffect ResolveRuntimeEffect(ClientEffect effect)
    {
        ArgumentNullException.ThrowIfNull(effect);

        try
        {
            return effect.Resolve(this);
        }
        catch
        {
            return effect;
        }
    }
}
