namespace DemoApp.Views.Navigation.Tabs;

/// <summary>The page a demo tab shows: a stack of its rows.</summary>
internal static class TabsDemo
{
    public static StackPanelComponent CreatePage()
        => UILayout.Stack(10);
}
