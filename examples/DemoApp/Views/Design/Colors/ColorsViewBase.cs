using DemoApp.Views.Base;

namespace DemoApp.Views.Design.Colors;

/// <summary>
/// Shared shell for the Colors reference pages, with a Palette/Semantic/Components/Theme strip of its own. The pages' own words are
/// keys, as the mechanism pages' are; the palette's names, values and the sample compositions are the reference itself, content.
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

        DrawColorsContent(container);
    }

    protected abstract void DrawColorsContent(WrapPanelComponent container);

    /// <summary>A theme's name over its sample, in the page's language.</summary>
    protected static string ThemeWord(bool dark)
        => dark ? "demo.colors.dark" : "demo.colors.light";
}
