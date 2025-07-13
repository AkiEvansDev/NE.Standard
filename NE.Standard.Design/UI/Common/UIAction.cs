namespace NE.Standard.Design.UI.Common
{
    public interface IUIAction
    {
        string Action { get; }
        object[]? Parameters { get; }
    }

    public abstract class UIAction<T> : Block<T>, IUIAction
        where T : UIAction<T>
    {
        public override Alignment HorizontalAlignment { get; set; } = Alignment.Stretch;
        public override Alignment VerticalAlignment { get; set; } = Alignment.Center;

        public string Action { get; set; } = default!;
        public object[]? Parameters { get; set; }
    }
}
