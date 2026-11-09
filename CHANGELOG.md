# Changelog

Each section below becomes the GitHub release body for that tag and is removed from this file after the release is cut; published history lives on the [Releases page](https://github.com/AkiEvansDev/NE.Standard/releases).

## 2.6.3

- **Popup click isolation inside `<label class="ui-text-input">`**: Clicking an option or non-input list area inside an open `SelectComponent` / `MultiSelectComponent` (`SelectInteractionEngine`) or a non-link entry inside an open `SplitButtonComponent` menu (`SplitButtonEngine`) calls `preventDefault()`, preventing an enclosing `<label class="ui-text-input">` (such as a `TextInputComponent` or `TextAreaComponent` hosting a trailing `UIMultiSelectVariant.Button` or `SplitButtonComponent`) from synthesizing a click on its `<input>` and dismissing the popup after the first selection.
