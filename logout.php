<?php
require_once 'config/helpers.php';
startSession();

// Destroy session
session_destroy();

// Redirect to home
header('Location: index.php');
exit();
?>