using NE.Standard.Design.Elements.Base;

namespace NE.Standard.Design.Elements
{
    public interface IUIAction : IUIElement
    {
        string? Label { get; }
        string? Action { get; }
        string[]? RelatedProperties { get; }
        object[]? RelatedParameters { get; }
    }

    public abstract class UIAction<T> : UIElement<T>, IUIAction
        where T : UIAction<T>
    {
        public string? Label { get; set; }

        public string? Action { get; set; }
        public string[]? RelatedProperties { get; set; }
        public object[]? RelatedParameters { get; set; }
    }

    public class UILink : UIAction<UIButton> { }

    public class UIButton : UIAction<UIButton>
    {
        public string? Icon { get; set; }
    }

    public class UIOption : UIAction<UIButton>
    {
        public string? Icon { get; set; }
        public string? Description { get; set; }
    }
}
