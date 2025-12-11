// community-detail.js - Handle community detail page
document.addEventListener('DOMContentLoaded', function() {
    loadCommunityDetail();
    setupJoinButton();
});

// Community data
const communityData = {
    'matematika-master': {
        name: 'Matematika Master',
        icon: 'bi-calculator-fill',
        iconBg: 'bg-success',
        members: 324,
        discussions: 156,
        posts: 892,
        events: 12,
        category: 'Matematika',
        badgeClass: 'bg-success',
        description: 'Komunitas belajar matematika untuk persiapan UTBK. Bahas soal, tips, dan trik bersama!',
        fullDescription: 'Matematika Master adalah komunitas belajar yang fokus pada persiapan UTBK untuk mata pelajaran Matematika. Di sini, kamu bisa bertanya, berbagi, dan belajar bersama tentang berbagai topik matematika mulai dari aljabar, kalkulus, geometri, hingga statistika.',
        moderators: [
            { name: 'Dr. Ahmad Fauzi', avatar: 'AF', role: 'Founder' },
            { name: 'Rina Sari', avatar: 'RS', role: 'Moderator' }
        ],
        discussions: [
            {
                title: 'Cara cepat menghitung integral tentu?',
                content: 'Saya kesulitan menghitung integral tentu dengan batas yang rumit. Ada tips atau trik khusus yang bisa dipake?',
                author: 'Rina Sari',
                avatar: 'RS',
                time: '2 jam lalu',
                comments: 12,
                views: 234,
                likes: 8
            },
            {
                title: 'Konsep limit dan turunan fungsi',
                content: 'Bagaimana cara memahami hubungan antara limit dan turunan dengan mudah?',
                author: 'Budi Santoso',
                avatar: 'BS',
                time: '4 jam lalu',
                comments: 8,
                views: 156,
                likes: 5
            }
        ],
        members: [
            { name: 'Rina Sari', avatar: 'RS', role: 'Moderator', joined: '3 bulan lalu' },
            { name: 'Budi Santoso', avatar: 'BS', role: 'Anggota', joined: '2 bulan lalu' },
            { name: 'Ahmad Fauzi', avatar: 'AF', role: 'Moderator', joined: '6 bulan lalu' },
            { name: 'Siti Nur', avatar: 'SN', role: 'Anggota', joined: '1 bulan lalu' }
        ],
        events: [
            {
                title: 'Webinar: Tips Mengerjakan Soal Integral',
                date: '15 Desember 2024',
                time: '19:00 WIB',
                participants: 45
            },
            {
                title: 'Try Out Matematika Online',
                date: '20 Desember 2024',
                time: '14:00 WIB',
                participants: 78
            }
        ]
    },
    'fisika-fun': {
        name: 'Fisika Fun',
        icon: 'bi-lightning-fill',
        iconBg: 'bg-info',
        members: 198,
        discussions: 89,
        posts: 567,
        events: 8,
        category: 'Fisika',
        badgeClass: 'bg-info',
        description: 'Belajar fisika dengan cara yang menyenangkan. Dari mekanika hingga listrik magnet!',
        fullDescription: 'Fisika Fun adalah komunitas yang membuat belajar fisika menjadi menyenangkan dan mudah dipahami. Kami membahas berbagai topik dari mekanika, termodinamika, listrik magnet, hingga fisika modern dengan pendekatan yang praktis dan aplikatif.',
        moderators: [
            { name: 'Dewi Wijaya', avatar: 'DW', role: 'Founder' }
        ],
        discussions: [
            {
                title: 'Rekomendasi buku untuk persiapan UTBK Fisika',
                content: 'Halo teman-teman, ada yang bisa rekomendasikan buku yang bagus untuk persiapan UTBK Fisika?',
                author: 'Dewi Wijaya',
                avatar: 'DW',
                time: '1 hari lalu',
                comments: 18,
                views: 456,
                likes: 12
            }
        ],
        members: [
            { name: 'Dewi Wijaya', avatar: 'DW', role: 'Moderator', joined: '4 bulan lalu' },
            { name: 'Andi Pratama', avatar: 'AP', role: 'Anggota', joined: '2 bulan lalu' }
        ],
        events: [
            {
                title: 'Eksperimen Virtual: Hukum Newton',
                date: '18 Desember 2024',
                time: '16:00 WIB',
                participants: 32
            }
        ]
    },
    'kimia-squad': {
        name: 'Kimia Squad',
        icon: 'bi-cup-hot-fill',
        iconBg: 'bg-purple',
        members: 267,
        discussions: 112,
        posts: 734,
        events: 10,
        category: 'Kimia',
        badgeClass: 'bg-purple',
        description: 'Komunitas pecinta kimia. Bahas reaksi, stoikiometri, dan semua hal tentang kimia!',
        fullDescription: 'Kimia Squad adalah tempat berkumpulnya para pecinta kimia untuk belajar dan berdiskusi tentang berbagai topik kimia, dari dasar hingga tingkat lanjut.',
        moderators: [
            { name: 'Rina Kartika', avatar: 'RK', role: 'Founder' }
        ],
        discussions: [],
        members: [
            { name: 'Rina Kartika', avatar: 'RK', role: 'Moderator', joined: '5 bulan lalu' }
        ],
        events: []
    },
    'tps-warriors': {
        name: 'TPS Warriors',
        icon: 'bi-trophy-fill',
        iconBg: 'bg-primary',
        members: 456,
        discussions: 234,
        posts: 1456,
        events: 15,
        category: 'TPS',
        badgeClass: 'bg-primary',
        description: 'Latihan TPS bareng dan saling memotivasi. Target skor tinggi bersama-sama!',
        fullDescription: 'TPS Warriors adalah komunitas yang fokus pada persiapan Tes Potensi Skolastik (TPS). Kami berlatih bersama, berbagi strategi, dan saling memotivasi untuk mencapai skor terbaik.',
        moderators: [
            { name: 'Andi Pratama', avatar: 'AP', role: 'Founder' }
        ],
        discussions: [],
        members: [],
        events: []
    },
    'bahasa-indonesia-club': {
        name: 'Bahasa Indonesia Club',
        icon: 'bi-book-half',
        iconBg: 'bg-warning',
        members: 189,
        discussions: 76,
        posts: 423,
        events: 6,
        category: 'Bahasa Indonesia',
        badgeClass: 'bg-warning',
        description: 'Komunitas untuk diskusi bahasa Indonesia, pemahaman teks, dan tata bahasa.',
        fullDescription: 'Bahasa Indonesia Club adalah komunitas yang membahas segala hal tentang bahasa Indonesia, mulai dari tata bahasa, pemahaman teks, hingga teknik menulis yang baik dan benar.',
        moderators: [
            { name: 'Putri Ayu', avatar: 'PA', role: 'Founder' }
        ],
        discussions: [],
        members: [],
        events: []
    },
    'english-practice': {
        name: 'English Practice',
        icon: 'bi-globe2',
        iconBg: 'bg-danger',
        members: 312,
        discussions: 145,
        posts: 876,
        events: 11,
        category: 'Bahasa Inggris',
        badgeClass: 'bg-danger',
        description: 'Practice English together! Grammar, vocabulary, and reading comprehension.',
        fullDescription: 'English Practice is a community for learning and practicing English together. We focus on grammar, vocabulary building, and reading comprehension for UTBK preparation.',
        moderators: [
            { name: 'Reza Pahlevi', avatar: 'RP', role: 'Founder' }
        ],
        discussions: [],
        members: [],
        events: []
    }
};

function loadCommunityDetail() {
    const urlParams = new URLSearchParams(window.location.search);
    const communityId = urlParams.get('community');
    
    if (!communityId || !communityData[communityId]) {
        window.location.href = 'komunitas.html';
        return;
    }
    
    const community = communityData[communityId];
    
    // Update header
    document.getElementById('communityTitle').textContent = community.name;
    document.getElementById('communityMembers').innerHTML = `<i class="bi bi-people-fill"></i> ${community.members} anggota`;
    document.getElementById('communityDescription').textContent = community.description;
    document.getElementById('communityBadge').textContent = community.category;
    document.getElementById('communityBadge').className = `badge ${community.badgeClass} text-white px-3 py-2`;
    document.getElementById('discussionCount').textContent = community.discussions.length;
    
    // Update avatar
    const avatarIcon = document.querySelector('#communityAvatar i');
    avatarIcon.className = `bi ${community.icon}`;
    
    // Update stats
    document.getElementById('statMembers').textContent = community.members;
    document.getElementById('statDiscussions').textContent = community.discussions.length;
    document.getElementById('statPosts').textContent = community.posts;
    document.getElementById('statEvents').textContent = community.events.length;
    
    // Update page title
    document.title = `Forum Diskusi UTBK – ${community.name}`;
    
    // Load tabs content
    loadDiscussions(community.discussions);
    loadMembers(community.members);
    loadEvents(community.events);
    loadAbout(community);
}

function loadDiscussions(discussions) {
    const container = document.getElementById('communityDiscussions');
    
    if (discussions.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-chat-dots" style="font-size: 4rem; color: #ccc;"></i>
                <h5 class="mt-3 text-muted">Belum ada diskusi</h5>
                <button class="btn btn-primary mt-3 rounded-pill px-4" data-bs-toggle="modal" data-bs-target="#createTopicModal">
                    Mulai Diskusi Pertama
                </button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    discussions.forEach(discussion => {
        const card = createDiscussionCard(discussion);
        container.appendChild(card);
    });
}

function createDiscussionCard(discussion) {
    const div = document.createElement('div');
    div.className = 'topic-card';
    div.setAttribute('data-bs-toggle', 'modal');
    div.setAttribute('data-bs-target', '#topicDetailModal');
    
    div.innerHTML = `
        <div class="d-flex">
            <div class="user-avatar me-3">${discussion.avatar}</div>
            <div class="flex-grow-1">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="mb-1">${discussion.title}</h5>
                    <small class="text-muted">${discussion.time}</small>
                </div>
                <p class="mt-2 mb-3">${discussion.content}</p>
                <div class="topic-meta d-flex gap-3">
                    <span><i class="bi bi-person"></i> ${discussion.author}</span>
                    <span><i class="bi bi-chat-left-text"></i> ${discussion.comments} Komentar</span>
                    <span><i class="bi bi-eye"></i> ${discussion.views} Views</span>
                    <span><i class="bi bi-hand-thumbs-up"></i> ${discussion.likes} Likes</span>
                </div>
            </div>
        </div>
    `;
    
    return div;
}

function loadMembers(members) {
    const container = document.getElementById('communityMembersList');
    
    if (members.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-people" style="font-size: 4rem; color: #ccc;"></i>
                <h5 class="mt-3 text-muted">Belum ada anggota lain</h5>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    members.forEach(member => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4 mb-3';
        col.innerHTML = `
            <div class="card">
                <div class="card-body">
                    <div class="d-flex align-items-center">
                        <div class="user-avatar me-3">${member.avatar}</div>
                        <div>
                            <h6 class="mb-0">${member.name}</h6>
                            <small class="text-muted">${member.role}</small>
                            <br>
                            <small class="text-muted">Bergabung ${member.joined}</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
}

function loadEvents(events) {
    const container = document.getElementById('communityEvents');
    
    if (events.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-calendar-event" style="font-size: 4rem; color: #ccc;"></i>
                <h5 class="mt-3 text-muted">Belum ada event terjadwal</h5>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    events.forEach(event => {
        const card = document.createElement('div');
        card.className = 'card mb-3';
        card.innerHTML = `
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start">
                    <div>
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text">
                            <i class="bi bi-calendar3"></i> ${event.date}<br>
                            <i class="bi bi-clock"></i> ${event.time}
                        </p>
                    </div>
                    <span class="badge bg-primary">${event.participants} peserta</span>
                </div>
                <button class="btn btn-outline-primary btn-sm rounded-pill mt-2">
                    <i class="bi bi-bookmark"></i> Daftar Event
                </button>
            </div>
        `;
        container.appendChild(card);
    });
}

function loadAbout(community) {
    document.getElementById('aboutDescription').textContent = community.fullDescription;
    
    const moderatorsList = document.getElementById('moderatorsList');
    moderatorsList.innerHTML = '';
    
    community.moderators.forEach(mod => {
        const div = document.createElement('div');
        div.className = 'd-flex align-items-center';
        div.innerHTML = `
            <div class="user-avatar me-2" style="width: 40px; height: 40px; font-size: 0.9rem;">${mod.avatar}</div>
            <div>
                <h6 class="mb-0" style="font-size: 0.9rem;">${mod.name}</h6>
                <small class="text-muted">${mod.role}</small>
            </div>
        `;
        moderatorsList.appendChild(div);
    });
}

function setupJoinButton() {
    const joinButton = document.getElementById('joinButton');
    let isJoined = false;
    
    joinButton.addEventListener('click', function() {
        isJoined = !isJoined;
        
        if (isJoined) {
            this.innerHTML = '<i class="bi bi-check-circle-fill"></i> Sudah Bergabung';
            this.classList.remove('btn-light');
            this.classList.add('btn-success');
        } else {
            this.innerHTML = '<i class="bi bi-person-plus-fill"></i> Bergabung';
            this.classList.remove('btn-success');
            this.classList.add('btn-light');
        }
    });
}