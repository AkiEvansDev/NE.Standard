using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Base;

/// <summary>
/// A component's own page: one preview of it, and every property that can be bound to it beside that.
/// </summary>
/// <remarks>Two halves, not a group per theme: there is exactly one preview, and the options say what can be done to it.</remarks>
internal abstract class DemoMainView : DemoView
{
    protected sealed override DemoViewKind ViewKind => DemoViewKind.Main;

    protected sealed override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreatePreview())
            .AddChild(CreateOptions());
    }

    protected abstract ContainerComponent CreatePreview();

    protected abstract ContainerComponent CreateOptions();
}

internal abstract class DemoExamplesView : DemoView
{
    protected sealed override DemoViewKind ViewKind => DemoViewKind.Examples;
}

internal abstract class DemoScenariosView : DemoView
{
    protected sealed override DemoViewKind ViewKind => DemoViewKind.Scenarios;
}
