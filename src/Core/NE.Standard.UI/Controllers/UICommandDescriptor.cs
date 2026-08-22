using System.Collections.Generic;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Security;
using NE.Standard.UI.Shell.Commands;

namespace NE.Standard.UI.Controllers;

internal sealed class UICommandDescriptor : IUICommandMetadata
{
    public required string Name { get; init; }
    public required UICommandInvoker Invoker { get; init; }
    public required UIAccessRule[] AccessRules { get; init; }
    public required UICommandConcurrencyMode ConcurrencyMode { get; init; }
    public bool? AllowAnonymous { get; init; }
    public required IUICommandFilter[] Filters { get; init; }

    IReadOnlyList<UIAccessRule> IUICommandMetadata.AccessRules => AccessRules;
}
