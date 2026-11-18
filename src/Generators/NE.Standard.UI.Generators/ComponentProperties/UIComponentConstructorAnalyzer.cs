using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Threading;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Diagnostics;
using Microsoft.CodeAnalysis.Operations;
using NE.Standard.UI.Generators.Infrastructure;

namespace NE.Standard.UI.Generators.ComponentProperties;

/// <summary>
/// Forbids assigning a <c>[UIComponentProperty]</c> inside a component's constructor or inline property initializer: defaults belong in
/// metadata so <c>SetDefaults&lt;TDescendant&gt;</c> can distinguish an authored value from a type default.
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

        compilationContext.RegisterOperationAction(operationContext => AnalyzePropertyInitializer(operationContext, bindableComponent, propertyAttribute, blockAttribute), OperationKind.PropertyInitializer);
        compilationContext.RegisterOperationBlockStartAction(blockContext => RegisterConstructor(blockContext, bindableComponent, propertyAttribute, blockAttribute));
    }

    private static void AnalyzePropertyInitializer(OperationAnalysisContext context, INamedTypeSymbol? bindableComponent, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute)
    {
        IPropertyInitializerOperation initializer = (IPropertyInitializerOperation)context.Operation;

        if (IsDefaultOrNullInitializer(initializer.Value))
            return;

        foreach (IPropertySymbol property in initializer.InitializedProperties)
        {
            if (property.IsStatic || property.SetMethod is null || property.ContainingType is not { } containingType)
                continue;

            if (!IsComponentType(containingType, bindableComponent, propertyAttribute, blockAttribute) || !IsComponentProperty(property, propertyAttribute, blockAttribute))
                continue;

            context.ReportDiagnostic(Diagnostic.Create(UIComponentPropertyDiagnostics.ConstructorAssignsComponentProperty, initializer.Syntax.GetLocation(), containingType.Name, property.Name));
        }
    }

    private static bool IsDefaultOrNullInitializer(IOperation value)
    {
        IOperation current = value;

        while (current is IConversionOperation conversion)
            current = conversion.Operand;

        return current.Kind == OperationKind.DefaultValue || (current.ConstantValue is { HasValue: true, Value: null });
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
        if (bindableComponent is not null && type.ImplementsInterface(bindableComponent))
            return true;

        for (INamedTypeSymbol? current = type; current is not null && current.SpecialType != SpecialType.System_Object; current = current.BaseType)
        {
            if (current.HasAttribute(blockAttribute))
                return true;

            foreach (ISymbol member in current.GetMembers())
            {
                if (member is IPropertySymbol { IsStatic: false } property && property.HasAttribute(propertyAttribute))
                    return true;
            }
        }

        return false;
    }

    private static void AnalyzeAssignment(OperationAnalysisContext context, IMethodSymbol constructor, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute)
    {
        IAssignmentOperation assignment = (IAssignmentOperation)context.Operation;

        if (assignment.Target is not IPropertyReferenceOperation propertyReference || !IsReceiver(propertyReference.Instance, containingType, selfParameter: null))
            return;

        if (!IsComponentProperty(propertyReference.Property, propertyAttribute, blockAttribute))
            return;

        context.ReportDiagnostic(Diagnostic.Create(UIComponentPropertyDiagnostics.ConstructorAssignsComponentProperty, assignment.Syntax.GetLocation(), constructor.ContainingType.Name, propertyReference.Property.Name));
    }

    private static void AnalyzeInvocation(OperationAnalysisContext context, IMethodSymbol constructor, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute)
    {
        IInvocationOperation invocation = (IInvocationOperation)context.Operation;

        if (!IsReceiverInvocation(invocation, containingType, selfParameter: null))
            return;

        IMethodSymbol target = invocation.TargetMethod;

        if (target.MethodKind != MethodKind.Ordinary)
            return;

        if (TryGetDirectSetterProperty(target, containingType, propertyAttribute, blockAttribute, out var directProperty))
        {
            context.ReportDiagnostic(Diagnostic.Create(UIComponentPropertyDiagnostics.ConstructorAssignsComponentProperty, invocation.Syntax.GetLocation(), constructor.ContainingType.Name, directProperty));
            return;
        }

        List<string>? mutated = null;
        HashSet<IMethodSymbol>? visited = null;
        CollectHelperMutations(invocation.SemanticModel, target, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, context.CancellationToken);

        if (mutated is null)
            return;

        foreach (var propertyName in mutated)
            context.ReportDiagnostic(Diagnostic.Create(UIComponentPropertyDiagnostics.ConstructorAssignsComponentProperty, invocation.Syntax.GetLocation(), constructor.ContainingType.Name, propertyName));
    }

    private static bool TryGetDirectSetterProperty(IMethodSymbol target, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, out string propertyName)
        => TryGetDirectSetterPropertyByName(target.Name, containingType, propertyAttribute, blockAttribute, out propertyName);

    private static bool TryGetDirectSetterPropertyByName(string methodName, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, out string propertyName)
    {
        if (methodName.StartsWith("Set", StringComparison.Ordinal) && methodName.Length > 3)
        {
            var candidate = methodName.Substring(3);

            if (HasComponentPropertyNamed(containingType, candidate, propertyAttribute, blockAttribute))
            {
                propertyName = candidate;
                return true;
            }
        }

        var mapped = methodName switch
        {
            "Disable" => "Disabled",
            "Hide" => "Visibility",
            "Virtualized" => "Virtualize",
            "SetAutoGrow" => "Rows",
            "SetExpandable" => "ShowExpandButton",
            "SetOrderedMin" or "SetOrderedRange" => "Min",
            "SetOrderedMax" => "Max",
            _ => null
        };

        if (mapped is not null && HasComponentPropertyNamed(containingType, mapped, propertyAttribute, blockAttribute))
        {
            propertyName = mapped;
            return true;
        }

        propertyName = string.Empty;
        return false;
    }

    private static void CollectHelperMutations(SemanticModel? semanticModel, IMethodSymbol method, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, ref HashSet<IMethodSymbol>? visited, ref List<string>? mutated, CancellationToken cancellationToken)
    {
        IMethodSymbol definition = method.ReducedFrom ?? method.OriginalDefinition;

        if (definition.DeclaringSyntaxReferences.IsEmpty)
            return;

        visited ??= [with(SymbolEqualityComparer.Default)];

        if (!visited.Add(definition))
            return;

        IParameterSymbol? selfParameter = definition.IsStatic && definition.Parameters.Length > 0 ? definition.Parameters[0] : null;

        foreach (SyntaxReference syntaxReference in definition.DeclaringSyntaxReferences)
        {
            SyntaxNode syntax = syntaxReference.GetSyntax(cancellationToken);

            if (syntax is not (MethodDeclarationSyntax or LocalFunctionStatementSyntax))
                continue;

            if (semanticModel is not null && syntax.SyntaxTree == semanticModel.SyntaxTree && semanticModel.GetOperation(syntax, cancellationToken) is { } root)
            {
                CollectOperationMutations(semanticModel, root, containingType, selfParameter, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
            }
            else
            {
                CollectSyntaxMutations(syntax, selfParameter?.Name, containingType, propertyAttribute, blockAttribute, ref mutated);
            }
        }
    }

    private static void CollectOperationMutations(SemanticModel semanticModel, IOperation root, INamedTypeSymbol containingType, IParameterSymbol? selfParameter, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, ref HashSet<IMethodSymbol>? visited, ref List<string>? mutated, CancellationToken cancellationToken)
    {
        foreach (IOperation operation in root.Descendants())
        {
            switch (operation)
            {
                case IAssignmentOperation { Target: IPropertyReferenceOperation propertyReference }
                    when IsReceiver(propertyReference.Instance, containingType, selfParameter)
                        && IsComponentProperty(propertyReference.Property, propertyAttribute, blockAttribute):
                    AddUnique(ref mutated, propertyReference.Property.Name);
                    break;

                case IInvocationOperation nestedInvocation
                    when IsReceiverInvocation(nestedInvocation, containingType, selfParameter):
                    if (TryGetDirectSetterProperty(nestedInvocation.TargetMethod, containingType, propertyAttribute, blockAttribute, out var directProperty))
                        AddUnique(ref mutated, directProperty);
                    else
                        CollectHelperMutations(semanticModel, nestedInvocation.TargetMethod, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
                    break;

                default:
                    break;
            }
        }
    }

    private static void CollectSyntaxMutations(SyntaxNode root, string? selfParameterName, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, ref List<string>? mutated)
    {
        foreach (SyntaxNode node in root.DescendantNodes())
        {
            switch (node)
            {
                case AssignmentExpressionSyntax { Left: IdentifierNameSyntax identifier } assignment
                    when assignment.Parent is not InitializerExpressionSyntax
                        && selfParameterName is null
                        && !DeclaresLocalOrParameter(root, identifier.Identifier.ValueText)
                        && HasComponentPropertyNamed(containingType, identifier.Identifier.ValueText, propertyAttribute, blockAttribute):
                    AddUnique(ref mutated, identifier.Identifier.ValueText);
                    break;

                case AssignmentExpressionSyntax { Left: MemberAccessExpressionSyntax memberAccess }
                    when IsSelfSyntax(memberAccess.Expression, selfParameterName)
                        && HasComponentPropertyNamed(containingType, memberAccess.Name.Identifier.ValueText, propertyAttribute, blockAttribute):
                    AddUnique(ref mutated, memberAccess.Name.Identifier.ValueText);
                    break;

                case InvocationExpressionSyntax { Expression: IdentifierNameSyntax callIdentifier }
                    when selfParameterName is null && TryGetDirectSetterPropertyByName(callIdentifier.Identifier.ValueText, containingType, propertyAttribute, blockAttribute, out var directCallProperty):
                    AddUnique(ref mutated, directCallProperty);
                    break;

                case InvocationExpressionSyntax { Expression: MemberAccessExpressionSyntax callMember }
                    when IsSelfSyntax(callMember.Expression, selfParameterName)
                        && TryGetDirectSetterPropertyByName(callMember.Name.Identifier.ValueText, containingType, propertyAttribute, blockAttribute, out var memberCallProperty):
                    AddUnique(ref mutated, memberCallProperty);
                    break;

                default:
                    break;
            }
        }
    }

    private static bool DeclaresLocalOrParameter(SyntaxNode root, string name)
    {
        BaseParameterListSyntax? parameters = root switch
        {
            MethodDeclarationSyntax method => method.ParameterList,
            LocalFunctionStatementSyntax localFunction => localFunction.ParameterList,
            _ => null
        };

        if (parameters is not null)
        {
            foreach (ParameterSyntax parameter in parameters.Parameters)
            {
                if (parameter.Identifier.ValueText == name)
                    return true;
            }
        }

        foreach (SyntaxNode node in root.DescendantNodes())
        {
            if (node is VariableDeclaratorSyntax declarator && declarator.Identifier.ValueText == name)
                return true;

            if (node is SingleVariableDesignationSyntax designation && designation.Identifier.ValueText == name)
                return true;
        }

        return false;
    }

    private static bool IsSelfSyntax(ExpressionSyntax expression, string? selfParameterName)
        => selfParameterName is null
            ? expression is ThisExpressionSyntax
            : expression is IdentifierNameSyntax id && id.Identifier.ValueText == selfParameterName;

    private static void AddUnique(ref List<string>? list, string value)
    {
        list ??= [];

        if (!list.Contains(value))
            list.Add(value);
    }

    private static bool IsReceiverInvocation(IInvocationOperation invocation, INamedTypeSymbol containingType, IParameterSymbol? selfParameter)
    {
        if (IsReceiver(invocation.Instance, containingType, selfParameter))
            return true;

        if (invocation.Instance is not null)
            return false;

        if (invocation.TargetMethod.IsExtensionMethod && invocation.Arguments.Length > 0)
            return IsReceiver(invocation.Arguments[0].Value, containingType, selfParameter);

        return invocation.TargetMethod.ReducedFrom is not null && IsReceiver(invocation.Instance, containingType, selfParameter);
    }

    private static bool IsReceiver(IOperation? operation, INamedTypeSymbol containingType, IParameterSymbol? selfParameter)
    {
        IOperation? current = operation;

        while (current is not null)
        {
            switch (current)
            {
                case IInstanceReferenceOperation { ReferenceKind: InstanceReferenceKind.ContainingTypeInstance } when selfParameter is null:
                    return true;
                case IParameterReferenceOperation parameterReference when selfParameter is not null && SymbolEqualityComparer.Default.Equals(parameterReference.Parameter, selfParameter):
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

        if (type.InheritsFromOrEquals(containingType) || containingType.InheritsFromOrEquals(type as INamedTypeSymbol ?? containingType))
            return SymbolEqualityComparer.Default.Equals(type, containingType) || (type is INamedTypeSymbol baseCandidate && containingType.InheritsFrom(baseCandidate));

        return type is INamedTypeSymbol { TypeKind: TypeKind.Interface } contract && containingType.ImplementsInterface(contract);
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

        return type.BlockDeclaresProperty(propertyName, propertyAttribute, blockAttribute);
    }

    private static bool IsComponentProperty(IPropertySymbol property, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute)
    {
        if (property.ContainingType.TypeKind != TypeKind.Interface && property.SetMethod is not { DeclaredAccessibility: Accessibility.Public, IsInitOnly: false })
            return false;

        for (IPropertySymbol? current = property; current is not null; current = current.OverriddenProperty)
        {
            if (current.HasAttribute(propertyAttribute) || current.OriginalDefinition.HasAttribute(propertyAttribute))
                return true;

            if (current.ContainingType is { } owner && owner.BlockDeclaresProperty(current.Name, propertyAttribute, blockAttribute))
                return true;
        }

        return false;
    }
}
