namespace NE.Standard.UI.Primitives.Constants;

/// <summary>
/// The framework's own <c>ne-</c>-prefixed glyphs — its chrome's marks plus the few standard icons a package's chrome needs — served on every page with no icon pack installed.
/// </summary>
public static class UIGlyphs
{
    /// <summary>The prefix every glyph of the core's face carries, so its names never meet a pack's.</summary>
    public const string Prefix = "ne-";

    public const string ChevronDown = "ne-chevron-down";
    public const string ChevronUp = "ne-chevron-up";
    public const string ChevronLeft = "ne-chevron-left";
    public const string ChevronRight = "ne-chevron-right";
    public const string Close = "ne-close";
    public const string MoreHorizontal = "ne-more-horizontal";
    public const string MoreVertical = "ne-more-vertical";
    public const string Edit = "ne-edit";
    public const string Person = "ne-person";
    public const string Image = "ne-image";

    /// <summary>The pin filled: a pinned thing. <see cref="PinOutlined"/> is the offer to pin, <see cref="PinOff"/> the offer to unpin.</summary>
    public const string Pin = "ne-pin";
    public const string PinOutlined = "ne-pin-outlined";
    public const string PinOff = "ne-pin-off";
    public const string Check = "ne-check";
    public const string Calendar = "ne-calendar";
    public const string Menu = "ne-menu";
    public const string LightMode = "ne-light-mode";
    public const string DarkMode = "ne-dark-mode";
    public const string Colorize = "ne-colorize";
    public const string ArrowUp = "ne-arrow-up";
    public const string ArrowDown = "ne-arrow-down";

    /// <summary>The two ways a column may go: what a column sorted neither way shows, beside <see cref="ArrowUp"/> and <see cref="ArrowDown"/>.</summary>
    public const string Sort = "ne-sort";
    public const string FirstPage = "ne-first-page";
    public const string LastPage = "ne-last-page";
    public const string Filter = "ne-filter";
    public const string Columns = "ne-columns";
    public const string Add = "ne-add";
    public const string Search = "ne-search";
    public const string Delete = "ne-delete";

    /// <summary>A minus, the pair of <see cref="Add"/>: a zoom bar's step down, a list's take-away.</summary>
    public const string Remove = "ne-remove";

    /// <summary>Fit to the screen: a canvas brought back to show the whole of what it holds.</summary>
    public const string Fit = "ne-fit";

    /// <summary>One occurrence rewritten; <see cref="ReplaceAll"/> is the same done to every one of them.</summary>
    public const string Replace = "ne-replace";
    public const string ReplaceAll = "ne-replace-all";

    /// <summary>The marks of the value kinds every node canvas can offer: a number, a text, a switch, a text made of anything, a view of whatever arrives, a note.</summary>
    public const string Numbers = "ne-numbers";
    public const string TextFields = "ne-text-fields";
    public const string ToggleOn = "ne-toggle-on";
    public const string Abc = "ne-abc";
    public const string Visibility = "ne-visibility";
    public const string StickyNote = "ne-sticky-note";

    /// <summary>A wait: the mark of a node that holds a run for a while.</summary>
    public const string Hourglass = "ne-hourglass";

    /// <summary>The marks of the file kinds a node canvas can offer: a folder, a text file, a save.</summary>
    public const string FolderOpen = "ne-folder-open";
    public const string Description = "ne-description";
    public const string Save = "ne-save";

    /// <summary>Puts a kept value back to where it started — a node's state.</summary>
    public const string Restart = "ne-restart";

    /// <summary>A count going up by one: the mark of a counter.</summary>
    public const string PlusOne = "ne-plus-one";

    /// <summary>The marks of a run: once, all the way through, and stopped.</summary>
    public const string Play = "ne-play";
    public const string FastForward = "ne-fast-forward";
    public const string Stop = "ne-stop";

    /// <summary>A die: the mark of a value drawn at random.</summary>
    public const string Dice = "ne-dice";

    /// <summary>A fork in the road: one of two ways taken.</summary>
    public const string Route = "ne-route";

    /// <summary>Two circles overlapping, the overlap marked: both at once.</summary>
    public const string JoinInner = "ne-join-inner";

    /// <summary>Two circles overlapping, both marked whole: either one.</summary>
    public const string JoinFull = "ne-join-full";

    /// <summary>A circle struck through: the refusal, the opposite.</summary>
    public const string Block = "ne-block";
    public const string Equal = "ne-equal";

    /// <summary>A numbered list: a place in a list.</summary>
    public const string ListNumbered = "ne-list-numbered";
    public const string Repeat = "ne-repeat";

    /// <summary>Lines shortening down the page: a list put in order. <see cref="Sort"/> is the two ways a column may go.</summary>
    public const string Sorted = "ne-sorted";

    /// <summary>A fingerprint: one of each.</summary>
    public const string Fingerprint = "ne-fingerprint";

    /// <summary>Two arrows pressing on a line: ends taken in.</summary>
    public const string Compress = "ne-compress";
    public const string Cut = "ne-cut";

    /// <summary>Digits in a box: a text read as a number. <see cref="Numbers"/> is a number itself.</summary>
    public const string Digits = "ne-digits";
    public const string RegularExpression = "ne-regular-expression";

    /// <summary>A calendar with a plus: a date moved on.</summary>
    public const string CalendarAdd = "ne-calendar-add";

    /// <summary>A calendar with a span marked: the time between two dates.</summary>
    public const string DateRange = "ne-date-range";

    /// <summary>A calendar page with lines: a date taken apart.</summary>
    public const string EventNote = "ne-event-note";

    /// <summary>Two ways becoming one: things joined.</summary>
    public const string Merge = "ne-merge";

    /// <summary>One way becoming two: a thing split.</summary>
    public const string Split = "ne-split";

    /// <summary>The marks the calculator's and the pictures' kinds wear, so neither package needs an icon pack.</summary>
    public const string Functions = "ne-functions";
    public const string Calculate = "ne-calculate";
    public const string CompareArrows = "ne-compare-arrows";
    public const string UnfoldMore = "ne-unfold-more";
    public const string Flag = "ne-flag";
    public const string SwapHorizontal = "ne-swap-horizontal";
    public const string Straighten = "ne-straighten";
    public const string RoundedCorner = "ne-rounded-corner";
    public const string RotateRight = "ne-rotate-right";
    public const string Flip = "ne-flip";
    public const string FilterBlackWhite = "ne-filter-black-white";
    public const string FileOpen = "ne-file-open";
    public const string Crop = "ne-crop";
    public const string Blur = "ne-blur";
    public const string AspectRatio = "ne-aspect-ratio";

    /// <summary>A message's standing: information, done, a warning, a failure, a question.</summary>
    public const string Info = "ne-info";
    public const string CheckCircle = "ne-check-circle";
    public const string Warning = "ne-warning";
    public const string Error = "ne-error";
    public const string Help = "ne-help";

    /// <summary>What a control's chrome offers: copy, undo, redo, refresh, settings, links, files sent and fetched, a secret shown, zoom, the whole screen, a drag handle, a fold, what came before.</summary>
    public const string Copy = "ne-copy";
    public const string Undo = "ne-undo";
    public const string Redo = "ne-redo";
    public const string Refresh = "ne-refresh";
    public const string Settings = "ne-settings";
    public const string OpenInNew = "ne-open-in-new";
    public const string Link = "ne-link";
    public const string Upload = "ne-upload";
    public const string Download = "ne-download";
    public const string AttachFile = "ne-attach-file";
    public const string VisibilityOff = "ne-visibility-off";
    public const string ZoomIn = "ne-zoom-in";
    public const string ZoomOut = "ne-zoom-out";
    public const string Fullscreen = "ne-fullscreen";
    public const string FullscreenExit = "ne-fullscreen-exit";
    public const string DragIndicator = "ne-drag-indicator";
    public const string UnfoldLess = "ne-unfold-less";
    public const string History = "ne-history";

    /// <summary>Files and data, and an application's own frame: folders, a new file, code, an object, a terminal, the cloud, a store, locks, a star, home, the way out.</summary>
    public const string Folder = "ne-folder";
    public const string CreateNewFolder = "ne-create-new-folder";
    public const string NoteAdd = "ne-note-add";
    public const string Code = "ne-code";
    public const string DataObject = "ne-data-object";
    public const string Terminal = "ne-terminal";
    public const string Cloud = "ne-cloud";
    public const string Storage = "ne-storage";
    public const string Lock = "ne-lock";
    public const string LockOpen = "ne-lock-open";
    public const string Star = "ne-star";
    public const string Home = "ne-home";
    public const string Logout = "ne-logout";

    /// <summary>
    /// A file by its kind, as <see cref="UIFileGlyphs.For"/> picks one: a PDF, text, a spreadsheet, slides, an archive, audio, video,
    /// and a blank page for any other file; a document, a picture and code are <see cref="Description"/>, <see cref="Image"/> and <see cref="Code"/>.
    /// </summary>
    public const string Draft = "ne-draft";
    public const string PictureAsPdf = "ne-picture-as-pdf";
    public const string TextSnippet = "ne-text-snippet";
    public const string TableChart = "ne-table-chart";
    public const string Slideshow = "ne-slideshow";
    public const string FolderZip = "ne-folder-zip";
    public const string AudioFile = "ne-audio-file";
    public const string VideoFile = "ne-video-file";
}
