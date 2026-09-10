/* ============================================================
   FICHA DE PROYECTO — comportamiento
   Tres cosas: WhatsApp, el visor de fotos y el píxel de Meta.
   Carpeta autocontenida: no depende de nada de fuera.
   ============================================================ */

// Ronivel. El mismo número que atiende en alta-colina.com
const WSP = "51907155138";

/* ------------------------------------------------------------
   PIXEL DE META
   Sin esto los anuncios se gastan a ciegas: Meta no sabe quién
   escribió por WhatsApp, así que no aprende a quién mostrarlos.
   Poner el ID cuando Ronivel lo mande. Vacío = no carga nada.
   ------------------------------------------------------------ */
const PIXEL_META = "";   // ej: "1234567890123456"

const $  = (s, d = document) => d.querySelector(s);
const $$ = (s, d = document) => [...d.querySelectorAll(s)];

const enlaceWsp = (texto) =>
  `https://wa.me/${WSP}?text=${encodeURIComponent(texto)}`;

function armarPixel() {
  if (!PIXEL_META) return;
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}
  (window,document,"script","https://connect.facebook.net/en_US/fbevents.js");
  /* eslint-enable */
  fbq("init", PIXEL_META);
  fbq("track", "PageView");
  const ficha = document.body.dataset.proyecto;
  if (ficha) fbq("track", "ViewContent", { content_name: ficha, content_type: "product" });
}

/** Avisa a Meta de una conversión. Si no hay píxel, no hace nada. */
function medir(evento, datos) {
  if (typeof fbq === "function") fbq("track", evento, datos || {});
}

/* ------------------------------------------------------------
   WhatsApp — todos los botones dicen "vi su página web"
   ------------------------------------------------------------ */
function armarWhatsapp() {
  const porDefecto = document.body.dataset.mensaje ||
    "Hola, vi su página web y quisiera información.";
  $$("[data-wsp]").forEach((a) => {
    a.href = enlaceWsp(a.dataset.mensaje || porDefecto);
    a.target = "_blank";
    a.rel = "noopener";
    // escribir por WhatsApp ES la conversión: es el lead que se paga
    a.addEventListener("click", () =>
      medir("Contact", { content_name: document.body.dataset.proyecto || "WhatsApp" }));
  });
}

/* ------------------------------------------------------------
   Visor de fotos — se abre al tocar una, se cierra con Esc,
   pasa con las flechas o deslizando el dedo.
   ------------------------------------------------------------ */
function armarVisor() {
  const piezas = $$("[data-foto]");
  if (!piezas.length) return;

  const visor = document.createElement("div");
  visor.className = "visor";
  visor.hidden = true;
  visor.setAttribute("role", "dialog");
  visor.setAttribute("aria-modal", "true");
  visor.setAttribute("aria-label", "Foto ampliada");
  visor.innerHTML = `
    <button class="visor__cerrar" type="button" aria-label="Cerrar">&times;</button>
    <button class="visor__paso visor__paso--antes" type="button" aria-label="Anterior">&#8249;</button>
    <img class="visor__foto" alt="">
    <button class="visor__paso visor__paso--luego" type="button" aria-label="Siguiente">&#8250;</button>
    <p class="visor__pie"></p>`;
  document.body.appendChild(visor);

  const foto = $(".visor__foto", visor);
  const pie  = $(".visor__pie", visor);
  let i = 0, ultimoFoco = null;

  const pintar = () => {
    const p = piezas[i];
    foto.src = p.dataset.foto;
    foto.alt = p.dataset.alt || "";
    pie.textContent = p.dataset.pie || "";
  };
  const abrir = (n) => {
    i = n; pintar();
    ultimoFoco = document.activeElement;
    visor.hidden = false;
    document.body.style.overflow = "hidden";
    $(".visor__cerrar", visor).focus();
  };
  const cerrar = () => {
    visor.hidden = true;
    document.body.style.overflow = "";
    if (ultimoFoco) ultimoFoco.focus();
  };
  const mover = (d) => { i = (i + d + piezas.length) % piezas.length; pintar(); };

  piezas.forEach((p, n) => {
    p.addEventListener("click", () => abrir(n));
    p.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); abrir(n); }
    });
  });

  $(".visor__cerrar", visor).addEventListener("click", cerrar);
  $(".visor__paso--antes", visor).addEventListener("click", () => mover(-1));
  $(".visor__paso--luego", visor).addEventListener("click", () => mover(1));
  visor.addEventListener("click", (e) => { if (e.target === visor) cerrar(); });

  document.addEventListener("keydown", (e) => {
    if (visor.hidden) return;
    if (e.key === "Escape")     cerrar();
    if (e.key === "ArrowLeft")  mover(-1);
    if (e.key === "ArrowRight") mover(1);
  });

  // deslizar con el dedo
  let x0 = null;
  visor.addEventListener("touchstart", (e) => { x0 = e.changedTouches[0].clientX; }, { passive: true });
  visor.addEventListener("touchend", (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 44) mover(dx < 0 ? 1 : -1);
    x0 = null;
  }, { passive: true });
}

armarPixel();
armarWhatsapp();
armarVisor();
