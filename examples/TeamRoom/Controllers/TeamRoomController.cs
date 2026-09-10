using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Navigation;
using NE.Standard.UI.Abstractions.Recursive;
using NE.Standard.UI.Components.BuiltIns.Models;
using NE.Standard.UI.Controllers;
using NE.Standard.UI.Primitives.Annotations;
using NE.Standard.UI.Primitives.Styling;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Sessions;
using TeamRoom.Data;
using TeamRoom.Services;

namespace TeamRoom.Controllers;

/// <summary>
/// What every signed-in page has: the account behind the session, the sidebar with the chat's unread count on it, and an
/// ear on the application's events that pushes what it hears into this runtime.
/// </summary>
public abstract partial class TeamRoomController : UIControllerBase
{
    private static partial class Log
    {
        [LoggerMessage(Level = LogLevel.Debug, Message = "A pushed change did not reach the runtime: {Reason}")]
        public static partial void PushFailed(ILogger logger, string reason);
    }

    private IDisposable? _subscription;
    private MenuItem? _chatEntry;

    [RecursiveMember(false)]
    public RecursiveCollection<MenuItem> Navigation { get; } = [];

    [RecursiveMember]
    public partial string DisplayName { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string RoleLabel { get; set; } = string.Empty;

    [RecursiveMember]
    public partial string? AvatarSource { get; set; }

    [RecursiveMember]
    public partial bool IsAdmin { get; set; }

    /// <summary>The other side of <see cref="IsAdmin"/>, for the inputs that are read-only to everyone else.</summary>
    [RecursiveMember]
    public partial bool IsReader { get; set; } = true;

    /// <summary>What only an administrator sees: the editing tools.</summary>
    [RecursiveMember]
    public partial UIVisibility AdminVisibility { get; set; } = UIVisibility.Collapsed;

    protected AccountRecord Account
    {
        get => field ?? throw new InvalidOperationException("The account is known once the controller has initialized.");
        private set;
    }

    protected string AccountId => Account.Id;

    protected AccountService AccountStore => Context.Services.GetRequiredService<AccountService>();

    protected DocumentService DocumentStore => Context.Services.GetRequiredService<DocumentService>();

    protected ChatService ChatStore => Context.Services.GetRequiredService<ChatService>();

    protected MediaService MediaStore => Context.Services.GetRequiredService<MediaService>();

    protected AppEvents Events => Context.Services.GetRequiredService<AppEvents>();

    protected sealed override async Task OnInitializeAsync(CancellationToken cancellationToken)
    {
        UserSessionState? session = await Context.GetSessionAsync(cancellationToken).ConfigureAwait(false);

        // The filter already turned away a session without a live account; this is the moment between its check and ours.
        if (session?.UserId is not string accountId || AccountStore.Find(accountId) is not { IsBlocked: false } account)
            return;

        Account = account;
        Apply(account);
        BuildNavigation();

        _subscription = Events.Subscribe(Receive);

        await OnAccountReadyAsync(cancellationToken).ConfigureAwait(false);
    }

    protected void Apply(AccountRecord account)
    {
        Account = account;
        DisplayName = account.Nickname;
        RoleLabel = account.IsAdmin ? "Administrator" : "Member";
        AvatarSource = account.AvatarMediaId is null ? null : MediaStore.AddressOf(account.AvatarMediaId);
        IsAdmin = account.IsAdmin;
        IsReader = !account.IsAdmin;
        AdminVisibility = account.IsAdmin ? UIVisibility.Visible : UIVisibility.Collapsed;
    }

    private void BuildNavigation()
    {
        Navigation.Clear();

        Navigation.Add(Entry(AppRoutes.Files, "Files", AppIcons.Outline(AppIcons.Files)));

        _chatEntry = Entry(AppRoutes.Chat, "Chat", AppIcons.Outline(AppIcons.Chat));
        Navigation.Add(_chatEntry);

        if (Account.IsAdmin)
            Navigation.Add(Entry(AppRoutes.Accounts, "Accounts", AppIcons.Outline(AppIcons.Accounts)));

        Navigation.Add(Entry(AppRoutes.Settings, "Settings", AppIcons.Outline(AppIcons.Settings)));

        RefreshUnread();
    }

    private MenuItem Entry(string route, string title, string icon)
        => new() { Id = route, Title = title, Icon = icon, Url = route, Selected = Context.Route.Route == route };

    /// <summary>Re-reads the chat's unread count onto the sidebar; a page that just marked messages read calls it itself.</summary>
    protected void RefreshUnread()
    {
        if (_chatEntry is null)
            return;

        var unread = ChatStore.CountUnread(AccountId);

        _chatEntry.BadgeText = unread == 0 ? null : unread.ToString(CultureInfo.InvariantCulture);
        _chatEntry.BadgeStyle = UIBadgeType.Primary;
    }

    /// <summary>Runs once the account is known; the page loads what it shows here.</summary>
    protected virtual Task OnAccountReadyAsync(CancellationToken cancellationToken)
        => Task.CompletedTask;

    /// <summary>On the publisher's thread: the base keeps the sidebar and the account current, the page adds its own.</summary>
    private void Receive(AppEvent appEvent)
    {
        switch (appEvent)
        {
            case MessagePosted or ConversationsChanged:
                Push(RefreshUnread);
                break;

            case MessagesRead read when read.AccountId == AccountId:
                Push(RefreshUnread);
                break;

            case AccountChanged changed when changed.AccountId == AccountId:
                Push(() =>
                {
                    if (changed.Kind == AccountChangeKind.Profile && AccountStore.Find(AccountId) is { } account)
                    {
                        Apply(account);
                        BuildNavigation();
                    }
                });
                break;

            default:
                break;
        }

        OnAppEvent(appEvent);
    }

    /// <summary>The page's share of an event; called on the publisher's thread, so a page answers through <see cref="Push"/>.</summary>
    protected virtual void OnAppEvent(AppEvent appEvent) { }

    /// <summary>Applies a change to this runtime from outside a command: the framework flushes it to every tab attached.</summary>
    protected void Push(Action action)
    {
        ArgumentNullException.ThrowIfNull(action);

        _ = PushAsync(action);
    }

    private async Task PushAsync(Action action)
    {
        try
        {
            _ = await Context.Runtime.InvokeAsync(action).ConfigureAwait(false);
        }
        catch (InvalidOperationException error)
        {
            // A runtime that stopped between the event and the push: nothing to show it to.
            Log.PushFailed(Context.Logger, error.Message);
        }
    }

    protected static UICommandResult Notify(string message, UIColorStyle severity = UIColorStyle.Info)
        => UICommandResult.Ok([new ShowNotificationEffect(message, severity)]);

    protected static UICommandResult Refuse(string message)
        => UICommandResult.Ok([new ShowNotificationEffect(message, UIColorStyle.Danger)]);

    [UICommand]
    public async Task<UICommandResult> SignOutAsync(CancellationToken cancellationToken)
    {
        await Context.SignOutAsync(cancellationToken).ConfigureAwait(false);

        return UICommandResult.Ok([new NavigateEffect(new UINavigationRequest { Route = AppRoutes.SignIn })]);
    }

    protected override void Dispose(bool disposing)
    {
        if (disposing)
        {
            _subscription?.Dispose();
            _subscription = null;
        }

        base.Dispose(disposing);
    }
}
