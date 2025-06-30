using System.ComponentModel;
using NE.Standard.Extensions;

namespace NE.Tests.Standard;

enum SampleEnum
{
    [Description("First value")]
    First,
    Second
}

public class EnumExtensionsTests
{
    [Fact]
    public void GetName_ReturnsName()
    {
        Assert.Equal("First", SampleEnum.First.GetName());
    }

    [Fact]
    public void GetNames_ReturnsAllNames()
    {
        var names = SampleEnum.First.GetNames();
        Assert.Equal(new[]{"First","Second"}, names);
    }

    [Fact]
    public void GetValues_ReturnsAllValues()
    {
        var values = SampleEnum.First.GetValues<SampleEnum>();
        Assert.Equal(new[]{SampleEnum.First, SampleEnum.Second}, values);
    }

    [Fact]
    public void GetAttribute_ReturnsAttribute()
    {
        var attr = SampleEnum.First.GetAttribute<DescriptionAttribute>();
        Assert.Equal("First value", attr.Description);
    }
}
