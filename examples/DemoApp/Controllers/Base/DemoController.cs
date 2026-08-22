using System;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;

namespace DemoApp.Controllers.Base;

internal partial class DemoGroupContext : RecursiveObservable
{
    [RecursiveMember]
    public partial string Message { get; set; } = "---";

    protected void SetLastChange<T>(string property, T value)
        => Message = $"{property} -> {value}";

    protected void LogEvent(string message)
        => Message = $"{DateTime.Now:HH:mm:ss} > {message}";

    protected static T CycleEnum<T>(T current) where T : struct, Enum
    {
        T[] values = Enum.GetValues<T>();
        var index = Array.IndexOf(values, current);
        return values[(index + 1) % values.Length];
    }

    protected static T CycleValue<T>(T current, params T[] values)
    {
        var index = Array.IndexOf(values, current);
        return values[(index + 1) % values.Length];
    }
}

internal abstract class DemoController : UIControllerBase
{ }
