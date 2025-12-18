<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$host = 'localhost';
$username = 'root';
$password = '';
$database = 'sakhaed_db';

// Create connection
$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(['error' => 'Database connection failed: ' . $conn->connect_error]));
}

// Get request method and action
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

// Handle requests
switch($method) {
    case 'GET':
        handleGetRequest($action, $conn);
        break;
    case 'POST':
        handlePostRequest($action, $conn);
        break;
    default:
        echo json_encode(['error' => 'Method not allowed']);
}

function handleGetRequest($action, $conn) {
    switch($action) {
        case 'courses':
            getCourses($conn);
            break;
        case 'course':
            $id = $_GET['id'] ?? 0;
            getCourse($conn, $id);
            break;
        case 'user':
            $email = $_GET['email'] ?? '';
            getUser($conn, $email);
            break;
        case 'stats':
            getStats($conn);
            break;
        default:
            echo json_encode(['error' => 'Invalid action']);
    }
}

function handlePostRequest($action, $conn) {
    // Get JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    
    switch($action) {
        case 'register':
            registerUser($conn, $input);
            break;
        case 'login':
            loginUser($conn, $input);
            break;
        case 'enroll':
            enrollCourse($conn, $input);
            break;
        case 'payment':
            processPayment($conn, $input);
            break;
        case 'contact':
            saveContact($conn, $input);
            break;
        default:
            echo json_encode(['error' => 'Invalid action']);
    }
}

// Get all courses
function getCourses($conn) {
    $sql = "SELECT * FROM courses WHERE status = 'active' ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    $courses = [];
    while ($row = $result->fetch_assoc()) {
        $courses[] = $row;
    }
    
    echo json_encode(['success' => true, 'courses' => $courses]);
}

// Get single course
function getCourse($conn, $id) {
    $stmt = $conn->prepare("SELECT * FROM courses WHERE id = ?");
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $course = $result->fetch_assoc();
        echo json_encode(['success' => true, 'course' => $course]);
    } else {
        echo json_encode(['error' => 'Course not found']);
    }
}

// Register user
function registerUser($conn, $data) {
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $password = password_hash($data['password'], PASSWORD_DEFAULT);
    $role = $data['role'] ?? 'student';
    
    // Check if email already exists
    $check = $conn->query("SELECT id FROM users WHERE email = '$email'");
    if ($check->num_rows > 0) {
        echo json_encode(['error' => 'Email already registered']);
        return;
    }
    
    $sql = "INSERT INTO users (name, email, password, role) VALUES ('$name', '$email', '$password', '$role')";
    
    if ($conn->query($sql)) {
        echo json_encode([
            'success' => true,
            'message' => 'Registration successful',
            'user_id' => $conn->insert_id,
            'user' => [
                'id' => $conn->insert_id,
                'name' => $name,
                'email' => $email,
                'role' => $role
            ]
        ]);
    } else {
        echo json_encode(['error' => 'Registration failed: ' . $conn->error]);
    }
}

// Login user
function loginUser($conn, $data) {
    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];
    
    $sql = "SELECT * FROM users WHERE email = '$email'";
    $result = $conn->query($sql);
    
    if ($result->num_rows === 0) {
        echo json_encode(['error' => 'User not found']);
        return;
    }
    
    $user = $result->fetch_assoc();
    
    if (password_verify($password, $user['password'])) {
        // Update last login
        $conn->query("UPDATE users SET last_login = NOW() WHERE id = " . $user['id']);
        
        // Remove password from response
        unset($user['password']);
        
        // Generate token
        $token = base64_encode($user['email'] . ':' . time());
        
        echo json_encode([
            'success' => true,
            'user' => $user,
            'token' => $token
        ]);
    } else {
        echo json_encode(['error' => 'Invalid password']);
    }
}

// Enroll in course
function enrollCourse($conn, $data) {
    $user_id = intval($data['user_id']);
    $course_id = intval($data['course_id']);
    
    // Check if already enrolled
    $check = $conn->query("SELECT id FROM enrollments WHERE user_id = $user_id AND course_id = $course_id");
    if ($check->num_rows > 0) {
        echo json_encode(['error' => 'Already enrolled in this course']);
        return;
    }
    
    $sql = "INSERT INTO enrollments (user_id, course_id) VALUES ($user_id, $course_id)";
    
    if ($conn->query($sql)) {
        // Update course enrollment count
        $conn->query("UPDATE courses SET students_enrolled = students_enrolled + 1 WHERE id = $course_id");
        
        echo json_encode([
            'success' => true,
            'message' => 'Course enrollment successful'
        ]);
    } else {
        echo json_encode(['error' => 'Enrollment failed: ' . $conn->error]);
    }
}

// Process payment
function processPayment($conn, $data) {
    $user_id = intval($data['user_id']);
    $course_id = intval($data['course_id']);
    $amount = floatval($data['amount']);
    $method = $conn->real_escape_string($data['method']);
    
    // Generate transaction ID
    $transaction_id = 'TXN' . time() . rand(1000, 9999);
    
    $sql = "INSERT INTO payments (user_id, course_id, transaction_id, amount, payment_method, status) 
            VALUES ($user_id, $course_id, '$transaction_id', $amount, '$method', 'completed')";
    
    if ($conn->query($sql)) {
        // Auto-enroll after payment
        $enroll_sql = "INSERT IGNORE INTO enrollments (user_id, course_id) VALUES ($user_id, $course_id)";
        $conn->query($enroll_sql);
        
        echo json_encode([
            'success' => true,
            'message' => 'Payment successful',
            'transaction_id' => $transaction_id
        ]);
    } else {
        echo json_encode(['error' => 'Payment processing failed: ' . $conn->error]);
    }
}

// Get user by email
function getUser($conn, $email) {
    $stmt = $conn->prepare("SELECT id, name, email, role, created_at FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $user = $result->fetch_assoc();
        echo json_encode(['success' => true, 'user' => $user]);
    } else {
        echo json_encode(['error' => 'User not found']);
    }
}

// Get statistics
function getStats($conn) {
    // Get total users
    $users = $conn->query("SELECT COUNT(*) as total FROM users")->fetch_assoc();
    
    // Get total courses
    $courses = $conn->query("SELECT COUNT(*) as total FROM courses WHERE status = 'active'")->fetch_assoc();
    
    // Get total revenue
    $revenue = $conn->query("SELECT SUM(amount) as total FROM payments WHERE status = 'completed'")->fetch_assoc();
    
    echo json_encode([
        'success' => true,
        'stats' => [
            'total_users' => $users['total'] ?? 0,
            'total_courses' => $courses['total'] ?? 0,
            'total_revenue' => $revenue['total'] ?? 0
        ]
    ]);
}

// Save contact message
function saveContact($conn, $data) {
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $subject = $conn->real_escape_string($data['subject']);
    $message = $conn->real_escape_string($data['message']);
    
    $sql = "INSERT INTO contacts (name, email, subject, message) VALUES ('$name', '$email', '$subject', '$message')";
    
    if ($conn->query($sql)) {
        echo json_encode([
            'success' => true,
            'message' => 'Thank you for your message! We will get back to you soon.'
        ]);
    } else {
        echo json_encode(['error' => 'Failed to save message']);
    }
}

$conn->close();
?>