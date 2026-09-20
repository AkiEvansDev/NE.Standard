// A file input: the pick control opens the native dialog, a drop on the row is taken the same way, and either sends the files
// beside the hub and writes the handle back as the selection id.

import { clientStrings } from "../runtime/client-strings";
import { logWarn } from "../runtime/logger";
import { attachFileDrop } from "./file-drop";
import { filterWithinFileSizeLimit, publishSelection, uploadFilesAsync } from "./file-upload";

const RootClass = "ui-file-input";
const RowClass = "ui-file-input__row";
const NativeClass = "ui-file-input__native";
const FieldClass = "ui-file-input__field";
const SelectionClass = "ui-file-input__selection";
const PickAttribute = "data-ui-file-pick";

/** Client-only: on the root while a file is dragged over its row. */
const DraggingAttribute = "data-ui-file-dragging";

export type FileInputEngineOptions = {
    readonly root?: ParentNode;
};

export class FileInputEngine {
    private readonly root: ParentNode;
    // The number of the latest pick per field, so an upload a later pick overtook writes nothing when it lands.
    private readonly picks = new WeakMap<HTMLElement, number>();

    public constructor(options: FileInputEngineOptions = {}) {
        this.root = options.root ?? document;

        this.root.addEventListener("click", domEvent => this.handlePickClick(domEvent), true);

        // Capture: the hidden native input's "change" is not the bound value; the selection id is.
        this.root.addEventListener("change", domEvent => void this.handleSelectionAsync(domEvent), true);

        // A drop on the row is a pick: the native input says what is accepted and whether more than one is taken; disabled
        // when that native input is disabled.
        attachFileDrop({
            root: this.root,
            draggingAttribute: DraggingAttribute,
            resolveTarget: target => {
                const root = target.closest<HTMLElement>(`.${RowClass}`)?.closest<HTMLElement>(`.${RootClass}`) ?? null;
                const native = root?.querySelector<HTMLInputElement>(`.${NativeClass}`) ?? null;

                if (root === null || native === null || native.disabled || root.matches(".ui-disabled"))
                    return null;

                return { host: root, accept: native.getAttribute("accept") ?? "", multiple: native.multiple };
            },
            onFiles: (root, files) => void this.takeFilesAsync(root, files)
        });
    }

    /** The whole row opens the picker, as the image field's surface does: the name it shows is not a field to type in. */
    private handlePickClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const trigger = domEvent.target.closest<HTMLElement>(`[${PickAttribute}], .${RowClass}`);

        if (trigger === null || trigger.hasAttribute("disabled"))
            return;

        // A control of the row's own that is not the pick — a clear, an affix button — keeps its press.
        if (!trigger.hasAttribute(PickAttribute) && domEvent.target.closest("button, a") !== null)
            return;

        const native = trigger.closest(`.${RootClass}`)?.querySelector<HTMLInputElement>(`.${NativeClass}`);

        if (native === null || native === undefined || native.disabled)
            return;

        native.click();
    }

    private async handleSelectionAsync(domEvent: Event): Promise<void> {
        if (!(domEvent.target instanceof HTMLInputElement) || !domEvent.target.classList.contains(NativeClass))
            return;

        const root = domEvent.target.closest<HTMLElement>(`.${RootClass}`);

        if (root !== null)
            await this.takeFilesAsync(root, [...domEvent.target.files ?? []]);
    }

    /** Sends the files and hands the controller the handle; none clears it, a failure leaves it empty and says so. */
    private async takeFilesAsync(root: HTMLElement, files: readonly File[]): Promise<void> {
        const field = root.querySelector<HTMLInputElement>(`.${FieldClass}`);

        if (field === null)
            return;

        if (files.length === 0) {
            field.value = "";
            this.publishSelection(root, "");
            return;
        }

        const accepted = filterWithinFileSizeLimit(root, files);

        // Every file refused for size is not an empty pick: the existing selection stands rather than being cleared.
        if (accepted.length === 0)
            return;

        // A pick made while the last is still on its way supersedes it: the older upload's answer, whenever it lands, is not written.
        const pick = (this.picks.get(root) ?? 0) + 1;

        this.picks.set(root, pick);

        try {
            const selection = await uploadFilesAsync(accepted, percent => {
                if (this.picks.get(root) === pick)
                    field.value = clientStrings.format("ui.file.uploading", { percent });
            });

            if (this.picks.get(root) !== pick)
                return;

            field.value = describeSelection(accepted);
            this.publishSelection(root, selection.selectionId);
        }
        catch (error) {
            logWarn("file upload failed.", error);

            if (this.picks.get(root) !== pick)
                return;

            // The id stays empty rather than pointing at a half-written upload.
            field.value = clientStrings.text("ui.file.failed");
            this.publishSelection(root, "");
        }
    }

    private publishSelection(root: Element, selectionId: string): void {
        publishSelection(root.querySelector<HTMLInputElement>(`.${SelectionClass}`), selectionId);
    }
}

function describeSelection(files: readonly File[]): string {
    return files.length === 1 ? files[0].name : clientStrings.format("ui.file.count", { count: files.length });
}
