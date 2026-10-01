namespace DemoApp.Views.Base;

/// <summary>
/// A component's page, one route: the preview beside every property that can be bound to it, then the component used for real,
/// each sample with its source, then the page where it is composed into something larger.
/// </summary>
/// <remarks>
/// The options stand above the examples: the preview gives the component at a glance and the accordion starts closed, so the
/// examples are a short scroll away.
/// </remarks>
internal abstract class DemoComponentView : DemoView
{
    /// <summary>The screen or mechanism page that composes the component for real: its route and its sidebar label, or none.</summary>
    protected virtual (string Route, string Label)? ComposedIn => null;

    protected sealed override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreatePreview())
            .AddChild(CreateOptions());

        IVisualComponent[] examples = CreateExamples();

        if (examples.Length > 0)
        {
            _ = container
                .AddChild(DemoUI.CreateSectionHeading("demo.section.examples"))
                .AddChildren(examples);
        }

        if (ComposedIn is (string route, string label))
            _ = container.AddChild(DemoUI.CreateComposedIn(route, label));
    }

    protected abstract ContainerComponent CreatePreview();

    protected abstract ContainerComponent CreateOptions();

    /// <summary>The examples in reading order: a band on its own, the rest in pairs (<see cref="DemoUI.CreateColumns"/>).</summary>
    protected virtual IVisualComponent[] CreateExamples()
        => [];
}
