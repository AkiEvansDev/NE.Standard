using System;
using System.Diagnostics;
using System.Text;
using NE.Standard.UI.Primitives.Recursive;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Represents one segment of a recursive object path.
/// </summary>
public readonly record struct PathSegment
{
    private PathSegment(PathSegmentKind kind, string property, int index, string key)
    {
        Kind = kind;
        Property = property;
        Index = index;
        Key = key;
    }

    /// <summary>
    /// Gets the segment kind.
    /// </summary>
    public PathSegmentKind Kind { get; }

    /// <summary>
    /// Gets the property name for property segments.
    /// </summary>
    public string Property { get; }

    /// <summary>
    /// Gets the collection index for index segments.
    /// </summary>
    public int Index { get; }

    /// <summary>
    /// Gets the collection key for key segments.
    /// </summary>
    public string Key { get; }

    /// <summary>
    /// Creates a property path segment.
    /// </summary>
    public static PathSegment ForProperty(string property)
    {
        ArgumentException.ThrowIfNullOrEmpty(property);
        return new PathSegment(PathSegmentKind.Property, property, -1, string.Empty);
    }

    /// <summary>
    /// Creates an indexed collection path segment.
    /// </summary>
    public static PathSegment AtIndex(int index)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(index);
        return new PathSegment(PathSegmentKind.Index, string.Empty, index, string.Empty);
    }

    /// <summary>
    /// Creates a keyed collection path segment.
    /// </summary>
    public static PathSegment WithKey(string key)
    {
        ArgumentException.ThrowIfNullOrEmpty(key);
        return new PathSegment(PathSegmentKind.Key, string.Empty, -1, key);
    }

    public override string ToString()
        => Kind switch
        {
            PathSegmentKind.Property => Property,
            PathSegmentKind.Index => $"[{Index}]",
            PathSegmentKind.Key => $"[\"{EscapeKey(Key)}\"]",
            _ => throw new UnreachableException()
        };

    private static string EscapeKey(string value)
    {
        StringBuilder builder = new(value.Length);

        for (var i = 0; i < value.Length; i++)
        {
            var c = value[i];

            if (c is '\\' or '"')
                _ = builder.Append('\\');

            _ = builder.Append(c);
        }

        return builder.ToString();
    }
}
