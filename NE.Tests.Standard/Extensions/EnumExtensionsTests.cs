using NE.Standard.Extensions;
using System.ComponentModel;

namespace NE.Tests.Standard.Extensions;

public enum SampleEnum
{
    [Description("First Value Description")]
    First,

    [Description("Second Value Description")]
    Second,

    Third
}

public class EnumExtensionsTests
{
    [Fact]
    public void GetName_ReturnsCorrectEnumName()
    {
        var value = SampleEnum.First;
        var name = value.GetName();
        Assert.Equal("First", name);
    }

    [Fact]
    public void GetNames_ReturnsAllNames()
    {
        var value = SampleEnum.First;
        var names = value.GetNames();

        Assert.Contains("First", names);
        Assert.Contains("Second", names);
        Assert.Contains("Third", names);
        Assert.Equal(3, names.Length);
    }

    [Fact]
    public void GetValues_ReturnsAllEnumValues()
    {
        var values = EnumExtensions.GetValues<SampleEnum>().ToList();

        Assert.Equal(3, values.Count);
        Assert.Contains(SampleEnum.First, values);
        Assert.Contains(SampleEnum.Second, values);
        Assert.Contains(SampleEnum.Third, values);
    }

    [Fact]
    public void GetAttribute_ReturnsCustomAttribute_WhenPresent()
    {
        var attribute = SampleEnum.First.GetAttribute<DescriptionAttribute>();
        Assert.NotNull(attribute);
        Assert.Equal("First Value Description", attribute.Description);
    }

    [Fact]
    public void GetAttribute_ReturnsNull_WhenNotPresent()
    {
        var attribute = SampleEnum.Third.GetAttribute<DescriptionAttribute>();
        Assert.Null(attribute);
    }

    [Fact]
    public void GetDescription_ReturnsDescription_WhenPresent()
    {
        var description = SampleEnum.Second.GetDescription();
        Assert.Equal("Second Value Description", description);
    }

    [Fact]
    public void GetDescription_ReturnsNull_WhenNoDescriptionPresent()
    {
        var description = SampleEnum.Third.GetDescription();
        Assert.Null(description);
    }

    [Fact]
    public void GetDescriptions_ReturnsDescriptionsDictionary()
    {
        var dict = EnumExtensions.GetDescriptions<SampleEnum>();

        Assert.Equal(3, dict.Count);
        Assert.Equal("First Value Description", dict[SampleEnum.First]);
        Assert.Equal("Second Value Description", dict[SampleEnum.Second]);
        Assert.Null(dict[SampleEnum.Third]);
    }
}
