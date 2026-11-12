using System;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// Base class for item components that support group templates.
/// </summary>
public abstract class GroupedItemsComponentBase<TComponent, TItem, TTemplate>(string? id = null) : ItemsComponentBase<TComponent, TItem, TTemplate>(id), IGroupedItemsComponent
    where TComponent : GroupedItemsComponentBase<TComponent, TItem, TTemplate>, IUIComponentDefinition
    where TItem : class
    where TTemplate : class, IVisualComponent
{
    private IVisualComponent? _defaultGroupTemplate;
    private bool _hasAuthoredGroupTemplate;

    /// <inheritdoc/>
    public IVisualComponent? GroupTemplate { get; protected set; }

    /// <inheritdoc/>
    public bool HasGroupTemplate => GroupTemplate is not null;

    /// <summary>
    /// Sets the template used to render item groups.
    /// </summary>
    public TComponent SetGroupTemplate(IVisualComponent template)
    {
        GroupTemplate = Accept(template);
        _hasAuthoredGroupTemplate = true;
        return Self;
    }

    /// <summary>Installs the built-in default group template without marking it as authored.</summary>
    protected void SetDefaultGroupTemplate(IVisualComponent template)
    {
        IVisualComponent accepted = Accept(template);
        GroupTemplate = accepted;
        _defaultGroupTemplate = accepted;
    }

    /// <summary>Marks the built-in default group template as configured by the author.</summary>
    protected void MarkGroupTemplateAuthored()
        => _hasAuthoredGroupTemplate = true;

    /// <inheritdoc/>
    protected override Action? SnapshotAuthoredState()
    {
        Action? restoreBase = base.SnapshotAuthoredState();
        IVisualComponent? ownGroupTemplate = _hasAuthoredGroupTemplate ? GroupTemplate : null;
        _hasAuthoredGroupTemplate = false;

        if (ownGroupTemplate is null)
            return restoreBase;

        Action? restoreOwnGroupTemplate = (ownGroupTemplate as ITemplateEventTarget)?.SnapshotComponentState();

        if (_defaultGroupTemplate is not null && !ReferenceEquals(ownGroupTemplate, _defaultGroupTemplate))
            GroupTemplate = _defaultGroupTemplate;

        return () =>
        {
            restoreBase?.Invoke();
            GroupTemplate = ownGroupTemplate;
            _hasAuthoredGroupTemplate = true;
            restoreOwnGroupTemplate?.Invoke();
        };
    }
}
