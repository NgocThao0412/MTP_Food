// --- CÁC HÀM CỦA SIDEBAR VÀ MENU ---
function toggleMenu(hamburger) {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("active");
  document.querySelectorAll(".hamburger").forEach((icon) => {
    icon.classList.toggle("active");
  });
}

function setupSidebarActiveState() {
  const currentPage = window.location.pathname.split("/").pop();
  if (!currentPage) return;

  document.querySelectorAll(".sidebar-list-item.tab-content").forEach((item) => {
    item.classList.remove("active");
  });

  const allLinks = document.querySelectorAll(".sidebar-link");

  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (!linkHref) return;
    
    const linkPage = linkHref.split("/").pop();

    if (linkPage === currentPage) {
      const submenu = link.closest(".submenu");
      if (submenu) {
        submenu.style.display = "block";
        const parentLi = submenu.closest(".sidebar-list-item.tab-content");
        if (parentLi) {
          parentLi.classList.add("active");
          const parentLink = parentLi.querySelector(".sidebar-link");
          if (parentLink) {
            parentLink.classList.add("active");
          }
        }
      } else {
        const parentLi = link.closest(".sidebar-list-item.tab-content");
        if (parentLi) {
          parentLi.classList.add("active");
        }
      }
    }
  });
}

window.toggleSubmenu = function (linkElement, submenuId) {
  const submenu = document.getElementById(submenuId);
  if (!submenu) return;
  linkElement.classList.toggle("active");
  if (submenu.style.display === "block") {
    submenu.style.display = "none";
  } else {
    submenu.style.display = "block";
  }
};

function toggleGrade(contentId, chevronId) {
  var chevron = document.querySelectorAll("#" + chevronId);
  var content = document.querySelectorAll("#" + contentId);

  chevron.forEach((btn) => {
    btn.classList.toggle("up");
    btn.classList.toggle("down");
  });

  content.forEach((btn) => {
    if (btn.style.display === "none") {
      btn.style.display = "block";
    } else {
      btn.style.display = "none";
    }
  });
}
// --- KẾT THÚC HÀM SIDEBAR ---


document.addEventListener("DOMContentLoaded", function () {
  setupSidebarActiveState();

  // --- HIỂN THỊ ADMIN TÊN Ở SIDEBAR (HIỂN THỊ CỨNG) ---
  const nameAcc = document.getElementById("name-acc");
  if (nameAcc) {
    nameAcc.textContent = "Admin"; // Gắn tên admin mặc định
  }

  // --- XỬ LÝ NÚT ĐĂNG XUẤT Ở SIDEBAR ---
  const logoutAcc = document.getElementById("logout-acc");
  if (logoutAcc) {
    logoutAcc.addEventListener("click", (e) => {
      e.preventDefault();
      // Đã xóa logic localStorage.removeItem("AdminUser") vì không còn dùng
      alert("Đăng xuất thành công!");
      window.location.href = "../index.html"; // Chuyển đến trang index/đăng nhập
    });
  }

  // --- KHỞI TẠO DANH SÁCH NGƯỜI DÙNG (GIỮ LẠI) ---
  const users = [
    {
      id: "CT001",
      username: "user1",
      password: "123456",
      email: "user1@gmail.com",
      firstName: "First1",
      lastName: "Last1",
    },
    {
      id: "user4323",
      username: "user2",
      password: "123456",
      email: "user2@gmail.com",
      firstName: "First2",
      lastName: "Last2",
    },
    // ... (các user khác) ...
    {
      id: "user4327",
      username: "user6",
      password: "123456",
      email: "user6@gmail.com",
      firstName: "First6",
      lastName: "Last6",
    },
  ];

  // Chỉ lưu userList vào localStorage nếu nó chưa tồn tại
  if (!localStorage.getItem("userList")) {
    localStorage.setItem("userList", JSON.stringify(users));
  }
  
  // --- LOAD DANH SÁCH NGƯỜI DÙNG RA BẢNG ---
  function loadUsers() {
    const users = JSON.parse(localStorage.getItem("userList")) || [];
    users.forEach((user) => addUserToTable(user));
  }

  loadUsers();

  // --- XỬ LÝ NÚT SAVE TRONG MODAL ---
  const save = document.querySelector(".save-btn");
  if (save) {
    save.addEventListener("click", function (event) {
      event.preventDefault();
      // Chỗ này bạn có hàm showConfirmation() nhưng chưa định nghĩa,
      // Có lẽ bạn muốn gọi hàm saveUser() ở đây?
      // showConfirmation(); 
      
      // Nếu muốn bấm save là lưu luôn, hãy gọi:
      // saveUser();
    });
  }
});

// --- TOÀN BỘ CÁC HÀM QUẢN LÝ NGƯỜI DÙNG (GIỮ NGUYÊN) ---

let userIdCounter = 4321; // Bạn có thể đặt số này dựa trên user cuối cùng

function showAddUserForm() {
  document.getElementById("modalTitle").innerText = "Add User";
  document.getElementById("userModal").style.display = "flex";
  clearFormFields();
}

function showEditUserForm(userId) {
  document.getElementById("modalTitle").innerText = "Edit User";
  document.getElementById("userModal").setAttribute("data-edit-id", userId);

  const row = document.getElementById(userId);

  if (row) {
    document.getElementById("username").value = row.cells[1].innerText;
    document.getElementById("email").value = row.cells[2].innerText;
    document.getElementById("firstName").value = row.cells[3].innerText;
    document.getElementById("lastName").value = row.cells[4].innerText;
    document.getElementById("userModal").style.display = "flex";
  } else {
    console.error(`Row with ID ${userId} not found.`);
  }
}

function saveUser() {
  const username = document.getElementById("username").value.trim();
  const email = document.getElementById("email").value.trim();
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();

  if (!username || !email || !firstName || !lastName) {
    alert("All fields are required.");
    return;
  }

  const modalTitle = document.getElementById("modalTitle").innerText;
  const isEdit = modalTitle === "Edit User";

  let users = JSON.parse(localStorage.getItem("userList")) || [];

  if (isEdit) {
    const userId = document
      .getElementById("userModal")
      .getAttribute("data-edit-id");
    const row = document.getElementById(userId);
    row.cells[1].innerText = username;
    row.cells[2].innerText = email;
    row.cells[3].innerText = firstName;
    row.cells[4].innerText = lastName;

    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex > -1) {
      users[userIndex] = {
        ...users[userIndex], // Giữ lại ID và Password cũ (nếu có)
        id: userId,
        username,
        email,
        firstName,
        lastName,
      };
    }
  } else {
    userIdCounter++;
    const newUserId = `user${userIdCounter}`;
    const newUser = {
      id: newUserId,
      username,
      email,
      firstName,
      lastName,
      password: "123456", // Gán password mặc định khi thêm mới
    };

    users.push(newUser);
    addUserToTable(newUser);
  }

  localStorage.setItem("userList", JSON.stringify(users));
  closeModal();
}

function addUserToTable(user) {
  const table = document.querySelector("table tbody");
  const newRow = table.insertRow();
  newRow.id = user.id;

  const cell1 = newRow.insertCell(0);
  const cell2 = newRow.insertCell(1);
  const cell3 = newRow.insertCell(2);
  const cell4 = newRow.insertCell(3);
  const cell5 = newRow.insertCell(4);
  const cell6 = newRow.insertCell(5);

  cell1.innerHTML = String(user.id.replace("user", "")).padStart(8, "0");
  cell2.innerHTML = user.username;
  cell3.innerHTML = user.email;
  cell4.innerHTML = user.firstName;
  cell5.innerHTML = user.lastName;

  cell6.innerHTML = `
    <button class="button edit" onclick="showEditUserForm('${user.id}')">Edit</button>
    <button class="button delete" onclick="showConfirmModal('${user.id}')">Delete</button>
    <button class="button lock" onclick="toggleLock('${user.id}')">
    <ion-icon name="lock-closed-outline"></ion-icon>
    </button>
    `;
}

function toggleLock(userId) {
  const row = document.getElementById(userId);
  const lockButton = row.querySelector(".lock ion-icon");
  const isLocked = lockButton.getAttribute("name") === "lock-closed-outline";

  if (isLocked) {
    lockButton.setAttribute("name", "lock-open-outline");
  } else {
    lockButton.setAttribute("name", "lock-closed-outline");
  }
}

function closeModal() {
  document.getElementById("userModal").style.display = "none";
}

function clearFormFields() {
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("firstName").value = "";
  document.getElementById("lastName").value = "";
}

// --- XỬ LÝ MODAL XÁC NHẬN XÓA ---
let userToDelete = null;

function showConfirmModal(userId) {
  userToDelete = userId;
  document.getElementById("confirmDeleteModal").style.display = "flex";
}

function closeConfirmModal() {
  document.getElementById("confirmDeleteModal").style.display = "none";
  userToDelete = null;
}

document
  .getElementById("confirmDeleteBtn")
  .addEventListener("click", function () {
    if (userToDelete) {
      deleteUser(userToDelete); 
      closeConfirmModal();
    }
  });

function deleteUser(userId) {
  document.getElementById(userId).remove(); // Xóa hàng khỏi table
  let users = JSON.parse(localStorage.getItem("userList")) || [];
  users = users.filter((user) => user.id !== userId); // Xóa user khỏi mảng
  localStorage.setItem("userList", JSON.stringify(users)); // Cập nhật localStorage
}

