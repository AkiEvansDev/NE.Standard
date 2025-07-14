using NE.Standard.Extensions;

namespace NE.Tests.Standard.Extensions;

public class Dummy
{
    public string Message { get; }
    public Dummy() => Message = "default";
    public Dummy(string message) => Message = message;
}

public class TypeExtensionsTests
{
    [Fact]
    public void CreateInstance_WithoutParameters_CreatesObject()
    {
        var type = typeof(Dummy);
        var instance = (Dummy)type.CreateInstance();
        Assert.NotNull(instance);
        Assert.Equal("default", instance.Message);
    }

    [Fact]
    public void CreateInstance_WithParameters_CreatesObject()
    {
        var type = typeof(Dummy);
        var instance = (Dummy)type.CreateInstance(["custom"]);
        Assert.Equal("custom", instance.Message);
    }

    [Fact]
    public void CreateInstance_ThrowsForNullType()
    {
        Assert.Throws<ArgumentNullException>(() => ((Type)null!).CreateInstance());
    }

    [Fact]
    public void CreateInstance_ThrowsForMismatchedConstructor()
    {
        var type = typeof(Dummy);
        Assert.Throws<MissingMethodException>(() => type.CreateInstance([123]));
    }

    [Fact]
    public void ResolveType_ReturnsCorrectType()
    {
        var fullName = typeof(Dummy).FullName;
        var resolved = fullName!.ResolveType();
        Assert.Equal(typeof(Dummy), resolved);
    }

    [Fact]
    public void ResolveType_ThrowsForUnknown()
    {
        Assert.Throws<TypeLoadException>(() => "Unknown.Type.NotFound".ResolveType());
    }

    [Fact]
    public void ResolveType_ThrowsForNull()
    {
        Assert.Throws<ArgumentNullException>(() => ((string)null!).ResolveType());
    }
}
