<?php
require_once 'config/database.php';
require_once 'config/helpers.php';
startSession();

if (!isLoggedIn()) {
    setFlashMessage('danger', 'Anda harus login terlebih dahulu');
    redirect('index.php');
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = sanitize($_POST['title']);
    $content = sanitize($_POST['content']);
    $category_id = (int)$_POST['category_id'];
    $tags = sanitize($_POST['tags'] ?? '');
    $author_id = getCurrentUserId();
    
    if (empty($title) || empty($content)) {
        setFlashMessage('danger', 'Judul dan isi topik harus diisi');
        redirect('index.php');
    }
    
    if ($category_id === 0) {
        setFlashMessage('danger', 'Kategori harus dipilih');
        redirect('index.php');
    }
    
    $db = Database::getInstance()->getConnection();
    
    $stmt = $db->prepare("INSERT INTO topics (title, content, author_id, category_id, tags) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssiis", $title, $content, $author_id, $category_id, $tags);
    
    if ($stmt->execute()) {
        $topic_id = $db->insert_id;
        setFlashMessage('success', 'Topik berhasil dibuat!');
        redirect('topic-detail.php?id=' . $topic_id);
    } else {
        setFlashMessage('danger', 'Gagal membuat topik');
        redirect('index.php');
    }
} else {
    redirect('index.php');
}
?>