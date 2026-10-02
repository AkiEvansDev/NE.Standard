// A file input: a pick, a drop or a paste on the row — or on the component it names as its drop target — sends the files beside the
// hub and writes the handle back as the selection id.

// `node --test` loads this module as it is: `.ts` on the value imports, and types imported as types.
import { FilePickAttribute as PickAttribute } from "../addressing/dom-attributes.ts";
import { clientStrings } from "../runtime/client-strings.ts";
import { logWarn } from "../runtime/logger.ts";
import { attachFileDrop, findDropTargetField } from "./file-drop.ts";
import { isInert, isReadOnly } from "./interactive-state.ts";
import { publishSelection, takeWithinSizeLimit, uploadFilesAsync } from "./file-upload.ts";
import { answerOpenPicker, OpenPickerEventName } from "./picker-events.ts";
import type { FieldValidation } from "./validation-engine.ts";

const RootClass = "ui-file-input";
const RowClass = "ui-file-input__row";
const NativeClass = "ui-file-input__native";
const FieldClass = "ui-file-input__field";
const SelectionClass = "ui-file-input__selection";

/** Client-only: on the root while a file is dragged over its row. */
const DraggingAttribute = "data-ui-file-dragging";

export type FileInputEngineOptions = {
    readonly root?: ParentNode;
    /** Where a file refused for its size is said; left out, the refusal goes to the console. */
    readonly validation?: FieldValidation;
};

export class FileInputEngine {
    private readonly root: ParentNode;
    private readonly validation: FieldValidation | undefined;
    // The number of the latest pick per field, so an upload a later pick overtook writes nothing when it lands.
    private readonly picks = new WeakMap<HTMLElement, number>();

    // The chrome's words each names field shows ("3 files", a progress): `.value` carries no mark, so a switch rewrites them from here.
    private readonly shownWords = new Map<HTMLInputElement, () => string>();

    public constructor(options: FileInputEngineOptions = {}) {
        this.root = options.root ?? document;
        this.validation = options.validation;

        clientStrings.onChange(() => this.rewriteShownWords());

        this.root.addEventListener("click", domEvent => this.handlePickClick(domEvent), true);
        // Asked from a control elsewhere, the chooser is refused as the row's own press is.
        this.root.addEventListener(OpenPickerEventName, domEvent => answerOpenPicker(domEvent, {
            rootSelector: `.${RootClass}`,
            nativeSelector: `.${NativeClass}`,
            pressed: root => root
        }));

        // Capture: the hidden native input's "change" is not the bound value; the selection id is.
        this.root.addEventListener("change", domEvent => void this.handleSelectionAsync(domEvent), true);

        // A drop or a paste on the row, or on the drop target, is a pick, by the native input's `accept` and `multiple`; a read-only or
        // disabled field refuses it in place.
        attachFileDrop({
            root: this.root,
            draggingAttribute: DraggingAttribute,
            resolveTarget: target => {
                const own = target.closest<HTMLElement>(`.${RowClass}`)?.closest<HTMLElement>(`.${RootClass}`) ?? null;
                const other = own === null ? findDropTargetField(this.root, target, `.${RootClass}`) : null;
                const root = own ?? other?.field ?? null;
                const native = root?.querySelector<HTMLInputElement>(`.${NativeClass}`) ?? null;

                if (root === null || native === null)
                    return null;

                return {
                    host: root,
                    mark: other?.component,
                    accept: native.getAttribute("accept") ?? "",
                    multiple: native.multiple,
                    refused: native.disabled || isReadOnly(root) || isInert(root)
                };
            },
            onFiles: (root, files) => void this.takeFilesAsync(root, files)
        });
    }

    private rewriteShownWords(): void {
        for (const [field, words] of this.shownWords) {
            if (field.isConnected)
                field.value = words();
            else
                this.shownWords.delete(field);
        }
    }

    /** The whole row opens the picker, as the image field's surface does: the name it shows is not a field to type in. */
    private handlePickClick(domEvent: Event): void {
        if (!(domEvent.target instanceof Element))
            return;

        const trigger = domEvent.target.closest<HTMLElement>(`[${PickAttribute}], .${RowClass}`);

        // A read-only field's pick says it does nothing (`aria-disabled`) and stays focusable; the refusal engine turns its press away.
        if (trigger === null || isInert(trigger) || isReadOnly(trigger))
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
        const files = [...domEvent.target.files ?? []];

        // Cleared, so choosing the same file again — a retry after a failed upload — is a change the picker reports, as the image field's is.
        domEvent.target.value = "";

        if (root !== null)
            await this.takeFilesAsync(root, files);
    }

    /** Sends the files and hands the controller the handle; none clears it, a failure leaves it empty and says so. */
    private async takeFilesAsync(root: HTMLElement, files: readonly File[]): Promise<void> {
        const field = root.querySelector<HTMLInputElement>(`.${FieldClass}`);

        if (field === null)
            return;

        if (files.length === 0) {
            this.show(field, "");
            this.publishSelection(root, "");
            return;
        }

        const accepted = takeWithinSizeLimit(root, files, root.querySelector<HTMLInputElement>(`.${NativeClass}`)?.multiple === true, this.validation);

        // Every file refused for size is not an empty pick: the selection stands, and the validation line says why nothing happened.
        if (accepted.length === 0)
            return;

        // A pick made while the last is still on its way supersedes it: the older upload's answer, whenever it lands, is not written.
        const pick = (this.picks.get(root) ?? 0) + 1;

        this.picks.set(root, pick);

        try {
            const selection = await uploadFilesAsync(accepted, percent => {
                if (this.picks.get(root) === pick)
                    this.show(field, () => clientStrings.format("ui.file.uploading", { percent }));
            });

            if (this.picks.get(root) !== pick)
                return;

            this.show(field, describeSelection(accepted));
            this.publishSelection(root, selection.selectionId);
        }
        catch (error) {
            logWarn("file upload failed.", error);

            if (this.picks.get(root) !== pick)
                return;

            // The id stays empty rather than pointing at a half-written upload.
            this.show(field, () => clientStrings.text("ui.file.failed"));
            this.publishSelection(root, "");
        }
    }

    /** Writes what the names field shows: a file's name as it is, the chrome's words as a function a language switch runs again. */
    private show(field: HTMLInputElement, value: string | (() => string)): void {
        if (typeof value === "string")
            this.shownWords.delete(field);
        else {
            // Rewritten only at a language switch: a field gone from the page meanwhile is let go of here too.
            for (const shown of this.shownWords.keys()) {
                if (!shown.isConnected)
                    this.shownWords.delete(shown);
            }

            this.shownWords.set(field, value);
        }

        field.value = typeof value === "string" ? value : value();
    }

    private publishSelection(root: Element, selectionId: string): void {
        publishSelection(root.querySelector<HTMLInputElement>(`.${SelectionClass}`), selectionId);
    }
}

function describeSelection(files: readonly File[]): string | (() => string) {
    return files.length === 1 ? files[0].name : () => clientStrings.format("ui.file.count", { count: files.length });
}
