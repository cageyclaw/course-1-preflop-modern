import './style.css';

import a1Raw from './content/chapters/A1.md?raw';
import a2Raw from './content/chapters/A2.md?raw';
import a3Raw from './content/chapters/A3.md?raw';
import a4Raw from './content/chapters/A4.md?raw';
import a5Raw from './content/chapters/A5.md?raw';
import a6Raw from './content/chapters/A6.md?raw';
import a7Raw from './content/chapters/A7.md?raw';
import d1Raw from './content/drills/D1-rfi-decision-lab.md?raw';
import d2Raw from './content/drills/D2-3bet-or-defend-lab.md?raw';
import d3Raw from './content/drills/D3-bb-defense-speed-drill.md?raw';
import d4Raw from './content/drills/D4-final-assessment.md?raw';

const app = document.querySelector('#app');
const STORAGE_KEY = 'midnight-academy-progress';
const baseUrl = import.meta.env.BASE_URL;

const modules = [
  {
    id: 'A1',
    kind: 'chapter',
    label: 'Chapter A1',
    theme: 'RFI baseline',
    est: '12 min read',
    points: 120,
    accent: 'nebula',
    summary: 'Build first-in discipline by seat, sizing, and bottom-of-range memory.',
    raw: a1Raw,
  },
  {
    id: 'A2',
    kind: 'chapter',
    label: 'Chapter A2',
    theme: '3-bet pressure',
    est: '10 min read',
    points: 120,
    accent: 'lunar',
    summary: 'Learn value versus bluff construction, linear versus polar ranges, and sizing rules.',
    raw: a2Raw,
  },
  {
    id: 'A3',
    kind: 'chapter',
    label: 'Chapter A3',
    theme: 'Facing a 3-bet',
    est: '9 min read',
    points: 120,
    accent: 'aurora',
    summary: 'Defend selectively with suited, connected hands and cut dominated offsuit leaks.',
    raw: a3Raw,
  },
  {
    id: 'A4',
    kind: 'chapter',
    label: 'Chapter A4',
    theme: 'Blind defense',
    est: '9 min read',
    points: 120,
    accent: 'nebula',
    summary: 'Use pot odds with discipline, especially when equity realization gets ugly multiway.',
    raw: a4Raw,
  },
  {
    id: 'A5',
    kind: 'chapter',
    label: 'Chapter A5',
    theme: 'ISO raising',
    est: '8 min read',
    points: 120,
    accent: 'lunar',
    summary: 'Punish limpers with deliberate sizing and tighter-than-RFI ranges.',
    raw: a5Raw,
  },
  {
    id: 'A6',
    kind: 'chapter',
    label: 'Chapter A6',
    theme: 'Stack depth',
    est: '8 min read',
    points: 120,
    accent: 'aurora',
    summary: 'Adjust hand class value and commitment thresholds from 25bb to 150bb.',
    raw: a6Raw,
  },
  {
    id: 'A7',
    kind: 'chapter',
    label: 'Chapter A7',
    theme: '30-day plan',
    est: '7 min read',
    points: 120,
    accent: 'nebula',
    summary: 'Turn study into habit with a focused daily drill loop and weekly checkpoints.',
    raw: a7Raw,
  },
  {
    id: 'D1',
    kind: 'drill',
    label: 'Drill D1',
    theme: 'RFI lab',
    est: '30 hands',
    points: 180,
    accent: 'lunar',
    summary: 'Rapid-fire open versus fold reps to stabilize early-position and button discipline.',
    raw: d1Raw,
  },
  {
    id: 'D2',
    kind: 'drill',
    label: 'Drill D2',
    theme: '3-bet or defend',
    est: '25 spots',
    points: 180,
    accent: 'aurora',
    summary: 'Choose between 3-bet, call, and fold against opens using a clean default system.',
    raw: d2Raw,
  },
  {
    id: 'D3',
    kind: 'drill',
    label: 'Drill D3',
    theme: 'BB defense speed',
    est: '20 spots',
    points: 180,
    accent: 'nebula',
    summary: 'Sharpen quick big-blind decisions against CO and BTN pressure.',
    raw: d3Raw,
  },
  {
    id: 'D4',
    kind: 'drill',
    label: 'Drill D4',
    theme: 'Final assessment',
    est: '30 questions',
    points: 220,
    accent: 'lunar',
    summary: 'Run the full preflop gate and verify you can execute defaults under pressure.',
    raw: d4Raw,
  },
].map((module) => ({
  ...module,
  title: extractTitle(module.raw),
  html: markdownToHtml(module.raw),
}));

function extractTitle(raw) {
  const match = raw.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : 'Untitled';
}

function loadState() {
  const fallback = {
    completed: {},
    score: 0,
    streak: 0,
    lastActionDate: null,
    history: [],
  };

  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if (!parsed || typeof parsed !== 'object') {
      return fallback;
    }

    return {
      ...fallback,
      ...parsed,
      completed: parsed.completed || {},
      history: Array.isArray(parsed.history) ? parsed.history : [],
    };
  } catch {
    return fallback;
  }
}

let state = loadState();

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function todayStamp() {
  return new Date().toISOString().slice(0, 10);
}

function previousDay(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  date.setDate(date.getDate() - 1);
  return date.toISOString().slice(0, 10);
}

function calculateProgress(currentState) {
  const completedIds = modules.filter((module) => currentState.completed[module.id]).map((module) => module.id);
  const completionTotal = completedIds.length;
  const progressPercent = Math.round((completionTotal / modules.length) * 100);
  const score = modules.reduce(
    (sum, module) => sum + (currentState.completed[module.id] ? module.points : 0),
    0,
  );

  return {
    completedIds,
    completionTotal,
    progressPercent,
    score,
    chaptersDone: modules.filter((module) => module.kind === 'chapter' && currentState.completed[module.id]).length,
    drillsDone: modules.filter((module) => module.kind === 'drill' && currentState.completed[module.id]).length,
  };
}

function buildBadges(metrics, currentState) {
  const badges = [];

  if (metrics.completionTotal >= 1) {
    badges.push({ title: 'First Light', detail: 'Completed your first module.' });
  }
  if (metrics.chaptersDone === 7) {
    badges.push({ title: 'Theory Cleared', detail: 'All seven academy chapters complete.' });
  }
  if (metrics.drillsDone >= 2) {
    badges.push({ title: 'Lab Runner', detail: 'Completed at least two drills.' });
  }
  if (metrics.progressPercent >= 50) {
    badges.push({ title: 'Halfway Sharp', detail: 'Reached 50% course progress.' });
  }
  if (metrics.progressPercent === 100) {
    badges.push({ title: 'Midnight Certified', detail: 'Finished every chapter and drill.' });
  }
  if (currentState.streak >= 3) {
    badges.push({ title: 'Night Shift', detail: `${currentState.streak}-day study streak.` });
  }
  if (metrics.score >= 1200) {
    badges.push({ title: 'Point Grinder', detail: `${metrics.score} total academy points.` });
  }

  return badges;
}

function toggleCompletion(moduleId) {
  const wasComplete = Boolean(state.completed[moduleId]);
  const actionDate = todayStamp();

  state.completed[moduleId] = !wasComplete;

  if (!wasComplete) {
    if (state.lastActionDate === actionDate) {
      state.streak = Math.max(state.streak, 1);
    } else if (state.lastActionDate === previousDay(actionDate)) {
      state.streak += 1;
    } else {
      state.streak = 1;
    }

    state.lastActionDate = actionDate;
    state.history = [moduleId, ...state.history.filter((id) => id !== moduleId)].slice(0, 5);
  }

  const metrics = calculateProgress(state);
  state.score = metrics.score;
  saveState();
  render();
}

function resetProgress() {
  state = {
    completed: {},
    score: 0,
    streak: 0,
    lastActionDate: null,
    history: [],
  };
  saveState();
  render();
}

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

function formatInline(text) {
  return escapeHtml(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

function normalizeAssetPaths(text) {
  return text.replaceAll('/course-md/', `${baseUrl}assets/diagrams/`);
}

function markdownToHtml(raw) {
  const lines = normalizeAssetPaths(raw).trim().split('\n');
  const parts = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (!paragraph.length) {
      return;
    }

    parts.push(`<p>${paragraph.map((line) => formatInline(line)).join('<br />')}</p>`);
    paragraph = [];
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      continue;
    }

    if (trimmed.startsWith('<')) {
      flushParagraph();
      parts.push(trimmed);
      continue;
    }

    if (trimmed === '---') {
      flushParagraph();
      parts.push('<hr />');
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      parts.push(`<h${level}>${formatInline(heading[2])}</h${level}>`);
      continue;
    }

    const image = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (image) {
      flushParagraph();
      parts.push(`
        <figure class="content-figure">
          <img src="${image[2]}" alt="${escapeHtml(image[1])}" loading="lazy" />
        </figure>
      `);
      continue;
    }

    if (/^>\s?/.test(trimmed)) {
      flushParagraph();
      const quoteLines = [trimmed.replace(/^>\s?/, '')];
      while (index + 1 < lines.length && /^>\s?/.test(lines[index + 1].trim())) {
        index += 1;
        quoteLines.push(lines[index].trim().replace(/^>\s?/, ''));
      }
      parts.push(`<blockquote>${formatInline(quoteLines.join(' '))}</blockquote>`);
      continue;
    }

    if (/^- /.test(trimmed)) {
      flushParagraph();
      const listLines = [trimmed];
      while (index + 1 < lines.length && /^- /.test(lines[index + 1].trim())) {
        index += 1;
        listLines.push(lines[index].trim());
      }
      parts.push(`<ul>${listLines
        .map((item) => `<li>${formatInline(item.replace(/^- /, ''))}</li>`)
        .join('')}</ul>`);
      continue;
    }

    if (/^\d+\.\s/.test(trimmed)) {
      flushParagraph();
      const listLines = [trimmed];
      while (index + 1 < lines.length && /^\d+\.\s/.test(lines[index + 1].trim())) {
        index += 1;
        listLines.push(lines[index].trim());
      }
      parts.push(`<ol>${listLines
        .map((item) => `<li>${formatInline(item.replace(/^\d+\.\s/, ''))}</li>`)
        .join('')}</ol>`);
      continue;
    }

    paragraph.push(trimmed);
  }

  flushParagraph();
  return parts.join('');
}

function renderNav() {
  return `
    <a class="skip-link" href="#main-content">Skip to course content</a>
    <header class="site-header">
      <div class="brand-lockup">
        <p class="eyebrow">Midnight Academy</p>
        <h1>Course 1 Preflop — Modern Premium</h1>
        <p class="header-copy">A dark-only training surface for disciplined preflop reps, review, and milestone tracking.</p>
      </div>
      <nav class="site-nav" aria-label="Primary">
        <a href="#dashboard">Dashboard</a>
        <a href="#chapters">Chapters</a>
        <a href="#drills">Drills</a>
        <a href="#progress">Progress</a>
      </nav>
    </header>
  `;
}

function renderHero(metrics, badges) {
  return `
    <section class="hero panel" id="dashboard" aria-labelledby="dashboard-title">
      <div class="hero-copy">
        <p class="eyebrow">Academy Dashboard</p>
        <h2 id="dashboard-title">Sharpen the premium preflop baseline without leaving a single page.</h2>
        <p>Every module below is linked, readable, and trackable. Mark chapters and drills complete to persist progress, points, streaks, and milestone badges in local storage.</p>
        <div class="hero-actions">
          <a class="button button-primary" href="#chapters">Start the chapters</a>
          <a class="button button-secondary" href="#drills">Jump to drills</a>
        </div>
      </div>
      <div class="hero-stats" aria-label="Course metrics">
        <div class="metric-card">
          <span>Completion</span>
          <strong>${metrics.progressPercent}%</strong>
        </div>
        <div class="metric-card">
          <span>Score</span>
          <strong>${metrics.score}</strong>
        </div>
        <div class="metric-card">
          <span>Streak</span>
          <strong>${state.streak} day${state.streak === 1 ? '' : 's'}</strong>
        </div>
      </div>
      <div class="badge-strip" aria-label="Milestones">
        ${badges.length
          ? badges.map((badge) => `<span class="badge-pill" title="${escapeHtml(badge.detail)}">${badge.title}</span>`).join('')
          : '<span class="badge-pill badge-pill-muted">No badges yet</span>'}
      </div>
    </section>
  `;
}

function renderOverviewCards(items, title, description, id) {
  return `
    <section class="panel" id="${id}" aria-labelledby="${id}-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">${items[0]?.kind === 'chapter' ? 'Core Theory' : 'Applied Labs'}</p>
          <h2 id="${id}-title">${title}</h2>
        </div>
        <p>${description}</p>
      </div>
      <div class="card-grid">
        ${items.map(renderModuleCard).join('')}
      </div>
    </section>
  `;
}

function renderModuleCard(module) {
  const complete = Boolean(state.completed[module.id]);
  return `
    <article class="course-card course-card-${module.accent}">
      <div class="course-card-top">
        <span class="card-label">${module.label}</span>
        <span class="card-est">${module.est}</span>
      </div>
      <h3><a href="#module-${module.id}">${module.title}</a></h3>
      <p class="card-theme">${module.theme}</p>
      <p>${module.summary}</p>
      <div class="card-actions">
        <a class="button button-link" href="#module-${module.id}">Open section</a>
        <button
          class="button ${complete ? 'button-secondary' : 'button-primary'}"
          type="button"
          data-complete-toggle="${module.id}"
          aria-pressed="${complete}"
        >
          ${complete ? 'Completed' : 'Mark complete'}
        </button>
      </div>
    </article>
  `;
}

function renderProgress(metrics, badges) {
  const recent = state.history
    .map((id) => modules.find((module) => module.id === id))
    .filter(Boolean);

  return `
    <aside class="panel progress-panel" id="progress" aria-labelledby="progress-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">Progress Panel</p>
          <h2 id="progress-title">Track cadence, not just content.</h2>
        </div>
      </div>
      <div class="progress-bar" aria-hidden="true">
        <span style="width:${metrics.progressPercent}%"></span>
      </div>
      <dl class="progress-list">
        <div><dt>Modules done</dt><dd>${metrics.completionTotal} / ${modules.length}</dd></div>
        <div><dt>Chapters cleared</dt><dd>${metrics.chaptersDone} / 7</dd></div>
        <div><dt>Drills cleared</dt><dd>${metrics.drillsDone} / 4</dd></div>
        <div><dt>Current streak</dt><dd>${state.streak} day${state.streak === 1 ? '' : 's'}</dd></div>
      </dl>
      <div class="badge-panel">
        <h3>Badges</h3>
        ${badges.length
          ? badges.map((badge) => `<p><strong>${badge.title}</strong> <span>${badge.detail}</span></p>`).join('')
          : '<p>No badges unlocked yet. Finish a module to start the chain.</p>'}
      </div>
      <div class="recent-panel">
        <h3>Recent clears</h3>
        ${recent.length
          ? recent.map((module) => `<p><a href="#module-${module.id}">${module.id}</a> ${module.title}</p>`).join('')
          : '<p>No completed modules yet.</p>'}
      </div>
      <button class="button button-danger" type="button" data-reset-progress="true">Reset progress</button>
    </aside>
  `;
}

function renderContentSections(items, id, title) {
  return `
    <section class="content-rail" aria-labelledby="${id}-content-title">
      <div class="section-heading">
        <div>
          <p class="eyebrow">${id === 'chapters' ? 'Deep Study' : 'Practical Reps'}</p>
          <h2 id="${id}-content-title">${title}</h2>
        </div>
      </div>
      ${items.map(renderContentSection).join('')}
    </section>
  `;
}

function renderContentSection(module) {
  const complete = Boolean(state.completed[module.id]);

  return `
    <article class="module panel" id="module-${module.id}" aria-labelledby="${module.id}-title">
      <div class="module-header">
        <div>
          <p class="module-kicker">${module.label} · ${module.theme}</p>
          <h3 id="${module.id}-title">${module.title}</h3>
        </div>
        <div class="module-controls">
          <a class="button button-link" href="#dashboard">Back to top</a>
          <button
            class="button ${complete ? 'button-secondary' : 'button-primary'}"
            type="button"
            data-complete-toggle="${module.id}"
            aria-pressed="${complete}"
          >
            ${complete ? 'Completed' : `Earn ${module.points} pts`}
          </button>
        </div>
      </div>
      <p class="module-summary">${module.summary}</p>
      <div class="module-body">
        ${module.html}
      </div>
    </article>
  `;
}

function render() {
  const metrics = calculateProgress(state);
  const badges = buildBadges(metrics, state);
  const chapters = modules.filter((module) => module.kind === 'chapter');
  const drills = modules.filter((module) => module.kind === 'drill');

  app.innerHTML = `
    ${renderNav()}
    <main class="app-shell" id="main-content">
      ${renderHero(metrics, badges)}
      <div class="layout-grid">
        <div class="main-stack">
          ${renderOverviewCards(chapters, 'Chapter map A1-A7', 'Each chapter card opens a full in-page section with semantic headings and linked content.', 'chapters')}
          ${renderOverviewCards(drills, 'Drill deck D1-D4', 'Applied labs for open/fold reps, 3-bet decisions, big blind defense, and the final assessment.', 'drills')}
          ${renderContentSections(chapters, 'chapters', 'Chapter Library')}
          ${renderContentSections(drills, 'drills', 'Drill Library')}
        </div>
        ${renderProgress(metrics, badges)}
      </div>
    </main>
  `;
}

app.addEventListener('click', (event) => {
  const toggleId = event.target.closest('[data-complete-toggle]')?.dataset.completeToggle;
  if (toggleId) {
    toggleCompletion(toggleId);
    return;
  }

  if (event.target.closest('[data-reset-progress]')) {
    resetProgress();
  }
});

render();
