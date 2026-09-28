using System;
using System.Globalization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using TeamRoom.Data;
using TeamRoom.Services;

namespace TeamRoom.Controllers;

/// <summary>
/// What every signed-in page has: the account behind the session, the sidebar with the chat's unread count on it, and an
/// ear on the application's events that pushes what it hears into this runtime.
/// </summary>
public abstract partial class TeamRoomController : UIControllerBase
{
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

    /// <summary>The sidebar: built again when the role changes, since the administrators' entry comes and goes with it.</summary>
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

    /// <summary>
    /// On the publisher's thread: decides whether the event concerns this account and queues the work, which runs later on this
    /// runtime; the base keeps the sidebar and the account current, the page adds its own.
    /// </summary>
    /// <remarks>
    /// A block or a deletion needs nothing here: <see cref="IUISessions"/> ends the account's sessions, which sends their pages to
    /// sign in and ends their runtimes, this one included.
    /// </remarks>
    private void Receive(AppEvent appEvent)
    {
        switch (appEvent)
        {
            // The author's own message moves nobody's count but the readers'.
            case MessagePosted posted when posted.AuthorId != AccountId && posted.Reaches(AccountId):
                Push(RefreshUnread);
                break;

            case MessageDeleted deleted when deleted.Reaches(AccountId):
                Push(RefreshUnread);
                break;

            case MessagesRead read when read.AccountId == AccountId:
                Push(RefreshUnread);
                break;

            case AccountChanged { Kind: AccountChangeKind.Profile } changed when changed.AccountId == AccountId:
                Push(() =>
                {
                    if (AccountStore.Find(AccountId) is { } account)
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

    /// <summary>The page's share of an event; called on the publisher's thread, so a page answers through <see cref="Push(Action)"/>.</summary>
    protected virtual void OnAppEvent(AppEvent appEvent) { }

    /// <summary>
    /// Applies a change to this runtime from outside a command: posted through <c>Context.Runtime.Post</c>, which runs it on the
    /// thread pool after every earlier post, and flushed by the framework to every tab attached.
    /// </summary>
    protected void Push(Action action)
    {
        ArgumentNullException.ThrowIfNull(action);

        Push(_ =>
        {
            action();
            return Task.CompletedTask;
        });
    }

    /// <summary>
    /// The asynchronous form of <see cref="Push(Action)"/>, for work that reads a window. Posts run in the order they were made,
    /// so a message deleted just after it was posted is never dropped before it is appended.
    /// </summary>
    protected void Push(Func<CancellationToken, Task> action)
    {
        ArgumentNullException.ThrowIfNull(action);

        Context.Runtime.Post(action);
    }

    /// <summary>
    /// Sends this page elsewhere from outside a command, after whatever was pushed before it — every tab of it, since the
    /// runtime is shared by the client's tabs.
    /// </summary>
    protected void Go(string route)
        => Push(cancellationToken => Context.SendEffectsToAllAsync([new NavigateEffect(new UINavigationRequest { Route = route })], cancellationToken));

    protected static UICommandResult Notify(string message, UIColorStyle severity = UIColorStyle.Info)
        => UICommandResult.Ok([new ShowNotificationEffect(message, severity)]);

    protected static UICommandResult Refuse(string message)
        => UICommandResult.Ok([new ShowNotificationEffect(message, UIColorStyle.Danger)]);

    /// <summary>
    /// Signs out: the framework ends the session everywhere and sends every other page to sign in, the tabs sharing this runtime
    /// included. This runtime stays to finish the answer, and until its retention runs out; it stops hearing events meanwhile.
    /// </summary>
    [UICommand]
    public async Task<UICommandResult> SignOutAsync(CancellationToken cancellationToken)
    {
        await Context.SignOutAsync(cancellationToken).ConfigureAwait(false);

        _subscription?.Dispose();
        _subscription = null;

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
