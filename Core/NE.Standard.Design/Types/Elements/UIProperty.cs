using NE.Standard.Serialization;
using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace NE.Standard.Design.Types.Elements
{
    /// <summary>
    /// Base class for all UI properties. A property exposes a value that can be
    /// bound to a back end. The <see cref="Path"/> property can be used by
    /// consumers to bind the value to a data context.
    /// </summary>
    public abstract class UIProperty : UIElement
    {
        /// <summary>
        /// Display name of the property.
        /// </summary>
        public string? Label { get; set; }

        /// <summary>
        /// Display description of the property.
        /// </summary>
        public string? Description { get; set; }

        /// <summary>
        /// Optional path used for data binding with a back end view model.
        /// </summary>
        public string? Path { get; set; }

        /// <summary>
        /// Value of the property.
        /// value which maps to this member.
        /// </summary>
        public object? Value { get; set; }

        /// <summary>
        /// Can value edit by user.
        /// </summary>
        public bool Editable { get; set; } = true;

        /// <summary>
        /// Is property enabled.
        /// </summary>
        public bool Enabled { get; set; } = true;
    }

    /// <summary>
    /// Generic base class that provides a strongly typed value.
    /// </summary>
    public abstract class UIProperty<T> : UIProperty
    {
        public Type Type => typeof(T);
    }

    /// <summary>
    /// Property representing a numeric value (int or double).
    /// </summary>
    [ObjectSerializable]
    public class NumberProperty : UIProperty<double>
    {
        public bool IsInteger { get; set; }
        public double? Min { get; set; }
        public double? Max { get; set; }
    }

    /// <summary>
    /// Property representing a string value.
    /// </summary>
    [ObjectSerializable]
    public class StringProperty : UIProperty<string>
    {
        public bool Multiline { get; set; }
    }

    /// <summary>
    /// Property representing a selectable list of values.
    /// </summary>
    [ObjectSerializable]
    public class SelectProperty : UIProperty<string>
    {
        public Dictionary<string, string>? Items { get; set; }
        public bool AllowInput { get; set; }
    }

    /// <summary>
    /// Property representing a date value.
    /// </summary>
    [ObjectSerializable]
    public class DateProperty : UIProperty<DateTime>
    {
        public DateTime? Min { get; set; }
        public DateTime? Max { get; set; }
    }

    /// <summary>
    /// Property representing a time value.
    /// </summary>
    [ObjectSerializable]
    public class TimeProperty : UIProperty<TimeSpan>
    {
        public TimeSpan? Min { get; set; }
        public TimeSpan? Max { get; set; }
    }

    /// <summary>
    /// Property representing a boolean value.
    /// </summary>
    [ObjectSerializable]
    public class BoolProperty : UIProperty<bool>
    {
    }

    /// <summary>
    /// Property representing a file path.
    /// </summary>
    [ObjectSerializable]
    public class FileProperty : UIProperty<string>
    {
        public string? FilteredExtensions { get; set; }
    }

    /// <summary>
    /// Property that contains a list of sub properties.
    /// </summary>
    [ObjectSerializable]
    public class ButtonProperty : UIProperty
    {
        public UIPage? SubPage { get; set; }
    }
}
