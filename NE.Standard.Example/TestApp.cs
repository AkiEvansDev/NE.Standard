using Microsoft.Extensions.Logging;
using NE.Standard.Design;
using NE.Standard.Design.Elements;
using NE.Standard.Design.Elements.Base;
using NE.Standard.Design.Styles;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace NE.Standard.Example
{
    public class TestApp : UIApp
    {
        public TestApp(ILogger logger) : base(logger)
        { 
            RegisterPage<TestPage>("test", () => new TestPage(_logger));
        }

        protected override Task<UserContext> GetUserContextAsync(string sessionId)
        {
            return Task.FromResult(new UserContext
            {
                UIStyle = new UIStyleConfig()
            });
        }

        protected override Task<UIAppLayout> LayoutAsync(UserContext user)
        {
            return Task.FromResult(new UIAppLayout
            {
                Content = new UIGrid
                {
                    Elements = new List<UIElement>
                    {
                        new UIPageRenderer()
                    }
                }
            });
        }
    }
}
