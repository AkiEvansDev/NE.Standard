using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Reflection;
using System.Runtime.CompilerServices;
using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using Microsoft.Win32;

namespace NE.Standard.UI.Desktop.Hosting;

internal sealed unsafe partial class DesktopToastNotifier : IDisposable
{
    private const int RpcEChangedMode = unchecked((int)0x80010106);
    private const int ENoInterface = unchecked((int)0x80004002);
    private const int RoInitMultithreaded = 1;
    private const int ToastDismissalReasonTimedOut = 2;
    private const int MaxRetainedToasts = 64;
    private const string AppUserModelRegistryPrefix = @"Software\Classes\AppUserModelId\";
    private const string XmlDocumentClassName = "Windows.Data.Xml.Dom.XmlDocument";
    private const string ToastNotificationClassName = "Windows.UI.Notifications.ToastNotification";
    private const string ToastNotificationManagerClassName = "Windows.UI.Notifications.ToastNotificationManager";

    private static readonly Guid IidIUnknown = new("00000000-0000-0000-C000-000000000046");
    private static readonly Guid IidIAgileObject = new("94EA2B94-E9CC-49E0-C0FF-EE64CA8F5B90");
    private static readonly Guid IidXmlDocumentIo = new("6CD0E74E-EE65-4489-9EBF-CA43E87BA637");
    private static readonly Guid IidToastNotificationFactory = new("04124B20-82C6-4229-B109-FD9ED4662B53");
    private static readonly Guid IidToastNotification2 = new("9DFB9FD1-143A-490E-90BF-B9FBA7132DE7");
    private static readonly Guid IidToastNotificationManagerStatics = new("50AC103F-D235-4598-BBEF-98FE4D1A3AD4");
    private static readonly Guid IidToastNotificationManagerStatics2 = new("7AB93C52-0E48-4750-BA9D-1A4113981847");
    private static readonly Guid IidToastDismissedEventArgs = new("3F89D935-D9CB-4538-A0F0-FFE7659938F8");
    private static readonly Guid IidActivatedHandler = new("AB54DE2D-97D9-5528-B6AD-105AFE156530");
    private static readonly Guid IidDismissedHandler = new("61C2402F-0ED0-5A18-AB69-59F4AA99A368");
    private static readonly Guid IidFailedHandler = new("95E3E803-C969-5E3A-9753-EA2AD22A9A33");
    private static readonly nint CallbackVtable = CreateCallbackVtable();

    private static string? _processAppUserModelId;

    private readonly DesktopWebHost _host;
    private readonly string _userDataFolder;
    private readonly ConcurrentDictionary<int, ActiveToast> _activeToasts = new();
    private int _nextToastId;
    private bool _registered;
    private volatile bool _disposed;

    public DesktopToastNotifier(DesktopWebHost host, string userDataFolder)
    {
        ArgumentNullException.ThrowIfNull(host);
        ArgumentException.ThrowIfNullOrWhiteSpace(userDataFolder);

        _host = host;
        _userDataFolder = userDataFolder;
        AppUserModelId = ResolveAppUserModelId(host.Options);
    }

    public string AppUserModelId { get; }

    internal string? LastFailureReason { get; private set; }

    public bool TryShow(string title, string? body, string? tag, bool silent, bool requireInteraction, Action onActivated, Action onDismissed, out Action dismiss)
    {
        ArgumentNullException.ThrowIfNull(onActivated);
        ArgumentNullException.ThrowIfNull(onDismissed);

        dismiss = static () => { };
        if (_disposed || string.IsNullOrWhiteSpace(title))
        {
            LastFailureReason = "disposed-or-empty-title";
            return false;
        }

        try
        {
            EnsureAppUserModelRegistered();
            EnsureWinRtInitialized();

            var xml = BuildToastXml(title, body, silent, requireInteraction);
            if (!TryLoadXmlDocument(xml, out var xmlDoc))
            {
                LastFailureReason = "load-xml-failed";
                return false;
            }

            var toastPtr = nint.Zero;
            var notifierPtr = nint.Zero;
            try
            {
                if (!TryCreateToastNotification(xmlDoc, out toastPtr))
                {
                    LastFailureReason = "create-toast-failed";
                    return false;
                }

                var toastId = Interlocked.Increment(ref _nextToastId);
                var explicitTag = NormalizeTag(tag);
                var effectiveTag = explicitTag ?? $"ne-{toastId}";
                SetToastTag(toastPtr, effectiveTag);

                if (explicitTag is not null)
                    RetireExistingByTag(explicitTag);

                if (!TryCreateToastNotifier(AppUserModelId, out notifierPtr))
                {
                    LastFailureReason = "create-notifier-failed";
                    return false;
                }

                if (IsNotifierBlocked(notifierPtr, out var setting))
                {
                    LastFailureReason = $"notifier-disabled:{setting}";
                    return false;
                }

                var activatedCb = CreateCallback(IidActivatedHandler, _ => CompleteToast(toastId, ToastCompletionKind.Activated, fromCallback: true));
                var dismissedCb = CreateCallback(IidDismissedHandler, args => OnToastDismissed(toastId, args));
                var failedCb = CreateCallback(IidFailedHandler, _ => CompleteToast(toastId, ToastCompletionKind.Dismissed, fromCallback: true));

                var attached = TryAttachHandlers(toastPtr, activatedCb, dismissedCb, failedCb, out var activatedToken, out var dismissedToken, out var failedToken);
                if (!attached)
                {
                    LastFailureReason = "attach-handlers-failed";
                    ReleaseCom(activatedCb);
                    ReleaseCom(dismissedCb);
                    ReleaseCom(failedCb);
                    return false;
                }

                TrimRetainedToasts();

                ActiveToast active = new(effectiveTag, AppUserModelId, toastPtr, notifierPtr, activatedCb, dismissedCb, failedCb, activatedToken, dismissedToken, failedToken, onActivated, onDismissed);
                _activeToasts[toastId] = active;

                // Ownership transferred to ActiveToast.
                toastPtr = nint.Zero;
                notifierPtr = nint.Zero;

                if (!TryShowToast(active.NotifierPtr, active.ToastPtr, out var showHr))
                {
                    LastFailureReason = $"show-failed:0x{showHr:X8}";
                    if (_activeToasts.TryRemove(toastId, out ActiveToast? failedEntry))
                        ReleaseActiveToast(failedEntry, hideFirst: false);

                    return false;
                }

                LastFailureReason = null;
                dismiss = () => CompleteToast(toastId, ToastCompletionKind.ExplicitDismiss, fromCallback: false);
                return true;
            }
            finally
            {
                ReleaseCom(notifierPtr);
                ReleaseCom(toastPtr);
                ReleaseCom(xmlDoc);
            }
        }
        catch (Exception ex)
        {
            LastFailureReason = $"exception:{ex.GetType().Name}:{ex.Message}";
            return false;
        }
    }

    public void Dispose()
    {
        if (_disposed)
            return;

        _disposed = true;
        foreach (KeyValuePair<int, ActiveToast> pair in _activeToasts)
        {
            if (_activeToasts.TryRemove(pair.Key, out ActiveToast? active))
                ReleaseActiveToast(active, hideFirst: false);
        }
    }

    internal static void UnregisterAndClearHistory(string appUserModelId)
    {
        if (string.IsNullOrWhiteSpace(appUserModelId))
            return;

        try
        {
            EnsureWinRtInitialized();
            var classId = CreateHString(ToastNotificationManagerClassName);
            try
            {
                Guid iid = IidToastNotificationManagerStatics2;
                if (RoGetActivationFactory(classId, ref iid, out var statics2) >= 0 && statics2 != nint.Zero)
                {
                    try
                    {
                        var vtbl = *(nint**)statics2;
                        delegate* unmanaged[Stdcall]<nint, out nint, int> getHistory = (delegate* unmanaged[Stdcall]<nint, out nint, int>)vtbl[6];
                        if (getHistory(statics2, out var history) >= 0 && history != nint.Zero)
                        {
                            var appHString = CreateHString(appUserModelId);
                            try
                            {
                                var histVtbl = *(nint**)history;
                                delegate* unmanaged[Stdcall]<nint, nint, int> clearWithId = (delegate* unmanaged[Stdcall]<nint, nint, int>)histVtbl[12];
                                _ = clearWithId(history, appHString);
                            }
                            finally
                            {
                                DeleteHString(appHString);
                                ReleaseCom(history);
                            }
                        }
                    }
                    finally
                    {
                        ReleaseCom(statics2);
                    }
                }
            }
            finally
            {
                DeleteHString(classId);
            }
        }
        catch
        {
            // Ignore cleanup errors on environments without notification history.
        }

        try
        {
            Registry.CurrentUser.DeleteSubKeyTree(AppUserModelRegistryPrefix + appUserModelId, throwOnMissingSubKey: false);
        }
        catch
        {
            // Ignore registry cleanup errors.
        }
    }

    private static string ResolveAppUserModelId(DesktopHostOptions options)
    {
        if (!string.IsNullOrWhiteSpace(options.AppUserModelId))
            return options.AppUserModelId.Trim();

        var entryName = Assembly.GetEntryAssembly()?.GetName().Name;
        if (string.IsNullOrWhiteSpace(entryName)
            || string.Equals(entryName, "testhost", StringComparison.OrdinalIgnoreCase)
            || entryName.StartsWith("ReSharperTestRunner", StringComparison.OrdinalIgnoreCase))
        {
            entryName = options.WindowTitle;
        }

        return "NE.Standard.Desktop." + SanitizeIdentifier(entryName);
    }

    private static string SanitizeIdentifier(string? raw)
    {
        if (string.IsNullOrWhiteSpace(raw))
            return "App";

        StringBuilder sb = new(raw.Length);
        for (var i = 0; i < raw.Length; i++)
        {
            var ch = raw[i];
            if (char.IsLetterOrDigit(ch) || ch is '.' or '_' or '-')
                _ = sb.Append(ch);
            else if (sb.Length > 0 && sb[^1] != '.')
                _ = sb.Append('.');
        }

        var cleaned = sb.ToString().Trim('.');
        return cleaned.Length == 0 ? "App" : cleaned;
    }

    private void EnsureAppUserModelRegistered()
    {
        if (_registered)
            return;

        _registered = true;

        if (Interlocked.CompareExchange(ref _processAppUserModelId, AppUserModelId, null) is null)
            _ = SetCurrentProcessExplicitAppUserModelID(AppUserModelId);

        var displayName = string.IsNullOrWhiteSpace(_host.Options.WindowTitle) ? "NE.Standard" : _host.Options.WindowTitle;
        var iconPath = DesktopIconLoader.EnsureToastIconFile(_host, _userDataFolder);

        using RegistryKey key = Registry.CurrentUser.CreateSubKey(AppUserModelRegistryPrefix + AppUserModelId, writable: true);
        key.SetValue("DisplayName", displayName, RegistryValueKind.String);
        key.SetValue("IconBackgroundColor", "00000000", RegistryValueKind.String);
        if (!string.IsNullOrWhiteSpace(iconPath) && File.Exists(iconPath))
            key.SetValue("IconUri", iconPath, RegistryValueKind.String);
        else
            key.DeleteValue("IconUri", throwOnMissingValue: false);
    }

    private static void EnsureWinRtInitialized()
    {
        var hr = RoInitialize(RoInitMultithreaded);
        if (hr is < 0 and not RpcEChangedMode)
            Marshal.ThrowExceptionForHR(hr);
    }

    private static string BuildToastXml(string title, string? body, bool silent, bool requireInteraction)
    {
        StringBuilder sb = new(256);
        _ = sb.Append(requireInteraction ? "<toast scenario=\"reminder\"><visual><binding template=\"ToastGeneric\"><text>" : "<toast><visual><binding template=\"ToastGeneric\"><text>");
        AppendSanitizedXml(sb, title);
        _ = sb.Append("</text>");

        if (!string.IsNullOrWhiteSpace(body))
        {
            _ = sb.Append("<text>");
            AppendSanitizedXml(sb, body);
            _ = sb.Append("</text>");
        }

        _ = sb.Append("</binding></visual>");
        if (silent)
            _ = sb.Append("<audio silent=\"true\"/>");

        _ = sb.Append("</toast>");
        return sb.ToString();
    }

    private static void AppendSanitizedXml(StringBuilder sb, string text)
    {
        for (var i = 0; i < text.Length; i++)
        {
            var ch = text[i];
            if (char.IsHighSurrogate(ch))
            {
                if (i + 1 < text.Length && char.IsLowSurrogate(text[i + 1]))
                    _ = sb.Append(ch).Append(text[++i]);

                continue;
            }

            if (char.IsLowSurrogate(ch))
                continue;

            if (ch is < (char)0x20 and not ('\t' or '\r' or '\n'))
                continue;

            _ = ch switch
            {
                '&' => sb.Append("&amp;"),
                '<' => sb.Append("&lt;"),
                '>' => sb.Append("&gt;"),
                '"' => sb.Append("&quot;"),
                '\'' => sb.Append("&apos;"),
                _ => sb.Append(ch)
            };
        }
    }

    private static bool TryLoadXmlDocument(string xml, out nint xmlDocInspectable)
    {
        xmlDocInspectable = nint.Zero;
        var classId = CreateHString(XmlDocumentClassName);
        var xmlHString = CreateHString(xml);
        var docIo = nint.Zero;
        try
        {
            if (RoActivateInstance(classId, out var instance) < 0 || instance == nint.Zero)
                return false;

            if (!TryQueryInterface(instance, IidXmlDocumentIo, out docIo))
            {
                ReleaseCom(instance);
                return false;
            }

            var vtbl = *(nint**)docIo;
            delegate* unmanaged[Stdcall]<nint, nint, int> loadXml = (delegate* unmanaged[Stdcall]<nint, nint, int>)vtbl[6];
            if (loadXml(docIo, xmlHString) < 0)
            {
                ReleaseCom(instance);
                return false;
            }

            xmlDocInspectable = instance;
            return true;
        }
        finally
        {
            ReleaseCom(docIo);
            DeleteHString(xmlHString);
            DeleteHString(classId);
        }
    }

    private static bool TryCreateToastNotification(nint xmlDoc, out nint toastPtr)
    {
        toastPtr = nint.Zero;
        var classId = CreateHString(ToastNotificationClassName);
        var factory = nint.Zero;
        try
        {
            Guid iid = IidToastNotificationFactory;
            if (RoGetActivationFactory(classId, ref iid, out factory) < 0 || factory == nint.Zero)
                return false;

            var vtbl = *(nint**)factory;
            delegate* unmanaged[Stdcall]<nint, nint, out nint, int> createToast = (delegate* unmanaged[Stdcall]<nint, nint, out nint, int>)vtbl[6];
            if (createToast(factory, xmlDoc, out var created) < 0 || created == nint.Zero)
                return false;

            toastPtr = created;
            return true;
        }
        finally
        {
            ReleaseCom(factory);
            DeleteHString(classId);
        }
    }

    private static string? NormalizeTag(string? rawTag)
    {
        if (string.IsNullOrWhiteSpace(rawTag))
            return null;

        var trimmed = rawTag.Trim();
        var cleanOnly = trimmed.Length <= 48;
        if (cleanOnly)
        {
            for (var i = 0; i < trimmed.Length; i++)
            {
                var ch = trimmed[i];
                if (!char.IsAsciiLetterOrDigit(ch) && ch is not ('-' or '_'))
                {
                    cleanOnly = false;
                    break;
                }
            }
        }

        if (cleanOnly)
            return trimmed;

        return "t-" + Convert.ToHexStringLower(SHA256.HashData(Encoding.UTF8.GetBytes(trimmed)))[..24];
    }

    private static void SetToastTag(nint toastPtr, string tag)
    {
        if (!TryQueryInterface(toastPtr, IidToastNotification2, out var toast2))
            return;

        var tagHString = CreateHString(tag);
        try
        {
            var vtbl = *(nint**)toast2;
            delegate* unmanaged[Stdcall]<nint, nint, int> putTag = (delegate* unmanaged[Stdcall]<nint, nint, int>)vtbl[6];
            _ = putTag(toast2, tagHString);
        }
        finally
        {
            DeleteHString(tagHString);
            ReleaseCom(toast2);
        }
    }

    private void RetireExistingByTag(string tag)
    {
        foreach (KeyValuePair<int, ActiveToast> pair in _activeToasts)
        {
            if (string.Equals(pair.Value.Tag, tag, StringComparison.Ordinal))
                CompleteToast(pair.Key, ToastCompletionKind.Dismissed, fromCallback: false);
        }
    }

    private static bool TryCreateToastNotifier(string appUserModelId, out nint notifierPtr)
    {
        notifierPtr = nint.Zero;
        var classId = CreateHString(ToastNotificationManagerClassName);
        var appIdHString = CreateHString(appUserModelId);
        var statics = nint.Zero;
        try
        {
            Guid iid = IidToastNotificationManagerStatics;
            if (RoGetActivationFactory(classId, ref iid, out statics) < 0 || statics == nint.Zero)
                return false;

            var vtbl = *(nint**)statics;
            delegate* unmanaged[Stdcall]<nint, nint, out nint, int> createWithId = (delegate* unmanaged[Stdcall]<nint, nint, out nint, int>)vtbl[7];
            if (createWithId(statics, appIdHString, out var created) < 0 || created == nint.Zero)
                return false;

            notifierPtr = created;
            return true;
        }
        finally
        {
            ReleaseCom(statics);
            DeleteHString(appIdHString);
            DeleteHString(classId);
        }
    }

    private static bool IsNotifierBlocked(nint notifierPtr, out int setting)
    {
        var vtbl = *(nint**)notifierPtr;
        delegate* unmanaged[Stdcall]<nint, out int, int> getSetting = (delegate* unmanaged[Stdcall]<nint, out int, int>)vtbl[8];
        return getSetting(notifierPtr, out setting) >= 0 && setting != 0;
    }

    private static bool TryAttachHandlers(nint toastPtr, nint activatedCb, nint dismissedCb, nint failedCb, out long activatedToken, out long dismissedToken, out long failedToken)
    {
        activatedToken = 0;
        dismissedToken = 0;
        failedToken = 0;

        var vtbl = *(nint**)toastPtr;
        delegate* unmanaged[Stdcall]<nint, nint, out long, int> addDismissed = (delegate* unmanaged[Stdcall]<nint, nint, out long, int>)vtbl[9];
        delegate* unmanaged[Stdcall]<nint, long, int> removeDismissed = (delegate* unmanaged[Stdcall]<nint, long, int>)vtbl[10];
        delegate* unmanaged[Stdcall]<nint, nint, out long, int> addActivated = (delegate* unmanaged[Stdcall]<nint, nint, out long, int>)vtbl[11];
        delegate* unmanaged[Stdcall]<nint, long, int> removeActivated = (delegate* unmanaged[Stdcall]<nint, long, int>)vtbl[12];
        delegate* unmanaged[Stdcall]<nint, nint, out long, int> addFailed = (delegate* unmanaged[Stdcall]<nint, nint, out long, int>)vtbl[13];

        if (addActivated(toastPtr, activatedCb, out var tokAct) < 0)
            return false;

        if (addDismissed(toastPtr, dismissedCb, out var tokDis) < 0)
        {
            _ = removeActivated(toastPtr, tokAct);
            return false;
        }

        if (addFailed(toastPtr, failedCb, out var tokFail) < 0)
        {
            _ = removeDismissed(toastPtr, tokDis);
            _ = removeActivated(toastPtr, tokAct);
            return false;
        }

        activatedToken = tokAct;
        dismissedToken = tokDis;
        failedToken = tokFail;
        return true;
    }

    private void TrimRetainedToasts()
    {
        while (_activeToasts.Count >= MaxRetainedToasts)
        {
            var oldestKey = int.MaxValue;
            foreach (KeyValuePair<int, ActiveToast> pair in _activeToasts)
            {
                if (pair.Key < oldestKey)
                    oldestKey = pair.Key;
            }

            if (oldestKey == int.MaxValue || !_activeToasts.ContainsKey(oldestKey))
                break;

            CompleteToast(oldestKey, ToastCompletionKind.Dismissed, fromCallback: false);
        }
    }

    private static bool TryShowToast(nint notifierPtr, nint toastPtr, out int hr)
    {
        var vtbl = *(nint**)notifierPtr;
        delegate* unmanaged[Stdcall]<nint, nint, int> show = (delegate* unmanaged[Stdcall]<nint, nint, int>)vtbl[6];
        hr = show(notifierPtr, toastPtr);
        return hr >= 0;
    }

    private void OnToastDismissed(int toastId, nint argsPtr)
    {
        // A toast whose popup timed out (or was suppressed to Notification Center by Focus Assist) stays clickable in Win+N.
        if (TryGetDismissalReason(argsPtr, out var reason) && reason == ToastDismissalReasonTimedOut)
            return;

        CompleteToast(toastId, ToastCompletionKind.Dismissed, fromCallback: true);
    }

    private static bool TryGetDismissalReason(nint argsPtr, out int reason)
    {
        reason = 0;
        if (!TryQueryInterface(argsPtr, IidToastDismissedEventArgs, out var dismissedArgs))
            return false;

        try
        {
            var vtbl = *(nint**)dismissedArgs;
            delegate* unmanaged[Stdcall]<nint, out int, int> getReason = (delegate* unmanaged[Stdcall]<nint, out int, int>)vtbl[6];
            return getReason(dismissedArgs, out reason) >= 0;
        }
        finally
        {
            ReleaseCom(dismissedArgs);
        }
    }

    private void CompleteToast(int toastId, ToastCompletionKind kind, bool fromCallback)
    {
        if (!_activeToasts.TryRemove(toastId, out ActiveToast? active))
            return;

        if (kind == ToastCompletionKind.Activated)
            active.OnActivated();
        else
            active.OnDismissed();

        var hideFirst = kind == ToastCompletionKind.ExplicitDismiss;
        if (fromCallback)
            _ = ThreadPool.QueueUserWorkItem(static state => ReleaseActiveToast((ActiveToast)state!, hideFirst: false), active);
        else
            ReleaseActiveToast(active, hideFirst);
    }

    private static void ReleaseActiveToast(ActiveToast active, bool hideFirst)
    {
        try
        {
            if (active.ToastPtr != nint.Zero)
            {
                var vtbl = *(nint**)active.ToastPtr;
                delegate* unmanaged[Stdcall]<nint, long, int> removeDismissed = (delegate* unmanaged[Stdcall]<nint, long, int>)vtbl[10];
                delegate* unmanaged[Stdcall]<nint, long, int> removeActivated = (delegate* unmanaged[Stdcall]<nint, long, int>)vtbl[12];
                delegate* unmanaged[Stdcall]<nint, long, int> removeFailed = (delegate* unmanaged[Stdcall]<nint, long, int>)vtbl[14];
                _ = removeActivated(active.ToastPtr, active.ActivatedToken);
                _ = removeDismissed(active.ToastPtr, active.DismissedToken);
                _ = removeFailed(active.ToastPtr, active.FailedToken);

                if (hideFirst)
                {
                    if (active.NotifierPtr != nint.Zero)
                    {
                        var notifierVtbl = *(nint**)active.NotifierPtr;
                        delegate* unmanaged[Stdcall]<nint, nint, int> hide = (delegate* unmanaged[Stdcall]<nint, nint, int>)notifierVtbl[7];
                        _ = hide(active.NotifierPtr, active.ToastPtr);
                    }

                    RemoveHistoryTag(active.AppUserModelId, active.Tag);
                }
            }
        }
        catch
        {
            // Ignore teardown errors if the OS notification daemon disconnected.
        }
        finally
        {
            ReleaseCom(active.ActivatedCb);
            ReleaseCom(active.DismissedCb);
            ReleaseCom(active.FailedCb);
            ReleaseCom(active.ToastPtr);
            ReleaseCom(active.NotifierPtr);
        }
    }

    private static void RemoveHistoryTag(string appUserModelId, string tag)
    {
        var classId = CreateHString(ToastNotificationManagerClassName);
        try
        {
            Guid iid = IidToastNotificationManagerStatics2;
            if (RoGetActivationFactory(classId, ref iid, out var statics2) < 0 || statics2 == nint.Zero)
                return;

            try
            {
                var vtbl = *(nint**)statics2;
                delegate* unmanaged[Stdcall]<nint, out nint, int> getHistory = (delegate* unmanaged[Stdcall]<nint, out nint, int>)vtbl[6];
                if (getHistory(statics2, out var history) < 0 || history == nint.Zero)
                    return;

                var tagHString = CreateHString(tag);
                var appHString = CreateHString(appUserModelId);
                try
                {
                    var histVtbl = *(nint**)history;
                    delegate* unmanaged[Stdcall]<nint, nint, nint, nint, int> removeGroupedTagWithId = (delegate* unmanaged[Stdcall]<nint, nint, nint, nint, int>)histVtbl[8];
                    _ = removeGroupedTagWithId(history, tagHString, nint.Zero, appHString);
                }
                finally
                {
                    DeleteHString(appHString);
                    DeleteHString(tagHString);
                    ReleaseCom(history);
                }
            }
            finally
            {
                ReleaseCom(statics2);
            }
        }
        finally
        {
            DeleteHString(classId);
        }
    }

    private static nint CreateHString(string value)
    {
        if (value.Length == 0)
            return nint.Zero;

        fixed (char* ptr = value)
        {
            var hr = WindowsCreateString((ushort*)ptr, (uint)value.Length, out var hstring);
            if (hr < 0)
                Marshal.ThrowExceptionForHR(hr);

            return hstring;
        }
    }

    private static void DeleteHString(nint hstring)
    {
        if (hstring != nint.Zero)
            _ = WindowsDeleteString(hstring);
    }

    private static bool TryQueryInterface(nint instance, Guid iid, out nint queried)
    {
        queried = nint.Zero;
        if (instance == nint.Zero)
            return false;

        var vtbl = *(nint**)instance;
        delegate* unmanaged[Stdcall]<nint, ref Guid, out nint, int> qi = (delegate* unmanaged[Stdcall]<nint, ref Guid, out nint, int>)vtbl[0];
        if (qi(instance, ref iid, out var result) < 0 || result == nint.Zero)
            return false;

        queried = result;
        return true;
    }

    private static void ReleaseCom(nint ptr)
    {
        if (ptr == nint.Zero)
            return;

        var vtbl = *(nint**)ptr;
        delegate* unmanaged[Stdcall]<nint, uint> release = (delegate* unmanaged[Stdcall]<nint, uint>)vtbl[2];
        _ = release(ptr);
    }

    private static nint CreateCallback(Guid iid, Action<nint> action)
    {
        CallbackInstance* node = (CallbackInstance*)NativeMemory.AllocZeroed((nuint)sizeof(CallbackInstance));
        node->Vtable = CallbackVtable;
        node->RefCount = 1;
        node->InterfaceId = iid;
        node->GcHandle = GCHandle.ToIntPtr(GCHandle.Alloc(action));
        return (nint)node;
    }

    private static nint CreateCallbackVtable()
    {
        var table = (nint*)RuntimeHelpers.AllocateTypeAssociatedMemory(typeof(DesktopToastNotifier), sizeof(nint) * 4);
        table[0] = (nint)(delegate* unmanaged[Stdcall]<nint, Guid*, nint*, int>)&CallbackQueryInterface;
        table[1] = (nint)(delegate* unmanaged[Stdcall]<nint, uint>)&CallbackAddRef;
        table[2] = (nint)(delegate* unmanaged[Stdcall]<nint, uint>)&CallbackRelease;
        table[3] = (nint)(delegate* unmanaged[Stdcall]<nint, nint, nint, int>)&CallbackInvoke;
        return (nint)table;
    }

    [UnmanagedCallersOnly(CallConvs = [typeof(CallConvStdcall)])]
    private static int CallbackQueryInterface(nint self, Guid* riid, nint* ppvObject)
    {
        if (ppvObject is null)
            return unchecked((int)0x80004003);

        CallbackInstance* node = (CallbackInstance*)self;
        Guid target = *riid;
        if (target == node->InterfaceId || target == IidIUnknown || target == IidIAgileObject)
        {
            _ = Interlocked.Increment(ref node->RefCount);
            *ppvObject = self;
            return 0;
        }

        *ppvObject = nint.Zero;
        return ENoInterface;
    }

    [UnmanagedCallersOnly(CallConvs = [typeof(CallConvStdcall)])]
    private static uint CallbackAddRef(nint self)
    {
        CallbackInstance* node = (CallbackInstance*)self;
        return (uint)Interlocked.Increment(ref node->RefCount);
    }

    [UnmanagedCallersOnly(CallConvs = [typeof(CallConvStdcall)])]
    private static uint CallbackRelease(nint self)
    {
        CallbackInstance* node = (CallbackInstance*)self;
        var remaining = Interlocked.Decrement(ref node->RefCount);
        if (remaining == 0)
        {
            if (node->GcHandle != nint.Zero)
                GCHandle.FromIntPtr(node->GcHandle).Free();

            NativeMemory.Free(node);
        }

        return (uint)remaining;
    }

    [UnmanagedCallersOnly(CallConvs = [typeof(CallConvStdcall)])]
    private static int CallbackInvoke(nint self, nint sender, nint args)
    {
        try
        {
            CallbackInstance* node = (CallbackInstance*)self;
            if (node->GcHandle != nint.Zero && GCHandle.FromIntPtr(node->GcHandle).Target is Action<nint> callback)
                callback(args);
        }
        catch
        {
            // Never allow managed exceptions to cross unmanaged COM frames.
        }

        return 0;
    }

    [LibraryImport("combase.dll")]
    [DefaultDllImportSearchPaths(DllImportSearchPath.System32)]
    private static partial int RoInitialize(int initType);

    [LibraryImport("combase.dll")]
    [DefaultDllImportSearchPaths(DllImportSearchPath.System32)]
    private static partial int RoActivateInstance(nint activatableClassId, out nint instance);

    [LibraryImport("combase.dll")]
    [DefaultDllImportSearchPaths(DllImportSearchPath.System32)]
    private static partial int RoGetActivationFactory(nint activatableClassId, ref Guid iid, out nint factory);

    [LibraryImport("combase.dll")]
    [DefaultDllImportSearchPaths(DllImportSearchPath.System32)]
    private static partial int WindowsCreateString(ushort* sourceString, uint length, out nint hstring);

    [LibraryImport("combase.dll")]
    [DefaultDllImportSearchPaths(DllImportSearchPath.System32)]
    private static partial int WindowsDeleteString(nint hstring);

    [LibraryImport("shell32.dll", StringMarshalling = StringMarshalling.Utf16)]
    [DefaultDllImportSearchPaths(DllImportSearchPath.System32)]
    private static partial int SetCurrentProcessExplicitAppUserModelID(string appID);

    private enum ToastCompletionKind
    {
        Activated,
        Dismissed,
        ExplicitDismiss
    }

    [StructLayout(LayoutKind.Sequential)]
    private struct CallbackInstance
    {
        public nint Vtable;
        public int RefCount;
        public Guid InterfaceId;
        public nint GcHandle;
    }

    private sealed record ActiveToast(string Tag, string AppUserModelId, nint ToastPtr, nint NotifierPtr, nint ActivatedCb, nint DismissedCb, nint FailedCb, long ActivatedToken, long DismissedToken, long FailedToken, Action OnActivated, Action OnDismissed);
}
