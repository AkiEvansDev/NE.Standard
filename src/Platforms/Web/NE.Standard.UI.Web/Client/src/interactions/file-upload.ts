// The one way a file leaves the browser: a multipart POST beside the hub, answering with the selection id the controller reads.

import { FileMaxSizeAttribute } from "../addressing/dom-attributes";
import { logWarn } from "../runtime/logger";

const UploadPath = "/_ne/files/upload";

/**
 * The files within the root's `FileMaxSizeAttribute`, if it carries one; an oversized file is refused before the upload ever
 * starts, since the server would refuse it anyway and a big file is a slow way to find that out.
 */
export function filterWithinFileSizeLimit(root: Element, files: readonly File[]): File[] {
    const limit = Number(root.getAttribute(FileMaxSizeAttribute));

    if (!Number.isFinite(limit) || limit <= 0)
        return [...files];

    const accepted: File[] = [];

    for (const file of files) {
        if (file.size <= limit)
            accepted.push(file);
        else
            logWarn("a chosen file exceeds the input's size limit and was refused.", { name: file.name, size: file.size, limit });
    }

    return accepted;
}

export type UploadedSelection = {
    readonly selectionId: string;
};

// XMLHttpRequest rather than fetch: only it reports upload progress.
export function uploadFilesAsync(files: Iterable<File>, onProgress: (percent: number) => void): Promise<UploadedSelection> {
    return new Promise<UploadedSelection>((resolve, reject) => {
        const body = new FormData();

        for (const file of files)
            body.append("files", file, file.name);

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

            resolve({ selectionId });
        });

        request.addEventListener("error", () => reject(new Error("Upload failed.")));
        request.addEventListener("abort", () => reject(new Error("Upload was aborted.")));

        request.send(body);
    });
}

/** Writes a selection id through the hidden input it binds on, and raises the "change" a value set from script does not. */
export function publishSelection(selection: HTMLInputElement | null, selectionId: string): void {
    if (selection === null || selection.value === selectionId)
        return;

    selection.value = selectionId;
    selection.dispatchEvent(new Event("change", { bubbles: true }));
}
