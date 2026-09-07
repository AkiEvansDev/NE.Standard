using System.Collections.Generic;
using DemoApp.Controllers.Base;
using DemoApp.Controllers.Navigation.TabsView;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Components.BuiltIns.Templates;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

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
        => _ = container.AddChildren(DemoUI.CreateColumns([CreateEditorGroup()], [CreateDriveGroup()]));

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
                    .SetPlacement(1, 1, 8, 1)
                )
                .AddChild(new TabsViewComponent(TabsViewScenariosController.EditorTabsId)
                    .BindItems(nameof(EditorGroupContext.Documents), UIBindingScope.Relative)
                    .BindSelectedKey(nameof(EditorGroupContext.SelectedKey), UIBindingScope.Relative)
                    .SetRenamable(true)
                    .SetDraggable(true)
                    // On the tab template, so every tab carries the menu; the tab's own id reaches the command from the enclosing item.
                    .SetTemplate(new DefaultTabItemTemplate(binds: true)
                        .SetContextMenu(new MenuComponent()
                            .SetItems(
                            [
                                new MenuItem { Id = TabsViewScenariosController.RenameAction, Title = "Rename", Icon = DemoIcons.Outline(DemoIcons.Edit) },
                                new MenuItem { Id = EditorGroupContext.PinAction, Title = "Pin", Icon = DemoIcons.Outline(DemoIcons.Star) },
                                new MenuItem { Id = EditorGroupContext.CloseOthersAction, Title = "Close others", Icon = DemoIcons.Outline(DemoIcons.Close) },
                                new MenuItem { Id = EditorGroupContext.CloseAction, Title = "Close", Icon = DemoIcons.Outline(DemoIcons.Close) }
                            ])
                            .OnItemClick(nameof(TabsViewScenariosController.TabAction), UIAction.ArgCurrentItemKey("action"), UIAction.ArgParent("id", nameof(DemoDocumentItem.Id)))
                        )
                    )
                    .OnItemRemove(nameof(TabsViewScenariosController.CloseDocument))
                    .OnItemRename(nameof(TabsViewScenariosController.RenameDocument), UIAction.ArgCurrentItemKey("id"))
                    .SetPageTemplate(new ParagraphComponent()
                        .BindDescription(nameof(DemoDocumentItem.Body), UIBindingScope.Relative)
                        .SetDescriptionType(UITextAppearance.Caption)
                        .SetMargin(UIThickness.All(0, 4, 0, 0))
                    )
                    .SetVerticalAlignment(UIAlignment.Start)
                    .SetPlacement(10, 1, 15, 1)
                ),
            contentMinHeight: 300,
            note: "Open a file, close it, rename it, drag a header, right-click one: each one reaches the controller as a change to a single document, and the controller is what answers."
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
            note: "SelectedKey is a property, so a command walks the tabs as readily as a click does — and a click moves the same property back."
        );
    }
}
