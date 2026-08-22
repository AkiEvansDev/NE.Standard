namespace NE.Standard.UI.Generators.Infrastructure;

internal static class IdentifierValidator
{
    public static bool IsSimpleIdentifier(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
            return false;

        if (!IsIdentifierStart(value[0]))
            return false;

        for (var i = 1; i < value.Length; i++)
        {
            if (!IsIdentifierPart(value[i]))
                return false;
        }

        return true;
    }

    private static bool IsIdentifierStart(char c)
        => c == '_' || char.IsLetter(c);

    private static bool IsIdentifierPart(char c)
        => c == '_' || char.IsLetterOrDigit(c);
}
