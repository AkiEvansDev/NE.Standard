using System;
using NE.Standard.UI.Abstractions.Binding.Properties;
using NE.Standard.UI.Primitives.Annotations;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A file-picking component that refuses a file over a size limit.
/// </summary>
public interface IMaxFileSizeComponent
{
    /// <summary>
    /// Gets the registered property key for <see cref="MaxFileSize"/>.
    /// </summary>
    static UIProperty MaxFileSizeProperty { get; } = new(nameof(MaxFileSize));

    /// <summary>
    /// Gets or sets the largest file taken, in bytes; the client refuses a larger one before uploading it and says so on the field's
    /// validation line.
    /// </summary>
    [UIComponentProperty(DefaultValue = null, GenerateSetter = false)]
    long? MaxFileSize { get; set; }
}

/// <summary>
/// The validated setter <see cref="IMaxFileSizeComponent"/> components share.
/// </summary>
public static class MaxFileSizeComponentExtensions
{
    /// <summary>
    /// Sets the maximum allowed file size, in bytes.
    /// </summary>
    public static T SetMaxFileSize<T>(this T component, long maxFileSize) where T : IMaxFileSizeComponent
    {
        ArgumentOutOfRangeException.ThrowIfNegativeOrZero(maxFileSize);

        component.MaxFileSize = maxFileSize;
        return component;
    }
}
