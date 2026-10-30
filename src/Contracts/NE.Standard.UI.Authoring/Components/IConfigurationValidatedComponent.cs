namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A component whose setters refuse a configuration that cannot hold — bounds out of order, a step of zero — and that applies the same
/// rule to its properties as they stand, for the compiler to catch one written past the setters.
/// </summary>
public interface IConfigurationValidatedComponent
{
    /// <summary>Throws an <see cref="System.ArgumentException"/> when the properties as they stand break the setters' rule.</summary>
    void ValidateConfiguration();
}
