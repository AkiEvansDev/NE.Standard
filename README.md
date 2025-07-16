# NE.Standard

![Build](https://github.com/AkiEvansDev/NE.Standard/actions/workflows/standard-build-test-docs.yml/badge.svg)

**NE.Standard** is a modular, cross-platform .NET library for building maintainable MVVM applications and UI abstractions.  
It offers a robust foundation for cross-platform apps by unifying logic, serialization, and UI structure.

---

## Features

- **Rich Extensions**: Safe, high-performance helpers for collections, strings, enums, reflection, DateTime, TimeSpan, colors, and more.
- **Reusable Types**: Recursive observable models, limited-size stacks, reference comparers, weak delegates, and more.
- **Serialization**:  
  - `NESerializer`: attribute-driven, reference-preserving, type-compressed object graph serialization (with Base64 support)
  - JSON/XML helpers
- **I/O Utilities**:  
  - File & directory helpers (sync/async, robust path validation, streaming, filtering)
- **Async Logging**:  
  - Thread-safe, buffered loggers for console and file, with daily rotation and DI/ILoggerProvider integration.
- **Design & Rendering** *(in progress)*:  
  - `NE.Standard.Design`: describe UIs declaratively and bind to your view-model logic
  - `NE.Standard.Web`: render your UI configs in Blazor/web
  - `NE.Standard.WPF`: native renderer for Windows

---

## Project Structure

| Project                | Status        | Description                                               |
|------------------------|---------------|-----------------------------------------------------------|
| `NE.Standard`          | ✅ Stable     | Core helpers, extensions, and types                       |
| `NE.Standard.Design`   | 🛠 In Dev     | UI abstraction & configuration for cross-platform MVVM    |
| `NE.Standard.Web`      | 🛠 In Dev     | Web (Blazor) renderer for `Design` configs                |
| `NE.Standard.WPF`      | 🛠 In Dev     | WPF renderer for `Design` configs                         |

---

## Documentation

Latest: [AkiEvansDev.github.io/NE.Standard](https://AkiEvansDev.github.io/NE.Standard)  
Docs generated via [DocFX](https://dotnet.github.io/docfx/)

---

## License

[MIT](LICENSE)
