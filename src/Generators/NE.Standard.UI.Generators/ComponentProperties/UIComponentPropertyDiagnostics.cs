using Microsoft.CodeAnalysis;

namespace NE.Standard.UI.Generators.ComponentProperties;

internal static class UIComponentPropertyDiagnostics
{
    public static readonly DiagnosticDescriptor ComponentMustBePartial = new(
        id: "NEUI001",
        title: "Component type must be partial",
        messageFormat: "Component type '{0}' must be partial to generate UI property members",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor GeneratedMemberConflict = new(
        id: "NEUI002",
        title: "Generated member conflicts with existing member",
        messageFormat: "Generated member '{0}' conflicts with an existing member on '{1}'",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor ContractPropertyNotFound = new(
        id: "NEUI003",
        title: "Contract UIProperty was not found",
        messageFormat: "Contract type '{0}' does not contain static UIProperty '{1}'",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor InvalidDefaultValueConfiguration = new(
        id: "NEUI004",
        title: "Invalid default value configuration",
        messageFormat: "{0}",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor InvalidBindableConfiguration = new(
        id: "NEUI005",
        title: "Invalid bindable configuration",
        messageFormat: "Property '{0}' cannot generate bind methods when IsBindable is false",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor InvalidSelfType = new(
        id: "NEUI006",
        title: "Cannot resolve component self type",
        messageFormat: "Component type '{0}' must either be generic or directly usable as the PropertyRegister component type",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor PropertyMustBeSettable = new(
        id: "NEUI007",
        title: "Property must be settable",
        messageFormat: "Property '{0}' must have a setter to generate Set{0}",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor DefaultValueMemberNotFound = new(
        id: "NEUI008",
        title: "Default value member was not found",
        messageFormat: "Default value member '{0}' was not found on component type '{1}'",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor InvalidDefaultValueMemberKind = new(
        id: "NEUI009",
        title: "Invalid default value member kind",
        messageFormat: "Default value member '{0}' on component type '{1}' must be a static field, static property, or static parameterless method",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor PropertyMustBePublic = new(
        id: "NEUI010",
        title: "Component property must be public",
        messageFormat: "Property '{0}' must be public to generate UI property members",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor PropertyCannotBeStatic = new(
        id: "NEUI011",
        title: "Component property cannot be static",
        messageFormat: "Property '{0}' cannot be static to generate UI property members",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor BlockContractNotAnInterface = new(
        id: "NEUI013",
        title: "Property block contract must be an interface",
        messageFormat: "Property block contract '{0}' on '{1}' must be an interface carrying [UIComponentProperty] members",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor BlockContractHasNoProperties = new(
        id: "NEUI014",
        title: "Property block contract declares no properties",
        messageFormat: "Property block contract '{0}' on '{1}' declares no [UIComponentProperty] members",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor BlockPropertyTypeMismatch = new(
        id: "NEUI015",
        title: "Manual property does not match the block it overrides",
        messageFormat: "Property '{0}' on '{1}' is typed '{2}' but the '{3}' block declares it as '{4}'",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );

    public static readonly DiagnosticDescriptor PropertyCannotBeIndexer = new(
        id: "NEUI012",
        title: "Component property cannot be indexer",
        messageFormat: "Property '{0}' cannot be indexer to generate UI property members",
        category: "NE.Standard.UI",
        defaultSeverity: DiagnosticSeverity.Error,
        isEnabledByDefault: true
    );
}
