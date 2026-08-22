using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;

namespace NE.Standard.UI.Components.Views;

internal sealed class UIViewBuildContext
{
    private readonly List<UIRegion> _regions = [];
    private readonly List<UIDialog> _dialogs = [];

    public IReadOnlyList<UIRegion> Regions => _regions;
    public IReadOnlyList<UIDialog> Dialogs => _dialogs;

    public void AddRegion(string key, IVisualComponent? root)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        if (root is null)
            return;

        _regions.Add(new UIRegion
        {
            Key = key,
            Root = root,
        });
    }

    public void AddDialogs(IReadOnlyList<UIDialog>? dialogs)
    {
        if (dialogs is null || dialogs.Count == 0)
            return;

        _dialogs.AddRange(dialogs);
    }
}
