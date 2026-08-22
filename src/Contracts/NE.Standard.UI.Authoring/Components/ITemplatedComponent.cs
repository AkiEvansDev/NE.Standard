using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Properties;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// Represents a visual component that can render content through templates.
/// </summary>
public interface ITemplatedComponent : IVisualComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="TemplateKeyProperty"/>.
    /// </summary>
    static UIProperty TemplateKeyPropertyProperty { get; } = new(nameof(TemplateKeyProperty));

    /// <summary>
    /// Gets the registered property key for <see cref="FallbackTemplateKey"/>.
    /// </summary>
    static UIProperty FallbackTemplateKeyProperty { get; } = new(nameof(FallbackTemplateKey));

    /// <summary>
    /// Gets the default item template.
    /// </summary>
    IVisualComponent? Template { get; }

    /// <summary>
    /// Gets whether a default item template is defined.
    /// </summary>
    bool HasTemplate { get; }

    /// <summary>
    /// Gets named item templates.
    /// </summary>
    IReadOnlyDictionary<string, IVisualComponent> Templates { get; }

    /// <summary>
    /// Gets whether one or more named item templates are defined.
    /// </summary>
    bool HasTemplates { get; }

    /// <summary>
    /// Gets the template used when no content is available.
    /// </summary>
    IVisualComponent? EmptyTemplate { get; }

    /// <summary>
    /// Gets whether an empty-content template is defined.
    /// </summary>
    bool HasEmptyTemplate { get; }

    /// <summary>
    /// Gets the name of the item field whose value selects a named template variant.
    /// </summary>
    string? TemplateKeyProperty { get; }

    /// <summary>
    /// Gets the fallback template key used when <see cref="TemplateKeyProperty"/> does not resolve to a template.
    /// </summary>
    string? FallbackTemplateKey { get; }
}
