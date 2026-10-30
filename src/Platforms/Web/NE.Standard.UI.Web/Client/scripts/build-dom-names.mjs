// Reads `src/addressing/dom-names.json` (the single source of truth for every `ui-*` and `data-ui-*` name the core client declares,
// whether it is client-only, and its key on `pluginDomNames`) and synchronizes `src/addressing/dom-attributes.ts` and
// `plugin/ne-standard-ui.d.ts` (plus each add-on's copy of `ne-standard-ui.d.ts`). Run by `npm run build` beside `build-plugin-less.mjs`.

import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const clientRoot = resolve(import.meta.dirname, "..");
const manifestPath = resolve(clientRoot, "src/addressing/dom-names.json");
const domAttributesPath = resolve(clientRoot, "src/addressing/dom-attributes.ts");
const contractPath = resolve(clientRoot, "plugin/ne-standard-ui.d.ts");
const addonsRoot = resolve(clientRoot, "../../../../addons");

const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
const byConstant = new Map(manifest.map(entry => [entry.constant, entry]));

// 1. Update constant values and pluginDomNames in dom-attributes.ts from dom-names.json.
let domAttributes = readFileSync(domAttributesPath, "utf8").replace(/\r\n/g, "\n");

domAttributes = domAttributes.replace(
    /^(?<prefix>(?:export\s+)?const\s+)(?<name>\w+)(?<middle>\s*=\s*)"(?<value>(?:data-)?ui-[a-z0-9_-]+)";$/gm,
    (full, prefix, name, middle) => {
        const entry = byConstant.get(name);

        if (entry === undefined)
            throw new Error(`Constant ${name} in dom-attributes.ts is missing from dom-names.json.`);

        return `${prefix}${name}${middle}"${entry.value}";`;
    }
);

const declaredConstants = new Set(
    Array.from(
        domAttributes.matchAll(/^(?:export\s+)?const\s+(?<name>\w+)\s*=\s*"(?<value>(?:data-)?ui-[a-z0-9_-]+)";$/gm),
        match => match.groups.name
    )
);

for (const entry of manifest) {
    if (!declaredConstants.has(entry.constant)) {
        const keyword = entry.exported === false ? "const" : "export const";
        const blockHeader = "/** The names above a package reads too, handed to it as `names` so a rename here reaches it. */";

        domAttributes = domAttributes.replace(blockHeader, `${keyword} ${entry.constant} = "${entry.value}";\n\n${blockHeader}`);
        declaredConstants.add(entry.constant);
    }
}

const pluginEntries = [
    ...manifest.filter(entry => entry.plugin !== undefined).map(entry => [entry.plugin, entry.constant, entry.value]),
    ["popupSelector", "PopupRoleSelector", "[role='listbox'], [role='menu'], [role='dialog']"],
    ["listTriggerSelector", "ListTriggerSelector", ".ui-select__trigger"],
    ["itemsQueryKind", "ItemsQueryValueKind", "items-query"]
];

const existingPluginOrder = Array.from(
    domAttributes.match(/export const pluginDomNames = \{([\s\S]*?)\} as const;/)?.[1].matchAll(/^\s*(?<key>\w+):/gm) ?? [],
    match => match.groups.key
);

pluginEntries.sort((a, b) => {
    const ia = existingPluginOrder.indexOf(a[0]);
    const ib = existingPluginOrder.indexOf(b[0]);

    return (ia === -1 ? 9999 : ia) - (ib === -1 ? 9999 : ib);
});

const pluginBlock = `export const pluginDomNames = {\n${pluginEntries.map(([key, constant]) => `    ${key}: ${constant}`).join(",\n")}\n} as const;`;

domAttributes = domAttributes.replace(/export const pluginDomNames = \{[\s\S]*?\} as const;/, pluginBlock);
writeFileSync(domAttributesPath, domAttributes);

// 2. Synchronize DomNames in plugin/ne-standard-ui.d.ts and copy to add-ons.
let contract = readFileSync(contractPath, "utf8").replace(/\r\n/g, "\n");

for (const [key, , value] of pluginEntries) {
    const pattern = new RegExp(`(readonly\\s+${key}:\\s*)"[^"]*";`);

    if (pattern.test(contract)) {
        contract = contract.replace(pattern, `$1"${value}";`);
    }
    else {
        contract = contract.replace(
            /(\n\s*\};\n\n\s*\/\*\* What a package's engine starts from:)/,
            `\n        readonly ${key}: "${value}";$1`
        );
    }
}

writeFileSync(contractPath, contract);

if (existsSync(addonsRoot)) {
    for (const addon of readdirSync(addonsRoot, { withFileTypes: true })) {
        if (!addon.isDirectory())
            continue;

        const copyPath = resolve(addonsRoot, addon.name, `src/NE.Standard.UI.Web.${addon.name}/Client/plugin/ne-standard-ui.d.ts`);

        if (existsSync(copyPath))
            writeFileSync(copyPath, contract);
    }
}

console.log(`dom-names.json -> dom-attributes.ts (${manifest.length} constants, ${pluginEntries.length} pluginDomNames)`);
