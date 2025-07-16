using NE.Standard.Design.Common;
using NE.Standard.Serialization;
using System;

namespace NE.Standard.Design.Binding
{
    public enum BlockBindingMode
    {
        OneWay = 1,
        TwoWay = 2,
        OneWayToSource = 3,
        OnSubmit = 4
    }

    public interface IBindingValueConverter
    {
        public object? Convert(object? value);
        public object? ConvertBack(object? value);
    }

    [NEObject]
    public sealed class BlockBinding : IDisposable
    {
        public BlockBindingMode Mode { get; set; }
        public UIPath Target { get; set; }
        public string Path { get; set; } = default!;

        public IBindingValueConverter? Converter { get; set; }

        public void Dispose()
        {
            if (Converter is IDisposable disposable)
                disposable.Dispose();
        }
    }
}
