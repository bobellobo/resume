// Modal Elements
const modal = document.getElementById('projectModal');
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');
const modalBackButton = document.querySelector('.modal-back-button');

// Modal Content Elements
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDescription = document.getElementById('modalDescription');
const modalTechnologies = document.getElementById('modalTechnologies');
const modalLink = document.getElementById('modalLink');

// Projects Grid
const projectsGrid = document.getElementById('projectsGrid');

/**
 * Fetch and load projects from JSON
 */
async function loadProjects() {
    try {
        const response = await fetch('content/projects/projects.json');
        if (!response.ok) {
            throw new Error('Failed to load projects');
        }
        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        console.error('Error loading projects:', error);
        projectsGrid.innerHTML = '<p>Failed to load projects. Please try again later.</p>';
    }
}

/**
 * Render projects from data
 */
function renderProjects(projects) {
    projectsGrid.innerHTML = '';

    projects.forEach(project => {
        // Create project card element
        const card = document.createElement('div');
        card.className = 'project-card';
        card.dataset.projectId = project.id;
        card.dataset.title = project.title;
        card.dataset.description = project.description;
        card.dataset.image = `content/projects/${project.image}`;
        card.dataset.technologies = project.technologies.join(',');
        card.dataset.link = project.link;

        // Create card HTML
        card.innerHTML = `
            <div class="card-image">
                <img src="content/projects/${project.image}" alt="${project.title}">
            </div>
            <div class="card-content">
                <h3>${project.title}</h3>
                <p>${project.shortDescription}</p>
                <div class="card-tags">
                    ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                </div>
                <a href="#" class="card-link">View Project</a>
            </div>
        `;

        // Add click handler for "View Project" link
        const cardLink = card.querySelector('.card-link');
        cardLink.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(card);
        });

        projectsGrid.appendChild(card);
    });
}

/**
 * Open the modal with project details
 */
function openModal(projectCard) {
    const title = projectCard.dataset.title;
    const description = projectCard.dataset.description;
    const image = projectCard.dataset.image;
    const technologies = projectCard.dataset.technologies.split(',');
    const link = projectCard.dataset.link;

    // Populate modal content
    modalTitle.textContent = title;
    modalDescription.textContent = description;
    modalImage.src = image;
    modalImage.alt = title;
    modalLink.href = link;

    // Populate technologies
    modalTechnologies.innerHTML = '';
    technologies.forEach(tech => {
        const tag = document.createElement('span');
        tag.className = 'modal-tag';
        tag.textContent = tech.trim();
        modalTechnologies.appendChild(tag);
    });

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
}

/**
 * Close the modal
 */
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
}

/**
 * Event Listeners
 */

// Close modal buttons
modalClose.addEventListener('click', closeModal);
modalBackButton.addEventListener('click', closeModal);

// Close modal on overlay click
modalOverlay.addEventListener('click', closeModal);

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Prevent modal close when clicking on modal content
modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

// Prevent closing when clicking inside modal content
document.querySelector('.modal-content').addEventListener('click', (e) => {
    e.stopPropagation();
});

// Load projects on page load
document.addEventListener('DOMContentLoaded', loadProjects);
