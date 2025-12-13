// js/forum-dynamic.js - Dynamic forum functionality
document.addEventListener('DOMContentLoaded', function() {
    // Create Topic Form Handler
    const createTopicForm = document.getElementById('createTopicForm');
    if (createTopicForm) {
        createTopicForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            formData.append('action', 'create');
            
            // Get category_id from select
            const categorySelect = this.querySelector('select[name="category"]');
            if (categorySelect) {
                formData.append('category_id', categorySelect.value);
            }
            
            try {
                const response = await fetch('api/topics.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showAlert('success', data.message);
                    const modal = bootstrap.Modal.getInstance(document.getElementById('createTopicModal'));
                    if (modal) modal.hide();
                    
                    // Reload page to show new topic
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showAlert('danger', data.message);
                }
            } catch (error) {
                showAlert('danger', 'Terjadi kesalahan. Silakan coba lagi.');
                console.error('Create topic error:', error);
            }
        });
    }
    
    // Load topics dynamically
    loadTopics();
    
    // Search functionality
    const searchBox = document.querySelector('input.search-box[placeholder*="Cari topik"]');
    if (searchBox) {
        let searchTimeout;
        searchBox.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                loadTopics({ search: this.value });
            }, 500);
        });
    }
    
    // Category filter
    const categoryFilter = document.querySelector('select.search-box');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            const categoryId = getCategoryIdByName(this.value);
            loadTopics({ category_id: categoryId });
        });
    }
    
    // Sort buttons
    document.querySelectorAll('.btn-group button').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.btn-group button').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            let sort = 'newest';
            if (this.textContent.includes('Populer')) {
                sort = 'popular';
            } else if (this.textContent.includes('Belum Terjawab')) {
                sort = 'unanswered';
            }
            
            loadTopics({ sort });
        });
    });
    
    // Like button handler
    document.addEventListener('click', async function(e) {
        const likeBtn = e.target.closest('[data-action="like"]');
        if (likeBtn) {
            e.preventDefault();
            e.stopPropagation();
            
            const type = likeBtn.dataset.type;
            const id = likeBtn.dataset.id;
            
            const formData = new FormData();
            formData.append('action', 'like');
            formData.append('type', type);
            formData.append('id', id);
            
            try {
                const response = await fetch('api/comments.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    // Update UI
                    const icon = likeBtn.querySelector('i');
                    if (data.action === 'liked') {
                        icon.classList.remove('bi-hand-thumbs-up');
                        icon.classList.add('bi-hand-thumbs-up-fill');
                        likeBtn.classList.add('btn-primary');
                        likeBtn.classList.remove('btn-outline-primary');
                    } else {
                        icon.classList.remove('bi-hand-thumbs-up-fill');
                        icon.classList.add('bi-hand-thumbs-up');
                        likeBtn.classList.remove('btn-primary');
                        likeBtn.classList.add('btn-outline-primary');
                    }
                    
                    // Update count
                    const countMatch = likeBtn.textContent.match(/\d+/);
                    if (countMatch) {
                        const currentCount = parseInt(countMatch[0]);
                        const newCount = data.action === 'liked' ? currentCount + 1 : currentCount - 1;
                        likeBtn.innerHTML = likeBtn.innerHTML.replace(/\d+/, newCount);
                    }
                } else {
                    showAlert('danger', data.message);
                }
            } catch (error) {
                showAlert('danger', 'Terjadi kesalahan. Silakan coba lagi.');
                console.error('Like error:', error);
            }
        }
    });
    
    // Comment form handler
    const commentForm = document.querySelector('#topicDetailModal form');
    if (commentForm) {
        commentForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            formData.append('action', 'create');
            
            try {
                const response = await fetch('api/comments.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();
                
                if (data.success) {
                    showAlert('success', data.message);
                    this.reset();
                    
                    // Reload comments
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showAlert('danger', data.message);
                }
            } catch (error) {
                showAlert('danger', 'Terjadi kesalahan. Silakan coba lagi.');
                console.error('Comment error:', error);
            }
        });
    }
});

// Load topics from API
async function loadTopics(params = {}) {
    const container = document.querySelector('.topic-card')?.parentElement;
    if (!container) return;
    
    // Build query string
    const queryParams = new URLSearchParams(params);
            console.log('Load Detail Dipanggil, ID Diterima:', topicId);
    try {
        const response = await fetch(`api/topics.php?action=list&${queryParams}`);
        const data = await response.json();
        
        if (data.success) {
            renderTopics(data.topics, container);
            
            // Update pagination if exists
            const paginationNav = document.querySelector('.pagination')?.parentElement;
            if (paginationNav && data.pagination) {
                renderPagination(data.pagination, paginationNav);
            }
        }
    } catch (error) {
        console.error('Load topics error:', error);
    }
}

// Render topics
function renderTopics(topics, container) {
    if (topics.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-inbox" style="font-size: 4rem; color: #ccc;"></i>
                <h5 class="mt-3 text-muted">Belum ada diskusi</h5>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    topics.forEach(topic => {
        const topicCard = createTopicCard(topic);
        container.appendChild(topicCard);
    });
}

// Create topic card element
function createTopicCard(topic) {
    const div = document.createElement('div');
    div.className = 'topic-card';
    div.onclick = () => loadTopicDetail(topic.topic_id);
    
    const badgeClass = getBadgeClass(topic.category_color);
    
    div.innerHTML = `
        <div class="d-flex">
            <div class="user-avatar me-3">${topic.initials}</div>
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h5 class="mb-1">${escapeHtml(topic.title)}</h5>
                        <span class="badge ${badgeClass} badge-custom">${escapeHtml(topic.category_name)}</span>
                    </div>
                    <small class="text-muted">${topic.time_ago}</small>
                </div>
                <p class="mt-2 mb-3">${escapeHtml(truncate(topic.content, 150))}</p>
                <div class="topic-meta d-flex gap-3">
                    <span><i class="bi bi-person"></i> ${escapeHtml(topic.username)}</span>
                    <span><i class="bi bi-chat-left-text"></i> ${topic.comment_count} Komentar</span>
                    <span><i class="bi bi-eye"></i> ${topic.view_count} Views</span>
                    <span><i class="bi bi-hand-thumbs-up"></i> ${topic.like_count} Likes</span>
                </div>
            </div>
        </div>
    `;
    
    return div;
}

// Load topic detail
async function loadTopicDetail(topicId) {
    try {
        const response = await fetch(`api/topics.php?action=get&id=${topicId}`);
        const data = await response.json();
        
        if (data.success) {
            // Populate modal with topic data
            const modal = document.getElementById('topicDetailModal');
            if (modal) {
                populateTopicModal(modal, data.topic, data.comments);
                
                // Show modal
                const bsModal = new bootstrap.Modal(modal);
                bsModal.show();
            }
        }
    } catch (error) {
        console.error('Load topic detail error:', error);
    }
}

// Populate topic modal
function populateTopicModal(modal, topic, comments) {
    // Update title
    const title = modal.querySelector('.modal-title');
    if (title) {
        title.textContent = topic.title;
    }
    
    // Update badge
    const badge = modal.querySelector('.badge');
    if (badge) {
        badge.textContent = topic.category_name;
        badge.className = `badge ${getBadgeClass(topic.category_color)} badge-custom mt-2`;
    }
    
    // Update original post
    const postCard = modal.querySelector('.card');
    if (postCard) {
        const avatar = postCard.querySelector('.user-avatar');
        const username = postCard.querySelector('h6');
        const time = postCard.querySelector('small');
        const content = postCard.querySelector('p');
        
        if (avatar) avatar.textContent = topic.initials;
        if (username) username.textContent = topic.full_name || topic.username;
        if (time) time.textContent = topic.time_ago;
        if (content) content.textContent = topic.content;
    }
    
    // Update comments
    const commentsSection = modal.querySelector('.comment-section');
    if (commentsSection) {
        renderComments(comments, commentsSection);
    }
    
    // Set topic_id in comment form
    const commentForm = modal.querySelector('form');
    if (commentForm) {
        let topicIdInput = commentForm.querySelector('input[name="topic_id"]');
        if (!topicIdInput) {
            topicIdInput = document.createElement('input');
            topicIdInput.type = 'hidden';
            topicIdInput.name = 'topic_id';
            commentForm.appendChild(topicIdInput);
        }
        topicIdInput.value = topic.topic_id;
    }
}

// Render comments
function renderComments(comments, container) {
    const commentsHtml = comments.map(comment => `
        <div class="comment-item">
            <div class="d-flex">
                <div class="user-avatar me-3" style="width: 40px; height: 40px; font-size: 0.9rem;">${comment.initials}</div>
                <div class="flex-grow-1">
                    <div class="d-flex justify-content-between">
                        <h6 class="mb-0">${escapeHtml(comment.full_name || comment.username)}</h6>
                        <small class="text-muted">${comment.time_ago}</small>
                    </div>
                    <p class="mt-2 mb-2">${escapeHtml(comment.content)}</p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-link text-decoration-none p-0" data-action="like" data-type="comment" data-id="${comment.comment_id}">
                            <i class="bi bi-hand-thumbs-up"></i> ${comment.like_count}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    const heading = container.querySelector('h6');
    if (heading) {
        heading.textContent = `${comments.length} Komentar`;
    }
    
    // Insert comments after heading
    const existingComments = container.querySelectorAll('.comment-item');
    existingComments.forEach(c => c.remove());
    
    if (heading) {
        heading.insertAdjacentHTML('afterend', commentsHtml);
    }
}

// Helper functions
function getBadgeClass(color) {
    const colorMap = {
        'primary': 'bg-primary',
        'success': 'bg-success',
        'info': 'bg-info',
        'warning': 'bg-warning',
        'danger': 'bg-danger',
        'purple': 'bg-purple'
    };
    return colorMap[color] || 'bg-primary';
}

function getCategoryIdByName(name) {
    const categoryMap = {
        'Semua Kategori': 0,
        'Tes Potensi Skolastik': 1,
        'Matematika': 2,
        'Bahasa Indonesia': 3,
        'Bahasa Inggris': 4,
        'Fisika': 5,
        'Kimia': 6
    };
    return categoryMap[name] || 0;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function truncate(text, length) {
    if (text.length > length) {
        return text.substring(0, length) + '...';
    }
    return text;
}

function renderPagination(pagination, container) {
    const { current_page, total_pages } = pagination;
    
    let html = '<nav><ul class="pagination justify-content-center">';
    
    // Previous
    if (current_page > 1) {
        html += `<li class="page-item"><a class="page-link" href="?page=${current_page - 1}">Previous</a></li>`;
    } else {
        html += '<li class="page-item disabled"><a class="page-link">Previous</a></li>';
    }
    
    // Pages
    for (let i = 1; i <= total_pages; i++) {
        if (i === current_page) {
            html += `<li class="page-item active"><a class="page-link">${i}</a></li>`;
        } else {
            html += `<li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`;
        }
    }
    
    // Next
    if (current_page < total_pages) {
        html += `<li class="page-item"><a class="page-link" href="?page=${current_page + 1}">Next</a></li>`;
    } else {
        html += '<li class="page-item disabled"><a class="page-link">Next</a></li>';
    }
    
    html += '</ul></nav>';
    container.innerHTML = html;
}

function showAlert(type, message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
