// Archivo: js/products.js

const productList = document.getElementById('product-list');
const productForm = document.getElementById('product-form');

const getProducts = async () => {
    const response = await fetch('http://localhost:3000/products');
    const products = await response.json();
    return products;
};

const renderProducts = (products) => {
    productList.innerHTML = '';
    if (products.length === 0) {
        productList.innerHTML = '<p>No se han agregado productos</p>';
    } else {
        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('card');
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="card-container--info">
                    <p>${product.name}</p>
                    <div class="card-container--value">
                        <p>$${product.price.toFixed(2)}</p>
                        <img src="assets/trashIcon.png" alt="Eliminar" data-id="${product.id}">
                    </div>
                </div>
            `;
            productList.appendChild(productCard);
        });
    }
};

const addProduct = async (product) => {
    await fetch('http://localhost:3000/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    });
};

const deleteProduct = async (id) => {
    await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE'
    });
};

productForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const price = parseFloat(document.getElementById('price').value);
    const image = document.getElementById('image').value;
    const newProduct = { name, price, image };

    await addProduct(newProduct);
    const products = await getProducts();
    renderProducts(products);
    productForm.reset();
});

productList.addEventListener('click', async (event) => {
    if (event.target.tagName === 'IMG' && event.target.alt === 'Eliminar') {
        const id = event.target.getAttribute('data-id');
        await deleteProduct(id);
        const products = await getProducts();
        renderProducts(products);
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    const products = await getProducts();
    renderProducts(products);
});
