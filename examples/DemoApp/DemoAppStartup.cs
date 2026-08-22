using System;
using DemoApp.Controllers.Actions.Action;
using DemoApp.Controllers.Actions.Button;
using DemoApp.Controllers.Actions.CommandBar;
using DemoApp.Controllers.Contents.Badge;
using DemoApp.Controllers.Contents.Icon;
using DemoApp.Controllers.Contents.Image;
using DemoApp.Controllers.Contents.KeyValueAction;
using DemoApp.Controllers.Contents.Link;
using DemoApp.Controllers.Contents.Separator;
using DemoApp.Controllers.Contents.Text;
using DemoApp.Controllers.Indicators.Progress;
using DemoApp.Controllers.Indicators.Spinner;
using DemoApp.Controllers.Inputs.Checkbox;
using DemoApp.Controllers.Inputs.DateInput;
using DemoApp.Controllers.Inputs.DateTimeInput;
using DemoApp.Controllers.Inputs.FileInput;
using DemoApp.Controllers.Inputs.NumberInput;
using DemoApp.Controllers.Inputs.RadioGroup;
using DemoApp.Controllers.Inputs.Search;
using DemoApp.Controllers.Inputs.Select;
using DemoApp.Controllers.Inputs.Slider;
using DemoApp.Controllers.Inputs.Switch;
using DemoApp.Controllers.Inputs.TextArea;
using DemoApp.Controllers.Inputs.TextInput;
using DemoApp.Controllers.Inputs.TimeInput;
using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Controllers.Layouts.Card;
using DemoApp.Controllers.Layouts.Container;
using DemoApp.Controllers.Layouts.Expander;
using DemoApp.Controllers.Layouts.Flyout;
using DemoApp.Controllers.Layouts.ScrollContainer;
using DemoApp.Controllers.Layouts.StackPanel;
using DemoApp.Controllers.Layouts.WrapPanel;
using DemoApp.Controllers.Navigation.Breadcrumbs;
using DemoApp.Controllers.Navigation.ContextMenu;
using DemoApp.Controllers.Navigation.Menu;
using DemoApp.Controllers.Navigation.Tabs;
using DemoApp.Controllers.Navigation.TabsView;
using DemoApp.Controllers.Overlays;
using DemoApp.Controllers.Security;
using DemoApp.Security;
using DemoApp.Views;
using DemoApp.Views.Actions.Action;
using DemoApp.Views.Actions.Button;
using DemoApp.Views.Actions.CommandBar;
using DemoApp.Views.Contents.Badge;
using DemoApp.Views.Contents.Icon;
using DemoApp.Views.Contents.Image;
using DemoApp.Views.Contents.KeyValueAction;
using DemoApp.Views.Contents.Link;
using DemoApp.Views.Contents.Separator;
using DemoApp.Views.Contents.Text;
using DemoApp.Views.Design.Colors;
using DemoApp.Views.Indicators.Progress;
using DemoApp.Views.Indicators.Spinner;
using DemoApp.Views.Inputs.Checkbox;
using DemoApp.Views.Inputs.DateInput;
using DemoApp.Views.Inputs.DateTimeInput;
using DemoApp.Views.Inputs.FileInput;
using DemoApp.Views.Inputs.NumberInput;
using DemoApp.Views.Inputs.RadioGroup;
using DemoApp.Views.Inputs.Search;
using DemoApp.Views.Inputs.Select;
using DemoApp.Views.Inputs.Slider;
using DemoApp.Views.Inputs.Switch;
using DemoApp.Views.Inputs.TextArea;
using DemoApp.Views.Inputs.TextInput;
using DemoApp.Views.Inputs.TimeInput;
using DemoApp.Views.Items.ItemsView;
using DemoApp.Views.Layouts.Card;
using DemoApp.Views.Layouts.Container;
using DemoApp.Views.Layouts.Expander;
using DemoApp.Views.Layouts.Flyout;
using DemoApp.Views.Layouts.ScrollContainer;
using DemoApp.Views.Layouts.StackPanel;
using DemoApp.Views.Layouts.WrapPanel;
using DemoApp.Views.Navigation.Breadcrumbs;
using DemoApp.Views.Navigation.ContextMenu;
using DemoApp.Views.Navigation.Menu;
using DemoApp.Views.Navigation.Tabs;
using DemoApp.Views.Navigation.TabsView;
using DemoApp.Views.Overlays;
using DemoApp.Views.Security;
using NE.Standard.UI.Application;
using NE.Standard.UI.Startup;

namespace DemoApp;

public sealed class DemoAppStartup : UIStartupBase
{
    protected override void ConfigureApplication(UIApplicationBuilder application)
    {
        ArgumentNullException.ThrowIfNull(application);

        _ = application.AddLocalizationSource(DemoTranslations.Build());

        _ = application.Route<HomeView>("/");

        // Security. SignInView also records the route the host redirects a refused request to, so the two
        // pages below cannot be reached without an identity and cannot dead-end when they refuse one.
        _ = application.SignInView<SignInView, SignInController>(SecurityRoutes.SignIn);
        _ = application.Route<AccountView, AccountController>(SecurityRoutes.Account);
        _ = application.Route<ReportsView>(SecurityRoutes.Reports);
        _ = application.ForbiddenView<ForbiddenView>(SecurityRoutes.Forbidden);

        _ = application.Route<ColorsView>("/design/colors");
        _ = application.Route<ColorsSemanticView>("/design/colors/semantic");
        _ = application.Route<ColorsComponentsView>("/design/colors/components");

        // Layouts
        // Binding only, by the rule in docs/PROJECT.md §1: a container is a placement grid with no variants to
        // put side by side, and every other page in the demo is already built out of one.
        _ = application.Route<ContainerBindingView, ContainerBindingController>("/layouts/container/binding");

        _ = application.Route<StackPanelExampleView>("/layouts/stack-panel/example");
        _ = application.Route<StackPanelBindingView, StackPanelBindingController>("/layouts/stack-panel/binding");
        _ = application.Route<WrapPanelExampleView>("/layouts/wrap-panel/example");
        _ = application.Route<WrapPanelBindingView, WrapPanelBindingController>("/layouts/wrap-panel/binding");
        _ = application.Route<CardExampleView>("/layouts/card/example");
        _ = application.Route<CardBindingView, CardBindingController>("/layouts/card/binding");
        _ = application.Route<CardTestView, CardTestController>("/layouts/card/test");
        _ = application.Route<ExpanderExampleView>("/layouts/expander/example");
        _ = application.Route<ExpanderBindingView, ExpanderBindingController>("/layouts/expander/binding");
        _ = application.Route<ExpanderTestView, ExpanderTestController>("/layouts/expander/test");
        _ = application.Route<ScrollContainerExampleView>("/layouts/scroll-container/example");
        _ = application.Route<ScrollContainerBindingView, ScrollContainerBindingController>("/layouts/scroll-container/binding");
        _ = application.Route<ScrollContainerTestView, ScrollContainerTestController>("/layouts/scroll-container/test");
        _ = application.Route<FlyoutExampleView>("/layouts/flyout/example");
        _ = application.Route<FlyoutBindingView, FlyoutBindingController>("/layouts/flyout/binding");
        _ = application.Route<FlyoutTestView, FlyoutTestController>("/layouts/flyout/test");

        // Contents
        _ = application.Route<TextExampleView>("/contents/text/example");
        _ = application.Route<TextBindingView, TextBindingController>("/contents/text/binding");
        _ = application.Route<BadgeExampleView>("/contents/badge/example");
        _ = application.Route<BadgeBindingView, BadgeBindingController>("/contents/badge/binding");
        _ = application.Route<IconExampleView>("/contents/icon/example");
        _ = application.Route<IconBindingView, IconBindingController>("/contents/icon/binding");
        _ = application.Route<ImageExampleView>("/contents/image/example");
        _ = application.Route<ImageBindingView, ImageBindingController>("/contents/image/binding");
        _ = application.Route<LinkExampleView>("/contents/link/example");
        _ = application.Route<LinkBindingView, LinkBindingController>("/contents/link/binding");
        _ = application.Route<SeparatorExampleView>("/contents/separator/example");
        _ = application.Route<KeyValueActionExampleView>("/contents/key-value-action/example");
        _ = application.Route<KeyValueActionBindingView, KeyValueActionBindingController>("/contents/key-value-action/binding");
        _ = application.Route<KeyValueActionTestView, KeyValueActionTestController>("/contents/key-value-action/test");
        _ = application.Route<SeparatorBindingView, SeparatorBindingController>("/contents/separator/binding");

        // Actions
        _ = application.Route<CommandBarExampleView>("/actions/command-bar/example");
        _ = application.Route<CommandBarBindingView, CommandBarBindingController>("/actions/command-bar/binding");
        _ = application.Route<CommandBarTestView, CommandBarTestController>("/actions/command-bar/test");
        _ = application.Route<ButtonExampleView>("/actions/button/example");
        _ = application.Route<ButtonBindingView, ButtonBindingController>("/actions/button/binding");
        _ = application.Route<ButtonTestView, ButtonTestController>("/actions/button/test");
        _ = application.Route<ActionExampleView>("/actions/action/example");
        _ = application.Route<ActionBindingView, ActionBindingController>("/actions/action/binding");
        _ = application.Route<ActionTestView, ActionTestController>("/actions/action/test");
        _ = application.Route<MenuExampleView>("/navigation/menu/example");
        _ = application.Route<MenuBindingView, MenuBindingController>("/navigation/menu/binding");
        _ = application.Route<ContextMenuTestView, ContextMenuTestController>("/navigation/context-menu/test");
        _ = application.Route<TabsExampleView>("/navigation/tabs/example");
        _ = application.Route<TabsBindingView, TabsBindingController>("/navigation/tabs/binding");
        _ = application.Route<BreadcrumbsExampleView>("/navigation/breadcrumbs/example");
        _ = application.Route<BreadcrumbsBindingView, BreadcrumbsBindingController>("/navigation/breadcrumbs/binding");
        _ = application.Route<BreadcrumbsTestView, BreadcrumbsTestController>("/navigation/breadcrumbs/test");
        _ = application.Route<TabsViewExampleView>("/navigation/tabs-view/example");
        _ = application.Route<TabsViewBindingView, TabsViewBindingController>("/navigation/tabs-view/binding");
        _ = application.Route<TabsViewTestView, TabsViewTestController>("/navigation/tabs-view/test");

        // Inputs
        _ = application.Route<TextInputExampleView>("/inputs/text-input/example");
        _ = application.Route<TextInputBindingView, TextInputBindingController>("/inputs/text-input/binding");
        _ = application.Route<TextInputTestView, TextInputTestController>("/inputs/text-input/test");
        _ = application.Route<TextAreaExampleView>("/inputs/text-area/example");
        _ = application.Route<TextAreaBindingView, TextAreaBindingController>("/inputs/text-area/binding");
        _ = application.Route<FileInputExampleView>("/inputs/file-input/example");
        _ = application.Route<FileInputBindingView, FileInputBindingController>("/inputs/file-input/binding");
        _ = application.Route<FileInputTestView, FileInputTestController>("/inputs/file-input/test");
        _ = application.Route<NumberInputExampleView>("/inputs/number-input/example");
        _ = application.Route<NumberInputBindingView, NumberInputBindingController>("/inputs/number-input/binding");
        _ = application.Route<NumberInputTestView, NumberInputTestController>("/inputs/number-input/test");
        _ = application.Route<SliderExampleView>("/inputs/slider/example");
        _ = application.Route<SliderBindingView, SliderBindingController>("/inputs/slider/binding");
        _ = application.Route<SliderTestView, SliderTestController>("/inputs/slider/test");
        _ = application.Route<SearchExampleView>("/inputs/search/example");
        _ = application.Route<SearchBindingView, SearchBindingController>("/inputs/search/binding");
        _ = application.Route<SearchTestView, SearchTestController>("/inputs/search/test");
        _ = application.Route<SelectExampleView>("/inputs/select/example");
        _ = application.Route<SelectBindingView, SelectBindingController>("/inputs/select/binding");
        _ = application.Route<SelectTestView, SelectTestController>("/inputs/select/test");
        _ = application.Route<DateInputExampleView>("/inputs/date-input/example");
        _ = application.Route<DateInputBindingView, DateInputBindingController>("/inputs/date-input/binding");
        _ = application.Route<DateInputTestView, DateInputTestController>("/inputs/date-input/test");
        _ = application.Route<TimeInputExampleView>("/inputs/time-input/example");
        _ = application.Route<TimeInputBindingView, TimeInputBindingController>("/inputs/time-input/binding");
        _ = application.Route<DateTimeInputExampleView>("/inputs/date-time-input/example");
        _ = application.Route<DateTimeInputBindingView, DateTimeInputBindingController>("/inputs/date-time-input/binding");
        _ = application.Route<RadioGroupExampleView>("/inputs/radio-group/example");
        _ = application.Route<RadioGroupBindingView, RadioGroupBindingController>("/inputs/radio-group/binding");
        _ = application.Route<RadioGroupTestView, RadioGroupTestController>("/inputs/radio-group/test");
        _ = application.Route<CheckboxExampleView>("/inputs/checkbox/example");
        _ = application.Route<CheckboxBindingView, CheckboxBindingController>("/inputs/checkbox/binding");
        _ = application.Route<CheckboxTestView, CheckboxTestController>("/inputs/checkbox/test");
        _ = application.Route<SwitchExampleView>("/inputs/switch/example");
        _ = application.Route<SwitchBindingView, SwitchBindingController>("/inputs/switch/binding");

        // Indicators
        _ = application.Route<ProgressExampleView>("/indicators/progress/example");
        _ = application.Route<ProgressBindingView, ProgressBindingController>("/indicators/progress/binding");
        _ = application.Route<SpinnerExampleView>("/indicators/spinner/example");
        _ = application.Route<SpinnerBindingView, SpinnerBindingController>("/indicators/spinner/binding");

        // Items
        _ = application.Route<ItemsViewExampleView>("/items/items-view/example");
        _ = application.Route<ItemsViewBindingView, ItemsViewBindingController>("/items/items-view/binding");
        _ = application.Route<ItemsViewTestView, ItemsViewTestController>("/items/items-view/test");
        _ = application.Route<ItemsViewWindowView, ItemsViewWindowController>("/items/items-view/window");

        _ = application.Route<DialogTestView, DialogTestController>("/overlays/dialog/test");
        _ = application.Route<NotificationTestView, NotificationTestController>("/overlays/notification/test");
    }
}
