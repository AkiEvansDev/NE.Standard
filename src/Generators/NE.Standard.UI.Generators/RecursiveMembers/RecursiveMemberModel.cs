using System.Collections.Generic;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;

namespace NE.Standard.UI.Generators.RecursiveMembers;

internal sealed record RecursiveMemberModel(
    PropertyDeclarationSyntax PropertySyntax,
    IPropertySymbol Property,
    INamedTypeSymbol ContainingType,
    RecursiveMemberAttributeValues Values
);

internal sealed record RecursiveMemberAttributeValues(bool Generate)
{
    public static RecursiveMemberAttributeValues From(AttributeData attribute)
    {
        var generate = true;

        if (attribute.ConstructorArguments.Length > 0 && attribute.ConstructorArguments[0].Value is bool constructorGenerate)
            generate = constructorGenerate;

        foreach (KeyValuePair<string, TypedConstant> pair in attribute.NamedArguments)
        {
            if (pair.Key == "Generate" && pair.Value.Value is bool namedGenerate)
                generate = namedGenerate;
        }

        return new RecursiveMemberAttributeValues(generate);
    }
}
