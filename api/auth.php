<?php
date_default_timezone_set('Asia/Jakarta');
// api/auth.php - Authentication handler

require_once '../config/database.php';
require_once '../config/helpers.php';

header('Content-Type: application/json');
startSession();

$response = ['success' => false, 'message' => ''];

// Get request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = $_POST['action'] ?? $_GET['action'] ?? '';

$db = Database::getInstance()->getConnection();

switch ($action) {
    case 'register':
        if ($method === 'POST') {
            $username = sanitize($_POST['username'] ?? '');
            $email = sanitize($_POST['email'] ?? '');
            $password = $_POST['password'] ?? '';
            $confirm_password = $_POST['confirm_password'] ?? '';
            
            // Validation
            if (empty($username) || empty($email) || empty($password)) {
                $response['message'] = 'Semua field harus diisi';
                break;
            }
            
            if (strlen($username) < 3) {
                $response['message'] = 'Username minimal 3 karakter';
                break;
            }
            
            if (!isValidEmail($email)) {
                $response['message'] = 'Email tidak valid';
                break;
            }
            
            if (strlen($password) < 8) {
                $response['message'] = 'Password minimal 8 karakter';
                break;
            }
            
            if ($password !== $confirm_password) {
                $response['message'] = 'Password tidak cocok';
                break;
            }
            
            // Check if username exists
            $stmt = $db->prepare("SELECT user_id FROM users WHERE username = ?");
            $stmt->bind_param("s", $username);
            $stmt->execute();
            if ($stmt->get_result()->num_rows > 0) {
                $response['message'] = 'Username sudah digunakan';
                break;
            }
            
            // Check if email exists
            $stmt = $db->prepare("SELECT user_id FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            if ($stmt->get_result()->num_rows > 0) {
                $response['message'] = 'Email sudah terdaftar';
                break;
            }
            
            // Hash password and insert user
            $hashed_password = hashPassword($password);
            $stmt = $db->prepare("INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)");
            $stmt->bind_param("ssss", $username, $email, $hashed_password, $username);
            
            if ($stmt->execute()) {
                $response['success'] = true;
                $response['message'] = 'Registrasi berhasil! Silakan login.';
            } else {
                $response['message'] = 'Terjadi kesalahan saat registrasi';
            }
        }
        break;
        
    case 'login':
        if ($method === 'POST') {
            $email = sanitize($_POST['email'] ?? '');
            $password = $_POST['password'] ?? '';
            $remember = isset($_POST['remember']);
            
            if (empty($email) || empty($password)) {
                $response['message'] = 'Email dan password harus diisi';
                break;
            }
            
            // Get user from database
            $stmt = $db->prepare("SELECT user_id, username, email, password, full_name, role, avatar, is_active FROM users WHERE email = ?");
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $result = $stmt->get_result();
            
            if ($result->num_rows === 0) {
                $response['message'] = 'Email atau password salah';
                break;
            }
            
            $user = $result->fetch_assoc();
            
            if (!$user['is_active']) {
                $response['message'] = 'Akun Anda telah dinonaktifkan';
                break;
            }
            
            if (verifyPassword($password, $user['password'])) {
                // Set session
                $_SESSION['user_id'] = $user['user_id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['email'] = $user['email'];
                $_SESSION['full_name'] = $user['full_name'];
                $_SESSION['role'] = $user['role'];
                $_SESSION['avatar'] = $user['avatar'];
                
                // Update last login
                $stmt = $db->prepare("UPDATE users SET last_login = NOW() WHERE user_id = ?");
                $stmt->bind_param("i", $user['user_id']);
                $stmt->execute();
                
                // Set remember me cookie
                if ($remember) {
                    $token = bin2hex(random_bytes(32));
                    setcookie('remember_token', $token, time() + (86400 * 30), '/');
                    // Store token in database (you should create a remember_tokens table)
                }
                
                $response['success'] = true;
                $response['message'] = 'Login berhasil!';
                $response['user'] = [
                    'username' => $user['username'],
                    'role' => $user['role']
                ];
            } else {
                $response['message'] = 'Email atau password salah';
            }
        }
        break;
        
    case 'logout':
        session_destroy();
        $response['success'] = true;
        $response['message'] = 'Logout berhasil';
        break;
        
    case 'check':
        if (isLoggedIn()) {
            $response['success'] = true;
            $response['user'] = getCurrentUser();
        } else {
            $response['message'] = 'Not logged in';
        }
        break;
        
    default:
        $response['message'] = 'Invalid action';
}

echo json_encode($response);
?>
