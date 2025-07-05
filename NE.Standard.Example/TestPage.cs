using Microsoft.Extensions.Logging;
using NE.Standard.Design;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NE.Standard.Example
{
    public class TestPage : UIPageModel<TestModel, UIPage>
    {
        public TestPage(ILogger logger) : base(logger) { }

        protected override Task<TestModel> InitAsync(UserContext user)
        {
            return Task.FromResult(new TestModel());
        }

        protected override Task<UIPage> RenderAsync(UserContext user)
        {
            return Task.FromResult(new UIPage
            {
                Content = new UIGrid
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
                        .SetLayout(1, 1)
                        .AddBinding(BindingType.TwoWay, nameof(TestModel.Title), nameof(UILabel.Label))
                        .AddBinding(BindingType.TwoWay, nameof(TestModel.Text), nameof(UILabel.Description))
                    }
                }
            });
        }
    }
}
