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
                            <li><a class="dropdown-item" href="logout.php"><i class="bi bi-box-arrow-right"></i> Logout</a></li>
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