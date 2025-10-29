// Hàm bật/tắt menu cho giao diện mobile
function toggleMenu(hamburger) {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active'); // Bật/tắt hiển thị menu

    // Đổi trạng thái "active" cho cả hai biểu tượng hamburger
    document.querySelectorAll('.hamburger').forEach(icon => {
        icon.classList.toggle('active');
    });
}

// Hàm xử lý khi nhấn vào nút tìm kiếm (chưa thêm logic)
function myFunction() {
    const input = document.getElementById('search');
    // Nơi bạn thêm chức năng tìm kiếm
}

// Khi click vào logo → trở về trang chủ
const logo = document.querySelector('.logo');
if (logo) {
    logo.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = '../index.html';
    });
}



/* --- XỬ LÝ FORM ĐĂNG NHẬP / ĐĂNG KÝ --- */
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelectorAll('.btnLogin-popup');   // Nút mở form đăng nhập
const btnOutPopup = document.querySelectorAll('.btnLogout-popup'); // Nút mở form đăng ký
let isRegisterForm = false; // Biến theo dõi form đang hiển thị (login hay register)


// Mở form đăng nhập
btnPopup.forEach(btn => {
    btn.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
        wrapper.classList.remove('active');
        isRegisterForm = false;
    });
});

// Mở form đăng ký
btnOutPopup.forEach(btn => {
    btn.addEventListener('click', () => {
        wrapper.classList.add('active-popup');
        wrapper.classList.add('active');
        isRegisterForm = true;
    });
});


/* --- DỮ LIỆU TRANG CHÍNH (HOME) --- */
document.addEventListener('DOMContentLoaded', function() {
    const loginLink = document.querySelector('.login-link');
    const registerLink = document.querySelector('.register-link');
    const loginForm = document.querySelector(".form-box.login");
    const registerForm = document.querySelector(".form-box.register");
    let isRegisterForm = false;
    
    // Khi truy cập URL có "#register" → hiển thị form đăng ký
    if (window.location.hash === "#register") {
        wrapper.classList.add("active");
    }

    // Chuyển qua form đăng ký
    registerLink.addEventListener("click", (e) => {
        e.preventDefault();
        wrapper.classList.add("active");
    });

    // Chuyển lại form đăng nhập
    loginLink.addEventListener("click", (e) => {
        e.preventDefault();
        wrapper.classList.remove("active");
    });


    /* --- XỬ LÝ NGƯỜI DÙNG LOCAL STORAGE --- */

    // Lấy danh sách người dùng đã lưu trong localStorage
    function getStoredUsers() {
        const users = localStorage.getItem('users');
        return users ? JSON.parse(users) : [];
    }

    // Lưu danh sách người dùng vào localStorage
    function saveUsers(users) {
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Lưu thông tin người dùng hiện tại sau khi đăng nhập
    function setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}


    // Tạo sẵn 1 user mẫu “Client”
    function initializeUsers() {
        let users = getStoredUsers();

        if (!users.find(user => user.email === 'client@gmail.com')) {
            users.push({ 
                username: 'Client', 
                email: 'client@gmail.com', 
                password: '123', 
                phone: '0812345678', 
                address: '273 Đ. An Dương Vương, Phường 3, Quận 5, Hồ Chí Minh' ,
            });
        }

        saveUsers(users);
    }

    initializeUsers(); // Gọi hàm khởi tạo

       /* --- FORM ĐĂNG NHẬP --- */
    document.getElementById('loginForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const userName = document.getElementById('loginUserName').value;
        const password = document.getElementById('loginPassword').value;

        const users = getStoredUsers();
        const user = users.find(user => user.username === userName && user.password === password );
        
        if (user) {
            alert('Đăng nhập thành công!');
            setCurrentUser(user);
            localStorage.setItem("loggedIn", "true");
            window.location.href = '../Client/user-index.html';
        } else {
            alert('Sai tên đăng nhập hoặc mật khẩu!');
        }
    });


const registerFormEl = document.getElementById('registerForm');
console.log('Register form:', registerFormEl); // <-- Thêm dòng này

    // ✅ FORM ĐĂNG KÝ — CHỈ CẦN NÀY LÀ ĐỦ
if (registerFormEl) {
  registerFormEl.addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPasswordInput = document.getElementById('registerConfirmPassword');
    const confirmPassword = confirmPasswordInput.value;
    const phone = document.getElementById('registerPhone').value.trim();
    const address = document.getElementById('registerAddress').value.trim();
    const termsCheckbox = document.getElementById('termsCheckbox');
    const checkboxError = document.querySelector('.form-message-checkbox');
    const passwordError = document.querySelector('.form-message-password');
    const regex = /[\s\u00C0-\u1EF9]/;
    const users = getStoredUsers();

    if (!termsCheckbox.checked) {
      checkboxError.innerHTML = 'Vui lòng đồng ý với điều khoản trước khi đăng ký!';
      return;
    } else {
      checkboxError.innerHTML = '';
    }

    if (users.find(u => u.email === email || u.username === username)) {
      alert('Email hoặc tên đăng nhập đã tồn tại!');
      return;
    }

    if (phone.length !== 10) {
      alert('Số điện thoại phải có 10 chữ số!');
      return;
    }

    if (regex.test(username)) {
      alert('Tên đăng nhập không được chứa ký tự có dấu hoặc khoảng trắng!');
      return;
    }

    if (password !== confirmPassword) {
      passwordError.innerHTML = 'Mật khẩu xác nhận không khớp!';
      confirmPasswordInput.classList.add('error');
      return;
    } else {
      passwordError.innerHTML = '';
      confirmPasswordInput.classList.remove('error');
    }

    // ✅ Lưu user mới
    users.push({ username, email, password, phone, address, role: 'client' });
    saveUsers(users);

    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("currentUser", JSON.stringify({ username, email }));

    alert('Đăng ký thành công!');
    setTimeout(() => {
      window.location.href = '../Client/user-index.html';
    }, 200);
  });
}


    /* --- LẤY NGƯỜI DÙNG ĐANG ĐĂNG NHẬP --- */
    function getCurrentUser() {
    const currentUser = localStorage.getItem('currentUser');
    return currentUser ? JSON.parse(currentUser) : null;
}
    // Kiểm tra trạng thái đăng nhập

    function isLoggedIn() {
        return !!getCurrentUser(); // Trả về true nếu đã đăng nhập
    }

    /* --- XỬ LÝ GIỎ HÀNG (nếu chưa login thì bật form đăng nhập) --- */
    const cartBtn = document.querySelectorAll('.sp-cart');
    if (cartBtn.length > 0) {
        cartBtn.forEach(button => {
            button.addEventListener('click', function(event) {
                event.preventDefault();
                
                if (!isLoggedIn()) {
                    // alert('Vui lòng đăng nhập để xem giỏ hàng!');
                } else {
                    console.log('Đang mở giỏ hàng...');
                }
            });
        });
    }


    /* --- DỮ LIỆU MENU (Mousse / Croissant / Drink) --- */
    const menuItems = {
        Mousse: [
            { links: './Home/product/index-1.html', id: '1', name: 'Avocado Mousse', price: '510,000 VND', image: './Img/Mousse/Avocado_Mousse.jpg' },
            { links: './Home/product/index-2.html', id: '2', name: 'Blueberry Mousse', price: '510,000 VND', image: './Img/Mousse/Blueberry_Mousse.jpg' },
            // ...
        ],
        Croissant: [
            { links: './Home/product/index-7.html', id: '7', name: 'Avocado Croissant', price: '110,000 VND', image: './Img/Croissant/Avocado_Croissant.jpg' },
            // ...
        ],
        Drink: [
            { links: './Home/product/index-13.html', id: '13', name: 'Choco Mallow', price: '55,000 VND', image: './Img/Drink/Choco_Mallow.png' },
            // ...
        ],
    };


    /* --- HÀM LỌC SẢN PHẨM THEO DANH MỤC --- */
    function filterItems(category) {
        const navLinks = document.querySelectorAll('.nav-links label');
        const tabContents = document.querySelectorAll('.tab_content');

        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`label[for="filter-${category.toLowerCase()}"]`);
        if (activeLink) activeLink.classList.add('active');

        tabContents.forEach(content => {
            content.style.opacity = '0';
            setTimeout(() => { content.style.display = 'none'; }, 300);
        });

        const selectedContent = document.getElementById(category);
        if (selectedContent) {
            setTimeout(() => {
                selectedContent.style.display = 'grid';
                requestAnimationFrame(() => {
                    selectedContent.style.opacity = '1';
                });
            }, 300);
        }
    }


    /* --- HÀM TẠO THẺ SẢN PHẨM --- */
    function createItemCard(item) {
        const card = document.createElement('div');
        card.className = 'movie-item';
        card.innerHTML = `
            <a href="${item.links}" target="_blank">
                <img class="poster-img" height="300" width="300" src="${item.image}" alt="${item.name}">
            </a>
            <p class="title">${item.name}</p>
            <button class="sp-cart butn title" data-id="${item.id}">
                <p class="text-color">Giá: ${item.price}</p>
            </button>
        `;

        // Kiểm tra đăng nhập khi thêm giỏ hàng
        const cartBtn = card.querySelector('.sp-cart')
        cartBtn.addEventListener('click', function (event) {
            event.preventDefault();

            if (!isLoggedIn()) {
                wrapper.classList.add('active-popup');
                wrapper.classList.remove('active');
                isRegisterForm = false;
                blurOverlay.classList.add('active');
                console.log('Hãy đăng nhập trước!');
            } else {
                console.log('Xem giỏ hàng...');
            }
        });

        return card;
    }

    // Hàm thêm sản phẩm vào từng danh mục
    function addItemsToCategory(categoryId, items) {
        const container = document.getElementById(categoryId);
        if (container) {
            items.forEach(item => {
                container.appendChild(createItemCard(item));
            });
        }
    }

    // Khởi tạo sản phẩm cho từng danh mục
    Object.entries(menuItems).forEach(([category, items]) => {
        addItemsToCategory(category, items);
        addItemsToCategory('All', items);
    });

    /* --- HÀM TÌM KIẾM VÀ GỢI Ý (hint) --- */
    function showHints() {
        const searchInput = document.getElementById('search');
        const hintContainer = document.getElementById('hintContainer');
        const searchTerm = searchInput.value.toLowerCase();

        hintContainer.innerHTML = '';

        if (searchTerm) {
            Object.values(menuItems).flat().forEach(item => {
                if (item.name.toLowerCase().includes(searchTerm)) {
                    const hintItem = document.createElement('div');
                    hintItem.className = 'hint-item';

                    const hintImage = document.createElement('img');
                    hintImage.src = item.image;
                    hintImage.alt = item.name;
                    hintImage.style.width = '30px';
                    hintImage.style.height = '30px';
                    hintImage.style.marginRight = '10px';

                    hintItem.appendChild(hintImage);
                    hintItem.appendChild(document.createTextNode(item.name));

                    hintItem.onclick = function() {
                        searchInput.value = item.name;
                        hintContainer.innerHTML = '';
                        hintContainer.style.display = 'none';
                        searchItems();
                    };
                    hintContainer.appendChild(hintItem);
                }
            });
            hintContainer.style.display = hintContainer.innerHTML ? 'block' : 'none';
        } else {
            hintContainer.style.display = 'none';
        }
    }

    /* --- XỬ LÝ KHI NGƯỜI DÙNG NHẤN NÚT TÌM KIẾM --- */
    const searchBtn = document.querySelector('.searchBtn');
if (searchBtn) {
    searchBtn.addEventListener('click', function() {
        searchItems();
    });
}


    const searchInput = document.getElementById('search');
const hintContainer = document.getElementById('hintContainer');

if (searchInput) {
    // Khi nhấn Enter
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') searchItems();
    });

    // Khi rời khỏi ô tìm kiếm
    searchInput.addEventListener('blur', () => {
        setTimeout(() => {
            if (hintContainer) {
                hintContainer.innerHTML = '';
                hintContainer.style.display = 'none';
            }
        }, 200);
    });

    // Khi nhập vào ô tìm kiếm (dòng 378)
    searchInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            filterItems('All');
        } else {
            showHints();
        }
    });
}

    // Hàm thực hiện tìm kiếm thực tế
    function searchItems() {
        const searchTerm = document.getElementById('search').value.toLowerCase();
        const allContainer = document.getElementById('All');
        const mousseContainer = document.getElementById('Mousse');
        const croissantContainer = document.getElementById('Croissant');
        const drinkContainer = document.getElementById('Drink');

        allContainer.innerHTML = '';
        mousseContainer.innerHTML = '';
        croissantContainer.innerHTML = '';
        drinkContainer.innerHTML = '';

        for (const category in menuItems) {
            menuItems[category].forEach(item => {
                if (item.name.toLowerCase().includes(searchTerm)) {
                    const itemCard = createItemCard(item);
                    if (category === 'Mousse') mousseContainer.appendChild(itemCard);
                    else if (category === 'Croissant') croissantContainer.appendChild(itemCard);
                    else if (category === 'Drink') drinkContainer.appendChild(itemCard);
                    allContainer.appendChild(itemCard.cloneNode(true));
                }
            });
        }

        hintContainer.innerHTML = '';
        hintContainer.style.display = 'none';
    }
});

window.getStoredUsers = function() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
};

