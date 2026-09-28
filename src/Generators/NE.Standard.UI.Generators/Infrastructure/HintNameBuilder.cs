using System.Collections.Generic;
using System.Globalization;
using System.Text;
using Microsoft.CodeAnalysis;

namespace NE.Standard.UI.Generators.Infrastructure;

internal static class HintNameBuilder
{
    /// <summary>
    /// A hint name from the type's fully qualified metadata name, so two types that share a name or a file name never collide:
    /// namespace segments joined by <c>.</c>, a containing type by <c>+</c>, and the arity after <c>_</c>.
    /// </summary>
    public static string Build(INamedTypeSymbol type, string suffix)
    {
        StringBuilder builder = new();

        if (!type.ContainingNamespace.IsGlobalNamespace)
            _ = builder.Append(type.ContainingNamespace.ToDisplayString()).Append('.');

        Stack<INamedTypeSymbol> containingTypes = new();

        for (INamedTypeSymbol? current = type.ContainingType; current is not null; current = current.ContainingType)
            containingTypes.Push(current);

        while (containingTypes.Count > 0)
            _ = AppendTypeName(builder, containingTypes.Pop()).Append('+');

        return AppendTypeName(builder, type).Append('.').Append(suffix).Append(".g.cs").ToString();
    }

    private static StringBuilder AppendTypeName(StringBuilder builder, INamedTypeSymbol type)
    {
        _ = builder.Append(type.Name);

        return type.TypeParameters.Length == 0
            ? builder
            : builder.Append('_').Append(type.TypeParameters.Length.ToString(CultureInfo.InvariantCulture));
    }
}
