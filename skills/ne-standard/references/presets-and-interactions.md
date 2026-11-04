# Presets, Browser Interactions, and Client Effects Reference

Full guides:
- https://akievansdev.github.io/NE.Standard/extensions.html
- https://akievansdev.github.io/NE.Standard/interactions-and-effects.html

## Presets (`NE.Standard.UI.Extensions`)

Always use a preset before assembling raw containers, margins, or font sizes by hand.

| Preset Class | Key Methods & Purpose |
| --- | --- |
| `UIPage` | `Header`, `BoundHeader`, `Section`/`BoundSection`, `Heading`/`BoundHeading`, `Fold`/`BoundFold`, `Labelled`/`BoundLabelled`, `Band`, `Column(UIColumnWidth.Reading \| Form \| Wide)`, `Banner`, `Empty`/`BoundEmpty`, `Outcome`/`BoundOutcome`, `Status`/`BoundStatus` |
| `UILayout` | `Stack`, `Row` (auto-aligns button/control boxes with titled field boxes), `Columns`, `Split`, `Sidebar`, `Board`, `Ends` (start + trailing controls; icon-only trailing buttons use 4 px spacing), `Panes` (master/detail responsive layout bound to `UIPanesState`) |
| `UIButtons` | `Primary`, `Accent`, `Danger`, `Ghost`, `Outline`, `Link`, `Icon`, `Pair` (primary + cancel), `Toolbar` |
| `UIIconButtons` / `UIMenuItems` | `Add`, `Attach`, `Back`, `Cancel`, `Close`, `Copy`, `Delete`, `Done`, `Download`, `Duplicate`, `Edit`, `Filter`, `Menu`, `More`, `New`, `Open`, `Pin`, `Redo`, `Refresh`, `Remove`, `Rename`, `Save`, `Search`, `Send`, `Settings`, `Share`, `SignOut`, `Stop`, `Undo`, `Unpin`, `Upload` |
| `UIText` | `Display`, `Title`, `Subtitle`, `Body`, `Caption`, `Label`, `Note`, `Paragraph`, `Quote`/`BoundQuote`, `Person`/`BoundPerson`, `WithBadges`/`BoundWithBadges`, plus `AsDisplay`/`AsTitle`/`AsSubtitle`/`AsBody`/`AsCaption`/`AsOverline`/`Muted` |
| `UIForm` | `Field(input, hint?)`, `BoundField`, `Row(fields...)`, `Composer(textArea, attachments?, banners)` |
| `UIDetails` | `List`, `Row`, `Amount`/`BoundAmount`, `Total`/`BoundTotal` |
| `UICard` | `Create`/`BoundCreate`, `Centered` |
| `UIMessage` | `Create`/`BoundCreate`, `Info`, `Success`, `Warning`, `Danger` |
| `UIDialogs` | `Create`/`BoundCreate`, `Header`/`BoundHeader`, `Content`/`BoundContent`, `Form`/`BoundForm`, `Confirm`/`BoundConfirm`, `CloseButton(key, action)` |
| `StatePresetExtensions` | `ShownWhen`, `HiddenWhen`, `EnabledWhen`, `DisabledWhen` (target reacts to source component value in browser) |
| `ResponsivePresetExtensions` | `ShownFrom(breakpoint)`, `ShownBelow(breakpoint)` |

## Browser-Side Interactions (`Interact*`)

Interactions execute in the browser without a server round-trip:
- **Call on the target, pass the source**:
  `targetButton.EnabledWhen(sourceInput, UIComparisonOperator.Required)` or `targetPanel.ShownWhen(toggleSwitch, true)` or `targetButton.DisabledWhen(sourceInput, UIComparisonOperator.Equal, "locked")`.
- General property rule:
  `target.Interact(sourceComponentOrId, sourceProp, targetProp, UIComparisonOperator.Equal, compareValue, whenTrue, whenFalse)`.
- Live value mirror: `target.InteractCopyValue(sourceComponentOrId, targetProp)`.
- Busy states (never use a manual controller `IsBusy` property for a single command!):
  - `button.OnClickShowingLoading(nameof(Controller.Save))`
  - `button.OnSubmitShowingLoading("formId", nameof(Controller.Save))`
  - `otherComponent.ShowLoadingDuring(sourceId, EventNames.Click)`
- Per-item client effect on a menu/bar/list without a server trip:
  - `menu.OnItemClick("copy", CopyToClipboardEffect.ValueOf(codeComponent))`
  - `rowTemplate.InteractOnRow(EventNames.Click, "open-dialog", new OpenDialogEffect("details"))`

## Client Effects (`ClientEffect`)

Returned from `[UICommand]` via `UICommandResult.Ok(effect)` or triggered from interactions (`CanRunInInteraction`):
- Navigation & URL: `NavigateEffect(url)`, `NavigateBackEffect(fallbackUrl)`, `ReplaceAddressEffect(url)`, `PushAddressEffect(url)`, `ConfirmLeaveEffect(enabled)`.
- Focus & Scroll: `FocusEffect(target)`, `ScrollToEffect(target)`, `ScrollEffect(target, position)`, `ScrollToItemEffect(list, itemKey)`.
- Dialogs & Toasts: `OpenDialogEffect(key)`, `CloseDialogEffect(key)`, `ShowNotificationEffect(message, style)`, `ShowSystemNotificationEffect(title, body)`, `RequestNotificationPermissionEffect()`.
- Editing & Clipboard: `CopyToClipboardEffect.Text(str)` / `CopyToClipboardEffect.ValueOf(target)`, `InsertTextEffect(target, text)`, `RenameItemEffect(target, itemKey)`, `DiscardFormEffect(formId)`, `OpenPickerEffect(fileInput)`, `ShowImageEffect(url)`.
- Session & Theme: `SetThemeEffect(mode)`, `SetThemeColorsEffect(primary, accent)`, `SetLanguageEffect(lang)`, `DownloadFileEffect(url, fileName)`, `AnnounceEffect(message)`.
