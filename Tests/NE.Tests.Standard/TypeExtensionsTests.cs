using NE.Standard.Extensions;

namespace NE.Tests.Standard;

public class TypeExtensionsTests
{
    private class Sample
    {
        public int Value { get; }
        public string? Text { get; }

        public Sample()
        {
            Value = -1;
        }

        public Sample(int value)
        {
            Value = value;
        }

        public Sample(string? text, int value)
        {
            Text = text;
            Value = value;
        }
    }

    [Fact]
    public void CreateInstance_UsesCorrectConstructor()
    {
        var obj1 = typeof(Sample).CreateInstance();
        Assert.IsType<Sample>(obj1);
        Assert.Equal(-1, ((Sample)obj1).Value);

        var obj2 = (Sample)typeof(Sample).CreateInstance([42]);
        Assert.Equal(42, obj2.Value);

        var obj3 = (Sample)typeof(Sample).CreateInstance(["foo", 5]);
        Assert.Equal("foo", obj3.Text);
        Assert.Equal(5, obj3.Value);
    }

    [Fact]
    public void CreateInstance_InvalidParameters_Throws()
    {
        Assert.Throws<ArgumentNullException>(() => TypeExtensions.CreateInstance(null!));
        Assert.Throws<MissingMethodException>(() => typeof(Sample).CreateInstance(["foo"]));
        Assert.Throws<MissingMethodException>(() => typeof(Sample).CreateInstance([null!, null!]));
    }

    [Fact]
    public void ResolveType_FindsTypesAndValidatesArguments()
    {
        Assert.Equal(typeof(TypeExtensions), "NE.Standard.Extensions.TypeExtensions".ResolveType());
        Assert.Equal(typeof(string), "System.String".ResolveType());

        Assert.Throws<TypeLoadException>("No.Such.Type".ResolveType);

        string? nullName = null;
        Assert.Throws<ArgumentNullException>(nullName.ResolveType);
        Assert.Throws<ArgumentNullException>("".ResolveType);
    }
}
