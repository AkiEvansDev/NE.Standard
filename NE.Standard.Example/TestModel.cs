using CommunityToolkit.Mvvm.ComponentModel;
using NE.Standard.Design.Models;

namespace NE.Standard.Example
{
    public partial class TestModel : ServerModel
    {
        protected override SyncMode SyncMode { get; set; } = SyncMode.Debounced;

        [ObservableProperty]
        private string _title = "";

        [ObservableProperty]
        private string _text = "";

        [UIAction]
        public void TestUpdate()
        {
            Title = "Test Title Update";
            Text = "...";
        }
    }
}
