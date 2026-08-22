using Microsoft.CodeAnalysis;

namespace NE.Standard.UI.Generators.RecursiveMembers;

internal static class RecursiveMemberDiagnostics
{
    public static readonly DiagnosticDescriptor OwnerMustInheritRecursiveObservable = new(
        id: "NEUIR001",
        title: "Type must inherit RecursiveObservable",
        messageFormat: "Type '{0}' must inherit RecursiveObservable to use RecursiveMember",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor OwnerMustBePartial = new(
        id: "NEUIR002",
        title: "Type must be partial",
        messageFormat: "Type '{0}' must be partial to generate recursive members",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor OwnerMustBeOrdinaryClass = new(
        id: "NEUIR003",
        title: "Type must be an ordinary class",
        messageFormat: "Type '{0}' must be an ordinary partial class to generate recursive members",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor GeneratedPropertyMustBePartial = new(
        id: "NEUIR004",
        title: "Generated recursive property must be partial",
        messageFormat: "Property '{0}' must be partial when RecursiveMember.Generate is true",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor GeneratedPropertyMustHaveSetter = new(
        id: "NEUIR005",
        title: "Generated recursive property must have setter",
        messageFormat: "Property '{0}' must have a setter when RecursiveMember.Generate is true",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor GeneratedPropertyCannotBeInitOnly = new(
        id: "NEUIR006",
        title: "Generated recursive property cannot be init-only",
        messageFormat: "Property '{0}' cannot be init-only when RecursiveMember.Generate is true",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor RecursiveMemberCannotBeStatic = new(
        id: "NEUIR007",
        title: "Recursive member cannot be static",
        messageFormat: "Property '{0}' cannot be static",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor RecursiveMemberCannotBeIndexer = new(
        id: "NEUIR008",
        title: "Recursive member cannot be indexer",
        messageFormat: "Property '{0}' cannot have index parameters",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor GeneratedMemberConflict = new(
        id: "NEUIR009",
        title: "Generated member conflicts with existing member",
        messageFormat: "Generated member '{0}' conflicts with an existing member on '{1}'",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );
}
