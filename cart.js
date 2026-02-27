(function () {
    'use strict';

    let cart = [];

    const cartCountEl = document.getElementById('cart-count');
    const cartItemsEl = document.getElementById('cart-items');
    const cartEmptyEl = document.getElementById('cart-empty');
    const cartTotalEl = document.getElementById('cart-total');
    const cartToggleEl = document.getElementById('cart-toggle');
    const cartCloseEl = document.getElementById('cart-close');
    const cartPanelEl = document.getElementById('cart-panel');
    const cartOverlayEl = document.getElementById('cart-overlay');

    function getCart() {
        try {
            const stored = localStorage.getItem('uowd-sweets-cart');
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    }

    function saveCart() {
        localStorage.setItem('uowd-sweets-cart', JSON.stringify(cart));
    }

    function updateCartCount() {
        const total = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountEl.textContent = total;
    }

    function addToCart(name, price, image) {
        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity += 1;
        } else {
            cart.push({ name, price: Number(price), image, quantity: 1 });
        }
        saveCart();
        updateCartCount();
        renderCart();
    }

    function removeFromCart(name) {
        cart = cart.filter(item => item.name !== name);
        saveCart();
        updateCartCount();
        renderCart();
    }

    function updateQuantity(name, delta) {
        const item = cart.find(i => i.name === name);
        if (!item) return;
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(name);
            return;
        }
        saveCart();
        updateCartCount();
        renderCart();
    }

    function renderCart() {
        cartItemsEl.innerHTML = '';

        if (cart.length === 0) {
            cartEmptyEl.classList.remove('hidden');
            cartTotalEl.textContent = 'AED 0';
            return;
        }

        cartEmptyEl.classList.add('hidden');

        let total = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.quantity;
            total += subtotal;

            const li = document.createElement('li');
            li.className = 'cart-item';
            li.innerHTML = `
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" class="cart-item-image">
                <div class="cart-item-details">
                    <div class="cart-item-name">${escapeHtml(item.name)}</div>
                    <div class="cart-item-price">AED ${item.price} × ${item.quantity} = AED ${subtotal}</div>
                    <div class="cart-item-qty">
                        <button type="button" data-action="minus" data-name="${escapeHtml(item.name)}">−</button>
                        <span>${item.quantity}</span>
                        <button type="button" data-action="plus" data-name="${escapeHtml(item.name)}">+</button>
                    </div>
                </div>
                <button type="button" class="cart-item-remove" data-name="${escapeHtml(item.name)}" aria-label="Remove">×</button>
            `;
            cartItemsEl.appendChild(li);
        });

        cartTotalEl.textContent = `AED ${total}`;

        cartItemsEl.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;
                const name = btn.dataset.name;
                if (action === 'minus') updateQuantity(name, -1);
                else if (action === 'plus') updateQuantity(name, 1);
            });
        });

        cartItemsEl.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(btn.dataset.name));
        });
    }

    function escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function openCart() {
        cartPanelEl.classList.add('active');
        cartOverlayEl.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        cartPanelEl.classList.remove('active');
        cartOverlayEl.classList.remove('active');
        document.body.style.overflow = '';
    }

    cart = getCart();
    updateCartCount();
    renderCart();

    cartToggleEl.addEventListener('click', (e) => {
        e.preventDefault();
        openCart();
    });

    cartCloseEl.addEventListener('click', closeCart);
    cartOverlayEl.addEventListener('click', closeCart);

    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.product-card');
            const name = card.dataset.name;
            const price = card.dataset.price;
            const image = card.dataset.image;
            addToCart(name, price, image);
            openCart();
        });
    });
})();
