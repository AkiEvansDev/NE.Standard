using System;
using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Contents.Badge;
using DemoApp.Controllers.Contents.Icon;
using DemoApp.Controllers.Contents.Image;
using DemoApp.Controllers.Contents.Link;
using DemoApp.Controllers.Contents.Paragraph;
using DemoApp.Controllers.Contents.Separator;
using DemoApp.Controllers.Contents.Text;
using DemoApp.Controllers.Indicators.Progress;
using DemoApp.Controllers.Indicators.Spinner;
using DemoApp.Controllers.Inputs.ColorInput;
using DemoApp.Controllers.Inputs.FileInput;
using DemoApp.Controllers.Inputs.ImageInput;
using DemoApp.Controllers.Inputs.NumberInput;
using DemoApp.Controllers.Inputs.RadioGroup;
using DemoApp.Controllers.Inputs.Search;
using DemoApp.Controllers.Inputs.Select;
using DemoApp.Controllers.Inputs.Slider;
using DemoApp.Controllers.Inputs.Temporal;
using DemoApp.Controllers.Inputs.TextArea;
using DemoApp.Controllers.Inputs.TextInput;
using DemoApp.Controllers.Inputs.Toggle;
using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Controllers.Items.KeyValueAction;
using DemoApp.Controllers.Items.Table;
using DemoApp.Controllers.Items.Tree;
using DemoApp.Controllers.Layouts.Card;
using DemoApp.Controllers.Layouts.CollapsiblePanel;
using DemoApp.Controllers.Layouts.Container;
using DemoApp.Controllers.Layouts.Expander;
using DemoApp.Controllers.Layouts.Flyout;
using DemoApp.Controllers.Layouts.GridSplitter;
using DemoApp.Controllers.Layouts.Scroll;
using DemoApp.Controllers.Layouts.StackPanel;
using DemoApp.Controllers.Layouts.Surface;
using DemoApp.Controllers.Layouts.WrapPanel;
using DemoApp.Controllers.Navigation.Breadcrumbs;
using DemoApp.Controllers.Navigation.ButtonGroup;
using DemoApp.Controllers.Navigation.Menu;
using DemoApp.Controllers.Navigation.Tabs;
using DemoApp.Controllers.Navigation.TabsView;
using DemoApp.Controllers.Overlays;
using DemoApp.Views;
using DemoApp.Views.Actions;
using DemoApp.Views.Contents.Badge;
using DemoApp.Views.Contents.Icon;
using DemoApp.Views.Contents.Image;
using DemoApp.Views.Contents.Link;
using DemoApp.Views.Contents.Paragraph;
using DemoApp.Views.Contents.Separator;
using DemoApp.Views.Contents.Text;
using DemoApp.Views.Design.Colors;
using DemoApp.Views.Indicators.Progress;
using DemoApp.Views.Indicators.Spinner;
using DemoApp.Views.Inputs.ColorInput;
using DemoApp.Views.Inputs.FileInput;
using DemoApp.Views.Inputs.ImageInput;
using DemoApp.Views.Inputs.NumberInput;
using DemoApp.Views.Inputs.RadioGroup;
using DemoApp.Views.Inputs.Search;
using DemoApp.Views.Inputs.Select;
using DemoApp.Views.Inputs.Slider;
using DemoApp.Views.Inputs.Temporal;
using DemoApp.Views.Inputs.TextArea;
using DemoApp.Views.Inputs.TextInput;
using DemoApp.Views.Inputs.Toggle;
using DemoApp.Views.Items.ItemsView;
using DemoApp.Views.Items.KeyValueAction;
using DemoApp.Views.Items.Table;
using DemoApp.Views.Items.Tree;
using DemoApp.Views.Layouts.Card;
using DemoApp.Views.Layouts.CollapsiblePanel;
using DemoApp.Views.Layouts.Container;
using DemoApp.Views.Layouts.Expander;
using DemoApp.Views.Layouts.Flyout;
using DemoApp.Views.Layouts.GridSplitter;
using DemoApp.Views.Layouts.Scroll;
using DemoApp.Views.Layouts.StackPanel;
using DemoApp.Views.Layouts.Surface;
using DemoApp.Views.Layouts.WrapPanel;
using DemoApp.Views.Navigation.Breadcrumbs;
using DemoApp.Views.Navigation.ButtonGroup;
using DemoApp.Views.Navigation.Menu;
using DemoApp.Views.Navigation.Tabs;
using DemoApp.Views.Navigation.TabsView;
using DemoApp.Views.Overlays;
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

        _ = application.Route<ColorsView>("/design/colors");
        _ = application.Route<ColorsSemanticView>("/design/colors/semantic");
        _ = application.Route<ColorsComponentsView>("/design/colors/components");

        // Actions
        _ = application.Route<ButtonMainView, ButtonMainController>("/actions/button");
        _ = application.Route<ButtonExamplesView>("/actions/button/examples");
        _ = application.Route<ButtonScenariosView, ButtonScenariosController>("/actions/button/scenarios");
        _ = application.Route<ActionMainView, ActionMainController>("/actions/action");
        _ = application.Route<ActionExamplesView>("/actions/action/examples");
        _ = application.Route<CommandBarMainView, CommandBarMainController>("/actions/command-bar");
        _ = application.Route<CommandBarExamplesView, CommandBarExamplesController>("/actions/command-bar/examples");
        _ = application.Route<ThemeSwitcherMainView, ThemeSwitcherMainController>("/actions/theme-switcher");
        _ = application.Route<SplitButtonMainView, SplitButtonMainController>("/actions/split-button");
        _ = application.Route<SplitButtonExamplesView>("/actions/split-button/examples");

        // Layouts
        _ = application.Route<ContainerMainView, ContainerMainController>("/layouts/container");
        _ = application.Route<SurfaceMainView, SurfaceMainController>("/layouts/surface");
        _ = application.Route<SurfaceExamplesView>("/layouts/surface/examples");
        _ = application.Route<CardMainView, CardMainController>("/layouts/card");
        _ = application.Route<CardExamplesView>("/layouts/card/examples");
        _ = application.Route<CardScenariosView, CardScenariosController>("/layouts/card/scenarios");
        _ = application.Route<ExpanderMainView, ExpanderMainController>("/layouts/expander");
        _ = application.Route<ExpanderExamplesView>("/layouts/expander/examples");
        _ = application.Route<ExpanderScenariosView, ExpanderScenariosController>("/layouts/expander/scenarios");
        _ = application.Route<StackPanelMainView, StackPanelMainController>("/layouts/stack-panel");
        _ = application.Route<WrapPanelMainView, WrapPanelMainController>("/layouts/wrap-panel");
        _ = application.Route<ScrollMainView, ScrollMainController>("/layouts/scroll");
        _ = application.Route<ScrollExamplesView>("/layouts/scroll/examples");
        _ = application.Route<ScrollScenariosView, ScrollScenariosController>("/layouts/scroll/scenarios");
        _ = application.Route<FlyoutMainView, FlyoutMainController>("/layouts/flyout");
        _ = application.Route<FlyoutExamplesView>("/layouts/flyout/examples");
        _ = application.Route<CollapsiblePanelMainView, CollapsiblePanelMainController>("/layouts/collapsible-panel");
        _ = application.Route<CollapsiblePanelExamplesView>("/layouts/collapsible-panel/examples");
        _ = application.Route<GridSplitterMainView, GridSplitterMainController>("/layouts/grid-splitter");
        _ = application.Route<GridSplitterExamplesView>("/layouts/grid-splitter/examples");

        // Contents
        _ = application.Route<BadgeMainView, BadgeMainController>("/contents/badge");
        _ = application.Route<BadgeExamplesView>("/contents/badge/examples");
        _ = application.Route<IconMainView, IconMainController>("/contents/icon");
        _ = application.Route<IconExamplesView>("/contents/icon/examples");
        _ = application.Route<ImageMainView, ImageMainController>("/contents/image");
        _ = application.Route<ImageExamplesView>("/contents/image/examples");
        _ = application.Route<LinkMainView, LinkMainController>("/contents/link");
        _ = application.Route<LinkExamplesView>("/contents/link/examples");
        _ = application.Route<SeparatorMainView, SeparatorMainController>("/contents/separator");
        _ = application.Route<SeparatorExamplesView>("/contents/separator/examples");

        // Indicators
        _ = application.Route<ProgressMainView, ProgressMainController>("/indicators/progress");
        _ = application.Route<ProgressExamplesView>("/indicators/progress/examples");
        _ = application.Route<SpinnerMainView, SpinnerMainController>("/indicators/spinner");
        _ = application.Route<SpinnerExamplesView>("/indicators/spinner/examples");
        _ = application.Route<TextMainView, TextMainController>("/contents/text");
        _ = application.Route<TextExamplesView>("/contents/text/examples");
        _ = application.Route<ParagraphMainView, ParagraphMainController>("/contents/paragraph");
        _ = application.Route<ParagraphExamplesView>("/contents/paragraph/examples");
        _ = application.Route<KeyValueActionMainView, KeyValueActionMainController>("/items/key-value-action");
        _ = application.Route<KeyValueActionExamplesView>("/items/key-value-action/examples");
        _ = application.Route<KeyValueActionScenariosView, KeyValueActionScenariosController>("/items/key-value-action/scenarios");

        // Navigation
        _ = application.Route<MenuMainView, MenuMainController>("/navigation/menu");
        _ = application.Route<MenuExamplesView, MenuExamplesController>("/navigation/menu/examples");
        _ = application.Route<TabsMainView, TabsMainController>("/navigation/tabs");
        _ = application.Route<TabsExamplesView>("/navigation/tabs/examples");
        _ = application.Route<TabsViewMainView, TabsViewMainController>("/navigation/tabs-view");
        _ = application.Route<TabsViewExamplesView>("/navigation/tabs-view/examples");
        _ = application.Route<TabsViewScenariosView, TabsViewScenariosController>("/navigation/tabs-view/scenarios");
        _ = application.Route<BreadcrumbsMainView, BreadcrumbsMainController>("/navigation/breadcrumbs");
        _ = application.Route<BreadcrumbsExamplesView, BreadcrumbsExamplesController>("/navigation/breadcrumbs/examples");
        _ = application.Route<ButtonGroupMainView, ButtonGroupMainController>("/navigation/button-group");
        _ = application.Route<ButtonGroupExamplesView>("/navigation/button-group/examples");

        // Inputs
        _ = application.Route<TextInputExamplesView>("/inputs/text-input/examples");
        _ = application.Route<TextInputMainView, TextInputMainController>("/inputs/text-input");
        _ = application.Route<ColorInputMainView, ColorInputMainController>("/inputs/color-input");
        _ = application.Route<ColorInputExamplesView>("/inputs/color-input/examples");
        _ = application.Route<SelectMainView, SelectMainController>("/inputs/select");
        _ = application.Route<SelectExamplesView>("/inputs/select/examples");
        _ = application.Route<SearchMainView, SearchMainController>("/inputs/search");
        _ = application.Route<SearchExamplesView, SearchExamplesController>("/inputs/search/examples");
        _ = application.Route<FileInputMainView, FileInputMainController>("/inputs/file-input");
        _ = application.Route<FileInputExamplesView>("/inputs/file-input/examples");
        _ = application.Route<ImageInputMainView, ImageInputMainController>("/inputs/image-input");
        _ = application.Route<ImageInputExamplesView>("/inputs/image-input/examples");
        _ = application.Route<SliderMainView, SliderMainController>("/inputs/slider");
        _ = application.Route<SliderExamplesView>("/inputs/slider/examples");
        _ = application.Route<DateInputMainView, DateInputMainController>("/inputs/date-input");
        _ = application.Route<DateInputExamplesView>("/inputs/date-input/examples");
        _ = application.Route<TimeInputMainView, TimeInputMainController>("/inputs/time-input");
        _ = application.Route<TimeInputExamplesView>("/inputs/time-input/examples");
        _ = application.Route<DateTimeInputMainView, DateTimeInputMainController>("/inputs/date-time-input");
        _ = application.Route<DateTimeInputExamplesView>("/inputs/date-time-input/examples");
        _ = application.Route<TextAreaMainView, TextAreaMainController>("/inputs/text-area");
        _ = application.Route<TextAreaExamplesView>("/inputs/text-area/examples");
        _ = application.Route<NumberInputMainView, NumberInputMainController>("/inputs/number-input");
        _ = application.Route<NumberInputExamplesView>("/inputs/number-input/examples");
        _ = application.Route<CheckboxMainView, CheckboxMainController>("/inputs/checkbox");
        _ = application.Route<CheckboxExamplesView>("/inputs/checkbox/examples");
        _ = application.Route<SwitchMainView, SwitchMainController>("/inputs/switch");
        _ = application.Route<SwitchExamplesView>("/inputs/switch/examples");
        _ = application.Route<RadioGroupMainView, RadioGroupMainController>("/inputs/radio-group");
        _ = application.Route<RadioGroupExamplesView>("/inputs/radio-group/examples");
        _ = application.Route<TextInputScenariosView, TextInputScenariosController>("/inputs/text-input/scenarios");

        // Items
        _ = application.Route<ItemsViewMainView, ItemsViewMainController>("/items/items-view");
        _ = application.Route<ItemsViewExamplesView, ItemsViewExamplesController>("/items/items-view/examples");
        _ = application.Route<ItemsViewScenariosView, ItemsViewScenariosController>("/items/items-view/scenarios");
        _ = application.Route<TableMainView, TableMainController>("/items/table");
        _ = application.Route<TableExamplesView, TableExamplesController>("/items/table/examples");
        _ = application.Route<TreeMainView, TreeMainController>("/items/tree");
        _ = application.Route<TreeExamplesView, TreeExamplesController>("/items/tree/examples");

        // Overlays
        _ = application.Route<DialogTestView, DialogTestController>("/overlays/dialog/test");
        _ = application.Route<NotificationTestView, NotificationTestController>("/overlays/notification/test");
    }
}
