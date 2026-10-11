(() => {
  'use strict';

  // ---------- 設定 ----------
  const C = window.KIDS_CONFIG || {};
  const LIMIT_MIN = Number(C.limitMinutes) > 0 ? Number(C.limitMinutes) : 60;
  const LIMIT_MS = LIMIT_MIN * 60000;
  const WARN_MS = Math.max(0, Number(C.warnMinutes) || 0) * 60000;
  const PIN = String(C.parentPin || '').replace(/\D/g, '');
  const CHORE_COUNT = Math.max(1, Number(C.choresPerBreak) || 3);
  const CHORES = (C.chores && C.chores.length) ? C.chores : [{ emoji: '🧸', text: 'おもちゃを かたづける' }];
  const STORE_KEY = 'ouchi-douga:v1';
  const LANG_LABEL = { ja: 'にほんご', en: 'えいご', other: 'そのた' };

  function parseId(v) {
    if (v.id && /^[\w-]{11}$/.test(v.id)) return v.id;
    const src = String(v.url || v.id || '');
    const m = src.match(/(?:v=|youtu\.be\/|shorts\/|embed\/|live\/)([\w-]{11})/);
    return m ? m[1] : null;
  }

  const VIDEOS = (C.videos || []).map((v, i) => {
    const id = parseId(v);
    if (!id) return null;
    const lang = v.lang === 'ja' || v.lang === 'en' ? v.lang : 'other';
    return { id, title: v.title || `どうが ${i + 1}`, lang, auto: !v.title };
  }).filter(Boolean);

  // ---------- 保存データ ----------
  const DEFAULT_STATE = { startAt: null, locked: false, chores: [], lastId: null, filter: 'all', warnedFor: null, titles: {} };
  let state = loadState();
  if (!state.titles || typeof state.titles !== 'object') state.titles = {};
  // title を書いていない動画は、一度再生したときに取得した名前を表示する
  VIDEOS.forEach(v => { if (v.auto && state.titles[v.id]) v.title = state.titles[v.id]; });

  function loadState() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      return Object.assign({}, DEFAULT_STATE, raw ? JSON.parse(raw) : {});
    } catch (e) {
      return Object.assign({}, DEFAULT_STATE);
    }
  }

  function saveState() {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* 保存できない環境でも動作は続ける */ }
  }

  // ---------- 要素 ----------
  const $ = (id) => document.getElementById(id);
  const el = {
    appName: $('appName'), brand: $('brand'),
    timer: $('timer'), timerFill: $('timerFill'), timerText: $('timerText'),
    shell: $('shell'), tapLayer: $('tapLayer'), endLayer: $('endLayer'), errorLayer: $('errorLayer'),
    replayBtn: $('replayBtn'), nextBtn: $('nextBtn'),
    playBtn: $('playBtn'), rewBtn: $('rewBtn'), fwdBtn: $('fwdBtn'), fsBtn: $('fsBtn'),
    seek: $('seek'), timeText: $('timeText'), nowTitle: $('nowTitle'),
    filters: $('filters'), list: $('list'),
    choreScreen: $('choreScreen'), choreGrid: $('choreGrid'), choreDots: $('choreDots'),
    choreFinish: $('choreFinish'), unlockBtn: $('unlockBtn'),
    pinModal: $('pinModal'), pinTitle: $('pinTitle'), pinDots: $('pinDots'), keypad: $('keypad'),
    parentMenu: $('parentMenu'), parentStatus: $('parentStatus'),
    resetBtn: $('resetBtn'), forceLockBtn: $('forceLockBtn'), closeMenuBtn: $('closeMenuBtn'),
    toast: $('toast')
  };

  if (C.appName) {
    el.appName.textContent = C.appName;
    document.title = C.appName;
  }

  // ---------- 動画リスト ----------
  const unavailable = new Set();
  let currentId = VIDEOS.some(v => v.id === state.lastId) ? state.lastId : (VIDEOS[0] && VIDEOS[0].id);

  function filteredVideos() {
    return state.filter === 'all' ? VIDEOS : VIDEOS.filter(v => v.lang === state.filter);
  }

  function renderFilters() {
    const langs = ['ja', 'en', 'other'].filter(l => VIDEOS.some(v => v.lang === l));
    el.filters.innerHTML = '';
    if (langs.length < 2) { el.filters.hidden = true; state.filter = 'all'; return; }
    if (state.filter !== 'all' && !langs.includes(state.filter)) state.filter = 'all';
    ['all', ...langs].forEach(key => {
      const b = document.createElement('button');
      b.className = 'chip';
      b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(state.filter === key));
      b.textContent = key === 'all' ? 'すべて' : LANG_LABEL[key];
      b.addEventListener('click', () => {
        state.filter = key;
        saveState();
        renderFilters();
        renderList();
      });
      el.filters.appendChild(b);
    });
  }

  function renderList() {
    el.list.innerHTML = '';
    const items = filteredVideos();
    if (!VIDEOS.length) {
      el.list.innerHTML = '<li class="empty">見られる動画がまだありません。<br>videos.js に動画を追加してください。</li>';
      return;
    }
    items.forEach(v => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.className = 'item' + (v.id === currentId ? ' is-current' : '') + (unavailable.has(v.id) ? ' is-unavailable' : '');
      b.dataset.id = v.id;

      const thumb = document.createElement('span');
      thumb.className = 'thumb';
      const img = document.createElement('img');
      img.src = `https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`;
      img.alt = '';
      img.loading = 'lazy';
      img.addEventListener('error', () => { img.style.visibility = 'hidden'; });
      thumb.appendChild(img);
      if (v.id === currentId) {
        const badge = document.createElement('span');
        badge.className = 'now-badge';
        badge.textContent = 'いま みてる';
        thumb.appendChild(badge);
      }

      const text = document.createElement('span');
      const t = document.createElement('span');
      t.className = 'item-title';
      t.textContent = v.title;
      const lang = document.createElement('span');
      lang.className = 'item-lang';
      lang.textContent = LANG_LABEL[v.lang];
      text.append(t, lang);

      b.append(thumb, text);
      b.addEventListener('click', () => selectVideo(v.id, true));
      li.appendChild(b);
      el.list.appendChild(li);
    });
  }

  function videoById(id) { return VIDEOS.find(v => v.id === id); }

  // ---------- プレーヤー ----------
  let player = null;
  let ready = false;
  let seeking = false;
  // 広告判定：再生を指示したのに本編の再生（PLAYING）がまだ始まっていない間は広告中とみなす
  let playRequested = false;
  let contentPlaying = false;

  function updateAdHole() {
    el.shell.classList.toggle('is-ad', playRequested && !contentPlaying && !state.locked);
  }

  function requestPlay() {
    playRequested = true;
    updateAdHole();
  }

  window.onYouTubeIframeAPIReady = () => {
    const vars = {
      controls: 0, rel: 0, playsinline: 1, iv_load_policy: 3,
      disablekb: 1, fs: 0, modestbranding: 1
    };
    if (location.protocol.startsWith('http')) vars.origin = location.origin;
    player = new YT.Player('player', {
      host: 'https://www.youtube-nocookie.com',
      videoId: currentId || undefined,
      playerVars: vars,
      events: {
        onReady: () => { ready = true; captionsOff(); },
        onStateChange: onStateChange,
        onError: onPlayerError,
        // 字幕モジュールが読み込まれたタイミングでも字幕を消す
        onApiChange: captionsOff
      }
    });
  };

  function onStateChange(e) {
    const S = YT.PlayerState;
    if (e.data === S.PLAYING) {
      contentPlaying = true;
      playRequested = true;
      if (state.locked) { player.pauseVideo(); showChores(); return; }
      if (!state.startAt) {
        state.startAt = Date.now();   // 最初に再生した時点からカウント開始
        saveState();
        renderTimer();
      }
      el.endLayer.hidden = true;
      el.errorLayer.hidden = true;
      setPaused(false);
      fillAutoTitle();
      captionsOffRepeatedly();
    } else if (e.data === S.ENDED) {
      contentPlaying = false;
      playRequested = false;
      setPaused(true);
      el.endLayer.hidden = false;
    } else if (e.data === S.PAUSED || e.data === S.CUED) {
      contentPlaying = false;
      playRequested = false;
      setPaused(true);
    } else {
      // 読み込み中・バッファ中（広告が入るのもこのタイミング）
      contentPlaying = false;
    }
    updateAdHole();
  }

  // YouTube側の設定や動画の設定で字幕が自動で出ても、表示しないようにする
  function captionsOff() {
    if (!player) return;
    ['captions', 'cc'].forEach(m => {
      try { player.unloadModule(m); } catch (e) { /* noop */ }
    });
    try { player.setOption('captions', 'track', {}); } catch (e) { /* noop */ }
  }

  // 字幕は読み込みが遅れて出てくることがあるため、再生開始後しばらく繰り返し消す
  let captionTimers = [];
  function captionsOffRepeatedly() {
    captionTimers.forEach(clearTimeout);
    captionsOff();
    captionTimers = [500, 1500, 3000, 6000, 10000].map(ms => setTimeout(captionsOff, ms));
  }

  function fillAutoTitle() {
    const v = videoById(currentId);
    if (!v || !v.auto || state.titles[v.id]) return;
    let t = '';
    try { t = (player.getVideoData() || {}).title || ''; } catch (e) { /* noop */ }
    if (!t) return;
    v.title = t;
    state.titles[v.id] = t;
    saveState();
    renderNowTitle();
    renderList();
  }

  function onPlayerError() {
    if (currentId) unavailable.add(currentId);
    el.errorLayer.hidden = false;
    setPaused(true);
    renderList();
  }

  function setPaused(paused) {
    el.shell.classList.toggle('is-paused', paused);
    el.playBtn.setAttribute('aria-label', paused ? 'さいせい' : 'いちじていし');
  }

  function selectVideo(id, autoplay) {
    if (!id) return;
    currentId = id;
    state.lastId = id;
    saveState();
    el.endLayer.hidden = true;
    el.errorLayer.hidden = true;
    renderNowTitle();
    renderList();
    if (!ready) return;
    contentPlaying = false;
    if (autoplay && !state.locked) { requestPlay(); player.loadVideoById(id); }
    else { playRequested = false; player.cueVideoById(id); updateAdHole(); }
    if (state.locked && autoplay) showChores();
  }

  function renderNowTitle() {
    const v = videoById(currentId);
    el.nowTitle.textContent = v ? v.title : '';
  }

  function togglePlay() {
    if (state.locked) { showChores(); return; }
    if (!ready) return;
    const s = player.getPlayerState();
    if (s === YT.PlayerState.PLAYING || s === YT.PlayerState.BUFFERING) {
      playRequested = false;
      player.pauseVideo();
      updateAdHole();
    } else {
      requestPlay();
      player.playVideo();
    }
  }

  function seekBy(sec) {
    if (!ready) return;
    const t = Math.max(0, (player.getCurrentTime() || 0) + sec);
    player.seekTo(t, true);
  }

  function fmt(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = String(sec % 60).padStart(2, '0');
    return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
  }

  function updateProgress() {
    if (!ready || seeking || typeof player.getDuration !== 'function') return;
    const dur = player.getDuration() || 0;
    const cur = player.getCurrentTime() || 0;
    const val = dur ? Math.round((cur / dur) * 1000) : 0;
    el.seek.value = val;
    el.seek.style.setProperty('--pct', (val / 10) + '%');
    el.timeText.textContent = `${fmt(cur)} / ${fmt(dur)}`;
  }

  el.tapLayer.addEventListener('click', togglePlay);
  el.playBtn.addEventListener('click', togglePlay);
  el.rewBtn.addEventListener('click', () => seekBy(-10));
  el.fwdBtn.addEventListener('click', () => seekBy(10));
  el.replayBtn.addEventListener('click', () => {
    el.endLayer.hidden = true;
    if (state.locked) { showChores(); return; }
    if (ready) { requestPlay(); player.seekTo(0, true); player.playVideo(); }
  });
  el.nextBtn.addEventListener('click', () => {
    const list = filteredVideos().filter(v => !unavailable.has(v.id));
    if (!list.length) return;
    const idx = list.findIndex(v => v.id === currentId);
    selectVideo(list[(idx + 1) % list.length].id, true);
  });

  el.seek.addEventListener('input', () => {
    seeking = true;
    el.seek.style.setProperty('--pct', (el.seek.value / 10) + '%');
  });
  el.seek.addEventListener('change', () => {
    if (ready) {
      const dur = player.getDuration() || 0;
      player.seekTo((dur * el.seek.value) / 1000, true);
    }
    seeking = false;
  });

  function isFullscreen() { return !!(document.fullscreenElement || document.webkitFullscreenElement); }

  function exitFullscreen() {
    if (!isFullscreen()) return;
    const fn = document.exitFullscreen || document.webkitExitFullscreen;
    if (fn) { try { fn.call(document); } catch (e) { /* noop */ } }
  }

  el.fsBtn.addEventListener('click', () => {
    if (isFullscreen()) { exitFullscreen(); return; }
    const fn = el.shell.requestFullscreen || el.shell.webkitRequestFullscreen;
    if (fn) { try { fn.call(el.shell); } catch (e) { /* noop */ } }
  });

  // ---------- タイマー ----------
  function remainingMs() {
    return state.startAt ? LIMIT_MS - (Date.now() - state.startAt) : LIMIT_MS;
  }

  function renderTimer() {
    el.timer.classList.remove('is-warn', 'is-idle');
    if (state.locked) {
      el.timerFill.style.width = '0%';
      el.timerText.textContent = 'チャレンジ タイム';
      return;
    }
    if (!state.startAt) {
      el.timer.classList.add('is-idle');
      el.timerFill.style.width = '100%';
      el.timerText.textContent = `▶ で スタート（${LIMIT_MIN}分）`;
      return;
    }
    const left = Math.max(0, remainingMs());
    el.timerFill.style.width = ((left / LIMIT_MS) * 100).toFixed(2) + '%';
    el.timerText.textContent = `あと ${Math.ceil(left / 60000)}分`;
    if (WARN_MS && left <= WARN_MS) el.timer.classList.add('is-warn');
  }

  function tick() {
    if (!state.locked && state.startAt) {
      const left = remainingMs();
      if (left <= 0) { lock(); return; }
      if (WARN_MS && left <= WARN_MS && state.warnedFor !== state.startAt) {
        state.warnedFor = state.startAt;
        saveState();
        showToast(`あと ${Math.ceil(left / 60000)}分で チャレンジ タイムだよ`);
      }
    }
    renderTimer();
  }

  let toastTimer = null;
  function showToast(msg) {
    el.toast.textContent = msg;
    el.toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.toast.hidden = true; }, 6000);
  }

  // ---------- チャレンジタイム ----------
  function pickChores() {
    const pool = CHORES.slice();
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, Math.min(CHORE_COUNT, pool.length)).map(c => ({ emoji: c.emoji || '⭐', text: c.text || '', done: false }));
  }

  function lock() {
    state.locked = true;
    state.chores = pickChores();
    saveState();
    if (ready) { try { player.pauseVideo(); } catch (e) { /* noop */ } }
    playRequested = false;
    updateAdHole();
    exitFullscreen();
    renderTimer();
    showChores();
  }

  function unlock() {
    state.locked = false;
    state.startAt = null;      // 次に再生ボタンを押した時点から、また1時間
    state.chores = [];
    state.warnedFor = null;
    saveState();
    el.choreScreen.hidden = true;
    renderTimer();
  }

  function showChores() {
    if (!state.chores || !state.chores.length) { state.chores = pickChores(); saveState(); }
    renderChores(-1);
    el.choreScreen.hidden = false;
  }

  function renderChores(justDone) {
    el.choreGrid.innerHTML = '';
    el.choreDots.innerHTML = '';
    state.chores.forEach((c, i) => {
      const dot = document.createElement('span');
      dot.className = 'chore-dot' + (c.done ? ' is-done' : '');
      el.choreDots.appendChild(dot);

      const card = document.createElement('div');
      card.className = 'card' + (c.done ? ' is-done' : '');
      card.innerHTML = '<span class="card-emoji" aria-hidden="true"></span><span class="card-text"></span>';
      card.querySelector('.card-emoji').textContent = c.emoji;
      card.querySelector('.card-text').textContent = c.text;
      if (c.done) {
        const stamp = document.createElement('span');
        stamp.className = 'stamp' + (i === justDone ? ' is-new' : '');
        stamp.textContent = 'できた！';
        card.appendChild(stamp);
      } else {
        // 子供が勝手に押せないよう、家族の確認（パスワード）でのみ完了にする
        const check = document.createElement('button');
        check.className = 'card-check';
        check.textContent = 'おうちの人の かくにん';
        check.addEventListener('click', async () => {
          if (PIN) {
            const ok = await askPin(`「${c.text}」の かくにん`);
            if (!ok) return;
          }
          c.done = true;
          saveState();
          renderChores(i);
        });
        card.appendChild(check);
      }
      el.choreGrid.appendChild(card);
    });
    el.choreFinish.hidden = !state.chores.every(c => c.done);
  }

  // カードごとに家族の確認を済ませているため、ここではそのまま解除する
  el.unlockBtn.addEventListener('click', unlock);

  // ---------- 暗証番号 ----------
  function askPin(title) {
    return new Promise(resolve => {
      let input = '';
      el.pinTitle.textContent = title;
      const draw = () => {
        el.pinDots.innerHTML = '';
        for (let i = 0; i < PIN.length; i++) {
          const d = document.createElement('span');
          d.className = 'pin-dot' + (i < input.length ? ' is-filled' : '');
          el.pinDots.appendChild(d);
        }
      };
      const close = (result) => {
        el.pinModal.hidden = true;
        el.keypad.innerHTML = '';
        resolve(result);
      };
      el.keypad.innerHTML = '';
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'cancel', '0', 'back'].forEach(k => {
        const b = document.createElement('button');
        b.className = 'key' + (k.length > 1 ? ' key-sub' : '');
        b.textContent = k === 'cancel' ? 'やめる' : k === 'back' ? '消す' : k;
        b.addEventListener('click', () => {
          if (k === 'cancel') { close(false); return; }
          if (k === 'back') { input = input.slice(0, -1); draw(); return; }
          if (input.length >= PIN.length) return;
          input += k;
          draw();
          if (input.length === PIN.length) {
            if (input === PIN) { setTimeout(() => close(true), 120); }
            else {
              el.pinDots.classList.remove('is-wrong');
              void el.pinDots.offsetWidth;
              el.pinDots.classList.add('is-wrong');
              setTimeout(() => { input = ''; draw(); }, 350);
            }
          }
        });
        el.keypad.appendChild(b);
      });
      draw();
      el.pinModal.hidden = false;
    });
  }

  // ---------- おうちの人メニュー（アプリ名を3秒長押し） ----------
  let pressTimer = null;
  const startPress = () => {
    clearTimeout(pressTimer);
    pressTimer = setTimeout(openParentMenu, 3000);
  };
  const cancelPress = () => clearTimeout(pressTimer);
  el.brand.addEventListener('pointerdown', startPress);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => el.brand.addEventListener(t, cancelPress));
  el.brand.addEventListener('contextmenu', e => e.preventDefault());

  async function openParentMenu() {
    if (PIN) {
      const ok = await askPin('おうちの人メニュー');
      if (!ok) return;
    }
    let status;
    if (state.locked) status = 'いまは チャレンジタイム中です。';
    else if (!state.startAt) status = `まだカウントは始まっていません。\n再生ボタンを押した時点から${LIMIT_MIN}分です。`;
    else {
      const start = new Date(state.startAt);
      status = `${start.getHours()}:${String(start.getMinutes()).padStart(2, '0')} にカウント開始。\n残り ${Math.max(0, Math.ceil(remainingMs() / 60000))}分です。`;
    }
    if (!PIN) status += '\n※暗証番号が未設定です（videos.js の parentPin）。';
    el.parentStatus.textContent = status;
    el.parentMenu.hidden = false;
  }

  el.resetBtn.addEventListener('click', () => { unlock(); el.parentMenu.hidden = true; });
  el.forceLockBtn.addEventListener('click', () => { el.parentMenu.hidden = true; lock(); });
  el.closeMenuBtn.addEventListener('click', () => { el.parentMenu.hidden = true; });

  // ---------- 起動 ----------
  renderFilters();
  renderList();
  renderNowTitle();
  if (state.locked) showChores();
  tick();
  setInterval(tick, 1000);
  setInterval(updateProgress, 500);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
})();
