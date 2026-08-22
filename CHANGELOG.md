# Changelog

The framework's changelog — the `core` slice. One section per release, headed `## X.Y.Z`; the tag that carries
it is `core/vX.Y.Z`. Every package in the slice carries the same version and goes out together, so a section
describes the release, not a list of packages that moved. Other slices keep their own — the icon sets are in
`addons/Icons/CHANGELOG.md`.

The release workflow cuts the matching section out to become the body of the GitHub release — a tag with no
section fails the release before anything is published.

## 1.0.0-preview.1

Where this changelog starts: the first release cut after the packaging was settled. **The framework is
published now**, as a pre-release, instead of the two loose packages that used to go out on their own.

- **Twelve packages, one version.** The number lives once, as `<CoreVersion>` in the repository's
  `Directory.Build.props`, and `Release` refuses a tag that disagrees with it. There is no per-package number
  to forget and no way to install a mismatched pair.
- **The icon sets moved to a public face of their own**,
  [`NE.Standard.UI.Icons`](https://github.com/AkiEvansDev/NE.Standard.UI.Icons), on their own version and
  under MIT. They are still developed alongside the framework, so a set and the renderer it plugs into never
  drift apart; only the release is separate.
- **The package called `NE.Standard` is gone from this repository.** It was a library of general-purpose
  helpers that nothing under `src/` referenced, and it now lives on its own as
  [`NE.Common`](https://www.nuget.org/packages/NE.Common), MIT, with its own version line. It was never part
  of the framework, and a noncommercial licence on a bag of `string` and `DateTime` extensions helped
  nobody.
- **`NE.Standard.UI.Extensions`** is reserved for presets over the components, and is empty in this release.
- **The demo builds against the packages.** In the mirror `examples/DemoApp.Web` restores `NE.Standard.*` from
  nuget.org rather than referencing sources, so cloning it gives you a working application and the build here
  is a real test of what was published.
- **The licence is the [Prosperity Public License 3.0.0](LICENSE.md)**, not MIT: free for noncommercial use,
  with a thirty-day trial for commercial use. Personal projects, research, education, charities and public
  institutions are not commercial use.
- **Installs from nuget.org** — `dotnet add package NE.Standard.UI.Web --prerelease`, no credentials and no
  feed to add first.
- **The packages point only at the public mirror**, `github.com/AkiEvansDev/NE.Standard`. No commit hash
  travels in a nuspec or in an assembly's informational version: the sources live in a private repository, and
  a hash out of it resolves to nothing against the URL the packages carry.
- **`UIComparisonEvaluator` is public**, so an in-memory item source applying a `UIItemsQuery` by hand answers
  `Like`, `Required` and the rest the same way the server and the client do.
- **Fixed: a windowed filter's `Less` and `LessOrEqual` matched rows they should have excluded.** A value that
  is not a number compared through a sentinel that read as "smaller than everything", so `"abc" < 1` was true
  on the server and false in the browser. It converts to `NaN` now, as JavaScript does.
- **Documentation is at [akievansdev.github.io/NE.Standard](https://akievansdev.github.io/NE.Standard).**
  Hand-written pages today; the generated API reference is still to come.
- **The packages published under the old scheme are unlisted on nuget.org** — `NE.Standard` 1.0.0 and
  `NE.Standard.UI.Generators` 1.0.0. They were cut while the packaging was still being settled, and
  `NE.Standard.UI.Generators` 1.0.0 would otherwise outrank every `1.0.0-preview` that follows it.
