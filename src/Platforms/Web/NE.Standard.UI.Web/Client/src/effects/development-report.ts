// `import type` only beside the logger: `node --test` loads this module as it is.
import type { DevelopmentReportClientEffect } from "../metadata/metadata-index.ts";
import { logError } from "../runtime/logger.ts";

/**
 * Writes what the server dropped or refused for the author's mistake to the console, in Development: the error its log has, said where
 * the author is looking, and nothing shown to the reader.
 */
export function writeDevelopmentReport(effect: DevelopmentReportClientEffect): void {
    const message = effect.message;

    logError(typeof message === "string" && message.length > 0 ? message : "the server reported a mistake with no words.", effect);
}
