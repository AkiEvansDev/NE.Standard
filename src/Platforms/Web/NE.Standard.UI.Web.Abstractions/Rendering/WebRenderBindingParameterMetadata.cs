using System;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Compiled.Models;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderBindingParameterMetadata
{
    public required CompiledUIBindingParameterKind Kind { get; init; }

    public UIComponentId? ComponentId { get; init; }

    public object? Value { get; init; }

    public void Validate()
    {
        if (Kind == CompiledUIBindingParameterKind.Dynamic && ComponentId is not { IsEmpty: false })
            throw new InvalidOperationException("Dynamic binding parameter must specify a non-empty component id.");

        if (Kind == CompiledUIBindingParameterKind.Fixed && Value is not (int or string))
            throw new InvalidOperationException("Fixed binding parameter value must be an int or string.");
    }
}
