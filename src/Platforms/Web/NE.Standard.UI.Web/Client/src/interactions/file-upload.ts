// The one way a file leaves the browser: a multipart POST beside the hub, answering with the selection id the controller reads;
// a selection the server holds, read back; and what a field says when a pick is over its size limit, or a file of it did not go.

// `node --test` loads this module as it is (the image input's test): `.ts` on the value imports.
import { FileMaxSizeAttribute } from "../addressing/dom-attributes.ts";
import { acceptsFile } from "./file-drop.ts";
import { formatFileSize } from "../rendering/file-tile.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { logElapsed, logWarn } from "../runtime/logger.ts";
import { pageSessionKey } from "../runtime/session-key.ts";
import type { Phrase } from "../runtime/words.ts";
import type { UploadsInFlight } from "./uploads-in-flight.ts";
import type { FieldMarkWords, FieldValidation } from "./validation-engine.ts";

const UploadPath = "/_ne/files/upload";
const SelectionPath = "/_ne/files/selection/";
const UploadedPath = "/_ne/files/upload/";

/** A pick refused, for size or by a failed upload, kept so a language switch writes it again — a limit in the new language's units. */
type Refusal = {
    readonly validation: FieldValidation;
    /** The pick's files left out for their size; null where none was. */
    readonly size: (() => Phrase) | null;
    /** The files a failed upload left out, which the next failure adds to. */
    readonly failed: readonly string[];
};

/** The fields saying a refusal now: a map rather than a weak one, since a language switch walks them. */
const refusals = new Map<HTMLElement, Refusal>();

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

    const names = several ? refused.map(file => file.name).join(", ") : null;

    refuse(root, { validation, size: () => sizeWords(limit, names), failed: [] });

    return accepted;
}

function sizeWords(limit: number, names: string | null): Phrase {
    const size = formatFileSize(limit, clientStrings.language);

    return names === null ? { key: "ui.file.oversized", args: { limit: size } } : { key: "ui.file.leftout", args: { limit: size, names } };
}

/** Says the refusal on the field's validation line, until the next pick that refuses nothing takes it off. */
function refuse(root: HTMLElement, refusal: Refusal): void {
    for (const shown of refusals.keys()) {
        if (!shown.isConnected)
            refusals.delete(shown);
    }

    refusals.set(root, refusal);
    sayRefusal(root, refusal);
    followLanguage();
}

function sayRefusal(root: HTMLElement, refusal: Refusal): void {
    refusal.validation.mark(root, "error", refusalWords(refusal));
}

/** The size line, the failure line, or both, one after the other (the message keeps a line break, ui-validation.less). */
function refusalWords(refusal: Refusal): FieldMarkWords {
    const size = refusal.size?.() ?? null;
    const failed: Phrase | null = refusal.failed.length === 0 ? null : { key: "ui.file.notuploaded", args: { names: refusal.failed.join(", ") } };

    if (size === null || failed === null)
        return size ?? failed ?? { text: "" };

    return { text: `${clientStrings.translate(size.key, size.args)}\n${clientStrings.translate(failed.key, failed.args)}` };
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

/**
 * Names on the field's validation line a file whose upload failed — a shelf's, whose square is taken off — beside the ones a failure
 * named before and under the pick's size refusal, until the next pick that refuses nothing takes the line off.
 */
export function refuseFailedUpload(root: HTMLElement, name: string, validation: FieldValidation | undefined): void {
    if (validation === undefined)
        return;

    const shown = refusals.get(root);

    refuse(root, { validation, size: shown?.size ?? null, failed: [...shown?.failed ?? [], name] });
}

export type UploadedSelection = {
    readonly selectionId: string;
};

/**
 * Uploads the files once a sign-in's key is traded: an upload is kept under the session its cookie names, and the page's commands read
 * it under the session the server holds — once a sign-in moved it, the new id.
 */
export async function uploadFilesAsync(files: Iterable<File>, onProgress: (percent: number) => void): Promise<UploadedSelection> {
    // Taken now: a caller may empty what it passed — an input's own list — as soon as the call returns.
    const taken = [...files];

    await pageSessionKey.settled();

    return await sendFilesAsync(taken, onProgress);
}

// XMLHttpRequest rather than fetch: only it reports upload progress.
function sendFilesAsync(files: readonly File[], onProgress: (percent: number) => void): Promise<UploadedSelection> {
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

/** One file of a selection the server holds, as the upload answered it. */
export type StoredFile = {
    readonly fileId: string;
    readonly fileName: string;
    readonly contentType: string | null;
    readonly size: number;
};

/**
 * The files a selection of this session holds, read back to draw what a controller still names — a shelf after a reload or a
 * switch; null where the server answers no files, as it does once it no longer holds the selection (a restart, the retention run
 * out), and a failure of any other kind throws.
 */
export async function readSelectionAsync(selectionId: string): Promise<StoredFile[] | null> {
    // A selection of the session the server holds: once a sign-in moved it, the new id, which only the traded cookie names.
    await pageSessionKey.settled();

    const response = await fetch(`${SelectionPath}${encodeURIComponent(selectionId)}`, { credentials: "same-origin", cache: "no-store" });

    if (!response.ok)
        throw new Error(`Reading selection failed with status ${response.status}.`);

    const files = (await response.json() as { readonly files?: StoredFile[] } | null)?.files ?? [];

    return files.length === 0 ? null : files;
}

/** Where the page reads one of this session's uploads again — the picture a shelf draws for a selection it read back. */
export function uploadedFileUrl(fileId: string): string {
    return `${UploadedPath}${encodeURIComponent(fileId)}`;
}

/** The framework's upload, answering with a selection id; a package never posts to the endpoint, whose path and shape are its own. */
export type FileUploads = {
    /** Given the field, a submit of its form waits for the upload until a task after it answers, so the id written in its continuation goes first. */
    uploadAsync(files: Iterable<File>, onProgress?: (percent: number) => void, field?: HTMLElement): Promise<UploadedSelection>;
    /** Whether a file answers an `accept` list as a dropped one is judged: a MIME family, a MIME type, or an extension; empty takes any. */
    accepts(accept: string, file: File): boolean;
    /** `takeWithinSizeLimit` for a package's field, its refusal said through the page's validation engine. */
    takeWithinSizeLimit(root: HTMLElement, files: readonly File[], several: boolean): File[];
};

const noProgress = (): void => { };

/** The uploads the plugin surface hands out: the size refusal is the file and image inputs' own, words and language switch alike. */
export function createFileUploads(validation: FieldValidation, inFlight: UploadsInFlight): FileUploads {
    return {
        uploadAsync: (files, onProgress, field) => {
            const uploading = uploadFilesAsync(files, onProgress ?? noProgress);

            if (field !== undefined) {
                const hold = inFlight.hold(field, {});
                // A task later, not at the answer: the package writes the id in its continuation, which the submit must find sent.
                const release = (): void => void setTimeout(hold, 0);

                uploading.then(release, release);
            }

            return uploading;
        },
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
