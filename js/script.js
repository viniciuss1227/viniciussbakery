// ==========================================
// CONFIGURAÇÕES DA VINICIUS'S BAKERY
// ==========================================
// Substitua pelo número real no formato: 55 + DDD + NÚMERO (apenas dígitos)
const WHATSAPP_PHONE = "5511952387401"; 

// Catálogo oficial de bolos
const catalog = [
    {
        id: "01",
        nome: "Banana com Canela",
        preco: 38.00,
        descricao: "Massa úmida com banana e crosta crocante de açúcar e canela.",
        imagem: "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "02",
        nome: "Churros Artesanal",
        preco: 45.00,
        descricao: "Massa de canela com doce de leite suave e equilibrado, sem ser enjoativo.",
        imagem: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "03",
        nome: "Maçã c/ Nozes Rústico",
        preco: 48.00,
        descricao: "Fatias de maçã caramelizada com nozes selecionadas e toque de especiarias.",
        imagem: "assets/maca-nozes.jpg"
    },
    {
        id: "04",
        nome: "Chocolate Tradicional",
        preco: 40.00,
        descricao: "Massa macia e intensa de cacau nobre, ideal para o café da tarde.",
        imagem: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: "05",
        nome: "Chocolate com Prestígio",
        preco: 46.00,
        descricao: "Cacau nobre com recheio cremoso de coco artesanal bem aveludado.",
        imagem: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=800&auto=format&fit=crop"
    }
];

// Estado reativo simples em memória: { "01": 2, "04": 1 }
const cart = {};

// Utilitário para formatar moedas em Real
function formatPrice(value) {
    return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ==========================================
// RENDERIZAÇÃO DA INTERFACE
// ==========================================
function renderMenu() {
    const container = document.getElementById('menu-list');
    const itemsCount = document.getElementById('items-count');
    
    if (itemsCount) {
        itemsCount.textContent = `${String(catalog.length).padStart(2, '0')} itens`;
    }

    container.innerHTML = '';

    catalog.forEach(item => {
        const qty = cart[item.id] || 0;
        const card = document.createElement('article');
        card.className = "bg-brand-card rounded-[26px] border border-brand-card-border overflow-hidden shadow-xl flex flex-col";

        // Seletor dinâmico: se qty === 0 exibe botão de adicionar; se > 0 exibe os botões de + e -
        const actionButtonHtml = qty === 0 
            ? `
                <button 
                    onclick="changeQuantity('${item.id}', 1)"
                    class="w-full bg-brand-terracota hover:bg-brand-terracota-dark active:scale-[0.99] text-[#160E08] font-bold text-sm py-3 px-4 rounded-xl flex items-center justify-between transition-all shadow-md group"
                >
                    <span>Adicionar ao Pedido</span>
                    <span class="text-base font-extrabold group-hover:translate-x-0.5 transition-transform">+</span>
                </button>
            `
            : `
                <div class="w-full bg-[#180F09] border border-brand-terracota/40 rounded-xl p-1 flex items-center justify-between shadow-inner">
                    <button 
                        onclick="changeQuantity('${item.id}', -1)" 
                        class="w-10 h-10 rounded-lg bg-brand-card hover:bg-brand-card-border text-brand-cream font-bold text-lg flex items-center justify-center transition-all active:scale-95"
                        aria-label="Diminuir quantidade"
                    >
                        −
                    </button>
                    <div class="text-center px-4">
                        <span class="text-[10px] uppercase tracking-wider text-brand-muted block font-semibold">Qtd</span>
                        <span class="text-base font-extrabold text-brand-cream">${qty}</span>
                    </div>
                    <button 
                        onclick="changeQuantity('${item.id}', 1)" 
                        class="w-10 h-10 rounded-lg bg-brand-terracota hover:bg-brand-terracota-dark text-[#160E08] font-bold text-lg flex items-center justify-center transition-all active:scale-95"
                        aria-label="Aumentar quantidade"
                    >
                        +
                    </button>
                </div>
            `;

        card.innerHTML = `
            <!-- Topo com Imagem e Tag Numérica Flutuante -->
            <div class="relative h-48 sm:h-52 w-full overflow-hidden bg-black/40">
                <span class="absolute top-3 left-3 z-10 bg-black/60 backdrop-blur-md text-white/90 text-xs font-mono font-semibold px-2.5 py-1 rounded-full border border-white/10">
                    ${item.id}
                </span>
                <img 
                    src="${item.imagem}" 
                    alt="Foto do ${item.nome}" 
                    class="w-full h-full object-cover card-img-zoom"
                    loading="lazy"
                />
            </div>

            <!-- Corpo do Card -->
            <div class="p-5 flex flex-col flex-1 justify-between">
                <div>
                    <!-- Título e Badge de Preço -->
                    <div class="flex items-center justify-between gap-2 mb-2">
                        <h2 class="font-extrabold text-lg text-brand-cream leading-tight">
                            ${item.nome}
                        </h2>
                        <span class="bg-brand-pill border border-brand-card-border text-brand-accent text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                            R$ ${formatPrice(item.preco)}
                        </span>
                    </div>

                    <!-- Descrição -->
                    <p class="text-brand-muted text-xs sm:text-sm leading-relaxed mb-5">
                        ${item.descricao}
                    </p>
                </div>

                <!-- Botão de Ação / Stepper -->
                <div>
                    ${actionButtonHtml}
                </div>
            </div>
        `;

        container.appendChild(card);
    });

    updateCheckoutBar();
}

// ==========================================
// CONTROLE DE QUANTIDADE & CARRINHO
// ==========================================
function changeQuantity(cakeId, delta) {
    const current = cart[cakeId] || 0;
    const next = current + delta;

    if (next <= 0) {
        delete cart[cakeId];
    } else {
        cart[cakeId] = next;
    }

    renderMenu();
}

function updateCheckoutBar() {
    const bar = document.getElementById('checkout-bar');
    const totalQtyLabel = document.getElementById('cart-total-qty');
    const totalPriceLabel = document.getElementById('cart-total-price');

    const selectedKeys = Object.keys(cart);
    
    if (selectedKeys.length === 0) {
        // Esconde a barra se nenhum item estiver selecionado
        bar.classList.add('translate-y-full', 'opacity-0', 'pointer-events-none');
        bar.classList.remove('translate-y-0', 'opacity-100');
        return;
    }

    // Calcula quantidades e totais
    let totalQty = 0;
    let totalPrice = 0;

    selectedKeys.forEach(id => {
        const item = catalog.find(c => c.id === id);
        const qty = cart[id];
        totalQty += qty;
        totalPrice += (item.preco * qty);
    });

    totalQtyLabel.textContent = `${totalQty} ${totalQty === 1 ? 'bolo selecionado' : 'bolos selecionados'}`;
    totalPriceLabel.textContent = `R$ ${formatPrice(totalPrice)}`;

    // Exibe a barra com animação suave
    bar.classList.remove('translate-y-full', 'opacity-0', 'pointer-events-none');
    bar.classList.add('translate-y-0', 'opacity-100');
}

// ==========================================
// DISPARO DO CHECKOUT DIRETO VIA WHATSAPP
// ==========================================
function handleCheckout() {
    const selectedKeys = Object.keys(cart);
    if (selectedKeys.length === 0) return;

    let totalQty = 0;
    let totalPrice = 0;
    let itensTexto = "";

    selectedKeys.forEach(id => {
        const item = catalog.find(c => c.id === id);
        const qty = cart[id];
        const subtotal = item.preco * qty;

        totalQty += qty;
        totalPrice += subtotal;

        itensTexto += `• *${qty}x* ${item.nome} — R$ ${formatPrice(subtotal)}\n`;
    });

    // Mensagem com markdown formatado para leitura clara no WhatsApp
    const message = 
`Olá, Vinicius! Vim pelo cardápio digital da *vinicius's bakery.*

*Meu Pedido:*
${itensTexto}
*Total:* R$ ${formatPrice(totalPrice)} (${totalQty} ${totalQty === 1 ? 'unidade' : 'unidades'})

Como podemos combinar a retirada ou entrega?`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_PHONE}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
}

document.addEventListener('DOMContentLoaded', renderMenu);