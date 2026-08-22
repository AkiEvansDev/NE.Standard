using System.Collections.Generic;
using System.Text;
using Microsoft.CodeAnalysis;

namespace NE.Standard.UI.Generators.Infrastructure;

internal static class TypeDeclarationWriter
{
    public static void WriteContainingTypesStart(StringBuilder builder, INamedTypeSymbol type)
    {
        Stack<INamedTypeSymbol> stack = new();

        for (INamedTypeSymbol? current = type.ContainingType; current is not null; current = current.ContainingType)
            stack.Push(current);

        while (stack.Count > 0)
        {
            INamedTypeSymbol current = stack.Pop();

            _ = builder
                .Append("partial ")
                .Append(GetTypeKindKeyword(current))
                .Append(' ')
                .Append(current.Name)
                .Append(GetTypeParameters(current))
                .AppendLine();

            AppendTypeConstraints(builder, current);
            _ = builder.AppendLine("{");
        }
    }

    private static string GetTypeKindKeyword(INamedTypeSymbol type)
        => type.TypeKind switch
        {
            TypeKind.Struct => "struct",
            TypeKind.Interface => "interface",
            _ => "class"
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

    private static void AppendTypeConstraints(StringBuilder builder, INamedTypeSymbol type)
    {
        foreach (ITypeParameterSymbol parameter in type.TypeParameters)
        {
            List<string> constraints = [];

            if (parameter.HasNotNullConstraint)
                constraints.Add("notnull");

            if (parameter.HasReferenceTypeConstraint)
                constraints.Add("class");

            if (parameter.HasUnmanagedTypeConstraint)
                constraints.Add("unmanaged");
            else if (parameter.HasValueTypeConstraint)
                constraints.Add("struct");

            foreach (ITypeSymbol constraintType in parameter.ConstraintTypes)
                constraints.Add(constraintType.ToDisplayString(SymbolDisplayFormats.GlobalNonNullableType));

            if (parameter.HasConstructorConstraint)
                constraints.Add("new()");

            if (constraints.Count == 0)
                continue;

            _ = builder
                .Append("    where ")
                .Append(parameter.Name)
                .Append(" : ")
                .AppendLine(string.Join(", ", constraints));
        }
    }

    public static void WriteContainingTypesEnd(StringBuilder builder, INamedTypeSymbol type)
    {
        for (INamedTypeSymbol? current = type.ContainingType; current is not null; current = current.ContainingType)
            _ = builder.AppendLine("}");
    }

    public static void WritePartialTypeStart(StringBuilder builder, INamedTypeSymbol type)
    {
        _ = builder
            .Append("partial ")
            .Append(GetTypeKindKeyword(type))
            .Append(' ')
            .Append(type.Name)
            .Append(GetTypeParameters(type))
            .AppendLine();

        AppendTypeConstraints(builder, type);
        _ = builder.AppendLine("{");
    }

    /// <summary>
    /// Separates successive members inside a generated type body with a single blank line,
    /// without leaving a blank line right after the opening brace for the first member.
    /// </summary>
    public static void AppendMemberSeparator(StringBuilder builder, ref bool hasContent)
    {
        if (hasContent)
            _ = builder.AppendLine();

        hasContent = true;
    }
}
