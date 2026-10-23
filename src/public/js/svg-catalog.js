(function () {
  'use strict';

  function escapeXml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  function obtenerSvgCeramica(tipo, colorEsmalte, nombre) {
    const t = (tipo || 'taza').toLowerCase();
    const esmalte = colorEsmalte || '#c4704f';
    const titulo = escapeXml(nombre || 'Pieza cerámica artesanal Ludier');

    // Gradientes e iluminación artesanal
    const defs = `
      <defs>
        <radialGradient id="sombra-base" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#2a2521" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#2a2521" stop-opacity="0"/>
        </radialGradient>
        <linearGradient id="brillo-ceramico" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.35"/>
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.05"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.15"/>
        </linearGradient>
        <linearGradient id="arcilla-cruda" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#9e5638"/>
          <stop offset="50%" stop-color="#b86644"/>
          <stop offset="100%" stop-color="#8a472c"/>
        </linearGradient>
      </defs>
    `;

    // Sombra común para todas las piezas
    const sombraSuelo = `<ellipse cx="120" cy="205" rx="72" ry="14" fill="url(#sombra-base)" />`;

    let contenido = '';

    if (t === 'taza') {
      contenido = `
        ${sombraSuelo}
        <!-- Asa artesanal -->
        <path d="M 148 95 C 190 95, 190 160, 148 160" fill="none" stroke="${esmalte}" stroke-width="14" stroke-linecap="round" />
        <path d="M 148 95 C 190 95, 190 160, 148 160" fill="none" stroke="url(#brillo-ceramico)" stroke-width="14" stroke-linecap="round" />
        <!-- Base de arcilla cruda -->
        <rect x="74" y="165" width="80" height="20" rx="6" fill="url(#arcilla-cruda)" />
        <!-- Cuerpo de la taza -->
        <path d="M 68 85 L 75 172 Q 76 178 84 178 L 144 178 Q 152 178 153 172 L 160 85 Z" fill="${esmalte}" />
        <path d="M 68 85 L 75 172 Q 76 178 84 178 L 144 178 Q 152 178 153 172 L 160 85 Z" fill="url(#brillo-ceramico)" />
        <!-- Detalle de esmalte escurrido orgánico -->
        <path d="M 68 115 Q 85 130 102 115 T 136 120 T 160 110 L 160 85 L 68 85 Z" fill="#ffffff" fill-opacity="0.18" />
        <!-- Borde / Labio superior -->
        <ellipse cx="114" cy="85" rx="46" ry="10" fill="${esmalte}" stroke="#f0ebe1" stroke-width="2" />
        <!-- Interior de la taza con café / sombra -->
        <ellipse cx="114" cy="85" rx="40" ry="7" fill="#43281c" fill-opacity="0.85" />
      `;
    } else if (t === 'plato') {
      contenido = `
        ${sombraSuelo}
        <!-- Base inferior del plato -->
        <ellipse cx="120" cy="155" rx="60" ry="16" fill="url(#arcilla-cruda)" />
        <!-- Plato completo exterior -->
        <ellipse cx="120" cy="145" rx="95" ry="32" fill="${esmalte}" />
        <ellipse cx="120" cy="145" rx="95" ry="32" fill="url(#brillo-ceramico)" />
        <!-- Borde artesanal ondulado -->
        <ellipse cx="120" cy="144" rx="88" ry="28" fill="none" stroke="#f4ede2" stroke-width="2.5" stroke-dasharray="14 4" />
        <!-- Zona honda central -->
        <ellipse cx="120" cy="146" rx="62" ry="18" fill="#2d241e" fill-opacity="0.15" />
        <ellipse cx="120" cy="147" rx="55" ry="15" fill="${esmalte}" fill-opacity="0.9" />
        <circle cx="120" cy="147" r="12" fill="none" stroke="#ffffff" stroke-opacity="0.3" stroke-width="1.5" />
      `;
    } else if (t === 'macetero') {
      contenido = `
        ${sombraSuelo}
        <!-- Plato de drenaje en la base -->
        <ellipse cx="120" cy="188" rx="64" ry="12" fill="url(#arcilla-cruda)" />
        <rect x="58" y="180" width="124" height="10" rx="4" fill="url(#arcilla-cruda)" />
        <!-- Cuerpo del macetero -->
        <polygon points="68,90 172,90 160,182 80,182" fill="${esmalte}" />
        <polygon points="68,90 172,90 160,182 80,182" fill="url(#brillo-ceramico)" />
        <!-- Estrías verticales artesanales -->
        <line x1="95" y1="92" x2="100" y2="180" stroke="#ffffff" stroke-opacity="0.22" stroke-width="2.5" />
        <line x1="120" y1="92" x2="120" y2="181" stroke="#ffffff" stroke-opacity="0.22" stroke-width="2.5" />
        <line x1="145" y1="92" x2="140" y2="180" stroke="#ffffff" stroke-opacity="0.22" stroke-width="2.5" />
        <!-- Borde superior reforzado -->
        <ellipse cx="120" cy="90" rx="52" ry="12" fill="${esmalte}" stroke="#dcd3c5" stroke-width="2" />
        <!-- Tierra fértil -->
        <ellipse cx="120" cy="90" rx="46" ry="9" fill="#382923" />
        <!-- Planta / Brote botánico sutil -->
        <path d="M 120 90 Q 110 65 92 60 Q 112 68 120 90 Z" fill="#587c4b" />
        <path d="M 120 90 Q 130 55 148 50 Q 130 62 120 90 Z" fill="#6d945d" />
        <path d="M 120 90 Q 120 40 122 35 Q 124 55 120 90 Z" fill="#4d6f40" />
      `;
    } else if (t === 'jarron') {
      contenido = `
        ${sombraSuelo}
        <!-- Base de arcilla -->
        <ellipse cx="120" cy="192" rx="44" ry="10" fill="url(#arcilla-cruda)" />
        <!-- Cuerpo ánfora / jarrón -->
        <path d="M 104 55 Q 98 80 72 120 Q 56 150 78 184 Q 88 194 120 194 Q 152 194 162 184 Q 184 150 168 120 Q 142 80 136 55 Z" fill="${esmalte}" />
        <path d="M 104 55 Q 98 80 72 120 Q 56 150 78 184 Q 88 194 120 194 Q 152 194 162 184 Q 184 150 168 120 Q 142 80 136 55 Z" fill="url(#brillo-ceramico)" />
        <!-- Franja de color esmaltada en degradé -->
        <path d="M 72 125 Q 120 145 168 125 L 165 155 Q 120 175 75 155 Z" fill="#f4ebd9" fill-opacity="0.35" />
        <!-- Cuello y boca superior -->
        <ellipse cx="120" cy="55" rx="17" ry="6" fill="${esmalte}" stroke="#ede4d5" stroke-width="2" />
        <ellipse cx="120" cy="55" rx="12" ry="4" fill="#2d221c" />
      `;
    } else if (t === 'cuenco') {
      contenido = `
        ${sombraSuelo}
        <!-- Base cruda -->
        <ellipse cx="120" cy="178" rx="40" ry="10" fill="url(#arcilla-cruda)" />
        <!-- Cuenco exterior -->
        <path d="M 52 110 Q 58 182 120 182 Q 182 182 188 110 Z" fill="${esmalte}" />
        <path d="M 52 110 Q 58 182 120 182 Q 182 182 188 110 Z" fill="url(#brillo-ceramico)" />
        <!-- Interior esmaltado en contraste -->
        <ellipse cx="120" cy="110" rx="68" ry="20" fill="${esmalte}" stroke="#f6efe4" stroke-width="3" />
        <ellipse cx="120" cy="112" rx="62" ry="16" fill="#1f2d3d" fill-opacity="0.3" />
        <!-- Salpicado artesanal interno -->
        <circle cx="105" cy="114" r="2" fill="#ffffff" fill-opacity="0.6" />
        <circle cx="132" cy="111" r="2.5" fill="#ffffff" fill-opacity="0.5" />
        <circle cx="122" cy="118" r="1.8" fill="#ffffff" fill-opacity="0.7" />
      `;
    } else if (t === 'tetera') {
      contenido = `
        ${sombraSuelo}
        <!-- Asa curva de bambú/cerámica -->
        <path d="M 82 115 C 70 30, 170 30, 158 115" fill="none" stroke="#7a5438" stroke-width="7" stroke-linecap="round" />
        <path d="M 80 114 L 84 122 M 156 114 L 160 122" stroke="#d5b895" stroke-width="4" />
        <!-- Pico vertedor -->
        <path d="M 72 135 C 50 125, 42 100, 48 96 C 54 94, 60 108, 76 122 Z" fill="${esmalte}" stroke="url(#brillo-ceramico)" />
        <!-- Cuerpo redondo -->
        <circle cx="120" cy="142" r="48" fill="${esmalte}" />
        <circle cx="120" cy="142" r="48" fill="url(#brillo-ceramico)" />
        <!-- Base de apoyo -->
        <rect x="96" y="184" width="48" height="6" rx="3" fill="url(#arcilla-cruda)" />
        <!-- Tapa de la tetera -->
        <ellipse cx="120" cy="98" rx="26" ry="8" fill="${esmalte}" stroke="#efe7db" stroke-width="2" />
        <circle cx="120" cy="88" r="6" fill="url(#arcilla-cruda)" stroke="#efe7db" stroke-width="1.5" />
      `;
    } else if (t === 'jarra') {
      contenido = `
        ${sombraSuelo}
        <!-- Asa generosa -->
        <path d="M 146 85 C 196 90, 190 170, 138 175" fill="none" stroke="${esmalte}" stroke-width="12" stroke-linecap="round" />
        <path d="M 146 85 C 196 90, 190 170, 138 175" fill="none" stroke="url(#brillo-ceramico)" stroke-width="12" stroke-linecap="round" />
        <!-- Base -->
        <ellipse cx="112" cy="190" rx="36" ry="8" fill="url(#arcilla-cruda)" />
        <!-- Cuerpo de la jarra con pico -->
        <path d="M 72 70 L 88 186 Q 90 190 112 190 Q 134 190 136 186 L 152 75 Q 120 78 72 70 Z" fill="${esmalte}" />
        <path d="M 72 70 L 88 186 Q 90 190 112 190 Q 134 190 136 186 L 152 75 Q 120 78 72 70 Z" fill="url(#brillo-ceramico)" />
        <!-- Borde superior y pico -->
        <ellipse cx="116" cy="74" rx="36" ry="9" fill="${esmalte}" stroke="#f1ece2" stroke-width="2" />
        <path d="M 72 70 Q 64 68 62 65 Q 74 72 82 74 Z" fill="${esmalte}" />
      `;
    } else if (t === 'florero') {
      contenido = `
        ${sombraSuelo}
        <!-- Tallo seco ilustrativo saliendo del florero -->
        <path d="M 120 50 Q 115 25 125 10" fill="none" stroke="#8c7a65" stroke-width="2.5" />
        <ellipse cx="125" cy="10" rx="5" ry="8" fill="#c49a6c" transform="rotate(25 125 10)" />
        <ellipse cx="116" cy="24" rx="4" ry="7" fill="#b08556" transform="rotate(-30 116 24)" />
        <!-- Base de arcilla -->
        <ellipse cx="120" cy="192" rx="32" ry="7" fill="url(#arcilla-cruda)" />
        <!-- Cuerpo cilíndrico esbelto -->
        <path d="M 106 50 L 102 190 Q 102 193 120 193 Q 138 193 138 190 L 134 50 Z" fill="${esmalte}" />
        <path d="M 106 50 L 102 190 Q 102 193 120 193 Q 138 193 138 190 L 134 50 Z" fill="url(#brillo-ceramico)" />
        <!-- Boca del florero -->
        <ellipse cx="120" cy="50" rx="14" ry="5" fill="${esmalte}" stroke="#eee7dc" stroke-width="2" />
        <ellipse cx="120" cy="50" rx="8" ry="3" fill="#2d221c" />
      `;
    } else if (t === 'sahumador') {
      contenido = `
        ${sombraSuelo}
        <!-- Humo aromático sutil -->
        <path d="M 120 80 Q 112 55 126 35 T 118 12" fill="none" stroke="#d5c8b8" stroke-width="3" stroke-linecap="round" stroke-dasharray="6 4" opacity="0.65" />
        <!-- Base portante con patas de arcilla -->
        <rect x="80" y="172" width="14" height="14" rx="4" fill="url(#arcilla-cruda)" />
        <rect x="146" y="172" width="14" height="14" rx="4" fill="url(#arcilla-cruda)" />
        <rect x="113" y="174" width="14" height="12" rx="4" fill="url(#arcilla-cruda)" />
        <!-- Cazuela inferior -->
        <path d="M 64 135 Q 70 174 120 174 Q 170 174 176 135 Z" fill="${esmalte}" />
        <path d="M 64 135 Q 70 174 120 174 Q 170 174 176 135 Z" fill="url(#brillo-ceramico)" />
        <!-- Cúpula perforada superior -->
        <path d="M 72 135 Q 74 90 120 90 Q 166 90 168 135 Z" fill="${esmalte}" fill-opacity="0.9" />
        <ellipse cx="120" cy="135" rx="54" ry="12" fill="${esmalte}" stroke="#f0e9dc" stroke-width="2" />
        <!-- Orificios de salida del sahumador -->
        <circle cx="105" cy="110" r="4" fill="#1d1815" />
        <circle cx="120" cy="102" r="4.5" fill="#1d1815" />
        <circle cx="135" cy="110" r="4" fill="#1d1815" />
        <circle cx="120" cy="118" r="3.5" fill="#1d1815" />
      `;
    } else {
      // Por defecto forma cerámica artesanal orgánica
      contenido = `
        ${sombraSuelo}
        <ellipse cx="120" cy="185" rx="45" ry="10" fill="url(#arcilla-cruda)" />
        <path d="M 75 95 Q 70 185 120 185 Q 170 185 165 95 Z" fill="${esmalte}" />
        <path d="M 75 95 Q 70 185 120 185 Q 170 185 165 95 Z" fill="url(#brillo-ceramico)" />
        <ellipse cx="120" cy="95" rx="45" ry="12" fill="${esmalte}" stroke="#efe7db" stroke-width="2" />
        <ellipse cx="120" cy="95" rx="36" ry="8" fill="#2d221c" fill-opacity="0.3" />
      `;
    }

    return `
      <svg class="ludier-svg" viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${titulo}">
        ${defs}
        ${contenido}
      </svg>
    `.trim();
  }

  window.LudierSVGs = {
    obtenerSvgCeramica: obtenerSvgCeramica,
  };
})();
