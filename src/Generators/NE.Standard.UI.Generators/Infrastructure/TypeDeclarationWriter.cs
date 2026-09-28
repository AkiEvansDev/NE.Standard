using System.Collections.Generic;
using System.Text;
using Microsoft.CodeAnalysis;

namespace NE.Standard.UI.Generators.Infrastructure;

/// <summary>
/// Writes the partial declarations generated members go into.
/// </summary>
/// <remarks>
/// Type parameter constraints are never repeated: a partial part may leave them out, while a repeated one has to agree with the
/// author's exactly, down to nullability and anti-constraints this writer would have to spell out.
/// </remarks>
internal static class TypeDeclarationWriter
{
    /// <summary>The partial declarations from the outermost containing type down to the type itself.</summary>
    public static EquatableArray<string> GetDeclarations(INamedTypeSymbol type)
    {
        List<string> declarations = [];

        for (INamedTypeSymbol? current = type; current is not null; current = current.ContainingType)
            declarations.Add(GetDeclaration(current));

        declarations.Reverse();

        return declarations.ToEquatableArray();
    }

    private static string GetDeclaration(INamedTypeSymbol type)
        => "partial " + GetTypeKindKeyword(type) + " " + type.Name + GetTypeParameters(type);

    /// <summary>The keyword the author's declaration uses; every part of a partial type must use the same one, a record's included.</summary>
    private static string GetTypeKindKeyword(INamedTypeSymbol type)
        => type.TypeKind switch
        {
            TypeKind.Struct => type.IsRecord ? "record struct" : "struct",
            TypeKind.Interface => "interface",
            _ => type.IsRecord ? "record" : "class"
        };

    private static string GetTypeParameters(INamedTypeSymbol type)
    {
        if (type.TypeParameters.Length == 0)
            return string.Empty;

        StringBuilder builder = new();

        _ = builder.Append('<');

        for (var i = 0; i < type.TypeParameters.Length; i++)
        {
            if (i > 0)
                _ = builder.Append(", ");

            _ = builder.Append(type.TypeParameters[i].Name);
        }

        _ = builder.Append('>');

        return builder.ToString();
    }

    public static void WriteTypeStart(StringBuilder builder, EquatableArray<string> declarations)
    {
        foreach (var declaration in declarations)
        {
            _ = builder
                .AppendLine(declaration)
                .AppendLine("{");
        }
    }

    public static void WriteTypeEnd(StringBuilder builder, EquatableArray<string> declarations)
    {
        for (var i = 0; i < declarations.Count; i++)
            _ = builder.AppendLine("}");
    }

    /// <summary>
    /// Separates successive generated members with a blank line, without one after the opening brace.
    /// </summary>
    public static void AppendMemberSeparator(StringBuilder builder, ref bool hasContent)
    {
        if (hasContent)
            _ = builder.AppendLine();

        hasContent = true;
    }
}
