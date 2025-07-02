namespace NE.Standard.Design.Elements
{
    public class UIButton : UILabel
    {
        public string? Action { get; set; }
        public object[]? ServerParameters { get; set; }
    }

    public class UILink : UIButton { }
}
