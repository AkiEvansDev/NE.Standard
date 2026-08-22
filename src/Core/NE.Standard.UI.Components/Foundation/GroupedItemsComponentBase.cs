using System;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// Base class for item components that support group templates.
/// </summary>
public abstract class GroupedItemsComponentBase<TComponent, TItem>(string? id = null) : ItemsComponentBase<TComponent, TItem>(id), IGroupedItemsComponent
    where TComponent : GroupedItemsComponentBase<TComponent, TItem>, IUIComponentDefinition
    where TItem : class
{
    /// <inheritdoc/>
    public IVisualComponent? GroupTemplate { get; protected set; }

    /// <inheritdoc/>
    public bool HasGroupTemplate => GroupTemplate is not null;

    /// <summary>
    /// Sets the template used to render item groups.
    /// </summary>
    public TComponent SetGroupTemplate(IVisualComponent template)
    {
        ArgumentNullException.ThrowIfNull(template);

        if (ReferenceEquals(template, this))
            throw new InvalidOperationException("A component cannot use itself as template content.");

        GroupTemplate = template;
        return Self;
    }
}
