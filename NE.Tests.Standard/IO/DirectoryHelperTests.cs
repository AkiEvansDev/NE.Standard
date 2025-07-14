using NE.Standard.IO;

namespace NE.Tests.Standard.IO;

public class DirectoryHelperTests : IDisposable
{
    private readonly string _rootDir;

    public DirectoryHelperTests()
    {
        _rootDir = Path.Combine(Path.GetTempPath(), "DirectoryHelperTests_" + Guid.NewGuid());
        Directory.CreateDirectory(_rootDir);
    }

    [Fact]
    public void Create_CreatesDirectory()
    {
        var path = Path.Combine(_rootDir, "newDir");
        DirectoryHelper.Create(path);
        Assert.True(Directory.Exists(path));
    }

    [Fact]
    public void Delete_RemovesDirectory()
    {
        var path = Path.Combine(_rootDir, "toDelete");
        Directory.CreateDirectory(path);
        DirectoryHelper.Delete(path);
        Assert.False(Directory.Exists(path));
    }

    [Fact]
    public void Copy_CopiesDirectoryContent()
    {
        var source = Path.Combine(_rootDir, "source");
        var dest = Path.Combine(_rootDir, "dest");
        Directory.CreateDirectory(source);
        File.WriteAllText(Path.Combine(source, "file.txt"), "content");

        DirectoryHelper.Copy(source, dest);

        Assert.True(File.Exists(Path.Combine(dest, "file.txt")));
        Assert.Equal("content", File.ReadAllText(Path.Combine(dest, "file.txt")));
    }

    [Fact]
    public void Move_MovesDirectory()
    {
        var source = Path.Combine(_rootDir, "moveSource");
        var dest = Path.Combine(_rootDir, "moveDest");
        Directory.CreateDirectory(source);
        File.WriteAllText(Path.Combine(source, "data.txt"), "abc");

        DirectoryHelper.Move(source, dest);

        Assert.False(Directory.Exists(source));
        Assert.True(Directory.Exists(dest));
        Assert.True(File.Exists(Path.Combine(dest, "data.txt")));
    }

    [Fact]
    public void Search_ReturnsMatchingFiles()
    {
        var dir = Path.Combine(_rootDir, "searchDir");
        Directory.CreateDirectory(dir);
        File.WriteAllText(Path.Combine(dir, "match.txt"), "hit");
        File.WriteAllText(Path.Combine(dir, "nomatch.log"), "miss");

        var matches = DirectoryHelper.Search(dir, "*.txt").ToList();
        Assert.Single(matches);
        Assert.EndsWith("match.txt", matches[0]);
    }

    public void Dispose()
    {
        if (Directory.Exists(_rootDir))
            Directory.Delete(_rootDir, true);

        GC.SuppressFinalize(this);
    }
}
