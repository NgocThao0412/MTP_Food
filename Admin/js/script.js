/*admin data*/
document.addEventListener('DOMContentLoaded', function() {

    // Get stored users from localStorage
    function getStoredUsers() {
        const admins = localStorage.getItem('admins');
        return admins ? JSON.parse(admins) : [];
    }

    // Save users to localStorage
    function saveUsers(admin) {
        localStorage.setItem('admins', JSON.stringify(admin));
    }
    
    // Function to save the current user to localStorage after login
    function setCurrentUser(admin) {
        localStorage.setItem('AdminUser', JSON.stringify(admin));
    }

    // Initialize admin and client users
    function initializeUsers() {
        let admins = getStoredUsers();

        // Check if admin and client users already exist, if not add them
        if (!admins.find(admin => admin.email === 'admin@gmail.com')) {
            admins.push({ username: 'Admin', email: 'admin@gmail.com', password: '1234' });
        }
        saveUsers(admins); // Save the updated users list to localStorage
    }

    // Call this function to ensure admin and client are in the users list
    initializeUsers();

    // Handle Login Form Submission
    document.getElementById('Biểu mẫu').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        const Username = document.getElementById('Tên người dùng').value;
        const password = document.getElementById('Mật khẩu').value;
        // const LoginConfirmPassword = document.getElementById('loginConfirmPassword').value;

        const admins = getStoredUsers();
        const admin = admins.find(admin => admin.username === Username && admin.password === password );

        if (admin) {
            alert('Đăng nhập thành công!');
            localStorage.setItem("loggedAd", "true");
            setCurrentUser(admin);
            window.location.replace('./pages/list-product.html');
        } else {
            alert('Email hoặc mật khẩu không hợp lệ!');
        }
    });

});