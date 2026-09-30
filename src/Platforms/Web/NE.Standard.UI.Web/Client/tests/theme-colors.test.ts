// The reader's own colours: the stylesheet the server answers stands right after the theme's in the head, is rewritten in place by a
// later answer, and goes with an empty one, which is the application's palette again.

import assert from "node:assert/strict";
import test from "node:test";
import { FakeElement, installFakeDom, real } from "./fake-dom.ts";

installFakeDom();

const { applyThemeColors } = await import("../src/rendering/theme-colors.ts");

const Css = "[data-ui-theme=\"light\"] {\n    --ui-color-primary: #F0DC78FF;\n}\n";

function head(): { head: FakeElement; theme: FakeElement; link: FakeElement } {
    const theme = new FakeElement("style");
    const link = FakeElement.of("", { rel: "stylesheet" }, "link");

    return { head: new FakeElement("head").append(new FakeElement("meta"), theme, link), theme, link };
}

test("the reader's colours stand right after the theme's stylesheet", () => {
    const { head: element, theme } = head();

    applyThemeColors(real<Element>(element), Css);

    const style = element.children[element.children.indexOf(theme) + 1];

    assert.equal(style.tagName, "style");
    assert.equal(style.getAttribute("data-ui-theme-colors"), "");
    assert.equal(style.textContent, Css);
});

test("a later answer rewrites the same stylesheet, and an empty one takes it away", () => {
    const { head: element } = head();
    const other = Css.replace("#F0DC78FF", "#503CB4FF");

    applyThemeColors(real<Element>(element), Css);
    applyThemeColors(real<Element>(element), other);

    const styles = element.querySelectorAll("style[data-ui-theme-colors]");

    assert.equal(styles.length, 1);
    assert.equal(styles[0].textContent, other);

    applyThemeColors(real<Element>(element), "");

    assert.equal(element.querySelector("style[data-ui-theme-colors]"), null);
});

test("the stylesheet a render carried is the one a switch rewrites", () => {
    const { head: element, theme } = head();
    const rendered = FakeElement.of("", { "data-ui-theme-colors": "" }, "style");

    rendered.textContent = Css;
    element.insertBefore(rendered, theme.nextElementSibling);

    applyThemeColors(real<Element>(element), "");

    assert.equal(element.querySelector("style[data-ui-theme-colors]"), null);
    assert.equal(element.querySelectorAll("style").length, 1);
});
