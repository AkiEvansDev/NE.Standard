using System.Collections.Generic;
using Microsoft.CodeAnalysis;
using NE.Standard.UI.Generators.Infrastructure;

namespace NE.Standard.UI.Generators.RecursiveMembers;

/// <summary>
/// A type the recursive-member generator writes into; <paramref name="ConstructorAccessibility"/> is <see langword="null"/> when
/// the type declares a constructor of its own and none is generated.
/// </summary>
internal sealed record RecursiveOwnerModel(GeneratedTypeModel Declaration, string Name, bool IsOrdinaryClass, bool InheritsRecursiveObservable, string? ConstructorAccessibility);

/// <summary>
/// One <c>[RecursiveMember]</c> property, with every string the emitter writes and the diagnostics its validation reported.
/// </summary>
internal sealed record RecursiveMemberModel(RecursiveOwnerModel Owner, string Name, string Type, string PatternType, bool IsNullable, bool CanHoldRecursiveObservable, bool CanSet, bool Generate, string PropertyAccessibility, string PropertyModifiers, string GetterAccessibility, string SetterAccessibility, EquatableArray<DiagnosticInfo> Diagnostics)
{
    /// <summary>Whether validation refused the member; every diagnostic it reports is an error.</summary>
    public bool HasErrors
        => Diagnostics.Count > 0;
}

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
