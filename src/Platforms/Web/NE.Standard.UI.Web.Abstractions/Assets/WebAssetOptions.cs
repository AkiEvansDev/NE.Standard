using System;

namespace NE.Standard.UI.Web.Abstractions.Assets;

public sealed class WebAssetOptions
{
    public string? DistDirectory { get; set; }

    public string ClientPath { get; set; } = "Client";

    public string DistPath { get; set; } = "Client/dist";

    public bool PreferPackagedAssets { get; set; }

    public void Validate()
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(ClientPath);
        ArgumentException.ThrowIfNullOrWhiteSpace(DistPath);
    }
}
