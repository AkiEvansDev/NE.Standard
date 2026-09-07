using System;
using System.Globalization;
using System.IO;
using Microsoft.CodeAnalysis;

namespace NE.Standard.UI.Generators.Infrastructure;

internal static class HintNameBuilder
{
    public static string Build(INamedTypeSymbol type, string suffix)
    {
        var fileName = TryGetPrimaryFileName(type);
        var typeSuffix = BuildTypeSuffix(type);

        if (!string.IsNullOrWhiteSpace(fileName))
        {
            // The arity must stay in the name even when the file matches the type name, or `Foo` and `Foo<T>` collide on one hint name.
            return string.Equals(fileName, type.Name, StringComparison.Ordinal) && type.TypeParameters.Length == 0
                ? fileName + "." + suffix + ".g.cs"
                : fileName + "." + typeSuffix + "." + suffix + ".g.cs";
        }

        var fullName = type.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat)
            .Replace("global::", string.Empty)
            .Replace('<', '_')
            .Replace('>', '_')
            .Replace(',', '_')
            .Replace('.', '_')
            .Replace(' ', '_');

        return fullName + "." + suffix + ".g.cs";
    }

    private static string? TryGetPrimaryFileName(INamedTypeSymbol type)
    {
        foreach (SyntaxReference reference in type.DeclaringSyntaxReferences)
        {
            var path = reference.SyntaxTree.FilePath;

            if (string.IsNullOrWhiteSpace(path))
                continue;

            var fileName = Path.GetFileNameWithoutExtension(path);

            if (!string.IsNullOrWhiteSpace(fileName))
                return fileName;
        }

        return null;
    }

    private static string BuildTypeSuffix(INamedTypeSymbol type)
        => type.TypeParameters.Length == 0
            ? type.Name
            : type.Name + "_" + type.TypeParameters.Length.ToString(CultureInfo.InvariantCulture);
}
