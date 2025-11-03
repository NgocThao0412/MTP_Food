function getLoggedInUserName() {
    return localStorage.getItem('loggedInUser') || 'Người Dùng'; 
}

function updateUserNameDisplay() {
    const userNameElement = document.getElementById('user-display-name');
    const loggedInUser = getLoggedInUserName();
    
    if (userNameElement) {
        userNameElement.textContent = loggedInUser;
    }
}

function searchProducts(event) {
    if (event.key !== 'Enter') {
        return;
    }
    event.preventDefault();
    window.location.href = "/Client/page2-searchpro.html";
}

function initializeSearchPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    const searchInput = document.querySelector('.form-search-input');
    const titleElement = document.querySelector('.home-title');

    if (query) {
        if (searchInput) {
            searchInput.value = query;
        }
        
        if (titleElement) {
            titleElement.textContent = `Kết quả tìm kiếm: ${query}`;
        }
        
        searchProducts(); 
    } else {
         if (titleElement) {
            titleElement.textContent = `Kết quả tìm kiếm: Tất cả món ăn`;
        }
    }
    
    updateUserNameDisplay();
}

document.addEventListener('DOMContentLoaded', initializeSearchPage);