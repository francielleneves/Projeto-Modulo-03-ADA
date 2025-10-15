import { checkAuth, logout } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const username = checkAuth();
    document.getElementById('welcome-message').textContent = `Olá, ${username}`;
    document.getElementById('logout-btn').addEventListener('click', logout);

    const tableBody = document.getElementById('products-table-body');
    const productForm = document.getElementById('product-form');
    const addBtn = document.getElementById('add-product-btn');
    let editingProductId = null;

    async function fetchProducts() {
        try {
            const res = await fetch('https://fakestoreapi.com/products');
            const products = await res.json();
            renderTable(products);
        } catch (err) {
            console.error(err);
        }
    }

    function renderTable(products) {
        tableBody.innerHTML = '';
        products.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${p.id}</td>
                <td>${p.title}</td>
                <td>$${p.price}</td>
                <td>
                    <button class="btn btn-sm btn-info edit-btn">Editar</button>
                    <button class="btn btn-sm btn-danger delete-btn">Excluir</button>
                </td>
            `;
            row.querySelector('.edit-btn').addEventListener('click', () => openModalEdit(p));
            row.querySelector('.delete-btn').addEventListener('click', () => deleteProduct(p.id));
            tableBody.appendChild(row);
        });
    }

    addBtn.addEventListener('click', () => {
        editingProductId = null;
        productForm.reset();
        document.getElementById('productModalLabel').textContent = 'Adicionar Produto';
    });

    function openModalEdit(product) {
        editingProductId = product.id;
        document.getElementById('productModalLabel').textContent = 'Editar Produto';
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-title').value = product.title;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-image').value = product.image;
        document.getElementById('product-category').value = product.category;
        const modal = new bootstrap.Modal(document.getElementById('productModal'));
        modal.show();
    }

    productForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const productData = {
            title: document.getElementById('product-title').value,
            price: parseFloat(document.getElementById('product-price').value),
            description: document.getElementById('product-description').value,
            image: document.getElementById('product-image').value,
            category: document.getElementById('product-category').value
        };

        try {
            if (editingProductId) {
                await fetch(`https://fakestoreapi.com/products/${editingProductId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            } else {
                await fetch('https://fakestoreapi.com/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });
            }
            bootstrap.Modal.getInstance(document.getElementById('productModal')).hide();
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    });

    async function deleteProduct(id) {
        if (username !== 'johnd') {
            alert('Você não tem permissão para deletar produtos.');
            return;
        }
        const confirmDelete = confirm('Tem certeza que deseja excluir este produto?');
        if (!confirmDelete) return;
        try {
            await fetch(`https://fakestoreapi.com/products/${id}`, { method: 'DELETE' });
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    }

    fetchProducts();
});
