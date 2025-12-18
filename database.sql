-- Create database
CREATE DATABASE IF NOT EXISTS sakhaed_db;
USE sakhaed_db;

-- Users table
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('student', 'teacher', 'admin') DEFAULT 'student',
    avatar VARCHAR(255),
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- Courses table
CREATE TABLE courses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    instructor_id INT,
    price DECIMAL(10, 2) DEFAULT 0,
    discount_price DECIMAL(10, 2) DEFAULT 0,
    duration_hours INT,
    difficulty ENUM('beginner', 'intermediate', 'advanced') DEFAULT 'beginner',
    thumbnail VARCHAR(255),
    rating DECIMAL(3, 2) DEFAULT 0,
    total_ratings INT DEFAULT 0,
    students_enrolled INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('active', 'draft', 'archived') DEFAULT 'active',
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_status (status)
);

-- Enrollments table
CREATE TABLE enrollments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    course_id INT,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INT DEFAULT 0,
    completed_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_id, course_id),
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id)
);

-- Payments table
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    course_id INT,
    transaction_id VARCHAR(100) UNIQUE,
    amount DECIMAL(10, 2),
    currency VARCHAR(10) DEFAULT 'USD',
    payment_method VARCHAR(50),
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_transaction_id (transaction_id),
    INDEX idx_user_id (user_id),
    INDEX idx_status (status)
);

-- Course modules
CREATE TABLE modules (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    content TEXT,
    video_url VARCHAR(255),
    duration_minutes INT,
    sort_order INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id)
);

-- User progress
CREATE TABLE user_progress (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    module_id INT,
    course_id INT,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP NULL,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_progress (user_id, module_id),
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id)
);

-- Quiz results
CREATE TABLE quiz_results (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    course_id INT,
    module_id INT,
    score INT,
    total_questions INT,
    taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id)
);

-- Certificates
CREATE TABLE certificates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT,
    course_id INT,
    certificate_id VARCHAR(50) UNIQUE,
    issued_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    download_url VARCHAR(255),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id)
);

-- Contacts table
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status)
);

-- Insert sample admin user
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@sakhaed.com', '$2y$10$YourHashedPasswordHere', 'admin');

-- Insert sample courses
INSERT INTO courses (title, description, category, price, duration_hours, difficulty) VALUES
('HTML5 & CSS3 Mastery', 'Master modern web development with HTML5 and CSS3', 'Web Development', 0, 40, 'beginner'),
('JavaScript Fundamentals', 'Learn JavaScript from scratch to advanced concepts', 'Programming', 49.99, 60, 'beginner'),
('Python for Data Science', 'Data analysis and visualization with Python', 'Data Science', 79.99, 80, 'intermediate'),
('React Native Mobile Development', 'Build mobile apps with React Native', 'Mobile Development', 69.99, 70, 'intermediate'),
('Database Design & SQL', 'Learn database design principles and SQL queries', 'Database', 59.99, 50, 'beginner'),
('UI/UX Design Fundamentals', 'Learn user interface and user experience design', 'Design', 49.99, 45, 'beginner');

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_enrollments_user_course ON enrollments(user_id, course_id);