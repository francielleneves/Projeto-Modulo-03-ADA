// js/home.js
import { checkAuth, logout } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    const username = checkAuth();
    document.getElementById('welcome-message').textContent = `Olá, ${username}`;
    document.getElementById('logout-btn').addEventListener('click', logout);

    const productsContainer = document.getElementById('products-container');

    async function fetchProducts() {
        try {
            const res = await fetch('https://fakestoreapi.com/products');
            const products = await res.json();
            renderProducts(products);
        } catch (err) { console.error(err); }
    }

    function renderProducts(products) {
        productsContainer.innerHTML = '';
        products.forEach(p => {
            const card = document.createElement('div');
            card.className = 'card m-2';
            card.style.width = '18rem';
            card.innerHTML = `
                <img src="${p.image}" class="card-img-top" alt="${p.title}">
                <div class="card-body">
                    <h5 class="card-title">${p.title}</h5>
                    <p class="card-text">$${p.price}</p>
                    <button class="btn btn-primary btn-sm">Ver Detalhes</button>
                </div>
            `;
            card.querySelector('button').addEventListener('click', () => openModal(p.id));
            productsContainer.appendChild(card);
        });
    }

    async function openModal(id) {
        try {
            const res = await fetch(`https://fakestoreapi.com/products/${id}`);
            const product = await res.json();
            const modalHtml = `
                <div class="modal fade" id="productDetailModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">${product.title}</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <img src="${product.image}" class="img-fluid mb-3">
                                <p>${product.description}</p>
                                <p><strong>Preço:</strong> $${product.price}</p>
                                <p><strong>Categoria:</strong> ${product.category}</p>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', modalHtml);
            const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
            modal.show();
            document.getElementById('productDetailModal').addEventListener('hidden.bs.modal', () => {
                document.getElementById('productDetailModal').remove();
            });
        } catch (err) { console.error(err); }
    }

    fetchProducts();
});





