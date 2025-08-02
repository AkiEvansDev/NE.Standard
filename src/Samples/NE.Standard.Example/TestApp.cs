using CommunityToolkit.Mvvm.ComponentModel;
using NE.Standard.Design.Common;
using NE.Standard.Design.Components;
using NE.Standard.Design.Data;
using NE.Standard.Design.UI;
using NE.Standard.Types;
using System;
using System.Collections.Generic;

namespace NE.Standard.Example
{
    public partial class TestLabelData : RecursiveObservable
    {
        [ObservableProperty]
        private string _title = "";

        [ObservableProperty]
        private string _text = "";
    }

    public partial class TestModel : NEModel<SessionContext>
    {
        [ObservableProperty]
        private string _title = "Test 1";

        [ObservableProperty]
        private string _text = "Test 1";

        [ObservableProperty]
        private TestLabelData _label = new TestLabelData
        {
            Title = "Test 2",
            Text = "Test 2"
        };

        public NEActionResult TestUpdate()
        {
            Title = "Test Title Update " + DateTime.Now;
            Text = "...";

            //Label = new TestLabelData
            //{
            //    Title = "ddddd " + DateTime.Now,
            //    Text = "Update???!!!",
            //};

            return new NEActionResult { Success = true };
        }
    }

    public class TestView : NEView<SessionContext>
    {
        public override IArea Area { get; } = new GridArea
        {
            Blocks = new List<IBlock>
            {
                new LabelBlock
                {
                    Label = "___________",
                    Description = "___________",
                    Layout = new GridPlacement(1, 1, 10)
                }
                .BindLabel(nameof(TestModel.Title))
                .BindDescription(nameof(TestModel.Text)),
                new LabelBlock
                {
                    Label = "___________",
                    Description = "___________",
                    Layout = new GridPlacement(1, 2, 10)
                }
                .BindContext(nameof(TestModel.Label))
                .BindLabel(nameof(TestLabelData.Title))
                .BindDescription(nameof(TestLabelData.Text)),
                new ButtonBlock
                {
                    Label = "Click!",
                    Action = nameof(TestModel.TestUpdate),
                    Layout = new GridPlacement(1, 3)
                }
            }
        }
        .AddRow(UnitType.Star, 1)
        .AddRow(UnitType.Star, 2)
        .AddRow(UnitType.Star, 2)
        .AddRow(UnitType.Star, 2)
        .AddRow(UnitType.Star, 1);
    }

    public class TestApp : NEApp
    {
        public override string DefaultUri { get; } = "/test";
        public override UIStyle DefaultStyle { get; } = new UIStyle();

        public TestApp(IServiceProvider serviceProvider) : base(serviceProvider)
        {
            RegisterPage<TestModel, TestView>("/test");
        }
    }
}
