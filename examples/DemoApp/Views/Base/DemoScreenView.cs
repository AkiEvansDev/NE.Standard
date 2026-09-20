using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Base;

/// <summary>
/// A piece of a real application rather than a component's page: a form, a catalogue, an inbox, built from many components
/// at once and from the presets in <c>NE.Standard.UI.Extensions</c>. Its route is its own, so it lands as
/// <see cref="DemoViewKind.Main"/>, and it draws no tab strip.
/// </summary>
internal abstract class DemoScreenView : DemoView
{
    protected sealed override DemoViewKind ViewKind => DemoViewKind.Main;
    protected sealed override DemoViewKind[] AvailableKinds => [];

    protected sealed override void DrawContent(WrapPanelComponent container)
        => _ = container.AddChild(CreateScreen());

    protected abstract IVisualComponent CreateScreen();
}
