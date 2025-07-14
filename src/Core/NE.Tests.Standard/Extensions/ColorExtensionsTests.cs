using NE.Standard.Extensions;
using NE.Standard.Types;
using System.Drawing;

namespace NE.Tests.Standard.Extensions;

public class ColorExtensionsTests
{
    [Fact]
    public void ToHex_ReturnsCorrectHexRepresentation()
    {
        var color = Color.FromArgb(128, 255, 100, 50);
        var hex = color.ToHex();
        Assert.Equal("#FF643280", hex);
    }

    [Theory]
    [InlineData("#FF6432", 255, 100, 50, 255)]
    [InlineData("#FF643280", 255, 100, 50, 128)]
    public void FromHex_ParsesValidHexStrings(string hex, int r, int g, int b, int a)
    {
        var color = hex.FromHex();
        Assert.Equal(Color.FromArgb(a, r, g, b), color);
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    [InlineData("   ")]
    public void FromHex_ThrowsArgumentException_OnNullOrEmpty(string? hex)
    {
        Assert.Throws<ArgumentException>(() => hex!.FromHex());
    }

    [Theory]
    [InlineData("ZZZZZZ")]
    [InlineData("12345")]
    [InlineData("#123456789")]
    public void FromHex_ThrowsFormatException_OnInvalidFormat(string hex)
    {
        Assert.Throws<FormatException>(() => hex.FromHex());
    }

    [Fact]
    public void WithAlpha_ChangesOnlyAlphaChannel()
    {
        var color = Color.FromArgb(100, 200, 150, 50);
        var newColor = color.WithAlpha(255);
        Assert.Equal(Color.FromArgb(255, 200, 150, 50), newColor);
    }

    [Theory]
    [InlineData(255, 255, 255, true)]
    [InlineData(10, 10, 10, false)]
    [InlineData(130, 130, 130, true)]
    [InlineData(100, 100, 100, false)]
    public void IsLight_EvaluatesBrightnessCorrectly(byte r, byte g, byte b, bool expected)
    {
        var color = Color.FromArgb(r, g, b);
        Assert.Equal(expected, color.IsLight());
    }

    [Fact]
    public void AdjustColor_Tint_AdjustsColorLighter()
    {
        var baseColor = Color.FromArgb(0, 100, 100);
        var adjusted = baseColor.AdjustColor(ColorAdjustment.Tint, 5);

        Assert.True(adjusted.R > baseColor.R);
        Assert.True(adjusted.G > baseColor.G);
        Assert.True(adjusted.B > baseColor.B);
        Assert.Equal(baseColor.A, adjusted.A);
    }

    [Fact]
    public void AdjustColor_Shade_AdjustsColorDarker()
    {
        var baseColor = Color.FromArgb(200, 200, 200);
        var adjusted = baseColor.AdjustColor(ColorAdjustment.Shade, 5);

        Assert.True(adjusted.R < baseColor.R);
        Assert.True(adjusted.G < baseColor.G);
        Assert.True(adjusted.B < baseColor.B);
        Assert.Equal(baseColor.A, adjusted.A);
    }

    [Theory]
    [InlineData(-1)]
    [InlineData(11)]
    public void AdjustColor_ThrowsArgumentOutOfRangeException_WhenFactorOutOfRange(int factor)
    {
        var color = Color.Red;
        Assert.Throws<ArgumentOutOfRangeException>(() => color.AdjustColor(ColorAdjustment.Tint, factor));
    }
}
