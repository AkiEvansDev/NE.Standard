using System;
using DemoApp.Controllers.Contents.KeyValueAction;
using DemoApp.Views.Base;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Contents.KeyValueAction;

/// <summary>
/// Covers the two things only a live click can prove on a client-composed row: that a click on the row
/// itself resolves against the identity stamped onto it from the (never-rendered) row template, and that a
/// click on the action button inside its own cloned slot resolves against the same item. Both arguments
/// come from the click site's own dynamic-parameter stack, so a mismatch between the compiled binding and
/// the composed row shows up as a wrong value or a dispatch failure, never as a build error.
/// </summary>
internal sealed class KeyValueActionTestView : DemoTestView, IUIViewDefinition
{
    public static string ViewKey => "demo.contents.key-value-action.test";

    protected override string ComponentRoute => "/contents/key-value-action";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test];
    protected override string Header => "demo.contents.key-value-action.header";
    protected override string HeaderDescription => "demo.contents.key-value-action.description";

    protected override void DrawContent(WrapPanelComponent container)
    {
        _ = container
            .AddChild(CreateGroup(
                nameof(KeyValueActionTestController.RowGroup),
                "Row click: the whole item",
                list => list.OnRowClickWithItem(nameof(KeyValueActionTestController.ClickRowWithItem))
            ))
            .AddChild(CreateGroup(
                nameof(KeyValueActionTestController.ActionGroup),
                "Action click: the item key",
                list => list.OnActionClickWithItemKey(nameof(KeyValueActionTestController.ClickActionWithKey))
            ));
    }

    private static ContainerComponent CreateGroup(string context, string title, Action<KeyValueActionComponent> configure)
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
            static _ => { },
            contentMinHeight: 200
        );
    }
}
