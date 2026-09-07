using System.Text.Json.Serialization;

namespace NE.Standard.UI.Abstractions.Identity;

/// <summary>
/// Identifies a compiled UI component.
/// </summary>
[JsonConverter(typeof(UIComponentIdJsonConverter))]
public readonly record struct UIComponentId(int Value)
{
    /// <summary>
    /// Gets whether this id is unset.
    /// </summary>
    public bool IsEmpty => Value == 0;
    public override string ToString()
        => Value == 0 ? string.Empty : $"u{Value}";
}

/// <summary>
/// Identifies a compiled UI binding.
/// </summary>
[JsonConverter(typeof(UIBindingIdJsonConverter))]
public readonly record struct UIBindingId(int Value)
{
    /// <summary>
    /// Gets whether this id is unset.
    /// </summary>
    public bool IsEmpty => Value == 0;
    public override string ToString()
        => Value == 0 ? string.Empty : $"b{Value}";
}

/// <summary>
/// Identifies a compiled binding source.
/// </summary>
[JsonConverter(typeof(UIBindingSourceIdJsonConverter))]
public readonly record struct UIBindingSourceId(int Value)
{
    /// <summary>
    /// Gets whether this id is unset.
    /// </summary>
    public bool IsEmpty => Value == 0;
    public override string ToString()
        => Value == 0 ? string.Empty : $"s{Value}";
}

/// <summary>
/// Identifies a compiled binding template.
/// </summary>
[JsonConverter(typeof(UIBindingTemplateIdJsonConverter))]
public readonly record struct UIBindingTemplateId(int Value)
{
    /// <summary>
    /// Gets whether this id is unset.
    /// </summary>
    public bool IsEmpty => Value == 0;
    public override string ToString()
        => Value == 0 ? string.Empty : $"t{Value}";
}

/// <summary>
/// Identifies a compiled UI event.
/// </summary>
[JsonConverter(typeof(UIEventIdJsonConverter))]
public readonly record struct UIEventId(int Value)
{
    /// <summary>
    /// Gets whether this id is unset.
    /// </summary>
    public bool IsEmpty => Value == 0;
    public override string ToString()
        => Value == 0 ? string.Empty : $"e{Value}";
}

/// <summary>
/// Identifies a compiled UI context.
/// </summary>
[JsonConverter(typeof(UIContextIdJsonConverter))]
public readonly record struct UIContextId(int Value)
{
    /// <summary>
    /// Gets whether this id is unset.
    /// </summary>
    public bool IsEmpty => Value == 0;
    public override string ToString()
        => Value == 0 ? string.Empty : $"c{Value}";
}
