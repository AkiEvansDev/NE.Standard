using NE.Standard.Design.Common;
using NE.Standard.Serialization;
using System;

namespace NE.Standard.Design.Binding
{
    public enum InteractionType
    {
        Required = 1,
        Equals = 2,
        Greater = 3,
        GreaterOrEqual = 4,
        Less = 5,
        LessOrEqual = 6,
        Like = 7,
        In = 8,
        Regex = 9
    }

    [NEObject]
    public sealed class BlockInteraction : IDisposable
    {
        public UIPath Target { get; set; }
        public UIPath Source { get; set; }

        public InteractionType Type { get; set; }
        public object? Value { get; set; }
        public bool Invert { get; set; }

        public string? Error { get; set; }

        public void Dispose()
        {
            if (Value is IDisposable disposable)
                disposable.Dispose();
        }
    }
}
