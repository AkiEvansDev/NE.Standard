using CommunityToolkit.Mvvm.ComponentModel;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Models;

namespace NE.Standard.Example
{
    public partial class TestModel : UIModel
    {
        [ObservableProperty]
        private string _title = "";

        [ObservableProperty]
        private string _text = "";
    }
}
