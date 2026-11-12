# Changelog

Each section below becomes the GitHub release body for that tag and is removed from this file after the release is cut; published history lives on the [Releases page](https://github.com/AkiEvansDev/NE.Standard/releases).

## 2.7.1

- **Contour clip reach for field-mode switchers and flyout anchors**: `LayoutClipReachRenderer` now emits `data-ui-clip-reach="contour"` for unpadded `ContainerComponent`, `StackPanelComponent`, and `WrapPanelComponent` layouts (such as `UIForm.Row` and `UIForm.Field`) hosting a static `LanguageSwitcherComponent` or `ThemeSwitcherComponent` in `UISwitcherVariant.Field` mode or a `FlyoutComponent` anchor control, preserving the `2 px` focus ring instead of clipping it at `overflow: clip`, with matching `"standard.*"` overflow reach detection in `WpfSurfaceStyleHelper`.
- **Squircle Web corners and concentric segmented capsules**: switched all non-circular/pill rounded Web corners to `corner-shape: squircle` (`@ui-corner-shape` in `core/tokens.less` and `.ui-authored-border()`) to eliminate `1 dppx` dark-mode `45°` border dimming while keeping `50%` circles and `999px` pills `round`, and widened `ButtonGroupComponent` and `ColorInputComponent`'s mode switcher frames to `ButtonRadius + 2 px` (`squircle`) with `ButtonRadius - border` (`superellipse(1.5)`) inner segments so the `2 px` channel stays concentric.
