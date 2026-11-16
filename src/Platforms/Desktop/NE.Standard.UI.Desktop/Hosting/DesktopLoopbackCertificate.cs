using System;
using System.Net;
using System.Security.Cryptography;
using System.Security.Cryptography.X509Certificates;

namespace NE.Standard.UI.Desktop.Hosting;

/// <summary>Ephemeral self-signed loopback TLS keypair enabling HTTP/2 multiplexing between WebView2 and the in-process Kestrel host.</summary>
internal sealed class DesktopLoopbackCertificate
{
    private static readonly Lazy<DesktopLoopbackCertificate> LazyInstance = new(Create, isThreadSafe: true);

    private readonly byte[] _pfxBytes;

    private DesktopLoopbackCertificate(byte[] pfxBytes, string spkiSha256Base64)
    {
        _pfxBytes = pfxBytes;
        SpkiSha256Base64 = spkiSha256Base64;
    }

    public static DesktopLoopbackCertificate Instance => LazyInstance.Value;

    public string SpkiSha256Base64 { get; }

    public X509Certificate2 CreateServerCertificate()
        => X509CertificateLoader.LoadPkcs12(_pfxBytes, password: null);

    private static DesktopLoopbackCertificate Create()
    {
        using ECDsa key = ECDsa.Create(ECCurve.NamedCurves.nistP256);
        CertificateRequest request = new("CN=127.0.0.1", key, HashAlgorithmName.SHA256);

        request.CertificateExtensions.Add(new X509BasicConstraintsExtension(certificateAuthority: false, hasPathLengthConstraint: false, pathLengthConstraint: 0, critical: true));
        request.CertificateExtensions.Add(new X509KeyUsageExtension(X509KeyUsageFlags.DigitalSignature, critical: true));
        request.CertificateExtensions.Add(new X509EnhancedKeyUsageExtension([new Oid("1.3.6.1.5.5.7.3.1")], critical: false));

        SubjectAlternativeNameBuilder san = new();
        san.AddIpAddress(IPAddress.Loopback);
        request.CertificateExtensions.Add(san.Build());

        DateTimeOffset now = DateTimeOffset.UtcNow;
        using X509Certificate2 ephemeral = request.CreateSelfSigned(now.AddMinutes(-5), now.AddDays(366));
        var pfxBytes = ephemeral.Export(X509ContentType.Pfx);
        var spkiDer = ephemeral.PublicKey.ExportSubjectPublicKeyInfo();
        var spkiHash = Convert.ToBase64String(SHA256.HashData(spkiDer));

        return new DesktopLoopbackCertificate(pfxBytes, spkiHash);
    }
}
