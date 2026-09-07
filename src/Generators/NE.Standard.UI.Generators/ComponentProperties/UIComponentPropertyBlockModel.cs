using System.Collections.Immutable;
using Microsoft.CodeAnalysis;

namespace NE.Standard.UI.Generators.ComponentProperties;

/// <summary>
/// A component type and the contracts whose annotated property blocks it carries.
/// </summary>
internal sealed record UIComponentPropertyBlockModel(
    INamedTypeSymbol Type,
    ImmutableArray<INamedTypeSymbol> Contracts
);
