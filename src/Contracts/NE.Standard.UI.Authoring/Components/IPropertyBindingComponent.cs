using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Binding;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component a wrapper binds a property of by its key, as the component's own binder for it does — a wrapper's hand, so a preset
/// can finish a component it did not build (a labelled control's name bound to the label's path).
/// </summary>
public interface IPropertyBindingComponent
{
    /// <summary>Binds <paramref name="property"/> to a path, as the component's own generated binder for that property does.</summary>
    IVisualComponent BindProperty(UIProperty property, string path, UIBindingScope scope = UIBindingScope.Root, UIBindingMode? mode = null, bool optional = false);

    /// <summary>Applies ancestor subtree default rules while preserving every property, binding, and event authored on the component itself.</summary>
    void ApplyDefaults(ReadOnlySpan<UIDefaultsRule> rules, ReadOnlySpan<UIPropertyDefinition> definitions);
}
