// ========================================
// SHOPMASTER - JAVASCRIPT PRINCIPAL
// ========================================

// Variables globales
let allProducts = [];
let filteredProducts = [];
let cart = [];
let purchaseHistory = [];
let currentProduct = null;
let map = null;

// ========================================
// FUNCIONES DE ALMACENAMIENTO
// ========================================

// Cargar datos desde localStorage
function loadFromStorage() {
    const savedCart = localStorage.getItem('shopmaster_cart');
    const savedHistory = localStorage.getItem('shopmaster_history');
    
    if (savedCart) cart = JSON.parse(savedCart);
    if (savedHistory) purchaseHistory = JSON.parse(savedHistory);
    
    updateCartCount();
    updateCartDisplay();
}

// Guardar en localStorage
function saveToStorage() {
    localStorage.setItem('shopmaster_cart', JSON.stringify(cart));
    localStorage.setItem('shopmaster_history', JSON.stringify(purchaseHistory));
}

// ========================================
// NAVEGACIÓN ENTRE SECCIONES
// ========================================

function showSection(sectionId) {
    // Ocultar todas las secciones
    document.querySelectorAll('section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
    
    // Inicializar mapa si es la sección de contacto
    if (sectionId === 'contact' && !map) {
        setTimeout(() => initMap(), 100);
    }
    
    // Actualizar display del carrito
    if (sectionId === 'cart') {
        updateCartDisplay();
    }
    
    // Actualizar historial de compras
    if (sectionId === 'user') {
        displayPurchaseHistory();
    }
    
    // Actualizar total de pago
    if (sectionId === 'payment') {
        updatePaymentTotal();
    }
}

// ========================================
// INICIALIZACIÓN
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    loadFromStorage();
    fetchProducts();
    
    // Formatear inputs de tarjeta
    document.getElementById('cardNumber').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formatted = value.match(/.{1,4}/g);
        e.target.value = formatted ? formatted.join(' ') : value;
    });
    
    document.getElementById('cardExpiry').addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.slice(0,2) + '/' + value.slice(2,4);
        }
        e.target.value = value;
    });
    
    document.getElementById('cardCVV').addEventListener('input', function(e) {
        e.target.value = e.target.value.replace(/\D/g, '');
    });

    // Formulario de contacto
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('✅ ¡Mensaje enviado correctamente! Nos pondremos en contacto contigo pronto.');
        this.reset();
    });
});

// ========================================
// GESTIÓN DE PRODUCTOS
// ========================================

// Fetch productos de la API
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const data = await response.json();
        
        allProducts = data.map(p => ({
            ...p,
            available: Math.random() > 0.2,
            stock: Math.floor(Math.random() * 20) + 1
        }));
        
        filteredProducts = [...allProducts];
        populateCategoryFilter();
        displayProducts();
    } catch (error) {
        console.error('Error completo:', error);
        document.getElementById('productsContainer').innerHTML = 
            '<div class="col-12 text-center"><div class="alert alert-warning"><h5>⚠️ Error al cargar productos desde la API</h5><p>Cargando productos de demostración...</p></div></div>';
        
        // Cargar productos de respaldo
        loadBackupProducts();
    }
}

// Productos de respaldo si falla la API
function loadBackupProducts() {
    allProducts = [
        {
            id: 1,
            title: "Laptop HP Pavilion 15",
            price: 599.99,
            description: "Laptop potente con procesador Intel Core i5, 8GB RAM, 256GB SSD",
            category: "electronics",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23007BFF' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E💻 Laptop%3C/text%3E%3C/svg%3E",
            available: true,
            stock: 15
        },
        {
            id: 2,
            title: "Smartphone Samsung Galaxy A54",
            price: 399.99,
            description: "Smartphone con pantalla AMOLED de 6.4 pulgadas, 128GB almacenamiento",
            category: "electronics",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%2328a745' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E📱 Phone%3C/text%3E%3C/svg%3E",
            available: true,
            stock: 20
        },
        {
            id: 3,
            title: "Auriculares Sony WH-1000XM4",
            price: 279.99,
            description: "Auriculares inalámbricos con cancelación de ruido premium",
            category: "electronics",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23dc3545' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E🎧 Audio%3C/text%3E%3C/svg%3E",
            available: true,
            stock: 12
        },
        {
            id: 4,
            title: "Camiseta Nike Deportiva",
            price: 29.99,
            description: "Camiseta deportiva de alta calidad, material transpirable",
            category: "men's clothing",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23ffc107' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E👕 Ropa%3C/text%3E%3C/svg%3E",
            available: true,
            stock: 50
        },
        {
            id: 5,
            title: "Reloj Smartwatch Apple Watch",
            price: 399.99,
            description: "Smartwatch con monitoreo de salud y fitness",
            category: "electronics",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%236f42c1' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E⌚ Watch%3C/text%3E%3C/svg%3E",
            available: true,
            stock: 8
        },
        {
            id: 6,
            title: "Zapatillas Adidas Running",
            price: 89.99,
            description: "Zapatillas deportivas cómodas para correr",
            category: "men's clothing",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%2320c997' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E👟 Shoes%3C/text%3E%3C/svg%3E",
            available: true,
            stock: 30
        },
        {
            id: 7,
            title: "Mochila Samsonite Ejecutiva",
            price: 79.99,
            description: "Mochila profesional con compartimento para laptop",
            category: "accessories",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23fd7e14' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E🎒 Bag%3C/text%3E%3C/svg%3E",
            available: true,
            stock: 18
        },
        {
            id: 8,
            title: "Perfume Chanel No. 5",
            price: 129.99,
            description: "Fragancia clásica y elegante",
            category: "women's clothing",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23e83e8c' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E💐 Perfume%3C/text%3E%3C/svg%3E",
            available: true,
            stock: 25
        },
        {
            id: 9,
            title: "Tablet Samsung Galaxy Tab S8",
            price: 549.99,
            description: "Tablet potente con pantalla de 11 pulgadas",
            category: "electronics",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23007BFF' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E📱 Tablet%3C/text%3E%3C/svg%3E",
            available: true,
            stock: 10
        },
        {
            id: 10,
            title: "Bolso Michael Kors",
            price: 249.99,
            description: "Bolso de cuero elegante y espacioso",
            category: "women's clothing",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23d63384' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E👜 Bolso%3C/text%3E%3C/svg%3E",
            available: true,
            stock: 14
        },
        {
            id: 11,
            title: "Cámara Canon EOS R50",
            price: 899.99,
            description: "Cámara mirrorless profesional con lente 18-45mm",
            category: "electronics",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23495057' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E📷 Camera%3C/text%3E%3C/svg%3E",
            available: true,
            stock: 6
        },
        {
            id: 12,
            title: "Vestido Elegante Zara",
            price: 59.99,
            description: "Vestido casual elegante para toda ocasión",
            category: "women's clothing",
            image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect fill='%23f8bbd0' width='300' height='300'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='white'%3E👗 Dress%3C/text%3E%3C/svg%3E",
            available: true,
            stock: 22
        }
    ];
    
    filteredProducts = [...allProducts];
    populateCategoryFilter();
    displayProducts();
}

// Poblar filtro de categorías
function populateCategoryFilter() {
    const categories = [...new Set(allProducts.map(p => p.category))];
    const select = document.getElementById('categoryFilter');
    
    // Limpiar opciones existentes excepto "Todas las categorías"
    while (select.options.length > 1) {
        select.remove(1);
    }
    
    categories.forEach(cat => {
        const option = document.createElement('option');
        option.value = cat;
        option.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
        select.appendChild(option);
    });
}

// Aplicar filtros
function applyFilters() {
    const category = document.getElementById('categoryFilter').value;
    const maxPrice = parseFloat(document.getElementById('priceFilter').value);
    const availability = document.getElementById('availabilityFilter').value;
    const search = document.getElementById('searchFilter').value.toLowerCase();

    filteredProducts = allProducts.filter(product => {
        const matchCategory = category === 'all' || product.category === category;
        const matchPrice = product.price <= maxPrice;
        const matchAvailability = availability === 'all' || 
            (availability === 'available' && product.available) ||
            (availability === 'limited' && product.stock < 5);
        const matchSearch = product.title.toLowerCase().includes(search) || 
            product.description.toLowerCase().includes(search);

        return matchCategory && matchPrice && matchAvailability && matchSearch;
    });

    displayProducts();
}

// Actualizar valor del precio
function updatePriceValue() {
    document.getElementById('priceValue').textContent = 
        document.getElementById('priceFilter').value;
}

// Mostrar productos
function displayProducts() {
    const container = document.getElementById('productsContainer');
    
    if (filteredProducts.length === 0) {
        container.innerHTML = '<div class="col-12 text-center"><p>No se encontraron productos</p></div>';
        return;
    }

    container.innerHTML = filteredProducts.map(product => `
        <div class="col-md-4 col-lg-3 fade-in">
            <div class="product-card">
                <img src="${product.image}" class="product-image" alt="${product.title}">
                <div class="product-body">
                    <span class="product-category">${product.category}</span>
                    <h5 class="product-title">${product.title}</h5>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="text-muted small">
                        ${product.available ? 
                            `✅ En stock (${product.stock} unidades)` : 
                            '❌ Agotado'}
                    </p>
                    <button class="btn btn-primary w-100" 
                        onclick="openProductModal(${product.id})"
                        ${!product.available ? 'disabled' : ''}>
                        👁️ Ver más
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// ========================================
// MODAL DE PRODUCTO
// ========================================

// Abrir modal de producto
function openProductModal(productId) {
    currentProduct = allProducts.find(p => p.id === productId);
    
    document.getElementById('modalTitle').textContent = currentProduct.title;
    document.getElementById('modalImage').src = currentProduct.image;
    document.getElementById('modalCategory').textContent = currentProduct.category;
    document.getElementById('modalPrice').textContent = `$${currentProduct.price.toFixed(2)}`;
    document.getElementById('modalDescription').textContent = currentProduct.description;
    document.getElementById('modalQuantity').value = 1;
    
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
}

// Control de cantidad en modal
function increaseQuantity() {
    const input = document.getElementById('modalQuantity');
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('modalQuantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Agregar al carrito desde el modal
function addToCartFromModal() {
    const quantity = parseInt(document.getElementById('modalQuantity').value);
    const existingItem = cart.find(item => item.id === currentProduct.id);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            ...currentProduct,
            quantity: quantity
        });
    }
    
    updateCartCount();
    saveToStorage();
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    modal.hide();
    
    showAlert('✅ Producto agregado al carrito', 'success');
}

// ========================================
// GESTIÓN DEL CARRITO
// ========================================

// Actualizar contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Mostrar alerta
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => alertDiv.remove(), 3000);
}

// Actualizar display del carrito
function updateCartDisplay() {
    const container = document.getElementById('cartItems');
    
    if (cart.length === 0) {
        container.innerHTML = '<div class="text-center p-5"><h4>🛒 Tu carrito está vacío</h4><p>Agrega productos para comenzar tu compra</p></div>';
        document.getElementById('checkoutBtn').disabled = true;
        updateCartTotals();
        return;
    }
    
    document.getElementById('checkoutBtn').disabled = false;
    
    container.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.image}" class="cart-item-image" alt="${item.title}">
            <div class="flex-grow-1">
                <h6>${item.title}</h6>
                <p class="text-muted mb-0">$${item.price.toFixed(2)} c/u</p>
            </div>
            <div class="quantity-control me-3">
                <button class="quantity-btn" onclick="updateCartQuantity(${index}, -1)">-</button>
                <span class="mx-2">${item.quantity}</span>
                <button class="quantity-btn" onclick="updateCartQuantity(${index}, 1)">+</button>
            </div>
            <div class="text-end me-3">
                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
            </div>
            <button class="btn btn-danger btn-sm" onclick="removeFromCart(${index})">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    updateCartTotals();
}

// Actualizar cantidad en carrito
function updateCartQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    updateCartCount();
    updateCartDisplay();
    saveToStorage();
}

// Eliminar del carrito
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartCount();
    updateCartDisplay();
    saveToStorage();
    showAlert('🗑️ Producto eliminado del carrito', 'info');
}

// Actualizar totales del carrito
function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = cart.length > 0 ? 10 : 0;
    const total = subtotal + shipping;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

// ========================================
// PROCESAMIENTO DE PAGOS
// ========================================

// Actualizar total de pago
function updatePaymentTotal() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + 10;
    document.getElementById('paymentTotal').textContent = `$${total.toFixed(2)}`;
}

// Procesar pago
function processPayment() {
    const name = document.getElementById('cardName').value.trim();
    const cardNumber = document.getElementById('cardNumber').value.trim();
    const expiry = document.getElementById('cardExpiry').value.trim();
    const cvv = document.getElementById('cardCVV').value.trim();
    const email = document.getElementById('email').value.trim();
    
    // Validación básica
    if (!name || !cardNumber || !expiry || !cvv || !email) {
        showAlert('❌ Por favor completa todos los campos', 'danger');
        return;
    }
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
        showAlert('❌ Número de tarjeta inválido', 'danger');
        return;
    }
    
    if (cvv.length !== 3) {
        showAlert('❌ CVV inválido', 'danger');
        return;
    }
    
    // Simular procesamiento
    showAlert('⏳ Procesando pago...', 'info');
    
    setTimeout(() => {
        // Crear registro de compra
        const purchase = {
            id: Date.now(),
            date: new Date().toLocaleString('es-DO'),
            items: [...cart],
            total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 10,
            customerName: name,
            customerEmail: email
        };
        
        purchaseHistory.push(purchase);
        saveToStorage();
        
        // Generar ticket PDF
        generateTicketPDF(purchase);
        
        // Limpiar carrito
        cart = [];
        updateCartCount();
        saveToStorage();
        
        // Resetear formulario
        document.getElementById('cardName').value = '';
        document.getElementById('cardNumber').value = '';
        document.getElementById('cardExpiry').value = '';
        document.getElementById('cardCVV').value = '';
        document.getElementById('email').value = '';
        
        showAlert('✅ ¡Pago procesado exitosamente!', 'success');
        
        // Redirigir al panel de usuario
        setTimeout(() => showSection('user'), 2000);
    }, 2000);
}

// ========================================
// GENERACIÓN DE TICKET PDF
// ========================================

function generateTicketPDF(purchase) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        format: [58, 200],
        unit: 'mm'
    });
    
    // Configurar fuente monoespaciada
    doc.setFont('courier');
    doc.setFontSize(8);
    
    let y = 10;
    
    // Encabezado
    doc.setFontSize(10);
    doc.text('SHOPMASTER', 29, y, { align: 'center' });
    y += 5;
    doc.setFontSize(7);
    doc.text('Av. Principal 123', 29, y, { align: 'center' });
    y += 4;
    doc.text('Santo Domingo, DO', 29, y, { align: 'center' });
    y += 4;
    doc.text('Tel: (809) 555-0123', 29, y, { align: 'center' });
    y += 6;
    
    // Línea separadora
    doc.text('================================', 29, y, { align: 'center' });
    y += 5;
    
    // Información del ticket
    doc.setFontSize(7);
    doc.text(`Ticket: #${purchase.id}`, 3, y);
    y += 4;
    doc.text(`Fecha: ${purchase.date}`, 3, y);
    y += 4;
    doc.text(`Cliente: ${purchase.customerName}`, 3, y);
    y += 6;
    
    // Línea separadora
    doc.text('================================', 29, y, { align: 'center' });
    y += 5;
    
    // Productos
    doc.setFontSize(8);
    doc.text('PRODUCTOS', 29, y, { align: 'center' });
    y += 5;
    
    doc.setFontSize(7);
    purchase.items.forEach(item => {
        // Título del producto (truncado)
        const title = item.title.length > 30 ? item.title.substring(0, 27) + '...' : item.title;
        doc.text(title, 3, y);
        y += 4;
        
        // Cantidad, precio unitario y total
        doc.text(`${item.quantity} x $${item.price.toFixed(2)}`, 3, y);
        doc.text(`$${(item.price * item.quantity).toFixed(2)}`, 52, y, { align: 'right' });
        y += 5;
    });
    
    // Línea separadora
    doc.text('================================', 29, y, { align: 'center' });
    y += 5;
    
    // Totales
    const subtotal = purchase.total - 10;
    doc.text('Subtotal:', 3, y);
    doc.text(`$${subtotal.toFixed(2)}`, 52, y, { align: 'right' });
    y += 4;
    
    doc.text('Envio:', 3, y);
    doc.text('$10.00', 52, y, { align: 'right' });
    y += 5;
    
    doc.setFontSize(9);
    doc.text('TOTAL:', 3, y);
    doc.text(`$${purchase.total.toFixed(2)}`, 52, y, { align: 'right' });
    y += 6;
    
    // Línea separadora
    doc.setFontSize(7);
    doc.text('================================', 29, y, { align: 'center' });
    y += 5;
    
    // Pie de página
    doc.text('Gracias por su compra', 29, y, { align: 'center' });
    y += 4;
    doc.text('www.shopmaster.com', 29, y, { align: 'center' });
    
    // Descargar
    doc.save(`ticket_${purchase.id}.pdf`);
}

// ========================================
// PANEL DE USUARIO
// ========================================

// Mostrar historial de compras
function displayPurchaseHistory() {
    const container = document.getElementById('purchaseHistory');
    const userName = document.getElementById('userName');
    
    // Obtener nombre del último pedido o usar predeterminado
    if (purchaseHistory.length > 0) {
        userName.textContent = purchaseHistory[purchaseHistory.length - 1].customerName;
    }
    
    if (purchaseHistory.length === 0) {
        container.innerHTML = '<p class="text-muted">Aún no has realizado ninguna compra</p>';
        return;
    }
    
    container.innerHTML = purchaseHistory.map(purchase => `
        <div class="purchase-history-item">
            <div class="d-flex justify-content-between align-items-start mb-2">
                <div>
                    <h6>📦 Pedido #${purchase.id}</h6>
                    <p class="text-muted small mb-1">📅 ${purchase.date}</p>
                    <p class="text-muted small mb-0">${purchase.items.length} producto(s)</p>
                </div>
                <div class="text-end">
                    <h5 class="text-success mb-2">$${purchase.total.toFixed(2)}</h5>
                    <button class="btn btn-sm btn-primary" onclick="downloadTicket(${purchase.id})">
                        Descargar Ticket
</button>
</div>
</div>
</div>
`).join('');
}
// Descargar ticket existente
function downloadTicket(purchaseId) {
const purchase = purchaseHistory.find(p => p.id === purchaseId);
if (purchase) {
generateTicketPDF(purchase);
}
}
// ========================================
// MAPA DE CONTACTO
// ========================================
// Inicializar mapa
function initMap() {
// Coordenadas de Santo Domingo, República Dominicana
const coords = [18.4861, -69.9312];
map = L.map('map').setView(coords, 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);

L.marker(coords).addTo(map)
    .bindPopup('<b>ShopMaster</b><br>Av. Principal 123')
    .openPopup();
}
