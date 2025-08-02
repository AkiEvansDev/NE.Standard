using NE.Standard.Design.Common;
using NE.Standard.Design.Components;
using NE.Standard.Design.Data;
using NE.Standard.Extensions;
using NE.Standard.Types;
using System.Collections.Concurrent;

namespace NE.Standard.Web.Context;

public class BlazorPlatformBinding : IPlatformBinding
{
    private readonly ConcurrentStack<string> _bindingPath = new();
    private readonly ConcurrentDictionary<string, ConcurrentBag<string>> _bindingsMap = new();

    private readonly ConcurrentDictionary<string, int> _blockVersions = new();
    private readonly ConcurrentDictionary<string, IPlatformRefresh> _blockContexts = new();

    public string GetKey(IBlock block)
    {
        var ver = _blockVersions.GetOrAdd(block.Id, 0);
        return $"{block.Id}_{ver}";
    }

    public bool TryGetPath(IBlock block, string property, out string path)
    {
        var kvp = _bindingsMap.FirstOrDefault(kv => kv.Value.Any(v => v == $"{block.Id}_{property}"));
        path = kvp.Key;

        if (kvp.Equals(default(KeyValuePair<string, ConcurrentBag<string>>)))
            return false;

        return true;
    }

    public void OpenBinding(IBlock block, IPlatformRefresh blockRefresh)
    {
        if (block.Bindings?.Count > 0)
        {
            var ctxBinding = block.Bindings.FirstOrDefault(b => b.Target.Property == Block.ContextProperty);
            if (ctxBinding != null)
            {
                _blockContexts.AddOrUpdate(GetFullPath(ctxBinding.Path), blockRefresh, (_, _) => blockRefresh);
                _bindingPath.Push(ctxBinding.Path);
            }

            foreach (var binding in block.Bindings.Where(b => b.Target.TargetType == UIPathType.Object))
            {
                if (binding.Target.Property == Block.ContextProperty)
                    continue;

                _blockContexts.AddOrUpdate(GetFullPath(binding.Path), blockRefresh, (_, _) => blockRefresh);
            }

            foreach (var binding in block.Bindings.Where(b => b.Target.TargetType == UIPathType.Value))
            {
                var map = _bindingsMap.GetOrAdd(GetFullPath(binding.Path), _ => []);
                var id = $"{block.Id}_{binding.Target.Property}";

                if (!map.Contains(id))
                    map.Add(id);
            }
        }
    }

    public void CloseBinding(IBlock block)
    {
        if (block.Bindings?.Count > 0)
        {
            var ctxBinding = block.Bindings.FirstOrDefault(b => b.Target.Property == Block.ContextProperty);
            if (ctxBinding != null)
            {
                _bindingPath.TryPop(out var _);
            }
        }
    }

    public async Task<bool> Update(IEnumerable<RecursiveChangedEventArgs> changes, INEModel model, IPlatformBridge bridge)
    {
        var set = new List<KeyValuePair<object?, string[]>>();
        var refresh = new Dictionary<string, IPlatformRefresh>();

        foreach (var change in changes)
        {
            if (change.Action == RecursiveChangedAction.Set)
            {
                if (TryGetIds(change.Path, out var ids))
                    set.Add(new KeyValuePair<object?, string[]>(model.GetValue(change.Path), ids));

                if (TryGetContext(change.Path, out var context))
                    refresh[context.Id] = context;
            }
        }

        if (set.Count > 0 && !await bridge.Set(set))
            return false;

        if (refresh.Count > 0)
            refresh.ForEach(kv =>
            {
                _blockVersions.AddOrUpdate(kv.Key, 0, (_, v) => v++);
                kv.Value.Refresh();
            });

        return true;
    }

    public bool TryGetIds(string path, out string[] ids)
    {
        if (_bindingsMap.TryGetValue(path, out var data))
        {
            ids = [.. data];
            return true;
        }

        ids = [];
        return false;
    }

    public bool TryGetContext(string path, out IPlatformRefresh blockRefresh)
    {
        if (_blockContexts.TryGetValue(path, out var data))
        {
            blockRefresh = data;
            return true;
        }

        blockRefresh = default!;
        return false;
    }

    private string GetFullPath(string path)
    {
        if (_bindingPath.TryPeek(out var context))
            return $"{context}.{path}";

        return path;
    }
}
