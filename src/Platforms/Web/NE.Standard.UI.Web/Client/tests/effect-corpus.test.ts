// The client half of the effect payload check; `ClientEffectCorpusTests` (C#) writes `eng/Tests/Shared/effect-corpus.json` from the
// server's serializer, every built-in effect with each of its fields set. Each one is run through the page's effect registry, and every
// field its handler reads must be one the payload carries; each field the page's type for the kind declares must be one too. A field
// renamed on one side only (a notification's `severity` for its `tone`) fails here, not on a page that shows nothing.

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { DomRegistry } from "../src/addressing/dom-registry.ts";
import type { ClientEffect } from "../src/metadata/metadata-index.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, scrollTo: () => undefined, location: { origin: "https://app.test", pathname: "/inbox", search: "", hash: "" } },
    location: { origin: "https://app.test", pathname: "/inbox", search: "", hash: "" }
});

const { EffectRegistry } = await import("../src/effects/effect-registry.ts");

const here = dirname(fileURLToPath(import.meta.url));
const corpus = JSON.parse(readFileSync(resolve(here, "../../../../../../eng/Tests/Shared/effect-corpus.json"), "utf8")) as { readonly cases: readonly { readonly name: string; readonly effect: Record<string, unknown> }[] };
const metadataIndex = readFileSync(resolve(here, "../src/metadata/metadata-types.ts"), "utf8");

// The page's type for each kind; a kind its type shares (the dialogs, the addresses) is checked against every case of that type.
const EffectTypes: Readonly<Record<string, string>> = {
    Navigate: "NavigateClientEffect",
    NavigateBack: "NavigateBackClientEffect",
    Focus: "TargetedClientEffect",
    ScrollTo: "ScrollToClientEffect",
    ScrollToItem: "ScrollToItemClientEffect",
    OpenDialog: "DialogClientEffect",
    CloseDialog: "DialogClientEffect",
    ShowNotification: "NotificationClientEffect",
    Announce: "AnnounceClientEffect",
    DownloadFile: "DownloadFileClientEffect",
    Scroll: "ScrollClientEffect",
    SetTheme: "SetThemeClientEffect",
    SetThemeColors: "SetThemeColorsClientEffect",
    SetLanguage: "SetLanguageClientEffect",
    RenameItem: "RenameItemClientEffect",
    CopyToClipboard: "CopyToClipboardClientEffect",
    InsertText: "InsertTextClientEffect",
    DiscardForm: "DiscardFormClientEffect",
    OpenPicker: "TargetedClientEffect",
    ConfirmLeave: "ConfirmLeaveClientEffect",
    ReplaceAddress: "AddressClientEffect",
    PushAddress: "AddressClientEffect",
    RequestNotificationPermission: "ClientEffect",
    ShowSystemNotification: "SystemNotificationClientEffect",
    ShowImage: "ShowImageClientEffect",
    DevelopmentReport: "DevelopmentReportClientEffect"
};

/** The fields a type of metadata-index.ts declares, its base's with them: `X = Base & { readonly a?: …; }`. */
function declaredFields(type: string): string[] {
    if (type === "ClientEffect")
        return ["kind"];

    const declaration = new RegExp(`export type ${type} = (\\w+) & \\{([\\s\\S]*?)\\n\\};`).exec(metadataIndex);

    assert.ok(declaration !== null, `metadata-index.ts declares no ${type} of the shape this test reads.`);

    // The type's own fields at its first level: a nested model's are its own type's.
    const own = [...declaration[2].matchAll(/^ {4}readonly (\w+)\??:/gm)].map(match => match[1]);

    return [...declaredFields(declaration[1]), ...own];
}

/** Wraps a payload so every field read of it that it does not carry is written down, nested ones by their path. */
function recording(value: Record<string, unknown>, missed: Set<string>, path = ""): Record<string, unknown> {
    return new Proxy(value, {
        get(target, key, receiver) {
            const field = Reflect.get(target, key, receiver) as unknown;

            if (typeof key !== "string" || key in Object.prototype || Array.isArray(target))
                return wrap(field, `${path}${String(key)}.`);

            // Words are told apart by the field they carry (`key` or `text`): a probe of one for the other is no read of a field.
            const words = path.length > 0 && ("text" in target || "key" in target);

            if (!(key in target) && !words)
                missed.add(path + key);

            return wrap(field, `${path}${key}.`);
        }
    });

    function wrap(field: unknown, nested: string): unknown {
        return typeof field === "object" && field !== null ? recording(field as Record<string, unknown>, missed, nested) : field;
    }
}

function stubs(): ConstructorParameters<typeof EffectRegistry>[0] {
    return real({
        notifications: { show: () => real(new FakeElement("div")), announce: () => undefined },
        dialogs: { open: () => true, close: () => true, dismiss: () => true, isOpen: () => false },
        runAction: () => Promise.resolve(true),
        navigate: () => undefined,
        address: { back: () => false, replace: () => undefined, push: () => undefined },
        reportTheme: () => undefined,
        systemNotifications: { permission: () => "denied", registration: () => Promise.resolve(undefined), create: () => undefined, focus: () => undefined }
    });
}

test("the corpus holds every built-in effect kind the page has a type for", () => {
    assert.deepEqual(new Set(corpus.cases.map(entry => entry.effect["kind"])), new Set(Object.keys(EffectTypes)));
});

test("every field the effect registry's handler reads of a built-in effect is one the server writes", async () => {
    const target = new FakeElement("div");
    const dom = real<DomRegistry>({ findComponent: () => real(target), findEveryComponent: () => [real(target)] });
    const warn = console.warn;
    const error = console.error;
    const missed: string[] = [];

    console.warn = () => undefined;
    console.error = () => undefined;

    try {
        for (const entry of corpus.cases) {
            const reads = new Set<string>();

            fakeDocument.body.children.length = 0;
            new EffectRegistry(stubs()).apply({ effect: real<ClientEffect>(recording(structuredClone(entry.effect), reads)), dom });
            missed.push(...[...reads].map(field => `${entry.name}: ${field}`));
        }

        // A handler's late warning (a copy the fake page cannot make) comes after its promise, still unheard.
        await new Promise(settle => setTimeout(settle, 0));
    } finally {
        console.warn = warn;
        console.error = error;
    }

    assert.deepEqual(missed, []);
});

test("every field the page's type for an effect declares is one the server writes", () => {
    const missing: string[] = [];

    for (const [kind, type] of Object.entries(EffectTypes)) {
        const written = new Set(corpus.cases.filter(entry => EffectTypes[entry.effect["kind"] as string] === type).flatMap(entry => Object.keys(entry.effect)));

        missing.push(...declaredFields(type).filter(field => !written.has(field)).map(field => `${kind} (${type}): ${field}`));
    }

    assert.deepEqual([...new Set(missing)], []);
});

test("a notification's tone and a system notification's address title are pinned as the server writes them", () => {
    const notification = corpus.cases.find(entry => entry.effect["kind"] === "ShowNotification")!.effect;
    const system = corpus.cases.find(entry => entry.effect["kind"] === "ShowSystemNotification")!.effect;

    assert.equal(notification["tone"], "Warning");
    assert.equal("severity" in notification, false);
    assert.deepEqual(system["addressTitle"], { text: "Open thread" });
    assert.ok(declaredFields("NotificationClientEffect").includes("tone"));
    assert.ok(declaredFields("SystemNotificationClientEffect").includes("addressTitle"));
});
