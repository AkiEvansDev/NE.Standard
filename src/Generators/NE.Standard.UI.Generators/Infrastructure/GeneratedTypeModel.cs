using Microsoft.CodeAnalysis;

namespace NE.Standard.UI.Generators.Infrastructure;

/// <summary>
/// The type a generated file reopens, read off its symbol inside a pipeline's transform.
/// </summary>
internal sealed record GeneratedTypeModel(string HintName, string? Namespace, EquatableArray<string> Declarations, string DisplayName, bool IsPartial, LocationInfo? Location)
{
    public static GeneratedTypeModel From(INamedTypeSymbol type, string hintSuffix, bool includeLocation = false)
    {
        var isPartial = type.IsPartial();

        return new GeneratedTypeModel(
            HintName: HintNameBuilder.Build(type, hintSuffix),
            Namespace: type.ContainingNamespace.IsGlobalNamespace ? null : type.ContainingNamespace.ToDisplayString(),
            Declarations: TypeDeclarationWriter.GetDeclarations(type),
            DisplayName: type.ToDisplayString(),
            IsPartial: isPartial,
            Location: !isPartial || includeLocation ? LocationInfo.From(type) : null
        );
    }
}
