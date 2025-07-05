using NE.Standard.Design.Styles;
using System.Drawing;

namespace NE.Tests.Standard;

public class ColorPathTests
{
    [Fact]
    public void GetColor_ParsesSixDigitHex()
    {
        var color = ColorPath.GetColor("FF0000");
        Assert.Equal(Color.FromArgb(255, 255, 0, 0), color);
    }

    [Fact]
    public void GetColor_ParsesEightDigitHex()
    {
        var color = ColorPath.GetColor("80FF0000");
        Assert.Equal(Color.FromArgb(128, 255, 0, 0), color);
    }

    [Fact]
    public void GetColor_ShadeAppliesFactor()
    {
        var color = ColorPath.GetColor("FFFFFF", FactorType.Shade, 5);
        Assert.Equal(Color.FromArgb(255, 128, 128, 128), color);
    }

    [Fact]
    public void GetColor_TintAppliesFactor()
    {
        var color = ColorPath.GetColor("000000", FactorType.Tint, 5);
        Assert.Equal(Color.FromArgb(255, 128, 128, 128), color);
    }
}
