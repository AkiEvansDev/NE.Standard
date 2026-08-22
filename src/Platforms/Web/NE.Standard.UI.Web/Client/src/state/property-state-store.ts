import { getIdValue, WebRenderPropertyReferenceMetadata } from "../metadata/metadata-index";

export class PropertyStateStore {
    private readonly values = new Map<string, unknown>();

    public get(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[] = []): unknown {
        return this.values.get(this.createKey(reference, dynamicParameters));
    }

    public has(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[] = []): boolean {
        return this.values.has(this.createKey(reference, dynamicParameters));
    }

    public set(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[], value: unknown): boolean {
        const key = this.createKey(reference, dynamicParameters);
        const previousValue = this.values.get(key);

        if (this.values.has(key) && areEqual(previousValue, value))
            return false;

        this.values.set(key, value);

        return true;
    }

    public delete(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[] = []): boolean {
        return this.values.delete(this.createKey(reference, dynamicParameters));
    }

    public deleteComponent(componentId: number): void {
        const prefix = `${componentId}:`;

        for (const key of this.values.keys()) {
            if (key.startsWith(prefix))
                this.values.delete(key);
        }
    }

    public clear(): void {
        this.values.clear();
    }

    private createKey(reference: WebRenderPropertyReferenceMetadata, dynamicParameters: readonly unknown[]): string {
        return `${getIdValue(reference.componentId)}:${reference.propertyId}:${serializeDynamicParameters(dynamicParameters)}`;
    }
}

function serializeDynamicParameters(dynamicParameters: readonly unknown[]): string {
    if (dynamicParameters.length === 0)
        return "";

    try {
        return JSON.stringify(dynamicParameters);
    }
    catch {
        return String(dynamicParameters);
    }
}

function areEqual(left: unknown, right: unknown): boolean {
    if (Object.is(left, right))
        return true;

    if (left instanceof Date && right instanceof Date)
        return left.getTime() === right.getTime();

    return false;
}
