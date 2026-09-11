# TECHNO4 FRAMEWORK2 CLI (`techno4-cli`)

<div align="center">

**Утиліти командного рядка TECHNO4 FRAMEWORK2**  
*Command-line utilities for TECHNO4 FRAMEWORK2*

[![License: LGPL-3.0-or-later](https://img.shields.io/badge/License-LGPL--3.0--or--later-blue.svg)](LICENSE)
[![Organization](https://img.shields.io/badge/Organization-CO%20%C2%ABCF%20TECHNO4%C2%BB-green.svg)](https://techno4.online)

---

### [🇺🇦 Українська](#-українська) &nbsp;|&nbsp; [🇬🇧 English](#-english)

---

</div>

<br>

---

## 🇺🇦 Українська

### 🎯 Мета проєкту
> **Вільна ініціатива підтримки сучасних інструментів розробника за підтримки благодійної організації «БЛАГОДІЙНИЙ ФОНД ТЕХНО4» (CO «CF TECHNO4»).**

`techno4-cli` — це офіційна консольна утиліта екосистеми **TECHNO4 FRAMEWORK2**, що забезпечує швидке створення, налаштування та скафолдинг проектів (PWA, Cordova, Electron/Desktop), а також генерацію графічних асетів (іконки, сплеш-скріни).

### 📦 Встановлення

Встановлення через npm (глобально):

```bash
npm install -g techno4-cli
```

Або миттєвий запуск без встановлення через `npx`:

```bash
npx techno4-cli create
```

### 🚀 Використання

#### Створення нового застосунку:
```bash
# Інтерактивний майстер у терміналі
techno4 create
# або скорочено:
t4 create

# Запуск з інтерактивним веб-інтерфейсом (UI):
t4 create --ui
# На вибір іншого порту:
t4 create --ui --port 8080
```

#### Генерація асетів застосунку:
```bash
# Консольний генератор іконок та сплешів
t4 assets

# Інтерактивний UI генератор асетів
t4 assets --ui
```

### 📚 Офіційна документація
Докладна документація та посібники з розробки:  
👉 **[https://techno4.online/надбання/фреймворк](https://techno4.online/%D0%BD%D0%B0%D0%B4%D0%B1%D0%B0%D0%BD%D0%BD%D1%8F/%D1%84%D1%80%D0%B5%D0%B9%D0%BC%D0%B2%D0%BE%D1%80%D0%BA)**

### ⚖️ Ліцензія та права
Вихідний код розповсюджується за ліцензією **LGPL-3.0-or-later**.  
Підтримується: **благодійна організація «БЛАГОДІЙНИЙ ФОНД ТЕХНО4»** (`CO «CF TECHNO4»`).  
Автор: **Mykola Zghurskyi** (`mykola@techno4.online`).  
Містить адаптовані компоненти Framework7 CLI (MIT License).

<br>

---

## 🇬🇧 English

### 🎯 Project Mission
> **A free initiative supporting modern developer tools, supported by the charitable organization "CO «CF TECHNO4»" (благодійна організація «БЛАГОДІЙНИЙ ФОНД ТЕХНО4»).**

`techno4-cli` is the official command-line utility for **TECHNO4 FRAMEWORK2**, designed to scaffold new applications (PWA, Cordova, Electron/Desktop) and generate application assets (icons, splash screens) via terminal prompts or interactive local Web UI.

### 📦 Installation

Install globally via npm:

```bash
npm install -g techno4-cli
```

Or run directly without permanent installation via `npx`:

```bash
npx techno4-cli create
```

### 🚀 Usage

#### Scaffolding a new application:
```bash
# Interactive CLI wizard
techno4 create
# or using short alias:
t4 create

# Launch with Web UI:
t4 create --ui
# Specify custom port:
t4 create --ui --port 8080
```

#### Generating app icons & splash screens:
```bash
# CLI generation
t4 assets

# Interactive Web UI asset generator
t4 assets --ui
```

### 📚 Official Documentation
Official guides and framework documentation:  
👉 **[https://techno4.online/надбання/фреймворк](https://techno4.online/%D0%BD%D0%B0%D0%B4%D0%B1%D0%B0%D0%BD%D0%BD%D1%8F/%D1%84%D1%80%D0%B5%D0%B9%D0%BC%D0%B2%D0%BE%D1%80%D0%BA)**

### ⚖️ License & Attribution
Distributed under the **LGPL-3.0-or-later** license.  
Published and supported by **CO «CF TECHNO4»** (`благодійна організація «БЛАГОДІЙНИЙ ФОНД ТЕХНО4»`).  
Author: **Mykola Zghurskyi** (`mykola@techno4.online`).  
Contains derivatives of Framework7 CLI (MIT License).
