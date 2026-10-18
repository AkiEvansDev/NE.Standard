namespace NE.Standard.UI.Abstractions.Recursive;

/// <summary>
/// One step of a <see cref="RecursivePathTemplate"/>: a property it names, or a slot (<c>[]</c>) a key or an index fills.
/// </summary>
public readonly record struct RecursivePathTemplatePart
{
    private RecursivePathTemplatePart(PathSegment segment, int parameterIndex)
    {
        Segment = segment;
        ParameterIndex = parameterIndex;
    }

    /// <summary>
    /// Gets the property segment a property step names; the default segment for a slot.
    /// </summary>
    public PathSegment Segment { get; }

    /// <summary>
    /// Gets which of the template's parameters fills the slot, counted from 0; -1 for a property step.
    /// </summary>
    public int ParameterIndex { get; }

    /// <summary>
    /// Gets whether the step is a slot a parameter fills.
    /// </summary>
    public bool IsParameter => ParameterIndex >= 0;

    /// <summary>
    /// Gets the property a property step names; null for a slot.
    /// </summary>
    public string? Property => IsParameter ? null : Segment.Property;

    internal static RecursivePathTemplatePart ForProperty(PathSegment segment)
        => new(segment, -1);

    internal static RecursivePathTemplatePart ForParameter(int parameterIndex)
        => new(default, parameterIndex);
}
