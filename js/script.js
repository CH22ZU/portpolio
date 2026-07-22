/* ════════════════════════════════
   다크모드 — 저장된 설정 즉시 복원
   (깜빡임 방지를 위해 <head>의 인라인 스크립트로 처리됨)
════════════════════════════════ */

/* ════════════════════════════════
   NAV 높이 측정 — 고정 nav 아래 콘텐츠가
   가려지지 않도록 --nav-h 변수를 실측값으로 갱신
════════════════════════════════ */
(function () {
  const navEl = document.querySelector('nav');
  if (!navEl) return;
  const syncNavHeight = () => {
    document.documentElement.style.setProperty('--nav-h', navEl.offsetHeight + 'px');
  };
  syncNavHeight();
  window.addEventListener('resize', syncNavHeight);
})();

/* ════════════════════════════════
   CUSTOM CURSOR
════════════════════════════════ */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top = mouseY + 'px';
});

function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

/* 호버 시 커서 확대 */
document.querySelectorAll('a, button, .hcard, .skill-card, .contact-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    const dark = document.documentElement.classList.contains('dark');
    ring.style.width = '56px';
    ring.style.height = '56px';
    ring.style.borderColor = dark ? 'rgba(123,159,255,.9)' : 'rgba(91,127,255,.9)';
  });
  el.addEventListener('mouseleave', () => {
    const dark = document.documentElement.classList.contains('dark');
    ring.style.width = '36px';
    ring.style.height = '36px';
    ring.style.borderColor = dark ? 'rgba(123,159,255,.45)' : 'rgba(91,127,255,.45)';
  });
});

/* ════════════════════════════════
   DARK MODE TOGGLE
════════════════════════════════ */
document.getElementById('fab-theme').addEventListener('click', () => {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  ring.style.borderColor = isDark
    ? 'rgba(123,159,255,.45)'
    : 'rgba(91,127,255,.45)';
});

/* ════════════════════════════════
   FAB — TOP 버튼
════════════════════════════════ */
const fabTop = document.getElementById('fab-top');
window.addEventListener('scroll', () => {
  fabTop.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });
fabTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ════════════════════════════════
   NAV — 스크롤 효과
════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ════════════════════════════════
   MOBILE — 햄버거 메뉴
════════════════════════════════ */
const ham = document.getElementById('ham');
const mobileNav = document.getElementById('mobileNav');
let menuOpen = false;

ham.addEventListener('click', () => {
  menuOpen = !menuOpen;
  mobileNav.classList.toggle('open', menuOpen);
  document.body.style.overflow = menuOpen ? 'hidden' : '';
  const spans = ham.querySelectorAll('span');
  if (menuOpen) {
    spans[0].style.transform = 'translateY(6.5px) rotate(45deg)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'translateY(-6.5px) rotate(-45deg)';
  } else {
    spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  }
});

document.querySelectorAll('.mnl').forEach(a => {
  a.addEventListener('click', () => {
    menuOpen = false;
    mobileNav.classList.remove('open');
    document.body.style.overflow = '';
    ham.querySelectorAll('span').forEach(s => {
      s.style.transform = '';
      s.style.opacity = '';
    });
  });
});

/* ════════════════════════════════
   SCROLL REVEAL
════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('in');
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ════════════════════════════════
   CAREER — 스크롤 로드맵
════════════════════════════════ */
const careerTimeline = document.querySelector('.career-timeline');
const careerRailFill = document.getElementById('careerRailFill');
const careerItems = document.querySelectorAll('.career-item');

if (careerTimeline && careerRailFill && careerItems.length) {
  const updateCareerRail = () => {
    const rect = careerTimeline.getBoundingClientRect();
    const vh = window.innerHeight;
    const start = vh * 0.8;
    const end = vh * 0.35;
    const total = rect.height + (start - end);
    const traveled = start - rect.top;
    const pct = Math.max(0, Math.min(1, traveled / total));
    careerRailFill.style.height = (pct * 100) + '%';

    let lastActive = -1;
    careerItems.forEach((item, i) => {
      const dot = item.querySelector('.career-dot');
      if (!dot) return;
      if (dot.getBoundingClientRect().top <= start) {
        item.classList.add('is-active');
        lastActive = i;
      } else {
        item.classList.remove('is-active');
      }
    });
    careerItems.forEach((item, i) => item.classList.toggle('is-current', i === lastActive));
  };

  window.addEventListener('scroll', updateCareerRail, { passive: true });
  window.addEventListener('resize', updateCareerRail);
  updateCareerRail();
}

/* ════════════════════════════════
   SKILLS — 탭 & 진행 바
════════════════════════════════ */
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.skill-bar').forEach(b => {
        b.style.width = b.dataset.width + '%';
      });
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.skills-panel').forEach(p => barObserver.observe(p));

document.querySelectorAll('.skills-tabs .stab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.skills-tabs .stab').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + btn.dataset.tab);
    panel.classList.add('active');
    panel.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
    setTimeout(() => {
      panel.querySelectorAll('.skill-bar').forEach(b => {
        b.style.width = b.dataset.width + '%';
      });
    }, 100);
  });
});

/* 초기 스킬 바 로드 */
setTimeout(() => {
  document.querySelectorAll('#tab-frontend .skill-bar').forEach(b => {
    b.style.width = b.dataset.width + '%';
  });
}, 400);

/* ════════════════════════════════
   HORIZONTAL SCROLL PORTFOLIO
   (스크롤 + 마우스 드래그 동시 지원)
   — .hscroll-wrap 여러 개를 동시에 지원 (섹션별 독립 동작)
════════════════════════════════ */
document.querySelectorAll('.hscroll-wrap').forEach(function (wrap) {
  const track = wrap.querySelector('.hscroll-track');
  const trackWrap = track ? track.parentElement : null;
  const fill = wrap.querySelector('.hscroll-progress-fill');
  const numEl = wrap.querySelector('.hscroll-progress-num');
  const tabs = wrap.querySelectorAll('.portfolio-tabs .stab');
  const labelEl = wrap.querySelector('#portfolioLabel');
  const titleEl = wrap.querySelector('#portfolioTitle');
  if (!wrap || !track) return;

  const groupMeta = {
    design: { label: 'Portfolio — Design', title: '디자인 작업물' },
    web: { label: 'Portfolio — Web', title: '웹 개발 작업물' }
  };

  /* 탭으로 필터링된 "보이는" 카드만 기준으로 개수를 셈
     → 카드가 적으면 스크롤(핀 고정) 구간도 짧게, 늘어나면 자동으로 길어짐
     (모바일에서는 pin 자체를 안 쓰므로 인라인 height를 제거해 CSS의 height:auto가 적용되게 함) */
  function getVisibleCards() {
    return Array.prototype.filter.call(
      track.querySelectorAll('.hcard'),
      function (c) { return !c.hidden; }
    );
  }

  function syncSpacerHeight() {
    if (isMobile()) {
      wrap.style.height = '';
    } else {
      const count = getVisibleCards().length;
      wrap.style.height = (100 + Math.max(1, count) * 70) + 'vh';
    }
  }

  function isMobile() { return window.innerWidth <= 900; }
  syncSpacerHeight();
  window.addEventListener('resize', syncSpacerHeight, { passive: true });

  /* wrap 안에서 스크롤 가능한 총 높이 */
  function getScrollRange() {
    const wrapHeight = wrap.offsetHeight;
    const total = wrapHeight - window.innerHeight;
    return Math.max(1, total);
  }

  function getWrapTop() {
    return wrap.getBoundingClientRect().top + window.scrollY;
  }

  function updateHScroll() {
    if (isMobile()) return;

    const wrapTop = getWrapTop();
    const total = getScrollRange();
    const scrolled = window.scrollY - wrapTop;
    const prog = Math.max(0, Math.min(1, scrolled / total));

    const trackW = track.scrollWidth;
    const viewW = trackWrap.offsetWidth;
    const maxMove = Math.max(0, trackW - viewW);
    track.style.transform = `translateX(-${prog * maxMove}px)`;

    if (fill) fill.style.width = (prog * 100) + '%';
    const totalCards = getVisibleCards().length;
    const idx = Math.min(Math.floor(prog * totalCards), Math.max(0, totalCards - 1)) + 1;
    if (numEl) {
      numEl.textContent =
        String(totalCards ? idx : 0).padStart(2, '0') + ' / ' +
        String(totalCards).padStart(2, '0');
    }
  }

  /* 카테고리 탭 전환 */
  function applyGroup(group) {
    track.querySelectorAll('.hcard').forEach(function (card) {
      card.hidden = card.dataset.group !== group;
    });
    tabs.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.group === group);
    });
    if (labelEl && groupMeta[group]) labelEl.textContent = groupMeta[group].label;
    if (titleEl && groupMeta[group]) titleEl.textContent = groupMeta[group].title;

    track.style.transform = 'translateX(0px)';
    syncSpacerHeight();
    requestAnimationFrame(updateHScroll);
  }

  function setGroup(group) {
    applyGroup(group);
    /* 탭을 바꾸면 해당 섹션 맨 위로 이동해 처음부터 다시 탐색하게 함 */
    if (!isMobile()) {
      window.scrollTo({ top: getWrapTop() + 1 });
    }
  }

  tabs.forEach(function (btn) {
    btn.addEventListener('click', function () { setGroup(btn.dataset.group); });
  });

  if (tabs.length) {
    const initial = wrap.querySelector('.portfolio-tabs .stab.active');
    applyGroup(initial ? initial.dataset.group : 'design');
  }

  window.addEventListener('scroll', updateHScroll, { passive: true });
  window.addEventListener('resize', updateHScroll, { passive: true });
  requestAnimationFrame(updateHScroll);

  /* ── 마우스 드래그로 카드 슬라이딩 (직접 transform 제어) ── */
  let isDragging = false;
  let hasDragged = false;
  let dragStartX = 0;
  let dragStartMove = 0;
  let currentMove = 0;
  let rafPending = false;

  function getMaxMove() {
    const trackW = track.scrollWidth;
    const viewW = trackWrap.offsetWidth;
    return Math.max(1, trackW - viewW);
  }

  function getCurrentTranslateX() {
    const style = window.getComputedStyle(track);
    const matrix = new DOMMatrixReadOnly(style.transform);
    return -matrix.m41;
  }

  function applyTransform(moveX) {
    track.style.transform = `translateX(-${moveX}px)`;
    const maxMove = getMaxMove();
    const prog = maxMove > 0 ? moveX / maxMove : 0;
    if (fill) fill.style.width = (Math.max(0, Math.min(1, prog)) * 100) + '%';
    const cards = track.querySelectorAll('.hcard');
    const totalCards = cards.length;
    const idx = Math.min(Math.floor(Math.max(0, Math.min(1, prog)) * totalCards), totalCards - 1) + 1;
    if (numEl) {
      numEl.textContent =
        String(idx).padStart(2, '0') + ' / ' +
        String(totalCards).padStart(2, '0');
    }
  }

  function onDragStart(e) {
    if (isMobile()) return;
    if (e.target.closest('a')) return;

    isDragging = true;
    hasDragged = false;
    dragStartX = e.clientX;
    dragStartMove = getCurrentTranslateX();
    currentMove = dragStartMove;

    trackWrap.classList.add('dragging');
  }

  function onDragMove(e) {
    if (!isDragging) return;
    const dx = e.clientX - dragStartX;
    if (Math.abs(dx) > 5) hasDragged = true;

    const maxMove = getMaxMove();
    let next = dragStartMove - dx;
    next = Math.max(0, Math.min(maxMove, next));
    currentMove = next;

    if (!rafPending) {
      rafPending = true;
      requestAnimationFrame(() => {
        applyTransform(currentMove);
        rafPending = false;
      });
    }
  }

  function onDragEnd() {
    if (!isDragging) return;
    isDragging = false;
    trackWrap.classList.remove('dragging');

    const maxMove = getMaxMove();
    const prog = maxMove > 0 ? currentMove / maxMove : 0;
    const total = getScrollRange();
    const wrapTop = getWrapTop();
    window.scrollTo({ top: wrapTop + prog * total, behavior: 'auto' });
  }

  trackWrap.addEventListener('click', e => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      hasDragged = false;
    }
  }, true);

  trackWrap.addEventListener('mousedown', onDragStart);
  window.addEventListener('mousemove', onDragMove);
  window.addEventListener('mouseup', onDragEnd);
});

/* ════════════════════════════════
   PORTFOLIO MODAL (2열 그리드)
════════════════════════════════ */
(function () {
  const overlay = document.getElementById('modalOverlay');
  const box = document.getElementById('modalBox');
  const closeBtn = document.getElementById('modalClose');
  const modalCat = document.getElementById('modalCat');
  const modalPeriod = document.getElementById('modalPeriod');
  const modalSep = document.getElementById('modalSep');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalStack = document.getElementById('modalStack');
  const modalLink = document.getElementById('modalLink');
  if (!overlay) return;

  function openModal(card) {
    const d = card.dataset;

    /* 이미지 그리드 생성 */
    const imgList = box.querySelector('.modal-img-list');
    imgList.innerHTML = '';

    const imgs = d.img
      ? d.img.split(',').map(s => s.trim()).filter(Boolean)
      : [];

    if (imgs.length > 0) {
      /* 이미지 1장이면 single 클래스 → 1열 */
      const forceSingle = d.cols === '1';
      imgList.classList.toggle('single', imgs.length === 1 || forceSingle);

      imgs.forEach(src => {
        const item = document.createElement('div');
        item.className = 'modal-img-list-item';
        const img = document.createElement('img');
        img.src = src;
        img.alt = d.title || '';
        item.appendChild(img);
        imgList.appendChild(item);
      });
    } else {
      imgList.classList.add('single');
      const ph = document.createElement('div');
      ph.className = 'modal-img-placeholder';
      const span = document.createElement('span');
      const numEl = card.querySelector('.hcard-num');
      span.textContent = numEl ? numEl.textContent : '';
      ph.appendChild(span);
      imgList.appendChild(ph);
    }

    /* 텍스트 */
    modalCat.textContent = d.cat || '';
    modalPeriod.textContent = d.period || '';
    modalSep.style.display = d.period ? '' : 'none';
    modalTitle.textContent = d.title || '';
    modalDesc.textContent = d.desc || '';

    /* 스택 태그 */
    modalStack.innerHTML = '';
    if (d.stack) {
      d.stack.split(',').forEach(t => {
        const span = document.createElement('span');
        span.className = 'modal-stack-tag';
        span.textContent = t.trim();
        modalStack.appendChild(span);
      });
    }

    /* 링크 */
    if (d.link) {
      modalLink.href = d.link;
      modalLink.classList.remove('hidden');
    } else {
      modalLink.classList.add('hidden');
    }

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    box.scrollTop = 0;
  }

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.hcard').forEach(card => {
    card.addEventListener('click', () => {
      if (card.classList.contains('dragging')) return;
      openModal(card);
    });
    card.style.cursor = 'pointer';
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });
})();

/* ════════════════════════════════
   CONTACT FORM
════════════════════════════════ */
function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitBtn');
  const originalText = '메시지 보내기 →';

  btn.textContent = '전송 중...';
  btn.disabled = true;

  fetch('https://formspree.io/f/xykrdyaj', {
    method: 'POST',
    body: new FormData(form),
    headers: { 'Accept': 'application/json' }
  })
    .then(response => {
      if (response.ok) {
        btn.textContent = '전송 완료 ✓';
        btn.style.background = '#1D9E75';
        form.reset();
      } else {
        throw new Error('전송 실패');
      }
    })
    .catch(() => {
      btn.textContent = '전송 실패, 다시 시도해주세요';
      btn.style.background = '#E05555';
    })
    .finally(() => {
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    });
}