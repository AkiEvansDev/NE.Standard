using System.Collections.Generic;
using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Views.Base;
using NE.Standard.UI.Abstractions.Interaction;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Inputs;
using NE.Standard.UI.Components.BuiltIns.Items;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Icons.Lucide;
using NE.Standard.UI.Primitives.Binding;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Views;

namespace DemoApp.Views.Items.ItemsView;

internal sealed class ItemsViewTestView : DemoTestView, IUIViewDefinition
{
    private const string FilterSearchInputId = "items-test-search";

    public static string ViewKey => "demo.items.items-view.test";

    protected override string ComponentRoute => "/items/items-view";
    protected override DemoViewKind[] AvailableKinds => [DemoViewKind.Example, DemoViewKind.Binding, DemoViewKind.Test, DemoViewKind.Window];
    protected override string Header => "demo.items.items-view.header";
    protected override string HeaderDescription => "demo.items.items-view.description";

    protected override void DrawContent(WrapPanelComponent container)
        => container
            .AddChild(CreateMessageFeedGroup())
            .AddChild(CreateGroupingGroup())
            .AddChild(CreateFilterGroup())
            .AddChild(CreateScopeGroup());

    private static ContainerComponent CreateMessageFeedGroup()
    {
        return DemoUI.CreateGroup(nameof(ItemsViewTestController.MessageGroup), "Template variants (message feed)",
            content => content.AddChild(new ItemsViewComponent()
                .BindItems(nameof(MessageFeedGroupContext.Messages), UIBindingScope.Relative)
                .SetSpacing(8)
                .SetTemplateKeyProperty(nameof(DemoMessageItem.Kind))
                .SetFallbackTemplateKey("text")
                .AddTemplateVariant("text", CreateMessageTemplate(withImage: false))
                .AddTemplateVariant("image", CreateMessageTemplate(withImage: true))
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add text"] = nameof(ItemsViewTestController.AddTextMessage),
                ["Add photo"] = nameof(ItemsViewTestController.AddImageMessage),
            }),
            contentMinHeight: 420
        );
    }

    private static ContainerComponent CreateMessageTemplate(bool withImage)
    {
        StackPanelComponent body = new StackPanelComponent()
            .SetOrientation(UIOrientation.Vertical)
            .SetSpacing(6)
            .SetPlacement(1, 1, 24, 1)
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .AddChild(new TextComponent()
                    .SetIcon(withImage ? LucideIcons.Image : LucideIcons.MessageSquare)
                    .BindTitle(nameof(DemoMessageItem.Author), UIBindingScope.Relative)
                    .SetTitleType(UITextAppearance.Caption)
                    .SetTitleColor(UIThemeColor.Primary)
                    .SetHorizontalAlignment(UIAlignment.Stretch)
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .OnClick(nameof(ItemsViewTestController.ToggleMessageKind), UIAction.ArgCurrentItem("message"))
                    .ConfigureDefaultContent(c => c.SetTitle(withImage ? "To text" : "To photo").SetTitleType(UITextAppearance.Caption))
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .OnClick(nameof(ItemsViewTestController.RemoveMessage), UIAction.ArgCurrentItem("message"))
                    .ConfigureDefaultContent(c => c.SetTitle("Remove").SetTitleType(UITextAppearance.Caption))
                )
            );

        if (withImage)
        {
            _ = body.AddChild(new ImageComponent()
                .BindSource(nameof(DemoMessageItem.ImageUrl), UIBindingScope.Relative)
                .SetAltText("Message photo")
                .SetHeight(UILayoutLength.Absolute(140))
                .SetFit(UIImageFit.Cover)
                .SetCornerRadius(UICornerRadius.Uniform(6))
            );
        }

        _ = body.AddChild(new TextComponent()
            .BindDescription(nameof(DemoMessageItem.Text), UIBindingScope.Relative)
            .SetDescriptionType(UITextAppearance.Body)
        );

        return new ContainerComponent()
            .SetPadding(UIThickness.Uniform(10))
            .SetBackground(UIThemeColor.Surface)
            .SetBorderRadius(UICornerRadius.Uniform(8))
            .AddRow(UIGridUnit.Auto())
            .AddChild(body);
    }

    private static ContainerComponent CreateGroupingGroup()
    {
        return DemoUI.CreateGroup(nameof(ItemsViewTestController.GroupingGroup), "Grouping",
            content => content.AddChild(new ItemsViewComponent()
                .BindItems(nameof(GroupingTestGroupContext.Items), UIBindingScope.Relative)
                .SetSpacing(4)
                .SetItemTemplate(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(8)
                    .AddChild(new TextComponent()
                        .BindTitle(nameof(DemoGroupedItem.Title), UIBindingScope.Relative)
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .OnClick(nameof(ItemsViewTestController.MoveToNextGroup), UIAction.ArgCurrentItem("item"))
                        .ConfigureDefaultContent(c => c.SetTitle("Next group").SetTitleType(UITextAppearance.Caption))
                    )
                    .AddChild(new ButtonComponent()
                        .SetType(UIButtonType.Ghost)
                        .OnClick(nameof(ItemsViewTestController.RemoveGroupedItem), UIAction.ArgCurrentItem("item"))
                        .ConfigureDefaultContent(c => c.SetTitle("Remove").SetTitleType(UITextAppearance.Caption))
                    )
                )
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add item"] = nameof(ItemsViewTestController.AddGroupedItem),
            }),
            contentMinHeight: 260
        );
    }

    private static ContainerComponent CreateFilterGroup()
    {
        return DemoUI.CreateGroup(nameof(ItemsViewTestController.FilterGroup), "Filter (search, applies on commit)",
            content =>
            {
                StackPanelComponent stack = new StackPanelComponent()
                    .SetOrientation(UIOrientation.Vertical)
                    .SetSpacing(8);

                _ = stack
                    .AddChild(new TextInputComponent(FilterSearchInputId)
                        .BindValue(nameof(FilterTestGroupContext.SearchText), UIBindingScope.Relative)
                        .SetHorizontalAlignment(UIAlignment.Stretch)
                    )
                    .AddChild(new ItemsViewComponent()
                        .BindItems(nameof(FilterTestGroupContext.Items), UIBindingScope.Relative)
                        .SetSpacing(4)
                        .FilterBy(FilterSearchInputId, IInputComponent.ValueProperty, nameof(DemoFilterItem.Title))
                        .SetItemTemplate(new StackPanelComponent()
                            .SetOrientation(UIOrientation.Horizontal)
                            .SetSpacing(8)
                            .AddChild(new TextComponent()
                                .BindTitle(nameof(DemoFilterItem.Title), UIBindingScope.Relative)
                                .SetHorizontalAlignment(UIAlignment.Stretch)
                            )
                            .AddChild(new ButtonComponent()
                                .SetType(UIButtonType.Ghost)
                                .OnClick(nameof(ItemsViewTestController.RemoveFilterItem), UIAction.ArgCurrentItem("item"))
                                .ConfigureDefaultContent(c => c.SetTitle("Remove").SetTitleType(UITextAppearance.Caption))
                            )
                        )
                    );

                _ = content.AddChild(stack.SetPlacement(1, 1, 24, 1));
            },
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add item"] = nameof(ItemsViewTestController.AddFilterItem),
            }),
            contentMinHeight: 320
        );
    }

    private static ContainerComponent CreateScopeGroup()
    {
        return DemoUI.CreateGroup(nameof(ItemsViewTestController.ScopeGroup), "Nested list & binding scopes",
            content => content.AddChild(new ItemsViewComponent()
                .BindItems(nameof(ScopeTestGroupContext.Items), UIBindingScope.Relative)
                .SetSpacing(12)
                .SetItemTemplate(CreateScopeParentTemplate())
                .SetPlacement(1, 1, 24, 1)
            ),
            controls => DemoUI.InitControls(controls, new Dictionary<string, string>
            {
                ["Add parent"] = nameof(ItemsViewTestController.AddScopeParent),
                ["+1 global"] = nameof(ItemsViewTestController.IncrementGlobalLabel),
            }),
            contentMinHeight: 320
        );
    }

    private static ContainerComponent CreateScopeParentTemplate()
    {
        return new ContainerComponent()
            .SetPadding(UIThickness.Uniform(8))
            .SetBorderColor(UIThemeColor.Border)
            .SetBorderThickness(UIThickness.Uniform(1))
            .SetBorderRadius(UICornerRadius.Uniform(6))
            .AddRow(UIGridUnit.Auto())
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetSpacing(8)
                .SetPlacement(1, 1, 24, 1)
                .AddChild(new TextComponent()
                    .BindTitle(nameof(DemoScopeParentItem.Title), UIBindingScope.Relative)
                    .SetTitleType(UITextAppearance.Body)
                    .SetWidth(UILayoutLength.Absolute(100))
                )
                .AddChild(CreateLabeledValue("Root:", new TextComponent()
                    .BindTitle(nameof(ItemsViewTestController.GlobalLabel), UIBindingScope.Root)
                ))
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .OnClick(nameof(ItemsViewTestController.AddScopeChild), UIAction.ArgCurrentItem("parent"))
                    .ConfigureDefaultContent(c => c.SetTitle("Add child").SetTitleType(UITextAppearance.Caption))
                )
                .AddChild(new ButtonComponent()
                    .SetType(UIButtonType.Ghost)
                    .OnClick(nameof(ItemsViewTestController.RemoveScopeParent), UIAction.ArgCurrentItem("parent"))
                    .ConfigureDefaultContent(c => c.SetTitle("Remove").SetTitleType(UITextAppearance.Caption))
                )
            )
            .AddChild(new ItemsViewComponent()
                .BindItems(nameof(DemoScopeParentItem.Children), UIBindingScope.Relative)
                .SetSpacing(4)
                .SetMargin(UIThickness.All(16, 8, 0, 0))
                .SetItemTemplate(new StackPanelComponent()
                    .SetOrientation(UIOrientation.Horizontal)
                    .SetSpacing(8)
                    .AddChild(new TextComponent()
                        .BindTitle(nameof(DemoScopeChildItem.Title), UIBindingScope.Relative)
                        .SetTitleType(UITextAppearance.Caption)
                    )
                    .AddChild(CreateLabeledValue("Parent:", new TextComponent()
                        .BindTitle(nameof(DemoScopeParentItem.Title), UIBindingScope.Parent)
                        .SetTitleType(UITextAppearance.Caption)
                    ))
                )
                .SetPlacement(1, 2, 24, 1)
            );
    }

    private static StackPanelComponent CreateLabeledValue(string label, TextComponent value)
    {
        return new StackPanelComponent()
            .SetOrientation(UIOrientation.Horizontal)
            .SetSpacing(4)
            .AddChild(new TextComponent()
                .SetTitle(label)
                .SetTitleType(UITextAppearance.Caption)
                .SetTitleColor(UIThemeColor.FromStyle(UIColorStyle.Muted))
            )
            .AddChild(value.SetTitleType(UITextAppearance.Caption));
    }
}
