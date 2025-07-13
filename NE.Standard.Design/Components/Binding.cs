using NE.Standard.Serialization;

namespace NE.Standard.Design.Components
{
    public enum BindingMode
    {
        OneWay = 1,
        TwoWay = 2,
        OneWayToSource = 3,
        OnSubmit = 4
    }

    public interface IValueConverter
    {
        public object? Convert(object? value);
        public object? ConvertBack(object? value);
    }

    [NEObject]
    public class Binding
    {
        public BindingMode Mode { get; set; } = BindingMode.OneWay;
        public string Source { get; set; } = default!;
        public string Target { get; set; } = default!;

        public IValueConverter? Converter { get; set; }
    }
}
