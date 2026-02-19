# Portfolio - Pippo

A modern, bilingual portfolio website built with Vue 3, Vite, and TypeScript.

**Live Site:** https://bobellobo.github.io/resume/

## 🚀 Features

- **Vue 3 + Vite** - Fast, modern development
- **TypeScript** - Type-safe codebase
- **Bilingual (EN/FR)** - vue-i18n integration
- **Responsive Design** - Mobile-first approach
- **Component-Based** - Reusable, maintainable architecture
- **Automatic Deployment** - GitHub Actions to GitHub Pages
- **Dynamic Projects** - Load from JSON file

## 📁 Project Structure

```
src/
├── components/
│   ├── Header.vue          # Navigation + Language Switcher
│   ├── Hero.vue            # Welcome section
│   ├── About.vue           # About section
│   ├── Projects.vue        # Projects grid
│   ├── Contact.vue         # Contact section
│   ├── Footer.vue          # Footer
│   └── ProjectModal.vue    # Project details modal
├── App.vue                 # Main app component
├── main.ts                 # Entry point with i18n
└── style.css               # Global styles & CSS variables

content/
├── projects/
│   ├── projects.json       # Project data
│   └── images/             # Project images
├── en.json                 # English translations
└── fr.json                 # French translations
```

## 🛠️ Development

**Install dependencies:**
```bash
npm install
```

**Start development server:**
```bash
npm run dev
```
Runs on `http://localhost:5173`

**Build for production:**
```bash
npm run build
```

**Preview production build:**
```bash
npm run preview
```

## ✏️ Customization

### Update Project Data
Edit `content/projects/projects.json` to add/modify projects

### Add Project Images
Place images in `content/projects/images/`

### Update Translations
Edit `content/en.json` or `content/fr.json` for UI text

### Modify Styles
Edit `src/style.css` for global variables and colors

## 🌐 Deployment

Automatic deployment to GitHub Pages on push to `main` or `master` branch.

See `GITHUB_PAGES_SETUP.md` for detailed deployment information.

## 📝 License

This project is open source and available under the MIT License.