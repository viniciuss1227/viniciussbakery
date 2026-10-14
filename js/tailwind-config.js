tailwind.config = {
    theme: {
        extend: {
            colors: {
                // Tons extraídos do seu design no Figma
                'brand-bg': '#140D08',         // Fundo principal da página
                'brand-card': '#241811',       // Fundo dos cards de produto
                'brand-card-border': '#332218',// Borda sutil dos cards
                'brand-pill': '#20150F',       // Fundo dos badges secundários
                'brand-terracota': '#C77A44',  // Botão "Pedir via WhatsApp"
                'brand-terracota-dark': '#B36835',
                'brand-accent': '#E0A37A',     // Destaques e badges de preço
                'brand-cream': '#F5EBE1',      // Texto principal
                'brand-muted': '#A8988B',      // Descrições e textos de apoio
            },
            fontFamily: {
                'sans': ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
            }
        }
    }
}