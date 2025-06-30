using System;
using System.ComponentModel;

namespace NE.Standard.Types
{
    public enum Keys
    {
        [Description("None")]
        None = 0,

        [Description("0")]
        D0 = 0x30,
        [Description("1")]
        D1 = 0x31,
        [Description("2")]
        D2 = 0x32,
        [Description("3")]
        D3 = 0x33,
        [Description("4")]
        D4 = 0x34,
        [Description("5")]
        D5 = 0x35,
        [Description("6")]
        D6 = 0x36,
        [Description("7")]
        D7 = 0x37,
        [Description("8")]
        D8 = 0x38,
        [Description("9")]
        D9 = 0x39,

        [Description("A")]
        A = 0x41,
        [Description("B")]
        B = 0x42,
        [Description("C")]
        C = 0x43,
        [Description("D")]
        D = 0x44,
        [Description("E")]
        E = 0x45,
        [Description("F")]
        F = 0x46,
        [Description("G")]
        G = 0x47,
        [Description("H")]
        H = 0x48,
        [Description("I")]
        I = 0x49,
        [Description("J")]
        J = 0x4A,
        [Description("K")]
        K = 0x4B,
        [Description("L")]
        L = 0x4C,
        [Description("M")]
        M = 0x4D,
        [Description("N")]
        N = 0x4E,
        [Description("O")]
        O = 0x4F,
        [Description("P")]
        P = 0x50,
        [Description("Q")]
        Q = 0x51,
        [Description("R")]
        R = 0x52,
        [Description("S")]
        S = 0x53,
        [Description("T")]
        T = 0x54,
        [Description("U")]
        U = 0x55,
        [Description("V")]
        V = 0x56,
        [Description("W")]
        W = 0x57,
        [Description("X")]
        X = 0x58,
        [Description("Y")]
        Y = 0x59,
        [Description("Z")]
        Z = 0x5A,

        [Description("Space")]
        Space = 0x20,
        [Description("Enter")]
        Enter = 0x0D,
        [Description("Delete")]
        Delete = 0x2E,
        [Description("Backspace")]
        Backspace = 0x08,
        [Description("Tab")]
        Tab = 0x09,
        [Description("CapsLock")]
        CapsLock = 0x14,

        [Description("Left Shift")]
        LeftShift = 0xA0,
        [Description("Left Control")]
        LeftControl = 0xA2,
        [Description("Left Alt")]
        LeftAlt = 0xA4,
        [Description("Left Win")]
        LeftWin = 0x5B,
        [Description("Right Shift")]
        RightShift = 0xA1,
        [Description("Right Control")]
        RightControl = 0xA3,
        [Description("Right Alt")]
        RightAlt = 0xA5,
        [Description("Right Win")]
        RightWin = 0x5C,

        [Description("Arrow Down")]
        ArrowDown = 0x28,
        [Description("Arrow Up")]
        ArrowUp = 0x26,
        [Description("Arrow Left")]
        ArrowLeft = 0x25,
        [Description("Arrow Right")]
        ArrowRight = 0x27,

        [Description("- _")]
        Minus = 0xBD,
        [Description("= +")]
        Plus = 0xBB,
        [Description(", <")]
        Comma = 0xBC,
        [Description(". >")]
        Period = 0xBE,

        [Description("; :")]
        Oem1 = 0xBA,
        [Description("/ ?")]
        Oem2 = 0xBF,
        [Description("` ~")]
        Oem3 = 0xC0,
        [Description("[ {")]
        Oem4 = 0xDB,
        [Description("\\ |")]
        Oem5 = 0xDC,
        [Description("] }")]
        Oem6 = 0xDD,
        [Description("' \"")]
        Oem7 = 0xDE,

        [Description("Esc")]
        Esc = 0x1B,
        [Description("F1")]
        F1 = 0x70,
        [Description("F2")]
        F2 = 0x71,
        [Description("F3")]
        F3 = 0x72,
        [Description("F4")]
        F4 = 0x73,
        [Description("F5")]
        F5 = 0x74,
        [Description("F6")]
        F6 = 0x75,
        [Description("F7")]
        F7 = 0x76,
        [Description("F8")]
        F8 = 0x77,
        [Description("F9")]
        F9 = 0x78,
        [Description("F10")]
        F10 = 0x79,
        [Description("F11")]
        F11 = 0x7A,
        [Description("F12")]
        F12 = 0x7B,
    }

    [Flags]
    public enum KeyModifiers
    {
        [Description("None")]
        None = 0,
        [Description("Control")]
        Control = 1,
        [Description("Alt")]
        Alt = 2,
        [Description("Shift")]
        Shift = 4,
        [Description("Win")]
        Win = 8,
    }

    public enum MouseButtonType
    {
        [Description("None")]
        None = 0,
        [Description("Left")]
        Left = 1,
        [Description("Middle")]
        Middle = 2,
        [Description("Right")]
        Right = 3,
    }

    public enum MouseEventType
    {
        [Description("None")]
        None = 0,
        [Description("Mouse Down")]
        MouseDown = 1,
        [Description("Mouse Up")]
        MouseUp = 2,
        [Description("Mouse Move")]
        MouseMove = 3,
        [Description("Mouse Wheel")]
        MouseWheel = 4,
        [Description("Double Click")]
        DoubleClick = 5,
    }

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
}
