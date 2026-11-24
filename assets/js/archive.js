/* ==========================================================================
   周俊宸 · 设计档案  —  stage engine
   boot → archive → file, keyboard first, one fixed 1728×1080 canvas.
   ========================================================================== */
(function () {
  'use strict';

  var stage = document.getElementById('stage');
  if (!stage) return;

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FILES = [
    {
      id: 'x01', no: 'X-01', title: '康驾护航',
      category: '车载健康安全闭环',
      short: '车载健康安全',
      col: 1, row: 2, image: 'assets/img/kangjia/card.jpg',
      now: 'X-01 / 车载健康安全',
      spec: [
        ['ROLE', '交互设计 · 车载端与移动端界面 · 方案统筹'],
        ['TEAM', '朱丁振 座椅体征监测垫 / 张祚铭 方向盘集成监测模组'],
        ['SCOPE', '人群调研 / 状态机 / 车载 HMI / 小程序'],
        ['STAGES', '调研 · 设计定义 · 造型与原型 · 总结'],
        ['SOURCE', '21 页原始方案']
      ]
    },
    {
      id: 'x02', no: 'X-02', title: '陪伴治疗型动物机器人',
      category: '3–6 岁自闭症儿童 · 陪伴 / 治疗 / 监测',
      short: '儿童康复辅助',
      col: 3, row: 5, image: 'assets/img/robot/card.jpg',
      now: 'X-02 / 儿童康复辅助',
      spec: [
        ['ROLE', '独立完成 · 调研 / 定义 / 造型 / 渲染 / 场景'],
        ['USERS', '3–6 岁 ASD 儿童 · 家长 · 康复治疗师'],
        ['CORE', '陪伴 + 治疗 + 监测 三位一体'],
        ['STAGES', '调研 · 设计定义 · 造型与原型 · 总结'],
        ['SOURCE', '14 页原始方案']
      ]
    }
  ];

  var COLS = 5, ROWS = 8;

  var CHAPTERS = [
    { i: 1, cn: '调研', en: 'Research' },
    { i: 2, cn: '设计定义', en: 'Define' },
    { i: 3, cn: '造型与原型', en: 'Prototype' },
    { i: 4, cn: '总结', en: 'Conclusion' }
  ];

  var state = { mode: 'boot', file: 0, chapter: 1 };

  /* ---------------------------------------------------------------- stage */
  function fit() {
    var vw = window.innerWidth;
    var vh = window.innerHeight;
    if (vw <= 900) {
      stage.style.transform = '';
      stage.dataset.layout = 'compact';
      return;
    }
    stage.dataset.layout = 'desktop';
    var s = Math.min(vw / 1728, vh / 1080);
    stage.style.transform = 'scale(' + s.toFixed(5) + ')';
  }

  /* ---------------------------------------------------------------- theme */
  function setTheme(name) {
    var t = name === 'dark' ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
    var label = document.getElementById('themeLabel');
    if (label) label.textContent = t === 'light' ? '暖昼' : '深夜';
    document.querySelectorAll('[data-theme-set]').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.dataset.themeSet === t));
    });
    document.querySelectorAll('.terminal-theme').forEach(function (g) { g.dataset.active = t; });
    try { localStorage.setItem('jc-theme', t); } catch (e) {}
  }

  var bootTimer = null;

  /* ---------------------------------------------------------------- boot */
  function boot() {
    var start = performance.now();
    var bar = document.getElementById('bootBar');
    var progress = 0;
    function tick() {
      progress = Math.min(100, progress + 3 + Math.random() * 9);
      if (bar) bar.style.width = progress + '%';
      if (progress < 100) window.setTimeout(tick, 60);
    }
    tick();
    var wait = reduce ? 200 : 2100;
    bootTimer = window.setTimeout(enterArchive, wait);
  }

  function enterArchive() {
    if (state.mode !== 'boot') return;
    if (bootTimer) { window.clearTimeout(bootTimer); bootTimer = null; }
    state.mode = 'archive';
    stage.dataset.mode = 'archive';
    stage.querySelectorAll('.archive-ui').forEach(function (n) { n.setAttribute('aria-hidden', 'false'); });
    render();
  }

  function replayIntro() {
    if (state.mode === 'file') closeFile();
    state.mode = 'boot';
    stage.dataset.mode = 'boot';
    stage.querySelectorAll('.archive-ui').forEach(function (n) { n.setAttribute('aria-hidden', 'true'); });
    boot();
  }

  /* ------------------------------------------------------------- array */
  function buildArray() {
    // 阵列由内联 SVG 渲染：5 列 × 8 行，逐块可动画
  }

  function raiseCard() {
    var plane = document.getElementById('arrayPlane');
    var card = document.getElementById('arrayActive');
    if (!plane || !card) return;
    var f = FILES[state.file];
    // 抬起的档案卡：五个列位之一，按参数落点
    card.style.left = (16 + (f.col / (COLS - 1)) * 22) + '%';
    card.style.top = (58 - f.row * 3) + '%';
    card.querySelector('img').src = f.image;
    card.querySelector('img').alt = f.title;
    card.querySelector('b').textContent = f.no;
    card.querySelector('span').textContent = f.title;

    // 波浪：从选中列向两侧依次抬起再落回
    var svg = plane.querySelector('.array-svg');
    if (svg) {
      svg.classList.remove('is-wave');
      void svg.offsetWidth;
      svg.classList.add('is-wave');
    }
  }

  /* ------------------------------------------------------------- archive */
  var elTitle = document.getElementById('fileTitle');
  var elCat = document.getElementById('fileCategory');
  var elNo = document.getElementById('fileNo');
  var elCount = document.getElementById('fileCount');
  var elArchNo = document.getElementById('archNo');
  var elNow = document.getElementById('nowViewing');
  var elTicks = document.getElementById('fileTicks');

  function pad(n) { return ('0' + n).slice(-2); }

  function buildTicks() {
    if (!elTicks) return;
    elTicks.innerHTML = '';
    FILES.forEach(function (f, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-label', f.no + ' ' + f.title);
      b.addEventListener('click', function () { select(i); });
      elTicks.appendChild(b);
    });
  }

  function renderArchive() {
    var f = FILES[state.file];
    if (elTitle) elTitle.textContent = f.title;
    if (elCat) elCat.textContent = f.category;
    if (elNo) elNo.textContent = 'FILE NUMBER: ' + f.no;
    if (elCount) elCount.textContent = pad(state.file + 1) + ' / ' + pad(FILES.length);
    if (elArchNo) elArchNo.textContent = pad(state.file + 1);
    if (elNow) elNow.textContent = f.now;

    if (elTicks) {
      Array.prototype.forEach.call(elTicks.children, function (b, i) {
        b.classList.toggle('selected', i === state.file);
        b.setAttribute('aria-selected', String(i === state.file));
      });
    }
    document.querySelectorAll('.array-card').forEach(function (c) {
      c.classList.toggle('is-active', c.dataset.file === f.id);
    });
  }

  function select(i) {
    state.file = (i + FILES.length) % FILES.length;
    renderArchive();
  }

  /* ---------------------------------------------------------------- file */
  var elTabs = document.getElementById('detailTabs');
  var elContent = document.getElementById('fileContent');
  var elTopNo = document.getElementById('fileTopNo');
  var elAsideNo = document.getElementById('asideNo');
  var elAsideTitle = document.getElementById('asideTitle');
  var elAsideSub = document.getElementById('asideSub');
  var elAsideSpec = document.getElementById('asideSpec');
  var lastFocus = null;

  function buildTabs() {
    if (!elTabs) return;
    elTabs.innerHTML = '';
    CHAPTERS.forEach(function (c) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('role', 'tab');
      b.dataset.chapter = String(c.i);
      b.innerHTML = '<b>0' + c.i + '</b>' + c.cn;
      b.addEventListener('click', function () { setChapter(c.i); });
      elTabs.appendChild(b);
    });
  }

  function renderFile() {
    var f = FILES[state.file];
    if (elTopNo) elTopNo.textContent = 'FILE ' + f.no;
    if (elAsideNo) elAsideNo.textContent = f.no;
    if (elAsideTitle) elAsideTitle.textContent = f.title;
    if (elAsideSub) elAsideSub.textContent = f.category;
    if (elAsideSpec) {
      elAsideSpec.innerHTML = f.spec.map(function (r) {
        return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>';
      }).join('');
    }
    if (elTabs) {
      Array.prototype.forEach.call(elTabs.children, function (b) {
        var on = Number(b.dataset.chapter) === state.chapter;
        b.setAttribute('aria-selected', String(on));
      });
    }
    if (elContent) {
      elContent.querySelectorAll('.sheet').forEach(function (s) {
        var on = s.dataset.file === f.id && Number(s.dataset.chapter) === state.chapter;
        s.classList.toggle('is-current', on);
      });
      elContent.scrollTop = 0;
    }
  }

  function setChapter(i) {
    state.chapter = i;
    renderFile();
  }

  function openFile() {
    lastFocus = document.activeElement;
    state.mode = 'file';
    stage.dataset.mode = 'file';
    stage.querySelectorAll('.file-ui').forEach(function (n) { n.setAttribute('aria-hidden', 'false'); });
    renderFile();
    if (elContent) elContent.focus({ preventScroll: true });
  }

  function closeFile() {
    state.mode = 'archive';
    stage.dataset.mode = 'archive';
    stage.querySelectorAll('.file-ui').forEach(function (n) { n.setAttribute('aria-hidden', 'true'); });
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }

  function render() {
    renderArchive();
    if (state.mode === 'file') renderFile();
  }

  /* --------------------------------------------------------------- viewer */
  function initViewer() {
    var host = document.getElementById('viewer');
    if (!host) return;
    var img = host.querySelector('[data-v-img]');
    var elNo = host.querySelector('[data-v-no]');
    var elCount = host.querySelector('[data-v-count]');
    var elText = host.querySelector('[data-v-text]');
    var btnClose = host.querySelector('[data-v-close]');
    var plates = [];
    var cur = 0;
    var opener = null;

    function collect() {
      plates = [];
      document.querySelectorAll('.sheet .fig').forEach(function (fig) {
        var i = fig.querySelector('img');
        if (!i) return;
        var cap = fig.querySelector('figcaption');
        plates.push({
          src: i.getAttribute('src'),
          alt: i.getAttribute('alt') || '',
          no: cap ? (cap.querySelector('i') || {}).textContent || '' : '',
          text: cap ? (cap.querySelector('span') || {}).textContent || '' : ''
        });
      });
    }

    function paint(i) {
      if (!plates.length) return;
      cur = (i + plates.length) % plates.length;
      var p = plates[cur];
      img.src = p.src;
      img.alt = p.alt;
      elNo.textContent = p.no || 'PLATE';
      elCount.textContent = pad(cur + 1) + ' / ' + pad(plates.length);
      elText.textContent = p.text;
    }

    function open(i, from) {
      collect();
      if (!plates.length) return;
      opener = from || document.activeElement;
      paint(i);
      host.classList.add('on');
      btnClose.focus({ preventScroll: true });
    }

    function close() {
      host.classList.remove('on');
      if (opener && opener.focus) opener.focus({ preventScroll: true });
    }

    document.querySelectorAll('.sheet .fig-frame').forEach(function (frame) {
      frame.setAttribute('tabindex', '0');
      frame.setAttribute('role', 'button');
      frame.setAttribute('aria-label', '放大查看图版');
      frame.addEventListener('click', function () {
        var figs = Array.prototype.slice.call(document.querySelectorAll('.sheet.is-current .fig'));
        var fig = frame.closest('.fig');
        var i = Math.max(0, figs.indexOf(fig));
        collect();
        var all = plates;
        // index within the whole set, matched by src
        var src = (fig.querySelector('img') || {}).getAttribute && fig.querySelector('img').getAttribute('src');
        var idx = all.findIndex(function (p) { return p.src === src; });
        open(idx < 0 ? i : idx, frame);
      });
      frame.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); frame.click(); }
      });
    });

    btnClose.addEventListener('click', close);
    host.querySelector('[data-v-prev]').addEventListener('click', function () { paint(cur - 1); });
    host.querySelector('[data-v-next]').addEventListener('click', function () { paint(cur + 1); });
    host.addEventListener('click', function (e) { if (e.target === host) close(); });

    document.addEventListener('keydown', function (e) {
      if (!host.classList.contains('on')) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); paint(cur - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); paint(cur + 1); }
    });
  }

  /* ---------------------------------------------------------------- modal */
  function initModal() {
    var modal = document.getElementById('modal');
    if (!modal) return;
    function close() { modal.classList.remove('on'); }
    document.querySelectorAll('[data-action="profile"]').forEach(function (b) {
      b.addEventListener('click', function () {
        modal.classList.add('on');
        var x = modal.querySelector('[data-close]');
        if (x) x.focus({ preventScroll: true });
      });
    });
    modal.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', close); });
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('on')) close();
    });
  }

  /* ---------------------------------------------------------------- clock */
  function initClock() {
    var el = document.getElementById('footClock');
    if (!el) return;
    function paint() {
      var d = new Date();
      var p = function (n) { return n < 10 ? '0' + n : '' + n; };
      el.textContent = 'LOCAL ' + p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
    }
    paint();
    window.setInterval(paint, 1000);
  }

  /* ----------------------------------------------------------------- init */
  function init() {
    fit();
    window.addEventListener('resize', fit, { passive: true });

    var saved = null;
    try { saved = localStorage.getItem('jc-theme'); } catch (e) {}
    setTheme(saved || 'dark');
    document.querySelectorAll('[data-theme-set]').forEach(function (b) {
      b.addEventListener('click', function () {
        setTheme(b.dataset.themeSet);
        var g = b.closest('.terminal-theme');
        if (g) {
          g.classList.remove('is-switching');
          void g.offsetWidth;
          g.classList.add('is-switching');
          window.setTimeout(function () { g.classList.remove('is-switching'); }, 680);
        }
      });
    });
    document.querySelectorAll('[data-theme-toggle]').forEach(function (b) {
      b.addEventListener('click', function () {
        setTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
      });
    });

    buildArray();

    buildTicks();
    buildTabs();
    renderArchive();

    document.querySelectorAll('[data-step]').forEach(function (b) {
      b.addEventListener('click', function () { select(state.file + Number(b.dataset.step)); });
    });
    document.querySelectorAll('.array-card').forEach(function (c) {
      c.addEventListener('click', function () {
        var i = FILES.findIndex(function (f) { return f.id === c.dataset.file; });
        if (i > -1) select(i);
      });
    });
    document.querySelectorAll('[data-action="index"]').forEach(function (b) {
      b.addEventListener('click', function () { if (state.mode === 'file') closeFile(); });
    });
    var replayBtns = [];
    document.querySelectorAll('[data-action="replay"], #reinit').forEach(function (b) {
      replayBtns.push(b);
      b.addEventListener('click', function () { replayIntro(); });
    });
    var bootEnter = document.getElementById('bootEnter');
    if (bootEnter) bootEnter.addEventListener('click', function () { enterArchive(); });
    var readBtn = document.getElementById('readFile');
    if (readBtn) readBtn.addEventListener('click', openFile);
    var backBtn = document.getElementById('fileBack');
    if (backBtn) backBtn.addEventListener('click', closeFile);
    var closeBtn = document.getElementById('fileClose');
    if (closeBtn) closeBtn.addEventListener('click', closeFile);

    document.querySelectorAll('[data-action="archive"]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (state.mode === 'file') closeFile();
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.defaultPrevented) return;
      var tag = (document.activeElement || {}).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (document.getElementById('modal').classList.contains('on')) return;
      if (document.getElementById('viewer').classList.contains('on')) return;

      if (state.mode === 'archive') {
        if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') { e.preventDefault(); select(state.file - 1); }
        else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); select(state.file + 1); }
        else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openFile(); }
      } else if (state.mode === 'file') {
        if (e.key === 'Escape') { e.preventDefault(); closeFile(); }
        else if (e.key === '1' || e.key === '2' || e.key === '3' || e.key === '4') {
          e.preventDefault(); setChapter(Number(e.key));
        }
        else if (e.key === 'ArrowUp' && (document.activeElement === elContent)) {
          // let the panel scroll
        }
      }
    });

    initViewer();
    initModal();
    initClock();
    boot();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
