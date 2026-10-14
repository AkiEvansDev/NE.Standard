// `.ts` on the value imports: `node --test` loads this module as it is.
import { webDomConverters } from "../rendering/web-dom-converters.ts";
import { logError, logWarn } from "../runtime/logger.ts";

export type ValueConverterContext = {
    readonly name: string;
    readonly value: unknown;
};

export type ValueConverter = {
    readonly name: string;
    canConvert(context: ValueConverterContext): boolean;
    convert(context: ValueConverterContext): unknown;
};

export type ValueConverterRegistration = {
    readonly name: string;
    canConvert?(context: ValueConverterContext): boolean;
    convert(context: ValueConverterContext): unknown;
};

export class ConverterRegistry {
    private readonly converters = new Map<string, ValueConverter>();

    public constructor() {
        this.register({
            name: "*",
            canConvert: context => webDomConverters.has(context.name),
            convert: context => webDomConverters.get(context.name)!(context.value)
        });
    }

    public register(registration: ValueConverterRegistration): void {
        const name = normalizeConverterName(registration.name);

        const converter: ValueConverter = {
            name,
            canConvert: registration.canConvert ?? (context => context.name === name),
            convert: registration.convert
        };

        this.converters.set(name, converter);
    }

    public convert(name: string | null | undefined, value: unknown): unknown {
        const converterName = name?.trim();

        if (converterName === undefined || converterName.length === 0)
            return value;

        const exactConverter = this.converters.get(converterName);
        const context = { name: converterName, value };

        // One that throws (a package's, on a value it did not expect) gives the value as it came, as a converter not found does: the
        // patch goes on to the property's other operations and records the value.
        try {
            if (exactConverter !== undefined && exactConverter.canConvert(context))
                return exactConverter.convert(context);

            const fallbackConverter = this.converters.get("*");

            if (fallbackConverter !== undefined && fallbackConverter.canConvert(context))
                return fallbackConverter.convert(context);
        }
        catch (error) {
            logError("a converter failed; the value is written as it came.", { converter: converterName, value, error });
            return value;
        }

        logWarn("converter was not found.", { converter: converterName });
        return value;
    }
}

function normalizeConverterName(name: string): string {
    const normalized = name.trim();

    if (normalized.length === 0)
        throw new Error("Converter name is required.");

    return normalized;
}
