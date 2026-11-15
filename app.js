/**
 * Firefox Minimalist Start Page — Application Controller
 * Features:
 * - Freely movable & resizable panels with 12px grid & edge snapping
 * - Settings toggles to turn each widget on/off individually
 * - Configurable Shortcuts (Miniatures, Icons, List; edit/remove buttons shown ONLY in edit mode)
 * - Minimalist Clock & Date panel
 * - Weather & 5-Day Forecast (Open-Meteo API)
 * - Currency Exchange & Interactive Historical Chart (manual amount input, no spinner arrows)
 * - Persistent To-Do List
 * - Project Kanban Board with custom columns & drag-and-drop cards
 * - Configurable Unsplash Backgrounds + Fonts/Colors + JSON Backup
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'firefox_startpage_state_v2';
  const LEGACY_KEY = 'firefox_startpage_state_v1';
  const GRID_SNAP = 12;
  const MAGNET_THRESHOLD = 8;
  const PANEL_GAP = 12;

  const PANEL_MINS = {
    clock: { w: 240, h: 120 },
    shortcuts: { w: 320, h: 200 },
    weather: { w: 260, h: 220 },
    currency: { w: 340, h: 240 },
    todo: { w: 260, h: 220 },
    kanban: { w: 380, h: 240 }
  };

  // Curated High-Res Unsplash Collections
  const UNSPLASH_COLLECTIONS = {
    'moody-nature': [
      {
        url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=2000&q=85',
        credit: 'Bailey Zindel — Yosemite',
        link: 'https://unsplash.com/photos/NRQV-hBF10M'
      },
      {
        url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85',
        credit: 'Kalen Emsley — Misty Peaks',
        link: 'https://unsplash.com/photos/Bkci_8qcdvQ'
      },
      {
        url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=2000&q=85',
        credit: 'Benjamin Voros — Night Ridge',
        link: 'https://unsplash.com/photos/phIFdC6lA4E'
      },
      {
        url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=2000&q=85',
        credit: 'v2osk — Highland Fog',
        link: 'https://unsplash.com/photos/1Z2niiBPg5A'
      },
      {
        url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=2000&q=85',
        credit: 'Pietro De Grandi — Alpine Lake',
        link: 'https://unsplash.com/photos/T7K4aEPoGGk'
      }
    ],
    'architecture': [
      {
        url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=2000&q=85',
        credit: 'Nordic Minimal Interior',
        link: 'https://unsplash.com'
      },
      {
        url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2000&q=85',
        credit: 'Sean Pollock — Glass Structure',
        link: 'https://unsplash.com/photos/PhYq704ffdA'
      },
      {
        url: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=2000&q=85',
        credit: 'Concrete Geometry',
        link: 'https://unsplash.com'
      },
      {
        url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=85',
        credit: 'Modern Pavilion',
        link: 'https://unsplash.com'
      }
    ],
    'night-city': [
      {
        url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=2000&q=85',
        credit: 'Tokyo Rain',
        link: 'https://unsplash.com'
      },
      {
        url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?auto=format&fit=crop&w=2000&q=85',
        credit: 'Metropolitan Dusk',
        link: 'https://unsplash.com'
      },
      {
        url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=2000&q=85',
        credit: 'Night Grid',
        link: 'https://unsplash.com'
      },
      {
        url: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=2000&q=85',
        credit: 'Shibuya Crossing',
        link: 'https://unsplash.com'
      }
    ],
    'cosmos': [
      {
        url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=2000&q=85',
        credit: 'NASA — Deep Nebula',
        link: 'https://unsplash.com/photos/rTZW4f02zY8'
      },
      {
        url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=2000&q=85',
        credit: 'NASA — Orbital Horizon',
        link: 'https://unsplash.com/photos/Q1p7bh3SHj8'
      },
      {
        url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=2000&q=85',
        credit: 'Galactic Core',
        link: 'https://unsplash.com'
      }
    ],
    'ocean': [
      {
        url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=2000&q=85',
        credit: 'Pacific Swell',
        link: 'https://unsplash.com'
      },
      {
        url: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=2000&q=85',
        credit: 'Dark Atlantic',
        link: 'https://unsplash.com'
      },
      {
        url: 'https://images.unsplash.com/photo-1468581264429-2548ef9eb732?auto=format&fit=crop&w=2000&q=85',
        credit: 'Nordic Coast',
        link: 'https://unsplash.com'
      }
    ],
    'abstract': [
      {
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=2000&q=85',
        credit: 'Milad Fakurian — Obsidian Forms',
        link: 'https://unsplash.com/photos/PGdW_bHDbpI'
      },
      {
        url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=2000&q=85',
        credit: 'Glass Waves',
        link: 'https://unsplash.com'
      },
      {
        url: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=2000&q=85',
        credit: 'Chromatic Texture',
        link: 'https://unsplash.com'
      }
    ]
  };

  const CURRENCY_LIST = [
    { code: 'EUR', name: 'Euro' },
    { code: 'USD', name: 'US Dollar' },
    { code: 'PLN', name: 'Polish Zloty' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'CHF', name: 'Swiss Franc' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CZK', name: 'Czech Koruna' },
    { code: 'SEK', name: 'Swedish Krona' },
    { code: 'NOK', name: 'Norwegian Krone' },
    { code: 'DKK', name: 'Danish Krone' },
    { code: 'HUF', name: 'Hungarian Forint' },
    { code: 'CNY', name: 'Chinese Yuan' },
    { code: 'SGD', name: 'Singapore Dollar' },
    { code: 'NZD', name: 'New Zealand Dollar' },
    { code: 'MXN', name: 'Mexican Peso' },
    { code: 'BRL', name: 'Brazilian Real' },
    { code: 'INR', name: 'Indian Rupee' },
    { code: 'KRW', name: 'South Korean Won' }
  ];

  const FALLBACK_EUR_RATES = {
    EUR: 1.0,
    USD: 1.084,
    PLN: 4.318,
    GBP: 0.842,
    CHF: 0.941,
    JPY: 164.2,
    CAD: 1.498,
    AUD: 1.652,
    CZK: 25.24,
    SEK: 11.48,
    NOK: 11.76,
    DKK: 7.458,
    HUF: 406.5,
    CNY: 7.82,
    SGD: 1.448,
    NZD: 1.81,
    MXN: 21.65,
    BRL: 6.24,
    INR: 91.3,
    KRW: 1508.0
  };

  const DEFAULT_STATE = {
    theme: 'dark',
    accent: '#e4e4e7',
    glassOpacity: 78,
    glassBlur: 20,
    font: 'inter',
    clock24h: true,
    clockSeconds: true,
    showGreeting: false,
    userName: '',
    bgTopic: 'moody-nature',
    bgIndex: 0,
    customBgUrl: '',
    unsplashKey: '',
    unsplashQuery: '',
    bgDim: 52,
    bgBlur: 0,
    shortcutView: 'miniatures',
    shortcutCols: 4,
    layoutLocked: false,
    visibleWidgets: {
      clock: true,
      shortcuts: true,
      weather: true,
      currency: true,
      todo: true,
      kanban: true
    },
    panelLayout: null,
    shortcuts: [
      { id: 'sc-1', title: 'GitHub', url: 'https://github.com', thumbMode: 'auto-shot', customThumb: '', color: '#3f3f46' },
      { id: 'sc-2', title: 'YouTube', url: 'https://www.youtube.com', thumbMode: 'auto-shot', customThumb: '', color: '#3f3f46' },
      { id: 'sc-3', title: 'Hacker News', url: 'https://news.ycombinator.com', thumbMode: 'auto-shot', customThumb: '', color: '#3f3f46' },
      { id: 'sc-4', title: 'Reddit', url: 'https://www.reddit.com', thumbMode: 'auto-shot', customThumb: '', color: '#3f3f46' },
      { id: 'sc-5', title: 'Wikipedia', url: 'https://www.wikipedia.org', thumbMode: 'auto-shot', customThumb: '', color: '#3f3f46' },
      { id: 'sc-6', title: 'MDN Docs', url: 'https://developer.mozilla.org', thumbMode: 'auto-shot', customThumb: '', color: '#3f3f46' },
      { id: 'sc-7', title: 'Gmail', url: 'https://mail.google.com', thumbMode: 'favicon', customThumb: '', color: '#3f3f46' },
      { id: 'sc-8', title: 'ChatGPT', url: 'https://chatgpt.com', thumbMode: 'favicon', customThumb: '', color: '#3f3f46' }
    ],
    weather: {
      city: 'Warsaw',
      lat: 52.2297,
      lon: 21.0122,
      unit: 'C'
    },
    currency: {
      base: 'EUR',
      target: 'PLN',
      rangeDays: 30,
      amount: 100,
      watchlist: ['EUR/USD', 'EUR/PLN', 'USD/PLN', 'GBP/EUR']
    },
    todos: [
      { id: 'td-1', text: 'Drag panel headers to move or drag corners to resize', completed: false, priority: 'normal' },
      { id: 'td-2', text: 'Click Edit in Shortcuts to modify or remove links', completed: false, priority: 'normal' }
    ],
    todoFilter: 'all',
    kanban: {
      columns: [
        {
          id: 'col-backlog',
          title: 'Backlog',
          cards: [
            { id: 'kb-1', text: 'Research Firefox custom CSS tweaks' },
            { id: 'kb-2', text: 'Organize bookmark folders' }
          ]
        },
        {
          id: 'col-progress',
          title: 'In Progress',
          cards: [
            { id: 'kb-3', text: 'Configure start page layout & widgets' }
          ]
        },
        {
          id: 'col-done',
          title: 'Done',
          cards: [
            { id: 'kb-4', text: 'Set up minimalist dark theme' }
          ]
        }
      ]
    }
  };

  let state = loadState();
  let isEditingShortcuts = false;
  let currentFxSeries = [];
  let topZIndex = 10;
  let draggedKanbanCard = null;

  // ==========================================
  // STATE PERSISTENCE
  // ==========================================
  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
      if (!raw) return structuredClone(DEFAULT_STATE);
      const parsed = JSON.parse(raw);
      return {
        ...structuredClone(DEFAULT_STATE),
        ...parsed,
        visibleWidgets: {
          ...DEFAULT_STATE.visibleWidgets,
          ...(parsed.visibleWidgets || {})
        },
        weather: { ...DEFAULT_STATE.weather, ...(parsed.weather || {}) },
        currency: { ...DEFAULT_STATE.currency, ...(parsed.currency || {}) },
        kanban: parsed.kanban && Array.isArray(parsed.kanban.columns)
          ? parsed.kanban
          : structuredClone(DEFAULT_STATE.kanban)
      };
    } catch {
      return structuredClone(DEFAULT_STATE);
    }
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state:', e);
    }
  }

  // ==========================================
  // PANEL LAYOUT & VISIBILITY ENGINE
  // ==========================================
  function snap(value) {
    return Math.round(value / GRID_SNAP) * GRID_SNAP;
  }

  function computeDefaultLayout() {
    const ws = document.getElementById('workspace');
    const totalW = Math.max(ws ? ws.clientWidth : window.innerWidth - 40, 960);

    const leftW = snap(totalW * 0.62);
    const rightX = leftW + PANEL_GAP;
    const rightW = Math.max(280, snap(totalW - rightX));

    const clockH = 132;
    const shortcutsY = clockH + PANEL_GAP;
    const shortcutsH = 336;

    const currencyY = shortcutsY + shortcutsH + PANEL_GAP;
    const currencyH = 288;

    const weatherH = 264;
    const todoY = weatherH + PANEL_GAP;
    const todoH = currencyY + currencyH - todoY;

    const kanbanY = currencyY + currencyH + PANEL_GAP;
    const kanbanH = 312;

    return {
      clock: { x: 0, y: 0, w: leftW, h: clockH },
      shortcuts: { x: 0, y: shortcutsY, w: leftW, h: shortcutsH },
      currency: { x: 0, y: currencyY, w: leftW, h: currencyH },
      weather: { x: rightX, y: 0, w: rightW, h: weatherH },
      todo: { x: rightX, y: todoY, w: rightW, h: Math.max(240, todoH) },
      kanban: { x: 0, y: kanbanY, w: totalW, h: kanbanH }
    };
  }

  function applyPanelLayout() {
    const ws = document.getElementById('workspace');
    if (!ws) return;

    const defaults = computeDefaultLayout();
    if (!state.panelLayout) {
      state.panelLayout = defaults;
      saveState();
    } else {
      // Ensure any newly added panels (like kanban) have a default position
      for (const [k, defBox] of Object.entries(defaults)) {
        if (!state.panelLayout[k]) {
          state.panelLayout[k] = defBox;
        }
      }
    }

    const wsWidth = ws.clientWidth || window.innerWidth - 40;
    let maxBottom = 400;

    document.querySelectorAll('.panel[data-panel-id]').forEach((panel) => {
      const id = panel.dataset.panelId;
      const isVisible = state.visibleWidgets?.[id] !== false;
      panel.hidden = !isVisible;
      if (!isVisible) return;

      const box = state.panelLayout[id];
      if (!box) return;

      const min = PANEL_MINS[id] || { w: 220, h: 120 };
      const w = Math.max(min.w, Math.min(box.w, wsWidth));
      const x = Math.max(0, Math.min(box.x, Math.max(0, wsWidth - w)));
      const y = Math.max(0, box.y);
      const h = Math.max(min.h, box.h);

      panel.style.left = `${x}px`;
      panel.style.top = `${y}px`;
      panel.style.width = `${w}px`;
      panel.style.height = `${h}px`;

      if (y + h > maxBottom) maxBottom = y + h;
    });

    ws.style.minHeight = `${maxBottom + 24}px`;

    // Sync lock state UI
    document.body.classList.toggle('layout-locked', !!state.layoutLocked);
    const lockBtn = document.getElementById('btn-lock-layout');
    const lockLabel = document.getElementById('lock-layout-label');
    if (lockBtn) lockBtn.classList.toggle('active', !!state.layoutLocked);
    if (lockLabel) lockLabel.textContent = state.layoutLocked ? 'Unlock Layout' : 'Lock Layout';

    // Sync widget visibility checkboxes in Settings
    document.querySelectorAll('[data-toggle-widget]').forEach((cb) => {
      const wId = cb.dataset.toggleWidget;
      cb.checked = state.visibleWidgets?.[wId] !== false;
    });
  }

  function getOtherPanelRects(excludeId) {
    const rects = [];
    if (!state.panelLayout) return rects;
    for (const [id, box] of Object.entries(state.panelLayout)) {
      if (id !== excludeId && box && state.visibleWidgets?.[id] !== false) {
        rects.push({
          left: box.x,
          top: box.y,
          right: box.x + box.w,
          bottom: box.y + box.h
        });
      }
    }
    return rects;
  }

  function setupPanelInteractions() {
    const ws = document.getElementById('workspace');
    if (!ws) return;

    document.querySelectorAll('.panel[data-panel-id]').forEach((panel) => {
      const id = panel.dataset.panelId;
      const header = panel.querySelector('[data-drag-handle]');

      panel.addEventListener('mousedown', () => {
        topZIndex += 1;
        panel.style.zIndex = String(topZIndex);
      });

      // 1. Drag to Move via Panel Header
      if (header) {
        header.addEventListener('mousedown', (e) => {
          if (state.layoutLocked || window.innerWidth <= 760) return;
          if (e.button !== 0) return;
          if (e.target.closest('[data-no-drag], button, input, select, a')) return;

          e.preventDefault();
          const startMouseX = e.clientX;
          const startMouseY = e.clientY;
          const currentBox = state.panelLayout[id] || {
            x: panel.offsetLeft,
            y: panel.offsetTop,
            w: panel.offsetWidth,
            h: panel.offsetHeight
          };
          const startX = currentBox.x;
          const startY = currentBox.y;
          const others = getOtherPanelRects(id);
          const wsWidth = ws.clientWidth;

          panel.classList.add('is-dragging');
          ws.classList.add('is-interacting');

          function onMouseMove(ev) {
            const dx = ev.clientX - startMouseX;
            const dy = ev.clientY - startMouseY;

            let nextX = snap(startX + dx);
            let nextY = snap(startY + dy);

            nextX = Math.max(0, Math.min(nextX, Math.max(0, wsWidth - currentBox.w)));
            nextY = Math.max(0, nextY);

            for (const r of others) {
              if (Math.abs(nextX - r.left) <= MAGNET_THRESHOLD) nextX = r.left;
              if (Math.abs(nextX - (r.right + PANEL_GAP)) <= MAGNET_THRESHOLD) nextX = r.right + PANEL_GAP;
              if (Math.abs(nextX + currentBox.w - r.right) <= MAGNET_THRESHOLD) nextX = r.right - currentBox.w;
              if (Math.abs(nextX + currentBox.w - (r.left - PANEL_GAP)) <= MAGNET_THRESHOLD) nextX = r.left - PANEL_GAP - currentBox.w;

              if (Math.abs(nextY - r.top) <= MAGNET_THRESHOLD) nextY = r.top;
              if (Math.abs(nextY - (r.bottom + PANEL_GAP)) <= MAGNET_THRESHOLD) nextY = r.bottom + PANEL_GAP;
              if (Math.abs(nextY + currentBox.h - r.bottom) <= MAGNET_THRESHOLD) nextY = r.bottom - currentBox.h;
            }

            state.panelLayout[id].x = nextX;
            state.panelLayout[id].y = nextY;
            panel.style.left = `${nextX}px`;
            panel.style.top = `${nextY}px`;
          }

          function onMouseUp() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            panel.classList.remove('is-dragging');
            ws.classList.remove('is-interacting');
            saveState();
            applyPanelLayout();
          }

          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
        });
      }

      // 2. Drag to Resize via Edge/Corner Handles
      panel.querySelectorAll('.resize-handle').forEach((handle) => {
        handle.addEventListener('mousedown', (e) => {
          if (state.layoutLocked || window.innerWidth <= 760) return;
          if (e.button !== 0) return;
          e.preventDefault();
          e.stopPropagation();

          const dir = handle.dataset.resize || 'se';
          const startMouseX = e.clientX;
          const startMouseY = e.clientY;
          const currentBox = state.panelLayout[id];
          const startW = currentBox.w;
          const startH = currentBox.h;
          const min = PANEL_MINS[id] || { w: 220, h: 120 };
          const others = getOtherPanelRects(id);
          const wsWidth = ws.clientWidth;

          panel.classList.add('is-resizing');
          ws.classList.add('is-interacting');

          function onMouseMove(ev) {
            const dx = ev.clientX - startMouseX;
            const dy = ev.clientY - startMouseY;

            let nextW = startW;
            let nextH = startH;

            if (dir.includes('e')) {
              nextW = snap(Math.max(min.w, Math.min(startW + dx, wsWidth - currentBox.x)));
              const rightEdge = currentBox.x + nextW;
              for (const r of others) {
                if (Math.abs(rightEdge - r.right) <= MAGNET_THRESHOLD) nextW = r.right - currentBox.x;
                if (Math.abs(rightEdge - (r.left - PANEL_GAP)) <= MAGNET_THRESHOLD) nextW = r.left - PANEL_GAP - currentBox.x;
              }
            }

            if (dir.includes('s')) {
              nextH = snap(Math.max(min.h, startH + dy));
              const bottomEdge = currentBox.y + nextH;
              for (const r of others) {
                if (Math.abs(bottomEdge - r.bottom) <= MAGNET_THRESHOLD) nextH = r.bottom - currentBox.y;
                if (Math.abs(bottomEdge - (r.top - PANEL_GAP)) <= MAGNET_THRESHOLD) nextH = r.top - PANEL_GAP - currentBox.y;
              }
            }

            state.panelLayout[id].w = Math.max(min.w, nextW);
            state.panelLayout[id].h = Math.max(min.h, nextH);
            panel.style.width = `${state.panelLayout[id].w}px`;
            panel.style.height = `${state.panelLayout[id].h}px`;
          }

          function onMouseUp() {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            panel.classList.remove('is-resizing');
            ws.classList.remove('is-interacting');
            saveState();
            applyPanelLayout();
          }

          window.addEventListener('mousemove', onMouseMove);
          window.addEventListener('mouseup', onMouseUp);
        });
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) {
        applyPanelLayout();
      }
    });
  }

  // ==========================================
  // THEME, FONTS & APPEARANCE
  // ==========================================
  function hexToRgbString(hex) {
    const clean = (hex || '#e4e4e7').replace('#', '');
    if (clean.length !== 6) return '228, 228, 231';
    const r = parseInt(clean.substring(0, 2), 16) || 228;
    const g = parseInt(clean.substring(2, 4), 16) || 228;
    const b = parseInt(clean.substring(4, 6), 16) || 231;
    return `${r}, ${g}, ${b}`;
  }

  function applyThemeAndAppearance() {
    const root = document.documentElement;
    root.setAttribute('data-theme', state.theme || 'dark');
    document.body.setAttribute('data-font', state.font || 'inter');

    const glassBlur = state.glassBlur !== undefined ? state.glassBlur : 20;
    root.style.setProperty('--accent', state.accent);
    root.style.setProperty('--accent-rgb', hexToRgbString(state.accent));
    root.style.setProperty('--glass-opacity', (state.glassOpacity / 100).toFixed(2));
    root.style.setProperty('--glass-blur', `${glassBlur}px`);
    root.style.setProperty('--bg-dim', (state.bgDim / 100).toFixed(2));
    root.style.setProperty('--bg-blur', `${state.bgBlur}px`);
    root.style.setProperty('--shortcut-cols', String(state.shortcutCols || 4));

    document.querySelectorAll('#theme-mode-selector .theme-pill').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.themeVal === state.theme);
    });

    document.querySelectorAll('#accent-swatch-row .color-swatch').forEach((sw) => {
      sw.classList.toggle('active', sw.dataset.accent.toLowerCase() === state.accent.toLowerCase());
    });

    const customAccentInput = document.getElementById('custom-accent-input');
    if (customAccentInput) customAccentInput.value = state.accent;

    const glassRange = document.getElementById('setting-glass-opacity');
    const glassLabel = document.getElementById('val-glass-opacity');
    if (glassRange) glassRange.value = state.glassOpacity;
    if (glassLabel) glassLabel.textContent = `${state.glassOpacity}%`;

    const glassBlurRange = document.getElementById('setting-glass-blur');
    const glassBlurLabel = document.getElementById('val-glass-blur');
    if (glassBlurRange) glassBlurRange.value = glassBlur;
    if (glassBlurLabel) glassBlurLabel.textContent = `${glassBlur}px`;

    const fontSelect = document.getElementById('setting-font-family');
    if (fontSelect) fontSelect.value = state.font;

    const c24 = document.getElementById('setting-clock-24h');
    if (c24) c24.checked = !!state.clock24h;

    const cSec = document.getElementById('setting-clock-seconds');
    if (cSec) cSec.checked = !!state.clockSeconds;

    const showGreet = document.getElementById('setting-show-greeting');
    if (showGreet) showGreet.checked = !!state.showGreeting;

    const userNameIn = document.getElementById('setting-user-name');
    if (userNameIn) userNameIn.value = state.userName || '';

    const bgTopicSel = document.getElementById('setting-bg-topic');
    if (bgTopicSel) bgTopicSel.value = state.bgTopic;

    const customBgGroup = document.getElementById('custom-bg-url-group');
    if (customBgGroup) customBgGroup.hidden = state.bgTopic !== 'custom-url';

    const customBgInput = document.getElementById('setting-custom-bg-url');
    if (customBgInput) customBgInput.value = state.customBgUrl || '';

    const unsplashKeyIn = document.getElementById('setting-unsplash-key');
    if (unsplashKeyIn) unsplashKeyIn.value = state.unsplashKey || '';

    const unsplashQueryIn = document.getElementById('setting-unsplash-query');
    if (unsplashQueryIn) unsplashQueryIn.value = state.unsplashQuery || '';

    const dimRange = document.getElementById('setting-bg-dim');
    const dimVal = document.getElementById('val-bg-dim');
    if (dimRange) dimRange.value = state.bgDim;
    if (dimVal) dimVal.textContent = `${state.bgDim}%`;

    const blurRange = document.getElementById('setting-bg-blur');
    const blurVal = document.getElementById('val-bg-blur');
    if (blurRange) blurRange.value = state.bgBlur;
    if (blurVal) blurVal.textContent = `${state.bgBlur}px`;

    const scCols = document.getElementById('setting-shortcut-cols');
    if (scCols) scCols.value = String(state.shortcutCols || 4);

    const watchlistInput = document.getElementById('setting-watchlist-pairs');
    if (watchlistInput) watchlistInput.value = (state.currency.watchlist || []).join(', ');
  }

  // ==========================================
  // UNSPLASH WALLPAPER CONTROLLER
  // ==========================================
  function applyWallpaper(photoObj) {
    const imgEl = document.getElementById('wallpaper-image');
    const creditText = document.getElementById('wallpaper-credit-text');
    const creditLink = document.getElementById('wallpaper-credit-link');

    if (!photoObj || state.bgTopic === 'none') {
      imgEl.classList.remove('loaded');
      imgEl.style.backgroundImage = 'none';
      if (creditText) creditText.textContent = 'Solid Background';
      if (creditLink) creditLink.hidden = true;
      return;
    }

    const preload = new Image();
    preload.onload = () => {
      imgEl.style.backgroundImage = `url("${photoObj.url}")`;
      imgEl.classList.add('loaded');
    };
    preload.onerror = () => {
      imgEl.style.backgroundImage = `url("${photoObj.url}")`;
      imgEl.classList.add('loaded');
    };
    preload.src = photoObj.url;

    if (creditText) creditText.textContent = photoObj.credit || 'Unsplash';
    if (creditLink) {
      creditLink.hidden = false;
      creditLink.href = photoObj.link || 'https://unsplash.com';
    }
  }

  function loadCurrentWallpaper() {
    if (state.bgTopic === 'none') {
      applyWallpaper(null);
      return;
    }
    if (state.bgTopic === 'custom-url' && state.customBgUrl) {
      applyWallpaper({
        url: state.customBgUrl,
        credit: 'Custom Wallpaper',
        link: state.customBgUrl
      });
      return;
    }
    const pool = UNSPLASH_COLLECTIONS[state.bgTopic] || UNSPLASH_COLLECTIONS['moody-nature'];
    const idx = Math.abs(state.bgIndex || 0) % pool.length;
    applyWallpaper(pool[idx]);
  }

  async function cycleNextWallpaper() {
    if (state.unsplashKey && state.unsplashKey.trim().length > 10) {
      const query = encodeURIComponent(state.unsplashQuery || state.bgTopic.replace('-', ' '));
      try {
        const res = await fetch(
          `https://api.unsplash.com/photos/random?orientation=landscape&query=${query}`,
          { headers: { Authorization: `Client-ID ${state.unsplashKey.trim()}` } }
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.urls && data.urls.regular) {
            applyWallpaper({
              url: data.urls.full || data.urls.regular,
              credit: `${data.user?.name || 'Unsplash'}`,
              link: data.links?.html || 'https://unsplash.com'
            });
            return;
          }
        }
      } catch {
        // Fallback to curated collection
      }
    }

    if (state.bgTopic === 'none' || state.bgTopic === 'custom-url') {
      state.bgTopic = 'moody-nature';
      const sel = document.getElementById('setting-bg-topic');
      if (sel) sel.value = 'moody-nature';
    }
    const pool = UNSPLASH_COLLECTIONS[state.bgTopic] || UNSPLASH_COLLECTIONS['moody-nature'];
    state.bgIndex = ((state.bgIndex || 0) + 1) % pool.length;
    saveState();
    loadCurrentWallpaper();
  }

  // ==========================================
  // 1. CLOCK & DATE WIDGET
  // ==========================================
  function updateClock() {
    const now = new Date();
    const hours24 = now.getHours();
    const mins = String(now.getMinutes()).padStart(2, '0');
    const secs = String(now.getSeconds()).padStart(2, '0');

    let displayHours = hours24;
    let ampm = '';
    if (!state.clock24h) {
      ampm = hours24 >= 12 ? 'PM' : 'AM';
      displayHours = hours24 % 12 || 12;
    }
    const hoursStr = state.clock24h ? String(displayHours).padStart(2, '0') : String(displayHours);

    const timeEl = document.getElementById('clock-time');
    const secEl = document.getElementById('clock-seconds');
    const ampmEl = document.getElementById('clock-ampm');
    const dateEl = document.getElementById('clock-date');
    const greetEl = document.getElementById('clock-greeting');

    if (timeEl) timeEl.textContent = `${hoursStr}:${mins}`;
    if (secEl) {
      secEl.textContent = secs;
      secEl.hidden = !state.clockSeconds;
    }
    if (ampmEl) {
      ampmEl.textContent = ampm;
      ampmEl.hidden = !!state.clock24h;
    }

    if (greetEl) {
      if (state.showGreeting) {
        let greetBase = 'Good evening';
        if (hours24 >= 5 && hours24 < 12) greetBase = 'Good morning';
        else if (hours24 >= 12 && hours24 < 18) greetBase = 'Good afternoon';
        greetEl.hidden = false;
        greetEl.textContent = state.userName ? `${greetBase}, ${state.userName} —` : `${greetBase} —`;
      } else {
        greetEl.hidden = true;
      }
    }

    if (dateEl) {
      dateEl.textContent = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
      }).format(now);
    }
  }

  // ==========================================
  // 2. SHORTCUTS WIDGET (EDIT MODE ONLY ACTIONS)
  // ==========================================
  function normalizeUrl(raw) {
    const trimmed = (raw || '').trim();
    if (!trimmed) return 'https://example.com';
    if (/^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(trimmed)) return trimmed;
    return `https://${trimmed}`;
  }

  function extractHostname(urlStr) {
    try {
      const u = new URL(normalizeUrl(urlStr));
      return u.hostname.replace(/^www\./, '');
    } catch {
      return urlStr;
    }
  }

  function getFaviconUrl(urlStr) {
    const host = extractHostname(urlStr);
    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=128`;
  }

  function getWebsiteMiniatureUrl(urlStr) {
    const normalized = normalizeUrl(urlStr);
    return `https://api.microlink.io/?url=${encodeURIComponent(normalized)}&screenshot=true&meta=false&embed=screenshot.url`;
  }

  function renderShortcuts() {
    const grid = document.getElementById('shortcuts-grid');
    const editBtn = document.getElementById('btn-toggle-edit-shortcuts');
    if (!grid) return;

    grid.className = `shortcuts-grid view-${state.shortcutView || 'miniatures'}${isEditingShortcuts ? ' editing' : ''}`;
    if (editBtn) {
      editBtn.classList.toggle('active', isEditingShortcuts);
      editBtn.textContent = isEditingShortcuts ? 'Done' : 'Edit';
    }

    document.querySelectorAll('[data-shortcut-view]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.shortcutView === state.shortcutView);
    });

    grid.innerHTML = '';

    state.shortcuts.forEach((item, index) => {
      const card = document.createElement('a');
      card.className = 'shortcut-card';
      card.href = normalizeUrl(item.url);

      card.addEventListener('click', (e) => {
        if (isEditingShortcuts) {
          e.preventDefault();
          openShortcutModal(item);
        }
      });

      const host = extractHostname(item.url);
      const favUrl = getFaviconUrl(item.url);
      const monogramLetter = (item.title || host || '?').trim().charAt(0).toUpperCase();

      const thumbWrap = document.createElement('div');
      thumbWrap.className = 'shortcut-miniature-wrap';

      const isMiniatureView = state.shortcutView === 'miniatures';
      const mode = item.thumbMode || 'auto-shot';

      if (mode === 'custom' && item.customThumb) {
        const customVal = item.customThumb.trim();
        if (/^https?:\/\/|^data:image\//i.test(customVal)) {
          const img = document.createElement('img');
          img.className = isMiniatureView ? 'shortcut-thumb-img' : 'shortcut-brand-icon';
          img.src = customVal;
          img.alt = item.title;
          img.loading = 'lazy';
          thumbWrap.appendChild(img);
        } else {
          const stage = document.createElement('div');
          stage.className = 'shortcut-brand-stage';
          const emojiEl = document.createElement('div');
          emojiEl.className = 'shortcut-emoji-avatar';
          emojiEl.textContent = customVal.slice(0, 2);
          stage.appendChild(emojiEl);
          thumbWrap.appendChild(stage);
        }
      } else if (isMiniatureView && mode === 'auto-shot') {
        const stage = document.createElement('div');
        stage.className = 'shortcut-brand-stage';

        const fallbackIcon = document.createElement('img');
        fallbackIcon.className = 'shortcut-brand-icon';
        fallbackIcon.src = favUrl;
        fallbackIcon.alt = '';
        fallbackIcon.onerror = () => {
          fallbackIcon.replaceWith(createMonogramEl(monogramLetter));
        };
        stage.appendChild(fallbackIcon);
        thumbWrap.appendChild(stage);

        const shotImg = document.createElement('img');
        shotImg.className = 'shortcut-thumb-img';
        shotImg.src = getWebsiteMiniatureUrl(item.url);
        shotImg.alt = `${item.title} preview`;
        shotImg.loading = 'lazy';
        shotImg.style.position = 'absolute';
        shotImg.style.inset = '0';
        shotImg.onload = () => {
          stage.style.opacity = '0';
        };
        shotImg.onerror = () => {
          shotImg.remove();
        };
        thumbWrap.appendChild(shotImg);
      } else {
        const stage = document.createElement('div');
        stage.className = 'shortcut-brand-stage';
        const iconImg = document.createElement('img');
        iconImg.className = 'shortcut-brand-icon';
        iconImg.src = favUrl;
        iconImg.alt = item.title;
        iconImg.loading = 'lazy';
        iconImg.onerror = () => {
          iconImg.replaceWith(createMonogramEl(monogramLetter));
        };
        stage.appendChild(iconImg);
        thumbWrap.appendChild(stage);
      }

      const metaBar = document.createElement('div');
      metaBar.className = 'shortcut-meta-bar';

      const miniFav = document.createElement('img');
      miniFav.className = 'shortcut-mini-favicon';
      miniFav.src = favUrl;
      miniFav.alt = '';
      miniFav.onerror = () => {
        miniFav.style.display = 'none';
      };

      const textCol = document.createElement('div');
      textCol.className = 'shortcut-text-col';

      const nameSpan = document.createElement('span');
      nameSpan.className = 'shortcut-name';
      nameSpan.textContent = item.title;

      const domainSpan = document.createElement('span');
      domainSpan.className = 'shortcut-domain';
      domainSpan.textContent = host;

      textCol.appendChild(nameSpan);
      if (state.shortcutView !== 'icons') {
        textCol.appendChild(domainSpan);
      }

      metaBar.appendChild(miniFav);
      metaBar.appendChild(textCol);

      // Edit/Move/Remove buttons — visible ONLY when .shortcuts-grid.editing is active
      const actions = document.createElement('div');
      actions.className = 'shortcut-edit-actions';

      if (index > 0) {
        actions.appendChild(
          createActionBtn('Move left', '←', (e) => {
            e.preventDefault();
            e.stopPropagation();
            moveShortcut(index, -1);
          })
        );
      }

      if (index < state.shortcuts.length - 1) {
        actions.appendChild(
          createActionBtn('Move right', '→', (e) => {
            e.preventDefault();
            e.stopPropagation();
            moveShortcut(index, 1);
          })
        );
      }

      actions.appendChild(
        createActionBtn('Edit', '✎', (e) => {
          e.preventDefault();
          e.stopPropagation();
          openShortcutModal(item);
        })
      );

      actions.appendChild(
        createActionBtn(
          'Remove',
          '×',
          (e) => {
            e.preventDefault();
            e.stopPropagation();
            deleteShortcut(item.id);
          },
          true
        )
      );

      card.appendChild(thumbWrap);
      card.appendChild(metaBar);
      card.appendChild(actions);

      grid.appendChild(card);
    });
  }

  function createMonogramEl(letter) {
    const el = document.createElement('div');
    el.className = 'shortcut-monogram';
    el.textContent = letter;
    return el;
  }

  function createActionBtn(title, symbol, handler, isDelete = false) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `card-action-btn${isDelete ? ' delete' : ''}`;
    btn.title = title;
    btn.textContent = symbol;
    btn.addEventListener('click', handler);
    return btn;
  }

  function moveShortcut(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= state.shortcuts.length) return;
    const temp = state.shortcuts[index];
    state.shortcuts[index] = state.shortcuts[target];
    state.shortcuts[target] = temp;
    saveState();
    renderShortcuts();
  }

  function deleteShortcut(id) {
    state.shortcuts = state.shortcuts.filter((s) => s.id !== id);
    saveState();
    renderShortcuts();
  }

  function openShortcutModal(shortcut = null) {
    const modal = document.getElementById('shortcut-modal');
    const titleEl = document.getElementById('shortcut-modal-title');
    const idIn = document.getElementById('shortcut-id');
    const nameIn = document.getElementById('shortcut-title');
    const urlIn = document.getElementById('shortcut-url');
    const customIn = document.getElementById('shortcut-custom-thumb');
    const customField = document.getElementById('custom-thumb-field');
    const colorIn = document.getElementById('shortcut-color');

    if (shortcut) {
      titleEl.textContent = 'Edit Shortcut';
      idIn.value = shortcut.id;
      nameIn.value = shortcut.title;
      urlIn.value = shortcut.url;
      customIn.value = shortcut.customThumb || '';
      colorIn.value = shortcut.color || '#3f3f46';
      const mode = shortcut.thumbMode || 'auto-shot';
      const radio = document.querySelector(`input[name="shortcut-thumb-mode"][value="${mode}"]`);
      if (radio) radio.checked = true;
      customField.hidden = mode !== 'custom';
    } else {
      titleEl.textContent = 'New Shortcut';
      idIn.value = '';
      nameIn.value = '';
      urlIn.value = '';
      customIn.value = '';
      colorIn.value = '#3f3f46';
      const radio = document.querySelector('input[name="shortcut-thumb-mode"][value="auto-shot"]');
      if (radio) radio.checked = true;
      customField.hidden = true;
    }

    modal.hidden = false;
    nameIn.focus();
  }

  // ==========================================
  // 3. WEATHER WIDGET
  // ==========================================
  function getWeatherDetails(wmoCode) {
    if (wmoCode === 0) return { label: 'Clear', icon: 'sun' };
    if (wmoCode === 1 || wmoCode === 2) return { label: 'Partly Cloudy', icon: 'partly-cloudy' };
    if (wmoCode === 3) return { label: 'Overcast', icon: 'cloud' };
    if (wmoCode === 45 || wmoCode === 48) return { label: 'Fog', icon: 'fog' };
    if (wmoCode >= 51 && wmoCode <= 67) return { label: 'Rain', icon: 'rain' };
    if (wmoCode >= 71 && wmoCode <= 77) return { label: 'Snow', icon: 'snow' };
    if (wmoCode >= 80 && wmoCode <= 82) return { label: 'Showers', icon: 'rain' };
    if (wmoCode >= 95) return { label: 'Storm', icon: 'storm' };
    return { label: 'Fair', icon: 'partly-cloudy' };
  }

  function getWeatherSvg(iconType, size = 36) {
    const svgs = {
      'sun': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="6.34" y2="6.34"/><line x1="17.66" y1="17.66" x2="19.07" y2="19.07"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/><line x1="4.93" y1="19.07" x2="6.34" y2="17.66"/><line x1="17.66" y1="6.34" x2="19.07" y2="4.93"/></svg>`,
      'partly-cloudy': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2"/><path d="M17.5 19H9a5 5 0 1 1 4.9-6 4 4 0 0 1 3.6 6Z"/></svg>`,
      'cloud': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>`,
      'fog': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M4 10h16M6 14h12M8 18h8"/></svg>`,
      'rain': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M16 13v8M8 13v8M12 15v8"/><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"/></svg>`,
      'snow': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"/><circle cx="8" cy="18" r="1"/><circle cx="12" cy="20" r="1"/><circle cx="16" cy="18" r="1"/></svg>`,
      'storm': `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"/><polyline points="13 11 9 17 15 17 11 23"/></svg>`
    };
    return svgs[iconType] || svgs['partly-cloudy'];
  }

  function formatTemp(celsius) {
    if (state.weather.unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return Math.round(celsius);
  }

  async function fetchWeather() {
    const cityNameEl = document.getElementById('weather-city-name');
    const unitBtn = document.getElementById('btn-weather-unit');
    if (cityNameEl) cityNameEl.textContent = state.weather.city;
    if (unitBtn) unitBtn.textContent = `°${state.weather.unit}`;

    const { lat, lon } = state.weather;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=5`;

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Weather API error');
      const data = await res.json();
      renderWeatherData(data);
    } catch {
      renderWeatherData({
        current: {
          temperature_2m: 14,
          apparent_temperature: 13,
          relative_humidity_2m: 68,
          wind_speed_10m: 12,
          weather_code: 2
        },
        daily: {
          time: [0, 1, 2, 3, 4].map((d) => {
            const dt = new Date();
            dt.setDate(dt.getDate() + d);
            return dt.toISOString().slice(0, 10);
          }),
          weather_code: [2, 0, 1, 61, 2],
          temperature_2m_max: [16, 18, 17, 14, 16],
          temperature_2m_min: [8, 9, 9, 7, 8]
        }
      });
    }
  }

  function renderWeatherData(data) {
    const current = data.current || {};
    const daily = data.daily || {};
    const info = getWeatherDetails(current.weather_code ?? 1);

    const tempEl = document.getElementById('weather-temp');
    const descEl = document.getElementById('weather-desc');
    const hiLoEl = document.getElementById('weather-hi-lo');
    const heroIcon = document.getElementById('weather-hero-icon');
    const humEl = document.getElementById('weather-humidity');
    const windEl = document.getElementById('weather-wind');
    const feelsEl = document.getElementById('weather-feels');
    const stripEl = document.getElementById('weather-forecast');

    if (tempEl) tempEl.textContent = `${formatTemp(current.temperature_2m ?? 15)}°`;
    if (descEl) descEl.textContent = info.label;
    if (heroIcon) heroIcon.innerHTML = getWeatherSvg(info.icon, 36);

    const todayMax = daily.temperature_2m_max?.[0] ?? (current.temperature_2m + 3);
    const todayMin = daily.temperature_2m_min?.[0] ?? (current.temperature_2m - 4);
    if (hiLoEl) hiLoEl.textContent = `H: ${formatTemp(todayMax)}°  L: ${formatTemp(todayMin)}°`;

    if (humEl) humEl.textContent = `${Math.round(current.relative_humidity_2m ?? 65)}%`;
    if (windEl) windEl.textContent = `${Math.round(current.wind_speed_10m ?? 10)} km/h`;
    if (feelsEl) feelsEl.textContent = `${formatTemp(current.apparent_temperature ?? current.temperature_2m ?? 15)}°`;

    if (stripEl && Array.isArray(daily.time)) {
      stripEl.innerHTML = '';
      daily.time.slice(0, 5).forEach((dateStr, idx) => {
        const dt = new Date(`${dateStr}T12:00:00`);
        const dayLabel = idx === 0 ? 'Now' : new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dt);
        const dayInfo = getWeatherDetails(daily.weather_code?.[idx] ?? 1);
        const maxT = formatTemp(daily.temperature_2m_max?.[idx] ?? 16);
        const minT = formatTemp(daily.temperature_2m_min?.[idx] ?? 8);

        const card = document.createElement('div');
        card.className = 'forecast-day-card';
        card.innerHTML = `
          <span class="forecast-day-name">${dayLabel}</span>
          <div class="forecast-day-icon">${getWeatherSvg(dayInfo.icon, 18)}</div>
          <div class="forecast-temps">
            <span>${maxT}°</span>
            <span class="forecast-low">${minT}°</span>
          </div>
        `;
        stripEl.appendChild(card);
      });
    }
  }

  async function searchAndSetCity(query) {
    const clean = (query || '').trim();
    if (!clean) return;
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(clean)}&count=1&language=en&format=json`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const place = data.results[0];
        state.weather.city = place.name;
        state.weather.lat = place.latitude;
        state.weather.lon = place.longitude;
        saveState();
        fetchWeather();
      }
    } catch (e) {
      console.warn('Geocoding failed:', e);
    }
  }

  // ==========================================
  // 4. CURRENCY & HISTORY CHART WIDGET
  // ==========================================
  function populateCurrencySelects() {
    const baseSel = document.getElementById('currency-base');
    const targetSel = document.getElementById('currency-target');
    if (!baseSel || !targetSel) return;

    baseSel.innerHTML = '';
    targetSel.innerHTML = '';

    CURRENCY_LIST.forEach((c) => {
      const opt1 = document.createElement('option');
      opt1.value = c.code;
      opt1.textContent = c.code;
      baseSel.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = c.code;
      opt2.textContent = c.code;
      targetSel.appendChild(opt2);
    });

    baseSel.value = state.currency.base;
    targetSel.value = state.currency.target;

    document.querySelectorAll('[data-fx-range]').forEach((btn) => {
      btn.classList.toggle('active', Number(btn.dataset.fxRange) === Number(state.currency.rangeDays));
    });

    const amtInput = document.getElementById('fx-amount-input');
    if (amtInput) amtInput.value = state.currency.amount ?? 100;
  }

  function formatRate(val) {
    if (!Number.isFinite(val)) return '--';
    if (val >= 100) return val.toFixed(2);
    if (val >= 10) return val.toFixed(3);
    return val.toFixed(4);
  }

  function parseManualAmount(raw) {
    const normalized = String(raw ?? '100').replace(',', '.').replace(/[^0-9.]/g, '');
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  async function fetchCurrencyHistory() {
    const base = state.currency.base;
    const target = state.currency.target;
    const days = Number(state.currency.rangeDays) || 30;

    if (base === target) {
      const flat = generateSyntheticSeries(1.0, days, 0);
      renderCurrencyWidget(flat);
      fetchWatchlistRates();
      return;
    }

    try {
      const latestRes = await fetch(`https://api.frankfurter.app/latest?from=${base}&to=${target}`);
      if (!latestRes.ok) throw new Error('Latest FX failed');
      const latestData = await latestRes.json();

      const anchorEnd = latestData.date ? new Date(`${latestData.date}T12:00:00Z`) : new Date();
      const startDt = new Date(anchorEnd);
      startDt.setUTCDate(startDt.getUTCDate() - days);

      const startStr = startDt.toISOString().slice(0, 10);
      const endStr = anchorEnd.toISOString().slice(0, 10);

      const histRes = await fetch(`https://api.frankfurter.app/${startStr}..${endStr}?from=${base}&to=${target}`);
      if (!histRes.ok) throw new Error('Historical FX failed');
      const histData = await histRes.json();

      const series = Object.entries(histData.rates || {})
        .map(([date, ratesObj]) => ({
          date,
          rate: Number(ratesObj[target])
        }))
        .filter((d) => Number.isFinite(d.rate))
        .sort((a, b) => a.date.localeCompare(b.date));

      if (series.length >= 2) {
        renderCurrencyWidget(series);
        fetchWatchlistRates();
        return;
      }
      throw new Error('Insufficient FX data');
    } catch {
      const baseInEur = FALLBACK_EUR_RATES[base] || 1;
      const targetInEur = FALLBACK_EUR_RATES[target] || 1;
      const midRate = targetInEur / baseInEur;
      const fallbackSeries = generateSyntheticSeries(midRate, days, 0.018);
      renderCurrencyWidget(fallbackSeries);
      fetchWatchlistRates();
    }
  }

  function generateSyntheticSeries(centerRate, days, volatility) {
    const pts = [];
    const count = Math.min(Math.max(days, 7), 90);
    const now = new Date();
    for (let i = count; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const seed = Math.sin(i * 0.45 + centerRate * 10) * 0.5 + Math.cos(i * 0.19) * 0.5;
      const current = centerRate + centerRate * volatility * seed;
      pts.push({
        date: d.toISOString().slice(0, 10),
        rate: Number(current.toFixed(6))
      });
    }
    return pts;
  }

  function renderCurrencyWidget(series) {
    currentFxSeries = series;
    const base = state.currency.base;
    const target = state.currency.target;

    const first = series[0]?.rate || 1;
    const latest = series[series.length - 1]?.rate || 1;
    const latestDate = series[series.length - 1]?.date || '';
    const pctChange = first ? ((latest - first) / first) * 100 : 0;

    const rates = series.map((s) => s.rate);
    const minRate = Math.min(...rates);
    const maxRate = Math.max(...rates);

    const pairLabel = document.getElementById('fx-pair-label');
    const rateEl = document.getElementById('fx-current-rate');
    const badgeEl = document.getElementById('fx-change-badge');
    const lowEl = document.getElementById('fx-stat-low');
    const highEl = document.getElementById('fx-stat-high');
    const updatedEl = document.getElementById('currency-updated');
    const amtBaseEl = document.getElementById('fx-amount-base');

    if (pairLabel) pairLabel.textContent = `1 ${base} =`;
    if (rateEl) rateEl.textContent = `${formatRate(latest)} ${target}`;
    if (lowEl) lowEl.textContent = formatRate(minRate);
    if (highEl) highEl.textContent = formatRate(maxRate);
    if (updatedEl && latestDate) updatedEl.textContent = latestDate;
    if (amtBaseEl) amtBaseEl.textContent = base;

    if (badgeEl) {
      const sign = pctChange > 0 ? '+' : '';
      badgeEl.textContent = `${sign}${pctChange.toFixed(2)}%`;
      badgeEl.className = `fx-change-badge ${pctChange > 0.01 ? 'up' : pctChange < -0.01 ? 'down' : 'neutral'}`;
    }

    updateConverterOutput(latest);
    drawFxChart(series, minRate, maxRate);
  }

  function updateConverterOutput(rate) {
    const amtInput = document.getElementById('fx-amount-input');
    const outEl = document.getElementById('fx-converted-output');
    if (!amtInput || !outEl) return;
    const amount = parseManualAmount(amtInput.value);
    const converted = amount * rate;
    outEl.textContent = `${converted.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} ${state.currency.target}`;
  }

  function drawFxChart(series, minRate, maxRate) {
    const svg = document.getElementById('fx-chart-svg');
    const gridGroup = document.getElementById('fx-grid-lines');
    const areaPath = document.getElementById('fx-area-path');
    const linePath = document.getElementById('fx-line-path');
    const labelsEl = document.getElementById('fx-chart-labels');
    if (!svg || !areaPath || !linePath || series.length === 0) return;

    const W = 640;
    const H = 180;
    const padTop = 12;
    const padBot = 12;
    const usableH = H - padTop - padBot;
    const span = maxRate - minRate || maxRate * 0.01 || 1;

    gridGroup.innerHTML = '';
    [0.2, 0.5, 0.8].forEach((ratio) => {
      const y = Math.round(padTop + usableH * ratio);
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '0');
      line.setAttribute('y1', String(y));
      line.setAttribute('x2', String(W));
      line.setAttribute('y2', String(y));
      gridGroup.appendChild(line);
    });

    const points = series.map((pt, i) => {
      const x = series.length === 1 ? W / 2 : (i / (series.length - 1)) * W;
      const normY = (pt.rate - minRate) / span;
      const y = padTop + usableH * (1 - normY);
      return { x, y, date: pt.date, rate: pt.rate };
    });

    const dLine = points
      .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
      .join(' ');
    const dArea = `${dLine} L${W},${H} L0,${H} Z`;

    linePath.setAttribute('d', dLine);
    areaPath.setAttribute('d', dArea);

    if (labelsEl && series.length >= 2) {
      const midIdx = Math.floor(series.length / 2);
      labelsEl.innerHTML = `
        <span>${formatShortDate(series[0].date)}</span>
        <span>${formatShortDate(series[midIdx].date)}</span>
        <span>${formatShortDate(series[series.length - 1].date)}</span>
      `;
    }

    svg._fxPoints = points;
  }

  function formatShortDate(isoDate) {
    try {
      const dt = new Date(`${isoDate}T12:00:00`);
      return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(dt);
    } catch {
      return isoDate;
    }
  }

  function setupChartHover() {
    const svg = document.getElementById('fx-chart-svg');
    const crossLine = document.getElementById('fx-crosshair-line');
    const crossDot = document.getElementById('fx-crosshair-dot');
    const hoverReadout = document.getElementById('fx-hover-readout');
    if (!svg) return;

    svg.addEventListener('mousemove', (e) => {
      const pts = svg._fxPoints;
      if (!pts || !pts.length) return;
      const rect = svg.getBoundingClientRect();
      const relX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const idx = Math.round(relX * (pts.length - 1));
      const pt = pts[idx];
      if (!pt) return;

      crossLine.setAttribute('x1', pt.x.toFixed(1));
      crossLine.setAttribute('x2', pt.x.toFixed(1));
      crossLine.hidden = false;

      crossDot.setAttribute('cx', pt.x.toFixed(1));
      crossDot.setAttribute('cy', pt.y.toFixed(1));
      crossDot.hidden = false;

      if (hoverReadout) {
        hoverReadout.textContent = `${formatShortDate(pt.date)}: ${formatRate(pt.rate)}`;
      }
    });

    svg.addEventListener('mouseleave', () => {
      crossLine.hidden = true;
      crossDot.hidden = true;
      if (hoverReadout) hoverReadout.textContent = '';
    });
  }

  async function fetchWatchlistRates() {
    const container = document.getElementById('fx-watchlist');
    if (!container) return;
    const pairs = state.currency.watchlist || ['EUR/USD', 'EUR/PLN', 'USD/PLN', 'GBP/EUR'];
    container.innerHTML = '';

    let eurRates = { ...FALLBACK_EUR_RATES };
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=EUR');
      if (res.ok) {
        const data = await res.json();
        eurRates = { EUR: 1.0, ...data.rates };
      }
    } catch {
      // Use fallback EUR rates
    }

    pairs.forEach((pairStr) => {
      const [b, t] = pairStr.split('/').map((s) => s.trim().toUpperCase());
      if (!b || !t) return;
      const bRate = eurRates[b] || 1;
      const tRate = eurRates[t] || 1;
      const cross = tRate / bRate;

      const pill = document.createElement('button');
      pill.type = 'button';
      const isCurrent = state.currency.base === b && state.currency.target === t;
      pill.className = `watchlist-pill${isCurrent ? ' active' : ''}`;
      pill.innerHTML = `<span>${b}/${t}</span> <strong>${formatRate(cross)}</strong>`;
      pill.addEventListener('click', () => {
        state.currency.base = b;
        state.currency.target = t;
        saveState();
        populateCurrencySelects();
        fetchCurrencyHistory();
      });
      container.appendChild(pill);
    });
  }

  // ==========================================
  // 5. TO-DO LIST WIDGET
  // ==========================================
  let editingTodoId = null;
  let draggedTodoId = null;

  function moveTodoByOffset(todoId, delta) {
    const idx = state.todos.findIndex((t) => t.id === todoId);
    if (idx === -1) return;
    const targetIdx = idx + delta;
    if (targetIdx < 0 || targetIdx >= state.todos.length) return;
    const tmp = state.todos[idx];
    state.todos[idx] = state.todos[targetIdx];
    state.todos[targetIdx] = tmp;
    saveState();
    renderTodos();
  }

  function reorderTodoItem(sourceId, targetId, placeAfter) {
    if (!sourceId || !targetId || sourceId === targetId) return;
    const srcIdx = state.todos.findIndex((t) => t.id === sourceId);
    if (srcIdx === -1) return;
    const [moved] = state.todos.splice(srcIdx, 1);
    const dstIdx = state.todos.findIndex((t) => t.id === targetId);
    if (dstIdx === -1) {
      state.todos.push(moved);
    } else {
      state.todos.splice(placeAfter ? dstIdx + 1 : dstIdx, 0, moved);
    }
    saveState();
    renderTodos();
  }

  function renderTodos() {
    const listEl = document.getElementById('todo-list');
    const counterEl = document.getElementById('todo-counter');
    const progressEl = document.getElementById('todo-progress-fill');
    if (!listEl) return;

    const total = state.todos.length;
    const completedCount = state.todos.filter((t) => t.completed).length;
    const activeCount = total - completedCount;

    if (counterEl) {
      counterEl.textContent = `${activeCount}/${total}`;
    }
    if (progressEl) {
      const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
      progressEl.style.width = `${pct}%`;
    }

    document.querySelectorAll('[data-todo-filter]').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.todoFilter === state.todoFilter);
    });

    const filtered = state.todos.filter((t) => {
      if (state.todoFilter === 'active') return !t.completed;
      if (state.todoFilter === 'done') return t.completed;
      return true;
    });

    listEl.innerHTML = '';

    if (filtered.length === 0) {
      const emptyLi = document.createElement('li');
      emptyLi.className = 'todo-empty';
      emptyLi.textContent = state.todoFilter === 'done' ? 'No completed tasks' : 'No active tasks';
      listEl.appendChild(emptyLi);
      return;
    }

    filtered.forEach((todo, filteredIdx) => {
      const isEditing = editingTodoId === todo.id;
      const li = document.createElement('li');
      li.className = `todo-item${todo.completed ? ' completed' : ''}${isEditing ? ' editing' : ''}`;
      li.draggable = !isEditing;

      if (!isEditing) {
        li.addEventListener('dragstart', (e) => {
          draggedTodoId = todo.id;
          li.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
        });

        li.addEventListener('dragend', () => {
          draggedTodoId = null;
          li.classList.remove('dragging', 'drop-before', 'drop-after');
        });

        li.addEventListener('dragover', (e) => {
          if (!draggedTodoId || draggedTodoId === todo.id) return;
          e.preventDefault();
          const rect = li.getBoundingClientRect();
          const isAfter = e.clientY > rect.top + rect.height / 2;
          li.classList.toggle('drop-before', !isAfter);
          li.classList.toggle('drop-after', isAfter);
        });

        li.addEventListener('dragleave', () => {
          li.classList.remove('drop-before', 'drop-after');
        });

        li.addEventListener('drop', (e) => {
          if (!draggedTodoId || draggedTodoId === todo.id) return;
          e.preventDefault();
          e.stopPropagation();
          const rect = li.getBoundingClientRect();
          const isAfter = e.clientY > rect.top + rect.height / 2;
          li.classList.remove('drop-before', 'drop-after');
          const srcId = draggedTodoId;
          draggedTodoId = null;
          reorderTodoItem(srcId, todo.id, isAfter);
        });
      }

      const checkBtn = document.createElement('button');
      checkBtn.type = 'button';
      checkBtn.className = 'todo-check-btn';
      checkBtn.innerHTML = todo.completed
        ? '<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>'
        : '';
      checkBtn.addEventListener('click', () => {
        todo.completed = !todo.completed;
        saveState();
        renderTodos();
      });

      const dot = document.createElement('span');
      dot.className = `priority-dot ${todo.priority || 'normal'}`;
      dot.title = `Priority: ${todo.priority || 'normal'}`;

      li.appendChild(checkBtn);
      li.appendChild(dot);

      if (isEditing) {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'todo-edit-input';
        editInput.value = todo.text;
        editInput.maxLength = 140;

        const commitEdit = () => {
          const nextText = editInput.value.trim();
          if (nextText) {
            todo.text = nextText;
            saveState();
          }
          editingTodoId = null;
          renderTodos();
        };

        editInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commitEdit();
          } else if (e.key === 'Escape') {
            editingTodoId = null;
            renderTodos();
          }
        });

        const actionsWrap = document.createElement('div');
        actionsWrap.className = 'todo-actions';

        const saveBtn = document.createElement('button');
        saveBtn.type = 'button';
        saveBtn.className = 'todo-edit-btn';
        saveBtn.title = 'Save';
        saveBtn.textContent = '✓';
        saveBtn.addEventListener('click', commitEdit);

        const cancelBtn = document.createElement('button');
        cancelBtn.type = 'button';
        cancelBtn.className = 'todo-del-btn';
        cancelBtn.title = 'Cancel';
        cancelBtn.textContent = '×';
        cancelBtn.addEventListener('click', () => {
          editingTodoId = null;
          renderTodos();
        });

        actionsWrap.appendChild(saveBtn);
        actionsWrap.appendChild(cancelBtn);
        li.appendChild(editInput);
        li.appendChild(actionsWrap);
        listEl.appendChild(li);
        setTimeout(() => editInput.focus(), 0);
        return;
      }

      const textSpan = document.createElement('span');
      textSpan.className = 'todo-text';
      textSpan.textContent = todo.text;

      const actionsWrap = document.createElement('div');
      actionsWrap.className = 'todo-actions';

      if (filteredIdx > 0) {
        const upBtn = document.createElement('button');
        upBtn.type = 'button';
        upBtn.className = 'todo-edit-btn';
        upBtn.title = 'Move up';
        upBtn.textContent = '↑';
        upBtn.addEventListener('click', () => {
          reorderTodoItem(todo.id, filtered[filteredIdx - 1].id, false);
        });
        actionsWrap.appendChild(upBtn);
      }

      if (filteredIdx < filtered.length - 1) {
        const downBtn = document.createElement('button');
        downBtn.type = 'button';
        downBtn.className = 'todo-edit-btn';
        downBtn.title = 'Move down';
        downBtn.textContent = '↓';
        downBtn.addEventListener('click', () => {
          reorderTodoItem(todo.id, filtered[filteredIdx + 1].id, true);
        });
        actionsWrap.appendChild(downBtn);
      }

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'todo-edit-btn';
      editBtn.title = 'Edit task';
      editBtn.textContent = '✎';
      editBtn.addEventListener('click', () => {
        editingTodoId = todo.id;
        renderTodos();
      });

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'todo-del-btn';
      delBtn.title = 'Remove';
      delBtn.textContent = '×';
      delBtn.addEventListener('click', () => {
        state.todos = state.todos.filter((item) => item.id !== todo.id);
        saveState();
        renderTodos();
      });

      actionsWrap.appendChild(editBtn);
      actionsWrap.appendChild(delBtn);

      li.appendChild(textSpan);
      li.appendChild(actionsWrap);
      listEl.appendChild(li);
    });
  }

  // ==========================================
  // 6. PROJECT KANBAN BOARD WIDGET
  // ==========================================
  let editingKanbanCardId = null;

  function renderKanban() {
    const board = document.getElementById('kanban-board');
    if (!board) return;

    board.innerHTML = '';
    const cols = state.kanban?.columns || [];

    cols.forEach((col, colIdx) => {
      const colEl = document.createElement('div');
      colEl.className = 'kanban-col';
      colEl.dataset.colId = col.id;

      // Drag & drop target events on column
      colEl.addEventListener('dragover', (e) => {
        if (!draggedKanbanCard) return;
        e.preventDefault();
        colEl.classList.add('drag-over');
      });

      colEl.addEventListener('dragleave', (e) => {
        if (!colEl.contains(e.relatedTarget)) {
          colEl.classList.remove('drag-over');
        }
      });

      colEl.addEventListener('drop', (e) => {
        e.preventDefault();
        colEl.classList.remove('drag-over');
        if (!draggedKanbanCard) return;
        const src = draggedKanbanCard;
        draggedKanbanCard = null;
        moveOrReorderKanbanCard(src.colId, src.cardId, col.id, null, true);
      });

      // Column Header
      const header = document.createElement('div');
      header.className = 'kanban-col-header';

      const titleWrap = document.createElement('div');
      titleWrap.className = 'kanban-col-title-wrap';

      const titleSpan = document.createElement('span');
      titleSpan.className = 'kanban-col-title';
      titleSpan.textContent = col.title;

      const countSpan = document.createElement('span');
      countSpan.className = 'kanban-col-count';
      countSpan.textContent = String((col.cards || []).length);

      titleWrap.appendChild(titleSpan);
      titleWrap.appendChild(countSpan);

      const colActions = document.createElement('div');
      colActions.className = 'kanban-col-actions';

      if (colIdx > 0) {
        const leftBtn = document.createElement('button');
        leftBtn.type = 'button';
        leftBtn.className = 'kanban-icon-btn';
        leftBtn.title = 'Move column left';
        leftBtn.textContent = '←';
        leftBtn.addEventListener('click', () => moveKanbanColumn(colIdx, -1));
        colActions.appendChild(leftBtn);
      }

      if (colIdx < cols.length - 1) {
        const rightBtn = document.createElement('button');
        rightBtn.type = 'button';
        rightBtn.className = 'kanban-icon-btn';
        rightBtn.title = 'Move column right';
        rightBtn.textContent = '→';
        rightBtn.addEventListener('click', () => moveKanbanColumn(colIdx, 1));
        colActions.appendChild(rightBtn);
      }

      const renameBtn = document.createElement('button');
      renameBtn.type = 'button';
      renameBtn.className = 'kanban-icon-btn';
      renameBtn.title = 'Rename column';
      renameBtn.textContent = '✎';
      renameBtn.addEventListener('click', () => {
        const nextName = prompt('Column name:', col.title);
        if (nextName && nextName.trim()) {
          col.title = nextName.trim();
          saveState();
          renderKanban();
        }
      });
      colActions.appendChild(renameBtn);

      const delColBtn = document.createElement('button');
      delColBtn.type = 'button';
      delColBtn.className = 'kanban-icon-btn delete';
      delColBtn.title = 'Delete column';
      delColBtn.textContent = '×';
      delColBtn.addEventListener('click', () => {
        if (col.cards?.length > 0 && !confirm(`Delete column "${col.title}" and its ${col.cards.length} item(s)?`)) {
          return;
        }
        state.kanban.columns = state.kanban.columns.filter((c) => c.id !== col.id);
        saveState();
        renderKanban();
      });
      colActions.appendChild(delColBtn);

      header.appendChild(titleWrap);
      header.appendChild(colActions);

      // Cards list
      const cardsWrap = document.createElement('div');
      cardsWrap.className = 'kanban-cards';

      const cardsArr = col.cards || [];
      cardsArr.forEach((card, cardIdx) => {
        const isEditingCard = editingKanbanCardId === card.id;
        const cardEl = document.createElement('div');
        cardEl.className = 'kanban-card';
        cardEl.draggable = !isEditingCard;

        if (!isEditingCard) {
          cardEl.addEventListener('dragstart', (e) => {
            draggedKanbanCard = { colId: col.id, cardId: card.id };
            cardEl.classList.add('dragging');
            e.dataTransfer.effectAllowed = 'move';
          });

          cardEl.addEventListener('dragend', () => {
            draggedKanbanCard = null;
            cardEl.classList.remove('dragging', 'drop-before', 'drop-after');
          });

          cardEl.addEventListener('dragover', (e) => {
            if (!draggedKanbanCard || draggedKanbanCard.cardId === card.id) return;
            e.preventDefault();
            e.stopPropagation();
            colEl.classList.add('drag-over');
            const rect = cardEl.getBoundingClientRect();
            const isAfter = e.clientY > rect.top + rect.height / 2;
            cardEl.classList.toggle('drop-before', !isAfter);
            cardEl.classList.toggle('drop-after', isAfter);
          });

          cardEl.addEventListener('dragleave', () => {
            cardEl.classList.remove('drop-before', 'drop-after');
          });

          cardEl.addEventListener('drop', (e) => {
            if (!draggedKanbanCard) return;
            e.preventDefault();
            e.stopPropagation();
            colEl.classList.remove('drag-over');
            const rect = cardEl.getBoundingClientRect();
            const isAfter = e.clientY > rect.top + rect.height / 2;
            cardEl.classList.remove('drop-before', 'drop-after');
            const src = draggedKanbanCard;
            draggedKanbanCard = null;
            if (src.cardId !== card.id) {
              moveOrReorderKanbanCard(src.colId, src.cardId, col.id, card.id, isAfter);
            }
          });
        }

        if (isEditingCard) {
          const editor = document.createElement('div');
          editor.className = 'kanban-card-editor';

          const titleInput = document.createElement('input');
          titleInput.type = 'text';
          titleInput.value = card.text || '';
          titleInput.placeholder = 'Card title...';
          titleInput.maxLength = 120;

          const noteArea = document.createElement('textarea');
          noteArea.rows = 3;
          noteArea.value = card.note || '';
          noteArea.placeholder = 'Add notes...';

          const editorActs = document.createElement('div');
          editorActs.className = 'kanban-card-editor-actions';

          const cancelEditBtn = document.createElement('button');
          cancelEditBtn.type = 'button';
          cancelEditBtn.className = 'minimal-sm-btn';
          cancelEditBtn.textContent = 'Cancel';
          cancelEditBtn.addEventListener('click', () => {
            editingKanbanCardId = null;
            renderKanban();
          });

          const saveEditBtn = document.createElement('button');
          saveEditBtn.type = 'button';
          saveEditBtn.className = 'minimal-sm-btn primary';
          saveEditBtn.textContent = 'Save';
          saveEditBtn.addEventListener('click', () => {
            const nextTitle = titleInput.value.trim();
            if (nextTitle) {
              card.text = nextTitle;
              card.note = noteArea.value.trim();
              saveState();
            }
            editingKanbanCardId = null;
            renderKanban();
          });

          editorActs.appendChild(cancelEditBtn);
          editorActs.appendChild(saveEditBtn);

          editor.appendChild(titleInput);
          editor.appendChild(noteArea);
          editor.appendChild(editorActs);
          cardEl.appendChild(editor);
          cardsWrap.appendChild(cardEl);
          setTimeout(() => noteArea.focus(), 0);
          return;
        }

        const topRow = document.createElement('div');
        topRow.className = 'kanban-card-top';

        const contentCol = document.createElement('div');
        contentCol.className = 'kanban-card-content';

        const textEl = document.createElement('span');
        textEl.className = 'kanban-card-text';
        textEl.textContent = card.text;
        contentCol.appendChild(textEl);

        if (card.note && card.note.trim()) {
          const noteEl = document.createElement('div');
          noteEl.className = 'kanban-card-note';
          noteEl.textContent = card.note;
          contentCol.appendChild(noteEl);
        }

        const cardActs = document.createElement('div');
        cardActs.className = 'kanban-card-actions';

        if (cardIdx > 0) {
          const upCardBtn = document.createElement('button');
          upCardBtn.type = 'button';
          upCardBtn.className = 'kanban-icon-btn';
          upCardBtn.title = 'Move up';
          upCardBtn.textContent = '↑';
          upCardBtn.addEventListener('click', () => {
            moveOrReorderKanbanCard(col.id, card.id, col.id, cardsArr[cardIdx - 1].id, false);
          });
          cardActs.appendChild(upCardBtn);
        }

        if (cardIdx < cardsArr.length - 1) {
          const downCardBtn = document.createElement('button');
          downCardBtn.type = 'button';
          downCardBtn.className = 'kanban-icon-btn';
          downCardBtn.title = 'Move down';
          downCardBtn.textContent = '↓';
          downCardBtn.addEventListener('click', () => {
            moveOrReorderKanbanCard(col.id, card.id, col.id, cardsArr[cardIdx + 1].id, true);
          });
          cardActs.appendChild(downCardBtn);
        }

        if (colIdx > 0) {
          const prevColBtn = document.createElement('button');
          prevColBtn.type = 'button';
          prevColBtn.className = 'kanban-icon-btn';
          prevColBtn.title = `Move to ${cols[colIdx - 1].title}`;
          prevColBtn.textContent = '←';
          prevColBtn.addEventListener('click', () => {
            moveOrReorderKanbanCard(col.id, card.id, cols[colIdx - 1].id, null, true);
          });
          cardActs.appendChild(prevColBtn);
        }

        if (colIdx < cols.length - 1) {
          const nextColBtn = document.createElement('button');
          nextColBtn.type = 'button';
          nextColBtn.className = 'kanban-icon-btn';
          nextColBtn.title = `Move to ${cols[colIdx + 1].title}`;
          nextColBtn.textContent = '→';
          nextColBtn.addEventListener('click', () => {
            moveOrReorderKanbanCard(col.id, card.id, cols[colIdx + 1].id, null, true);
          });
          cardActs.appendChild(nextColBtn);
        }

        const editCardBtn = document.createElement('button');
        editCardBtn.type = 'button';
        editCardBtn.className = 'kanban-icon-btn';
        editCardBtn.title = 'Edit title & notes';
        editCardBtn.textContent = '✎';
        editCardBtn.addEventListener('click', () => {
          editingKanbanCardId = card.id;
          renderKanban();
        });
        cardActs.appendChild(editCardBtn);

        const delCardBtn = document.createElement('button');
        delCardBtn.type = 'button';
        delCardBtn.className = 'kanban-icon-btn delete';
        delCardBtn.title = 'Remove card';
        delCardBtn.textContent = '×';
        delCardBtn.addEventListener('click', () => {
          col.cards = col.cards.filter((c) => c.id !== card.id);
          saveState();
          renderKanban();
        });
        cardActs.appendChild(delCardBtn);

        topRow.appendChild(contentCol);
        topRow.appendChild(cardActs);
        cardEl.appendChild(topRow);
        cardsWrap.appendChild(cardEl);
      });

      // Inline Add Card Form (Title + Optional Note) at bottom of each column
      const addForm = document.createElement('form');
      addForm.className = 'kanban-add-card-form';
      addForm.innerHTML = `
        <input type="text" class="kanban-add-title-input" placeholder="+ Add card..." maxlength="120" autocomplete="off" />
        <input type="text" class="kanban-add-note-input" placeholder="Note (optional)..." maxlength="240" autocomplete="off" hidden />
        <button type="submit" hidden></button>
      `;

      const titleIn = addForm.querySelector('.kanban-add-title-input');
      const noteIn = addForm.querySelector('.kanban-add-note-input');

      titleIn.addEventListener('focus', () => {
        noteIn.hidden = false;
      });

      addForm.addEventListener('focusout', (e) => {
        if (!addForm.contains(e.relatedTarget) && !titleIn.value.trim() && !noteIn.value.trim()) {
          noteIn.hidden = true;
        }
      });

      addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const text = (titleIn?.value || '').trim();
        const note = (noteIn?.value || '').trim();
        if (!text) return;
        col.cards = col.cards || [];
        col.cards.push({
          id: `kb-${Date.now()}`,
          text,
          note
        });
        titleIn.value = '';
        noteIn.value = '';
        noteIn.hidden = true;
        saveState();
        renderKanban();
      });

      colEl.appendChild(header);
      colEl.appendChild(cardsWrap);
      colEl.appendChild(addForm);
      board.appendChild(colEl);
    });
  }

  function moveKanbanColumn(index, delta) {
    const cols = state.kanban.columns;
    const target = index + delta;
    if (target < 0 || target >= cols.length) return;
    const tmp = cols[index];
    cols[index] = cols[target];
    cols[target] = tmp;
    saveState();
    renderKanban();
  }

  function moveOrReorderKanbanCard(fromColId, cardId, toColId, targetCardId = null, placeAfter = true) {
    const fromCol = state.kanban.columns.find((c) => c.id === fromColId);
    const toCol = state.kanban.columns.find((c) => c.id === toColId);
    if (!fromCol || !toCol) return;

    const srcIdx = (fromCol.cards || []).findIndex((c) => c.id === cardId);
    if (srcIdx === -1) return;

    const [moved] = fromCol.cards.splice(srcIdx, 1);
    toCol.cards = toCol.cards || [];

    if (!targetCardId) {
      toCol.cards.push(moved);
    } else {
      const dstIdx = toCol.cards.findIndex((c) => c.id === targetCardId);
      if (dstIdx === -1) {
        toCol.cards.push(moved);
      } else {
        toCol.cards.splice(placeAfter ? dstIdx + 1 : dstIdx, 0, moved);
      }
    }

    saveState();
    renderKanban();
  }

  // ==========================================
  // EVENT LISTENERS
  // ==========================================
  function bindEvents() {
    document.getElementById('btn-refresh-bg')?.addEventListener('click', cycleNextWallpaper);

    document.getElementById('btn-open-settings')?.addEventListener('click', () => {
      document.getElementById('settings-modal').hidden = false;
    });

    document.getElementById('btn-lock-layout')?.addEventListener('click', () => {
      state.layoutLocked = !state.layoutLocked;
      saveState();
      applyPanelLayout();
    });

    document.getElementById('btn-reset-layout')?.addEventListener('click', () => {
      state.panelLayout = computeDefaultLayout();
      saveState();
      applyPanelLayout();
    });

    // Widget visibility toggles in Settings
    document.querySelectorAll('[data-toggle-widget]').forEach((cb) => {
      cb.addEventListener('change', (e) => {
        const wId = e.target.dataset.toggleWidget;
        state.visibleWidgets = state.visibleWidgets || {};
        state.visibleWidgets[wId] = e.target.checked;
        saveState();
        applyPanelLayout();
      });
    });

    // Kanban Add Column button & inline form
    document.getElementById('btn-kanban-add-col')?.addEventListener('click', () => {
      const form = document.getElementById('kanban-add-col-form');
      if (form) {
        form.hidden = !form.hidden;
        if (!form.hidden) document.getElementById('kanban-col-input')?.focus();
      }
    });

    document.getElementById('kanban-add-col-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('kanban-col-input');
      const title = (input?.value || '').trim();
      if (!title) return;

      state.kanban.columns.push({
        id: `col-${Date.now()}`,
        title,
        cards: []
      });
      input.value = '';
      e.currentTarget.hidden = true;
      saveState();
      renderKanban();
    });

    document.querySelectorAll('[data-close-modal]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const modal = document.getElementById(btn.dataset.closeModal);
        if (modal) modal.hidden = true;
      });
    });

    document.querySelectorAll('.modal-backdrop').forEach((backdrop) => {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) backdrop.hidden = true;
      });
    });

    // Shortcuts controls
    document.querySelectorAll('[data-shortcut-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.shortcutView = btn.dataset.shortcutView;
        saveState();
        renderShortcuts();
      });
    });

    document.getElementById('btn-toggle-edit-shortcuts')?.addEventListener('click', () => {
      isEditingShortcuts = !isEditingShortcuts;
      renderShortcuts();
    });

    document.getElementById('btn-add-shortcut')?.addEventListener('click', () => {
      openShortcutModal(null);
    });

    document.querySelectorAll('input[name="shortcut-thumb-mode"]').forEach((radio) => {
      radio.addEventListener('change', () => {
        const customField = document.getElementById('custom-thumb-field');
        if (customField) customField.hidden = radio.value !== 'custom';
      });
    });

    document.getElementById('shortcut-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('shortcut-id').value;
      const title = document.getElementById('shortcut-title').value.trim();
      const url = normalizeUrl(document.getElementById('shortcut-url').value);
      const thumbMode = document.querySelector('input[name="shortcut-thumb-mode"]:checked')?.value || 'auto-shot';
      const customThumb = document.getElementById('shortcut-custom-thumb').value.trim();
      const color = document.getElementById('shortcut-color').value;

      if (id) {
        const idx = state.shortcuts.findIndex((s) => s.id === id);
        if (idx !== -1) {
          state.shortcuts[idx] = { id, title, url, thumbMode, customThumb, color };
        }
      } else {
        state.shortcuts.push({
          id: `sc-${Date.now()}`,
          title,
          url,
          thumbMode,
          customThumb,
          color
        });
      }

      saveState();
      renderShortcuts();
      document.getElementById('shortcut-modal').hidden = true;
    });

    // Weather controls
    document.getElementById('btn-weather-location')?.addEventListener('click', () => {
      const form = document.getElementById('weather-search-form');
      if (form) {
        form.hidden = !form.hidden;
        if (!form.hidden) document.getElementById('weather-city-input')?.focus();
      }
    });

    document.getElementById('weather-search-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('weather-city-input');
      if (input && input.value.trim()) {
        searchAndSetCity(input.value.trim());
        input.value = '';
        e.currentTarget.hidden = true;
      }
    });

    document.getElementById('btn-weather-geo')?.addEventListener('click', () => {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          state.weather.lat = Number(pos.coords.latitude.toFixed(4));
          state.weather.lon = Number(pos.coords.longitude.toFixed(4));
          state.weather.city = 'Local';
          saveState();
          document.getElementById('weather-search-form').hidden = true;
          fetchWeather();
        },
        () => {
          alert('Location access denied.');
        }
      );
    });

    document.getElementById('btn-weather-unit')?.addEventListener('click', () => {
      state.weather.unit = state.weather.unit === 'C' ? 'F' : 'C';
      saveState();
      fetchWeather();
    });

    document.getElementById('btn-weather-refresh')?.addEventListener('click', fetchWeather);

    // Currency controls
    document.getElementById('currency-base')?.addEventListener('change', (e) => {
      state.currency.base = e.target.value;
      saveState();
      fetchCurrencyHistory();
    });

    document.getElementById('currency-target')?.addEventListener('change', (e) => {
      state.currency.target = e.target.value;
      saveState();
      fetchCurrencyHistory();
    });

    document.getElementById('btn-swap-currency')?.addEventListener('click', () => {
      const tmp = state.currency.base;
      state.currency.base = state.currency.target;
      state.currency.target = tmp;
      saveState();
      populateCurrencySelects();
      fetchCurrencyHistory();
    });

    document.querySelectorAll('[data-fx-range]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.currency.rangeDays = Number(btn.dataset.fxRange);
        saveState();
        document.querySelectorAll('[data-fx-range]').forEach((b) => b.classList.toggle('active', b === btn));
        fetchCurrencyHistory();
      });
    });

    document.getElementById('fx-amount-input')?.addEventListener('input', (e) => {
      state.currency.amount = parseManualAmount(e.target.value);
      saveState();
      const latestRate = currentFxSeries[currentFxSeries.length - 1]?.rate || 1;
      updateConverterOutput(latestRate);
    });

    // To-Do controls
    document.getElementById('todo-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('todo-input');
      const prio = document.getElementById('todo-priority');
      const text = (input?.value || '').trim();
      if (!text) return;

      state.todos.unshift({
        id: `td-${Date.now()}`,
        text,
        completed: false,
        priority: prio?.value || 'normal'
      });
      input.value = '';
      saveState();
      renderTodos();
    });

    document.querySelectorAll('[data-todo-filter]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.todoFilter = btn.dataset.todoFilter;
        saveState();
        renderTodos();
      });
    });

    document.getElementById('btn-clear-done')?.addEventListener('click', () => {
      state.todos = state.todos.filter((t) => !t.completed);
      saveState();
      renderTodos();
    });

    // Settings Drawer Controls
    document.querySelectorAll('#theme-mode-selector .theme-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.theme = btn.dataset.themeVal;
        saveState();
        applyThemeAndAppearance();
      });
    });

    document.querySelectorAll('#accent-swatch-row .color-swatch').forEach((sw) => {
      sw.addEventListener('click', () => {
        state.accent = sw.dataset.accent;
        saveState();
        applyThemeAndAppearance();
      });
    });

    document.getElementById('custom-accent-input')?.addEventListener('input', (e) => {
      state.accent = e.target.value;
      saveState();
      applyThemeAndAppearance();
    });

    document.getElementById('setting-glass-opacity')?.addEventListener('input', (e) => {
      state.glassOpacity = Number(e.target.value);
      saveState();
      applyThemeAndAppearance();
    });

    document.getElementById('setting-glass-blur')?.addEventListener('input', (e) => {
      state.glassBlur = Number(e.target.value);
      saveState();
      applyThemeAndAppearance();
    });

    document.getElementById('setting-font-family')?.addEventListener('change', (e) => {
      state.font = e.target.value;
      saveState();
      applyThemeAndAppearance();
    });

    document.getElementById('setting-clock-24h')?.addEventListener('change', (e) => {
      state.clock24h = e.target.checked;
      saveState();
      updateClock();
    });

    document.getElementById('setting-clock-seconds')?.addEventListener('change', (e) => {
      state.clockSeconds = e.target.checked;
      saveState();
      updateClock();
    });

    document.getElementById('setting-show-greeting')?.addEventListener('change', (e) => {
      state.showGreeting = e.target.checked;
      saveState();
      updateClock();
    });

    document.getElementById('setting-user-name')?.addEventListener('input', (e) => {
      state.userName = e.target.value.trim();
      saveState();
      updateClock();
    });

    document.getElementById('setting-bg-topic')?.addEventListener('change', (e) => {
      state.bgTopic = e.target.value;
      state.bgIndex = 0;
      saveState();
      applyThemeAndAppearance();
      loadCurrentWallpaper();
    });

    document.getElementById('btn-apply-custom-bg')?.addEventListener('click', () => {
      const url = document.getElementById('setting-custom-bg-url')?.value.trim();
      if (url) {
        state.customBgUrl = url;
        state.bgTopic = 'custom-url';
        saveState();
        applyThemeAndAppearance();
        loadCurrentWallpaper();
      }
    });

    document.getElementById('setting-unsplash-key')?.addEventListener('change', (e) => {
      state.unsplashKey = e.target.value.trim();
      saveState();
    });

    document.getElementById('setting-unsplash-query')?.addEventListener('input', (e) => {
      state.unsplashQuery = e.target.value.trim();
      saveState();
    });

    document.getElementById('btn-fetch-unsplash-live')?.addEventListener('click', () => {
      cycleNextWallpaper();
    });

    document.getElementById('setting-bg-dim')?.addEventListener('input', (e) => {
      state.bgDim = Number(e.target.value);
      saveState();
      applyThemeAndAppearance();
    });

    document.getElementById('setting-bg-blur')?.addEventListener('input', (e) => {
      state.bgBlur = Number(e.target.value);
      saveState();
      applyThemeAndAppearance();
    });

    document.getElementById('setting-shortcut-cols')?.addEventListener('change', (e) => {
      state.shortcutCols = Number(e.target.value);
      saveState();
      applyThemeAndAppearance();
    });

    document.getElementById('setting-watchlist-pairs')?.addEventListener('change', (e) => {
      const raw = e.target.value;
      const list = raw
        .split(',')
        .map((s) => s.trim().toUpperCase())
        .filter((s) => /^[A-Z]{3}\/[A-Z]{3}$/.test(s));
      if (list.length > 0) {
        state.currency.watchlist = list;
        saveState();
        fetchWatchlistRates();
      }
    });

    // Export / Import / Reset
    document.getElementById('btn-export-data')?.addEventListener('click', () => {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `startpage-config-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('input-import-data')?.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const imported = JSON.parse(String(reader.result));
          state = {
            ...structuredClone(DEFAULT_STATE),
            ...imported
          };
          saveState();
          initApp();
        } catch {
          alert('Invalid configuration JSON.');
        }
      };
      reader.readAsText(file);
    });

    document.getElementById('btn-reset-defaults')?.addEventListener('click', () => {
      if (confirm('Reset all settings, layout, shortcuts, and tasks to defaults?')) {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_KEY);
        state = structuredClone(DEFAULT_STATE);
        saveState();
        initApp();
      }
    });
  }

  function initApp() {
    applyThemeAndAppearance();
    applyPanelLayout();
    loadCurrentWallpaper();
    updateClock();
    renderShortcuts();
    populateCurrencySelects();
    fetchWeather();
    fetchCurrencyHistory();
    renderTodos();
    renderKanban();
  }

  bindEvents();
  setupPanelInteractions();
  setupChartHover();
  initApp();
  setInterval(updateClock, 1000);
})();
