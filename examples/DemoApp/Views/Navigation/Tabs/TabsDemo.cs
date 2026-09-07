using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Navigation.Tabs;

/// <summary>The page a demo tab shows: a stack set off from the strip.</summary>
internal static class TabsDemo
{
    public static StackPanelComponent CreatePage()
        => new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(10)
            .SetMargin(UIThickness.All(0, 12, 0, 0));
}
