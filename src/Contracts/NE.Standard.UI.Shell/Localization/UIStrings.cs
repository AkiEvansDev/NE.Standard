using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;

namespace NE.Standard.UI.Shell.Localization;

/// <summary>
/// The words the framework's own chrome writes — a picker's "Today", a strip's "More tabs" — as translation
/// keys with their English text. An application translates or overrides one the way it translates its own
/// text: the same key in its own <see cref="ITranslationSource"/>.
/// </summary>
public static class UIStrings
{
    public const string PickerToday = "ui.picker.today";
    public const string PickerNow = "ui.picker.now";
    public const string PickerClear = "ui.picker.clear";
    public const string PickerDone = "ui.picker.done";
    public const string PickerPrevious = "ui.picker.previous";
    public const string PickerNext = "ui.picker.next";
    public const string PickerHours = "ui.picker.hours";
    public const string PickerMinutes = "ui.picker.minutes";
    public const string PickerSeconds = "ui.picker.seconds";
    public const string PickerStart = "ui.picker.start";
    public const string PickerEnd = "ui.picker.end";
    public const string NotificationClose = "ui.notification.close";
    public const string TabsMore = "ui.tabs.more";
    public const string TabClose = "ui.tab.close";
    public const string SelectClear = "ui.select.clear";
    public const string SelectPlaceholder = "ui.select.placeholder";
    public const string InputClear = "ui.input.clear";
    public const string BreadcrumbsLabel = "ui.breadcrumbs.label";
    public const string FileUploading = "ui.file.uploading";
    public const string FileCount = "ui.file.count";
    public const string FileFailed = "ui.file.failed";
    public const string ColorPicker = "ui.color.picker";
    public const string ColorPalette = "ui.color.palette";
    public const string ColorHex = "ui.color.hex";
    public const string ColorRed = "ui.color.red";
    public const string ColorGreen = "ui.color.green";
    public const string ColorBlue = "ui.color.blue";
    public const string ColorFactor = "ui.color.factor";
    public const string ColorOpacity = "ui.color.opacity";
    public const string SplitterLabel = "ui.splitter.label";
    public const string SplitButtonMore = "ui.split.more";
    public const string ImageChoose = "ui.image.choose";
    public const string ImageChange = "ui.image.change";
    public const string ImageRemove = "ui.image.remove";
    public const string RowEdit = "ui.row.edit";
    public const string RowSave = "ui.row.save";
    public const string RowCancel = "ui.row.cancel";
    public const string TableResizeColumn = "ui.table.resize";
    public const string TreeToggle = "ui.tree.toggle";
    public const string TreeLoading = "ui.tree.loading";

    /// <summary>
    /// The English text by key. A <c>{name}</c> in a value is a placeholder the writer fills.
    /// </summary>
    public static FrozenDictionary<string, string> English { get; } = new Dictionary<string, string>(StringComparer.Ordinal)
    {
        [PickerToday] = "Today",
        [PickerNow] = "Now",
        [PickerClear] = "Clear",
        [PickerDone] = "Done",
        [PickerPrevious] = "Previous",
        [PickerNext] = "Next",
        [PickerHours] = "Hours",
        [PickerMinutes] = "Minutes",
        [PickerSeconds] = "Seconds",
        [PickerStart] = "Start",
        [PickerEnd] = "End",
        [NotificationClose] = "Close",
        [TabsMore] = "More tabs",
        [TabClose] = "Close",
        [SelectClear] = "Clear selection",
        [SelectPlaceholder] = "Select…",
        [InputClear] = "Clear",
        [BreadcrumbsLabel] = "Breadcrumb",
        [FileUploading] = "Uploading… {percent}%",
        [FileCount] = "{count} files",
        [FileFailed] = "Upload failed.",
        [ColorPicker] = "Picker",
        [ColorPalette] = "Palette",
        [ColorHex] = "Hex",
        [ColorRed] = "R",
        [ColorGreen] = "G",
        [ColorBlue] = "B",
        [ColorFactor] = "Factor",
        [ColorOpacity] = "Opacity",
        [SplitterLabel] = "Resize",
        [SplitButtonMore] = "More actions",
        [ImageChoose] = "Choose a picture",
        [ImageChange] = "Change the picture",
        [ImageRemove] = "Remove the picture",
        [RowEdit] = "Edit",
        [RowSave] = "Save",
        [RowCancel] = "Cancel",
        [TableResizeColumn] = "Resize column",
        [TreeToggle] = "Expand or collapse",
        [TreeLoading] = "Loading…"
    }.ToFrozenDictionary(StringComparer.Ordinal);

    /// <summary>
    /// The built-in source every translator starts from. It answers in English for <em>any</em> language, so a
    /// word an application has not translated still reads rather than showing its key.
    /// </summary>
    public static ITranslationSource Source { get; } = new BuiltInSource();

    /// <summary>
    /// Resolves every key for <paramref name="language"/> through <paramref name="translator"/> — the framework's own and
    /// each package's — what a page hands its client.
    /// </summary>
    public static Dictionary<string, string> Resolve(ITranslator translator, string language, IEnumerable<IUIStringsSource>? packages = null)
    {
        ArgumentNullException.ThrowIfNull(translator);

        Dictionary<string, string> resolved = new(English.Count, StringComparer.Ordinal);

        foreach (var key in English.Keys)
            resolved[key] = translator.Translate(language, key) ?? English[key];

        if (packages is null)
            return resolved;

        foreach (IUIStringsSource package in packages)
        {
            foreach (KeyValuePair<string, string> word in package.English)
                resolved[word.Key] = translator.Translate(language, word.Key) ?? word.Value;
        }

        return resolved;
    }

    private sealed class BuiltInSource : ITranslationSource
    {
        public IReadOnlyList<string> Languages { get; } = ["en"];

        public bool TryTranslate(string language, string key, [NotNullWhen(true)] out string? value)
            => English.TryGetValue(key, out value);
    }
}
