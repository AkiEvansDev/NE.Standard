using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    protected ServerChangeSet DrainPendingUpdatesNoLock()
    {
        if (_pendingUpdates.Count == 0)
            return ServerChangeSet.Empty;

        ServerUIUpdate[] updates = [.. _pendingUpdates];
        ClearPendingUpdatesNoLock();

        ServerChangeSet changes = new() { Updates = updates };
        changes.Validate();

        return changes;
    }

    private void ClearPendingUpdatesNoLock()
    {
        _pendingUpdates.Clear();
        _pendingFullResync = false;
    }

    private void AppendSetUpdatesNoLock(RecursivePath path)
    {
        ArgumentNullException.ThrowIfNull(path);

        if (_pendingFullResync)
            return;

        AppendContextRebuildUpdatesNoLock(path);
        AppendExactValueUpdatesNoLock(path);
        AppendDescendantValueUpdatesNoLock(path);
        AppendTemplateKeyItemReplaceUpdatesNoLock(path);
        MarkChangedItemWindowRulesNoLock(path);
    }

    private void AppendContextRebuildUpdatesNoLock(RecursivePath path)
    {
        ArgumentNullException.ThrowIfNull(path);

        var context = TryGetControllerValue(path);

        AppendCollectionRebuildUpdatesNoLock(path, context);
        AppendExplicitContextRebuildUpdatesNoLock(path, context);
    }

    private void AppendCollectionRebuildUpdatesNoLock(RecursivePath path, object? context)
    {
        IReadOnlyList<CompiledUIBinding> bindings = View.Bindings.GetControllerCollections(path, out var materializedParameters);

        for (var i = 0; i < bindings.Count; i++)
        {
            CompiledUIBinding binding = bindings[i];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            if (!TryBuildDynamicParameters(binding, materializedParameters, out var dynamicParameters))
                continue;

            AddPendingUpdateNoLock(new ServerContextRebuildUIUpdate
            {
                Component = new(binding.Address.Component.Id, dynamicParameters),
                Context = context
            });
        }
    }

    private void AddPendingUpdateNoLock(ServerUIUpdate update)
    {
        ArgumentNullException.ThrowIfNull(update);

        if (_pendingFullResync)
            return;

        switch (update)
        {
            case ServerValueUIUpdate valueUpdate:
                AddPendingValueUpdateNoLock(ResolveServerValueUpdateNoLock(valueUpdate));
                break;

            case ServerContextRebuildUIUpdate contextRebuildUpdate:
                AddPendingContextRebuildUpdateNoLock(contextRebuildUpdate);
                break;

            case ServerCollectionChangeUIUpdate collectionUpdate:
                AddPendingCollectionUpdateNoLock(collectionUpdate);
                break;

            default:
                _pendingUpdates.Add(update);
                break;
        }
    }

    private void AppendExplicitContextRebuildUpdatesNoLock(RecursivePath path, object? context)
    {
        IReadOnlyList<CompiledUIBinding> bindings = View.Bindings.GetControllerContexts(path, out var materializedParameters);

        for (var i = 0; i < bindings.Count; i++)
        {
            CompiledUIBinding binding = bindings[i];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            if (!TryBuildDynamicParameters(binding, materializedParameters, out var dynamicParameters))
                continue;

            AddPendingUpdateNoLock(new ServerContextRebuildUIUpdate
            {
                Component = new(binding.Address.Component.Id, dynamicParameters),
                Context = context
            });
        }
    }

    private void AppendExactValueUpdatesNoLock(RecursivePath path)
    {
        IReadOnlyList<CompiledUIBinding> bindings = View.Bindings.GetControllerProperties(path, out var materializedParameters);

        if (bindings.Count == 0)
            return;

        var value = TryGetControllerValue(path);

        for (var i = 0; i < bindings.Count; i++)
        {
            CompiledUIBinding binding = bindings[i];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            if (!TryBuildDynamicParameters(binding, materializedParameters, out var dynamicParameters))
                continue;

            AddPendingUpdateNoLock(new ServerValueUIUpdate
            {
                Address = new(binding.Address.Component.Id, binding.Address.Property, dynamicParameters),
                Value = UIBoundValueConverter.Convert(value, binding.TargetValueType)
            });
        }
    }

    private void AppendDescendantValueUpdatesNoLock(RecursivePath path)
    {
        IReadOnlyList<CompiledUIBinding> bindings = View.Bindings.GetControllerDescendantProperties(path, out var baseParameters);

        for (var i = 0; i < bindings.Count; i++)
        {
            CompiledUIBinding binding = bindings[i];

            if (binding.Mode == UIBindingMode.OneWayToSource)
                continue;

            if (!TryBuildDynamicParameters(binding, baseParameters, out var dynamicParameters))
                continue;

            RecursivePath bindingPath = View.Bindings.MaterializePath(binding, baseParameters);
            var value = TryGetControllerValue(bindingPath);

            AddPendingUpdateNoLock(new ServerValueUIUpdate
            {
                Address = new(binding.Address.Component.Id, binding.Address.Property, dynamicParameters),
                Value = UIBoundValueConverter.Convert(value, binding.TargetValueType)
            });
        }
    }

    private void AppendFullResyncNoLock()
    {
        ClearPendingUpdatesNoLock();

        _pendingFullResync = true;
        _pendingUpdates.Add(new ServerFullResyncUIUpdate());
    }
}
