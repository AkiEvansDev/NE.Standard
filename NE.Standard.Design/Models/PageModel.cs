using NE.Standard.Design.Elements;
using System.Threading.Tasks;

namespace NE.Standard.Design.Models
{
    public interface IPageModel
    {
        Task<(IServerModel? model, IUIPage? ui)> LoadAsync(UserContext user);
    }

    public abstract class PageModel<TModel, TPage> : IPageModel
        where TModel : IServerModel
        where TPage : IUIPage
    {
        public async Task<(IServerModel? model, IUIPage? ui)> LoadAsync(UserContext user)
        {
            return (
                await InitAsync(user),
                await RenderAsync(user)
            );
        }

        protected abstract Task<TModel> InitAsync(UserContext user);
        protected abstract Task<TPage> RenderAsync(UserContext user);
    }
}
