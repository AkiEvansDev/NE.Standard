using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Layouts;

namespace DemoApp.Views.Design.Colors;

/// <summary>
/// Shared shell for the Colors reference pages: one component route, no standard Example/Binding/Test
/// tabs, and a custom Palette/Semantic/Components tab strip instead.
/// </summary>
internal abstract class ColorsViewBase : DemoExampleView
{
    protected override string ComponentRoute => "/design/colors";
    protected override DemoViewKind[] AvailableKinds => [];
    protected override string Header => "demo.design.colors.header";
    protected override string HeaderDescription => "demo.design.colors.description";

    protected abstract string CurrentTabUrl { get; }

    protected sealed override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChild(DemoUI.CreateTabs(
        [
            ("Palette", "/design/colors"),
            ("Semantic", "/design/colors/semantic"),
            ("Components", "/design/colors/components"),
        ], CurrentTabUrl));

        DrawColorsContent(container);
    }

    protected abstract void DrawColorsContent(WrapPanelComponent container);
}
