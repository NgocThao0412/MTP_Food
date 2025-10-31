function toggleMenu(hamburger) {
  const mobileMenu = document.getElementById("mobileMenu");
  mobileMenu.classList.toggle("active");
  document.querySelectorAll(".hamburger").forEach((icon) => {
    icon.classList.toggle("active");
  });
}

document.addEventListener("DOMContentLoaded", function () {
  setupSidebarActiveState();

  function getCurrentUser() {
    const admins = localStorage.getItem("AdminUser");
    return admins ? JSON.parse(admins) : [];
  }

  function updateLoginButton() {
    const loginButton = document.getElementById("login-btn");
    const admins = getCurrentUser();
    if (admins) {
      loginButton.textContent = admins.username;
      loginButton.disabled = true;
    }
  }

  const logoutButton = document.getElementById("logout-btn");

  logoutButton.addEventListener("click", function () {
    localStorage.removeItem("currentUser");
    window.location.replace("../index.html");
  });

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
    {
      id: "user4324",
      username: "user3",
      password: "123456",
      email: "user3@gmail.com",
      firstName: "First3",
      lastName: "Last3",
    },
    {
      id: "user4325",
      username: "user4",
      password: "123456",
      email: "user4@gmail.com",
      firstName: "First4",
      lastName: "Last4",
    },
    {
      id: "user4326",
      username: "user5",
      password: "123456",
      email: "user5@gmail.com",
      firstName: "First5",
      lastName: "Last5",
    },
    {
      id: "user4327",
      username: "user6",
      password: "123456",
      email: "user6@gmail.com",
      firstName: "First6",
      lastName: "Last6",
    },
  ];

  const adminAccount = {
  id: "AD001",
  username: "Admin",
  password: "admin123",
  email: "admin@gmail.com",
  firstName: "Admin",
  lastName: "System",
};

if (!localStorage.getItem("AdminUser")) {
  localStorage.setItem("AdminUser", JSON.stringify(adminAccount));
}

  localStorage.setItem("userList", JSON.stringify(users));

  updateLoginButton();

  function loadUsers() {
    const users = JSON.parse(localStorage.getItem("userList")) || [];
    users.forEach((user) => addUserToTable(user));
  }

  loadUsers();

  const save = document.querySelector(".save-btn");

  save.addEventListener("click", function (event) {
    event.preventDefault();
    const name = document.querySelector("#username");
    const email = document.querySelector("#email");
    const firstName = document.querySelector("#firstname");
    const lastName = document.querySelector("#lastname");

    showConfirmation();
  });
});

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
      console.log("11");
    } else {
      btn.style.display = "none";
      console.log("12");
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

function setupSidebarActiveState() {
  const currentPage = window.location.pathname.split("/").pop();
  if (!currentPage) return;

  // Bước 1: Xóa 'active' khỏi TẤT CẢ các mục chính trước
  document.querySelectorAll(".sidebar-list-item.tab-content").forEach((item) => {
    item.classList.remove("active");
  });

  // Bước 2: Tìm link chính xác và thêm 'active'
  const allLinks = document.querySelectorAll(".sidebar-link");

  allLinks.forEach((link) => {
    const linkHref = link.getAttribute("href");
    if (!linkHref) return; // Bỏ qua link không có href (như 'javascript:void(0)')

    const linkPage = linkHref.split("/").pop();

    // Nếu tìm thấy link của trang hiện tại
    if (linkPage === currentPage) {
      const submenu = link.closest(".submenu"); // Tìm xem link này có nằm trong submenu ko

      if (submenu) {
        // --- NẾU LÀ LINK CON (như 'Quản lý giá') ---
        submenu.style.display = "block"; // 1. Mở submenu cha
        const parentLi = submenu.closest(".sidebar-list-item.tab-content");
        if (parentLi) {
          parentLi.classList.add("active"); // 2. Thêm vạch đỏ cho <li> cha (Sản phẩm)
          const parentLink = parentLi.querySelector(".sidebar-link");
          if (parentLink) {
            parentLink.classList.add("active"); // 3. Xoay mũi tên cho <a> cha (Sản phẩm)
          }
        }
      } else {
        // --- NẾU LÀ LINK CHA (như 'Trang tổng quan') ---
        const parentLi = link.closest(".sidebar-list-item.tab-content");
        if (parentLi) {
          parentLi.classList.add("active"); // Thêm vạch đỏ cho chính nó
        }
      }
    }
  });
}

let userIdCounter = 4321;

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
    console.error(
      `Row with ID ${userId} not found. Please check the userId being passed.`
    );
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

function deleteUser(userId) {
  document.getElementById(userId).remove();
  let users = JSON.parse(localStorage.getItem("userList")) || [];
  users = users.filter((user) => user.id !== userId);
  localStorage.setItem("userList", JSON.stringify(users));
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
      document.getElementById(userToDelete).remove();
      let users = JSON.parse(localStorage.getItem("userList")) || [];
      users = users.filter((user) => user.id !== userToDelete);
      localStorage.setItem("userList", JSON.stringify(users));
      closeConfirmModal();
    }
  });