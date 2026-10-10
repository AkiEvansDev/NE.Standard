using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace NE.Standard.UI.Generators.Infrastructure;

internal static class SymbolExtensions
{
    /// <summary>The first attribute of <paramref name="metadataName"/> on the symbol, or null.</summary>
    public static AttributeData? FindAttribute(this ISymbol symbol, string metadataName)
    {
        foreach (AttributeData candidate in symbol.GetAttributes())
        {
            if (candidate.AttributeClass?.ToDisplayString() == metadataName)
                return candidate;
        }

        return null;
    }

    /// <summary>Whether the type declares a member named <paramref name="memberName"/> other than <paramref name="except"/>: a generated one would collide with it.</summary>
    public static bool DeclaresOtherMember(this INamedTypeSymbol type, string memberName, ISymbol except)
    {
        foreach (ISymbol member in type.GetMembers(memberName))
        {
            if (!SymbolEqualityComparer.Default.Equals(member, except))
                return true;
        }

        return false;
    }

    public static bool IsPartial(this INamedTypeSymbol type)
    {
        foreach (SyntaxReference syntaxReference in type.DeclaringSyntaxReferences)
        {
            if (syntaxReference.GetSyntax() is TypeDeclarationSyntax declaration && declaration.Modifiers.Any(SyntaxKind.PartialKeyword))
                return true;
        }

        return false;
    }

    public static bool InheritsFrom(this ITypeSymbol type, INamedTypeSymbol baseType)
    {
        for (INamedTypeSymbol? current = type.BaseType; current is not null; current = current.BaseType)
        {
            if (SymbolEqualityComparer.Default.Equals(current, baseType))
                return true;
        }

        return false;
    }

    public static bool InheritsFromOrEquals(this ITypeSymbol type, INamedTypeSymbol baseType)
        => SymbolEqualityComparer.Default.Equals(type, baseType) || type.InheritsFrom(baseType);

    public static bool IsNullable(this ITypeSymbol type)
    {
        if (!type.IsValueType)
            return type.NullableAnnotation == NullableAnnotation.Annotated;

        return type is INamedTypeSymbol named && named.OriginalDefinition.SpecialType == SpecialType.System_Nullable_T;
    }

    public static bool IsNonNullableReferenceType(this ITypeSymbol type)
        => !type.IsValueType && type.TypeKind != TypeKind.TypeParameter && type.NullableAnnotation == NullableAnnotation.NotAnnotated;

    public static string ToGlobalTypeDisplayString(this ITypeSymbol type)
        => type.ToDisplayString(SymbolDisplayFormats.GlobalType);

    public static string ToGlobalNonNullableTypeDisplayString(this ITypeSymbol type)
        => type
            .WithNullableAnnotation(NullableAnnotation.NotAnnotated)
            .ToDisplayString(SymbolDisplayFormats.GlobalNonNullableType);

    public static string ToPatternTypeDisplayString(this ITypeSymbol type)
    {
        if (type is INamedTypeSymbol named && named.OriginalDefinition.SpecialType == SpecialType.System_Nullable_T && named.TypeArguments.Length == 1)
            return named.TypeArguments[0].ToDisplayString(SymbolDisplayFormats.GlobalNonNullableType);

        return type.ToGlobalNonNullableTypeDisplayString();
    }
}
