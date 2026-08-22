using System.Collections.Immutable;
using System.Linq;
using System.Text;
using System.Threading;
using Microsoft.CodeAnalysis;
using Microsoft.CodeAnalysis.CSharp;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.CodeAnalysis.Text;
using NE.Standard.UI.Generators.Infrastructure;

namespace NE.Standard.UI.Generators.RecursiveMembers;

/// <summary>
/// Generates change-tracking plumbing for members annotated with <c>[RecursiveMember]</c>.
/// </summary>
[Generator(LanguageNames.CSharp)]
public sealed class RecursiveMemberGenerator : IIncrementalGenerator
{
    /// <inheritdoc/>
    public void Initialize(IncrementalGeneratorInitializationContext context)
    {
        IncrementalValuesProvider<RecursiveMemberModel?> members = context.SyntaxProvider.ForAttributeWithMetadataName(
            RecursiveMemberNames.AttributeMetadataName,
            predicate: static (node, _) => node is PropertyDeclarationSyntax,
            transform: static (ctx, ct) => CreateMemberModel(ctx, ct));

        IncrementalValueProvider<(Compilation Compilation, ImmutableArray<RecursiveMemberModel> Members)> source =
            context.CompilationProvider.Combine(members
                .Where(static model => model is not null)
                .Select(static (model, _) => model!)
                .Collect()
                );

        context.RegisterSourceOutput(source, static (ctx, source) => Execute(ctx, source.Compilation, source.Members));
    }

    private static RecursiveMemberModel? CreateMemberModel(GeneratorAttributeSyntaxContext context, CancellationToken cancellationToken)
    {
        cancellationToken.ThrowIfCancellationRequested();

        if (context.TargetNode is not PropertyDeclarationSyntax propertySyntax)
            return null;

        if (context.TargetSymbol is not IPropertySymbol propertySymbol)
            return null;

        INamedTypeSymbol? containingType = propertySymbol.ContainingType;

        if (containingType is null)
            return null;

        AttributeData? attribute = null;

        foreach (AttributeData candidate in propertySymbol.GetAttributes())
        {
            if (candidate.AttributeClass?.ToDisplayString() == RecursiveMemberNames.AttributeMetadataName)
            {
                attribute = candidate;
                break;
            }
        }

        if (attribute is null)
            return null;

        return new RecursiveMemberModel(
            PropertySyntax: propertySyntax,
            Property: propertySymbol,
            ContainingType: containingType,
            Values: RecursiveMemberAttributeValues.From(attribute)
        );
    }

    private static void Execute(SourceProductionContext context, Compilation compilation, ImmutableArray<RecursiveMemberModel> members)
    {
        if (members.IsDefaultOrEmpty)
            return;

        INamedTypeSymbol? recursiveObservableType = compilation.GetTypeByMetadataName(RecursiveMemberNames.RecursiveObservableMetadataName);

        foreach (IGrouping<ISymbol?, RecursiveMemberModel> group in members.GroupBy(static member => member.ContainingType, SymbolEqualityComparer.Default))
        {
            if (group.Key is not INamedTypeSymbol ownerType)
                continue;

            ImmutableArray<RecursiveMemberModel> ownerMembers = [.. group];

            var hasErrors = false;

            if (!ownerType.IsPartial())
            {
                context.ReportDiagnostic(Diagnostic.Create(
                    RecursiveMemberDiagnostics.OwnerMustBePartial,
                    ownerType.Locations.FirstOrDefault(),
                    ownerType.ToDisplayString()
                ));

                hasErrors = true;
            }

            if (ownerType.TypeKind != TypeKind.Class || ownerType.IsRecord)
            {
                context.ReportDiagnostic(Diagnostic.Create(
                    RecursiveMemberDiagnostics.OwnerMustBeOrdinaryClass,
                    ownerType.Locations.FirstOrDefault(),
                    ownerType.ToDisplayString()
                ));

                hasErrors = true;
            }

            if (recursiveObservableType is null || !ownerType.InheritsFrom(recursiveObservableType))
            {
                context.ReportDiagnostic(Diagnostic.Create(
                    RecursiveMemberDiagnostics.OwnerMustInheritRecursiveObservable,
                    ownerType.Locations.FirstOrDefault(),
                    ownerType.ToDisplayString()
                ));

                hasErrors = true;
            }

            foreach (RecursiveMemberModel member in ownerMembers)
                ValidateMember(context, member, ref hasErrors);

            if (hasErrors || recursiveObservableType is null)
                continue;

            var source = GenerateType(ownerType, ownerMembers, recursiveObservableType);
            var hintName = HintNameBuilder.Build(ownerType, "RecursiveMembers");

            context.AddSource(hintName, SourceText.From(source, Encoding.UTF8));
        }
    }

    private static void ValidateMember(SourceProductionContext context, RecursiveMemberModel model, ref bool hasErrors)
    {
        IPropertySymbol property = model.Property;

        if (property.IsStatic)
        {
            context.ReportDiagnostic(Diagnostic.Create(
                RecursiveMemberDiagnostics.RecursiveMemberCannotBeStatic,
                property.Locations.FirstOrDefault(),
                property.Name
            ));

            hasErrors = true;
        }

        if (property.Parameters.Length != 0)
        {
            context.ReportDiagnostic(Diagnostic.Create(
                RecursiveMemberDiagnostics.RecursiveMemberCannotBeIndexer,
                property.Locations.FirstOrDefault(),
                property.Name
            ));

            hasErrors = true;
        }

        ValidateGeneratedMemberConflict(context, model, RecursiveMemberNames.GetSegmentFieldName(property.Name), ref hasErrors);

        if (!model.Values.Generate)
            return;

        if (!model.PropertySyntax.Modifiers.Any(SyntaxKind.PartialKeyword))
        {
            context.ReportDiagnostic(Diagnostic.Create(
                RecursiveMemberDiagnostics.GeneratedPropertyMustBePartial,
                property.Locations.FirstOrDefault(),
                property.Name
            ));

            hasErrors = true;
        }

        if (property.SetMethod is null)
        {
            context.ReportDiagnostic(Diagnostic.Create(
                RecursiveMemberDiagnostics.GeneratedPropertyMustHaveSetter,
                property.Locations.FirstOrDefault(),
                property.Name
            ));

            hasErrors = true;
        }
        else if (property.SetMethod.IsInitOnly)
        {
            context.ReportDiagnostic(Diagnostic.Create(
                RecursiveMemberDiagnostics.GeneratedPropertyCannotBeInitOnly,
                property.Locations.FirstOrDefault(),
                property.Name
            ));

            hasErrors = true;
        }
    }

    private static void ValidateGeneratedMemberConflict(SourceProductionContext context, RecursiveMemberModel model, string memberName, ref bool hasErrors)
    {
        foreach (ISymbol member in model.ContainingType.GetMembers(memberName))
        {
            if (SymbolEqualityComparer.Default.Equals(member, model.Property))
                continue;

            context.ReportDiagnostic(Diagnostic.Create(
                RecursiveMemberDiagnostics.GeneratedMemberConflict,
                model.Property.Locations.FirstOrDefault(),
                memberName,
                model.ContainingType.ToDisplayString()
            ));

            hasErrors = true;
            return;
        }
    }

    private static string GenerateType(INamedTypeSymbol type, ImmutableArray<RecursiveMemberModel> members, INamedTypeSymbol recursiveObservableType)
    {
        StringBuilder builder = new();

        _ = builder
            .AppendLine("// <auto-generated />")
            .AppendLine("#nullable enable")
            .AppendLine();

        var ns = type.ContainingNamespace.IsGlobalNamespace
            ? null
            : type.ContainingNamespace.ToDisplayString();

        if (ns is not null)
        {
            _ = builder.Append("namespace ").Append(ns).AppendLine(";");
            _ = builder.AppendLine();
        }

        TypeDeclarationWriter.WriteContainingTypesStart(builder, type);
        TypeDeclarationWriter.WritePartialTypeStart(builder, type);

        var hasContent = false;

        GenerateInitializationConstructor(builder, type, ref hasContent);

        foreach (RecursiveMemberModel member in members)
            GenerateSegmentField(builder, member, ref hasContent);

        foreach (RecursiveMemberModel member in members)
        {
            if (member.Values.Generate)
                GenerateGeneratedProperty(builder, member, ref hasContent);
        }

        GeneratePropagateNotifier(builder, members, recursiveObservableType, ref hasContent);
        GenerateTryGetValueCore(builder, members, recursiveObservableType, ref hasContent);
        GenerateTrySetValueCore(builder, members, recursiveObservableType, ref hasContent);

        _ = builder.AppendLine("}");

        TypeDeclarationWriter.WriteContainingTypesEnd(builder, type);

        return builder.ToString();
    }

    private static void GenerateInitializationConstructor(StringBuilder builder, INamedTypeSymbol type, ref bool hasContent)
    {
        if (HasExplicitInstanceConstructor(type))
            return;

        if (HasPrimaryConstructor(type))
            return;

        // public even on an internal type: the constructor is unreachable outside the assembly either way,
        // and ActivatorUtilities (which builds every controller) only ever looks at public constructors —
        // an internal one made DI fail at runtime with "a suitable constructor could not be located".
        var accessibility = type.IsAbstract ? "protected" : "public";

        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    ")
            .Append(accessibility)
            .Append(' ')
            .Append(type.Name)
            .AppendLine("()");

        _ = builder
            .AppendLine("    {")
            .AppendLine("        ResetNotifier();")
            .AppendLine("    }");
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


    private static void GenerateSegmentField(StringBuilder builder, RecursiveMemberModel model, ref bool hasContent)
    {
        var segmentFieldName = RecursiveMemberNames.GetSegmentFieldName(model.Property.Name);

        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    private static readonly ")
            .Append(RecursiveMemberNames.PathSegmentTypeName)
            .Append(' ')
            .Append(segmentFieldName)
            .Append(" = ")
            .Append(RecursiveMemberNames.PathSegmentTypeName)
            .Append(".ForProperty(nameof(")
            .Append(model.Property.Name)
            .AppendLine("));");
    }

    private static void GenerateGeneratedProperty(StringBuilder builder, RecursiveMemberModel model, ref bool hasContent)
    {
        IPropertySymbol property = model.Property;

        var propertyName = property.Name;
        var propertyType = property.Type.ToGlobalTypeDisplayString();
        var segmentFieldName = RecursiveMemberNames.GetSegmentFieldName(propertyName);

        var propertyAccessibility = GetAccessibility(property.DeclaredAccessibility);
        var getterAccessibility = GetAccessorAccessibility(property.GetMethod?.DeclaredAccessibility, property.DeclaredAccessibility);
        var setterAccessibility = GetAccessorAccessibility(property.SetMethod?.DeclaredAccessibility, property.DeclaredAccessibility);

        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    ")
            .Append(propertyAccessibility)
            .Append(" partial ")
            .Append(propertyType)
            .Append(' ')
            .Append(propertyName)
            .AppendLine();

        _ = builder
            .AppendLine("    {");

        _ = builder.Append("        ");

        if (getterAccessibility.Length != 0)
            _ = builder.Append(getterAccessibility).Append(' ');

        _ = builder.AppendLine("get => field;");

        _ = builder.Append("        ");

        if (setterAccessibility.Length != 0)
            _ = builder.Append(setterAccessibility).Append(' ');

        _ = builder
            .Append("set => SetRecursiveProperty(ref field, value, ")
            .Append(segmentFieldName)
            .AppendLine(");");

        _ = builder.AppendLine("    }");
    }

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

    private static void GeneratePropagateNotifier(StringBuilder builder, ImmutableArray<RecursiveMemberModel> members, INamedTypeSymbol recursiveObservableType, ref bool hasContent)
    {
        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    protected override void PropagateNotifier(global::System.Collections.Generic.HashSet<")
            .Append(RecursiveMemberNames.RecursiveObservableTypeName)
            .AppendLine("> visited)");

        _ = builder
            .AppendLine("    {")
            .AppendLine("        base.PropagateNotifier(visited);");

        foreach (RecursiveMemberModel member in members)
        {
            if (!CanHoldRecursiveObservable(member.Property.Type, recursiveObservableType))
                continue;

            var propertyName = member.Property.Name;
            var segmentFieldName = RecursiveMemberNames.GetSegmentFieldName(propertyName);
            var localName = "__recursive" + propertyName + "Child";

            _ = builder.AppendLine();

            _ = builder
                .Append("        if (")
                .Append(propertyName)
                .Append(" is ")
                .Append(RecursiveMemberNames.RecursiveObservableTypeName)
                .Append(' ')
                .Append(localName)
                .AppendLine(")");

            _ = builder
                .Append("            AttachChild(")
                .Append(segmentFieldName)
                .Append(", ")
                .Append(localName)
                .AppendLine(", visited);");
        }

        _ = builder.AppendLine("    }");
    }

    /// <summary>
    /// Whether a member's declared type can hold a <c>RecursiveObservable</c> at runtime, and therefore
    /// needs the generated <c>is RecursiveObservable</c> descent for nested path get/set and notifier
    /// propagation. An <b>interface-typed</b> member is the case this exists for (e.g.
    /// <c>KeyValueActionItem.Value</c>, declared as <c>ITextModel</c> but always holding a
    /// <c>TextItem</c>): the declared type does not inherit <c>RecursiveObservable</c>, so without this a
    /// nested path like <c>Value.Title</c> silently fails to resolve — and since the change notification
    /// itself still fires with that path, the runtime answers a real change by pushing <see langword="null"/>
    /// to the client. Deliberately not "any reference type": emitting the pattern against an unrelated
    /// class makes the generated code fail to compile (CS8121).
    /// </summary>
    private static bool CanHoldRecursiveObservable(ITypeSymbol type, INamedTypeSymbol recursiveObservableType)
        => type.InheritsFromOrEquals(recursiveObservableType) ||
           type.TypeKind == TypeKind.Interface ||
           type.SpecialType == SpecialType.System_Object;

    private static void GenerateTryGetValueCore(StringBuilder builder, ImmutableArray<RecursiveMemberModel> members, INamedTypeSymbol recursiveObservableType, ref bool hasContent)
    {
        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    protected override bool TryGetValueCore(global::System.ReadOnlySpan<")
            .Append(RecursiveMemberNames.PathSegmentTypeName)
            .AppendLine("> segments, int offset, out object? value)");

        _ = builder
            .AppendLine("    {")
            .AppendLine("        if (offset >= segments.Length)")
            .AppendLine("            return base.TryGetValueCore(segments, offset, out value);")
            .AppendLine();

        _ = builder
            .Append("        ")
            .Append(RecursiveMemberNames.PathSegmentTypeName)
            .AppendLine(" segment = segments[offset];");

        _ = builder.AppendLine();

        _ = builder
            .Append("        if (segment.Kind != ")
            .Append(RecursiveMemberNames.PathSegmentKindTypeName)
            .AppendLine(".Property)");

        _ = builder.AppendLine("            return base.TryGetValueCore(segments, offset, out value);");

        foreach (RecursiveMemberModel member in members)
            GenerateTryGetBranch(builder, member, recursiveObservableType);

        _ = builder
            .AppendLine()
            .AppendLine("        return base.TryGetValueCore(segments, offset, out value);")
            .AppendLine("    }");
    }

    private static void GenerateTryGetBranch(StringBuilder builder, RecursiveMemberModel member, INamedTypeSymbol recursiveObservableType)
    {
        var propertyName = member.Property.Name;
        var recursive = CanHoldRecursiveObservable(member.Property.Type, recursiveObservableType);

        _ = builder.AppendLine();

        _ = builder
            .Append("        if (global::System.StringComparer.Ordinal.Equals(segment.Property, nameof(")
            .Append(propertyName)
            .AppendLine(")))");

        _ = builder
            .AppendLine("        {")
            .AppendLine("            if (offset == segments.Length - 1)")
            .AppendLine("            {")
            .Append("                value = ")
            .Append(propertyName)
            .AppendLine(";")
            .AppendLine("                return true;")
            .AppendLine("            }");

        if (recursive)
        {
            _ = builder.AppendLine();

            _ = builder
                .Append("            if (")
                .Append(propertyName)
                .Append(" is ")
                .Append(RecursiveMemberNames.RecursiveObservableTypeName)
                .AppendLine(" recursive)");

            _ = builder.AppendLine("                return TryGetNestedValue(recursive, segments, offset + 1, out value);");
        }

        _ = builder
            .AppendLine()
            .AppendLine("            value = null;")
            .AppendLine("            return false;")
            .AppendLine("        }");
    }

    private static void GenerateTrySetValueCore(StringBuilder builder, ImmutableArray<RecursiveMemberModel> members, INamedTypeSymbol recursiveObservableType, ref bool hasContent)
    {
        TypeDeclarationWriter.AppendMemberSeparator(builder, ref hasContent);

        _ = builder
            .Append("    protected override bool TrySetValueCore(global::System.ReadOnlySpan<")
            .Append(RecursiveMemberNames.PathSegmentTypeName)
            .AppendLine("> segments, int offset, object? value)");

        _ = builder
            .AppendLine("    {")
            .AppendLine("        if (offset >= segments.Length)")
            .AppendLine("            return false;")
            .AppendLine();

        _ = builder
            .Append("        ")
            .Append(RecursiveMemberNames.PathSegmentTypeName)
            .AppendLine(" segment = segments[offset];");

        _ = builder.AppendLine();

        _ = builder
            .Append("        if (segment.Kind != ")
            .Append(RecursiveMemberNames.PathSegmentKindTypeName)
            .AppendLine(".Property)");

        _ = builder.AppendLine("            return base.TrySetValueCore(segments, offset, value);");

        foreach (RecursiveMemberModel member in members)
            GenerateTrySetBranch(builder, member, recursiveObservableType);

        _ = builder
            .AppendLine()
            .AppendLine("        return base.TrySetValueCore(segments, offset, value);")
            .AppendLine("    }");
    }

    private static void GenerateTrySetBranch(StringBuilder builder, RecursiveMemberModel member, INamedTypeSymbol recursiveObservableType)
    {
        IPropertySymbol property = member.Property;

        var propertyName = property.Name;
        var patternType = property.Type.ToPatternTypeDisplayString();

        var recursive = CanHoldRecursiveObservable(property.Type, recursiveObservableType);
        var canSet = property.SetMethod is not null && !property.SetMethod.IsInitOnly;
        var isNullable = property.Type.IsNullable();

        _ = builder.AppendLine();

        _ = builder
            .Append("        if (global::System.StringComparer.Ordinal.Equals(segment.Property, nameof(")
            .Append(propertyName)
            .AppendLine(")))");

        _ = builder
            .AppendLine("        {")
            .AppendLine("            if (offset != segments.Length - 1)")
            .AppendLine("            {");

        if (recursive)
        {
            _ = builder
                .Append("                if (")
                .Append(propertyName)
                .Append(" is ")
                .Append(RecursiveMemberNames.RecursiveObservableTypeName)
                .AppendLine(" recursive)");

            _ = builder
                .AppendLine("                    return TrySetNestedValue(recursive, segments, offset + 1, value);")
                .AppendLine();
        }

        _ = builder
            .AppendLine("                return false;")
            .AppendLine("            }");

        if (!canSet)
        {
            _ = builder
                .AppendLine()
                .AppendLine("            return false;")
                .AppendLine("        }");
            return;
        }

        _ = builder.AppendLine();

        if (isNullable)
        {
            _ = builder
                .AppendLine("            if (value is null)")
                .AppendLine("            {")
                .Append("                ")
                .Append(propertyName)
                .AppendLine(" = default;")
                .AppendLine("                return true;")
                .AppendLine("            }")
                .AppendLine();
        }
        else
        {
            _ = builder
                .AppendLine("            if (value is null)")
                .AppendLine("                return false;")
                .AppendLine();
        }

        _ = builder
            .Append("            if (value is not ")
            .Append(patternType)
            .Append(" typedValue && !global::NE.Standard.UI.Abstractions.Recursive.RecursiveValueCoercion.TryCoerce(value, out typedValue))")
            .AppendLine()
            .AppendLine("                return false;")
            .AppendLine();

        _ = builder
            .Append("            ")
            .Append(propertyName)
            .AppendLine(" = typedValue;")
            .AppendLine("            return true;")
            .AppendLine("        }");
    }
}
