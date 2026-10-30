using System;
using NE.Standard.UI.Shell.Runtime;

namespace NE.Standard.UI.Hosting;

/// <summary>What an attach or a render asks <see cref="UIRuntimeStore.GetOrAdd"/> to build or reuse a runtime with.</summary>
internal readonly record struct UIRuntimeAcquireRequest(UIRuntimeKey Key, string InstanceId, Func<IUIRuntime> Factory, DateTime UtcNow, UIFlushOptions Flush, int MaxPerSession = 64, int MaxUnclaimedPerSession = 16, int MaxTotal = 0, bool Adopted = false);

/// <summary>What <see cref="UIRuntimeStore.GetOrAdd"/> answers: the entry, what it attached, and any runtime it gave up or left unused.</summary>
internal readonly record struct UIRuntimeAcquireResult(UIRuntimeEntry? Entry, bool Created, bool Attached, int ActiveInstances, IUIRuntime? Evicted, UIRuntimeEviction Eviction, IUIRuntime? Unused);
