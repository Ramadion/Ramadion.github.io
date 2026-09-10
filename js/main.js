/* ============================================================
   GESTIÓN GYM — Portfolio de Ramiro Dion De Biase
   ============================================================ */

const reduceMotion = () =>
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const seguro = (fn) => {
  try { fn(); } catch (err) { console.error('Error de inicialización:', err); }
};

const init = () => {
  seguro(crearBarraProgreso);
  seguro(crearBotonVolver);
  seguro(efectoHeader);
  seguro(scrollspy);
  seguro(animarEntrada);
  seguro(iniciarTipeo);
  seguro(iniciarCarrusel);
  seguro(initParticles);
  seguro(animarSkills);
  seguro(initContadores);
  seguro(initTilt);
  seguro(initMagneticos);
  seguro(duplicarMarquee);
  seguro(initForm);
  seguro(initHamburger);
};

/* ---- Barra de progreso de scroll ---- */
const crearBarraProgreso = () => {
  const barra = document.createElement('div');
  barra.id = 'progreso-scroll';
  document.body.prepend(barra);
  window.addEventListener('scroll', () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    barra.style.width = pct + '%';
  }, { passive: true });
};

/* ---- Botón volver arriba ---- */
const crearBotonVolver = () => {
  const btn = document.createElement('button');
  btn.id = 'btn-volver';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  document.body.appendChild(btn);
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    btn.style.display = window.scrollY > 400 ? 'grid' : 'none';
  }, { passive: true });
};

/* ---- Header con efecto glass al scrollear ---- */
const efectoHeader = () => {
  const header = document.querySelector('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

/* ---- Scrollspy (resaltar link activo) ---- */
const scrollspy = () => {
  const links = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!links.length) return;
  const secciones = ['inicio', 'sobre-mi', 'experiencia', 'educacion', 'skills', 'contacto']
    .map(id => document.getElementById(id))
    .filter(Boolean);

  const objetivoDe = (id) => {
    if (id === 'inicio') return '#inicio';
    if (id === 'contacto') return '#contacto';
    return '#sobre-mi';
  };

  const onScroll = () => {
    const offset = window.scrollY + window.innerHeight * 0.35;
    let activo = '#inicio';
    secciones.forEach(sec => {
      if (sec.offsetTop <= offset) activo = objetivoDe(sec.id);
    });
    links.forEach(l => {
      l.classList.toggle('activo', l.getAttribute('href') === activo);
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
};

/* ---- Efecto de tipeo con múltiples roles ---- */
const iniciarTipeo = () => {
  const el = document.querySelector('.subtitle');
  if (!el) return;

  const roles = ['Desarrollador Full-Stack', 'Desarrollador Android', 'Creador de APIs', 'Futuro Lic. en Sistemas'];
  if (reduceMotion()) {
    el.textContent = roles[0];
    return;
  }

  let rol = 0, i = 0, borrando = false;
  el.innerHTML = '<span class="texto-tipeo"></span><span class="cursor-tipeo"></span>';
  const textoEl = el.querySelector('.texto-tipeo');

  const tick = () => {
    const texto = roles[rol];
    if (!borrando) {
      i++;
      textoEl.textContent = texto.slice(0, i);
      if (i === texto.length) {
        borrando = true;
        setTimeout(tick, 1800);
        return;
      }
      setTimeout(tick, 65);
    } else {
      i--;
      textoEl.textContent = texto.slice(0, i);
      if (i === 0) {
        borrando = false;
        rol = (rol + 1) % roles.length;
        setTimeout(tick, 300);
        return;
      }
      setTimeout(tick, 35);
    }
  };
  tick();
};

/* ---- Animación de entrada al hacer scroll ---- */
const animarEntrada = () => {
  const elementos = document.querySelectorAll('.animar-entrada');
  if (!elementos.length) return;

  if (!('IntersectionObserver' in window)) {
    elementos.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  elementos.forEach((el, idx) => {
    el.style.transitionDelay = `${(idx % 3) * 0.1}s`;
    observer.observe(el);
  });
};

/* ---- Carrusel de fondo del hero ---- */
const iniciarCarrusel = () => {
  const slides = document.querySelectorAll('.carousel-slide');
  if (slides.length < 2) return;
  let current = 0;
  setInterval(() => {
    slides[current].classList.remove('active');
    current = (current + 1) % slides.length;
    slides[current].classList.add('active');
  }, 5500);
};

/* ---- Partículas del hero ---- */
const initParticles = () => {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, particles = [];

  const resize = () => {
    w = canvas.width = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;
  };

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * w;
      this.y = Math.random() * h;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.r = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(167, 139, 250, ${this.alpha})`;
      ctx.fill();
    }
  }

  const init = () => {
    resize();
    particles = Array.from({ length: 80 }, () => new Particle());
  };

  const drawLines = () => {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(167, 139, 250, ${0.09 * (1 - dist / 150)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  };

  const loop = () => {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  };

  init();
  loop();
  window.addEventListener('resize', resize);
};

/* ---- Animación de skill bars ---- */
const animarSkills = () => {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('animate');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => observer.observe(f));
};

/* ---- Contadores animados (stats) ---- */
const initContadores = () => {
  const numeros = document.querySelectorAll('.stat-num[data-target]');
  if (!numeros.length) return;

  const animar = (el) => {
    const objetivo = parseFloat(el.dataset.target);
    const sufijo = el.dataset.sufijo || '';
    if (reduceMotion()) { el.textContent = objetivo + sufijo; return; }
    const dur = 1600;
    const inicio = performance.now();
    const paso = (ahora) => {
      const t = Math.min((ahora - inicio) / dur, 1);
      const suavizado = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(objetivo * suavizado) + sufijo;
      if (t < 1) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animar(e.target);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.4 });
  numeros.forEach(n => observer.observe(n));
};

/* ---- Efecto tilt + spotlight en tarjetas ---- */
const initTilt = () => {
  if (reduceMotion()) return;
  const tarjetas = document.querySelectorAll('.proyecto-card, .educacion-card, .stat-item');
  if (!tarjetas.length) return;

  tarjetas.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
      const rx = (0.5 - y) * 6;
      const ry = (x - 0.5) * 6;
      card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
};

/* ---- Botones magnéticos ---- */
const initMagneticos = () => {
  if (reduceMotion()) return;
  const botones = document.querySelectorAll('.btn');
  if (!botones.length) return;

  botones.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
};

/* ---- Duplicar contenido del marquee para loop infinito ---- */
const duplicarMarquee = () => {
  const track = document.querySelector('.marquee-track');
  if (!track) return;
  track.innerHTML += track.innerHTML;
};

/* ---- Formulario de contacto ---- */
const initForm = () => {
  const form = document.querySelector('.contacto-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const feedback = form.querySelector('.form-feedback');
    feedback.className = 'form-feedback';
    feedback.textContent = 'Enviando...';
    feedback.style.display = 'block';

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        feedback.className = 'form-feedback success';
        feedback.textContent = '¡Mensaje enviado con éxito! Te responderé pronto.';
        form.reset();
      } else {
        throw new Error('Error al enviar');
      }
    } catch {
      feedback.className = 'form-feedback error';
      feedback.textContent = 'Hubo un error al enviar. Podés escribirme directo a ramirodebiase@hotmail.com';
    }
  });
};

/* ---- Menú hamburguesa ---- */
const initHamburger = () => {
  const toggle = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', () => {
    const abierto = nav.classList.toggle('nav-open');
    toggle.setAttribute('aria-expanded', abierto);
    document.body.style.overflow = abierto ? 'hidden' : '';
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
};

document.addEventListener('DOMContentLoaded', init);

/* ---- Fullscreen demo ---- */
window.abrirDemoFullscreen = (contenedorId, videoId) => {
  const contenedor = document.getElementById(contenedorId);
  const video = document.getElementById(videoId);
  if (!contenedor || !video) return;

  video.pause();
  video.setAttribute('controls', 'controls');

  const requestFS = (el) => {
    (el.requestFullscreen || el.webkitRequestFullscreen || el.msRequestFullscreen)?.call(el);
  };
  requestFS(contenedor);
  video.play();

  const salir = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      video.pause();
      video.removeAttribute('controls');
      document.removeEventListener('fullscreenchange', salir);
      document.removeEventListener('webkitfullscreenchange', salir);
    }
  };
  document.addEventListener('fullscreenchange', salir);
  document.addEventListener('webkitfullscreenchange', salir);
};

/* ---- Toggle descripción proyectos (modal) ---- */
const cerrarModal = () => {
  const overlay = document.querySelector('.modal-overlay');
  if (!overlay) return;
  overlay.classList.remove('abierto');
  document.body.style.overflow = '';
};

window.toggleDescripcion = (e, boton) => {
  e?.preventDefault();
  e?.stopPropagation();

  const tarjeta = boton.closest('.proyecto-card');
  const desc = tarjeta?.querySelector('.proyecto-descripcion-completa');
  if (!desc) return;

  const titulo = tarjeta.querySelector('h3')?.textContent || 'Descripción';

  let overlay = document.querySelector('.modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
      <div class="modal-contenido" role="dialog" aria-modal="true">
        <button class="modal-cerrar" aria-label="Cerrar">&times;</button>
        <h3></h3>
        <div class="modal-descripcion"></div>
      </div>`;
    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay) cerrarModal();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') cerrarModal();
    });
    overlay.querySelector('.modal-cerrar').addEventListener('click', cerrarModal);
    document.body.appendChild(overlay);
  }

  overlay.querySelector('h3').textContent = titulo;
  overlay.querySelector('.modal-descripcion').innerHTML = desc.innerHTML;
  overlay.classList.add('abierto');
  document.body.style.overflow = 'hidden';
};
