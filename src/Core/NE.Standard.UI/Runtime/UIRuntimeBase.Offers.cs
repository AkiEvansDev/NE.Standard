using System;
using System.Collections.Frozen;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Threading;
using NE.Standard.UI.Abstractions.Binding.Addresses;
using NE.Standard.UI.Shell.Commands;

namespace NE.Standard.UI.Runtime;

internal abstract partial class UIRuntimeBase
{
    // How many offered actions a runtime keeps: past it the oldest goes, its notification long closed.
    private const int MaxOffers = 32;

    private readonly Lock _offersSync = new();
    private readonly Dictionary<string, OfferedCommand> _offers = new(StringComparer.Ordinal);
    private readonly Queue<string> _offerOrder = new();

    /// <summary>
    /// Offers the page one run of a declared command, the argument handed to its one parameter by name, so a filter reads it as it
    /// reads a press's.
    /// </summary>
    string IUIReferenceResolver.OfferCommand(string command, object? argument)
    {
        ThrowIfDisposed();
        ArgumentException.ThrowIfNullOrWhiteSpace(command);

        IUICommandMetadata metadata = Controller.GetCommandMetadata(command);
        IReadOnlyDictionary<string, object?> arguments = FrozenDictionary<string, object?>.Empty;

        if (argument is not null)
        {
            arguments = metadata.Parameters.Count == 1
                ? new Dictionary<string, object?>(1, StringComparer.Ordinal) { [metadata.Parameters[0]] = argument }
                : throw new InvalidOperationException($"Command '{command}' takes {metadata.Parameters.Count} arguments; an offered action hands it one.");
        }

        // Unguessable rather than counted: the id is all that stands between a page and a run of the command.
        var id = RandomNumberGenerator.GetHexString(32, lowercase: true);

        lock (_offersSync)
        {
            // A spent id still waits its turn in the order; it removes nothing when it comes round.
            while (_offerOrder.Count >= MaxOffers)
                _ = _offers.Remove(_offerOrder.Dequeue());

            _offers.Add(id, new OfferedCommand(id, metadata.Name, arguments));
            _offerOrder.Enqueue(id);
        }

        return id;
    }

    /// <summary>Finds an offered action without spending it, refusing as unauthorised an id never offered here or spent already.</summary>
    private OfferedCommand PeekOffer(string id)
    {
        lock (_offersSync)
            return _offers.TryGetValue(id, out OfferedCommand? offered) ? offered : throw NotOffered();
    }

    /// <summary>Spends an offered action for its one run; false where another press spent it first.</summary>
    private bool TryTakeOffer(OfferedCommand offered)
    {
        lock (_offersSync)
            return _offers.Remove(offered.Id);
    }

    private static UnauthorizedAccessException NotOffered()
        => new("The action was not offered to this page, or has run already.");

    /// <summary>A command offered to the page under its id, with the arguments its run takes.</summary>
    private sealed record OfferedCommand(string Id, string Command, IReadOnlyDictionary<string, object?> Arguments);
}
