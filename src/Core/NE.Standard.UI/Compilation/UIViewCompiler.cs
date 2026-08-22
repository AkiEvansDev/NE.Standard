using System;
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

        UIViewCompilationResult result = context.BuildResult();

        UICompiledBindingSourceIndex sources = new(result.BindingSources);
        UICompiledBindingTemplateIndex templates = new(result.BindingTemplates);

        return new CompiledView
        {
            Title = view.Title,
            Options = view.Options,
            Regions = result.Regions,
            Dialogs = result.Dialogs,
            Graph = new UIComponentGraph(result.Nodes),
            State = new UIComponentStateIndex(result.States),
            Sources = sources,
            Templates = templates,
            Contexts = new UIComponentContextIndex(result.Contexts),
            Bindings = new UICompiledBindingIndex(result.Bindings, sources, templates),
            Interactions = new UIInteractionIndex(result.Interactions),
            Events = new UIEventIndex(result.Events, sources, templates),
            Validations = new UIValidationIndex(result.Validations)
        };
    }
}
