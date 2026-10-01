using DemoApp.Views.Base;

namespace DemoApp.Views.Design.Colors;

/// <summary>
/// Shared shell for the Colors reference pages, with a Palette/Semantic/Components/Theme strip of its own.
/// </summary>
internal abstract class ColorsViewBase : DemoView
{
    protected override string ComponentRoute => "/design/colors";
    protected override string Header => "demo.design.colors.header";
    protected override string HeaderDescription => "demo.design.colors.description";

    protected abstract string CurrentTabUrl { get; }

    protected sealed override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChild(DemoUI.CreateTabs(
        [
            ("demo.colors.palette", "/design/colors"),
            ("demo.colors.semantic", "/design/colors/semantic"),
            ("demo.colors.components", "/design/colors/components"),
            ("demo.colors.theme", "/design/colors/theme"),
        ], CurrentTabUrl));

        // The palette's names, values and sample compositions are the reference itself, shown as written: content for the unkeyed report.
        DrawColorsContent(container.AsContentTree());
    }

    protected abstract void DrawColorsContent(WrapPanelComponent container);
}
