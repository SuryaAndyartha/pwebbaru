// community.js - Handle community page interactions
document.addEventListener('DOMContentLoaded', function() {
    // Community Card Click - Navigate to community detail
    document.querySelectorAll('.community-card').forEach(card => {
        card.addEventListener('click', function() {
            const communityId = this.getAttribute('data-community');
            window.location.href = `komunitas-detail.html?community=${communityId}`;
        });
    });

    // Search Community
    const searchBox = document.getElementById('searchCommunity');
    if (searchBox) {
        searchBox.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            filterCommunities(searchTerm);
        });
    }

    // Filter Community
    const filterSelect = document.getElementById('filterCommunity');
    if (filterSelect) {
        filterSelect.addEventListener('change', function(e) {
            const filterType = e.target.value;
            sortCommunities(filterType);
        });
    }
});

// Filter communities by search term
function filterCommunities(searchTerm) {
    const communityCards = document.querySelectorAll('.community-card');
    
    communityCards.forEach(card => {
        const title = card.querySelector('.card-title').textContent.toLowerCase();
        const description = card.querySelector('.card-text').textContent.toLowerCase();
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.parentElement.style.display = 'block';
        } else {
            card.parentElement.style.display = 'none';
        }
    });
}

// Sort communities
function sortCommunities(filterType) {
    const container = document.getElementById('communitiesContainer');
    const communityCards = Array.from(container.children);
    
    communityCards.sort((a, b) => {
        if (filterType === 'Paling Populer') {
            // Sort by member count
            const membersA = parseInt(a.querySelector('small').textContent.match(/\d+/)[0]);
            const membersB = parseInt(b.querySelector('small').textContent.match(/\d+/)[0]);
            return membersB - membersA;
        } else if (filterType === 'Paling Aktif') {
            // Sort by discussion count
            const discussionsA = parseInt(a.querySelector('.text-muted:last-child').textContent.match(/\d+/)[0]);
            const discussionsB = parseInt(b.querySelector('.text-muted:last-child').textContent.match(/\d+/)[0]);
            return discussionsB - discussionsA;
        }
        // Default: Terbaru (keep original order)
        return 0;
    });
    
    // Re-append sorted cards
    communityCards.forEach(card => container.appendChild(card));
}