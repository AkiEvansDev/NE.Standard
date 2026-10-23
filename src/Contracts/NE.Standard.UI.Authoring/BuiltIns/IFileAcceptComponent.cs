using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A component that takes files — picked, dropped or pasted — of the types it names and up to the size it allows.
/// </summary>
public interface IFileAcceptComponent : IMaxFileSizeComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="Accept"/>.
    /// </summary>
    static UIProperty AcceptProperty { get; } = new(nameof(Accept));

    /// <summary>
    /// Gets the file types taken, as a comma-separated list of MIME types, families (<c>image/png</c>, <c>image/*</c>) or extensions;
    /// unset or empty, any file the component takes at all.
    /// </summary>
    [UIComponentProperty(DefaultValue = null)]
    string? Accept { get; }
}
