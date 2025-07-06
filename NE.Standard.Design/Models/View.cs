using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NE.Standard.Design.Models
{
    public interface IView
    {
        List<UIDialog>? Dialogs { get; }
        IUILayout? Layout { get; }

        public Task InitAsync();
    }

    public abstract class View : IView
    {
        public abstract List<UIDialog>? Dialogs { get; }
        public abstract IUILayout? Layout { get; }

        public abstract Task InitAsync();
    }
}
