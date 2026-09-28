using NE.Standard.UI.Generators.Infrastructure;

namespace NE.Standard.UI.Generators.ComponentProperties;

/// <summary>
/// A component type with the properties its <c>[UIComponentPropertyBlock]</c> contracts contribute, and what reading them reported.
/// </summary>
internal sealed record UIComponentPropertyBlockModel(UIComponentTypeModel Owner, EquatableArray<UIComponentPropertyModel> Properties, EquatableArray<DiagnosticInfo> Diagnostics);
