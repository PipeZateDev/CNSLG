;(() => {
  class GalleryModal {
    constructor(options = {}) {
      this.maxScale = options.maxScale || 4;
      this.selectors = options.selectors || ['[data-gallery]'];
      this.containers = this.selectors.flatMap(sel => Array.from(document.querySelectorAll(sel)));
      this.items = []; // {src, title, desc, thumb, originEl}
      this.current = 0;
      this.scale = 1; this.tx = 0; this.ty = 0;
      this._pointers = new Map();
      this._lastDist = 0;
      this._drag = null;
      this._build();
      this._bindContainers();
    }

    static autoInit() {
      if (window.__gm_inited) return;
      window.__gm_inited = true;
      document.addEventListener('DOMContentLoaded', () => {
        const gm = new GalleryModal();
        window.GalleryModalInstance = gm;
      });
    }

    _bindContainers() {
      this.containers.forEach(container => {
        const candidates = Array.from(container.querySelectorAll('a, img, [data-full]'));
        candidates.forEach((el) => {
          const data = this._extractItem(el);
          if (!data) return;
          this.items.push(data);
          el.addEventListener('click', (e) => {
            e.preventDefault();
            const idx = this.items.indexOf(data);
            if (idx >= 0) this.open(idx);
          }, { passive: false });
          el.style.cursor = 'zoom-in';
        });
      });
    }

    _extractItem(el) {
      // Determine full image src
      const isAnchor = el.tagName === 'A';
      const full = el.getAttribute('data-full') || (isAnchor ? el.getAttribute('href') : null) || el.getAttribute('src');
      if (!full) return null;
      const title = el.getAttribute('data-title') || el.getAttribute('title') || el.getAttribute('alt') || '';
      const desc = el.getAttribute('data-desc') || '';
      // Thumb
      const thumb = el.getAttribute('data-thumb') || (el.tagName === 'IMG' ? el.getAttribute('src') : null) || full;
      return { src: full, title, desc, thumb, originEl: el };
    }

    _build() {
      const root = document.createElement('div');
      root.className = 'gm-modal';
      root.setAttribute('role', 'dialog');
      root.setAttribute('aria-modal', 'true');
      root.setAttribute('aria-hidden', 'true');
      root.innerHTML = `
        <div class="gm-backdrop"></div>
        <div class="gm-dialog">
          <button class="gm-close" aria-label="Cerrar" type="button">×</button>
          <div class="gm-content">
            <div class="gm-visual">
              <div class="gm-stage" aria-live="polite">
                <img class="gm-image" alt="">
                <div class="gm-hint gm-hidden">Arrastra para navegar. Pellizca o usa el scroll para hacer zoom.</div>
              </div>
              <div class="gm-strip" role="listbox" aria-label="Miniaturas"></div>
            </div>
            <aside class="gm-info">
              <h3 class="gm-title"></h3>
              <div class="gm-desc"></div>
            </aside>
          </div>
          <button class="gm-nav gm-prev" aria-label="Anterior" type="button">‹</button>
          <button class="gm-nav gm-next" aria-label="Siguiente" type="button">›</button>
        </div>
      `;
      document.body.appendChild(root);
      this.root = root;
      this.stage = root.querySelector('.gm-stage');
      this.image = root.querySelector('.gm-image');
      this.titleEl = root.querySelector('.gm-title');
      this.descEl = root.querySelector('.gm-desc');
      this.strip = root.querySelector('.gm-strip');
      this.btnPrev = root.querySelector('.gm-prev');
      this.btnNext = root.querySelector('.gm-next');
      this.btnClose = root.querySelector('.gm-close');
      this.hint = root.querySelector('.gm-hint');

      // Events
      this.btnClose.addEventListener('click', () => this.close());
      this.btnPrev.addEventListener('click', () => this.prev());
      this.btnNext.addEventListener('click', () => this.next());
      root.querySelector('.gm-backdrop').addEventListener('click', () => this.close());
      document.addEventListener('keydown', (e) => {
        if (!this.isOpen()) return;
        if (e.key === 'Escape') this.close();
        else if (e.key === 'ArrowLeft') this.prev();
        else if (e.key === 'ArrowRight') this.next();
      });

      // Gestures on stage
      this._bindGestures();
    }

    open(index = 0) {
      if (!this.items.length) return;
      this.current = Math.max(0, Math.min(index, this.items.length - 1));
      this.root.classList.add('open');
      this.root.setAttribute('aria-hidden', 'false');
      this._render();
      this._showHintOnce();
    }

    close() {
      this.root.classList.remove('open');
      this.root.setAttribute('aria-hidden', 'true');
      this._resetTransform(true);
    }

    isOpen() { return this.root.classList.contains('open'); }

    prev() { this._goTo(this.current - 1); }
    next() { this._goTo(this.current + 1); }

    _goTo(i) {
      const n = this.items.length;
      if (!n) return;
      this.current = (i + n) % n;
      this._render();
    }

    _render() {
      const it = this.items[this.current];
      if (!it) return;
      // Load main image
      this.image.style.opacity = '0';
      this.image.removeAttribute('src');
      const img = new Image();
      img.onload = () => {
        this.image.src = it.src;
        this.image.alt = it.title || '';
        this._resetTransform(true);
        this.image.style.opacity = '1';
      };
      img.onerror = () => {
        this.image.src = it.src; // fallback
        this._resetTransform(true);
        this.image.style.opacity = '1';
      };
      img.src = it.src;

      // Info
      this.titleEl.textContent = it.title || '';
      this.descEl.textContent = it.desc || '';

      // Thumbs
      this._renderStrip();
    }

    _renderStrip() {
      this.strip.innerHTML = '';
      this.items.forEach((it, idx) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'gm-thumb';
        b.setAttribute('role', 'option');
        if (idx === this.current) b.setAttribute('aria-current', 'true');
        const im = document.createElement('img');
        im.alt = it.title || '';
        im.src = it.thumb || it.src;
        b.appendChild(im);
        b.addEventListener('click', () => this._goTo(idx));
        this.strip.appendChild(b);
      });
      // Scroll current into view
      const currentBtn = this.strip.querySelector('[aria-current="true"]');
      if (currentBtn && currentBtn.scrollIntoView) {
        currentBtn.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
      }
    }

    _resetTransform(hard = false) {
      this.scale = 1; this.tx = 0; this.ty = 0;
      this._applyTransform();
      if (hard) this._drag = null;
    }

    _applyTransform() {
      this.image.style.transform = `translate(${this.tx}px, ${this.ty}px) scale(${this.scale})`;
    }

    _bindGestures() {
      const stage = this.stage;
      // Pointer gesture handling
      stage.addEventListener('pointerdown', (e) => this._onPointerDown(e));
      stage.addEventListener('pointermove', (e) => this._onPointerMove(e));
      stage.addEventListener('pointerup', (e) => this._onPointerUp(e));
      stage.addEventListener('pointercancel', (e) => this._onPointerUp(e));
      stage.addEventListener('wheel', (e) => this._onWheel(e), { passive: false });
      // Prevent context menu on long-press
      stage.addEventListener('contextmenu', (e) => e.preventDefault());
    }

    _onWheel(e) {
      if (!this.isOpen()) return;
      e.preventDefault();
      const rect = this.stage.getBoundingClientRect();
      const cx = e.clientX - rect.left - rect.width / 2;
      const cy = e.clientY - rect.top - rect.height / 2;
      const delta = -e.deltaY;
      const factor = Math.exp(delta * 0.002);
      const newScale = this._clamp(this.scale * factor, 1, this.maxScale);
      const applied = newScale / this.scale;
      // Zoom around cursor
      this.tx = (this.tx + cx) * applied - cx;
      this.ty = (this.ty + cy) * applied - cy;
      this.scale = newScale;
      this._limitPan();
      this._applyTransform();
    }

    _onPointerDown(e) {
      this.stage.setPointerCapture(e.pointerId);
      this._pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (this._pointers.size === 1) {
        // start drag
        this._drag = { x: e.clientX, y: e.clientY, t: Date.now(), moved: false };
      } else if (this._pointers.size === 2) {
        // start pinch
        this._drag = null;
        const pts = Array.from(this._pointers.values());
        this._lastDist = this._dist(pts[0], pts[1]);
      }
    }

    _onPointerMove(e) {
      if (!this._pointers.has(e.pointerId)) return;
      const prev = this._pointers.get(e.pointerId);
      const curr = { x: e.clientX, y: e.clientY };
      this._pointers.set(e.pointerId, curr);

      if (this._pointers.size === 2) {
        // Pinch zoom
        const pts = Array.from(this._pointers.values());
        const dist = this._dist(pts[0], pts[1]);
        if (this._lastDist) {
          const center = { x: (pts[0].x + pts[1].x) / 2, y: (pts[0].y + pts[1].y) / 2 };
          this._zoomAround(center, dist / this._lastDist);
        }
        this._lastDist = dist;
      } else if (this._pointers.size === 1) {
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        if (this.scale > 1) {
          // Pan
          this.tx += dx; this.ty += dy;
          this._limitPan();
          this._applyTransform();
          if (this._drag) this._drag.moved = true;
        } else {
          // Swipe
          if (this._drag) {
            const totalDx = curr.x - this._drag.x;
            if (Math.abs(totalDx) > 60) {
              this._drag = null;
              if (totalDx > 0) this.prev(); else this.next();
            }
          }
        }
      }
    }

    _onPointerUp(e) {
      if (this._pointers.has(e.pointerId)) this._pointers.delete(e.pointerId);
      if (this._pointers.size < 2) this._lastDist = 0;

      if (this._pointers.size === 0 && this._drag) {
        // Tap to advance if not moved and not zoomed
        const dt = Date.now() - this._drag.t;
        const moved = this._drag.moved;
        this._drag = null;
        if (!moved && this.scale === 1 && dt < 250) {
          // Advance to next on tap
          this.next();
        }
      }
    }

    _zoomAround(centerClient, factor) {
      const rect = this.stage.getBoundingClientRect();
      const cx = centerClient.x - rect.left - rect.width / 2;
      const cy = centerClient.y - rect.top - rect.height / 2;
      const newScale = this._clamp(this.scale * factor, 1, this.maxScale);
      const applied = (newScale / this.scale) || 1;
      this.tx = (this.tx + cx) * applied - cx;
      this.ty = (this.ty + cy) * applied - cy;
      this.scale = newScale;
      this._limitPan();
      this._applyTransform();
    }

    _limitPan() {
      // Limit panning so the image doesn't escape too far
      const rect = this.stage.getBoundingClientRect();
      const imgW = rect.width, imgH = rect.height; // image fits stage bounds initially
      const maxX = Math.max(0, (imgW * this.scale - imgW) / 2);
      const maxY = Math.max(0, (imgH * this.scale - imgH) / 2);
      this.tx = this._clamp(this.tx, -maxX, maxX);
      this.ty = this._clamp(this.ty, -maxY, maxY);
    }

    _clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    _dist(a, b) { const dx = a.x - b.x, dy = a.y - b.y; return Math.hypot(dx, dy); }

    _showHintOnce() {
      if (window.__gm_hint_shown) return;
      window.__gm_hint_shown = true;
      this.hint.classList.remove('gm-hidden');
      setTimeout(() => this.hint.classList.add('gm-hidden'), 2600);
    }
  }

  // Public API
  window.GalleryModal = GalleryModal;

  // Auto-init: cualquier contenedor con data-gallery
  GalleryModal.autoInit();
})();
