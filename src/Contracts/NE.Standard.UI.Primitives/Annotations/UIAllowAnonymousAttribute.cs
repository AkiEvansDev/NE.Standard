using System;

namespace NE.Standard.UI.Primitives.Annotations;

/// <summary>
/// Allows access to a UI controller or command without authorization.
/// </summary>
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
public sealed class UIAllowAnonymousAttribute : Attribute { }
