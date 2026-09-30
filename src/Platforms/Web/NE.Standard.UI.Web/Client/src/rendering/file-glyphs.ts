// Which `ne-` glyph a file's square shows: the extension decides first, since a browser's type for a file is guessed from it anyway
// and guesses wrong (`.ts` as a video), the MIME type where the extension says nothing, a blank page for anything else. The
// server's `UIFileGlyphs.For` is the same table; eng/Tests/Shared/file-glyph-corpus.json holds the two to one answer.

const Pdf = "ne-picture-as-pdf";
const Text = "ne-text-snippet";
const Document = "ne-description";
const Spreadsheet = "ne-table-chart";
const Presentation = "ne-slideshow";
const Archive = "ne-folder-zip";
const Audio = "ne-audio-file";
const Video = "ne-video-file";
const Picture = "ne-image";
const Code = "ne-code";
const AnyFile = "ne-draft";

const ByExtension: ReadonlyMap<string, string> = new Map([
    ...kind(Pdf, "pdf"),
    ...kind(Text, "txt", "md", "log"),
    ...kind(Document, "doc", "docx", "odt", "rtf"),
    ...kind(Spreadsheet, "xls", "xlsx", "ods", "csv", "tsv"),
    ...kind(Presentation, "ppt", "pptx", "odp", "key"),
    ...kind(Archive, "zip", "rar", "7z", "tar", "gz", "tgz", "bz2", "xz"),
    ...kind(Audio, "mp3", "wav", "ogg", "oga", "opus", "flac", "m4a", "aac"),
    ...kind(Video, "mp4", "m4v", "mov", "avi", "mkv", "webm"),
    ...kind(Picture, "png", "jpg", "jpeg", "gif", "webp", "avif", "bmp", "svg", "ico", "tif", "tiff", "heic", "heif"),
    ...kind(Code, "json", "xml", "yml", "yaml", "html", "htm", "css", "less", "scss", "js", "mjs", "ts", "tsx", "jsx", "cs", "csproj",
        "sln", "java", "kt", "py", "rb", "php", "go", "rs", "c", "h", "cpp", "hpp", "swift", "sql", "sh", "ps1")
]);

const ByType: ReadonlyMap<string, string> = new Map([
    ["application/pdf", Pdf],
    ["text/csv", Spreadsheet],
    ["application/msword", Document],
    ["application/rtf", Document],
    ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", Document],
    ["application/vnd.oasis.opendocument.text", Document],
    ["application/vnd.ms-excel", Spreadsheet],
    ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", Spreadsheet],
    ["application/vnd.oasis.opendocument.spreadsheet", Spreadsheet],
    ["application/vnd.ms-powerpoint", Presentation],
    ["application/vnd.openxmlformats-officedocument.presentationml.presentation", Presentation],
    ["application/vnd.oasis.opendocument.presentation", Presentation],
    ["application/zip", Archive],
    ["application/x-zip-compressed", Archive],
    ["application/x-7z-compressed", Archive],
    ["application/vnd.rar", Archive],
    ["application/x-rar-compressed", Archive],
    ["application/x-tar", Archive],
    ["application/gzip", Archive],
    ["application/json", Code],
    ["application/xml", Code],
    ["text/xml", Code],
    ["text/html", Code]
]);

/** The families a type's first half names, once no whole type has said. */
const ByFamily: ReadonlyMap<string, string> = new Map([
    ["image", Picture],
    ["audio", Audio],
    ["video", Video],
    ["text", Text]
]);

/** The glyph for a file by its name and MIME type, either of which may be empty. */
export function fileGlyph(name: string, type: string): string {
    const dot = name.lastIndexOf(".");
    const byExtension = dot < 0 ? undefined : ByExtension.get(name.slice(dot + 1).toLowerCase());

    if (byExtension !== undefined)
        return byExtension;

    const mime = type.split(";", 1)[0].trim().toLowerCase();
    const slash = mime.indexOf("/");

    return ByType.get(mime) ?? (slash < 0 ? undefined : ByFamily.get(mime.slice(0, slash))) ?? AnyFile;
}

function kind(glyph: string, ...extensions: string[]): [string, string][] {
    return extensions.map(extension => [extension, glyph]);
}
