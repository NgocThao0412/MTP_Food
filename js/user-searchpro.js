function searchProducts() {
    const searchInput = document.querySelector('.form-search-input');
    let filter = searchInput.value.toLowerCase().trim(); 

    const TARGET_KEYWORD = "bánh cuốn"; 
    const TARGET_PAGE = "/Client/page-searchpro.html";

    if (filter === TARGET_KEYWORD) {
        window.location.href = TARGET_PAGE;
        return; 
    }

    const productList = document.getElementById('product-list-container');
    if (!productList) {
        return;
    }
    
    const productItems = productList.getElementsByClassName('product-item');

    for (let i = 0; i < productItems.length; i++) {
        productItems[i].style.display = "none";
    }
    
    if (filter === "") {
        for (let i = 0; i < productItems.length; i++) {
            productItems[i].style.display = ""; 
        }
    }
}

function openSearchMb() {
    const searchCenter = document.querySelector('.header-middle-center');
    if (searchCenter) {
        searchCenter.classList.add('mobile-search-active');
        searchCenter.style.display = 'block';
        const searchInput = document.querySelector('.form-search-input');
        if (searchInput) {
            searchInput.focus();
        }
    }

    const searchIconClose = document.querySelector('.header-middle-right-item.close');
    const otherItems = document.querySelectorAll('.header-middle-right-list > .header-middle-right-item'); 
    
    otherItems.forEach(item => {
        if (!item.classList.contains('close')) { 
            item.style.display = 'none';
        }
    });

    if (searchIconClose) {
        searchIconClose.style.display = 'list-item';
    }
}

function closeSearchMb() {
    const searchCenter = document.querySelector('.header-middle-center');
    if (searchCenter) {
        searchCenter.classList.remove('mobile-search-active');
        searchCenter.style.display = 'none';
    }
    
    const searchIconClose = document.querySelector('.header-middle-right-item.close');
    const otherItems = document.querySelectorAll('.header-middle-right-list > .header-middle-right-item');
    
    otherItems.forEach(item => {
        if (!item.classList.contains('close')) {
            item.style.display = 'list-item';
        }
    });

    if (searchIconClose) {
        searchIconClose.style.display = 'none';
    }
}