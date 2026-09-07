using System;
using DemoApp.Controllers.Contents.KeyValueAction;
using DemoApp.Views.Base;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;

namespace DemoApp.Views.Contents.KeyValueAction;

/// <summary>
/// Proves that a click on a client-composed row and one on its action button both resolve against the same item, and that a
/// row can become the input that edits its value — opened by the controller with a typed draft, or on the client alone.
/// </summary>
internal sealed class KeyValueActionScenariosView : DemoScenariosView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.key-value-action.scenarios";

    protected override string ComponentRoute => "/contents/key-value-action";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Main, DemoViewKind.Examples, DemoViewKind.Scenarios];
    protected override string Header => "demo.contents.key-value-action.header";
    protected override string HeaderDescription => "demo.contents.key-value-action.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container.AddChildren(DemoUI.CreateColumns(
            [
                CreateListGroup(
                    nameof(KeyValueActionScenariosController.RowGroup),
                    "Row click: the whole item",
                    list => list.OnRowClickWithItem(nameof(KeyValueActionScenariosController.ClickRowWithItem))
                ),
                CreateEditGroup()
            ],
            [
                CreateListGroup(
                    nameof(KeyValueActionScenariosController.ActionGroup),
                    "Action click: the item key",
                    list => list.OnActionClickWithItemKey(nameof(KeyValueActionScenariosController.ClickActionWithKey))
                ),
                CreateLocalEditGroup()
            ]
        ));
    }

    /// <summary>
    /// The pencil asks the controller, which seeds the draft as the input wants it: text, a number, a flag, a picture. Enter saves, Escape cancels.
    /// </summary>
    private static ContainerComponent CreateEditGroup()
    {
        return DemoUI.CreateGroup(nameof(KeyValueActionScenariosController.EditGroup), "Edit in place, opened by the controller",
            content => content.AddChild(new KeyValueActionComponent()
                .BindItems(nameof(KeyValueActionEditGroupContext.Items), UIBindingScope.Relative)
                .AddValueInputTemplate("number", new NumberInputComponent().SetAppearance(UIInputAppearance.Ghost))
                .AddValueInputTemplate("switch", new SwitchComponent())
                .AddValueInputTemplate("avatar", new ImageInputComponent()
                    .SetShape(UIImageInputShape.Avatar)
                    .BindSelectionId(nameof(AvatarRowItem.SelectionId), UIBindingScope.Relative)
                )
                .EnableEditing(nameof(KeyValueActionScenariosController.SaveRowAsync), nameof(KeyValueActionScenariosController.OpenRow))
                .SetPlacement(1, 1, 24, 1)
            ),
            contentMinHeight: 220,
            note: "EnableEditing(save, edit) with a typed input per row (InputTemplate): the draft comes back as the input sent it, and Cancel is the client's alone."
        );
    }

    /// <summary>
    /// No edit command: the pencil flips the row's flag on the client, the value's own text is the draft, and only Save goes to the server.
    /// </summary>
    private static ContainerComponent CreateLocalEditGroup()
    {
        return DemoUI.CreateGroup(nameof(KeyValueActionScenariosController.LocalEditGroup), "Edit in place, opened on the client",
            content => content.AddChild(new KeyValueActionComponent()
                .BindItems(nameof(KeyValueActionLocalEditGroupContext.Items), UIBindingScope.Relative)
                .EnableEditing(nameof(KeyValueActionScenariosController.SaveLocalRow))
                .SetPlacement(1, 1, 24, 1)
            ),
            contentMinHeight: 140,
            note: "EnableEditing(save) alone: the row's ShowInput still reaches the controller through its two-way binding, so the server knows what the page did."
        );
    }

    private static ContainerComponent CreateListGroup(string context, string title, Action<KeyValueActionComponent> configure)
    {
        return DemoUI.CreateGroup(context, title,
            content =>
            {
                KeyValueActionComponent list = new KeyValueActionComponent()
                    .SetRowHoverable(true)
                    .BindItems(nameof(KeyValueActionArgumentGroupContext.Items), UIBindingScope.Relative)
                    .SetPlacement(1, 1, 24, 1);

                configure(list);

                _ = content.AddChild(list);
            },
            contentMinHeight: 200
        );
    }
}
