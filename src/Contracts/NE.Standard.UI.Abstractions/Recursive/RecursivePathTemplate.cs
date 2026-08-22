using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text;
using NE.Standard.UI.Primitives.Recursive;

namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// Represents a recursive path template with parameterized index or key segments.
/// </summary>
public sealed class RecursivePathTemplate
{
    private enum TemplatePartKind
    {
        Segment = 0,
        Parameter = 1,
    }

    private readonly struct TemplatePart
    {
        private TemplatePart(TemplatePartKind kind, PathSegment segment, int parameterIndex)
        {
            Kind = kind;
            Segment = segment;
            ParameterIndex = parameterIndex;
        }

        public TemplatePartKind Kind { get; }
        public PathSegment Segment { get; }
        public int ParameterIndex { get; }

        public static TemplatePart Fixed(PathSegment segment)
            => new(TemplatePartKind.Segment, segment, -1);

        public static TemplatePart Parameter(int parameterIndex)
            => new(TemplatePartKind.Parameter, default, parameterIndex);
    }

    /// <summary>
    /// Gets the empty path template.
    /// </summary>
    public static RecursivePathTemplate Empty { get; } = new(string.Empty, 0, []);

    private readonly TemplatePart[] _parts;

    private RecursivePathTemplate(string template, int parameterCount, TemplatePart[] parts)
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
    /// Materializes the template using index or key parameters.
    /// </summary>
    /// <exception cref="ArgumentException">
    /// The number of parameters does not match <see cref="ParameterCount"/>, or a parameter is not an <see cref="int"/> or <see cref="string"/>.
    /// </exception>
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
            TemplatePart part = _parts[i];

            segments[i] = part.Kind switch
            {
                TemplatePartKind.Segment => part.Segment,
                TemplatePartKind.Parameter => CreateParameterizedSegment(parameters[part.ParameterIndex]),
                _ => throw new UnreachableException()
            };
        }

        return new RecursivePath(segments, true);
    }

    private static PathSegment CreateParameterizedSegment(object? parameter)
    {
        return parameter switch
        {
            int index => PathSegment.AtIndex(index),
            string key => PathSegment.WithKey(key),
            _ => throw new ArgumentException("Path template parameters must be int or string.", nameof(parameter)),
        };
    }

    /// <summary>
    /// Parses a recursive path template.
    /// </summary>
    /// <exception cref="FormatException">
    /// <paramref name="template"/> is not a valid path template.
    /// </exception>
    public static RecursivePathTemplate Parse(string template)
    {
        ArgumentNullException.ThrowIfNull(template);

        if (template.Length == 0 || template == ".")
            return Empty;

        List<TemplatePart> parts = [];
        ReadOnlySpan<char> span = template.AsSpan();

        var i = 0;
        var parameterCount = 0;
        var expectSegment = true;

        while (i < span.Length)
        {
            if (span[i] == '.')
            {
                if (expectSegment)
                    throw new FormatException($"Invalid path template '{template}'.");

                expectSegment = true;
                i++;
                continue;
            }

            if (span[i] == '[')
            {
                if (i + 1 >= span.Length || span[i + 1] != ']')
                    throw new FormatException($"Invalid parameter segment in path template '{template}'.");

                parts.Add(TemplatePart.Parameter(parameterCount));
                parameterCount++;

                i += 2;
                expectSegment = false;
                continue;
            }

            var start = i;

            while (i < span.Length && span[i] != '.' && span[i] != '[')
                i++;

            if (i == start)
                throw new FormatException($"Invalid property segment in path template '{template}'.");

            parts.Add(TemplatePart.Fixed(PathSegment.ForProperty(span[start..i].ToString())));
            expectSegment = false;
        }

        return expectSegment ? throw new FormatException($"Invalid path template '{template}'.") : Create([.. parts], parameterCount);
    }

    private static RecursivePathTemplate Create(TemplatePart[] parts, int parameterCount)
    {
        var template = BuildTemplate(parts);
        return new RecursivePathTemplate(template, parameterCount, parts);
    }

    private static string BuildTemplate(ReadOnlySpan<TemplatePart> parts)
    {
        if (parts.Length == 0)
            return string.Empty;

        StringBuilder builder = new();

        for (var i = 0; i < parts.Length; i++)
        {
            TemplatePart part = parts[i];

            if (part.Kind == TemplatePartKind.Parameter)
            {
                _ = builder.Append("[]");
                continue;
            }

            PathSegment segment = part.Segment;

            switch (segment.Kind)
            {
                case PathSegmentKind.Property:
                    if (builder.Length > 0)
                        _ = builder.Append('.');
                    _ = builder.Append(segment.Property);
                    break;

                case PathSegmentKind.Index:
                case PathSegmentKind.Key:
                    _ = builder.Append("[]");
                    break;

                default:
                    throw new UnreachableException();
            }
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

        List<TemplatePart> parts = [];
        List<object> parameters = [];

        foreach (PathSegment segment in path)
        {
            switch (segment.Kind)
            {
                case PathSegmentKind.Property:
                    parts.Add(TemplatePart.Fixed(segment));
                    break;

                case PathSegmentKind.Index:
                    parts.Add(TemplatePart.Parameter(parameters.Count));
                    parameters.Add(segment.Index);
                    break;

                case PathSegmentKind.Key:
                    parts.Add(TemplatePart.Parameter(parameters.Count));
                    parameters.Add(segment.Key);
                    break;

                default:
                    throw new UnreachableException();
            }
        }

        return (Create([.. parts], parameters.Count), parameters.ToArray());
    }

    public override bool Equals(object? obj)
        => obj is RecursivePathTemplate other && (ReferenceEquals(this, other) || string.Equals(Template, other.Template, StringComparison.Ordinal));

    public override int GetHashCode()
        => StringComparer.Ordinal.GetHashCode(Template);

    public override string ToString()
        => Template;
}
