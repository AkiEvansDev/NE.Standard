using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Diagnostics.CodeAnalysis;
using System.Text;
using NE.Standard.UI.Primitives.Recursive;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Represents a recursive path template with parameterized index or key segments.
/// </summary>
/// <remarks>
/// The one reading of the template grammar (<c>Items[].Title</c>): a walker over a template reads its <see cref="Parts"/>, never the
/// string.
/// </remarks>
public sealed class RecursivePathTemplate
{
    /// <summary>
    /// Gets the empty path template.
    /// </summary>
    public static RecursivePathTemplate Empty { get; } = new(string.Empty, 0, []);

    /// <summary>
    /// Compares paths by shape: the same properties, with a key or an index in the same places, whatever the keys and indexes are.
    /// </summary>
    public static IEqualityComparer<RecursivePath> ShapeComparer { get; } = new PathShapeComparer();

    private readonly RecursivePathTemplatePart[] _parts;

    private RecursivePathTemplate(string template, int parameterCount, RecursivePathTemplatePart[] parts)
    {
        Template = template;
        ParameterCount = parameterCount;
        _parts = parts;
    }

    /// <summary>
    /// Gets the normalized template string.
    /// </summary>
    public string Template { get; }

    /// <summary>
    /// Gets the number of parameters required to materialize the template.
    /// </summary>
    public int ParameterCount { get; }

    /// <summary>
    /// Gets the template's steps in order: the properties it names and the slots its parameters fill.
    /// </summary>
    public ReadOnlySpan<RecursivePathTemplatePart> Parts => _parts;

    /// <summary>
    /// Materializes the template using index or key parameters.
    /// </summary>
    /// <exception cref="ArgumentException">The number of parameters does not match <see cref="ParameterCount"/>, or a parameter is not an <see cref="int"/> or <see cref="string"/>.</exception>
    public RecursivePath Materialize(params object[] parameters)
    {
        ArgumentNullException.ThrowIfNull(parameters);

        if (parameters.Length != ParameterCount)
            throw new ArgumentException($"Path template expects {ParameterCount} parameters, but got {parameters.Length}.", nameof(parameters));

        if (_parts.Length == 0)
            return RecursivePath.Empty;

        PathSegment[] segments = new PathSegment[_parts.Length];

        for (var i = 0; i < _parts.Length; i++)
        {
            RecursivePathTemplatePart part = _parts[i];

            segments[i] = part.IsParameter ? PathSegment.ForParameter(parameters[part.ParameterIndex]) : part.Segment;
        }

        return new RecursivePath(segments, true);
    }

    /// <summary>
    /// Appends <paramref name="other"/>'s steps after this template's, its parameters numbered after this one's.
    /// </summary>
    public RecursivePathTemplate Append(RecursivePathTemplate other)
    {
        ArgumentNullException.ThrowIfNull(other);

        if (other._parts.Length == 0)
            return this;

        if (_parts.Length == 0)
            return other;

        RecursivePathTemplatePart[] parts = new RecursivePathTemplatePart[_parts.Length + other._parts.Length];
        _parts.CopyTo(parts, 0);

        for (var i = 0; i < other._parts.Length; i++)
        {
            RecursivePathTemplatePart part = other._parts[i];

            parts[_parts.Length + i] = part.IsParameter ? RecursivePathTemplatePart.ForParameter(ParameterCount + part.ParameterIndex) : part;
        }

        return Create(parts, ParameterCount + other.ParameterCount);
    }

    /// <summary>
    /// Appends a slot (<c>[]</c>) its next parameter fills.
    /// </summary>
    public RecursivePathTemplate AppendParameter()
        => Create([.. _parts, RecursivePathTemplatePart.ForParameter(ParameterCount)], ParameterCount + 1);

    /// <summary>
    /// Gets the template's first <paramref name="count"/> parts: an ancestor every path of this template passes through.
    /// </summary>
    public RecursivePathTemplate Take(int count)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(count);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(count, _parts.Length);

        if (count == _parts.Length)
            return this;

        if (count == 0)
            return Empty;

        var parameterCount = 0;

        for (var i = 0; i < count; i++)
        {
            if (_parts[i].IsParameter)
                parameterCount++;
        }

        return Create(_parts[..count], parameterCount);
    }

    /// <summary>
    /// Parses a recursive path template.
    /// </summary>
    /// <exception cref="FormatException"><paramref name="template"/> is not a valid path template.</exception>
    public static RecursivePathTemplate Parse(string template)
    {
        ArgumentNullException.ThrowIfNull(template);

        return TryParse(template, out RecursivePathTemplate? parsed, out var error) ? parsed : throw new FormatException(error);
    }

    /// <summary>
    /// Parses a recursive path template; false where it is not a valid one.
    /// </summary>
    public static bool TryParse(string template, [NotNullWhen(true)] out RecursivePathTemplate? parsed)
    {
        ArgumentNullException.ThrowIfNull(template);

        return TryParse(template, out parsed, out _);
    }

    private static bool TryParse(string template, [NotNullWhen(true)] out RecursivePathTemplate? parsed, [NotNullWhen(false)] out string? error)
    {
        parsed = null;
        error = null;

        if (template.Length == 0 || template == ".")
        {
            parsed = Empty;
            return true;
        }

        List<RecursivePathTemplatePart> parts = [];
        ReadOnlySpan<char> span = template.AsSpan();

        var i = 0;
        var parameterCount = 0;
        var expectSegment = true;

        while (i < span.Length)
        {
            if (span[i] == '.')
            {
                if (expectSegment)
                {
                    error = $"Invalid path template '{template}'.";
                    return false;
                }

                expectSegment = true;
                i++;
                continue;
            }

            if (span[i] == '[')
            {
                if (i + 1 >= span.Length || span[i + 1] != ']')
                {
                    error = $"Invalid parameter segment in path template '{template}'.";
                    return false;
                }

                parts.Add(RecursivePathTemplatePart.ForParameter(parameterCount));
                parameterCount++;

                i += 2;
                expectSegment = false;
                continue;
            }

            var start = i;

            while (i < span.Length && span[i] != '.' && span[i] != '[')
                i++;

            if (i == start)
            {
                error = $"Invalid property segment in path template '{template}'.";
                return false;
            }

            parts.Add(RecursivePathTemplatePart.ForProperty(PathSegment.ForProperty(span[start..i].ToString())));
            expectSegment = false;
        }

        if (expectSegment)
        {
            error = $"Invalid path template '{template}'.";
            return false;
        }

        parsed = Create([.. parts], parameterCount);
        return true;
    }

    private static RecursivePathTemplate Create(RecursivePathTemplatePart[] parts, int parameterCount)
    {
        var template = BuildTemplate(parts);
        return new RecursivePathTemplate(template, parameterCount, parts);
    }

    private static string BuildTemplate(ReadOnlySpan<RecursivePathTemplatePart> parts)
    {
        if (parts.Length == 0)
            return string.Empty;

        StringBuilder builder = new();

        for (var i = 0; i < parts.Length; i++)
        {
            RecursivePathTemplatePart part = parts[i];

            if (part.IsParameter)
            {
                _ = builder.Append("[]");
                continue;
            }

            if (builder.Length > 0)
                _ = builder.Append('.');

            _ = builder.Append(part.Segment.Property);
        }

        return builder.ToString();
    }

    /// <summary>
    /// Creates a template and parameter values from a concrete recursive path.
    /// </summary>
    public static (RecursivePathTemplate Template, object[] Parameters) FromPath(RecursivePath path)
    {
        ArgumentNullException.ThrowIfNull(path);

        if (path.Count == 0)
            return (Empty, []);

        RecursivePathTemplate template = BuildFromPath(path);

        return (template, ReadParameters(path, template.ParameterCount));
    }

    private static RecursivePathTemplate BuildFromPath(RecursivePath path)
    {
        ReadOnlySpan<PathSegment> segments = path.AsSpan();
        RecursivePathTemplatePart[] parts = new RecursivePathTemplatePart[segments.Length];
        var parameterCount = 0;

        for (var i = 0; i < segments.Length; i++)
        {
            parts[i] = segments[i].Kind == PathSegmentKind.Property
                ? RecursivePathTemplatePart.ForProperty(segments[i])
                : RecursivePathTemplatePart.ForParameter(parameterCount++);
        }

        return Create(parts, parameterCount);
    }

    private static object[] ReadParameters(RecursivePath path, int parameterCount)
    {
        if (parameterCount == 0)
            return [];

        ReadOnlySpan<PathSegment> segments = path.AsSpan();
        var parameters = new object[parameterCount];
        var next = 0;

        for (var i = 0; i < segments.Length; i++)
        {
            switch (segments[i].Kind)
            {
                case PathSegmentKind.Property:
                    break;

                case PathSegmentKind.Index:
                    parameters[next++] = segments[i].Index;
                    break;

                case PathSegmentKind.Key:
                    parameters[next++] = segments[i].Key;
                    break;

                default:
                    throw new UnreachableException();
            }
        }

        return parameters;
    }

    /// <summary>
    /// Reads a path's keys and indexes in order — the parameters its template takes — without building the template.
    /// </summary>
    public static object[] GetParameters(RecursivePath path)
    {
        ArgumentNullException.ThrowIfNull(path);

        var parameterCount = 0;

        foreach (PathSegment segment in path.AsSpan())
        {
            if (segment.Kind != PathSegmentKind.Property)
                parameterCount++;
        }

        return ReadParameters(path, parameterCount);
    }

    /// <summary>Two paths are one shape when they name the same properties and hold a key or an index in the same places.</summary>
    private sealed class PathShapeComparer : IEqualityComparer<RecursivePath>
    {
        public bool Equals(RecursivePath? x, RecursivePath? y)
        {
            if (ReferenceEquals(x, y))
                return true;

            if (x is null || y is null)
                return false;

            ReadOnlySpan<PathSegment> left = x.AsSpan();
            ReadOnlySpan<PathSegment> right = y.AsSpan();

            if (left.Length != right.Length)
                return false;

            for (var i = 0; i < left.Length; i++)
            {
                var leftIsProperty = left[i].Kind == PathSegmentKind.Property;

                if (leftIsProperty != (right[i].Kind == PathSegmentKind.Property))
                    return false;

                if (leftIsProperty && !string.Equals(left[i].Property, right[i].Property, StringComparison.Ordinal))
                    return false;
            }

            return true;
        }

        public int GetHashCode(RecursivePath obj)
        {
            HashCode hash = default;

            foreach (PathSegment segment in obj.AsSpan())
                hash.Add(segment.Kind == PathSegmentKind.Property ? segment.Property : null);

            return hash.ToHashCode();
        }
    }

    public override bool Equals(object? obj)
        => obj is RecursivePathTemplate other && (ReferenceEquals(this, other) || string.Equals(Template, other.Template, StringComparison.Ordinal));

    public override int GetHashCode()
        => StringComparer.Ordinal.GetHashCode(Template);

    public override string ToString()
        => Template;
}
