// The one way a file leaves the browser: a multipart POST beside the hub, answering with the selection id the controller reads;
// and what a field says when a pick is over its size limit.

// `node --test` loads this module as it is (the image input's test): `.ts` on the value imports.
import { FileMaxSizeAttribute } from "../addressing/dom-attributes.ts";
import { acceptsFile } from "./file-drop.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { logElapsed, logWarn } from "../runtime/logger.ts";
import type { FieldValidation } from "./validation-engine.ts";

const UploadPath = "/_ne/files/upload";

/** Past the byte, the steps a size is written in, each 1024 of the one before, as a file manager counts. */
const SizeUnits = ["kilobyte", "megabyte", "gigabyte"] as const;

/** A pick refused for size, kept so a language switch writes the limit again in the new language's units. */
type SizeRefusal = {
    readonly validation: FieldValidation;
    readonly limit: number;
    /** The refused files' names, for a field that takes several; null for one that takes one. */
    readonly names: readonly string[] | null;
};

/** The fields saying a size refusal now: a map rather than a weak one, since a language switch walks them. */
const refusals = new Map<HTMLElement, SizeRefusal>();

let refusalsFollowLanguage = false;

/**
 * The files within the root's size limit, if it carries one. The rest are refused before the upload, since the server would refuse
 * them anyway, and said on the field's validation line — named, where the field takes several; a pick within the limit takes the
 * line off.
 */
export function takeWithinSizeLimit(root: HTMLElement, files: readonly File[], several: boolean, validation: FieldValidation | undefined): File[] {
    const limit = Number(root.getAttribute(FileMaxSizeAttribute));
    const accepted: File[] = [];
    const refused: File[] = [];

    for (const file of files) {
        if (!Number.isFinite(limit) || limit <= 0 || file.size <= limit)
            accepted.push(file);
        else
            refused.push(file);
    }

    if (refused.length === 0) {
        if (refusals.delete(root))
            validation?.mark(root, null);

        return accepted;
    }

    if (validation === undefined) {
        logWarn("a chosen file exceeds the input's size limit and was refused.", { names: refused.map(file => file.name), limit });
        return accepted;
    }

    const refusal: SizeRefusal = { validation, limit, names: several ? refused.map(file => file.name) : null };

    for (const shown of refusals.keys()) {
        if (!shown.isConnected)
            refusals.delete(shown);
    }

    refusals.set(root, refusal);
    sayRefusal(root, refusal);
    followLanguage();

    return accepted;
}

function sayRefusal(root: HTMLElement, refusal: SizeRefusal): void {
    const limit = formatFileSize(refusal.limit, clientStrings.language);

    refusal.validation.mark(root, "error", refusal.names === null
        ? { key: "ui.file.oversized", args: { limit } }
        : { key: "ui.file.leftout", args: { limit, names: refusal.names.join(", ") } });
}

/** A size in bytes as a reader reads one — "1 MB", "1,5 МБ" — in the page's language, by the browser's own unit words. */
export function formatFileSize(bytes: number, language: string): string {
    let value = bytes;
    let unit = "byte";

    for (const next of SizeUnits) {
        if (value < 1024)
            break;

        value /= 1024;
        unit = next;
    }

    // "512 bytes", not the short form's "512 byte".
    const options: Intl.NumberFormatOptions = { style: "unit", unit, unitDisplay: unit === "byte" ? "long" : "short", maximumFractionDigits: 1 };

    try {
        return new Intl.NumberFormat(language.length > 0 ? language : undefined, options).format(value);
    }
    catch {
        // A language tag the browser does not know: its own language's words, rather than no limit at all.
        return new Intl.NumberFormat(undefined, options).format(value);
    }
}

/** Writes the refusals again on a language switch, once the page's own rewrite has put the old language's limit back. */
function followLanguage(): void {
    if (refusalsFollowLanguage)
        return;

    refusalsFollowLanguage = true;

    clientStrings.onChange(() => {
        for (const [root, refusal] of refusals) {
            if (root.isConnected)
                sayRefusal(root, refusal);
            else
                refusals.delete(root);
        }
    });
}

export type UploadedSelection = {
    readonly selectionId: string;
};

// XMLHttpRequest rather than fetch: only it reports upload progress.
export function uploadFilesAsync(files: Iterable<File>, onProgress: (percent: number) => void): Promise<UploadedSelection> {
    return new Promise<UploadedSelection>((resolve, reject) => {
        const body = new FormData();
        const started = performance.now();
        let bytes = 0;
        let count = 0;

        for (const file of files) {
            body.append("files", file, file.name);
            bytes += file.size;
            count++;
        }

        const request = new XMLHttpRequest();

        request.open("POST", UploadPath);
        request.responseType = "json";
        request.withCredentials = true;

        request.upload.addEventListener("progress", event => {
            if (event.lengthComputable && event.total > 0)
                onProgress(Math.round((event.loaded / event.total) * 100));
        });

        request.addEventListener("load", () => {
            if (request.status < 200 || request.status >= 300) {
                reject(new Error(`Upload failed with status ${request.status}.`));
                return;
            }

            const selectionId = (request.response as UploadedSelection | null)?.selectionId;

            if (selectionId === undefined || selectionId.length === 0) {
                reject(new Error("Upload response carried no selection id."));
                return;
            }

            logElapsed(`uploaded ${count} file(s), ${bytes} bytes,`, started);
            resolve({ selectionId });
        });

        request.addEventListener("error", () => reject(new Error("Upload failed.")));
        request.addEventListener("abort", () => reject(new Error("Upload was aborted.")));

        request.send(body);
    });
}

/** The framework's upload, answering with a selection id; a package never posts to the endpoint, whose path and shape are its own. */
export type FileUploads = {
    uploadAsync(files: Iterable<File>, onProgress?: (percent: number) => void): Promise<UploadedSelection>;
    /** Whether a file answers an `accept` list as a dropped one is judged: a MIME family, a MIME type, or an extension; empty takes any. */
    accepts(accept: string, file: File): boolean;
    /** `takeWithinSizeLimit` for a package's field, its refusal said through the page's validation engine. */
    takeWithinSizeLimit(root: HTMLElement, files: readonly File[], several: boolean): File[];
};

const noProgress = (): void => { };

/** The uploads the plugin surface hands out: the size refusal is the file and image inputs' own, words and language switch alike. */
export function createFileUploads(validation: FieldValidation): FileUploads {
    return {
        uploadAsync: (files, onProgress) => uploadFilesAsync(files, onProgress ?? noProgress),
        accepts: acceptsFile,
        takeWithinSizeLimit: (root, files, several) => takeWithinSizeLimit(root, files, several, validation)
    };
}

/** Writes a selection id through the hidden input it binds on, and raises the "change" a value set from script does not. */
export function publishSelection(selection: HTMLInputElement | null, selectionId: string): void {
    if (selection === null || selection.value === selectionId)
        return;

    selection.value = selectionId;
    selection.dispatchEvent(new Event("change", { bubbles: true }));
}
