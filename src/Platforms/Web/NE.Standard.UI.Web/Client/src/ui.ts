import "./ui.less";
import { installGlobalApi } from "./runtime/global-api";
import { logError } from "./metadata/logger";
import { startWebUIAsync } from "./runtime/web-ui-runtime";

installGlobalApi();

void startWebUIAsync().catch(error => {
    logError("Web client failed to start.", error);
});
