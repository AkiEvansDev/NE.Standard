using System;
using System.Collections.Generic;
using NE.Standard.UI.Authoring.BuiltIns;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Components.Foundation;

/// <summary>
/// Base class for visual components that contain child components in a grid layout.
/// </summary>
// Overflow is declared per container rather than here: ScrollContainer decides what it clips from its scroll modes.
[UIComponentPropertyBlock(typeof(ISurfaceComponent))]
[UIComponentPropertyBlock(typeof(IBorderedComponent))]
public abstract partial class ContainerComponentBase<TComponent>(string? id = null) : VisualComponentBase<TComponent>(id), IContainerComponent, ISurfaceComponent, IBorderedComponent
    where TComponent : ContainerComponentBase<TComponent>, IUIComponentDefinition
{
    private readonly List<IVisualComponent> _children = [];

    /// <inheritdoc/>
    public IReadOnlyList<IVisualComponent> Children => _children;

    /// <inheritdoc/>
    public bool HasChildren => _children.Count > 0;

    /// <summary>
    /// Adds a child component.
    /// </summary>
    public TComponent AddChild(IVisualComponent child)
    {
        AddChildCore(child);
        return Self;
    }

    /// <summary>
    /// Adds a child component after validation.
    /// </summary>
    protected void AddChildCore(IVisualComponent child)
    {
        ValidateChild(child);
        _children.Add(child);
    }

    private void ValidateChild(IVisualComponent child)
    {
        ArgumentNullException.ThrowIfNull(child);

        if (ReferenceEquals(child, this))
            throw new InvalidOperationException("A component cannot be added as a child of itself.");
    }

    /// <summary>
    /// Adds child components.
    /// </summary>
    public TComponent AddChildren(params IVisualComponent[] children)
    {
        AddChildrenCore(children);
        return Self;
    }

    /// <summary>
    /// Adds child components after validation.
    /// </summary>
    protected void AddChildrenCore(IEnumerable<IVisualComponent> children)
    {
        ArgumentNullException.ThrowIfNull(children);

        IVisualComponent[] buffer = [.. children];

        for (var i = 0; i < buffer.Length; i++)
            ValidateChild(buffer[i]);

        _children.AddRange(buffer);
    }

    /// <summary>
    /// Adds child components.
    /// </summary>
    public TComponent AddChildren(IEnumerable<IVisualComponent> children)
    {
        AddChildrenCore(children);
        return Self;
    }
}
