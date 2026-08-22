using System;

namespace NE.Standard.UI.Primitives.Annotations;

/// <summary>
/// Marks a property value as localizable text.
/// </summary>
[AttributeUsage(AttributeTargets.Property, Inherited = true, AllowMultiple = false)]
public sealed class TranslatableAttribute : Attribute { }
