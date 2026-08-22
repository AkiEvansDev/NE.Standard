using System;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Compiled.Models;
using NE.Standard.UI.Primitives.Interaction;

namespace NE.Standard.UI.Web.Abstractions.Rendering;

public sealed class WebRenderInteractionMetadata
{
    public required UIInteractionSourceKind SourceKind { get; init; }

    public required UIInteractionActionKind ActionKind { get; init; }

    public WebRenderPropertyMetadata? Source { get; set; }

    public CompiledUIEventAddress? SourceEvent { get; set; }

    public WebRenderPropertyMetadata? Target { get; set; }

    public ClientEffect? Effect { get; init; }

    public required UIComparisonOperator Operator { get; init; }

    public object? Value { get; init; }

    public object? TrueValue { get; init; }

    public object? FalseValue { get; init; }

    public void Validate()
    {
        switch (ActionKind)
        {
            case UIInteractionActionKind.SetProperty:
                if (Target is not WebRenderPropertyMetadata target)
                    throw new InvalidOperationException("Interaction target property is required.");

                target.Validate();
                break;

            case UIInteractionActionKind.Effect:
                if (Effect is null)
                    throw new InvalidOperationException("Interaction effect is required.");

                break;

            default:
                throw new InvalidOperationException($"Interaction action kind '{ActionKind}' is not supported.");
        }

        switch (SourceKind)
        {
            case UIInteractionSourceKind.Property:
                if (Source is not WebRenderPropertyMetadata source)
                    throw new InvalidOperationException("Interaction source property is required.");

                source.Validate();
                break;

            case UIInteractionSourceKind.Event:
                if (SourceEvent is not CompiledUIEventAddress sourceEvent || sourceEvent.ComponentId.IsEmpty)
                    throw new InvalidOperationException("Interaction source event is required.");

                ArgumentException.ThrowIfNullOrWhiteSpace(sourceEvent.EventName);
                break;

            default:
                throw new InvalidOperationException($"Interaction source kind '{SourceKind}' is not supported.");
        }
    }
}
