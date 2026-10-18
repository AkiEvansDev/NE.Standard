// Every add-on's entry stylesheet, for the rules the core's tests hold every package's look to as well as its own. Only where the tree
// holds them: a slice's own mirror has the core alone, and its tests run nowhere but here.

import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const addOns = resolve(dirname(fileURLToPath(import.meta.url)), "../../../../../../addons");

export const addOnEntries = existsSync(addOns) ? [
    "Charts/src/NE.Standard.UI.Web.Charts/Client/src/styles/ui-charts.less",
    "CodeInput/src/NE.Standard.UI.Web.CodeInput/Client/src/styles/ui-code-input.less",
    "CodeInput/src/NE.Standard.UI.Web.CodeInput/Client/src/styles/ui-markdown.less",
    "DataGrid/src/NE.Standard.UI.Web.DataGrid/Client/src/styles/ui-data-grid.less",
    "Graph/src/NE.Standard.UI.Web.Graph/Client/src/styles/ui-graph.less"
].map(entry => resolve(addOns, entry)) : [];
