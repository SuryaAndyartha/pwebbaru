-- Database: utbk_forum

CREATE DATABASE IF NOT EXISTS utbk_forum;
USE utbk_forum;

-- Tabel Users
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    school VARCHAR(100),
    avatar VARCHAR(255) DEFAULT 'default-avatar.png',
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_email (email)
);

-- Tabel Categories
CREATE TABLE categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(20),
    topic_count INT DEFAULT 0,
    member_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel Communities
CREATE TABLE communities (
    community_id INT PRIMARY KEY AUTO_INCREMENT,
    community_name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    full_description TEXT,
    icon VARCHAR(50),
    icon_bg VARCHAR(20),
    category_id INT,
    creator_id INT,
    member_count INT DEFAULT 0,
    discussion_count INT DEFAULT 0,
    post_count INT DEFAULT 0,
    event_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE SET NULL,
    INDEX idx_slug (slug)
);

-- Tabel Community Members
CREATE TABLE community_members (
    member_id INT PRIMARY KEY AUTO_INCREMENT,
    community_id INT NOT NULL,
    user_id INT NOT NULL,
    role ENUM('member', 'moderator', 'founder') DEFAULT 'member',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (community_id) REFERENCES communities(community_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_membership (community_id, user_id)
);

-- Tabel Topics/Discussions
CREATE TABLE topics (
    topic_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id INT NOT NULL,
    category_id INT,
    community_id INT,
    tags VARCHAR(255),
    view_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (community_id) REFERENCES communities(community_id) ON DELETE SET NULL,
    INDEX idx_category (category_id),
    INDEX idx_community (community_id),
    INDEX idx_created (created_at),
    FULLTEXT KEY ft_search (title, content, tags)
);

-- Tabel Comments
CREATE TABLE comments (
    comment_id INT PRIMARY KEY AUTO_INCREMENT,
    topic_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_comment_id INT,
    content TEXT NOT NULL,
    like_count INT DEFAULT 0,
    is_approved BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (topic_id) REFERENCES topics(topic_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (parent_comment_id) REFERENCES comments(comment_id) ON DELETE CASCADE,
    INDEX idx_topic (topic_id)
);

-- Tabel Likes (untuk topics dan comments)
CREATE TABLE likes (
    like_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    likeable_type ENUM('topic', 'comment') NOT NULL,
    likeable_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_like (user_id, likeable_type, likeable_id),
    INDEX idx_likeable (likeable_type, likeable_id)
);

-- Tabel Events
CREATE TABLE events (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    community_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    participant_count INT DEFAULT 0,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (community_id) REFERENCES communities(community_id) ON DELETE CASCADE,
    FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Tabel Event Participants
CREATE TABLE event_participants (
    participant_id INT PRIMARY KEY AUTO_INCREMENT,
    event_id INT NOT NULL,
    user_id INT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    UNIQUE KEY unique_participant (event_id, user_id)
);

-- Tabel Notifications
CREATE TABLE notifications (
    notification_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type ENUM('comment', 'like', 'mention', 'event', 'community') NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read)
);

-- Tabel Reports (untuk moderasi)
CREATE TABLE reports (
    report_id INT PRIMARY KEY AUTO_INCREMENT,
    reporter_id INT NOT NULL,
    reportable_type ENUM('topic', 'comment', 'user') NOT NULL,
    reportable_id INT NOT NULL,
    reason TEXT NOT NULL,
    status ENUM('pending', 'reviewed', 'resolved') DEFAULT 'pending',
    reviewed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (reporter_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Insert data kategori default
INSERT INTO categories (category_name, description, icon, color) VALUES
('Tes Potensi Skolastik', 'Pemahaman bacaan, penalaran matematika, dan pengetahuan kuantitatif', 'bi-calculator', 'primary'),
('Matematika', 'Aljabar, kalkulus, geometri, dan statistika', 'bi-graph-up', 'success'),
('Bahasa Indonesia', 'Tata bahasa, pemahaman teks, dan penulisan', 'bi-book', 'warning'),
('Bahasa Inggris', 'Grammar, reading comprehension, dan vocabulary', 'bi-globe', 'danger'),
('Fisika', 'Mekanika, termodinamika, listrik, dan optik', 'bi-flask', 'info'),
('Kimia', 'Kimia organik, anorganik, dan fisika', 'bi-atom', 'purple');

-- Insert admin default (password: admin123)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@utbkforum.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', 'admin');