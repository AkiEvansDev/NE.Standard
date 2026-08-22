import { logWarn } from "../runtime/logger";

const RootClass = "ui-file-input";
const NativeClass = "ui-file-input__native";
const FieldClass = "ui-file-input__field";
const SelectionClass = "ui-file-input__selection";
const PickAttribute = "data-ui-file-pick";
const UploadPath = "/_ne/files/upload";

type UploadedSelection = {
    readonly selectionId: string;
};

export type FileInputEngineOptions = {
    readonly root?: ParentNode;
};

export class FileInputEngine {
    private readonly root: ParentNode;

    public constructor(options: FileInputEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handlePickClick(domEvent), true);

        // Capture phase: the native input is hidden and its "change" is not the component's bound value —
        // what syncs back is the selection id, written to a separate element once the upload finishes.
        this.root.addEventListener("change", domEvent => void this.handleSelectionAsync(domEvent), true);
    }

    private handlePickClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const trigger = domEvent.target.closest(`[${PickAttribute}]`);

        if (trigger === null || trigger.hasAttribute("disabled"))
            return;

        const native = trigger.closest(`.${RootClass}`)?.querySelector<HTMLInputElement>(`.${NativeClass}`);

        if (native === null || native === undefined || native.disabled)
            return;

        native.click();
    }

    private async handleSelectionAsync(domEvent: Event): Promise<void> {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(NativeClass))
            return;

        const native = domEvent.target;
        const root = native.closest(`.${RootClass}`);
        const field = root?.querySelector<HTMLInputElement>(`.${FieldClass}`);

        if (root === null || root === undefined || field === null || field === undefined)
            return;

        const files = native.files;

        if (files === null || files.length === 0) {
            field.value = "";
            this.publishSelection(root, "");
            return;
        }

        try {
            const selection = await uploadAsync(files, percent => {
                field.value = `Uploading... ${percent}%`;
            });

            field.value = describeSelection(files);
            this.publishSelection(root, selection.selectionId);
        }
        catch (error) {
            // The picked files stay picked and the id stays empty: a controller reading the selection gets
            // nothing rather than an id pointing at a half-written upload.
            field.value = "Upload failed.";
            this.publishSelection(root, "");

            logWarn("file upload failed.", error);
        }
    }

    /// Writing the value is not enough — the value binding engine syncs on "change", and a value set from
    /// script raises none.
    private publishSelection(root: Element, selectionId: string): void {
        const selection = root.querySelector<HTMLInputElement>(`.${SelectionClass}`);

        if (selection === null || selection.value === selectionId)
            return;

        selection.value = selectionId;
        selection.dispatchEvent(new Event("change", { bubbles: true }));
    }
}

/// XMLHttpRequest rather than fetch: only it reports upload progress, which is the whole reason the transfer
/// goes over HTTP instead of the connection (docs/FILES.md §1).
function uploadAsync(files: FileList, onProgress: (percent: number) => void): Promise<UploadedSelection> {
    return new Promise<UploadedSelection>((resolve, reject) => {
        const body = new FormData();

        for (let index = 0; index < files.length; index++)
            body.append("files", files[index], files[index].name);

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

function describeSelection(files: FileList | null): string {
    if (files === null || files.length === 0)
        return "";

    return files.length === 1 ? files[0].name : `${files.length} files`;
}
