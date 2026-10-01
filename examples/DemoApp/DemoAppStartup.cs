using System;
using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Actions.ButtonGroup;
using DemoApp.Controllers.Contents.Badge;
using DemoApp.Controllers.Contents.Icon;
using DemoApp.Controllers.Contents.Image;
using DemoApp.Controllers.Contents.Link;
using DemoApp.Controllers.Contents.Paragraph;
using DemoApp.Controllers.Contents.Separator;
using DemoApp.Controllers.Contents.Text;
using DemoApp.Controllers.Contents.Timestamp;
using DemoApp.Controllers.Design.Colors;
using DemoApp.Controllers.Indicators.Progress;
using DemoApp.Controllers.Indicators.Spinner;
using DemoApp.Controllers.Inputs.Calendar;
using DemoApp.Controllers.Inputs.ColorInput;
using DemoApp.Controllers.Inputs.FileInput;
using DemoApp.Controllers.Inputs.ImageInput;
using DemoApp.Controllers.Inputs.MultiSelect;
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
using DemoApp.Controllers.Mechanisms;
using DemoApp.Controllers.Navigation.Breadcrumbs;
using DemoApp.Controllers.Navigation.Menu;
using DemoApp.Controllers.Navigation.Tabs;
using DemoApp.Controllers.Navigation.TabsView;
using DemoApp.Controllers.Overlays;
using DemoApp.Controllers.Screens;
using DemoApp.Views;
using DemoApp.Views.Actions;
using DemoApp.Views.Actions.ButtonGroup;
using DemoApp.Views.Contents.Badge;
using DemoApp.Views.Contents.Icon;
using DemoApp.Views.Contents.Image;
using DemoApp.Views.Contents.Link;
using DemoApp.Views.Contents.Paragraph;
using DemoApp.Views.Contents.Separator;
using DemoApp.Views.Contents.Text;
using DemoApp.Views.Contents.Timestamp;
using DemoApp.Views.Design.Colors;
using DemoApp.Views.Indicators.Progress;
using DemoApp.Views.Indicators.Spinner;
using DemoApp.Views.Inputs.Calendar;
using DemoApp.Views.Inputs.ColorInput;
using DemoApp.Views.Inputs.FileInput;
using DemoApp.Views.Inputs.ImageInput;
using DemoApp.Views.Inputs.MultiSelect;
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
using DemoApp.Views.Mechanisms;
using DemoApp.Views.Navigation.Breadcrumbs;
using DemoApp.Views.Navigation.Menu;
using DemoApp.Views.Navigation.Tabs;
using DemoApp.Views.Navigation.TabsView;
using DemoApp.Views.Overlays;
using DemoApp.Views.Screens;

namespace DemoApp;

public sealed class DemoAppStartup : UIStartupBase
{
    protected override void ConfigureApplication(UIApplicationBuilder application)
    {
        ArgumentNullException.ThrowIfNull(application);

        _ = application.AddLocalizationSource(DemoTranslations.Build());

        // The framework's and its packages' own words in the demo's other languages, as they ship.
        _ = application.AddFrameworkWords("zh-Hans", "ru");

        // Only a string starting "demo." is a key: every other string on a translatable property is content, so the missing-word
        // report in Development names only words the demo has not translated.
        _ = application.ConfigureLocalization(options => options.KeyPrefixes.Add(DemoTranslations.KeyPrefix));

        _ = application.Route<HomeView>("/");

        // Screens
        _ = application.Route<SignUpView, SignUpController>("/screens/sign-up");
        _ = application.Route<CheckoutView, CheckoutController>("/screens/checkout");
        _ = application.Route<WorkspaceSettingsView, WorkspaceSettingsController>("/screens/settings");
        _ = application.Route<CatalogueView, CatalogueController>("/screens/catalogue");
        _ = application.Route<InboxView, InboxController>("/screens/inbox");
        _ = application.Route<ArticleView, ArticleController>("/screens/article");
        _ = application.Route<ChatView, ChatController>("/screens/chat");
        _ = application.Route<FilesView, FilesController>("/screens/files");
        _ = application.Route<NoteEditorView, NoteEditorController>("/screens/notes");

        // The security screens. SignInView and ForbiddenView also record where the host sends a refused request, so the two
        // answers a refusal has are both real pages of the demo.
        _ = application.SignInView<SignInView, SignInController>("/screens/sign-in");
        _ = application.Route<AccountView, AccountController>("/screens/account");
        _ = application.Route<AdminView, AdminController>("/screens/admin");
        _ = application.ForbiddenView<ForbiddenView, ForbiddenController>("/screens/forbidden");

        _ = application.Route<ColorsView>("/design/colors");
        _ = application.Route<ColorsSemanticView>("/design/colors/semantic");
        _ = application.Route<ColorsComponentsView>("/design/colors/components");
        _ = application.Route<ColorsThemeView, ColorsThemeController>("/design/colors/theme");

        // Mechanisms
        _ = application.Route<WordsView, WordsController>("/mechanisms/words");
        _ = application.Route<CommandsView, CommandsController>("/mechanisms/commands");
        _ = application.Route<ValuesView, ValuesController>("/mechanisms/values");
        _ = application.Route<ListsView, ListsController>("/mechanisms/lists");

        // Actions
        _ = application.Route<ButtonView, ButtonController>("/actions/button");
        _ = application.Route<SplitButtonView, SplitButtonController>("/actions/split-button");
        _ = application.Route<ButtonGroupView, ButtonGroupController>("/actions/button-group");
        _ = application.Route<ActionView, ActionController>("/actions/action");
        _ = application.Route<CommandBarView, CommandBarController>("/actions/command-bar");
        _ = application.Route<ThemeSwitcherView, ThemeSwitcherController>("/actions/theme-switcher");

        // Layouts
        _ = application.Route<ContainerView, ContainerController>("/layouts/container");
        _ = application.Route<SurfaceView, SurfaceController>("/layouts/surface");
        _ = application.Route<CardView, CardController>("/layouts/card");
        _ = application.Route<ExpanderView, ExpanderController>("/layouts/expander");
        _ = application.Route<StackPanelView, StackPanelController>("/layouts/stack-panel");
        _ = application.Route<WrapPanelView, WrapPanelController>("/layouts/wrap-panel");
        _ = application.Route<ScrollView, ScrollController>("/layouts/scroll");
        _ = application.Route<FlyoutView, FlyoutController>("/layouts/flyout");
        _ = application.Route<CollapsiblePanelView, CollapsiblePanelController>("/layouts/collapsible-panel");
        _ = application.Route<GridSplitterView, GridSplitterController>("/layouts/grid-splitter");

        // Contents
        _ = application.Route<BadgeView, BadgeController>("/contents/badge");
        _ = application.Route<IconView, IconController>("/contents/icon");
        _ = application.Route<ImageView, ImageController>("/contents/image");
        _ = application.Route<LinkView, LinkController>("/contents/link");
        _ = application.Route<SeparatorView, SeparatorController>("/contents/separator");
        _ = application.Route<TextView, TextController>("/contents/text");
        _ = application.Route<ParagraphView, ParagraphController>("/contents/paragraph");
        _ = application.Route<TimestampView, TimestampController>("/contents/timestamp");

        // Indicators
        _ = application.Route<ProgressView, ProgressController>("/indicators/progress");
        _ = application.Route<SpinnerView, SpinnerController>("/indicators/spinner");
        _ = application.Route<KeyValueActionView, KeyValueActionController>("/items/key-value-action");

        // Navigation
        _ = application.Route<MenuView, MenuController>("/navigation/menu");
        _ = application.Route<TabsView, TabsController>("/navigation/tabs");
        _ = application.Route<TabsViewView, TabsViewController>("/navigation/tabs-view");
        _ = application.Route<BreadcrumbsView, BreadcrumbsController>("/navigation/breadcrumbs");

        // Inputs
        _ = application.Route<TextInputView, TextInputController>("/inputs/text-input");
        _ = application.Route<ColorInputView, ColorInputController>("/inputs/color-input");
        _ = application.Route<SelectView, SelectController>("/inputs/select");
        _ = application.Route<MultiSelectView, MultiSelectController>("/inputs/multi-select");
        _ = application.Route<SearchView, SearchController>("/inputs/search");
        _ = application.Route<FileInputView, FileInputController>("/inputs/file-input");
        _ = application.Route<ImageInputView, ImageInputController>("/inputs/image-input");
        _ = application.Route<SliderView, SliderController>("/inputs/slider");
        _ = application.Route<DateInputView, DateInputController>("/inputs/date-input");
        _ = application.Route<CalendarView, CalendarController>("/inputs/calendar");
        _ = application.Route<TimeInputView, TimeInputController>("/inputs/time-input");
        _ = application.Route<DateTimeInputView, DateTimeInputController>("/inputs/date-time-input");
        _ = application.Route<TextAreaView, TextAreaController>("/inputs/text-area");
        _ = application.Route<NumberInputView, NumberInputController>("/inputs/number-input");
        _ = application.Route<CheckboxView, CheckboxController>("/inputs/checkbox");
        _ = application.Route<SwitchView, SwitchController>("/inputs/switch");
        _ = application.Route<RadioGroupView, RadioGroupController>("/inputs/radio-group");

        // Items
        _ = application.Route<ItemsViewView, ItemsViewController>("/items/items-view");
        _ = application.Route<TableView, TableController>("/items/table");
        _ = application.Route<TreeView, TreeController>("/items/tree");

        // Overlays
        _ = application.Route<DialogTestView, DialogTestController>("/overlays/dialog");
        _ = application.Route<NotificationTestView, NotificationTestController>("/overlays/notification");
    }
}
