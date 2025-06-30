using NE.Standard.IO;

namespace NE.Tests.Standard;

public class FileWorkHelperTests
{
    [Fact]
    public void Create_WritesFile()
    {
        string dir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        string path = Path.Combine(dir, "test.txt");
        FileWorkHelper.Create(path, "hello");
        Assert.True(File.Exists(path));
        Assert.Equal("hello", File.ReadAllText(path));
        Directory.Delete(dir, true);
    }

    [Fact]
    public void Update_ModifiesExistingFile()
    {
        string dir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        string path = Path.Combine(dir, "test.txt");
        FileWorkHelper.Create(path, "one");
        FileWorkHelper.Update(path, "two");
        Assert.Equal("two", File.ReadAllText(path));
        Directory.Delete(dir, true);
    }

    [Fact]
    public void Read_ReturnsContent()
    {
        string dir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        string path = Path.Combine(dir, "test.txt");
        FileWorkHelper.Create(path, "text");
        string result = FileWorkHelper.Read(path);
        Assert.Equal("text", result);
        Directory.Delete(dir, true);
    }

    [Fact]
    public void Delete_RemovesFile()
    {
        string dir = Path.Combine(Path.GetTempPath(), Guid.NewGuid().ToString());
        string path = Path.Combine(dir, "test.txt");
        FileWorkHelper.Create(path, "x");
        FileWorkHelper.Delete(path);
        Assert.False(File.Exists(path));
        Directory.Delete(dir, true);
    }
}
