using System.Collections.Generic;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace NE.Standard.UI.Generators.Infrastructure;

internal static class SymbolExtensions
{
    /// <summary>The first attribute of <paramref name="attributeType"/> on the symbol, or null.</summary>
    public static AttributeData? FindAttribute(this ISymbol symbol, INamedTypeSymbol? attributeType)
    {
        if (attributeType is null)
            return null;

        foreach (AttributeData candidate in symbol.GetAttributes())
        {
            if (SymbolEqualityComparer.Default.Equals(candidate.AttributeClass, attributeType))
                return candidate;
        }

        return null;
    }

    /// <summary>Whether the symbol carries an attribute of <paramref name="attributeType"/>.</summary>
    public static bool HasAttribute(this ISymbol symbol, INamedTypeSymbol? attributeType)
        => symbol.FindAttribute(attributeType) is not null;

    /// <summary>The first attribute of <paramref name="metadataName"/> on the symbol, or null.</summary>
    public static AttributeData? FindAttribute(this ISymbol symbol, Compilation compilation, string metadataName)
        => symbol.FindAttribute(compilation.GetTypeByMetadataName(metadataName));

    /// <summary>Whether <paramref name="type"/> implements <paramref name="contract"/> directly or through inheritance.</summary>
    public static bool ImplementsInterface(this INamedTypeSymbol type, INamedTypeSymbol contract)
    {
        foreach (INamedTypeSymbol implemented in type.AllInterfaces)
        {
            if (SymbolEqualityComparer.Default.Equals(implemented, contract))
                return true;
        }

        return false;
    }

    /// <summary>Enumerates members declared on <paramref name="contract"/> and all interfaces it inherits.</summary>
    public static IEnumerable<ISymbol> EnumerateContractMembers(this INamedTypeSymbol contract)
    {
        foreach (ISymbol member in contract.GetMembers())
            yield return member;

        foreach (INamedTypeSymbol inherited in contract.AllInterfaces)
        {
            foreach (ISymbol member in inherited.GetMembers())
                yield return member;
        }
    }

    /// <summary>Whether <paramref name="contract"/> or an inherited interface declares a non-static property with <paramref name="propertyAttribute"/>.</summary>
    public static bool ContractDeclaresProperty(this INamedTypeSymbol contract, string propertyName, INamedTypeSymbol? propertyAttribute)
    {
        foreach (ISymbol member in contract.GetMembers(propertyName))
        {
            if (member is IPropertySymbol { IsStatic: false } candidate && candidate.HasAttribute(propertyAttribute))
                return true;
        }

        foreach (INamedTypeSymbol inherited in contract.AllInterfaces)
        {
            foreach (ISymbol member in inherited.GetMembers(propertyName))
            {
                if (member is IPropertySymbol { IsStatic: false } candidate && candidate.HasAttribute(propertyAttribute))
                    return true;
            }
        }

        return false;
    }

    /// <summary>Whether <paramref name="type"/> or a base type carries a block attribute whose contract declares <paramref name="propertyName"/>.</summary>
    public static bool BlockDeclaresProperty(this INamedTypeSymbol type, string propertyName, INamedTypeSymbol? propertyAttribute, INamedTypeSymbol? blockAttribute, bool includeSelf = true)
    {
        if (blockAttribute is null)
            return false;

        for (INamedTypeSymbol? current = includeSelf ? type : type.BaseType; current is not null && current.SpecialType != SpecialType.System_Object; current = current.BaseType)
        {
            foreach (AttributeData attribute in current.GetAttributes())
            {
                if (!SymbolEqualityComparer.Default.Equals(attribute.AttributeClass, blockAttribute))
                    continue;

                if (attribute.ConstructorArguments.Length == 1
                    && attribute.ConstructorArguments[0].Value is INamedTypeSymbol { TypeKind: TypeKind.Interface } contract
                    && contract.ContractDeclaresProperty(propertyName, propertyAttribute))
                {
                    return true;
                }
            }
        }

        return false;
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
        for (INamedTypeSymbol? current = type; current is not null; current = current.ContainingType)
        {
            if (!IsDeclaredPartial(current))
                return false;
        }

        return true;
    }

    private static bool IsDeclaredPartial(INamedTypeSymbol type)
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
