using System.ComponentModel;

namespace NE.Standard.Design.Types
{
    public enum ColorKey
    {
        [Description("Silver Night")]
        SilverNight = 0,
        [Description("Crimson Red")]
        CrimsonRed = 1,
        [Description("Tropical Rain Forest")]
        TropicalRainForest = 2,
        [Description("Eucalyptus")]
        Eucalyptus = 3,
        [Description("Celadon")]
        Celadon = 4,
        [Description("Harlequin Green")]
        HarlequinGreen = 5,
        [Description("Pale Violet")]
        PaleViolet = 6,
        [Description("Shocking Pink")]
        ShockingPink = 7,
        [Description("Chinese Pink")]
        ChinesePink = 8,
        [Description("Ripe Mango")]
        RipeMango = 9,
        [Description("Blue Eyes")]
        BlueEyes = 10,
        [Description("Philippine Orange")]
        PhilippineOrange = 11,
        [Description("Absolute Zero")]
        AbsoluteZero = 12,
        [Description("Calamansi")]
        Calamansi = 13,
        [Description("Vivid Cerulean")]
        VividCerulean = 14,
    }

    public enum FactorType
    {
        Color = 0,
        Shade = 1,
        Tint = 2,
    }

    public enum Alignment 
    { 
        Start, 
        Center, 
        End, 
        Stretch 
    }

    public enum BindingType
    {
        TwoWay,
        OneWayToSource
    }

    public enum ValidationType
    {
        Required,
        Equals,
        GreaterThanOrEqual,
        LessThanOrEqual,
        Like,
        In,
        Regax
    }

    public enum SyncMode
    {
        None,
        Immediate,
        Batched,
        Debounced
    }

    public enum NotificationType
    {
        Message,
        Warning,
        Error
    }

    public enum NotificationDisplayType
    {
        Manual,
        Timeout
    }
}
