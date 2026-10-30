// A notification effect as the wire carries it, through the effect registry: its tone (the effect's `Tone`) draws the toast and makes
// a Warning's an alert; a system notification's fallback toast offers its address under the words the effect gave it.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, fakeDocument, installFakeDom, real } from "./fake-dom.ts";
import type { ClientEffect } from "../src/metadata/metadata-index.ts";
import type { DomRegistry } from "../src/addressing/dom-registry.ts";
import type { NotificationRequest } from "../src/interactions/notification-engine.ts";

installFakeDom({
    window: { addEventListener: () => undefined, setTimeout, clearTimeout, location: { origin: "https://app.test", pathname: "/inbox", search: "", hash: "" } },
    location: { origin: "https://app.test", pathname: "/inbox", search: "", hash: "" }
});

const { EffectRegistry } = await import("../src/effects/effect-registry.ts");
const { NotificationEngine } = await import("../src/interactions/notification-engine.ts");

const dom = real<DomRegistry>({});

test("a raw ShowNotification with a warning tone ends as a warning toast said as an alert", () => {
    fakeDocument.body.children.length = 0;

    const notifications = new NotificationEngine({ root: real<ParentNode>(fakeDocument.body) });
    const shown: HTMLElement[] = [];
    const show = notifications.show.bind(notifications);

    notifications.show = request => {
        const toast = show(request);

        shown.push(toast);
        return toast;
    };

    new EffectRegistry({ notifications }).applyAll([real<ClientEffect>({ kind: "ShowNotification", message: { text: "Disk almost full." }, tone: "warning" })], dom);

    assert.equal(shown.length, 1);

    const toast = real<FakeElement>(shown[0]);

    assert.equal(toast.getAttribute("role"), "alert");
    assert.equal(toast.classes.has("ui-notification--warning"), true);
});

test("a system notification shown as a toast offers its address under the words the effect gave it", () => {
    const requests: NotificationRequest[] = [];
    const notifications = real<InstanceType<typeof NotificationEngine>>({ show: (request: NotificationRequest) => void requests.push(request) });
    const addressTitle = { key: "home.open.thread" };

    new EffectRegistry({ notifications, navigate: () => undefined }).applyAll([
        real<ClientEffect>({ kind: "ShowSystemNotification", title: { text: "New reply" }, address: "/threads/7", addressTitle, when: "WhenHidden" })
    ], dom);

    assert.equal(requests.length, 1);
    assert.deepEqual(requests[0].action?.title, addressTitle);
});
