// category-detail.js - Handle category detail page
document.addEventListener('DOMContentLoaded', function() {
    loadCategoryDetail();
});

// Sample topics data
const allTopics = {
    'Matematika': [
        {
            title: 'Cara cepat menghitung integral tentu?',
            content: 'Saya kesulitan menghitung integral tentu dengan batas yang rumit. Ada tips atau trik khusus yang bisa dipake?',
            author: 'Rina Sari',
            avatar: 'RS',
            time: '2 jam lalu',
            comments: 12,
            views: 234,
            likes: 8,
            category: 'Matematika',
            badge: 'bg-success'
        },
        {
            title: 'Konsep limit dan turunan fungsi',
            content: 'Bagaimana cara memahami hubungan antara limit dan turunan dengan mudah?',
            author: 'Budi Santoso',
            avatar: 'BS',
            time: '4 jam lalu',
            comments: 8,
            views: 156,
            likes: 5,
            category: 'Matematika',
            badge: 'bg-success'
        },
        {
            title: 'Trigonometri: Identitas dasar yang wajib dihafal',
            content: 'Ada yang bisa kasih tips menghafal identitas trigonometri dengan cepat?',
            author: 'Siti Nur',
            avatar: 'SN',
            time: '6 jam lalu',
            comments: 15,
            views: 289,
            likes: 11,
            category: 'Matematika',
            badge: 'bg-success'
        }
    ],
    'Tes Potensi Skolastik': [
        {
            title: 'Tips mengerjakan soal pemahaman bacaan TPS',
            content: 'Adakah strategi khusus untuk mengerjakan soal pemahaman bacaan yang panjang? Waktu sering habis sebelum selesai...',
            author: 'Andi Pratama',
            avatar: 'AP',
            time: '5 jam lalu',
            comments: 24,
            views: 567,
            likes: 15,
            category: 'TPS',
            badge: 'bg-primary'
        },
        {
            title: 'Penalaran kuantitatif: Pola bilangan',
            content: 'Bagaimana cara cepat mengenali pola bilangan dalam soal TPS?',
            author: 'Lisa Amelia',
            avatar: 'LA',
            time: '3 jam lalu',
            comments: 10,
            views: 198,
            likes: 7,
            category: 'TPS',
            badge: 'bg-primary'
        }
    ],
    'Fisika': [
        {
            title: 'Rekomendasi buku untuk persiapan UTBK Fisika',
            content: 'Halo teman-teman, ada yang bisa rekomendasikan buku yang bagus untuk persiapan UTBK Fisika?',
            author: 'Dewi Wijaya',
            avatar: 'DW',
            time: '1 hari lalu',
            comments: 18,
            views: 456,
            likes: 12,
            category: 'Fisika',
            badge: 'bg-info'
        },
        {
            title: 'Hukum Newton dan aplikasinya',
            content: 'Susah membedakan kapan pakai hukum Newton 1, 2, atau 3. Ada penjelasan sederhana?',
            author: 'Ahmad Fauzi',
            avatar: 'AF',
            time: '8 jam lalu',
            comments: 14,
            views: 267,
            likes: 9,
            category: 'Fisika',
            badge: 'bg-info'
        }
    ],
    'Kimia': [
        {
            title: 'Cara mudah menghafalkan tabel periodik',
            content: 'Ada trik khusus untuk menghafal unsur-unsur dalam tabel periodik?',
            author: 'Rina Kartika',
            avatar: 'RK',
            time: '5 jam lalu',
            comments: 20,
            views: 312,
            likes: 14,
            category: 'Kimia',
            badge: 'bg-purple'
        },
        {
            title: 'Stoikiometri: Cara hitung mol dengan cepat',
            content: 'Selalu bingung kalau ada soal stoikiometri. Ada cara praktis?',
            author: 'Dedi Irawan',
            avatar: 'DI',
            time: '7 jam lalu',
            comments: 11,
            views: 189,
            likes: 6,
            category: 'Kimia',
            badge: 'bg-purple'
        }
    ],
    'Bahasa Indonesia': [
        {
            title: 'Tips menganalisis struktur teks eksposisi',
            content: 'Bagaimana cara cepat mengidentifikasi struktur teks dalam soal UTBK?',
            author: 'Putri Ayu',
            avatar: 'PA',
            time: '4 jam lalu',
            comments: 9,
            views: 145,
            likes: 5,
            category: 'Bahasa Indonesia',
            badge: 'bg-warning'
        }
    ],
    'Bahasa Inggris': [
        {
            title: 'Grammar: Present Perfect vs Simple Past',
            content: 'Selalu bingung kapan pakai present perfect dan kapan pakai simple past. Help!',
            author: 'Reza Pahlevi',
            avatar: 'RP',
            time: '6 jam lalu',
            comments: 13,
            views: 223,
            likes: 8,
            category: 'Bahasa Inggris',
            badge: 'bg-danger'
        }
    ]
};

// Category info mapping
const categoryInfo = {
    'Matematika': {
        icon: 'bi-graph-up',
        color: 'bg-success',
        description: 'Aljabar, kalkulus, geometri, dan statistika'
    },
    'Tes Potensi Skolastik': {
        icon: 'bi-calculator',
        color: 'bg-primary',
        description: 'Pemahaman bacaan, penalaran matematika, dan pengetahuan kuantitatif'
    },
    'Fisika': {
        icon: 'bi-flask',
        color: 'bg-info',
        description: 'Mekanika, termodinamika, listrik, dan optik'
    },
    'Kimia': {
        icon: 'bi-atom',
        color: 'bg-purple',
        description: 'Kimia organik, anorganik, dan fisika'
    },
    'Bahasa Indonesia': {
        icon: 'bi-book',
        color: 'bg-warning',
        description: 'Tata bahasa, pemahaman teks, dan penulisan'
    },
    'Bahasa Inggris': {
        icon: 'bi-globe',
        color: 'bg-danger',
        description: 'Grammar, reading comprehension, dan vocabulary'
    }
};

function loadCategoryDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    
    if (!category) {
        window.location.href = 'kategori.html';
        return;
    }
    
    const decodedCategory = decodeURIComponent(category);
    
    // Update page elements
    updateCategoryHeader(decodedCategory);
    loadTopicsByCategory(decodedCategory);
}

function updateCategoryHeader(categoryName) {
    const info = categoryInfo[categoryName];
    
    if (info) {
        // Update title
        document.getElementById('categoryTitle').textContent = categoryName;
        document.getElementById('categoryDescription').textContent = info.description;
        
        // Update icon
        const iconElement = document.querySelector('#categoryIcon i');
        iconElement.className = `bi ${info.icon}`;
        
        // Update page title
        document.title = `Forum Diskusi UTBK – ${categoryName}`;
    }
}

function loadTopicsByCategory(categoryName) {
    const container = document.getElementById('topicsContainer');
    const noResults = document.getElementById('noResults');
    const topics = allTopics[categoryName] || [];
    
    if (topics.length === 0) {
        container.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }
    
    container.innerHTML = '';
    noResults.style.display = 'none';
    
    topics.forEach(topic => {
        const topicCard = createTopicCard(topic);
        container.appendChild(topicCard);
    });
}

function createTopicCard(topic) {
    const div = document.createElement('div');
    div.className = 'topic-card';
    div.setAttribute('data-bs-toggle', 'modal');
    div.setAttribute('data-bs-target', '#topicDetailModal');
    
    div.innerHTML = `
        <div class="d-flex">
            <div class="user-avatar me-3">${topic.avatar}</div>
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h5 class="mb-1">${topic.title}</h5>
                        <span class="badge ${topic.badge} badge-custom">${topic.category}</span>
                    </div>
                    <small class="text-muted">${topic.time}</small>
                </div>
                <p class="mt-2 mb-3">${topic.content}</p>
                <div class="topic-meta d-flex gap-3">
                    <span><i class="bi bi-person"></i> ${topic.author}</span>
                    <span><i class="bi bi-chat-left-text"></i> ${topic.comments} Komentar</span>
                    <span><i class="bi bi-eye"></i> ${topic.views} Views</span>
                    <span><i class="bi bi-hand-thumbs-up"></i> ${topic.likes} Likes</span>
                </div>
            </div>
        </div>
    `;
    
    return div;
}