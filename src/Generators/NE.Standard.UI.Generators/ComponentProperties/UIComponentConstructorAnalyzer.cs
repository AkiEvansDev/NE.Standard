using System;
using System.Collections.Immutable;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis.Operations;

namespace NE.Standard.UI.Generators.ComponentProperties;

/// <summary>
/// Forbids assigning a <c>[UIComponentProperty]</c> inside a component's constructor: defaults belong in metadata so
/// <c>SetDefaults&lt;TDescendant&gt;</c> can distinguish an authored value from a type default.
/// </summary>
[DiagnosticAnalyzer(LanguageNames.CSharp)]
public sealed class UIComponentConstructorAnalyzer : DiagnosticAnalyzer
{
    /// <inheritdoc/>
    public override ImmutableArray<DiagnosticDescriptor> SupportedDiagnostics { get; }
        = [UIComponentPropertyDiagnostics.ConstructorAssignsComponentProperty];

    /// <inheritdoc/>
    public override void Initialize(AnalysisContext context)
    {
        context.ConfigureGeneratedCodeAnalysis(GeneratedCodeAnalysisFlags.None);
        context.EnableConcurrentExecution();
        context.RegisterCompilationStartAction(RegisterCompilation);
    }

    private static void RegisterCompilation(CompilationStartAnalysisContext compilationContext)
    {
        INamedTypeSymbol? bindableComponent = compilationContext.Compilation.GetTypeByMetadataName(UIComponentPropertyNames.BindableComponentMetadataName);
        INamedTypeSymbol? propertyAttribute = compilationContext.Compilation.GetTypeByMetadataName(UIComponentPropertyNames.AttributeMetadataName);
        INamedTypeSymbol? blockAttribute = compilationContext.Compilation.GetTypeByMetadataName(UIComponentPropertyNames.BlockAttributeMetadataName);

        if (propertyAttribute is null)
            return;

        compilationContext.RegisterOperationBlockStartAction(blockContext => RegisterConstructor(blockContext, bindableComponent, propertyAttribute, blockAttribute));
    }

    private static void RegisterConstructor(OperationBlockStartAnalysisContext blockContext, INamedTypeSymbol? bindableComponent, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute)
    {
        if (blockContext.OwningSymbol is not IMethodSymbol { MethodKind: MethodKind.Constructor, IsStatic: false } constructor)
            return;

        if (constructor.ContainingType is not { } containingType || !IsComponentType(containingType, bindableComponent, propertyAttribute, blockAttribute))
            return;

        blockContext.RegisterOperationAction(operationContext => AnalyzeAssignment(operationContext, constructor, containingType, propertyAttribute, blockAttribute), OperationKind.SimpleAssignment, OperationKind.CompoundAssignment, OperationKind.CoalesceAssignment);
        blockContext.RegisterOperationAction(operationContext => AnalyzeInvocation(operationContext, constructor, containingType, propertyAttribute, blockAttribute), OperationKind.Invocation);
    }

    private static bool IsComponentType(INamedTypeSymbol type, INamedTypeSymbol? bindableComponent, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute)
    {
        if (bindableComponent is not null && ImplementsInterface(type, bindableComponent))
            return true;

        for (INamedTypeSymbol? current = type; current is not null && current.SpecialType != SpecialType.System_Object; current = current.BaseType)
        {
            if (blockAttribute is not null && HasAttribute(current, blockAttribute))
                return true;

            foreach (ISymbol member in current.GetMembers())
            {
                if (member is IPropertySymbol { IsStatic: false } property && HasAttribute(property, propertyAttribute))
                    return true;
            }
        }

        return false;
    }

    private static bool ImplementsInterface(INamedTypeSymbol type, INamedTypeSymbol target)
    {
        foreach (INamedTypeSymbol candidate in type.AllInterfaces)
        {
            if (SymbolEqualityComparer.Default.Equals(candidate, target))
                return true;
        }

        return false;
    }

    private static bool HasAttribute(ISymbol symbol, INamedTypeSymbol attributeType)
    {
        foreach (AttributeData attribute in symbol.GetAttributes())
        {
            if (SymbolEqualityComparer.Default.Equals(attribute.AttributeClass, attributeType))
                return true;
        }

        return false;
    }

    private static void AnalyzeAssignment(OperationAnalysisContext context, IMethodSymbol constructor, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute)
    {
        IAssignmentOperation assignment = (IAssignmentOperation)context.Operation;

        if (assignment.Target is not IPropertyReferenceOperation propertyReference || !IsThisReceiver(propertyReference.Instance, containingType))
            return;

        if (!IsComponentProperty(propertyReference.Property, propertyAttribute, blockAttribute))
            return;

        context.ReportDiagnostic(Diagnostic.Create(UIComponentPropertyDiagnostics.ConstructorAssignsComponentProperty, assignment.Syntax.GetLocation(), constructor.ContainingType.Name, propertyReference.Property.Name));
    }

    private static void AnalyzeInvocation(OperationAnalysisContext context, IMethodSymbol constructor, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute)
    {
        IInvocationOperation invocation = (IInvocationOperation)context.Operation;
        IMethodSymbol target = invocation.TargetMethod;

        if (!target.Name.StartsWith("Set", StringComparison.Ordinal) || target.Name.Length <= 3 || !IsThisInvocation(invocation, containingType))
            return;

        var propertyName = target.Name.Substring(3);

        if (!HasComponentPropertyNamed(containingType, propertyName, propertyAttribute, blockAttribute))
            return;

        context.ReportDiagnostic(Diagnostic.Create(UIComponentPropertyDiagnostics.ConstructorAssignsComponentProperty, invocation.Syntax.GetLocation(), constructor.ContainingType.Name, propertyName));
    }

    private static bool IsThisInvocation(IInvocationOperation invocation, INamedTypeSymbol containingType)
    {
        if (IsThisReceiver(invocation.Instance, containingType))
            return true;

        return invocation.Instance is null
            && invocation.TargetMethod.IsExtensionMethod
            && invocation.Arguments.Length > 0
            && IsThisReceiver(invocation.Arguments[0].Value, containingType);
    }

    private static bool IsThisReceiver(IOperation? operation, INamedTypeSymbol containingType)
    {
        IOperation? current = operation;

        while (current is not null)
        {
            switch (current)
            {
                case IInstanceReferenceOperation { ReferenceKind: InstanceReferenceKind.ContainingTypeInstance }:
                    return true;
                case IConversionOperation conversion:
                    current = conversion.Operand;
                    break;
                case IInvocationOperation chained when IsSelfType(chained.Type, containingType):
                    current = chained.Instance is not null
                        ? chained.Instance
                        : chained.TargetMethod.IsExtensionMethod && chained.Arguments.Length > 0 ? chained.Arguments[0].Value : null;
                    break;
                default:
                    return false;
            }
        }

        return false;
    }

    private static bool IsSelfType(ITypeSymbol? type, INamedTypeSymbol containingType)
    {
        if (type is null)
            return false;

        if (type is ITypeParameterSymbol)
            return true;

        if (SymbolEqualityComparer.Default.Equals(type, containingType))
            return true;

        for (INamedTypeSymbol? current = containingType.BaseType; current is not null && current.SpecialType != SpecialType.System_Object; current = current.BaseType)
        {
            if (SymbolEqualityComparer.Default.Equals(type, current))
                return true;
        }

        return type is INamedTypeSymbol { TypeKind: TypeKind.Interface } contract && ImplementsInterface(containingType, contract);
    }

    private static bool HasComponentPropertyNamed(INamedTypeSymbol type, string propertyName, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute)
    {
        for (INamedTypeSymbol? current = type; current is not null && current.SpecialType != SpecialType.System_Object; current = current.BaseType)
        {
            foreach (ISymbol member in current.GetMembers(propertyName))
            {
                if (member is IPropertySymbol { IsStatic: false } property && IsComponentProperty(property, propertyAttribute, blockAttribute))
                    return true;
            }
        }

        return blockAttribute is not null && BlockDeclaresProperty(type, propertyName, propertyAttribute, blockAttribute);
    }

    private static bool IsComponentProperty(IPropertySymbol property, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute)
    {
        for (IPropertySymbol? current = property; current is not null; current = current.OverriddenProperty)
        {
            if (HasAttribute(current, propertyAttribute) || HasAttribute(current.OriginalDefinition, propertyAttribute))
                return true;

            if (blockAttribute is not null && current.ContainingType is { } owner && BlockDeclaresProperty(owner, current.Name, propertyAttribute, blockAttribute))
                return true;
        }

        return false;
    }

    private static bool BlockDeclaresProperty(INamedTypeSymbol type, string propertyName, INamedTypeSymbol propertyAttribute, INamedTypeSymbol blockAttribute)
    {
        for (INamedTypeSymbol? current = type; current is not null && current.SpecialType != SpecialType.System_Object; current = current.BaseType)
        {
            foreach (AttributeData attribute in current.GetAttributes())
            {
                if (!SymbolEqualityComparer.Default.Equals(attribute.AttributeClass, blockAttribute))
                    continue;

                if (attribute.ConstructorArguments.Length == 1
                    && attribute.ConstructorArguments[0].Value is INamedTypeSymbol { TypeKind: TypeKind.Interface } contract
                    && ContractDeclaresProperty(contract, propertyName, propertyAttribute))
                {
                    return true;
                }
            }
        }

        return false;
    }

    private static bool ContractDeclaresProperty(INamedTypeSymbol contract, string propertyName, INamedTypeSymbol propertyAttribute)
    {
        foreach (ISymbol member in contract.GetMembers(propertyName))
        {
            if (member is IPropertySymbol { IsStatic: false } candidate && HasAttribute(candidate, propertyAttribute))
                return true;
        }

        foreach (INamedTypeSymbol inherited in contract.AllInterfaces)
        {
            foreach (ISymbol member in inherited.GetMembers(propertyName))
            {
                if (member is IPropertySymbol { IsStatic: false } candidate && HasAttribute(candidate, propertyAttribute))
                    return true;
            }
        }

        return false;
    }
}
