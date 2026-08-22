using System.Collections.Generic;

namespace DemoApp;

internal static class DemoTranslations
{
    private const string Language = "en";

    public static IReadOnlyDictionary<string, IReadOnlyDictionary<string, string>> Build()
        => new Dictionary<string, IReadOnlyDictionary<string, string>>
        {
            [Language] = new Dictionary<string, string>
            {
                ["demo.nav.home"] = "Home",
                ["demo.nav.design.colors"] = "Colors",

                ["demo.nav.section.layouts"] = "Layouts",
                ["demo.nav.layouts.container"] = "Container",
                ["demo.nav.layouts.card"] = "Card",
                ["demo.nav.layouts.expander"] = "Expander",
                ["demo.nav.layouts.stack-panel"] = "Stack Panel",
                ["demo.nav.layouts.wrap-panel"] = "Wrap Panel",
                ["demo.nav.layouts.scroll-container"] = "Scroll Container",
                ["demo.nav.layouts.flyout"] = "Flyout",

                ["demo.nav.section.contents"] = "Contents",
                ["demo.nav.contents.text"] = "Text",
                ["demo.nav.contents.badge"] = "Badge",
                ["demo.nav.contents.icon"] = "Icon",
                ["demo.nav.contents.image"] = "Image",
                ["demo.nav.contents.link"] = "Link",
                ["demo.nav.contents.separator"] = "Separator",
                ["demo.nav.contents.key-value-action"] = "Key-Value Action",

                ["demo.nav.section.actions"] = "Actions",
                ["demo.nav.actions.button"] = "Button",
                ["demo.nav.actions.action"] = "Action",
                ["demo.nav.section.navigation"] = "Navigation",
                ["demo.nav.navigation.menu"] = "Menu",
                ["demo.nav.navigation.context-menu"] = "Context Menu",
                ["demo.nav.navigation.tabs"] = "Tabs",
                ["demo.nav.navigation.tabs-view"] = "Tabs View",
                ["demo.nav.navigation.breadcrumbs"] = "Breadcrumbs",
                ["demo.nav.actions.command-bar"] = "Command Bar",

                ["demo.nav.section.inputs"] = "Inputs",
                ["demo.nav.inputs.text-input"] = "Text Input",
                ["demo.nav.inputs.text-area"] = "Text Area",
                ["demo.nav.inputs.number-input"] = "Number Input",
                ["demo.nav.inputs.checkbox"] = "Checkbox",
                ["demo.nav.inputs.switch"] = "Switch",
                ["demo.nav.inputs.select"] = "Select",
                ["demo.nav.inputs.search"] = "Search",
                ["demo.nav.inputs.radio-group"] = "Radio Group",
                ["demo.nav.inputs.slider"] = "Slider",
                ["demo.nav.inputs.date-input"] = "Date Input",
                ["demo.nav.inputs.time-input"] = "Time Input",
                ["demo.nav.inputs.date-time-input"] = "Date-Time Input",
                ["demo.nav.inputs.file-input"] = "File Input",

                ["demo.nav.section.indicators"] = "Indicators",
                ["demo.nav.indicators.progress"] = "Progress",
                ["demo.nav.indicators.spinner"] = "Spinner",

                ["demo.nav.section.items"] = "Items",
                ["demo.nav.items.items-view"] = "Items View",
                ["demo.nav.section.overlays"] = "Overlays",
                ["demo.nav.overlays.dialog"] = "Dialog",
                ["demo.nav.overlays.notification"] = "Notification",

                ["demo.nav.section.security"] = "Security",
                ["demo.nav.security.sign-in"] = "Sign In",
                ["demo.nav.security.account"] = "Account",
                ["demo.nav.security.reports"] = "Reports (admin)",
                ["demo.nav.security.forbidden"] = "Forbidden",

                ["demo.security.sign-in.header"] = "Sign In",
                ["demo.security.sign-in.description"] = "Anonymous page that gives the session an identity. A route that refuses the current session redirects here, carrying the route it wanted as returnUrl.",

                ["demo.security.account.header"] = "Account",
                ["demo.security.account.description"] = "Closed to anonymous sessions by [UIAuthorize]. Its commands carry their own permission requirements, checked against the stored session on every click.",

                ["demo.security.reports.header"] = "Reports",
                ["demo.security.reports.description"] = "Restricted to the admin role by an attribute on the view itself — no controller involved.",

                ["demo.security.forbidden.header"] = "Forbidden",
                ["demo.security.forbidden.description"] = "Where an authenticated session that lacks the required role lands — separate from sign-in, because signing in again would not help.",

                ["demo.home.header"] = "NE.Standard.UI",
                ["demo.home.description"] = "A server-driven UI framework — views and components are authored entirely in C#, compiled server-side, and rendered live to the browser over SignalR.",

                ["demo.design.colors.header"] = "Colors",
                ["demo.design.colors.description"] = "Every named palette swatch (theme-independent) and every semantic UIColorPalette role, Light vs Dark side by side — for picking colors.",

                ["demo.layouts.container.header"] = "Container",
                ["demo.layouts.container.description"] = "Grid-based layout with explicit row/column placement.",

                ["demo.layouts.card.header"] = "Card",
                ["demo.layouts.card.description"] = "Header, content and footer regions; clickable variant with a server-tracked click count.",

                ["demo.layouts.expander.header"] = "Expander",
                ["demo.layouts.expander.description"] = "Native details/summary-based collapsible section, with a server-tracked toggle count.",

                ["demo.layouts.stack-panel.header"] = "Stack Panel",
                ["demo.layouts.stack-panel.description"] = "Horizontal, vertical and wrapping variants.",

                ["demo.layouts.wrap-panel.header"] = "Wrap Panel",
                ["demo.layouts.wrap-panel.description"] = "Column-span-aware wrapping grid layout.",

                ["demo.layouts.scroll-container.header"] = "Scroll Container",
                ["demo.layouts.scroll-container.description"] = "Horizontal and vertical scrollable viewports.",

                ["demo.layouts.flyout.header"] = "Flyout",
                ["demo.layouts.flyout.description"] = "An anchor/content pair positioned via CSS placement classes, in any of the twelve placements around the anchor. It opens and closes on the client by itself; binding IsOpen hands that over to the controller instead.",

                ["demo.contents.text.header"] = "Text",
                ["demo.contents.text.description"] = "Typography, icon, badge, description and wrapping samples.",

                ["demo.contents.badge.header"] = "Badge",
                ["demo.contents.badge.description"] = "Color styles, tag colors, content composition and icon sizes.",

                ["demo.contents.icon.header"] = "Icon",
                ["demo.contents.icon.description"] = "Sizes and color style variants.",

                ["demo.contents.image.header"] = "Image",
                ["demo.contents.image.description"] = "Fit modes, corner radius, and broken-source fallback.",

                ["demo.contents.link.header"] = "Link",
                ["demo.contents.link.description"] = "Icon/text combinations, style and color variants.",

                ["demo.contents.separator.header"] = "Separator",
                ["demo.contents.separator.description"] = "Orientation, label and color style variants.",

                ["demo.contents.key-value-action.header"] = "Key-Value Action",
                ["demo.contents.key-value-action.description"] = "Settings-style key/value/action rows, with and without separators/stretch/actions.",

                ["demo.actions.button.header"] = "Button",
                ["demo.actions.button.description"] = "Button variants, icon content, badges, stretch layout and interactive states.",

                ["demo.actions.action.header"] = "Action",
                ["demo.actions.action.description"] = "A full-width row that invokes a command — the button's own content on the left, a trailing chevron and an optional value on the right.",

                ["demo.navigation.breadcrumbs.header"] = "Breadcrumbs",
                ["demo.navigation.breadcrumbs.description"] = "The trail back to where the current page sits — one step per entry of a collection, fed by the controller rather than read off the route, because a route knows no titles. The last step is the page you are on: marked, and no longer a link.",

                ["demo.navigation.tabs.header"] = "Tabs",
                ["demo.navigation.tabs-view.header"] = "Tabs View",
                ["demo.navigation.tabs-view.description"] = "The document-tab variant: captions and pages come from one collection, so a tab opens, closes, renames in place and drags to a new position — every one of them a change to the item, not to the view.",
                ["demo.navigation.tabs.description"] = "A caption strip over fixed pages — each page is authored from ordinary controls, a caption hides with its page through Visible, and the current one is underlined. Switching is instant; SelectedKey is two-way.",

                ["demo.navigation.context-menu.header"] = "Context Menu",
                ["demo.navigation.context-menu.description"] = "A right-click menu is a MenuComponent set on any component — nothing is placed in the tree, and inside a row template it compiles once. An entry reaches its own key and, through a Parent-scoped argument, the row it was opened on.",

                ["demo.navigation.menu.header"] = "Menu",
                ["demo.navigation.menu.description"] = "Navigation entries, vertical or horizontal, collapsing to icons alone — one collection carries entries, section captions and rules.",

                ["demo.actions.command-bar.header"] = "Command Bar",
                ["demo.actions.command-bar.description"] = "A flat list of buttons rendered from items, reusing ButtonComponentRenderer via the default item template.",

                ["demo.inputs.text-input.header"] = "Text Input",
                ["demo.inputs.text-input.description"] = "A single-line field: label with icon and badge, prefix/suffix, input types, commit-on-change value binding, trim, clear and validated submit.",

                ["demo.inputs.text-area.header"] = "Text Area",
                ["demo.inputs.text-area.description"] = "The multi-line field, under the same header/field/message shell as Text Input — rows, resize, max length and trim.",

                ["demo.inputs.number-input.header"] = "Number Input",
                ["demo.inputs.number-input.description"] = "Prefix/suffix, optional stepper, decimal/negative controls, and a disabled variant.",

                ["demo.inputs.checkbox.header"] = "Checkbox",
                ["demo.inputs.checkbox.description"] = "A boolean input whose label is a full text surface — icon, title and badge — plus read-only, required and two-way value binding.",

                ["demo.inputs.switch.header"] = "Switch",
                ["demo.inputs.switch.description"] = "The same input as Checkbox under a different skin — same label surface, states and two-way value binding.",

                ["demo.inputs.select.header"] = "Select",
                ["demo.inputs.select.description"] = "Custom trigger/popup listbox — the closed trigger shows the selected option through its own item template, not just plain text — with two-way value binding and a Submit-trigger validation form.",

                ["demo.inputs.search.header"] = "Search",
                ["demo.inputs.search.description"] = "Debounced live search over the same trigger/popup shell as Select, in both selection-display modes — KeepSearchInput (typed text stays) and ReplaceWithSelectedItem (closed state shows the chosen option's own template).",

                ["demo.inputs.radio-group.header"] = "Radio Group",
                ["demo.inputs.radio-group.description"] = "Rich item templates (icon/title/description) with two-way value binding, horizontal orientation, bound Options, and a Submit-trigger validation form.",

                ["demo.inputs.slider.header"] = "Slider",
                ["demo.inputs.slider.description"] = "Native range input — two-way value binding, live drag readout, stepped values, vertical orientation, and disabled state.",

                ["demo.inputs.date-input.header"] = "Date Input",
                ["demo.inputs.date-input.description"] = "A themed calendar popup replacing the browser's own chrome — DisplayFormat/Culture/FirstDayOfWeek all render, typed input is parsed server-side against the component's Format, and Min/Max disable days in the grid.",

                ["demo.inputs.time-input.header"] = "Time Input",
                ["demo.inputs.time-input.description"] = "Edited in place, one focusable segment per unit named by DisplayFormat — no popup. Type, arrow, scroll or use the stepper; Step decides how far one press moves.",

                ["demo.inputs.date-time-input.header"] = "Date-Time Input",
                ["demo.inputs.date-time-input.description"] = "A calendar and a clock grid side by side in one popup, committed as a single DateTimeOffset carrying the wall-clock reading.",

                ["demo.inputs.file-input.header"] = "File Input",
                ["demo.inputs.file-input.description"] = "A read-only field showing the selection with the pick button flush against it, under the same shell as Text Input. Picking uploads over HTTP and binds the returned SelectionId back; Value stays the field's display text.",

                ["demo.indicators.progress.header"] = "Progress",
                ["demo.indicators.progress.description"] = "Linear and circular variants, including a bound live-updating value.",

                ["demo.indicators.spinner.header"] = "Spinner",
                ["demo.indicators.spinner.description"] = "Sizes, color styles and an optional label.",

                ["demo.items.items-view.header"] = "Items View",
                ["demo.items.items-view.description"] = "Static string/nested items with relative bindings, plus a bound collection (add/remove/rename) and bound nested sub-collections.",

                ["demo.overlays.dialog.header"] = "Dialog",
                ["demo.overlays.dialog.description"] = "Declared by the view, rendered closed into the shell, opened by key. Its content is ordinary compiled components, so what is inside binds and patches like the page does — modal, backdrop and escape are three separate switches.",
                ["demo.overlays.notification.header"] = "Notification",
                ["demo.overlays.notification.description"] = "A toast has no component: a command returns an effect and the client builds the host on demand. Severity comes from the colour palette, several stack, and which corner they stack in is a setting on the view — this page asks for the top one."
            }
        };
}
