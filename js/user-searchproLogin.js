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

function searchProducts() {
    const searchInput = document.querySelector('.form-search-input');
    let filter = searchInput.value.toLowerCase().trim(); 

    const TARGET_KEYWORD = "bánh cuốn"; 
    const TARGET_PAGE = "/Client/page2-searchpro.html"; 
    
    const searchParams = `?q=${encodeURIComponent(filter)}`;

    const productList = document.getElementById('product-list-container');
    
    if (filter === TARGET_KEYWORD) {
        window.location.href = `${TARGET_PAGE}${searchParams}`;
        return; 
    }

    if (!productList) {
        return;
    }
    
    const productItems = productList.getElementsByClassName('product-item');

    for (let i = 0; i < productItems.length; i++) {
        const item = productItems[i];
        const titleElement = item.querySelector('.title'); 
        
        if (titleElement) {
            const productName = titleElement.textContent.toLowerCase().trim();

            if (filter === "" || productName.includes(filter)) {
                item.style.display = ""; 
            } else {
                item.style.display = "none";
            }
        }
    }
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