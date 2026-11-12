using System;
using System.Collections.Generic;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Abstractions.Effects;
using NE.Standard.UI.Abstractions.Identity;
using NE.Standard.UI.Abstractions.Items;
using NE.Standard.UI.Compilation;
using NE.Standard.UI.Items;
using NE.Standard.UI.Shell.Commands;
using NE.Standard.UI.Shell.Runtime;
using NE.Standard.UI.Shell.Updates.Server;

namespace NE.Standard.UI.Runtime;

internal sealed partial class UIRuntime : IUIReferenceResolver
{
    UIComponentId IUIReferenceResolver.ResolveComponentId(string componentId)
    {
        ThrowIfDisposed();

        return View.Graph.GetRequiredComponentId(componentId);
    }

    object IUIReferenceResolver.ResolveItemsView(UIItemsView itemsView)
    {
        ThrowIfDisposed();

        return UIItemsViewResolver.Resolve(itemsView, this);
    }

    /// <summary>Refuses a command's dialog key the page's view does not declare, so the effect is dropped rather than sent to find nothing.</summary>
    void IUIReferenceResolver.EnsureDialogDeclared(string dialogKey)
    {
        ThrowIfDisposed();

        if (View.FindDialog(dialogKey) is null)
            throw new InvalidOperationException($"Controller '{Controller.GetType().Name}' names dialog '{dialogKey}', which its view does not declare.");
    }

    private ServerValueUIUpdate ResolveServerValueUpdateNoLock(ServerValueUIUpdate update)
    {
        ArgumentNullException.ThrowIfNull(update);

        var value = ResolveRuntimeValue(update.Value);

        if (ReferenceEquals(value, update.Value))
            return update;

        return new ServerValueUIUpdate
        {
            Address = update.Address,
            Value = value,
            Content = update.Content,
            ExceptInstanceId = update.ExceptInstanceId
        };
    }

    /// <summary>
    /// A bound value with its references resolved; one that fails to resolve is logged, in Development told to the pages' console,
    /// and answered as it stands — still a <see cref="IUIResolvableValue"/>, which a pushed value's queue drops rather than send raw.
    /// </summary>
    private object? ResolveRuntimeValue(object? value)
    {
        if (value is not IUIResolvableValue resolvable)
            return value;

        try
        {
            return resolvable.Resolve(this);
        }
        catch (Exception exception)
        {
            TryLog(exception, static (logger, failure) => Log.RuntimeResolutionFailed(logger, failure, "value", nameof(ResolveRuntimeValue)));

            if (_application.ReportsToPage)
                ReportToViewers($"A bound '{value.GetType().Name}' value was dropped: {exception.Message}");

            return value;
        }
    }

    /// <summary>
    /// Tells every page looking at the runtime of a failure no command answers, through the send queue; a send that fails is the
    /// dispatcher's to log, and nobody waits for it.
    /// </summary>
    private void ReportToViewers(string message)
    {
        UICommandExecutionResult report = OutsideCommand([new DevelopmentReportEffect(message)]);
        IReadOnlyList<UIHandle> viewers = ViewerHandles;

        for (var i = 0; i < viewers.Count; i++)
        {
            if (_dispatcher.EnqueueResult(this, viewers[i], report) is { } sent)
                UIChangeDelivery.Observe(sent);
        }
    }

    private UICommandResult ResolveRuntimeCommandResult(UICommandResult result)
    {
        ArgumentNullException.ThrowIfNull(result);

        return ResolveRuntimeEffects(result.Effects) is { } effects
            ? new UICommandResult(result.Success, effects, result.Error)
            : result;
    }

    /// <summary>
    /// The effects resolved, one the page could not carry out dropped (<see cref="ResolveRuntimeEffect"/>), or <see langword="null"/>
    /// where none changed, so the caller keeps what it holds.
    /// </summary>
    private ClientEffect[]? ResolveRuntimeEffects(IReadOnlyList<ClientEffect> effects)
    {
        if (effects.Count == 0)
            return null;

        ClientEffect[] resolved = new ClientEffect[effects.Count];
        var count = 0;
        var changed = false;

        for (var i = 0; i < effects.Count; i++)
        {
            if (ResolveRuntimeEffect(effects[i]) is not { } effect)
            {
                changed = true;
                continue;
            }

            resolved[count++] = effect;
            changed |= !ReferenceEquals(effects[i], effect);
        }

        if (!changed)
            return null;

        return count == resolved.Length ? resolved : resolved[..count];
    }

    /// <summary>
    /// An effect resolved against the page's view, or <see langword="null"/> for one that names what the view lacks or acts on what it
    /// cannot — dropped, logged as an error, and in Development told to the page's console in its place. The command's result stands.
    /// </summary>
    /// <remarks>Dropped rather than sent unresolved: the page would find nothing and say so only in its console, the command reported a success.</remarks>
    private ClientEffect? ResolveRuntimeEffect(ClientEffect effect)
    {
        ArgumentNullException.ThrowIfNull(effect);

        try
        {
            ClientEffect resolved = effect.Resolve(this);

            EnsureRuntimeEffectFits(effect);

            if (resolved is RenameItemEffect { ResolvedTarget: { } target } rename)
                NoteOpenedRename(target, rename.Key ?? string.Empty);

            return resolved;
        }
        catch (Exception exception) when (effect is ShowNotificationEffect)
        {
            // Its words still show, without the button: the toast is the reader's answer, its action only an offer.
            TryLog(exception, static (logger, failure) => Log.RuntimeResolutionFailed(logger, failure, "notification's action", nameof(ResolveRuntimeEffect)));
            return effect;
        }
        catch (Exception exception)
        {
            TryLog((effect.Kind, exception), static (logger, state) => Log.RuntimeEffectDropped(logger, state.exception, state.Kind, state.exception.Message));

            return _application.ReportsToPage ? new DevelopmentReportEffect($"A '{effect.Kind}' effect was dropped: {exception.Message}") : null;
        }
    }

    /// <summary>
    /// Refuses an effect aimed at a component of a kind it cannot act on (<see cref="UIEffectTargets"/>), a language switch to a
    /// language the application does not translate into, which the page's own report of it would be refused for, an insert of the
    /// pressed row's key, which only an interaction has a press for, and a picture named in a row by fewer keys than the row's, which
    /// the page would read off the first row.
    /// </summary>
    private void EnsureRuntimeEffectFits(ClientEffect effect)
    {
        if (effect is SetLanguageEffect language && !_application.Translator.HasLanguage(language.Language))
            throw new InvalidOperationException($"Language '{language.Language}' is not one the application translates into.");

        if (effect is InsertTextEffect { Text: null })
            throw new InvalidOperationException("An insert of the pressed row's key runs in an interaction: a command's answer comes from no row's press. Insert the key as text.");

        if (effect is ShowImageEffect { Target: { } picture } && View.Graph.TryGetComponentId(picture.Id, out UIComponentId pictureId)
            && picture.DynamicParameters.Length < View.Graph.GetItemScopes(pictureId).Count)
        {
            throw new InvalidOperationException($"Component '{picture.Id}' stands in a row, which the picture names by fewer keys than the row's: pass the row's keys to ShowImageEffect.Of.");
        }

        if (effect is TargetedClientEffect targeted && View.Graph.TryGetComponentId(targeted.Target.Id, out UIComponentId componentId))
            UIEffectTargets.EnsureFits(effect, targeted.Target.Id, View.Graph.GetRequired(componentId).TypeKey);
    }
}
