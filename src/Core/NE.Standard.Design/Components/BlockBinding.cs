using NE.Standard.Serialization;

namespace NE.Standard.Design.Components
{
    public enum BlockBindingMode
    {
        OneWay = 1,
        TwoWay = 2,
        OneWayToSource = 3,
        OnSubmit = 4
    }

    public interface INEValueConverter
    {
        public object? Convert(object? value);
        public object? ConvertBack(object? value);
    }

    [NEObject]
    public class BlockBinding
    {
        public BlockBindingMode Mode { get; set; } = BlockBindingMode.OneWay;
        public string Source { get; set; } = default!;
        public string Target { get; set; } = default!;

        public INEValueConverter? Converter { get; set; }
    }
}
