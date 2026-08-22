using System;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebDomOperation
{
    public required WebDomOperationKind Kind { get; init; }

    public string? Target { get; init; }

    public string? Name { get; init; }

    public string? Converter { get; init; }

    public WebValueCondition? Condition { get; init; }

    public static WebDomOperation Text(string? target = null, string? converter = null)
        => new()
        {
            Kind = WebDomOperationKind.Text,
            Target = target,
            Converter = converter
        };

    public static WebDomOperation Attribute(string name, string? target = null, string? converter = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new()
        {
            Kind = WebDomOperationKind.Attribute,
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
            Kind = WebDomOperationKind.RemoveAttribute,
            Target = target,
            Name = name
        };
    }

    public static WebDomOperation ToggleAttribute(string name, string? target = null, WebValueCondition condition = WebValueCondition.HasValue, string? converter = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new()
        {
            Kind = WebDomOperationKind.ToggleAttribute,
            Target = target,
            Name = name,
            Condition = condition,
            Converter = converter
        };
    }

    public static WebDomOperation Class(string? target = null, string? converter = null, WebValueCondition condition = WebValueCondition.None)
        => new()
        {
            Kind = WebDomOperationKind.Class,
            Target = target,
            Converter = converter,
            Condition = condition
        };

    public static WebDomOperation ToggleClass(string name, string? target = null, WebValueCondition condition = WebValueCondition.IsTrue, string? converter = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new()
        {
            Kind = WebDomOperationKind.ToggleClass,
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
            Kind = WebDomOperationKind.Style,
            Target = target,
            Name = name,
            Converter = converter
        };
    }

    /// <summary>
    /// Marks a property as trackable without any DOM effect — the client's handler is a deliberate
    /// no-op, so the property still flows through the ordinary <c>PropertyStateStore</c>/
    /// <c>PropertyPatchEngine</c> pipeline (and is therefore usable as a <c>ReactiveSourceRegistry</c>
    /// source) without rendering anything or requiring a visual property to piggyback on.
    /// </summary>
    public static WebDomOperation Data(string? target = null)
        => new()
        {
            Kind = WebDomOperationKind.Data,
            Target = target
        };

    /// <summary>
    /// Sets a live DOM/IDL property (e.g. an <c>&lt;input&gt;</c>'s <c>value</c> or <c>checked</c>) rather
    /// than a content attribute. Unlike <see cref="Attribute(string, string?, string?)"/>
    /// (<c>setAttribute</c>, which for form-control IDL properties only affects the initial/default
    /// value once the element's value has diverged from its attribute — e.g. after any user edit), this
    /// always reflects the live value, which server-originated updates to a two-way-bound `Value` need.
    /// </summary>
    public static WebDomOperation Property(string name, string? target = null, string? converter = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(name);

        return new()
        {
            Kind = WebDomOperationKind.Property,
            Target = target,
            Name = name,
            Converter = converter
        };
    }

    public void Validate()
    {
        if (Kind is WebDomOperationKind.Attribute or WebDomOperationKind.RemoveAttribute or WebDomOperationKind.ToggleAttribute or WebDomOperationKind.ToggleClass or WebDomOperationKind.Style or WebDomOperationKind.Property)
        {
            ArgumentException.ThrowIfNullOrWhiteSpace(Name);
        }
    }
}
