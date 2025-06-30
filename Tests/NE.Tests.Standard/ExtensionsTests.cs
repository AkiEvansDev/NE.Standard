using System;
using System.Collections.Generic;
using NE.Standard.Extensions;
using Xunit;

namespace NE.Tests.Standard
{
    public class ExtensionsTests
    {
        [Fact]
        public void UniqueFrom_AppendsIncrement_WhenValueExists()
        {
            var existing = new List<string> { "Name", "name#1" };

            string result = "name".UniqueFrom(existing);

            Assert.Equal("name#2", result);
        }

        [Fact]
        public void AddOrUpdate_AddsAndUpdatesValues()
        {
            var dict = new Dictionary<string, int> { ["a"] = 1 };

            dict.AddOrUpdate("a", 2);
            dict.AddOrUpdate("b", 3);

            Assert.Equal(2, dict["a"]);
            Assert.Equal(3, dict["b"]);
        }

        [Fact]
        public void TrimMilliseconds_RemovesMilliseconds()
        {
            var date = new DateTime(2024, 1, 2, 3, 4, 5, 123);

            var trimmed = date.TrimMilliseconds();

            Assert.Equal(0, trimmed.Millisecond);
        }

        [Fact]
        public void WhereNotNull_FiltersNullableValueTypes()
        {
            int?[] data = { 1, null, 2 };

            var result = data.WhereNotNull();

            Assert.Equal(new[] { 1, 2 }, result);
        }
    }
}
