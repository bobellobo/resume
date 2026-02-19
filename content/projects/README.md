# Projects Content

This folder contains all the content for your portfolio projects, including images and project data.

## Structure

- **images/** - Store your project images/screenshots here
  - project-1.jpg
  - project-2.jpg
  - project-3.jpg
  - project-4.jpg
  - etc.

- **projects.json** - Centralized project data (optional, for easy management)

## Usage

Update the image paths in `index.html` to reference files from this folder:
```html
<img src="content/projects/images/project-1.jpg" alt="Project 1">
```

Or update the `data-image` attribute in project cards:
```html
<div class="project-card" data-image="content/projects/images/project-1.jpg" ...>
```
