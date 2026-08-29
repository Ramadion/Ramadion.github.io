const init = () => {

  /* ---- Botón volver arriba ---- */
  const crearBotonVolver = () => {
    const btn = document.createElement('button');
    btn.id = 'btn-volver';
    btn.setAttribute('aria-label', 'Volver arriba');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    Object.assign(btn.style, {
      position: 'fixed', bottom: '30px', right: '30px', zIndex: '99',
      background: 'var(--color-acento, #9b4dff)', color: '#fff', border: 'none',
      borderRadius: '50%', width: '50px', height: '50px', fontSize: '1.2rem',
      cursor: 'pointer', display: 'none',
      boxShadow: '0 4px 10px rgba(0,0,0,0.3)', transition: 'opacity 0.3s'
    });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
      btn.style.display = window.scrollY > 300 ? 'block' : 'none';
    });
  };

  /* ---- Efecto de tipeo ---- */
  const iniciarTipeo = () => {
    const el = document.querySelector('.subtitle');
    if (!el) return;
    const texto = el.textContent;
    el.textContent = '';
    let i = 0;
    const t = setInterval(() => {
      el.textContent += texto[i++];
      if (i >= texto.length) clearInterval(t);
    }, 80);
  };

  /* ---- Animación al hacer scroll ---- */
  const animarEntrada = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.animar-entrada').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
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
    }, 5000);
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
        ctx.fillStyle = `rgba(155, 77, 255, ${this.alpha})`;
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
            ctx.strokeStyle = `rgba(155, 77, 255, ${0.08 * (1 - dist / 150)})`;
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
        }
      });
    }, { threshold: 0.3 });

    fills.forEach(f => observer.observe(f));
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

  crearBotonVolver();
  iniciarTipeo();
  animarEntrada();
  iniciarCarrusel();
  initParticles();
  animarSkills();
  initForm();
  initHamburger();
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
