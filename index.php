<?php
date_default_timezone_set('Asia/Jakarta');
require_once 'config/database.php';
require_once 'config/helpers.php';
startSession();

// Get latest topics
$db = Database::getInstance()->getConnection();
$stmt = $db->prepare("
    SELECT t.*, u.username, u.full_name, c.category_name, c.color as category_color
    FROM topics t
    JOIN users u ON t.author_id = u.user_id
    LEFT JOIN categories c ON t.category_id = c.category_id
    WHERE t.is_approved = 1
    ORDER BY t.created_at DESC
    LIMIT 3
");
$stmt->execute();
$latestTopics = $stmt->get_result()->fetch_all(MYSQLI_ASSOC);

// Get statistics
$stats = [];
$stats['members'] = $db->query("SELECT COUNT(*) as count FROM users")->fetch_assoc()['count'];
$stats['topics'] = $db->query("SELECT COUNT(*) as count FROM topics")->fetch_assoc()['count'];
$stats['comments'] = $db->query("SELECT COUNT(*) as count FROM comments")->fetch_assoc()['count'];
$stats['communities'] = $db->query("SELECT COUNT(*) as count FROM communities")->fetch_assoc()['count'];
?>
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Forum Diskusi UTBK</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css">
    <link rel="stylesheet" href="css/style.css">
</head>

<body>
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-custom sticky-top">
        <div class="container">
            <a class="navbar-brand" href="index.php">
                <i class="bi bi-mortarboard-fill"></i> UTBK Forum
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link btn btn-light text-primary ms-2 px-3 rounded-pill" href="index.php">Beranda</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-light text-primary ms-2 px-3 rounded-pill" href="kategori.php">Kategori</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-light text-primary ms-2 px-3 rounded-pill" href="komunitas.php">Komunitas</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link btn btn-light text-primary ms-2 px-3 rounded-pill" href="diskusi.php">Diskusi</a>
                    </li>
                    <?php if (isLoggedIn()): ?>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle btn btn-light text-primary ms-2 px-3 rounded-pill" href="#" role="button" data-bs-toggle="dropdown">
                                <i class="bi bi-person-circle"></i> <?php echo htmlspecialchars($_SESSION['username']); ?>
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="profile.php"><i class="bi bi-person"></i> Profil</a></li>
                                <?php if (isAdmin()): ?>
                                    <li><a class="dropdown-item" href="admin/dashboard.php"><i class="bi bi-speedometer2"></i> Dashboard Admin</a></li>
                                <?php endif; ?>
                                <li><a class="dropdown-item" href="my-topics.php"><i class="bi bi-chat-dots"></i> Topik Saya</a></li>
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="#" data-action="logout"><i class="bi bi-box-arrow-right"></i> Logout</a></li>
                            </ul>
                        </li>
                    <?php else: ?>
                        <li class="nav-item">
                            <a class="nav-link btn btn-light text-primary ms-2 px-3 rounded-pill" href="#" data-bs-toggle="modal" data-bs-target="#loginModal">Login</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link btn btn-light text-primary ms-2 px-3 rounded-pill" href="#" data-bs-toggle="modal" data-bs-target="#registerModal">Daftar</a>
                        </li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Flash Messages -->
    <?php 
    $flash = getFlashMessage();
    if ($flash): 
    ?>
        <div class="container mt-3">
            <div class="alert alert-<?php echo $flash['type']; ?> alert-dismissible fade show" role="alert">
                <?php echo htmlspecialchars($flash['message']); ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        </div>
    <?php endif; ?>

    <!-- Hero Section -->
    <section class="hero-section" id="home">
        <div class="container text-center">
            <h1><i class="bi bi-chat-dots-fill"></i> Forum Diskusi UTBK</h1>
            <p>Wadah belajar bersama dan berbagi materi persiapan UTBK</p>
            <?php if (isLoggedIn()): ?>
                <button class="btn btn-light btn-lg mt-3 px-5 rounded-pill" data-bs-toggle="modal" data-bs-target="#createTopicModal">
                    <i class="bi bi-plus-circle"></i> Buat Topik Baru
                </button>
            <?php else: ?>
                <button class="btn btn-light btn-lg mt-3 px-5 rounded-pill" data-bs-toggle="modal" data-bs-target="#loginModal">
                    <i class="bi bi-plus-circle"></i> Login untuk Buat Topik
                </button>
            <?php endif; ?>
        </div>
    </section>

    <!-- Stats Section -->
    <div class="container mb-5">
        <div class="row">
            <div class="col-md-3 mb-3">
                <div class="stats-card">
                    <div class="stats-number"><?php echo number_format($stats['members']); ?></div>
                    <div class="text-muted">Anggota</div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="stats-card">
                    <div class="stats-number"><?php echo number_format($stats['topics']); ?></div>
                    <div class="text-muted">Topik</div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="stats-card">
                    <div class="stats-number"><?php echo number_format($stats['comments']); ?></div>
                    <div class="text-muted">Komentar</div>
                </div>
            </div>
            <div class="col-md-3 mb-3">
                <div class="stats-card">
                    <div class="stats-number"><?php echo number_format($stats['communities']); ?></div>
                    <div class="text-muted">Komunitas</div>
                </div>
            </div>
        </div>
    </div>

    <!-- Diskusi Terbaru Section -->
    <section class="container mb-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="fw-bold">Diskusi Terbaru</h2>
            <a href="diskusi.php" class="btn btn-outline-primary rounded-pill">Lihat Semua</a>
        </div>

        <!-- Topic Cards -->
        <?php foreach ($latestTopics as $topic): ?>
            <div class="topic-card" onclick="window.location.href='topic-detail.php?id=<?php echo $topic['topic_id']; ?>'">
                <div class="d-flex">
                    <div class="user-avatar me-3"><?php echo getUserInitials($topic['full_name'] ?: $topic['username']); ?></div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <div>
                                <h5 class="mb-1"><?php echo htmlspecialchars($topic['title']); ?></h5>
                                <span class="badge bg-<?php echo $topic['category_color']; ?> badge-custom">
                                    <?php echo htmlspecialchars($topic['category_name']); ?>
                                </span>
                            </div>
                            <small class="text-muted"><?php echo timeAgo($topic['created_at']); ?></small>
                        </div>
                        <p class="mt-2 mb-3"><?php echo htmlspecialchars(truncate($topic['content'], 150)); ?></p>
                        <div class="topic-meta d-flex gap-3">
                            <span><i class="bi bi-person"></i> <?php echo htmlspecialchars($topic['username']); ?></span>
                            <span><i class="bi bi-chat-left-text"></i> <?php echo $topic['comment_count']; ?> Komentar</span>
                            <span><i class="bi bi-eye"></i> <?php echo $topic['view_count']; ?> Views</span>
                            <span><i class="bi bi-hand-thumbs-up"></i> <?php echo $topic['like_count']; ?> Likes</span>
                        </div>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>

        <?php if (empty($latestTopics)): ?>
            <div class="text-center py-5">
                <i class="bi bi-inbox" style="font-size: 4rem; color: #ccc;"></i>
                <h5 class="mt-3 text-muted">Belum ada diskusi</h5>
                <p class="text-muted">Jadilah yang pertama membuat topik diskusi!</p>
            </div>
        <?php endif; ?>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="row">
                <div class="col-md-4 mb-3">
                    <h5><i class="bi bi-mortarboard-fill"></i> UTBK Forum</h5>
                    <p>Platform diskusi terbaik untuk persiapan UTBK</p>
                </div>
                <div class="col-md-4 mb-3">
                    <h5>Link Cepat</h5>
                    <ul class="list-unstyled">
                        <li><a href="#" class="text-white text-decoration-none">Tentang Kami</a></li>
                        <li><a href="#" class="text-white text-decoration-none">Panduan Forum</a></li>
                        <li><a href="#" class="text-white text-decoration-none">Kebijakan Privasi</a></li>
                    </ul>
                </div>
                <div class="col-md-4 mb-3">
                    <h5>Hubungi Kami</h5>
                    <p><i class="bi bi-envelope"></i> info@utbkforum.com</p>
                    <div class="social-links">
                        <a href="#" class="text-white me-2"><i class="bi bi-facebook"></i></a>
                        <a href="#" class="text-white me-2"><i class="bi bi-twitter"></i></a>
                        <a href="#" class="text-white me-2"><i class="bi bi-instagram"></i></a>
                    </div>
                </div>
            </div>
            <hr style="border-color: rgba(255,255,255,0.2)">
            <div class="text-center">
                <small>&copy; 2024 UTBK Forum. All rights reserved.</small>
            </div>
        </div>
    </footer>

    <!-- Modals -->
    <?php include 'includes/modals.php'; ?>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="js/common.js"></script>
    <script src="js/auth-dynamic.js"></script>
    <script src="js/forum-dynamic.js"></script>
</body>
</html>
