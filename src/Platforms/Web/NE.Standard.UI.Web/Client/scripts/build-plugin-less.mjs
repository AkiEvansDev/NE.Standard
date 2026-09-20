// Writes `plugin/ne-standard-ui.less`: the tokens and the mixins a package's stylesheet may reach for, as one self-contained file —
// the Less half of the plugin contract beside `plugin/ne-standard-ui.d.ts`. A package copies it byte for byte (PluginApiSyncTests
// holds the copies to it) and imports it by reference, so a mirror builds with no core folder beside it. Run by `npm run build`,
// so the file is never older than the mixins it is cut from.
//
// Only definitions go in: every file below is variables and parenthesised mixins, which emit nothing on their own; a rule would
// be painted once per package that imports it. The `@import` lines are dropped, since the imports are the files concatenated.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const Sources = [
    "core/tokens.less",
    "mixins/glyphs.less",
    "mixins/interactive.less",
    "mixins/elevation.less",
    "mixins/color.less",
    "mixins/responsive.less",
    "mixins/focus.less",
    "mixins/popup.less",
    "mixins/placement.less",
    "mixins/field.less",
    "mixins/selected.less",
    "mixins/text.less",
    "mixins/arc.less"
];

const Header = `// The Less half of the plugin contract: the framework's tokens and the mixins a package's stylesheet may reach for, cut out of
// the core's own files by \`scripts/build-plugin-less.mjs\` at every build of the framework's client. Generated — edit the core's
// files, then copy this one over the package's copy; \`PluginApiSyncTests\` refuses a copy that differs. A package imports it by
// reference (\`@import (reference) "../../plugin/ne-standard-ui.less";\`) and writes \`.ui-responsive-property(...)\`,
// \`.ui-focus-ring()\`, \`@ui-motion-fast\` as the core does.
`;

const root = resolve(import.meta.dirname, "../src/styles");
const parts = Sources.map(source => {
    const text = readFileSync(resolve(root, source), "utf8").replace(/\r\n/g, "\n");
    const body = text.split("\n").filter(line => !line.startsWith("@import ")).join("\n").trim();

    return `// --- ${source} ---\n\n${body}\n`;
});

const output = resolve(import.meta.dirname, "../plugin/ne-standard-ui.less");
// LF on every platform, and .gitattributes checks the file out the same way: a build must not rewrite it, and a package's copy is
// compared byte for byte on a Linux runner, where a checkout is LF and a CRLF write would differ from every copy.
const content = `${Header}\n${parts.join("\n")}`;

writeFileSync(output, content);
console.log(`plugin/ne-standard-ui.less: ${Sources.length} files, ${(content.length / 1024).toFixed(1)} KB`);
