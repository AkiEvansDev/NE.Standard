using System;

namespace NE.Standard.UI.Authoring.BuiltIns;

/// <summary>
/// A file-picking component that refuses a file over a size limit.
/// </summary>
public interface IMaxFileSizeComponent
{
    /// <summary>
    /// Gets or sets the maximum allowed file size, in bytes.
    /// </summary>
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
