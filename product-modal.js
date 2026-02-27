(function () {
    'use strict';

    const overlay = document.getElementById('product-modal-overlay');
    const modal = document.getElementById('product-modal');
    const closeBtn = document.getElementById('product-modal-close');
    const imageEl = document.getElementById('product-modal-image');
    const titleEl = document.getElementById('product-modal-title');
    const descEl = document.getElementById('product-modal-desc');
    const priceEl = document.getElementById('product-modal-price');
    const addBtn = document.getElementById('product-modal-add');

    let currentProduct = null;

    function openModal(product) {
        currentProduct = product;
        imageEl.src = product.image;
        imageEl.alt = product.name;
        titleEl.textContent = product.name;
        descEl.textContent = product.desc || '';
        priceEl.textContent = 'AED ' + product.price;

        overlay.classList.add('active');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        overlay.classList.remove('active');
        modal.classList.remove('active');
        document.body.style.overflow = '';
        currentProduct = null;
    }

    document.querySelectorAll('.product-card').forEach(function (card) {
        card.addEventListener('click', function (e) {
            if (e.target.closest('.add-to-cart')) return;
            const product = {
                name: card.dataset.name,
                price: card.dataset.price,
                image: card.dataset.image,
                desc: card.dataset.desc || ''
            };
            openModal(product);
        });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    addBtn.addEventListener('click', function () {
        if (!currentProduct) return;
        const cartAddEvent = new CustomEvent('add-to-cart', {
            detail: currentProduct
        });
        document.dispatchEvent(cartAddEvent);
        closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
})();
