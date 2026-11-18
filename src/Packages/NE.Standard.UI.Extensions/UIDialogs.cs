using System;
using System.Linq.Expressions;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Styling;
using NE.Standard.UI.Authoring.Components;
using NE.Standard.UI.Authoring.Views;
using NE.Standard.UI.Components.BuiltIns.Actions;
using NE.Standard.UI.Components.BuiltIns.Contents;
using NE.Standard.UI.Components.BuiltIns.Layouts;
using NE.Standard.UI.Components.BuiltIns.Navigation;
using NE.Standard.UI.Primitives.Constants;
using NE.Standard.UI.Primitives.Localization;
using NE.Standard.UI.Primitives.Styling;

namespace NE.Standard.UI.Extensions;

/// <summary>Builds standard titled, full-height, form and confirmation dialogs with accessible title ids and close actions.</summary>
/// <remarks>
/// Titled dialogs carry a header close button that dismisses the dialog on the page as Escape does (<c>OnClose</c>); form and
/// confirmation dialogs omit the header close button and answer through their footer buttons instead.
/// </remarks>
public static class UIDialogs
{
    /// <summary>Builds a dialog with a header above scrollable <paramref name="content"/>, optionally constrained to <paramref name="width"/>.</summary>
    public static UIDialog Create(string key, UIPhrase title, IVisualComponent content, string? icon = null, UIColumnWidth? width = null, params IVisualComponent[] trailing)
        => Dialog(key, Content(key, title, content, icon, trailing), width);

    /// <summary>Builds a dialog with a header title bound as content at <paramref name="titlePath"/> above scrollable <paramref name="content"/>.</summary>
    public static UIDialog BoundCreate<TSource>(string key, Expression<Func<TSource, object?>> titlePath, IVisualComponent content, string? icon = null, UIColumnWidth? width = null, params IVisualComponent[] trailing)
        => BoundCreate(key, PresetBindings.Path(titlePath), content, icon, width, trailing);

    /// <summary>Builds a dialog with a header title bound as content at <paramref name="titlePath"/> above scrollable <paramref name="content"/>.</summary>
    public static UIDialog BoundCreate(string key, string titlePath, IVisualComponent content, string? icon = null, UIColumnWidth? width = null, params IVisualComponent[] trailing)
        => Dialog(key, BoundContent(key, titlePath, content, icon, trailing), width);

    /// <summary>The dialog around its content, named by its header's title, its content in a column where one is named.</summary>
    private static UIDialog Dialog(string key, StackPanelComponent content, UIColumnWidth? width)
    {
        if (width is not UIColumnWidth column)
            return new UIDialog { Key = key, TitleId = TitleId(key), Content = content };

        return new UIDialog
        {
            Key = key,
            TitleId = TitleId(key),
            // Filled below the tier the column fits at so the panel never shrinks between Sm and that tier, and sized to its column
            // from it on; Width alone lifts the cap of an unsized dialog while leaving a sheet's guard intact.
            Width = ColumnDialogWidth(column),
            Content = content.SetWidth(ColumnContentWidth(column)).SetMaxWidth(UILayoutLength.Fill())
        };
    }

    private static UIResponsive<UILayoutLength> ColumnDialogWidth(UIColumnWidth width)
        => width == UIColumnWidth.Wide
            ? UIResponsive<UILayoutLength>.Create(UILayoutLength.Fill(), xl: UILayoutLength.Auto())
            : UIResponsive<UILayoutLength>.Create(UILayoutLength.Fill(), md: UILayoutLength.Auto());

    /// <summary>
    /// The width a dialog's content holds in a named column: the screen's below the tier the column fits at, the column from it —
    /// a form's and a text's from the medium breakpoint, the wide one, more than a tablet holds, from the extra-large.
    /// </summary>
    internal static UIResponsive<UILayoutLength> ColumnContentWidth(UIColumnWidth width, double extraWidth = 0)
    {
        UILayoutLength column = UILayoutLength.Absolute(UIPage.Pixels(width) + extraWidth);

        return width == UIColumnWidth.Wide
            ? UIResponsive<UILayoutLength>.Create(UILayoutLength.Fill(), xl: column)
            : UIResponsive<UILayoutLength>.Create(UILayoutLength.Fill(), md: column);
    }

    /// <summary>
    /// The header over <paramref name="content"/>, for a dialog laid out or set otherwise — a sheet, a height:
    /// <c>new UIDialog { Key = key, TitleId = UIDialogs.TitleId(key), Content = UIDialogs.Content(key, title, body), … }</c>.
    /// </summary>
    public static StackPanelComponent Content(string key, UIPhrase title, IVisualComponent content, string? icon = null, params IVisualComponent[] trailing)
        => Body(Header(key, title, icon, trailing), content);

    /// <summary>Builds a dialog header over scrollable <paramref name="content"/> with a title bound as content at <paramref name="titlePath"/>.</summary>
    public static StackPanelComponent BoundContent<TSource>(string key, Expression<Func<TSource, object?>> titlePath, IVisualComponent content, string? icon = null, params IVisualComponent[] trailing)
        => BoundContent(key, PresetBindings.Path(titlePath), content, icon, trailing);

    /// <summary>Builds a dialog header over scrollable <paramref name="content"/> with a title bound as content at <paramref name="titlePath"/>.</summary>
    public static StackPanelComponent BoundContent(string key, string titlePath, IVisualComponent content, string? icon = null, params IVisualComponent[] trailing)
        => Body(BoundHeader(key, titlePath, icon, trailing), content);

    private static StackPanelComponent Body(ContainerComponent header, IVisualComponent content)
    {
        ArgumentNullException.ThrowIfNull(content);

        return UILayout.Stack(16, header, ScrollBody(content));
    }

    /// <summary>The dialog's scrollable body with top and bottom edge fade, reusing <paramref name="content"/> when it is already a scroll container.</summary>
    private static ScrollContainerComponent ScrollBody(IVisualComponent content)
        => content is ScrollContainerComponent scroll
            ? scroll.SetScrollFade(scroll.ScrollFade ?? true)
            : new ScrollContainerComponent().SetScrollFade(true).AddChild(content);

    /// <summary>Builds a full-height dialog placing its header in an <c>Auto</c> row above self-scrolling <paramref name="content"/> in a <c>Star(1)</c> row.</summary>
    /// <remarks>Leaves out the outer <see cref="ScrollContainerComponent"/> wrapper; fills the overlay width unless <paramref name="width"/> caps it.</remarks>
    public static UIDialog Fill(string key, UIPhrase title, IVisualComponent content, string? icon = null, UIColumnWidth? width = null, params IVisualComponent[] trailing)
        => FillDialog(key, Header(key, title, icon, trailing), content, width);

    /// <summary>Builds a full-height dialog with its header title bound as content at <paramref name="titlePath"/> above self-scrolling <paramref name="content"/>.</summary>
    public static UIDialog BoundFill<TSource>(string key, Expression<Func<TSource, object?>> titlePath, IVisualComponent content, string? icon = null, UIColumnWidth? width = null, params IVisualComponent[] trailing)
        => BoundFill(key, PresetBindings.Path(titlePath), content, icon, width, trailing);

    /// <summary>Builds a full-height dialog with its header title bound as content at <paramref name="titlePath"/> above self-scrolling <paramref name="content"/>.</summary>
    public static UIDialog BoundFill(string key, string titlePath, IVisualComponent content, string? icon = null, UIColumnWidth? width = null, params IVisualComponent[] trailing)
        => FillDialog(key, BoundHeader(key, titlePath, icon, trailing), content, width);

    private static UIDialog FillDialog(string key, ContainerComponent header, IVisualComponent content, UIColumnWidth? width)
    {
        ArgumentNullException.ThrowIfNull(content);

        // A one-cell grid, as UILayout.Panes uses: its unplaced child fills the Star row without mutating the child's own Placement or Height.
        ContainerComponent cell = new ContainerComponent()
            .SetPlacement(1, 2, 24, 1)
            .AddChild(content);

        ContainerComponent body = new ContainerComponent()
            .SetHeight(UILayoutLength.Fill())
            .SetSpacing(16)
            .SetRow(1, UIGridUnit.Auto())
            .AddRow(UIGridUnit.Star())
            .AddChild(header.SetPlacement(1, 1, 24, 1))
            .AddChild(cell);

        if (width is not UIColumnWidth column)
        {
            return new UIDialog
            {
                Key = key,
                TitleId = TitleId(key),
                Width = UILayoutLength.Fill(),
                Height = UILayoutLength.Fill(),
                Content = body
            };
        }

        return new UIDialog
        {
            Key = key,
            TitleId = TitleId(key),
            Width = ColumnDialogWidth(column),
            Height = UILayoutLength.Fill(),
            Content = body.SetWidth(ColumnContentWidth(column)).SetMaxWidth(UILayoutLength.Fill())
        };
    }

    /// <summary>
    /// The header alone: the mark where one is given, the title, <paramref name="trailing"/> before the ×, and the × at the far end, on
    /// one line, the ×'s glyph on the content's edge. The title carries <see cref="TitleId"/>, so a dialog built around the header is
    /// named by it.
    /// </summary>
    public static ContainerComponent Header(string key, UIPhrase title, string? icon = null, params IVisualComponent[] trailing)
        => Header(key, Title(key, title, null), icon, trailing);

    /// <summary>The header with a title the controller holds at <paramref name="titlePath"/>, as its own words.</summary>
    public static ContainerComponent BoundHeader<TSource>(string key, Expression<Func<TSource, object?>> titlePath, string? icon = null, params IVisualComponent[] trailing)
        => BoundHeader(key, PresetBindings.Path(titlePath), icon, trailing);

    /// <summary>The header with a title the controller holds at <paramref name="titlePath"/>, as its own words.</summary>
    public static ContainerComponent BoundHeader(string key, string titlePath, string? icon = null, params IVisualComponent[] trailing)
        => Header(key, Title(key, null, titlePath), icon, trailing);

    private static ContainerComponent Header(string key, TextComponent title, string? icon, IVisualComponent[] trailing)
    {
        ArgumentNullException.ThrowIfNull(trailing);

        if (icon is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(icon);

        // The mark is the title's own, on its line: one line of words needs no column of its own for it. The × stands its glyph on the
        // content's edge, as a band's end icon does (GlyphEdge), not its box.
        return new ContainerComponent()
            .SetColumn(24, UIGridUnit.Auto())
            .AddChild(title.AsTitle().SetIcon(icon).SetVerticalAlignment(UIAlignment.Center).SetPlacement(1, 1, 23, 1))
            .AddChild(new StackPanelComponent()
                .SetOrientation(UIOrientation.Horizontal)
                .SetGlyphEdge(UIAlignment.End)
                .SetSpacing(4)
                .SetMargin(UIThickness.All(8, 0, 0, 0))
                .SetVerticalAlignment(UIAlignment.Center)
                .AddChildren(trailing)
                .AddChild(ClosesAsViewer(UIIconButtons.Close().SetSize(UISize.Small), key))
                .SetPlacement(24, 1, 1, 1)
            );
    }

    /// <summary>
    /// The viewer's own close of the dialog: the form's held edits put back first, so a form opened again shows what the server holds,
    /// then the close <c>OnClose</c> hears, as Escape's.
    /// </summary>
    private static ButtonComponent ClosesAsViewer(ButtonComponent button, string key)
        => button
            .InteractOn(EventNames.Click, new DiscardFormEffect(key))
            .InteractOn(EventNames.Click, new CloseDialogEffect(key) { RaisesClose = true });

    /// <summary>
    /// A dialog's title, carrying the id that names the dialog: <paramref name="title"/> written, or bound at
    /// <paramref name="titlePath"/> as the controller's words (a path to a key still translates).
    /// </summary>
    private static TextComponent Title(string key, UIPhrase? title, string? titlePath)
    {
        TextComponent text = new(TitleId(key));

        if (titlePath is null)
        {
            PresetWords.Require(title);

            return text.SetTitle(title);
        }

        ArgumentException.ThrowIfNullOrWhiteSpace(titlePath);

        return text.BindTitle(titlePath).AsContent(TextComponent.TitleProperty);
    }

    /// <summary>
    /// The id the title of a preset's dialog carries — its header's, a form's, a confirmation's question — which names the dialog
    /// (<see cref="UIDialog.TitleId"/>).
    /// </summary>
    public static string TitleId(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return key + "-title";
    }

    /// <summary>
    /// The dialog's own answer that closes it as the viewer does — Cancel, or <paramref name="action"/> (Close, Done) — in
    /// <paramref name="variant"/>: the held edits of the dialog's form (<see cref="DiscardFormEffect"/>) are put back and the dialog closes
    /// on the page, raising its <c>OnClose</c> as Escape does, with nothing asked of the server.
    /// </summary>
    public static ButtonComponent CloseButton(string key, UIStandardAction? action = null, UIButtonVariant variant = UIButtonVariant.Ghost)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        return ClosesAsViewer(UIButtons.Create(variant, action ?? UIStandardAction.Cancel, glyph: false), key);
    }

    /// <summary>Builds a form dialog in a <see cref="UIColumnWidth.Form"/> column with Cancel and <paramref name="primary"/> at its foot.</summary>
    /// <remarks>
    /// Joins unassigned input fields under <paramref name="content"/> to form <paramref name="key"/>, wires <paramref name="primary"/> as
    /// its submit button, disables backdrop dismissal while keeping Escape, and discards buffered <c>OnSubmit</c> edits on Cancel.
    /// </remarks>
    public static UIDialog Form(string key, UIPhrase title, UIPhrase? description, IVisualComponent content, ButtonComponent primary)
        => Form(key, title, description, content, CloseButton(key), primary);

    /// <summary>Builds a form dialog in a <see cref="UIColumnWidth.Form"/> column with a custom <paramref name="safe"/> button in place of Cancel.</summary>
    public static UIDialog Form(string key, UIPhrase title, UIPhrase? description, IVisualComponent content, ButtonComponent safe, ButtonComponent primary)
    {
        PresetWords.RequireIfGiven(description);

        return Form(key, Title(key, title, null), description is null ? null : new ParagraphComponent().SetDescription(description), content, safe, primary);
    }

    /// <summary>The form around its words: the heading, the content joined to the dialog's form, and the pair, in a form's column.</summary>
    private static UIDialog Form(string key, TextComponent title, ParagraphComponent? description, IVisualComponent content, ButtonComponent safe, ButtonComponent primary)
    {
        ArgumentNullException.ThrowIfNull(content);
        ArgumentNullException.ThrowIfNull(safe);
        ArgumentNullException.ThrowIfNull(primary);

        StackPanelComponent heading = UILayout.Stack(4, title.AsTitle().SetTitleWrap(true));

        // A note, as UIText.Note draws one.
        if (description is not null)
            _ = heading.AddChild(description.SetDescriptionType(UITextAppearance.Caption).Muted());

        JoinForm(content, key);

        // The primary's own command, given with OnClick, becomes the form's submit; one already submitting another form keeps it.
        if (primary.SubmitFormId is null && !PresetBindings.Binds(primary, ButtonComponent.SubmitFormIdProperty))
            primary.SubmitFormId = key;

        return Dialog(key, UILayout.Stack(16, heading, ScrollBody(content), UIButtons.Pair(safe, primary)), UIColumnWidth.Form) with { CloseOnBackdrop = false };
    }

    /// <summary>
    /// Joins every field under <paramref name="component"/> with no form of its own, written or bound, to the dialog's; templates,
    /// context menus and the internal regions of composite controls keep their own boundaries.
    /// </summary>
    private static void JoinForm(IVisualComponent component, string formId)
    {
        if (component is IInputComponent { FormId: null } input && !PresetBindings.Binds(input, IInputComponent.FormIdProperty))
            input.FormId = formId;

        foreach (UIComponentTreeSlot slot in UIComponentTree.EnumerateSlots(component))
        {
            if (slot.Kind == UIComponentSlotKind.Child || (slot.Kind == UIComponentSlotKind.Region && IsFormLayoutRegionContainer(component)))
                JoinForm(slot.Root, formId);
        }
    }

    private static bool IsFormLayoutRegionContainer(IVisualComponent component)
        => component is SurfaceComponent
            or CardComponent
            or ExpanderComponent
            or CollapsiblePanelComponent
            or FlyoutComponent
            or PaneContainerComponent
            or TabsComponent;

    /// <summary>Builds a form dialog whose title and optional description are bound as plain content at <paramref name="titlePath"/> and <paramref name="descriptionPath"/>.</summary>
    public static UIDialog BoundForm<TSource>(string key, Expression<Func<TSource, object?>> titlePath, Expression<Func<TSource, object?>>? descriptionPath, IVisualComponent content, ButtonComponent primary)
        => BoundForm(key, PresetBindings.Path(titlePath), PresetBindings.PathOrNull(descriptionPath), content, primary);

    /// <summary>The bound form with a safe answer of the author's own in Cancel's place.</summary>
    public static UIDialog BoundForm<TSource>(string key, Expression<Func<TSource, object?>> titlePath, Expression<Func<TSource, object?>>? descriptionPath, IVisualComponent content, ButtonComponent safe, ButtonComponent primary)
        => BoundForm(key, PresetBindings.Path(titlePath), PresetBindings.PathOrNull(descriptionPath), content, safe, primary);

    /// <summary>A form dialog with a title and optional line bound at <paramref name="titlePath"/> and <paramref name="descriptionPath"/>.</summary>
    public static UIDialog BoundForm(string key, string titlePath, string? descriptionPath, IVisualComponent content, ButtonComponent primary)
        => BoundForm(key, titlePath, descriptionPath, content, CloseButton(key), primary);

    /// <summary>The bound form with a safe answer of the author's own in Cancel's place.</summary>
    public static UIDialog BoundForm(string key, string titlePath, string? descriptionPath, IVisualComponent content, ButtonComponent safe, ButtonComponent primary)
        => Form(key, Title(key, null, titlePath), BoundLine(descriptionPath), content, safe, primary);

    /// <summary>A dialog's line bound at <paramref name="path"/> where one is given: the controller's words, content and plain.</summary>
    private static ParagraphComponent? BoundLine(string? path)
    {
        if (path is null)
            return null;

        ArgumentException.ThrowIfNullOrWhiteSpace(path);

        // Bound words are data, never markup: a name with an asterisk in it is shown as typed.
        return new ParagraphComponent().BindDescription(path).AsContent(ParagraphComponent.DescriptionProperty).SetDescriptionPlain(true);
    }

    /// <summary>The question alone — "Sign out?" — with no words under it.</summary>
    public static UIDialog Confirm(string key, UIPhrase question, UIPhrase confirmTitle, string confirmCommand, UIButtonVariant confirmVariant = UIButtonVariant.Danger, string? cancelCommand = null, ButtonComponent? middle = null)
        => Confirm(key, question, (ParagraphComponent?)null, confirmTitle, confirmCommand, confirmVariant, cancelCommand, middle);

    /// <summary>Builds a confirmation dialog asking <paramref name="question"/> above an optional <paramref name="description"/>, answered by Cancel and <paramref name="confirmCommand"/>.</summary>
    /// <remarks>
    /// Disables backdrop dismissal while mapping Escape and Cancel to <c>OnClose</c> (running <paramref name="cancelCommand"/> when given).
    /// </remarks>
    public static UIDialog Confirm(string key, UIPhrase question, UIPhrase? description, UIPhrase confirmTitle, string confirmCommand, UIButtonVariant confirmVariant = UIButtonVariant.Danger, string? cancelCommand = null, ButtonComponent? middle = null)
    {
        PresetWords.RequireIfGiven(description);

        return Confirm(key, question, description is null ? null : new ParagraphComponent().SetDescription(description), confirmTitle, confirmCommand, confirmVariant, cancelCommand, middle);
    }

    /// <summary>Builds a confirmation dialog asking <paramref name="question"/> above a custom <paramref name="description"/> paragraph.</summary>
    public static UIDialog Confirm(string key, UIPhrase question, ParagraphComponent? description, UIPhrase confirmTitle, string confirmCommand, UIButtonVariant confirmVariant = UIButtonVariant.Danger, string? cancelCommand = null, ButtonComponent? middle = null)
        => Confirm(key, Title(key, question, null), description, confirmTitle, confirmCommand, confirmVariant, cancelCommand, middle);

    /// <summary>The confirmation around its question and words, given the dialog's text roles here.</summary>
    private static UIDialog Confirm(string key, TextComponent question, ParagraphComponent? description, UIPhrase confirmTitle, string confirmCommand, UIButtonVariant confirmVariant, string? cancelCommand, ButtonComponent? middle)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(confirmCommand);

        if (confirmVariant is not (UIButtonVariant.Primary or UIButtonVariant.Danger))
            throw new ArgumentException("A confirmation commits with a primary or a danger button.", nameof(confirmVariant));

        if (cancelCommand is not null)
            ArgumentException.ThrowIfNullOrWhiteSpace(cancelCommand);

        // A close the viewer makes, as Escape's: OnClose hears both, so a controller cancelling on one cancels on the other.
        ButtonComponent cancel = CloseButton(key);
        ButtonComponent confirm = (confirmVariant == UIButtonVariant.Danger ? UIButtons.Danger(confirmTitle) : UIButtons.Primary(confirmTitle)).OnClick(confirmCommand);

        // The safe answer first, where the focus lands as the dialog opens, and the committing one last.
        StackPanelComponent answers = middle is null ? UIButtons.Pair(cancel, confirm) : UIButtons.Pair(cancel, middle).AddChild(confirm);

        // The framework's own leave dialog's measures: the question a subtitle, its words a body line 8 px under it, the answers 16 px
        // under those. The question is prose, so it wraps.
        StackPanelComponent words = UILayout.Stack(8, question.AsSubtitle().SetTitleWrap(true));

        if (description is not null)
            _ = words.AddChild(description.SetDescriptionType(UITextAppearance.Body).SetDescriptionColor(UIThemeColor.Default));

        UIDialog dialog = new()
        {
            Key = key,
            TitleId = TitleId(key),
            // A press beside a question is no answer to it; Escape is, as Cancel's key.
            CloseOnBackdrop = false,
            Content = UILayout.Stack(16, words, answers).SetMinWidth(UILayoutLength.Absolute(320))
        };

        return cancelCommand is null ? dialog : dialog.OnClose(cancelCommand);
    }

    /// <summary>Builds a confirmation dialog whose detail text is bound as plain content at <paramref name="descriptionPath"/>.</summary>
    public static UIDialog BoundConfirm<TSource>(string key, UIPhrase question, Expression<Func<TSource, object?>> descriptionPath, UIPhrase confirmTitle, string confirmCommand, UIButtonVariant confirmVariant = UIButtonVariant.Danger, string? cancelCommand = null, ButtonComponent? middle = null)
        => BoundConfirm(key, question, PresetBindings.Path(descriptionPath), confirmTitle, confirmCommand, confirmVariant, cancelCommand, middle);

    /// <summary>A confirmation dialog whose detail words are bound at <paramref name="descriptionPath"/>.</summary>
    public static UIDialog BoundConfirm(string key, UIPhrase question, string descriptionPath, UIPhrase confirmTitle, string confirmCommand, UIButtonVariant confirmVariant = UIButtonVariant.Danger, string? cancelCommand = null, ButtonComponent? middle = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(descriptionPath);

        // The question stays written: a path in its place would turn every written question into one naming nothing.
        return Confirm(key, Title(key, question, null), BoundLine(descriptionPath), confirmTitle, confirmCommand, confirmVariant, cancelCommand, middle);
    }
}
