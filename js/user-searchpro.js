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