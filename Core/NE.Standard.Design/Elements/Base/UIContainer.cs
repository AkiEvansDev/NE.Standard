namespace NE.Standard.Design.Elements.Base
{
    public abstract class UIContainer : UIElement
    {
        public UIElement[] Elements { get; set; } = default!;
    }

    public abstract class UIPage : UIContainer
    {
        public UIDialog[]? Dialogs { get; set; }
    }
}
