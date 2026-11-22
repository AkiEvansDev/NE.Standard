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
        compilationContext.RegisterOperationBlockStartAction(blockContext => RegisterConstructor(blockContext, compilationContext.Compilation, bindableComponent, propertyAttribute, blockAttribute));
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

    private static void RegisterConstructor(OperationBlockStartAnalysisContext blockContext, Compilation compilation, INamedTypeSymbol? bindableComponent, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute)
    {
        if (blockContext.OwningSymbol is not IMethodSymbol { MethodKind: MethodKind.Constructor, IsStatic: false } constructor)
            return;

        if (constructor.ContainingType is not { } containingType || !IsComponentType(containingType, bindableComponent, propertyAttribute, blockAttribute))
            return;

        blockContext.RegisterOperationAction(operationContext => AnalyzeAssignment(operationContext, constructor, containingType, propertyAttribute, blockAttribute), OperationKind.SimpleAssignment, OperationKind.CompoundAssignment, OperationKind.CoalesceAssignment);
        blockContext.RegisterOperationAction(operationContext => AnalyzeInvocation(operationContext, compilation, constructor, containingType, propertyAttribute, blockAttribute), OperationKind.Invocation);
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

    private static void AnalyzeInvocation(OperationAnalysisContext context, Compilation compilation, IMethodSymbol constructor, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute)
    {
        IInvocationOperation invocation = (IInvocationOperation)context.Operation;

        if (!IsReceiverInvocation(invocation, containingType, selfParameter: null, out var isDirectOrExtensionReceiver))
            return;

        IMethodSymbol target = invocation.TargetMethod;

        if (target.MethodKind != MethodKind.Ordinary)
            return;

        List<string>? mutated = null;

        if (!isDirectOrExtensionReceiver || !TryAddDirectSetterProperties(target, containingType, propertyAttribute, blockAttribute, ref mutated))
        {
            HashSet<IMethodSymbol>? visited = null;
            CollectHelperMutations(compilation, invocation.SemanticModel, target, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, context.CancellationToken);
        }

        if (mutated is null)
            return;

        foreach (var propertyName in mutated)
            context.ReportDiagnostic(Diagnostic.Create(UIComponentPropertyDiagnostics.ConstructorAssignsComponentProperty, invocation.Syntax.GetLocation(), constructor.ContainingType.Name, propertyName));
    }

    private static bool TryAddDirectSetterProperties(IMethodSymbol target, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, ref List<string>? mutated)
        => TryAddDirectSetterPropertiesByName(target.Name, containingType, propertyAttribute, blockAttribute, ref mutated);

    private static bool TryAddDirectSetterPropertiesByName(string methodName, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, ref List<string>? mutated)
    {
        var added = false;

        if (methodName.StartsWith("Set", StringComparison.Ordinal) && methodName.Length > 3)
        {
            var candidate = methodName.Substring(3);

            if (HasComponentPropertyNamed(containingType, candidate, propertyAttribute, blockAttribute))
            {
                AddUnique(ref mutated, candidate);
                added = true;
            }
        }

        var mapped = GetMappedProperties(methodName);

        if (mapped is not null)
        {
            for (var i = 0; i < mapped.Length; i++)
            {
                if (HasComponentPropertyNamed(containingType, mapped[i], propertyAttribute, blockAttribute))
                {
                    AddUnique(ref mutated, mapped[i]);
                    added = true;
                }
            }
        }

        return added;
    }

    private static string[]? GetMappedProperties(string methodName)
        => methodName switch
        {
            "Disable" => ["Disabled", "Enabled"],
            "Hide" => ["Visibility"],
            "Virtualized" => ["HostMode"],
            "SetAutoGrow" => ["MaxRows"],
            "SetCollapsed" => ["Expanded"],
            "SetRange" or "SetOrderedRange" => ["Min", "Max"],
            "SetOrderedMin" => ["Min"],
            "SetOrderedMax" => ["Max"],
            "VerticalScrollOnly" or "HorizontalScrollOnly" or "DisableScroll" or "BothScroll" or "NoScroll" or "SetScroll" => ["HorizontalScroll", "VerticalScroll"],
            "AnchorToEnd" => ["ScrollAnchor"],
            "SetActionBar" => ["ActionBar", "ActionBarRepeatInMore"],
            _ => null
        };

    private static void CollectHelperMutations(Compilation compilation, SemanticModel? semanticModel, IMethodSymbol method, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, ref HashSet<IMethodSymbol>? visited, ref List<string>? mutated, CancellationToken cancellationToken)
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
                CollectOperationMutations(compilation, semanticModel, root, containingType, selfParameter, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
            }
            else
            {
                HashSet<SyntaxNode>? visitedLocalFunctions = null;
                CollectSyntaxMutations(compilation, semanticModel, definition, syntax, selfParameter?.Name, containingType, propertyAttribute, blockAttribute, ref visited, ref visitedLocalFunctions, ref mutated, cancellationToken);
            }
        }
    }

    private static void CollectOperationMutations(Compilation compilation, SemanticModel semanticModel, IOperation root, INamedTypeSymbol containingType, IParameterSymbol? selfParameter, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, ref HashSet<IMethodSymbol>? visited, ref List<string>? mutated, CancellationToken cancellationToken)
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
                    when IsReceiverInvocation(nestedInvocation, containingType, selfParameter, out var isDirectOrExtensionReceiver):
                    if (!isDirectOrExtensionReceiver || !TryAddDirectSetterProperties(nestedInvocation.TargetMethod, containingType, propertyAttribute, blockAttribute, ref mutated))
                        CollectHelperMutations(compilation, semanticModel, nestedInvocation.TargetMethod, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
                    break;

                default:
                    break;
            }
        }
    }

    private static void CollectSyntaxMutations(Compilation compilation, SemanticModel? semanticModel, IMethodSymbol ownerMethod, SyntaxNode root, string? selfParameterName, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, ref HashSet<IMethodSymbol>? visited, ref HashSet<SyntaxNode>? visitedLocalFunctions, ref List<string>? mutated, CancellationToken cancellationToken)
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
                    when IsSelfSyntax(memberAccess.Expression, selfParameterName, containingType)
                        && HasComponentPropertyNamed(containingType, memberAccess.Name.Identifier.ValueText, propertyAttribute, blockAttribute):
                    AddUnique(ref mutated, memberAccess.Name.Identifier.ValueText);
                    break;

                case InvocationExpressionSyntax { Expression: IdentifierNameSyntax callIdentifier } call:
                    if (selfParameterName is null && TryAddDirectSetterPropertiesByName(callIdentifier.Identifier.ValueText, containingType, propertyAttribute, blockAttribute, ref mutated))
                        break;

                    CollectUnqualifiedSyntaxCallMutations(compilation, semanticModel, ownerMethod, root, call, callIdentifier.Identifier.ValueText, selfParameterName, containingType, propertyAttribute, blockAttribute, ref visited, ref visitedLocalFunctions, ref mutated, cancellationToken);
                    break;

                case InvocationExpressionSyntax { Expression: MemberAccessExpressionSyntax callMember } memberCall:
                    if (IsSelfSyntax(callMember.Expression, selfParameterName, containingType))
                    {
                        if (!TryAddDirectSetterPropertiesByName(callMember.Name.Identifier.ValueText, containingType, propertyAttribute, blockAttribute, ref mutated))
                            CollectMemberSyntaxCallMutations(compilation, semanticModel, ownerMethod, callMember.Name.Identifier.ValueText, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
                    }
                    else if (PassesSelfAsFirstArgument(memberCall, selfParameterName, containingType) && callMember.Expression is IdentifierNameSyntax typeIdentifier)
                    {
                        CollectStaticTypeSyntaxCallMutations(compilation, semanticModel, ownerMethod, typeIdentifier.Identifier.ValueText, callMember.Name.Identifier.ValueText, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
                    }

                    break;

                default:
                    break;
            }
        }
    }

    private static void CollectUnqualifiedSyntaxCallMutations(Compilation compilation, SemanticModel? semanticModel, IMethodSymbol ownerMethod, SyntaxNode root, InvocationExpressionSyntax call, string methodName, string? selfParameterName, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, ref HashSet<IMethodSymbol>? visited, ref HashSet<SyntaxNode>? visitedLocalFunctions, ref List<string>? mutated, CancellationToken cancellationToken)
    {
        var passesSelfFirst = PassesSelfAsFirstArgument(call, selfParameterName, containingType);

        foreach (SyntaxNode node in root.DescendantNodes())
        {
            if (node is not LocalFunctionStatementSyntax localFunction || localFunction.Identifier.ValueText != methodName)
                continue;

            string? nestedSelfName;

            if (passesSelfFirst && localFunction.ParameterList.Parameters.Count > 0)
                nestedSelfName = localFunction.ParameterList.Parameters[0].Identifier.ValueText;
            else if (selfParameterName is not null && !localFunction.Modifiers.Any(Microsoft.CodeAnalysis.CSharp.SyntaxKind.StaticKeyword) && !DeclaresParameterNamed(localFunction.ParameterList, selfParameterName))
                nestedSelfName = selfParameterName;
            else if (selfParameterName is null && !localFunction.Modifiers.Any(Microsoft.CodeAnalysis.CSharp.SyntaxKind.StaticKeyword))
                nestedSelfName = null;
            else
                continue;

            visitedLocalFunctions ??= [];

            if (visitedLocalFunctions.Add(localFunction))
                CollectSyntaxMutations(compilation, semanticModel, ownerMethod, localFunction, nestedSelfName, containingType, propertyAttribute, blockAttribute, ref visited, ref visitedLocalFunctions, ref mutated, cancellationToken);
        }

        if (selfParameterName is null)
        {
            for (INamedTypeSymbol? current = ownerMethod.ContainingType; current is not null && current.SpecialType != SpecialType.System_Object; current = current.BaseType)
            {
                foreach (ISymbol member in current.GetMembers(methodName))
                {
                    if (member is IMethodSymbol { MethodKind: MethodKind.Ordinary } candidate && (!candidate.IsStatic || passesSelfFirst))
                        CollectHelperMutations(compilation, semanticModel, candidate, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
                }
            }
        }
        else if (passesSelfFirst && ownerMethod.ContainingType is { } staticOwner)
        {
            foreach (ISymbol member in staticOwner.GetMembers(methodName))
            {
                if (member is IMethodSymbol { MethodKind: MethodKind.Ordinary, IsStatic: true } candidate)
                    CollectHelperMutations(compilation, semanticModel, candidate, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
            }
        }
    }

    private static bool PassesSelfAsFirstArgument(InvocationExpressionSyntax call, string? selfParameterName, INamedTypeSymbol containingType)
        => call.ArgumentList.Arguments.Count > 0 && IsSelfSyntax(call.ArgumentList.Arguments[0].Expression, selfParameterName, containingType);

    private static bool DeclaresParameterNamed(ParameterListSyntax parameterList, string name)
    {
        foreach (ParameterSyntax parameter in parameterList.Parameters)
        {
            if (parameter.Identifier.ValueText == name)
                return true;
        }

        return false;
    }

    private static void CollectMemberSyntaxCallMutations(Compilation compilation, SemanticModel? semanticModel, IMethodSymbol ownerMethod, string methodName, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, ref HashSet<IMethodSymbol>? visited, ref List<string>? mutated, CancellationToken cancellationToken)
    {
        for (INamedTypeSymbol? current = containingType; current is not null && current.SpecialType != SpecialType.System_Object; current = current.BaseType)
        {
            foreach (ISymbol member in current.GetMembers(methodName))
            {
                if (member is IMethodSymbol { MethodKind: MethodKind.Ordinary, IsStatic: false } candidate)
                    CollectHelperMutations(compilation, semanticModel, candidate, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
            }
        }

        if (ownerMethod.ContainingType is { IsStatic: true } staticOwner)
        {
            foreach (ISymbol member in staticOwner.GetMembers(methodName))
            {
                if (member is IMethodSymbol { MethodKind: MethodKind.Ordinary, IsExtensionMethod: true } candidate)
                    CollectHelperMutations(compilation, semanticModel, candidate, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
            }
        }

        CollectExtensionSyntaxCallMutations(compilation, semanticModel, compilation.GlobalNamespace, methodName, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
    }

    private static void CollectExtensionSyntaxCallMutations(Compilation compilation, SemanticModel? semanticModel, INamespaceSymbol namespaceSymbol, string methodName, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, ref HashSet<IMethodSymbol>? visited, ref List<string>? mutated, CancellationToken cancellationToken)
    {
        foreach (INamedTypeSymbol type in namespaceSymbol.GetTypeMembers())
        {
            if (!type.IsStatic || !type.MightContainExtensionMethods || type.Locations.IsEmpty || !type.Locations[0].IsInSource)
                continue;

            foreach (ISymbol member in type.GetMembers(methodName))
            {
                if (member is IMethodSymbol { MethodKind: MethodKind.Ordinary, IsExtensionMethod: true } candidate
                    && candidate.Parameters.Length > 0
                    && IsCompatibleReceiverParameter(candidate.Parameters[0].Type, containingType))
                {
                    CollectHelperMutations(compilation, semanticModel, candidate, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
                }
            }
        }

        foreach (INamespaceSymbol child in namespaceSymbol.GetNamespaceMembers())
            CollectExtensionSyntaxCallMutations(compilation, semanticModel, child, methodName, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
    }

    private static bool IsCompatibleReceiverParameter(ITypeSymbol parameterType, INamedTypeSymbol containingType)
    {
        if (parameterType is ITypeParameterSymbol)
            return true;

        if (SymbolEqualityComparer.Default.Equals(parameterType, containingType))
            return true;

        if (parameterType is INamedTypeSymbol namedType)
            return namedType.TypeKind == TypeKind.Interface ? containingType.ImplementsInterface(namedType) : containingType.InheritsFrom(namedType);

        return false;
    }

    private static void CollectStaticTypeSyntaxCallMutations(Compilation compilation, SemanticModel? semanticModel, IMethodSymbol ownerMethod, string typeName, string methodName, INamedTypeSymbol containingType, INamedTypeSymbol propertyAttribute, INamedTypeSymbol? blockAttribute, ref HashSet<IMethodSymbol>? visited, ref List<string>? mutated, CancellationToken cancellationToken)
    {
        for (INamespaceSymbol? ns = ownerMethod.ContainingNamespace; ns is not null; ns = ns.ContainingNamespace)
        {
            foreach (INamedTypeSymbol candidateType in ns.GetTypeMembers(typeName))
            {
                foreach (ISymbol member in candidateType.GetMembers(methodName))
                {
                    if (member is IMethodSymbol { MethodKind: MethodKind.Ordinary, IsStatic: true } candidate)
                        CollectHelperMutations(compilation, semanticModel, candidate, containingType, propertyAttribute, blockAttribute, ref visited, ref mutated, cancellationToken);
                }
            }

            if (ns.IsGlobalNamespace)
                break;
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

    private static bool IsSelfSyntax(ExpressionSyntax expression, string? selfParameterName, INamedTypeSymbol containingType)
    {
        ExpressionSyntax current = expression;

        while (current is InvocationExpressionSyntax invocation)
        {
            if (invocation.Expression is MemberAccessExpressionSyntax chained)
            {
                if (!ReturnsSelfOnContainingType(containingType, chained.Name.Identifier.ValueText))
                    return false;

                current = chained.Expression;
            }
            else if (selfParameterName is null && invocation.Expression is IdentifierNameSyntax direct && ReturnsSelfOnContainingType(containingType, direct.Identifier.ValueText))
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        return selfParameterName is null
            ? current is ThisExpressionSyntax
            : current is IdentifierNameSyntax id && id.Identifier.ValueText == selfParameterName;
    }

    private static bool ReturnsSelfOnContainingType(INamedTypeSymbol containingType, string methodName)
    {
        if (methodName.StartsWith("Set", StringComparison.Ordinal) || GetMappedProperties(methodName) is not null)
            return true;

        for (INamedTypeSymbol? current = containingType; current is not null && current.SpecialType != SpecialType.System_Object; current = current.BaseType)
        {
            foreach (ISymbol member in current.GetMembers(methodName))
            {
                if (member is IMethodSymbol { MethodKind: MethodKind.Ordinary, IsStatic: false } candidate && IsSelfType(candidate.ReturnType, containingType))
                    return true;
            }
        }

        return false;
    }

    private static void AddUnique(ref List<string>? list, string value)
    {
        list ??= [];

        if (!list.Contains(value))
            list.Add(value);
    }

    private static bool IsReceiverInvocation(IInvocationOperation invocation, INamedTypeSymbol containingType, IParameterSymbol? selfParameter, out bool isDirectOrExtensionReceiver)
    {
        if (IsReceiver(invocation.Instance, containingType, selfParameter))
        {
            isDirectOrExtensionReceiver = true;
            return true;
        }

        if (invocation.Instance is not null)
        {
            isDirectOrExtensionReceiver = false;
            return false;
        }

        if (invocation.TargetMethod.IsStatic && invocation.Arguments.Length > 0 && IsReceiver(invocation.Arguments[0].Value, containingType, selfParameter))
        {
            isDirectOrExtensionReceiver = invocation.TargetMethod.IsExtensionMethod;
            return true;
        }

        if (invocation.TargetMethod.ReducedFrom is not null && IsReceiver(invocation.Instance, containingType, selfParameter))
        {
            isDirectOrExtensionReceiver = true;
            return true;
        }

        isDirectOrExtensionReceiver = false;
        return false;
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
