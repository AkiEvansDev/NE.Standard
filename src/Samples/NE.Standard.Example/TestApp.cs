using CommunityToolkit.Mvvm.ComponentModel;
using Microsoft.Extensions.Logging;
using NE.Standard.Design;
using NE.Standard.Design.Data;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Styles;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NE.Standard.Example
{
    public partial class TestModel : NEModel
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

        public override Task InitAsync()
        {
            return Task.CompletedTask;
        }
    }

    public class TestAppModel : NEModel
    {
        protected override SyncMode SyncMode { get; set; } = SyncMode.None;
    }

    public class TestView : NEView
    {
        public override List<UIDialog>? Dialogs { get; }
        public override IUILayout? Layout { get; } = new UIGrid
        {
            Rows = new GridDefinition[2]
            {
                new GridDefinition { Star = 1 },
                new GridDefinition { Star = 1 }
            },
            Columns = new GridDefinition[2]
            {
                new GridDefinition { Star = 1 },
                new GridDefinition { Star = 1 }
            },
            Elements = new List<IUIElement>
            {
                new UILabel
                {
                    Label = "Test",
                    Description = "Test 2132342342",
                }
                .SetId("test_label")
                .SetLayout(1, 0)
                .AddBinding(BindingType.TwoWay, nameof(TestModel.Title), nameof(UILabel.Label))
                .AddBinding(BindingType.TwoWay, nameof(TestModel.Text), nameof(UILabel.Description)),
                new UIButton
                {
                    Label = "Update",
                    Action = nameof(TestModel.TestUpdate)
                }
                .SetLayout(1, 1)
            }
        };

        public override Task InitAsync()
        {
            return Task.CompletedTask;
        }
    }

    public class TestApp : NEApp
    {
        public override string HomePage { get; } = "test";
        public override UIStyleConfig DefaultStyle { get; } = new UIStyleConfig();
        public override UIApp UIApp { get; } = new UIApp
        {
            AppModel = new TestAppModel(),
            ContentLayout = new UIGrid
            {
                Rows = new GridDefinition[2]
                {
                    new GridDefinition { Absolute = 40 },
                    new GridDefinition { Star = 1 }
                },
                Elements = new List<IUIElement>
                {
                    new UILabel 
                    {
                        Label = "TestApp"
                    },
                    new UIPageRenderer()
                        .SetLayout(0, 1)
                }
            }
        };

        public TestApp(IServiceProvider serviceProvider) : base(serviceProvider)
        {
            RegisterPage<TestModel, TestView>("test");
        }
    }
}
