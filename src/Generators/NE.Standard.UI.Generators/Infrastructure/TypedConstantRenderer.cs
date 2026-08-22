using System;
using System.Globalization;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;

namespace NE.Standard.UI.Generators.Infrastructure;

internal static class TypedConstantRenderer
{
    public static string Render(TypedConstant value)
    {
        if (value.IsNull)
            return "null";

        if (value.Kind == TypedConstantKind.Enum)
            return RenderEnumConstant(value);

        return value.Value switch
        {
            string text => SymbolDisplay.FormatLiteral(text, quote: true),
            char c => SymbolDisplay.FormatLiteral(c, quote: true),
            bool b => b ? "true" : "false",
            byte b8 => b8.ToString(CultureInfo.InvariantCulture),
            sbyte sb8 => sb8.ToString(CultureInfo.InvariantCulture),
            short s16 => s16.ToString(CultureInfo.InvariantCulture),
            ushort us16 => us16.ToString(CultureInfo.InvariantCulture),
            int i32 => i32.ToString(CultureInfo.InvariantCulture),
            uint ui32 => ui32.ToString(CultureInfo.InvariantCulture) + "U",
            long i64 => i64.ToString(CultureInfo.InvariantCulture) + "L",
            ulong ui64 => ui64.ToString(CultureInfo.InvariantCulture) + "UL",
            double d => d.ToString("R", CultureInfo.InvariantCulture) + "d",
            float f => f.ToString("R", CultureInfo.InvariantCulture) + "f",
            decimal m => m.ToString(CultureInfo.InvariantCulture) + "m",
            _ => value.Value?.ToString() ?? "null"
        };
    }

    private static string RenderEnumConstant(TypedConstant value)
    {
        if (value.Type is not INamedTypeSymbol enumType || value.Value is null)
            return "null";

        var enumTypeName = enumType.ToDisplayString(SymbolDisplayFormat.FullyQualifiedFormat);
        var rawValue = ToUInt64(value.Value);

        foreach (ISymbol member in enumType.GetMembers())
        {
            if (member is not IFieldSymbol field)
                continue;

            if (!field.HasConstantValue || field.ConstantValue is null)
                continue;

            if (ToUInt64(field.ConstantValue) == rawValue)
                return enumTypeName + "." + field.Name;
        }

        return RenderEnumCast(enumTypeName, enumType, value.Value);
    }

    private static ulong ToUInt64(object value)
        => value switch
        {
            byte v => v,
            sbyte v => unchecked((ulong)v),
            short v => unchecked((ulong)v),
            ushort v => v,
            int v => unchecked((ulong)v),
            uint v => v,
            long v => unchecked((ulong)v),
            ulong v => v,
            _ => Convert.ToUInt64(value, CultureInfo.InvariantCulture)
        };

    private static string RenderEnumCast(string enumTypeName, INamedTypeSymbol enumType, object value)
    {
        SpecialType underlyingType = enumType.EnumUnderlyingType?.SpecialType ?? SpecialType.System_Int32;

        return underlyingType is SpecialType.System_Byte or SpecialType.System_UInt16 or SpecialType.System_UInt32 or SpecialType.System_UInt64
            ? "(" + enumTypeName + ")" + Convert.ToUInt64(value, CultureInfo.InvariantCulture).ToString(CultureInfo.InvariantCulture)
            : "(" + enumTypeName + ")" + Convert.ToInt64(value, CultureInfo.InvariantCulture).ToString(CultureInfo.InvariantCulture);
    }
}
