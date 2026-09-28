using System.Collections.Generic;
using System.Threading;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using NE.Standard.UI.Generators.Infrastructure;

namespace NE.Standard.UI.Generators.RecursiveMembers;

/// <summary>
/// The recursive-member generator's transform: everything read off symbols and the compilation — the validation included — so
/// the model that leaves it is plain data the incremental driver can compare.
/// </summary>
internal static class RecursiveMemberModelFactory
{
    private const string HintSuffix = "RecursiveMembers";

    public static RecursiveMemberModel? CreateMemberModel(GeneratorAttributeSyntaxContext context, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (context.TargetNode is not BasePropertyDeclarationSyntax propertySyntax)
            return null;

        if (context.TargetSymbol is not IPropertySymbol property)
            return null;

        INamedTypeSymbol? containingType = property.ContainingType;

        if (containingType is null)
            return null;

        AttributeData? attribute = null;

        foreach (AttributeData candidate in property.GetAttributes())
        {
            if (candidate.AttributeClass?.ToDisplayString() == RecursiveMemberNames.AttributeMetadataName)
            {
                attribute = candidate;
                break;
            }
        }

        if (attribute is null)
            return null;

        INamedTypeSymbol? recursiveObservableType = context.SemanticModel.Compilation.GetTypeByMetadataName(RecursiveMemberNames.RecursiveObservableMetadataName);
        RecursiveMemberAttributeValues values = RecursiveMemberAttributeValues.From(attribute);
        List<DiagnosticInfo> diagnostics = [];

        ValidateMember(propertySyntax, property, containingType, values, diagnostics);

        return new RecursiveMemberModel(
            Owner: CreateOwnerModel(containingType, recursiveObservableType),
            Name: property.Name,
            Type: property.Type.ToGlobalTypeDisplayString(),
            PatternType: property.Type.ToPatternTypeDisplayString(),
            IsNullable: property.Type.IsNullable(),
            CanHoldRecursiveObservable: recursiveObservableType is not null && CanHoldRecursiveObservable(property.Type, recursiveObservableType),
            CanSet: property.SetMethod is not null && !property.SetMethod.IsInitOnly,
            Generate: values.Generate,
            PropertyAccessibility: GetAccessibility(property.DeclaredAccessibility),
            GetterAccessibility: GetAccessorAccessibility(property.GetMethod?.DeclaredAccessibility, property.DeclaredAccessibility),
            SetterAccessibility: GetAccessorAccessibility(property.SetMethod?.DeclaredAccessibility, property.DeclaredAccessibility),
            Diagnostics: diagnostics.ToEquatableArray()
        );
    }

    private static void ValidateMember(BasePropertyDeclarationSyntax propertySyntax, IPropertySymbol property, INamedTypeSymbol containingType, RecursiveMemberAttributeValues values, List<DiagnosticInfo> diagnostics)
    {
        if (property.IsStatic)
            diagnostics.Add(DiagnosticInfo.Create(RecursiveMemberDiagnostics.RecursiveMemberCannotBeStatic, property, property.Name));

        if (property.Parameters.Length != 0)
            diagnostics.Add(DiagnosticInfo.Create(RecursiveMemberDiagnostics.RecursiveMemberCannotBeIndexer, property, property.Name));

        ValidateGeneratedMemberConflict(property, containingType, RecursiveMemberNames.GetSegmentFieldName(property.Name), diagnostics);

        if (!values.Generate)
            return;

        if (!propertySyntax.Modifiers.Any(SyntaxKind.PartialKeyword))
            diagnostics.Add(DiagnosticInfo.Create(RecursiveMemberDiagnostics.GeneratedPropertyMustBePartial, property, property.Name));

        if (property.SetMethod is null)
            diagnostics.Add(DiagnosticInfo.Create(RecursiveMemberDiagnostics.GeneratedPropertyMustHaveSetter, property, property.Name));
        else if (property.SetMethod.IsInitOnly)
            diagnostics.Add(DiagnosticInfo.Create(RecursiveMemberDiagnostics.GeneratedPropertyCannotBeInitOnly, property, property.Name));
    }

    private static void ValidateGeneratedMemberConflict(IPropertySymbol property, INamedTypeSymbol containingType, string memberName, List<DiagnosticInfo> diagnostics)
    {
        foreach (ISymbol member in containingType.GetMembers(memberName))
        {
            if (SymbolEqualityComparer.Default.Equals(member, property))
                continue;

            diagnostics.Add(DiagnosticInfo.Create(RecursiveMemberDiagnostics.GeneratedMemberConflict, property, memberName, containingType.ToDisplayString()));
            return;
        }
    }

    private static RecursiveOwnerModel CreateOwnerModel(INamedTypeSymbol type, INamedTypeSymbol? recursiveObservableType)
        => new(
            Declaration: GeneratedTypeModel.From(type, HintSuffix),
            Name: type.Name,
            IsOrdinaryClass: type.TypeKind == TypeKind.Class && !type.IsRecord,
            InheritsRecursiveObservable: recursiveObservableType is not null && type.InheritsFrom(recursiveObservableType),
            ConstructorAccessibility: GetConstructorAccessibility(type)
        );

    /// <summary>The accessibility of the initialization constructor to generate, or <see langword="null"/> when the type declares one of its own.</summary>
    private static string? GetConstructorAccessibility(INamedTypeSymbol type)
    {
        if (HasExplicitInstanceConstructor(type))
            return null;

        if (HasPrimaryConstructor(type))
            return null;

        // Public even on an internal type: ActivatorUtilities only looks at public constructors, so an internal one fails DI at runtime.
        return type.IsAbstract ? "protected" : "public";
    }

    private static bool HasExplicitInstanceConstructor(INamedTypeSymbol type)
    {
        foreach (IMethodSymbol constructor in type.InstanceConstructors)
        {
            if (!constructor.IsImplicitlyDeclared)
                return true;
        }

        return false;
    }

    private static bool HasPrimaryConstructor(INamedTypeSymbol type)
    {
        foreach (SyntaxReference reference in type.DeclaringSyntaxReferences)
        {
            if (reference.GetSyntax() is TypeDeclarationSyntax declaration && declaration.ParameterList is { Parameters.Count: > 0 })
                return true;
        }

        return false;
    }

    /// <summary>Whether a declared type can hold a <c>RecursiveObservable</c> and needs generated descent; not "any reference type" — emitting the pattern against an unrelated class fails to compile (CS8121).</summary>
    private static bool CanHoldRecursiveObservable(ITypeSymbol type, INamedTypeSymbol recursiveObservableType)
        => type.InheritsFromOrEquals(recursiveObservableType) ||
           type.TypeKind == TypeKind.Interface ||
           type.SpecialType == SpecialType.System_Object;

    private static string GetAccessibility(Accessibility accessibility)
        => accessibility switch
        {
            Accessibility.Public => "public",
            Accessibility.Internal => "internal",
            Accessibility.Protected => "protected",
            Accessibility.ProtectedAndInternal => "private protected",
            Accessibility.ProtectedOrInternal => "protected internal",
            Accessibility.Private => "private",
            _ => "private"
        };

    private static string GetAccessorAccessibility(Accessibility? accessorAccessibility, Accessibility propertyAccessibility)
    {
        if (accessorAccessibility is null || accessorAccessibility == Accessibility.NotApplicable || accessorAccessibility == propertyAccessibility)
            return string.Empty;

        return GetAccessibility(accessorAccessibility.Value);
    }
}
