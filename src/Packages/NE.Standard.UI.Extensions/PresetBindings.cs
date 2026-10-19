using NE.Standard.UI.Abstractions.Binding;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Authoring.Components;

namespace NE.Standard.UI.Extensions;

/// <summary>The presets' one reading of what a component binds: whether a property is bound, and the binding that binds it.</summary>
internal static class PresetBindings
{
    /// <summary>Whether <paramref name="component"/> binds <paramref name="property"/>.</summary>
    public static bool Binds(IVisualComponent component, UIProperty property)
        => TryFind(component, property, out _);

    /// <summary>The binding <paramref name="component"/> holds for <paramref name="property"/>, where it binds one.</summary>
    public static bool TryFind(IVisualComponent component, UIProperty property, out UIBinding binding)
    {
        foreach (UIBinding candidate in component.Bindings)
        {
            if (candidate.Target.Equals(property))
            {
                binding = candidate;
                return true;
            }
        }

        binding = default;
        return false;
    }
}
