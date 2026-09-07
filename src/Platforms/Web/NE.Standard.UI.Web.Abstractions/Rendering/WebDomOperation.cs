using System;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebDomOperation
{
    /// <summary>
    /// The operation by name: a <see cref="WebDomOperationKind"/>'s, or the name a package's client registered its own under.
    /// </summary>
    public required string Kind { get; init; }

    public string? Target { get; init; }

    public string? Name { get; init; }

    public string? Converter { get; init; }

    public WebValueCondition? Condition { get; init; }

    /// <summary>The text a toggled attribute is written with; unset, the value itself is written.</summary>
    public string? Value { get; init; }

    /// <summary>
    /// Gets whether the target may be absent from a given instance: a part only some instances render, such as a period's second field.
    /// </summary>
    /// <remarks>A property registers one operation list per component type, so a part that exists on some instances only is an optional target, not a second list.</remarks>
    public bool Optional { get; init; }

    public static WebDomOperation Text(string? target = null, string? converter = null)
        => new()
        {
            Kind = nameof(WebDomOperationKind.Text),
            Target = target,
            Converter = converter
        };

    /// <summary>
    /// Replaces the target's content with inline markup (see <c>UIInlineMarkup</c>), rendered as elements rather than assigned HTML.
    /// </summary>
    public static WebDomOperation Markup(string? target = null, string? converter = null)
        => new()
        {
            Kind = nameof(WebDomOperationKind.Markup),
            Target = target,
            Converter = converter
        };

    public static WebDomOperation Attribute(string name, string? target = null, string? converter = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new()
        {
            Kind = nameof(WebDomOperationKind.Attribute),
            Target = target,
            Name = name,
            Converter = converter
        };
    }

    public static WebDomOperation RemoveAttribute(string name, string? target = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new()
        {
            Kind = nameof(WebDomOperationKind.RemoveAttribute),
            Target = target,
            Name = name
        };
    }

    public static WebDomOperation ToggleAttribute(string name, string? target = null, WebValueCondition condition = WebValueCondition.HasValue, string? converter = null, string? value = null, bool optional = false)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new()
        {
            Kind = nameof(WebDomOperationKind.ToggleAttribute),
            Target = target,
            Name = name,
            Condition = condition,
            Converter = converter,
            Value = value,
            Optional = optional
        };
    }

    public static WebDomOperation Class(string? target = null, string? converter = null, WebValueCondition condition = WebValueCondition.None)
        => new()
        {
            Kind = nameof(WebDomOperationKind.Class),
            Target = target,
            Converter = converter,
            Condition = condition
        };

    public static WebDomOperation ToggleClass(string name, string? target = null, WebValueCondition condition = WebValueCondition.IsTrue, string? converter = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new()
        {
            Kind = nameof(WebDomOperationKind.ToggleClass),
            Target = target,
            Name = name,
            Condition = condition,
            Converter = converter
        };
    }

    public static WebDomOperation Style(string name, string? target = null, string? converter = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new()
        {
            Kind = nameof(WebDomOperationKind.Style),
            Target = target,
            Name = name,
            Converter = converter
        };
    }

    /// <summary>
    /// Marks a property as trackable without any DOM effect, so it still flows through the ordinary property pipeline.
    /// </summary>
    public static WebDomOperation Data(string? target = null)
        => new()
        {
            Kind = nameof(WebDomOperationKind.Data),
            Target = target
        };

    /// <summary>
    /// Sets a live DOM/IDL property (e.g. <c>value</c> or <c>checked</c>) rather than a content attribute, unlike
    /// <see cref="Attribute(string, string?, string?)"/>.
    /// </summary>
    public static WebDomOperation Property(string name, string? target = null, string? converter = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new()
        {
            Kind = nameof(WebDomOperationKind.Property),
            Target = target,
            Name = name,
            Converter = converter
        };
    }

    /// <summary>
    /// An operation of a kind the framework does not know: one a package's client registered under <paramref name="kind"/>
    /// through <c>registerDomOperation</c>, which gets the value and this operation's <paramref name="name"/> and
    /// <paramref name="target"/> as any built-in one does.
    /// </summary>
    public static WebDomOperation Custom(string kind, string? name = null, string? target = null, string? converter = null, bool optional = false)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(kind);

        return new()
        {
            Kind = kind,
            Target = target,
            Name = name,
            Converter = converter,
            Optional = optional
        };
    }

    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(Kind);

        if (Kind is nameof(WebDomOperationKind.Attribute) or nameof(WebDomOperationKind.RemoveAttribute) or nameof(WebDomOperationKind.ToggleAttribute) or nameof(WebDomOperationKind.ToggleClass) or nameof(WebDomOperationKind.Style) or nameof(WebDomOperationKind.Property))
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(Name);
        }
    }
}
