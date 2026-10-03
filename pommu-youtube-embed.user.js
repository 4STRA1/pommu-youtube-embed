// ==UserScript==
// @name         Pommu 動画埋め込み(YouTube/ニコニコ)
// @namespace    https://github.com/4STRA1
// @version      1.5
// @description  Pommuの投稿内のYouTube/ニコニコ動画リンクを再生ウィンドウとして埋め込む(複数はタブ切り替え・タップで読み込み)
// @author       4STRA1
// @license      MIT
// @match        https://ch.dlsite.com/pommu/*
// @run-at       document-idle
// @grant        none
// @homepageURL  https://github.com/4STRA1/pommu-youtube-embed
// @supportURL   https://github.com/4STRA1/pommu-youtube-embed/issues
// @updateURL    https://raw.githubusercontent.com/4STRA1/pommu-youtube-embed/main/pommu-youtube-embed.user.js
// @downloadURL  https://raw.githubusercontent.com/4STRA1/pommu-youtube-embed/main/pommu-youtube-embed.user.js
// ==/UserScript==

(function () {
  'use strict';

  const MARK = 'data-yt-embed-done';
  const LINK_SEL = 'a[href*="youtube.com"], a[href*="youtu.be"], a[href*="nicovideo.jp"], a[href*="nico.ms"]';

  function parseTime(t) {
    if (!t) return 0;
    const m = String(t).match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
    return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
  }

  function parse(href) {
    let u;
    try { u = new URL(href, location.href); } catch { return null; }
    const h = u.hostname.replace(/^(www\.|m\.|music\.|sp\.)/, '');

    // ニコニコ動画
    if (h === 'nicovideo.jp' || h === 'nico.ms') {
      const m = h === 'nico.ms'
        ? u.pathname.match(/^\/((?:sm|nm|so)?\d+)/)
        : u.pathname.match(/^\/watch\/((?:sm|nm|so)?\d+)/);
      if (!m) return null;
      return { site: 'nico', id: m[1], start: parseTime(u.searchParams.get('from')) };
    }

    // YouTube
    let id = null;
    if (h === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
    else if (h === 'youtube.com') {
      if (u.pathname === '/watch') id = u.searchParams.get('v');
      else {
        const m = u.pathname.match(/^\/(shorts|embed|live|v)\/([\w-]{11})/);
        if (m) id = m[2];
      }
    }
    if (!id || !/^[\w-]{11}$/.test(id)) return null;
    return { site: 'yt', id, start: parseTime(u.searchParams.get('t') || u.searchParams.get('start')) };
  }

  function findRoot(a) {
    return a.closest('article, li, [class*="post"], [class*="Post"], [class*="card"], [class*="Card"]') || a.parentElement;
  }

  const SITE = {
    yt:   { name: 'YouTube',  color: '#e62117' },
    nico: { name: 'ニコニコ', color: '#3a3a3a' },
  };

  function build(videos) {
    const wrap = document.createElement('div');
    wrap.className = 'yt-embed-wrap';
    wrap.style.cssText = 'margin:8px 0;max-width:100%;';
    // タップが投稿詳細への遷移などに伝播しないようにする
    wrap.addEventListener('click', e => e.stopPropagation());

    let tabs = null;
    if (videos.length > 1) {
      tabs = document.createElement('div');
      tabs.style.cssText = 'display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px;';
      wrap.appendChild(tabs);
    }

    const box = document.createElement('div');
    box.style.cssText = 'position:relative;width:100%;aspect-ratio:16/9;background:#000;border-radius:8px;overflow:hidden;cursor:pointer;';
    wrap.appendChild(box);

    const buttons = [];
    let cur = 0;

    // サムネイル表示(iframeは作らないので即表示される)
    function showThumb(i) {
      cur = i;
      const v = videos[i];
      box.replaceChildren();
      if (v.site === 'yt') {
        const img = document.createElement('img');
        img.src = `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`;
        img.loading = 'lazy';
        img.alt = '';
        img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;';
        box.appendChild(img);
      } else {
        const ph = document.createElement('div');
        ph.textContent = 'ニコニコ動画  ' + v.id;
        ph.style.cssText = 'position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:12px;color:#ddd;font-size:13px;background:#252525;';
        box.appendChild(ph);
      }
      const play = document.createElement('div');
      play.style.cssText = 'position:absolute;left:50%;top:50%;width:64px;height:44px;margin:-22px 0 0 -32px;background:rgba(0,0,0,.75);border-radius:12px;';
      play.innerHTML = '<svg viewBox="0 0 64 44" width="64" height="44"><path d="M26 12l16 10-16 10z" fill="#fff"/></svg>';
      box.appendChild(play);
      buttons.forEach((b, j) => {
        const c = SITE[videos[j].site].color;
        b.style.background = j === i ? c : '#e8eef5';
        b.style.color = j === i ? '#fff' : '#333';
      });
    }

    // クリックで初めてiframeを読み込む
    box.addEventListener('click', e => {
      e.stopPropagation();
      if (box.querySelector('iframe')) return;
      const v = videos[cur];
      const frame = document.createElement('iframe');
      frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;';
      frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
      frame.allowFullscreen = true;
      frame.referrerPolicy = 'strict-origin-when-cross-origin';
      frame.src = v.site === 'yt'
        ? `https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1` + (v.start ? `&start=${v.start}` : '')
        : `https://embed.nicovideo.jp/watch/${v.id}?autoplay=1` + (v.start ? `&from=${v.start}` : '');
      box.replaceChildren(frame);
      box.style.cursor = 'default';
    });

    function select(i) {
      box.style.cursor = 'pointer';
      showThumb(i);
    }

    if (tabs) {
      const count = {};
      videos.forEach((v, i) => {
        count[v.site] = (count[v.site] || 0) + 1;
        const info = SITE[v.site];
        const b = document.createElement('button');
        b.type = 'button';
        b.textContent = `${info.name} ${count[v.site]}`;
        b.style.cssText = `border:0;border-left:5px solid ${info.color};border-radius:14px;padding:4px 12px 4px 9px;font-size:13px;cursor:pointer;`;
        b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); select(i); });
        tabs.appendChild(b);
        buttons.push(b);
      });
    }
    select(0);
    return wrap;
  }

  function scan() {
    const anchors = [];
    document.querySelectorAll(LINK_SEL).forEach(a => {
      if (a.closest('.yt-embed-wrap')) return;
      const v = parse(a.href);
      if (v) anchors.push({ a, v });
    });

    // 各リンクの直近の親(root)ごとに集計
    const own = new Map();
    anchors.forEach(x => {
      const r = findRoot(x.a);
      if (!r) return;
      if (!own.has(r)) own.set(r, []);
      own.get(r).push(x);
    });

    // 入れ子のrootは外側に統合する(本文リンクとプレビューカードのリンクが
    // 別のrootに振り分けられて二重に埋め込まれるのを防ぐ)
    const roots = [...own.keys()];
    const absorbed = new Set();
    roots.forEach(r => {
      if (!own.get(r).length) return;
      roots.forEach(o => { if (o !== r && r.contains(o)) absorbed.add(o); });
    });

    roots.filter(r => !absorbed.has(r)).forEach(r => {
      const videos = [];
      anchors.forEach(x => {
        if (r.contains(x.a) && !videos.some(y => y.site === x.v.site && y.id === x.v.id)) videos.push(x.v);
      });
      const sig = videos.map(v => v.site + v.id + ':' + v.start).join(',');
      if (r.getAttribute(MARK) === sig) return;
      // 以前の埋め込み(内側rootに作られたもの含む)を片付けてから作り直す
      r.querySelectorAll('.yt-embed-wrap').forEach(w => w.remove());
      r.querySelectorAll('[' + MARK + ']').forEach(e => e.removeAttribute(MARK));
      r.setAttribute(MARK, sig);
      r.appendChild(build(videos));
    });
  }

  let timer = null;
  new MutationObserver(() => {
    clearTimeout(timer);
    timer = setTimeout(scan, 300);
  }).observe(document.body, { childList: true, subtree: true });
  scan();
})();
