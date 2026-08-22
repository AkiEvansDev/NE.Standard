using System.Collections.Generic;
using DemoApp.Controllers.Navigation.Tabs;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Navigation.Tabs;

internal sealed class TabsBindingView : DemoBindingView, IUIViewDefinition
{
    public static string ViewKey => "demo.navigation.tabs.binding";

    protected override string ComponentRoute => "/navigation/tabs";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding];
    protected override string Header => "demo.navigation.tabs.header";
    protected override string HeaderDescription => "demo.navigation.tabs.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateMainGroup())
            .AddChild(CreateTabsGroup());
    }

    private static ContainerComponent CreateMainGroup()
        => CreateMainGroup(new TabsComponent()
            .AddTab("one", "One", CreatePage("First page"))
            .AddTab("two", "Two", CreatePage("Second page")));

    /// <summary>
    /// Both directions in one group: the strip switches on the client and writes the key back, and the
    /// command drives the same property from the server.
    /// </summary>
    private static ContainerComponent CreateTabsGroup()
    {
        return DemoUI.CreateGroup(nameof(TabsBindingController.TabsGroup), "Selection and visibility",
            content => content.AddChild(new TabsComponent()
                .SetPlacement(1, 1, 24, 1)
                .BindSelectedKey(nameof(TabsGroupContext.SelectedKey), UIBindingScope.Relative)
                .AddTab("overview", "Overview", CreatePage("Overview"))
                .AddTab("members", "Members", CreatePage("Members"))
                .AddTab("secrets",
                    new TabHeaderComponent()
                        .BindVisible(nameof(TabsGroupContext.SecretsVisible), UIBindingScope.Relative)
                        .ConfigureDefaultContent(c => _ = c.SetTitle("Secrets")),
                    CreatePage("Secrets"))
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Select next"] = nameof(TabsBindingController.SelectNext),
                ["Secrets tab"] = nameof(TabsBindingController.ToggleSecrets),
            })
        );
    }

    private static ContainerComponent CreatePage(string title)
        => new ContainerComponent()
            .SetPadding(UIThickness.All(0, 16, 0, 0))
            .AddChild(new TextComponent()
                .SetTitle(title)
                .SetTitleType(UITextAppearance.Subtitle)
                .SetPlacement(1, 1, 24, 1)
            );
}
