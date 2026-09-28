using Microsoft.CodeAnalysis;

namespace NE.Standard.UI.Generators.Infrastructure;

/// <summary>
/// A diagnostic decided in a pipeline's transform and reported at emission, carried as equatable data.
/// </summary>
internal sealed record DiagnosticInfo(DiagnosticDescriptor Descriptor, LocationInfo? Location, EquatableArray<string> Arguments)
{
    public static DiagnosticInfo Create(DiagnosticDescriptor descriptor, ISymbol symbol, params string[] arguments)
        => Create(descriptor, LocationInfo.From(symbol), arguments);

    public static DiagnosticInfo Create(DiagnosticDescriptor descriptor, LocationInfo? location, params string[] arguments)
        => new(descriptor, location, arguments.ToEquatableArray());

    public Diagnostic ToDiagnostic()
        => Diagnostic.Create(Descriptor, Location?.ToLocation(), [.. Arguments]);
}
