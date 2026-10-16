using System;
using DemoApp.Controllers.Actions;
using DemoApp.Controllers.Actions.ButtonGroup;
using DemoApp.Controllers.Choices.BadgeSelect;
using DemoApp.Controllers.Choices.MultiSelect;
using DemoApp.Controllers.Choices.RadioGroup;
using DemoApp.Controllers.Choices.Select;
using DemoApp.Controllers.Choices.Slider;
using DemoApp.Controllers.Choices.Toggle;
using DemoApp.Controllers.Contents.Badge;
using DemoApp.Controllers.Contents.FileTile;
using DemoApp.Controllers.Contents.Icon;
using DemoApp.Controllers.Contents.Image;
using DemoApp.Controllers.Contents.Link;
using DemoApp.Controllers.Contents.Paragraph;
using DemoApp.Controllers.Contents.Separator;
using DemoApp.Controllers.Contents.Status;
using DemoApp.Controllers.Contents.Text;
using DemoApp.Controllers.Contents.Timestamp;
using DemoApp.Controllers.Design.Colors;
using DemoApp.Controllers.Design.Presets;
using DemoApp.Controllers.Feedback.Message;
using DemoApp.Controllers.Feedback.Progress;
using DemoApp.Controllers.Feedback.Spinner;
using DemoApp.Controllers.Inputs.Calendar;
using DemoApp.Controllers.Inputs.ColorInput;
using DemoApp.Controllers.Inputs.FileInput;
using DemoApp.Controllers.Inputs.ImageInput;
using DemoApp.Controllers.Inputs.NumberInput;
using DemoApp.Controllers.Inputs.Search;
using DemoApp.Controllers.Inputs.Temporal;
using DemoApp.Controllers.Inputs.TextArea;
using DemoApp.Controllers.Inputs.TextInput;
using DemoApp.Controllers.Items.ItemsView;
using DemoApp.Controllers.Items.KeyValueAction;
using DemoApp.Controllers.Items.Pager;
using DemoApp.Controllers.Items.Table;
using DemoApp.Controllers.Items.Tree;
using DemoApp.Controllers.Layouts.Accordion;
using DemoApp.Controllers.Layouts.Card;
using DemoApp.Controllers.Layouts.CollapsiblePanel;
using DemoApp.Controllers.Layouts.Container;
using DemoApp.Controllers.Layouts.Expander;
using DemoApp.Controllers.Layouts.GridSplitter;
using DemoApp.Controllers.Layouts.PaneContainer;
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
using DemoApp.Controllers.Overlays.Flyout;
using DemoApp.Controllers.Screens;
using DemoApp.Views;
using DemoApp.Views.Actions;
using DemoApp.Views.Actions.ButtonGroup;
using DemoApp.Views.Choices.BadgeSelect;
using DemoApp.Views.Choices.MultiSelect;
using DemoApp.Views.Choices.RadioGroup;
using DemoApp.Views.Choices.Select;
using DemoApp.Views.Choices.Slider;
using DemoApp.Views.Choices.Toggle;
using DemoApp.Views.Contents.Badge;
using DemoApp.Views.Contents.FileTile;
using DemoApp.Views.Contents.Icon;
using DemoApp.Views.Contents.Image;
using DemoApp.Views.Contents.Link;
using DemoApp.Views.Contents.Paragraph;
using DemoApp.Views.Contents.Separator;
using DemoApp.Views.Contents.Status;
using DemoApp.Views.Contents.Text;
using DemoApp.Views.Contents.Timestamp;
using DemoApp.Views.Design.Colors;
using DemoApp.Views.Design.Presets;
using DemoApp.Views.Feedback.Message;
using DemoApp.Views.Feedback.Progress;
using DemoApp.Views.Feedback.Spinner;
using DemoApp.Views.Inputs.Calendar;
using DemoApp.Views.Inputs.ColorInput;
using DemoApp.Views.Inputs.FileInput;
using DemoApp.Views.Inputs.ImageInput;
using DemoApp.Views.Inputs.NumberInput;
using DemoApp.Views.Inputs.Search;
using DemoApp.Views.Inputs.Temporal;
using DemoApp.Views.Inputs.TextArea;
using DemoApp.Views.Inputs.TextInput;
using DemoApp.Views.Items.ItemsView;
using DemoApp.Views.Items.KeyValueAction;
using DemoApp.Views.Items.Pager;
using DemoApp.Views.Items.Table;
using DemoApp.Views.Items.Tree;
using DemoApp.Views.Layouts.Accordion;
using DemoApp.Views.Layouts.Card;
using DemoApp.Views.Layouts.CollapsiblePanel;
using DemoApp.Views.Layouts.Container;
using DemoApp.Views.Layouts.Expander;
using DemoApp.Views.Layouts.GridSplitter;
using DemoApp.Views.Layouts.PaneContainer;
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
using DemoApp.Views.Overlays.Flyout;
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

        // The focus ring in the brand's ink, as on every demo: the framework's default purple read 2.3:1 on the dark page.
        _ = application.ConfigureTheme(theme => theme
            .ConfigureLightPalette(static palette => palette with { FocusRing = palette.PrimaryInk })
            .ConfigureDarkPalette(static palette => palette with { FocusRing = palette.PrimaryInk }));

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

        // Design
        _ = application.Route<ColorsView>("/design/colors");
        _ = application.Route<ColorsSemanticView>("/design/colors/semantic");
        _ = application.Route<ColorsComponentsView>("/design/colors/components");
        _ = application.Route<ColorsThemeView, ColorsThemeController>("/design/colors/theme");
        _ = application.Route<PresetsView, PresetsController>("/design/presets");
        _ = application.Route<PresetsHeadersView, PresetsController>("/design/presets/headers");
        _ = application.Route<PresetsLayoutView, PresetsController>("/design/presets/layout");
        _ = application.Route<PresetsFormView, PresetsController>("/design/presets/form");
        _ = application.Route<PresetsTextView, PresetsController>("/design/presets/text");
        _ = application.Route<PresetsButtonsView, PresetsController>("/design/presets/buttons");
        _ = application.Route<PresetsMessagesView, PresetsController>("/design/presets/messages");

        // Mechanisms
        _ = application.Route<WordsView, WordsController>("/mechanisms/words");
        _ = application.Route<CommandsView, CommandsController>("/mechanisms/commands");
        _ = application.Route<ValuesView, ValuesController>("/mechanisms/values");
        _ = application.Route<ListsView, ListsController>("/mechanisms/lists");
        // Keyed by its copy: each copy is a runtime of its own, gone between without a page load.
        _ = application.Route<PagesView, PagesController>("/mechanisms/pages", static route => route.Identity(PagesController.CopyParameter));

        // Layouts
        _ = application.Route<ContainerView, ContainerController>("/layouts/container");
        _ = application.Route<StackPanelView, StackPanelController>("/layouts/stack-panel");
        _ = application.Route<WrapPanelView, WrapPanelController>("/layouts/wrap-panel");
        _ = application.Route<ScrollView, ScrollController>("/layouts/scroll");
        _ = application.Route<GridSplitterView, GridSplitterController>("/layouts/grid-splitter");
        _ = application.Route<PaneContainerView, PaneContainerController>("/layouts/pane-container");
        _ = application.Route<CollapsiblePanelView, CollapsiblePanelController>("/layouts/collapsible-panel");
        _ = application.Route<SurfaceView, SurfaceController>("/layouts/surface");
        _ = application.Route<CardView, CardController>("/layouts/card");
        _ = application.Route<ExpanderView, ExpanderController>("/layouts/expander");
        _ = application.Route<AccordionView, AccordionController>("/layouts/accordion");

        // Contents
        _ = application.Route<TextView, TextController>("/contents/text");
        _ = application.Route<ParagraphView, ParagraphController>("/contents/paragraph");
        _ = application.Route<LinkView, LinkController>("/contents/link");
        _ = application.Route<TimestampView, TimestampController>("/contents/timestamp");
        _ = application.Route<IconView, IconController>("/contents/icon");
        _ = application.Route<ImageView, ImageController>("/contents/image");
        _ = application.Route<BadgeView, BadgeController>("/contents/badge");
        _ = application.Route<SeparatorView, SeparatorController>("/contents/separator");
        _ = application.Route<FileTileView, FileTileController>("/contents/file-tile");
        _ = application.Route<StatusView, StatusController>("/contents/status");

        // Actions
        _ = application.Route<ButtonView, ButtonController>("/actions/button");
        _ = application.Route<SplitButtonView, SplitButtonController>("/actions/split-button");
        _ = application.Route<ButtonGroupView, ButtonGroupController>("/actions/button-group");
        _ = application.Route<ActionView, ActionController>("/actions/action");
        _ = application.Route<CommandBarView, CommandBarController>("/actions/command-bar");
        _ = application.Route<ThemeSwitcherView, ThemeSwitcherController>("/actions/theme-switcher");
        _ = application.Route<LanguageSwitcherView, LanguageSwitcherController>("/actions/language-switcher");

        // Inputs
        _ = application.Route<TextInputView, TextInputController>("/inputs/text-input");
        _ = application.Route<TextAreaView, TextAreaController>("/inputs/text-area");
        _ = application.Route<NumberInputView, NumberInputController>("/inputs/number-input");
        _ = application.Route<SearchView, SearchController>("/inputs/search");
        _ = application.Route<DateInputView, DateInputController>("/inputs/date-input");
        _ = application.Route<TimeInputView, TimeInputController>("/inputs/time-input");
        _ = application.Route<DateTimeInputView, DateTimeInputController>("/inputs/date-time-input");
        _ = application.Route<CalendarView, CalendarController>("/inputs/calendar");
        _ = application.Route<ColorInputView, ColorInputController>("/inputs/color-input");
        _ = application.Route<FileInputView, FileInputController>("/inputs/file-input");
        _ = application.Route<ImageInputView, ImageInputController>("/inputs/image-input");

        // Choices
        _ = application.Route<CheckboxView, CheckboxController>("/choices/checkbox");
        _ = application.Route<SwitchView, SwitchController>("/choices/switch");
        _ = application.Route<RadioGroupView, RadioGroupController>("/choices/radio-group");
        _ = application.Route<SelectView, SelectController>("/choices/select");
        _ = application.Route<MultiSelectView, MultiSelectController>("/choices/multi-select");
        _ = application.Route<BadgeSelectView, BadgeSelectController>("/choices/badge-select");
        _ = application.Route<SliderView, SliderController>("/choices/slider");

        // Items
        _ = application.Route<ItemsViewView, ItemsViewController>("/items/items-view");
        _ = application.Route<TableView, TableController>("/items/table");
        _ = application.Route<TreeView, TreeController>("/items/tree");
        _ = application.Route<KeyValueActionView, KeyValueActionController>("/items/key-value-action");
        _ = application.Route<PagerView, PagerController>("/items/pager");

        // Navigation
        _ = application.Route<MenuView, MenuController>("/navigation/menu");
        _ = application.Route<TabsView, TabsController>("/navigation/tabs");
        _ = application.Route<TabsViewView, TabsViewController>("/navigation/tabs-view");
        _ = application.Route<BreadcrumbsView, BreadcrumbsController>("/navigation/breadcrumbs");

        // Feedback
        _ = application.Route<MessageView, MessageController>("/feedback/message");
        _ = application.Route<ProgressView, ProgressController>("/feedback/progress");
        _ = application.Route<SpinnerView, SpinnerController>("/feedback/spinner");

        // Overlays
        _ = application.Route<FlyoutView, FlyoutController>("/overlays/flyout");
        _ = application.Route<DialogTestView, DialogTestController>("/overlays/dialog");
        _ = application.Route<NotificationTestView, NotificationTestController>("/overlays/notification");
    }
}
