using System;

namespace NE.Standard.UI.Authoring.Components;

/// <summary>
/// A subtree default rule declared on a component, applied by the compiler to descendants assignable to <see cref="TargetType"/>.
/// </summary>
public readonly record struct UIDefaultsRule(Type TargetType, Action<IVisualComponent> Apply);
