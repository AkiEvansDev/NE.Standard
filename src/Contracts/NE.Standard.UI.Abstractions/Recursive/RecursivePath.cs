using System;
using System.Collections;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq.Expressions;
using System.Reflection;
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
    /// <remarks>Internal: a caller that kept writing to an owned array would change a path already used as a key.</remarks>
    internal RecursivePath(PathSegment[] segments, bool ownsArray)
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
    /// Returns the path's first <paramref name="count"/> segments; the path itself when that is all of them.
    /// </summary>
    public RecursivePath Take(int count)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(count);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(count, _segments.Length);

        if (count == _segments.Length)
            return this;

        return count == 0 ? Empty : new RecursivePath(_segments[..count], ownsArray: true);
    }

    /// <summary>
    /// Returns the path without its first <paramref name="count"/> segments; the path itself when that is none of them.
    /// </summary>
    public RecursivePath Skip(int count)
    {
        ArgumentOutOfRangeException.ThrowIfNegative(count);
        ArgumentOutOfRangeException.ThrowIfGreaterThan(count, _segments.Length);

        if (count == 0)
            return this;

        return count == _segments.Length ? Empty : new RecursivePath(_segments[count..], ownsArray: true);
    }

    /// <summary>
    /// Converts this path to a template and parameter values.
    /// </summary>
    public (RecursivePathTemplate Template, object[] Parameters) ToTemplate()
        => RecursivePathTemplate.FromPath(this);

    /// <summary>
    /// Parses a recursive path string.
    /// </summary>
    /// <exception cref="FormatException"><paramref name="path"/> is not a valid recursive path.</exception>
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
                if (expectSegment && i > 0)
                    throw new FormatException($"Invalid path '{path}'.");

                i = ParseBracketSegment(path, span, i, segments);
                expectSegment = false;
                continue;
            }

            if (!expectSegment)
                throw new FormatException($"Invalid path '{path}'.");

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

        // An index is digits only, read invariantly: " 1 " or "+1" is a key, not row 1, and "-1" is no index at all.
        if (int.TryParse(token, NumberStyles.None, CultureInfo.InvariantCulture, out var index))
            segments.Add(PathSegment.AtIndex(index));
        else if (token[0] == '-' && int.TryParse(token[1..], NumberStyles.None, CultureInfo.InvariantCulture, out _))
            throw new FormatException($"Invalid index segment in path '{path}'.");
        else
            segments.Add(PathSegment.WithKey(token.ToString()));

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
                // An empty key names no element, as an empty [] does.
                if (i + 1 >= span.Length || span[i + 1] != ']' || builder.Length == 0)
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

    /// <summary>
    /// Creates a path from a lambda expression naming a property or indexer chain on <typeparamref name="TSource"/>.
    /// </summary>
    public static RecursivePath FromExpression<TSource, TValue>(Expression<Func<TSource, TValue>> expression)
    {
        ArgumentNullException.ThrowIfNull(expression);
        return FromLambda(expression);
    }

    /// <summary>
    /// Creates a path from a lambda expression naming a property or indexer chain on <typeparamref name="TSource"/>.
    /// </summary>
    public static RecursivePath FromExpression<TSource>(Expression<Func<TSource, object?>> expression)
    {
        ArgumentNullException.ThrowIfNull(expression);
        return FromLambda(expression);
    }

    /// <summary>
    /// Creates a path from a lambda expression naming a property or indexer chain on its single parameter.
    /// </summary>
    public static RecursivePath FromLambda(LambdaExpression expression)
    {
        ArgumentNullException.ThrowIfNull(expression);

        if (expression.Parameters.Count != 1)
            throw new ArgumentException("A binding path expression takes one parameter.", nameof(expression));

        ParameterExpression parameter = expression.Parameters[0];
        List<PathSegment> segments = [];
        Expression current = UnwrapConversions(expression.Body);

        while (!ReferenceEquals(current, parameter))
        {
            switch (current)
            {
                case MemberExpression { Member: PropertyInfo property, Expression: { } parent }:
                    segments.Add(PathSegment.ForProperty(property.Name));
                    current = UnwrapConversions(parent);
                    break;

                case BinaryExpression { NodeType: ExpressionType.ArrayIndex, Left: { } array, Right: { } indexExpression }:
                    segments.Add(EvaluateParameterSegment(indexExpression, parameter, expression));
                    current = UnwrapConversions(array);
                    break;

                case IndexExpression { Object: { } indexedObject, Arguments: [Expression indexArgument] }:
                    segments.Add(EvaluateParameterSegment(indexArgument, parameter, expression));
                    current = UnwrapConversions(indexedObject);
                    break;

                case MethodCallExpression { Object: { } targetObject, Arguments: [Expression argument], Method: { IsSpecialName: true } method } when IsIndexerGetter(method):
                    segments.Add(EvaluateParameterSegment(argument, parameter, expression));
                    current = UnwrapConversions(targetObject);
                    break;

                default:
                    throw new ArgumentException($"Binding path expression '{expression}' must be a chain of properties and single-argument indexers rooted in parameter '{parameter.Name}'.", nameof(expression));
            }
        }

        if (segments.Count == 0)
            return Empty;

        segments.Reverse();
        return new RecursivePath([.. segments], ownsArray: true);
    }

    private static Expression UnwrapConversions(Expression expression)
    {
        while (expression is UnaryExpression { NodeType: ExpressionType.Convert or ExpressionType.ConvertChecked or ExpressionType.TypeAs } unary)
            expression = unary.Operand;

        return expression;
    }

    private static PathSegment EvaluateParameterSegment(Expression argument, ParameterExpression parameter, LambdaExpression fullExpression)
    {
        if (ReferencesParameter(argument, parameter))
            throw new ArgumentException($"Indexer argument '{argument}' in binding path expression '{fullExpression}' cannot depend on lambda parameter '{parameter.Name}'.", nameof(fullExpression));

        var value = EvaluateExpression(argument);
        return PathSegment.ForParameter(value);
    }

    private static bool ReferencesParameter(Expression? expression, ParameterExpression parameter)
    {
        if (expression is null)
            return false;

        if (ReferenceEquals(expression, parameter))
            return true;

        return expression switch
        {
            MemberExpression member => ReferencesParameter(member.Expression, parameter),
            UnaryExpression unary => ReferencesParameter(unary.Operand, parameter),
            BinaryExpression binary => ReferencesParameter(binary.Left, parameter) || ReferencesParameter(binary.Right, parameter),
            MethodCallExpression call => ReferencesParameter(call.Object, parameter) || AnyReferencesParameter(call.Arguments, parameter),
            IndexExpression index => ReferencesParameter(index.Object, parameter) || AnyReferencesParameter(index.Arguments, parameter),
            ConditionalExpression conditional => ReferencesParameter(conditional.Test, parameter) || ReferencesParameter(conditional.IfTrue, parameter) || ReferencesParameter(conditional.IfFalse, parameter),
            NewExpression newExpr => AnyReferencesParameter(newExpr.Arguments, parameter),
            InvocationExpression invoke => ReferencesParameter(invoke.Expression, parameter) || AnyReferencesParameter(invoke.Arguments, parameter),
            _ => false
        };
    }

    private static bool AnyReferencesParameter(ReadOnlyCollection<Expression> arguments, ParameterExpression parameter)
    {
        for (var i = 0; i < arguments.Count; i++)
        {
            if (ReferencesParameter(arguments[i], parameter))
                return true;
        }

        return false;
    }

    private static object? EvaluateExpression(Expression expression)
    {
        expression = UnwrapConversions(expression);

        switch (expression)
        {
            case ConstantExpression constant:
                return constant.Value;

            case MemberExpression member:
                var target = member.Expression is null ? null : EvaluateExpression(member.Expression);

                if (member.Member is FieldInfo field)
                    return field.GetValue(target);

                if (member.Member is PropertyInfo property)
                    return property.GetValue(target);

                break;

            default:
                break;
        }

        return Expression.Lambda(expression).Compile().DynamicInvoke();
    }

    private static bool IsIndexerGetter(MethodInfo method)
    {
        if (string.Equals(method.Name, "get_Item", StringComparison.Ordinal))
            return true;

        if (method.DeclaringType is not { } declaringType)
            return false;

        foreach (PropertyInfo property in declaringType.GetProperties(BindingFlags.Instance | BindingFlags.Public))
        {
            if (property.GetMethod == method && property.GetIndexParameters().Length == 1)
                return true;
        }

        return false;
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
