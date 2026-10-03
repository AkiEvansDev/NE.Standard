using System;
using System.Collections.Frozen;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Compiled.Indexes;
using NE.Standard.UI.Compiled.Views;

namespace NE.Standard.UI.Compilation;

internal static class UIViewCompiler
{
    public static CompiledView Compile(IUIView view, Type? controllerType = null)
    {
        ArgumentNullException.ThrowIfNull(view);

        UIViewCompilationContext context = new(controllerType);

        foreach (UIRegion region in view.Regions)
            context.AddRegion(region);

        foreach (UIDialog dialog in view.Dialogs)
            context.AddDialog(dialog);

        context.AddShortcuts(view.Shortcuts);

        UIViewCompilationResult result = context.BuildResult();

        UICompiledBindingSourceIndex sources = new(result.BindingSources);
        UICompiledBindingTemplateIndex templates = new(result.BindingTemplates);
        UIComponentGraph graph = new(result.Nodes);
        UIComponentStateIndex state = new(result.States);
        UICompiledBindingIndex bindings = new(result.Bindings, sources, templates);

        return new CompiledView
        {
            Title = view.Title,
            TitleArguments = view.TitleArguments is { Count: > 0 } arguments ? arguments.ToFrozenDictionary(StringComparer.Ordinal) : null,
            Options = view.Options,
            Regions = result.Regions,
            Dialogs = result.Dialogs,
            Graph = graph,
            State = state,
            Sources = sources,
            Templates = templates,
            Contexts = new UIComponentContextIndex(result.Contexts),
            Bindings = bindings,
            Interactions = new UIInteractionIndex(result.Interactions),
            Events = new UIEventIndex(result.Events, sources, templates),
            Validations = new UIValidationIndex(result.Validations, result.ValidationMessageTargets),
            ItemProjections = UIItemProjectionBuilder.Build(graph, state, bindings, templates),
            Warnings = result.Warnings,
            Fingerprint = UIViewFingerprint.Compute(result.Nodes, result.Bindings, result.Events, result.Interactions)
        };
    }
}
