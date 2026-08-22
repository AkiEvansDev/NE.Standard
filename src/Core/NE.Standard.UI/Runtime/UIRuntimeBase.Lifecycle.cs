using System;
using System.Threading;
using System.Threading.Tasks;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    /// <inheritdoc />
    public async Task InitializeAsync(CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();

        await _initializeLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            if (IsInitialized)
                throw new InvalidOperationException("Runtime is already initialized.");

            if (IsStarted)
                throw new InvalidOperationException("Runtime is already started.");

            try
            {
                await Controller.InitializeAsync(cancellationToken).ConfigureAwait(false);

                await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
                try
                {
                    DiscardControllerChangesNoLock();
                    ClearPendingUpdatesNoLock();

                    IsInitialized = true;
                }
                finally
                {
                    _ = _stateLock.Release();
                }
            }
            catch (OperationCanceledException) when (cancellationToken.IsCancellationRequested)
            {
                throw;
            }
            catch (Exception exception)
            {
                _ = await HandleRuntimeExceptionAsync(
                    exception,
                    "Initialize",
                    commandRequest: null,
                    clientChangeSet: null,
                    cancellationToken
                ).ConfigureAwait(false);

                throw;
            }
        }
        finally
        {
            _ = _initializeLock.Release();
        }
    }

    /// <inheritdoc />
    public async Task StartAsync(CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();
        EnsureInitialized();

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            if (IsStarted)
                throw new InvalidOperationException("Runtime is already started.");

            if (IsStopped)
                throw new InvalidOperationException("Runtime was already stopped.");

            IsStarted = true;
            OnStartedNoLock();
        }
        finally
        {
            _ = _stateLock.Release();
        }
    }

    private void EnsureInitialized()
    {
        if (!IsInitialized)
            throw new InvalidOperationException("Runtime is not initialized.");
    }

    /// <inheritdoc />
    public async Task StopAsync(CancellationToken cancellationToken = default)
    {
        ThrowIfDisposed();

        await _stateLock.WaitAsync(cancellationToken).ConfigureAwait(false);
        try
        {
            if (IsStopped)
                return;

            OnStoppingNoLock();
            IsStopped = true;
        }
        finally
        {
            _ = _stateLock.Release();
        }
    }

    private void EnsureStarted()
    {
        if (!IsStarted)
            throw new InvalidOperationException("Runtime is not started.");

        if (IsStopped)
            throw new InvalidOperationException("Runtime is stopped.");
    }
}
