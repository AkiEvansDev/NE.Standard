namespace NE.Standard.UI.Abstractions.Binding.Addresses;

/// <summary>
/// Represents a value that must be resolved against compiled UI references before runtime use.
/// </summary>
public interface IUIResolvableValue
{
    /// <summary>
    /// Resolves this value using the specified reference resolver.
    /// </summary>
    object Resolve(IUIReferenceResolver resolver);
}
