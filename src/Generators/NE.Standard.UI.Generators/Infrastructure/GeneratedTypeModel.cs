using Microsoft.CodeAnalysis;

namespace NE.Standard.UI.Generators.Infrastructure;

/// <summary>
/// The type a generated file reopens, read off its symbol inside a pipeline's transform.
/// </summary>
internal sealed record GeneratedTypeModel(string HintName, string? Namespace, EquatableArray<string> Declarations, string DisplayName, bool IsPartial, LocationInfo? Location)
{
    public static GeneratedTypeModel From(INamedTypeSymbol type, string hintSuffix)
        => new(
            HintName: HintNameBuilder.Build(type, hintSuffix),
            Namespace: type.ContainingNamespace.IsGlobalNamespace ? null : type.ContainingNamespace.ToDisplayString(),
            Declarations: TypeDeclarationWriter.GetDeclarations(type),
            DisplayName: type.ToDisplayString(),
            IsPartial: type.IsPartial(),
            Location: LocationInfo.From(type)
        );
}
