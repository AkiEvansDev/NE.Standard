using System;
using System.Collections;
using System.Collections.Generic;
using System.Text;
using NE.Standard.UI.Primitives.Recursive;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Represents an immutable path into a recursive object graph.
/// </summary>
public sealed class RecursivePath : IReadOnlyList<PathSegment>
{
    /// <summary>
    /// Gets the empty path.
    /// </summary>
    public static readonly RecursivePath Empty = new([], string.Empty);

    private readonly PathSegment[] _segments;
    private string? _cachedString;

    /// <summary>
    /// Creates a path from an array of segments, optionally taking ownership of the array.
    /// </summary>
    public RecursivePath(PathSegment[] segments, bool ownsArray)
    {
        ArgumentNullException.ThrowIfNull(segments);
        _segments = ownsArray ? segments : [.. segments];
    }

    /// <summary>
    /// Creates a path from a sequence of segments.
    /// </summary>
    public RecursivePath(IEnumerable<PathSegment> segments)
    {
        ArgumentNullException.ThrowIfNull(segments);
        _segments = [.. segments];
    }

    private RecursivePath(PathSegment[] segments, string cachedString)
    {
        _segments = segments;
        _cachedString = cachedString;
    }

    /// <summary>
    /// Gets the number of path segments.
    /// </summary>
    public int Count => _segments.Length;

    /// <summary>
    /// Gets the path segment at the specified index.
    /// </summary>
    public PathSegment this[int index]
        => _segments[index];

    /// <summary>
    /// Returns the path segments as a read-only span.
    /// </summary>
    public ReadOnlySpan<PathSegment> AsSpan()
        => _segments;

    IEnumerator IEnumerable.GetEnumerator()
        => _segments.GetEnumerator();

    /// <summary>
    /// Returns an enumerator over the path segments.
    /// </summary>
    public IEnumerator<PathSegment> GetEnumerator()
        => ((IEnumerable<PathSegment>)_segments).GetEnumerator();

    /// <summary>
    /// Returns a new path with a property segment appended.
    /// </summary>
    public RecursivePath AppendProperty(string property)
        => Append(PathSegment.ForProperty(property));

    /// <summary>
    /// Returns a new path with an indexed collection segment appended.
    /// </summary>
    public RecursivePath AppendIndex(int index)
        => Append(PathSegment.AtIndex(index));

    /// <summary>
    /// Returns a new path with a keyed collection segment appended.
    /// </summary>
    public RecursivePath AppendKey(string key)
        => Append(PathSegment.WithKey(key));

    /// <summary>
    /// Returns a new path with the specified segment appended.
    /// </summary>
    public RecursivePath Append(PathSegment segment)
    {
        PathSegment[] result = new PathSegment[_segments.Length + 1];
        Array.Copy(_segments, result, _segments.Length);
        result[^1] = segment;
        return new RecursivePath(result, true);
    }

    /// <summary>
    /// Converts this path to a template and parameter values.
    /// </summary>
    public (RecursivePathTemplate Template, object[] Parameters) ToTemplate()
        => RecursivePathTemplate.FromPath(this);

    /// <summary>
    /// Parses a recursive path string.
    /// </summary>
    /// <exception cref="FormatException">
    /// <paramref name="path"/> is not a valid recursive path.
    /// </exception>
    public static RecursivePath Parse(string path)
    {
        ArgumentNullException.ThrowIfNull(path);

        if (path.Length == 0 || path == ".")
            return Empty;

        List<PathSegment> segments = [];
        ReadOnlySpan<char> span = path.AsSpan();

        var i = 0;
        var expectSegment = true;

        while (i < span.Length)
        {
            if (span[i] == '.')
            {
                if (expectSegment)
                    throw new FormatException($"Invalid path '{path}'.");

                expectSegment = true;
                i++;
                continue;
            }

            if (span[i] == '[')
            {
                i = ParseBracketSegment(path, span, i, segments);
                expectSegment = false;
                continue;
            }

            var start = i;

            while (i < span.Length && span[i] != '.' && span[i] != '[')
                i++;

            if (i == start)
                throw new FormatException($"Invalid property segment in path '{path}'.");

            segments.Add(PathSegment.ForProperty(span[start..i].ToString()));
            expectSegment = false;
        }

        return expectSegment ? throw new FormatException($"Invalid path '{path}'.") : new RecursivePath(segments);
    }

    private static int ParseBracketSegment(string path, ReadOnlySpan<char> span, int start, List<PathSegment> segments)
    {
        var contentStart = start + 1;

        if (contentStart >= span.Length)
            throw new FormatException($"Invalid index segment in path '{path}'.");

        if (span[contentStart] == '"')
            return ParseQuotedKeySegment(path, span, start, segments);

        var closingOffset = span[start..].IndexOf(']');

        if (closingOffset <= 1)
            throw new FormatException($"Invalid index segment in path '{path}'.");

        ReadOnlySpan<char> token = span.Slice(contentStart, closingOffset - 1);

        if (int.TryParse(token, out var index))
        {
            if (index < 0)
                throw new FormatException($"Invalid index segment in path '{path}'.");

            segments.Add(PathSegment.AtIndex(index));
        }
        else
        {
            segments.Add(PathSegment.WithKey(token.ToString()));
        }

        return start + closingOffset + 1;
    }

    private static int ParseQuotedKeySegment(string path, ReadOnlySpan<char> span, int start, List<PathSegment> segments)
    {
        StringBuilder builder = new();
        var i = start + 2;

        while (i < span.Length)
        {
            var c = span[i];

            if (c == '\\')
            {
                if (i + 1 >= span.Length)
                    throw new FormatException($"Invalid escape sequence in path '{path}'.");

                var escaped = span[i + 1];

                if (escaped is not ('\\' or '"'))
                    throw new FormatException($"Invalid escape sequence in path '{path}'.");

                _ = builder.Append(escaped);
                i += 2;
                continue;
            }

            if (c == '"')
            {
                if (i + 1 >= span.Length || span[i + 1] != ']')
                    throw new FormatException($"Invalid quoted key segment in path '{path}'.");

                segments.Add(PathSegment.WithKey(builder.ToString()));
                return i + 2;
            }

            _ = builder.Append(c);
            i++;
        }

        throw new FormatException($"Invalid quoted key segment in path '{path}'.");
    }

    /// <summary>
    /// Creates a path by materializing a path template.
    /// </summary>
    public static RecursivePath FromTemplate(RecursivePathTemplate template, params object[] parameters)
    {
        ArgumentNullException.ThrowIfNull(template);
        return template.Materialize(parameters);
    }

    public override bool Equals(object? obj)
    {
        if (obj is not RecursivePath other)
            return false;

        if (ReferenceEquals(this, other))
            return true;

        if (_segments.Length != other._segments.Length)
            return false;

        for (var i = 0; i < _segments.Length; i++)
        {
            if (!_segments[i].Equals(other._segments[i]))
                return false;
        }

        return true;
    }

    public override int GetHashCode()
    {
        HashCode hash = new();

        for (var i = 0; i < _segments.Length; i++)
            hash.Add(_segments[i]);

        return hash.ToHashCode();
    }

    public override string ToString()
    {
        if (_cachedString is not null)
            return _cachedString;

        if (_segments.Length == 0)
            return _cachedString = string.Empty;

        StringBuilder builder = new();

        for (var i = 0; i < _segments.Length; i++)
        {
            PathSegment segment = _segments[i];

            if (segment.Kind == PathSegmentKind.Property)
            {
                if (builder.Length > 0)
                    _ = builder.Append('.');

                _ = builder.Append(segment.Property);
            }
            else
            {
                _ = builder.Append(segment);
            }
        }

        return _cachedString = builder.ToString();
    }
}
