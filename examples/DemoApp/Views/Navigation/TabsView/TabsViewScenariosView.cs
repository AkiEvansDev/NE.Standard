using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Navigation.TabsView;
using DemoApp.Views.Base;

namespace DemoApp.Views.Navigation.TabsView;

/// <summary>
/// The reason the strip is an items view: every gesture on it is a change to a document, and a controller
/// can see each one and refuse it.
/// </summary>
internal sealed class TabsViewScenariosView : DemoScenariosView, IUIViewDefinition
{
    private const string EditorGroup = nameof(TabsViewScenariosController.EditorGroup);
    private const string DriveGroup = nameof(TabsViewScenariosController.DriveGroup);

    public static string ViewKey => "demo.navigation.tabs-view.scenarios";

    protected override string ComponentRoute => "/navigation/tabs-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.navigation.tabs-view.header";
    protected override string HeaderDescription => "demo.navigation.tabs-view.description";

    protected override void DrawContent(WrapPanelComponent container)
        // Both bands: in a half-width group the strip held two tabs and the rest overflowed, so there was nothing to drag onto.
        => _ = container.AddChild(CreateEditorGroup()).AddChild(CreateDriveGroup());

    /// <summary>
    /// An editor: a tree of files on the left, the open ones on the right, every gesture answered by the controller.
    /// </summary>
    private static ContainerComponent CreateEditorGroup()
    {
        return DemoUI.CreateGroup(EditorGroup, "An editor",
            content => content
                .AddChild(new ItemsViewComponent()
                    .BindItems(nameof(EditorGroupContext.Files), UIBindingScope.Relative)
                    .SetSpacing(4)
                    .DisableScroll()
                    .SetTemplate(new ActionComponent()
                        .BindIcon(nameof(TextItem.Icon), UIBindingScope.Relative)
                        .BindTitle(nameof(TextItem.Title), UIBindingScope.Relative)
                        .BindDescription(nameof(TextItem.Description), UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetShowChevron(false)
                        .OnClick(nameof(TabsViewScenariosController.OpenFile), UIAction.ArgCurrentItemKey("id"))
                    )
                    .SetPlacement(1, 1, 24, 1, md: UIGridPlacement.At(1, 1, 8, 1))
                )
                .AddChild(new TabsViewComponent(TabsViewScenariosController.EditorTabsId)
                    .BindItems(nameof(EditorGroupContext.Documents), UIBindingScope.Relative)
                    .BindSelectedKey(nameof(EditorGroupContext.SelectedKey), UIBindingScope.Relative)
                    .SetRenamable(true)
                    .SetDraggable(true)
                    // The strip's own menu: Rename, Pin or Unpin, the editor's "Close others", then Close.
                    .SetTabMenuEntries(UITabMenuEntries.Rename | UITabMenuEntries.Pin | UITabMenuEntries.Close)
                    .AddTabMenuEntries(new MenuItem { Id = EditorGroupContext.CloseOthersAction, Title = "Close others", Icon = DemoIcons.Outline(DemoIcons.Close) })
                    .OnTabMenuEntry(nameof(TabsViewScenariosController.TabAction))
                    .OnItemRemove(nameof(TabsViewScenariosController.CloseDocument))
                    .OnItemRename(nameof(TabsViewScenariosController.RenameDocument), UIAction.ArgCurrentItemKey("id"))
                    .SetPageTemplate(new ParagraphComponent()
                        .BindDescription(nameof(DemoDocumentItem.Body), UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetMargin(UIThickness.All(0, 4, 0, 0))
                    )
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetPlacement(1, 2, 24, 1, md: UIGridPlacement.At(10, 1, 15, 1))
                ),
            contentMinHeight: 300,
            columns: 24,
            note: "Open a file, close it, rename it, drag a header, right-click one and pin it: each one reaches the controller as a change to a single document, and the controller is what answers. The right-click menu is the strip's own — Rename, Pin and Close chosen for it — with Close others the editor's entry before Close. A pinned tab wears the pin, loses its close and stays put under a drag."
        );
    }

    /// <summary>
    /// The strip driven from the other side: a command walks <c>SelectedKey</c> as readily as a click does.
    /// </summary>
    private static ContainerComponent CreateDriveGroup()
    {
        return DemoUI.CreateGroup(DriveGroup, "The controller drives the strip",
            content => content.AddChild(new TabsViewComponent()
                .BindItems(nameof(DriveGroupContext.Steps), UIBindingScope.Relative)
                .BindSelectedKey(nameof(DriveGroupContext.SelectedKey), UIBindingScope.Relative)
                .SetPageTemplate(new ParagraphComponent()
                    .BindDescription(nameof(DemoDocumentItem.Body), UIBindingScope.Relative)
                    .SetDescriptionType(UITextAppearance.Body)
                    .SetMargin(UIThickness.All(0, 4, 0, 0))
                )
                .SetVerticalAlignment(UIAlignment.Start)
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Previous step"] = nameof(TabsViewScenariosController.PreviousStep),
                ["Next step"] = nameof(TabsViewScenariosController.NextStep),
            }),
            contentMinHeight: 160,
            columns: 24,
            note: "SelectedKey is a property, so a command walks the tabs as readily as a click does — and a click moves the same property back."
        );
    }
}
