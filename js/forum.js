// forum.js - Handle forum interactions
document.addEventListener('DOMContentLoaded', function() {
    // Create Topic Form Handler
    const createTopicForm = document.getElementById('createTopicForm');
    if (createTopicForm) {
        createTopicForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Topik berhasil dibuat! (Demo)');
            const modal = bootstrap.Modal.getInstance(document.getElementById('createTopicModal'));
            if (modal) modal.hide();
        });
    }

    // Edit Profile Form Handler
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Profil berhasil diupdate! (Demo)');
            const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
            if (modal) modal.hide();
        });
    }

    // Search Functionality
    const searchBox = document.querySelector('input.search-box');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterTopics(searchTerm);
        });
    }

    // Category Filter
    const categoryFilter = document.querySelector('select.search-box');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function(e) {
            const category = e.target.value;
            filterByCategory(category);
        });
    }

    // Sort Buttons
    document.querySelectorAll('.btn-group button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-group button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const sortType = this.textContent.trim();
            sortTopics(sortType);
        });
    });

    // Like Button Functionality
    document.querySelectorAll('.btn-outline-primary').forEach(btn => {
        if (btn.innerHTML.includes('Like')) {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const currentCount = parseInt(this.textContent.match(/\d+/)[0]);
                this.innerHTML = `<i class="bi bi-hand-thumbs-up-fill"></i> Like (${currentCount + 1})`;
                this.classList.remove('btn-outline-primary');
                this.classList.add('btn-primary');
            });
        }
    });

    // Category Card Click - Navigate to category page
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function() {
            const categoryName = this.querySelector('.card-title').textContent.trim();
            // Encode category name for URL
            const categorySlug = encodeURIComponent(categoryName);
            window.location.href = `kategori-detail.html?category=${categorySlug}`;
        });
    });

    // Load category from URL if on detail page
    loadCategoryFromURL();
});

// Filter topics by search term
function filterTopics(searchTerm) {
    const topicCards = document.querySelectorAll('.topic-card');
    topicCards.forEach(card => {
        const title = card.querySelector('h5').textContent.toLowerCase();
        const content = card.querySelector('p').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || content.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Filter topics by category
function filterByCategory(category) {
    const topicCards = document.querySelectorAll('.topic-card');
    
    if (category === 'Semua Kategori') {
        topicCards.forEach(card => card.style.display = 'block');
        return;
    }
    
    topicCards.forEach(card => {
        const badge = card.querySelector('.badge-custom');
        if (badge && badge.textContent === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Sort topics
function sortTopics(sortType) {
    const container = document.querySelector('.topic-card').parentElement;
    const topicCards = Array.from(document.querySelectorAll('.topic-card'));
    
    topicCards.sort((a, b) => {
        if (sortType === 'Terbaru') {
            // Sort by time (using the time text)
            const timeA = a.querySelector('.text-muted').textContent;
            const timeB = b.querySelector('.text-muted').textContent;
            return timeA.localeCompare(timeB);
        } else if (sortType === 'Populer') {
            // Sort by views
            const viewsA = parseInt(a.querySelector('.topic-meta span:nth-child(3)').textContent.match(/\d+/)[0]);
            const viewsB = parseInt(b.querySelector('.topic-meta span:nth-child(3)').textContent.match(/\d+/)[0]);
            return viewsB - viewsA;
        } else if (sortType === 'Belum Terjawab') {
            // Sort by comment count (ascending)
            const commentsA = parseInt(a.querySelector('.topic-meta span:nth-child(2)').textContent.match(/\d+/)[0]);
            const commentsB = parseInt(b.querySelector('.topic-meta span:nth-child(2)').textContent.match(/\d+/)[0]);
            return commentsA - commentsB;
        }
    });
    
    // Re-append sorted cards
    topicCards.forEach(card => container.appendChild(card));
}

// Load category from URL parameter
function loadCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (category) {
        const decodedCategory = decodeURIComponent(category);
        
        // Update page title
        const pageTitle = document.querySelector('h2.fw-bold');
        if (pageTitle && pageTitle.textContent === 'Diskusi Terbaru') {
            pageTitle.textContent = `Diskusi: ${decodedCategory}`;
        }
        
        // Filter topics by category
        filterByCategory(decodedCategory);
        
        // Update category filter select
        const categoryFilter = document.querySelector('select.search-box');
        if (categoryFilter) {
            categoryFilter.value = decodedCategory;
        }
    }
}