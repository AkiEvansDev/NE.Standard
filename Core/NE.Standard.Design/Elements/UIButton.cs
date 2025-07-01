namespace NE.Standard.Design.Elements
{
    public class UIButton : UILabel
    {
        public string? Action { get; set; }
        public object[]? Parameters { get; set; }

        public bool IsAsync { get; set; } = false;
    }
}
