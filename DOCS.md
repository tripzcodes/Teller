# Documentation Index

Welcome to **Teller** documentation! This file helps you find the right documentation for your needs.

## 📖 Documentation Overview

| Document | Purpose | Audience |
|----------|---------|----------|
| **README.md** | Project overview, quick start, features | Everyone |
| **CONTRIBUTING.md** | Contribution guide, bank format submission | Contributors |
| **PATTERNS.md** | **10 regex patterns, edge cases, 95-98% coverage** | **Developers, contributors** |
| **DEV_GUIDE.md** | Detailed development workflow | Developers |
| **SETUP.md** | Emscripten installation guide | Developers (C++ changes) |
| **frontend/README.md** | Frontend-specific documentation | Frontend developers |

## 🎯 Quick Navigation

### I want to...

#### **...run the app for the first time**
→ Start with **[README.md](README.md)** → Getting Started section
- Quick start: install dependencies, run dev server
- No C++ build needed (WASM already compiled)

#### **...understand the project architecture**
→ Read **[README.md](README.md)** → Architecture section
- Dual WASM architecture explained
- Data flow diagram
- Tech stack details

#### **...modify C++ code**
→ Check **[DEV_GUIDE.md](DEV_GUIDE.md)** → Making Changes section
- How to add C++ functions
- Build commands for WASM
- Debugging tips

#### **...understand the regex patterns**
→ Read **[PATTERNS.md](PATTERNS.md)**
- All 10 patterns explained in detail
- Edge case handling strategies
- Coverage breakdown by bank type
- Testing examples with real transactions

#### **...add transaction regex patterns**
→ See **[PATTERNS.md](PATTERNS.md)** + **[DEV_GUIDE.md](DEV_GUIDE.md)**
- Study existing patterns first (PATTERNS.md)
- Edit `cpp/src/extractor/transaction_extractor.cpp`
- Rebuild WASM module
- Test with different bank formats

#### **...work on the frontend UI**
→ Check **[frontend/README.md](frontend/README.md)**
- Svelte component structure
- Store usage
- WASM loader API

#### **...contribute to the project**
→ Read **[CONTRIBUTING.md](CONTRIBUTING.md)**
- How to report bugs and request features
- Bank format submission guide
- Code contribution workflow
- Privacy and anonymization guidelines

#### **...set up Emscripten from scratch**
→ Follow **[SETUP.md](SETUP.md)**
- Windows/Linux/Mac instructions
- Version 4.0.19 recommended
- Verification steps


## 📚 Documentation Flow

### For New Users
1. **[README.md](README.md)** - Understand what the project does and get started
2. Try the app - upload a bank statement

### For Developers
1. **[README.md](README.md)** - Project overview and quick start
2. **[DEV_GUIDE.md](DEV_GUIDE.md)** - Development workflow
3. **[PATTERNS.md](PATTERNS.md)** - Understand regex patterns
4. **[SETUP.md](SETUP.md)** - If modifying C++ code

### For Contributors
1. **[CONTRIBUTING.md](CONTRIBUTING.md)** - Start here for all contributions
2. **[PATTERNS.md](PATTERNS.md)** - If adding bank format support
3. **[DEV_GUIDE.md](DEV_GUIDE.md)** - For code contributions
4. **[SETUP.md](SETUP.md)** - If modifying C++ patterns

## 🔍 Finding Specific Information

### Architecture & Design
- **Overall architecture**: [README.md](README.md) → Architecture
- **Pattern system**: [PATTERNS.md](PATTERNS.md) → All 10 patterns explained
- **Development workflow**: [DEV_GUIDE.md](DEV_GUIDE.md) → Current Architecture

### Getting Started
- **Quick start**: [README.md](README.md) → Getting Started
- **Emscripten setup**: [SETUP.md](SETUP.md)
- **Building C++ code**: [DEV_GUIDE.md](DEV_GUIDE.md) → Build C++ → WASM

### Development
- **Adding C++ functions**: [DEV_GUIDE.md](DEV_GUIDE.md) → Making Changes
- **Frontend development**: [frontend/README.md](frontend/README.md)
- **Code style**: [DEV_GUIDE.md](DEV_GUIDE.md) → Code Style
- **Debugging**: [DEV_GUIDE.md](DEV_GUIDE.md) → Debugging

### Technical Details
- **Supported formats**: [PATTERNS.md](PATTERNS.md) → All 10 patterns
- **Pattern coverage**: [PATTERNS.md](PATTERNS.md) → Coverage breakdown
- **Edge case handling**: [PATTERNS.md](PATTERNS.md) → Universal strategies
- **Performance metrics**: [README.md](README.md) → Tech Stack

### Troubleshooting
- **Build problems**: [DEV_GUIDE.md](DEV_GUIDE.md) → Common Issues
- **Emscripten setup**: [SETUP.md](SETUP.md)
- **Bank not supported**: [CONTRIBUTING.md](CONTRIBUTING.md) → Adding Bank Support

## 📋 Current Status

**PUBLIC BETA** ⚠️ (as of November 11, 2025)

Teller is in active beta development. Core features working:
- ✅ PDF parsing and transaction extraction (10 regex patterns)
- ✅ Smart categorization (17 categories)
- ✅ Machine learning (TensorFlow.js)
- ✅ Interactive visualizations (D3.js)
- ✅ Privacy-first (100% local processing)

**Known Limitations:**
- Some bank formats may not be supported yet
- Community contributions needed for comprehensive bank coverage

See [README.md](README.md) for full feature list and [CONTRIBUTING.md](CONTRIBUTING.md) to help improve bank support.

## 🎓 Learning Resources

If you're new to the technologies used:

- **WebAssembly**: [MDN WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly)
- **Emscripten**: [Emscripten Docs](https://emscripten.org/docs/)
- **Svelte**: [Svelte Tutorial](https://svelte.dev/tutorial)
- **CMake**: [CMake Tutorial](https://cmake.org/cmake/help/latest/guide/tutorial/)
- **C++17**: [C++ Reference](https://en.cppreference.com/)

## 🤝 Contributing

We need your help to support more bank formats!

**Start here**: **[CONTRIBUTING.md](CONTRIBUTING.md)**

### Quick Ways to Help
1. **🏦 Submit your bank format** - Most needed! If Teller doesn't work with your bank, submit an anonymized sample
2. **🐛 Report bugs** - Found an issue? Let us know
3. **💡 Request features** - Have ideas? Share them
4. **💻 Code contributions** - Improve patterns, ML, or visualizations

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed instructions and privacy guidelines.

## 💬 Questions?

1. Check if your question is answered in any of the docs above
2. Look at the troubleshooting sections in [DEV_GUIDE.md](DEV_GUIDE.md) and [SETUP.md](SETUP.md)
3. Open a [Question issue on GitHub](https://github.com/tripzcodes/Teller/issues/new?template=question.md)

---

**Last Updated**: November 11, 2025
**Project Status**: Public Beta
**Maintainer**: Youssef Ashraf ([@tripzcodes](https://github.com/tripzcodes))
**Documentation Version**: 2.0
