import './style.css';

import A1 from './content/chapters/A1.md?raw';
import A2 from './content/chapters/A2.md?raw';
import A3 from './content/chapters/A3.md?raw';
import A4 from './content/chapters/A4.md?raw';
import A5 from './content/chapters/A5.md?raw';
import A6 from './content/chapters/A6.md?raw';
import A7 from './content/chapters/A7.md?raw';

import D1 from './content/drills/D1-rfi-decision-lab.md?raw';
import D2 from './content/drills/D2-3bet-or-defend-lab.md?raw';
import D3 from './content/drills/D3-bb-defense-speed-drill.md?raw';
import D4 from './content/drills/D4-final-assessment.md?raw';

import quizData from './content/quizzes.json';

const app = document.querySelector('#app');

const chapters = [
  {
    id: 'A1',
    slug: 'a1-rfi-fundamentals',
    title: 'RFI Fundamentals',
    subtitle: 'Opening ranges + position discipline',
    duration: '35 min',
    focus: 'Baseline opening system',
    summary:
      'Build a position-aware opening structure with consistent sizing and bottom-of-range discipline.',
  },
  {
    id: 'A2',
    slug: 'a2-opening-ranges-and-position',
    title: 'Opening Ranges and Position',
    subtitle: 'Pressure, value, and range shape',
    duration: '32 min',
    focus: 'Aggression framework',
    summary:
      'Learn linear vs polar 3-bet ranges and the sizing system that keeps you unexploitable.',
  },
  {
    id: 'A3',
    slug: 'a3-three-betting-and-facing-pressure',
    title: 'Three-Betting and Facing Pressure',
    subtitle: 'Defend with structure, not vibes',
    duration: '30 min',
    focus: 'Defense buckets',
    summary:
      'Fold, call, or 4-bet with clear buckets and avoid dominated offsuit traps.',
  },
  {
    id: 'A4',
    slug: 'a4-blind-defense-foundations',
    title: 'Blind Defense Foundations',
    subtitle: 'Pot odds vs equity realization',
    duration: '28 min',
    focus: 'SB/BB protection',
    summary:
      'Defend with playability in mind and stop bleeding from the blinds.',
  },
  {
    id: 'A5',
    slug: 'a5-isolation-and-punish-spots',
    title: 'Isolation and Punish Spots',
    subtitle: 'Punish limpers, avoid crowds',
    duration: '26 min',
    focus: 'ISO sizing & ranges',
    summary:
      'Use a disciplined sizing ladder to isolate weak players and control pot geometry.',
  },
  {
    id: 'A6',
    slug: 'a6-population-exploits-and-adjustments',
    title: 'Population Exploits and Adjustments',
    subtitle: 'Shallow vs deep adjustments',
    duration: '24 min',
    focus: 'Depth-aware strategy',
    summary:
      'Learn how effective stacks change hand value and your commitment thresholds.',
  },
  {
    id: 'A7',
    slug: 'a7-preflop-system-integration',
    title: 'Preflop System Integration',
    subtitle: 'Habits > heroics',
    duration: '20 min',
    focus: 'Training cadence',
    summary:
      'Build a repeatable daily plan that turns charts into instincts.',
  },
];

const drills = [
  {
    id: 'D1',
    slug: 'd1-rfi-decision-lab',
    title: 'RFI Decision Lab',
    subtitle: 'Open or fold in 30 hands',
    duration: '15 min',
    points: 60,
    summary: 'Rapid-fire RFI reps to lock in position discipline.',
  },
  {
    id: 'D2',
    slug: 'd2-3bet-or-defend-lab',
    title: '3-Bet or Defend Lab',
    subtitle: 'Pressure vs protection',
    duration: '18 min',
    points: 70,
    summary: 'Choose 3-bet, call, or fold in modern pressure spots.',
  },
  {
    id: 'D3',
    slug: 'd3-bb-defense-speed-drill',
    title: 'BB Defense Speed Drill',
    subtitle: 'Pot odds + realization',
    duration: '14 min',
    points: 60,
    summary: 'Fast repetitions on blind defense against common opens.',
  },
  {
    id: 'D4',
    slug: 'd4-final-assessment',
    title: 'Final Assessment',
    subtitle: 'Integrated preflop exam',
    duration: '20 min',
    points: 100,
    summary: 'Full-spectrum preflop decisions across positions and depths.',
  },
];

const contentMap = {
  A1,
  A2,
  A3,
  A4,
  A5,
  A6,
  A7,
  D1,
  D2,
  D3,
  D4,
};

const STORAGE_KEY = 'midnight-academy-progress';

const defaultProgress = {
  completed: {},
  scores: {},
  activities: {},
  attempts: {},
  lessons: {},
  badges: {
    earnedBadgeIds: [],
    earnedAtByBadgeId: {},
  },
  summary: {},
};

const loadProgress = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return saved ? { ...defaultProgress, ...saved } : { ...defaultProgress };
  } catch (error) {
    return { ...defaultProgress };
  }
};

const saveProgress = (progress) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
};

const getRoute = () => {
  const hash = window.location.hash.replace('#', '');
  if (!hash) return '/';
  return hash.startsWith('/') ? hash : `/${hash}`;
};

const baseUrl = import.meta.env.BASE_URL || '/';

const markdownToHtml = (md) => {
  const lines = md.split('\n');
  let html = '';
  let inUl = false;
  let inOl = false;
  let inCode = false;

  const closeLists = () => {
    if (inUl) {
      html += '</ul>';
      inUl = false;
    }
    if (inOl) {
      html += '</ol>';
      inOl = false;
    }
  };

  const formatInline = (text) =>
    text
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img alt="$1" src="$2" />');

  lines.forEach((line) => {
    if (line.startsWith('```')) {
      if (!inCode) {
        closeLists();
        inCode = true;
        html += '<pre><code>';
      } else {
        inCode = false;
        html += '</code></pre>';
      }
      return;
    }

    if (inCode) {
      html += `${line}\n`;
      return;
    }

    if (!line.trim()) {
      closeLists();
      html += '';
      return;
    }

    if (line.trim().startsWith('<')) {
      closeLists();
      html += line;
      return;
    }

    if (/^#{1,6}\s/.test(line)) {
      closeLists();
      const level = line.match(/^#+/)[0].length;
      const text = formatInline(line.replace(/^#{1,6}\s*/, ''));
      html += `<h${level}>${text}</h${level}>`;
      return;
    }

    if (/^>\s?/.test(line)) {
      closeLists();
      const quote = formatInline(line.replace(/^>\s?/, ''));
      html += `<blockquote>${quote}</blockquote>`;
      return;
    }

    if (/^\d+\.\s/.test(line)) {
      if (!inOl) {
        closeLists();
        inOl = true;
        html += '<ol>';
      }
      const item = formatInline(line.replace(/^\d+\.\s*/, ''));
      html += `<li>${item}</li>`;
      return;
    }

    if (/^-\s/.test(line)) {
      if (!inUl) {
        closeLists();
        inUl = true;
        html += '<ul>';
      }
      const item = formatInline(line.replace(/^-\s*/, ''));
      html += `<li>${item}</li>`;
      return;
    }

    if (/^---$/.test(line.trim())) {
      closeLists();
      html += '<hr />';
      return;
    }

    closeLists();
    html += `<p>${formatInline(line)}</p>`;
  });

  closeLists();

  return html
    .replace(/\/(course-md)\//g, `${baseUrl}assets/diagrams/`)
    .replace(/\n{2,}/g, '\n');
};

const badgeDefinitions = [
  {
    id: 'FIRST_CHAPTER',
    label: 'First Blood',
    description: 'Complete any chapter quiz.',
    category: 'milestone',
  },
  {
    id: 'ALL_CHAPTERS',
    label: 'Chapter Sweeper',
    description: 'Complete all seven chapter quizzes.',
    category: 'milestone',
  },
  {
    id: 'FIRST_DRILL',
    label: 'Into the Lab',
    description: 'Complete your first drill.',
    category: 'milestone',
  },
  {
    id: 'ALL_DRILLS',
    label: 'Drill Sergeant',
    description: 'Complete all four drills.',
    category: 'milestone',
  },
  {
    id: 'COURSE_COMPLETE',
    label: 'Course Cleared',
    description: 'Complete all 11 assessments.',
    category: 'milestone',
  },
  {
    id: 'QUIZ_PERFECT_1',
    label: 'Clean Sheet',
    description: 'Score 100% on any chapter quiz.',
    category: 'performance',
  },
  {
    id: 'QUIZ_PERFECT_ALL',
    label: 'Seven for Seven',
    description: 'Score 100% on all chapter quizzes.',
    category: 'performance',
  },
  {
    id: 'DRILL_90',
    label: 'Pressure Tested',
    description: 'Score 90% or better on any drill.',
    category: 'performance',
  },
  {
    id: 'D4_PASS',
    label: 'Final Table Ticket',
    description: 'Pass the final assessment with 70%+.',
    category: 'performance',
  },
  {
    id: 'D4_MASTERY',
    label: 'Preflop Mastery',
    description: 'Score 85%+ on the final assessment.',
    category: 'performance',
  },
  {
    id: 'THREE_HOT',
    label: 'Heater',
    description: 'Post 80%+ on three attempts in a row.',
    category: 'consistency',
  },
  {
    id: 'COMEBACK',
    label: 'Adjustment Made',
    description: 'Improve a best score by 25 points or more.',
    category: 'consistency',
  },
  {
    id: 'STREAK_3',
    label: 'Showing Up',
    description: 'Submit scored attempts on three consecutive days.',
    category: 'consistency',
  },
  {
    id: 'D3_FINISH',
    label: 'Beat the Clock',
    description: 'Finish the D3 speed drill before time expires.',
    category: 'speed',
  },
  {
    id: 'D3_FAST_80',
    label: 'Fast and Right',
    description: 'Score 80%+ on D3 with sub-3s responses.',
    category: 'speed',
  },
  {
    id: 'D3_MASTER_SPEED',
    label: 'BB Blitz',
    description: 'Score 90%+ on D3 with sub-2s responses.',
    category: 'speed',
  },
];

const toDateKey = (isoString) => (isoString ? isoString.split('T')[0] : null);

const getAllAttempts = (progress) =>
  Object.values(progress.attempts || {}).flat().filter((attempt) => attempt?.submittedAt);

const sortAttempts = (attempts) =>
  [...attempts].sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt));

const computeAverage = (scores) => {
  if (!scores.length) return 0;
  const total = scores.reduce((sum, score) => sum + score, 0);
  return Math.round(total / scores.length);
};

const formatDate = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatDateTime = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

const computeStreakCount = (attempts) => {
  const dateKeys = Array.from(
    new Set(attempts.map((attempt) => toDateKey(attempt.submittedAt)).filter(Boolean))
  ).sort();

  if (!dateKeys.length) return 0;

  let streak = 1;
  let cursor = new Date(dateKeys[dateKeys.length - 1]);
  for (let i = dateKeys.length - 2; i >= 0; i -= 1) {
    const candidate = new Date(dateKeys[i]);
    const diffDays = (cursor - candidate) / (1000 * 60 * 60 * 24);
    if (diffDays === 1) {
      streak += 1;
      cursor = candidate;
    } else if (diffDays > 1) {
      break;
    }
  }

  return streak;
};

const computeSummary = (progress) => {
  const activities = progress.activities || {};
  const chapterQuizActivities = Object.values(activities).filter(
    (activity) => activity.type === 'chapterQuiz'
  );
  const drillActivities = Object.values(activities).filter((activity) => activity.type === 'drill');

  const completedChapterQuizzes = chapterQuizActivities.filter((activity) => activity.completed).length;
  const completedDrills = drillActivities.filter((activity) => activity.completed).length;
  const totalCompletableActivities = chapters.length + drills.length;
  const progressPercent = Math.round(
    ((completedChapterQuizzes + completedDrills) / totalCompletableActivities) * 100
  );

  const averageChapterQuizScore = computeAverage(
    chapterQuizActivities
      .filter((activity) => activity.completed && activity.bestScore !== undefined)
      .map((activity) => activity.bestScore)
  );
  const averageDrillScore = computeAverage(
    drillActivities
      .filter((activity) => activity.completed && activity.bestScore !== undefined)
      .map((activity) => activity.bestScore)
  );

  const finalAssessment = activities.D4;
  const finalAssessmentScore = finalAssessment?.bestScore ?? null;
  const passedFinalAssessment = finalAssessment?.passed ?? false;

  const attempts = sortAttempts(getAllAttempts(progress));
  const lastActivityAt = attempts.length ? attempts[attempts.length - 1].submittedAt : null;
  const streakCount = computeStreakCount(attempts);

  return {
    completedChapterQuizzes,
    completedDrills,
    totalCompletableActivities,
    progressPercent,
    averageChapterQuizScore,
    averageDrillScore,
    finalAssessmentScore,
    passedFinalAssessment,
    lastActivityAt,
    streakCount,
  };
};

const updateSummary = (progress) => {
  const summary = computeSummary(progress);
  progress.summary = summary;
  return summary;
};

const updateBadges = (progress, { latestAttempt, bestScoreImprovedBy } = {}) => {
  const badgeProgress = progress.badges || { earnedBadgeIds: [], earnedAtByBadgeId: {} };
  const earned = new Set(badgeProgress.earnedBadgeIds || []);
  const earnedAtByBadgeId = badgeProgress.earnedAtByBadgeId || {};
  const summary = computeSummary(progress);

  const attempts = sortAttempts(getAllAttempts(progress));
  const chapterQuizIds = chapters.map((chapter) => `${chapter.id}-QUIZ`);
  const drillIds = drills.map((drill) => drill.id);

  const activities = progress.activities || {};
  const anyChapterPerfect = chapterQuizIds.some((id) => activities[id]?.bestScore === 100);
  const allChapterPerfect = chapterQuizIds.every((id) => activities[id]?.bestScore === 100);
  const anyDrill90 = drillIds.some((id) => (activities[id]?.bestScore ?? 0) >= 90);

  const d4Activity = activities.D4;
  const d4Pass = d4Activity?.passed || false;
  const d4Mastery = (d4Activity?.bestScore ?? 0) >= 85;

  const d3Attempts = attempts.filter((attempt) => attempt.activityId === 'D3');
  const d3Finish = d3Attempts.some((attempt) => attempt.completionReason !== 'timerExpired');
  const d3Fast80 = d3Attempts.some(
    (attempt) =>
      attempt.scorePercent >= 80 && (attempt.metrics?.averageResponseMs ?? Infinity) <= 3000
  );
  const d3MasterSpeed = d3Attempts.some(
    (attempt) =>
      attempt.scorePercent >= 90 && (attempt.metrics?.averageResponseMs ?? Infinity) <= 2000
  );

  let hotStreak = 0;
  let hasThreeHot = false;
  attempts.forEach((attempt) => {
    if ((attempt.scorePercent ?? 0) >= 80) {
      hotStreak += 1;
      if (hotStreak >= 3) {
        hasThreeHot = true;
      }
    } else {
      hotStreak = 0;
    }
  });

  const maybeEarn = (badgeId, condition, timestamp) => {
    if (!condition || earned.has(badgeId)) return;
    earned.add(badgeId);
    earnedAtByBadgeId[badgeId] = timestamp || new Date().toISOString();
  };

  const awardTime = latestAttempt?.submittedAt;

  maybeEarn('FIRST_CHAPTER', summary.completedChapterQuizzes >= 1, awardTime);
  maybeEarn('ALL_CHAPTERS', summary.completedChapterQuizzes === 7, awardTime);
  maybeEarn('FIRST_DRILL', summary.completedDrills >= 1, awardTime);
  maybeEarn('ALL_DRILLS', summary.completedDrills === 4, awardTime);
  maybeEarn('COURSE_COMPLETE', summary.progressPercent === 100, awardTime);
  maybeEarn('QUIZ_PERFECT_1', anyChapterPerfect, awardTime);
  maybeEarn('QUIZ_PERFECT_ALL', allChapterPerfect, awardTime);
  maybeEarn('DRILL_90', anyDrill90, awardTime);
  maybeEarn('D4_PASS', d4Pass, d4Activity?.passedAt || awardTime);
  maybeEarn('D4_MASTERY', d4Mastery, awardTime);
  maybeEarn('THREE_HOT', hasThreeHot, awardTime);
  maybeEarn('COMEBACK', (bestScoreImprovedBy ?? 0) >= 25, awardTime);
  maybeEarn('STREAK_3', summary.streakCount >= 3, awardTime);
  maybeEarn('D3_FINISH', d3Finish, awardTime);
  maybeEarn('D3_FAST_80', d3Fast80, awardTime);
  maybeEarn('D3_MASTER_SPEED', d3MasterSpeed, awardTime);

  progress.badges = {
    earnedBadgeIds: Array.from(earned),
    earnedAtByBadgeId,
  };
};

const computeProgress = (progress) => {
  const summary = computeSummary(progress);
  const activities = progress.activities || {};
  const completedActivities = Object.values(activities).filter(
    (activity) => activity.completed && activity.bestScore !== undefined
  );
  const overallScore = computeAverage(completedActivities.map((activity) => activity.bestScore));

  const badgeProgress = progress.badges || { earnedBadgeIds: [], earnedAtByBadgeId: {} };
  const earnedBadgeIds = new Set(badgeProgress.earnedBadgeIds || []);

  const badges = badgeDefinitions.map((badge) => ({
    ...badge,
    unlocked: earnedBadgeIds.has(badge.id),
    earnedAt: badgeProgress.earnedAtByBadgeId?.[badge.id] || null,
  }));

  return {
    totalItems: summary.totalCompletableActivities,
    completedCount: summary.completedChapterQuizzes + summary.completedDrills,
    percent: summary.progressPercent,
    score: overallScore,
    badges,
    summary,
  };
};

const getNextItem = (progress) => {
  const nextChapter = chapters.find((chapter) => !progress.completed[chapter.id]);
  if (nextChapter) return { type: 'chapter', ...nextChapter };
  const nextDrill = drills.find((drill) => !progress.completed[drill.id]);
  return nextDrill ? { type: 'drill', ...nextDrill } : null;
};

const getChapterBySlug = (slug) => chapters.find((chapter) => chapter.slug === slug);
const getDrillBySlug = (slug) => drills.find((drill) => drill.slug === slug);

const renderLayout = (content, route) => {
  const progress = loadProgress();
  updateSummary(progress);
  updateBadges(progress);
  saveProgress(progress);
  const stats = computeProgress(progress);
  const nextItem = getNextItem(progress);

  app.innerHTML = `
    <div class="page">
      <header class="site-header">
        <div class="logo">
          <span class="logo-mark">MA</span>
          <div>
            <div class="logo-title">Midnight Academy</div>
            <div class="logo-subtitle">Course 1 · Preflop Mastery</div>
          </div>
        </div>
        <nav class="site-nav">
          <a href="#/course" class="${route === '/course' ? 'active' : ''}">Overview</a>
          <a href="#/course/chapters" class="${route.startsWith('/course/chapters') ? 'active' : ''}">Chapters</a>
          <a href="#/course/drills" class="${route.startsWith('/course/drills') ? 'active' : ''}">Drills</a>
          <a href="#/course/progress" class="${route === '/course/progress' ? 'active' : ''}">Progress</a>
          <a href="#/course/badges" class="${route === '/course/badges' ? 'active' : ''}">Badges</a>
        </nav>
        <div class="academy-stats">
          <div>
            <div class="stat-label">Completion</div>
            <div class="stat-value">${stats.percent}%</div>
          </div>
          <div>
            <div class="stat-label">Accuracy</div>
            <div class="stat-value">${stats.score}</div>
          </div>
        </div>
      </header>
      <main class="wrap">
        ${content}
      </main>
      <footer class="site-footer">
        <div>Midnight Academy · Modern Premium Preflop System</div>
        <div class="footer-links">
          <span>Learn · Drill · Review</span>
          <span>Progress: ${stats.completedCount}/${stats.totalItems}</span>
        </div>
      </footer>
      ${nextItem ? `
        <a class="floating-cta" href="#/course/${nextItem.type === 'chapter' ? 'chapters' : 'drills'}/${nextItem.slug}">
          Continue ${nextItem.type === 'chapter' ? 'Chapter' : 'Drill'} ${nextItem.id}
        </a>
      ` : ''}
    </div>
  `;

  attachEventHandlers();
};

const renderCourseOverview = () => {
  const progress = loadProgress();
  const stats = computeProgress(progress);
  const nextItem = getNextItem(progress);
  const summary = stats.summary;
  const earnedBadges = stats.badges.filter((badge) => badge.unlocked);

  return `
    <section class="hero">
      <div>
        <p class="eyebrow">Midnight Academy · Modern Premium</p>
        <h1>Preflop mastery with discipline, not drama.</h1>
        <p class="lead">A premium, structured learning system for serious preflop decisions — built for clarity, speed, and long-term edge.</p>
        <div class="hero-actions">
          <a class="btn primary" href="#/course/chapters">Browse Chapters</a>
          <a class="btn ghost" href="#/course/drills">Run Drills</a>
        </div>
        <div class="hero-meta">
          <div>
            <span class="meta-label">Modules Complete</span>
            <span class="meta-value">${stats.completedCount}/${stats.totalItems}</span>
          </div>
          <div>
            <span class="meta-label">Chapters</span>
            <span class="meta-value">${summary.completedChapterQuizzes}/${chapters.length}</span>
          </div>
          <div>
            <span class="meta-label">Drills</span>
            <span class="meta-value">${summary.completedDrills}/${drills.length}</span>
          </div>
          <div>
            <span class="meta-label">Accuracy Score</span>
            <span class="meta-value">${stats.score}%</span>
          </div>
          <div>
            <span class="meta-label">Next up</span>
            <span class="meta-value">${nextItem ? `${nextItem.id} · ${nextItem.title}` : 'All complete'}</span>
          </div>
        </div>
      </div>
      <div class="hero-panel">
        <div class="panel-header">Progress Snapshot</div>
        <div class="progress-bar">
          <span style="width: ${stats.percent}%"></span>
        </div>
        <div class="progress-row">
          <span>${stats.percent}% complete</span>
          <span>${stats.completedCount} / ${stats.totalItems}</span>
        </div>
        <dl class="progress-list">
          <div>
            <dt>Chapter Quizzes</dt>
            <dd>${summary.completedChapterQuizzes}/${chapters.length}</dd>
          </div>
          <div>
            <dt>Drills</dt>
            <dd>${summary.completedDrills}/${drills.length}</dd>
          </div>
          <div>
            <dt>Avg Chapter Score</dt>
            <dd>${summary.averageChapterQuizScore}%</dd>
          </div>
          <div>
            <dt>Avg Drill Score</dt>
            <dd>${summary.averageDrillScore}%</dd>
          </div>
        </dl>
        <div class="badge-panel">
          <h3>Earned Badges</h3>
          <p>${earnedBadges.length ? `${earnedBadges.length} unlocked` : 'No badges yet — complete your first quiz or drill to unlock one.'}</p>
          <div class="badge-strip">
            ${earnedBadges.length
              ? earnedBadges.map((badge) => `<span class="badge-pill">${badge.label}</span>`).join('')
              : '<span class="badge-pill badge-pill-muted">No badges earned yet</span>'}
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>Academy Pillars</h2>
        <p>Learn the system, drill the reps, review the feedback.</p>
      </div>
      <div class="grid three">
        <div class="card">
          <h3>Learn</h3>
          <p>Seven structured chapters that build a complete preflop decision model.</p>
          <div class="pill">A1–A7</div>
        </div>
        <div class="card">
          <h3>Drill</h3>
          <p>Targeted labs that convert charts into fast, consistent instincts.</p>
          <div class="pill">D1–D4</div>
        </div>
        <div class="card">
          <h3>Review</h3>
          <p>Track score, repetition, and mistakes with a calm, repeatable cadence.</p>
          <div class="pill">Score + badges</div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>Curriculum Roadmap</h2>
        <p>Follow the academy progression and lock each checkpoint before advancing.</p>
      </div>
      <div class="timeline">
        ${chapters
          .map((chapter, index) => {
            const complete = progress.completed[chapter.id];
            return `
            <div class="timeline-item ${complete ? 'complete' : ''}">
              <div class="timeline-index">${index + 1}</div>
              <div>
                <div class="timeline-title">${chapter.id} · ${chapter.title}</div>
                <div class="timeline-subtitle">${chapter.subtitle}</div>
                <p>${chapter.summary}</p>
                <a href="#/course/chapters/${chapter.slug}" class="inline-link">Open chapter</a>
              </div>
              <div class="timeline-meta">
                <span>${chapter.duration}</span>
                <span>${chapter.focus}</span>
                <span>${complete ? 'Complete' : 'In progress'}</span>
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    </section>

    <section class="section">
      <div class="section-header">
        <h2>Drill Progress</h2>
        <p>Short-form reps that reinforce each strategic layer.</p>
      </div>
      <div class="grid two">
        ${drills
          .map((drill) => {
            const activityProgress = progress.activities?.[drill.id] || {};
            const complete = activityProgress.completed;
            const bestScore = activityProgress.bestScore;
            const latestScore = activityProgress.latestScore;
            const passed = activityProgress.passed;
            const statusLabel = drill.id === 'D4' && complete
              ? passed
                ? 'Passed'
                : 'Completed'
              : complete
                ? 'Complete'
                : 'Pending';
            return `
            <div class="card">
              <div class="card-header">
                <div>
                  <h3>${drill.id} · ${drill.title}</h3>
                  <p>${drill.subtitle}</p>
                </div>
                <span class="status ${complete ? 'complete' : ''}">${statusLabel}</span>
              </div>
              <p>${drill.summary}</p>
              <div class="card-meta">
                <span>${drill.duration}</span>
                <span>${drill.points} pts</span>
                ${bestScore !== undefined ? `<span>Best: ${bestScore}%</span>` : ''}
                ${latestScore !== undefined ? `<span>Latest: ${latestScore}%</span>` : ''}
              </div>
              <div class="card-actions">
                <a class="btn ghost" href="#/course/drills/${drill.slug}">Open Drill</a>
                <a class="btn ${complete ? 'ghost' : 'primary'}" href="#/course/drills/${drill.slug}">
                  ${complete ? 'Review Drill' : 'Run Drill'}
                </a>
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    </section>
  `;
};

const renderChaptersIndex = () => {
  const progress = loadProgress();

  return `
    <section class="section">
      <div class="section-header">
        <h1>Chapters (A1–A7)</h1>
        <p>Core lessons that define your preflop decision system.</p>
      </div>
      <div class="grid two">
        ${chapters
          .map((chapter) => {
            const complete = progress.completed[chapter.id];
            return `
            <div class="card">
              <div class="card-header">
                <div>
                  <h3>${chapter.id} · ${chapter.title}</h3>
                  <p>${chapter.subtitle}</p>
                </div>
                <span class="status ${complete ? 'complete' : ''}">${complete ? 'Complete' : 'Pending'}</span>
              </div>
              <p>${chapter.summary}</p>
              <div class="card-meta">
                <span>${chapter.duration}</span>
                <span>${chapter.focus}</span>
              </div>
              <div class="card-actions">
                <a class="btn ghost" href="#/course/chapters/${chapter.slug}">Open Chapter</a>
                <a class="btn ${complete ? 'ghost' : 'primary'}" href="#/course/chapters/${chapter.slug}/quiz">
                  ${complete ? 'Review Quiz' : 'Take Quiz'}
                </a>
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    </section>
  `;
};

const renderDrillsIndex = () => {
  const progress = loadProgress();

  return `
    <section class="section">
      <div class="section-header">
        <h1>Drills (D1–D4)</h1>
        <p>Targeted reps that reinforce the lesson mechanics.</p>
      </div>
      <div class="grid two">
        ${drills
          .map((drill) => {
            const activityProgress = progress.activities?.[drill.id] || {};
            const complete = activityProgress.completed;
            const bestScore = activityProgress.bestScore;
            const latestScore = activityProgress.latestScore;
            const passed = activityProgress.passed;
            const statusLabel = drill.id === 'D4' && complete
              ? passed
                ? 'Passed'
                : 'Completed'
              : complete
                ? 'Complete'
                : 'Pending';
            return `
            <div class="card">
              <div class="card-header">
                <div>
                  <h3>${drill.id} · ${drill.title}</h3>
                  <p>${drill.subtitle}</p>
                </div>
                <span class="status ${complete ? 'complete' : ''}">${statusLabel}</span>
              </div>
              <p>${drill.summary}</p>
              <div class="card-meta">
                <span>${drill.duration}</span>
                <span>${drill.points} pts</span>
                ${bestScore !== undefined ? `<span>Best: ${bestScore}%</span>` : ''}
                ${latestScore !== undefined ? `<span>Latest: ${latestScore}%</span>` : ''}
              </div>
              <div class="card-actions">
                <a class="btn ghost" href="#/course/drills/${drill.slug}">Open Drill</a>
                <a class="btn ${complete ? 'ghost' : 'primary'}" href="#/course/drills/${drill.slug}">
                  ${complete ? 'Review Drill' : 'Run Drill'}
                </a>
              </div>
            </div>
          `;
          })
          .join('')}
      </div>
    </section>
  `;
};

const renderProgressPage = () => {
  const progress = loadProgress();
  const stats = computeProgress(progress);
  const summary = stats.summary;
  const earnedBadges = stats.badges.filter((badge) => badge.unlocked);

  return `
    <section class="section">
      <div class="section-header">
        <h1>Progress Dashboard</h1>
        <p>Completion, score, and progression summary.</p>
      </div>
      <div class="grid two">
        <div class="card highlight">
          <h3>Academy Progress</h3>
          <p>Completion based on chapter quizzes and drill finishes.</p>
          <div class="progress-bar">
            <span style="width: ${stats.percent}%"></span>
          </div>
          <div class="progress-row">
            <span>${stats.percent}% complete</span>
            <span>${stats.completedCount}/${stats.totalItems}</span>
          </div>
        </div>
        <div class="card highlight">
          <h3>Accuracy Score</h3>
          <p>Average of best scores across completed quizzes and drills.</p>
          <div class="score-display">${stats.score}%</div>
          <div class="score-subtext">Retake drills to improve the average.</div>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <h2>Performance Breakdown</h2>
        <p>Scores, streaks, and assessment checkpoints.</p>
      </div>
      <div class="card-grid">
        <div class="metric-card">
          <span>Chapters Completed</span>
          <strong>${summary.completedChapterQuizzes}/${chapters.length}</strong>
        </div>
        <div class="metric-card">
          <span>Drills Completed</span>
          <strong>${summary.completedDrills}/${drills.length}</strong>
        </div>
        <div class="metric-card">
          <span>Avg Chapter Score</span>
          <strong>${summary.averageChapterQuizScore}%</strong>
        </div>
        <div class="metric-card">
          <span>Avg Drill Score</span>
          <strong>${summary.averageDrillScore}%</strong>
        </div>
        <div class="metric-card">
          <span>Final Assessment</span>
          <strong>${summary.finalAssessmentScore !== null ? `${summary.finalAssessmentScore}%` : '—'}</strong>
        </div>
        <div class="metric-card">
          <span>Assessment Status</span>
          <strong>${summary.finalAssessmentScore !== null ? (summary.passedFinalAssessment ? 'Passed' : 'Completed') : 'Not started'}</strong>
        </div>
        <div class="metric-card">
          <span>Streak</span>
          <strong>${summary.streakCount} day${summary.streakCount === 1 ? '' : 's'}</strong>
        </div>
        <div class="metric-card">
          <span>Last Activity</span>
          <strong>${formatDateTime(summary.lastActivityAt)}</strong>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <h2>Chapter Status</h2>
      </div>
      <div class="grid two">
        ${chapters
          .map((chapter) => {
            const complete = progress.completed[chapter.id];
            const activityProgress = progress.activities?.[`${chapter.id}-QUIZ`] || {};
            const bestScore = activityProgress.bestScore;
            const latestScore = activityProgress.latestScore;
            return `
            <div class="card">
              <div class="card-header">
                <div>
                  <h3>${chapter.id} · ${chapter.title}</h3>
                  <p>${chapter.subtitle}</p>
                </div>
                <span class="status ${complete ? 'complete' : ''}">${complete ? 'Complete' : 'Pending'}</span>
              </div>
              <p>${chapter.summary}</p>
              <div class="card-meta">
                <span>${chapter.duration}</span>
                <span>${chapter.focus}</span>
                ${bestScore !== undefined ? `<span>Best: ${bestScore}%</span>` : ''}
                ${latestScore !== undefined ? `<span>Latest: ${latestScore}%</span>` : ''}
              </div>
              <a class="btn ghost" href="#/course/chapters/${chapter.slug}">Open Chapter</a>
            </div>
          `;
          })
          .join('')}
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <h2>Drill Status</h2>
      </div>
      <div class="grid two">
        ${drills
          .map((drill) => {
            const activityProgress = progress.activities?.[drill.id] || {};
            const complete = activityProgress.completed;
            const bestScore = activityProgress.bestScore;
            const latestScore = activityProgress.latestScore;
            const passed = activityProgress.passed;
            const statusLabel = drill.id === 'D4' && complete
              ? passed
                ? 'Passed'
                : 'Completed'
              : complete
                ? 'Complete'
                : 'Pending';
            return `
            <div class="card">
              <div class="card-header">
                <div>
                  <h3>${drill.id} · ${drill.title}</h3>
                  <p>${drill.subtitle}</p>
                </div>
                <span class="status ${complete ? 'complete' : ''}">${statusLabel}</span>
              </div>
              <p>${drill.summary}</p>
              <div class="card-meta">
                <span>${drill.duration}</span>
                <span>${drill.points} pts</span>
                ${bestScore !== undefined ? `<span>Best: ${bestScore}%</span>` : ''}
                ${latestScore !== undefined ? `<span>Latest: ${latestScore}%</span>` : ''}
              </div>
              <a class="btn ghost" href="#/course/drills/${drill.slug}">Open Drill</a>
            </div>
          `;
          })
          .join('')}
      </div>
    </section>
    <section class="section">
      <div class="section-header">
        <h2>Badges Earned</h2>
        <p>${earnedBadges.length ? `${earnedBadges.length} unlocked so far` : 'No badges earned yet.'}</p>
      </div>
      <div class="badge-strip">
        ${earnedBadges.length
          ? earnedBadges
            .map((badge) => `<span class="badge-pill">${badge.label} · ${formatDate(badge.earnedAt)}</span>`)
            .join('')
          : '<span class="badge-pill badge-pill-muted">Complete a quiz or drill to unlock your first badge.</span>'}
      </div>
    </section>
  `;
};

const renderBadgesPage = () => {
  const progress = loadProgress();
  const stats = computeProgress(progress);

  return `
    <section class="section">
      <div class="section-header">
        <h1>Badges & Achievements</h1>
        <p>Earned based on actual completion and scores.</p>
      </div>
      <div class="grid two">
        ${stats.badges
          .map(
            (badge) => `
            <div class="card ${badge.unlocked ? 'highlight' : ''}">
              <h3>${badge.label}</h3>
              <p>${badge.description}</p>
              <div class="status ${badge.unlocked ? 'complete' : ''}">${badge.unlocked ? 'Unlocked' : 'Locked'}</div>
            </div>
          `
          )
          .join('')}
      </div>
    </section>
  `;
};

const renderChapterLesson = (chapter) => {
  const progress = loadProgress();
  const htmlContent = markdownToHtml(contentMap[chapter.id]);
  const complete = progress.completed[chapter.id];
  const index = chapters.findIndex((item) => item.id === chapter.id);
  const prev = index > 0 ? chapters[index - 1] : null;
  const next = index < chapters.length - 1 ? chapters[index + 1] : null;

  return `
    <section class="lesson-hero">
      <div>
        <p class="eyebrow">Chapter ${chapter.id}</p>
        <h1>${chapter.title}</h1>
        <p class="lead">${chapter.subtitle}</p>
        <div class="lesson-actions">
          <a class="btn primary" href="#/course/chapters/${chapter.slug}/quiz">${complete ? 'Review Quiz' : 'Take the Chapter Quiz'}</a>
          <a class="btn ghost" href="#/course/chapters">Back to Chapters</a>
        </div>
      </div>
      <div class="lesson-panel">
        <div class="panel-header">Chapter Status</div>
        <div class="status-row">
          <span>Status</span>
          <span>${complete ? 'Complete' : 'In progress'}</span>
        </div>
        <div class="status-row">
          <span>Duration</span>
          <span>${chapter.duration}</span>
        </div>
        <div class="status-row">
          <span>Focus</span>
          <span>${chapter.focus}</span>
        </div>
        <div class="status-row">
          <span>Summary</span>
          <span>${chapter.summary}</span>
        </div>
      </div>
    </section>
    <section class="lesson-grid">
      <aside class="lesson-sidebar">
        <div class="card">
          <h3>Progression</h3>
          <p>Follow the chapter ladder and keep the system cohesive.</p>
          <ul>
            ${prev ? `<li><a class="inline-link" href="#/course/chapters/${prev.slug}">← ${prev.id} · ${prev.title}</a></li>` : '<li>Start of the track</li>'}
            <li><strong>Current:</strong> ${chapter.id} · ${chapter.title}</li>
            ${next ? `<li><a class="inline-link" href="#/course/chapters/${next.slug}">${next.id} · ${next.title} →</a></li>` : '<li>Final chapter</li>'}
          </ul>
        </div>
        <div class="card">
          <h3>Quiz checkpoint</h3>
          <p>Complete the quiz to lock this chapter.</p>
          <a class="btn ghost" href="#/course/chapters/${chapter.slug}/quiz">Take the Chapter Quiz</a>
        </div>
      </aside>
      <article class="lesson-content">
        ${htmlContent}
        <div class="card highlight" style="margin-top: 32px;">
          <h3>End-of-chapter checkpoint</h3>
          <p>When you can explain this lesson without notes, take the quiz to seal the rep.</p>
          <div class="card-actions">
            <a class="btn primary" href="#/course/chapters/${chapter.slug}/quiz">${complete ? 'Review Quiz' : 'Take the Chapter Quiz'}</a>
            ${next ? `<a class="btn ghost" href="#/course/chapters/${next.slug}">Next Chapter</a>` : '<a class="btn ghost" href="#/course/drills">Go to Drills</a>'}
          </div>
        </div>
      </article>
    </section>
  `;
};

const renderChapterQuiz = (chapter) => {
  const progress = loadProgress();
  const quizId = `${chapter.id}-QUIZ`;
  const quiz = quizData[quizId];
  
  if (!quiz) {
    return `
      <section class="section">
        <div class="section-header">
          <p class="error">Quiz not found for ${chapter.id}</p>
          <a class="btn ghost" href="#/course/chapters/${chapter.slug}">Back to Lesson</a>
        </div>
      </section>
    `;
  }

  const activityProgress = progress.activities?.[quizId] || {};
  const bestScore = activityProgress.bestScore;
  const attemptCount = activityProgress.attemptCount || 0;
  const completed = activityProgress.completed || false;
  
  const index = chapters.findIndex((item) => item.id === chapter.id);
  const prev = index > 0 ? chapters[index - 1] : null;
  const next = index < chapters.length - 1 ? chapters[index + 1] : null;

  // Check for submitted result in session storage
  const sessionKey = `quiz_result_${quizId}`;
  const resultData = sessionStorage.getItem(sessionKey);
  
  if (resultData) {
    const result = JSON.parse(resultData);
    return renderQuizResult(chapter, quiz, result, prev, next, completed, attemptCount, bestScore);
  }

  return renderQuizQuestions(chapter, quiz, prev, next, completed, attemptCount, bestScore);
};

const renderQuizQuestions = (chapter, quiz, prev, next, completed, attemptCount, bestScore) => {
  return `
    <section class="section">
      <div class="section-header">
        <p class="eyebrow">Chapter ${chapter.id} · Quiz</p>
        <h1>Chapter Quiz: ${quiz.title}</h1>
        <p>Four-question checkpoint to confirm the lesson is locked.</p>
      </div>
      
      <div class="quiz-info">
        <div class="quiz-meta">
          <span><strong>Questions:</strong> 4</span>
          <span><strong>Score needed:</strong> Any score passes</span>
          <span><strong>Attempts:</strong> ${attemptCount}</span>
          ${bestScore !== null && bestScore !== undefined ? `<span><strong>Best:</strong> ${bestScore}%</span>` : ''}
        </div>
      </div>

      <form id="quiz-form" data-quiz-id="${quiz.activityId}">
        <div class="quiz-questions">
          ${quiz.questions.map((q, idx) => `
            <div class="question-card" data-question-id="${q.id}">
              <div class="question-header">
                <span class="question-number">Question ${idx + 1} of 4</span>
                ${q.scenario ? `<div class="question-scenario">${q.scenario}</div>` : ''}
              </div>
              <div class="question-stem">${q.stem}</div>
              <div class="choices">
                ${q.choices.map(choice => `
                  <label class="choice-item">
                    <input type="radio" name="${q.id}" value="${choice.id}" />
                    <span class="choice-label">${choice.label}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="quiz-submit">
          <button type="submit" class="btn primary" id="submit-quiz">Submit Quiz</button>
        </div>
      </form>

      <div class="quiz-nav">
        <a class="btn ghost" href="#/course/chapters/${chapter.slug}">Back to Lesson</a>
        ${prev ? `<a class="btn ghost" href="#/course/chapters/${prev.slug}">Previous: ${prev.id}</a>` : ''}
        ${next ? `<a class="btn ghost" href="#/course/chapters/${next.slug}">Next: ${next.id}</a>` : '<a class="btn ghost" href="#/course/drills">Go to Drills</a>'}
      </div>
    </section>
  `;
};

const renderQuizResult = (chapter, quiz, result, prev, next, completed, attemptCount, bestScore) => {
  const scorePercent = result.scorePercent;
  const correctCount = result.correctCount;
  const questionCount = result.questionCount;
  
  return `
    <section class="section">
      <div class="section-header">
        <p class="eyebrow">Chapter ${chapter.id} · Quiz Complete</p>
        <h1>Quiz Result: ${quiz.title}</h1>
      </div>

      <div class="quiz-result">
        <div class="result-score ${scorePercent >= 75 ? 'good' : scorePercent >= 50 ? 'okay' : 'needs-work'}">
          <div class="score-number">${scorePercent}%</div>
          <div class="score-label">${correctCount}/${questionCount} correct</div>
        </div>

        <div class="result-stats">
          <div class="stat">
            <span class="stat-label">Status</span>
            <span class="stat-value ${completed ? 'complete' : ''}">${completed ? 'Completed' : 'First attempt'}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Attempts</span>
            <span class="stat-value">${attemptCount}</span>
          </div>
          ${bestScore !== null && bestScore !== undefined ? `
          <div class="stat">
            <span class="stat-label">Best Score</span>
            <span class="stat-value">${bestScore}%</span>
          </div>
          ` : ''}
        </div>
      </div>

      <div class="quiz-review">
        <h2>Review Your Answers</h2>
        ${quiz.questions.map((q, idx) => {
          const userAnswer = result.answers[q.id];
          const isCorrect = userAnswer === q.correctChoiceId;
          return `
            <div class="review-card ${isCorrect ? 'correct' : 'incorrect'}">
              <div class="review-header">
                <span class="review-number">Question ${idx + 1}</span>
                <span class="review-status ${isCorrect ? 'correct' : 'incorrect'}">
                  ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              <div class="review-stem">${q.stem}</div>
              ${q.scenario ? `<div class="review-scenario">${q.scenario}</div>` : ''}
              <div class="review-answers">
                <div class="your-answer ${isCorrect ? 'correct' : 'incorrect'}">
                  <strong>Your answer:</strong> ${q.choices.find(c => c.id === userAnswer)?.label || 'Not answered'}
                </div>
                ${!isCorrect ? `
                  <div class="correct-answer">
                    <strong>Correct answer:</strong> ${q.choices.find(c => c.id === q.correctChoiceId)?.label}
                  </div>
                ` : ''}
              </div>
              <div class="explanation">
                <strong>Explanation:</strong> ${q.explanation}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="result-actions">
        <button class="btn primary" data-retake-quiz="${quiz.activityId}" data-chapter="${chapter.slug}">
          Retake Quiz
        </button>
        <a class="btn ghost" href="#/course/chapters/${chapter.slug}">Back to Lesson</a>
        ${next ? `<a class="btn primary" href="#/course/chapters/${next.slug}">Next Chapter: ${next.id}</a>` : '<a class="btn primary" href="#/course/drills">Go to Drills</a>'}
        <a class="btn ghost" href="#/course/progress">View Progress</a>
      </div>
    </section>
  `;
};

const getResultBand = (scorePercent, bands = []) => {
  return bands.find((band) => scorePercent >= band.minPercent && scorePercent <= band.maxPercent) || null;
};

const renderDrillQuiz = (drill) => {
  const progress = loadProgress();
  const drillQuiz = quizData[drill.id];

  if (!drillQuiz) {
    return `
      <section class="section">
        <div class="section-header">
          <p class="error">Drill quiz not found for ${drill.id}</p>
          <a class="btn ghost" href="#/course/drills">Back to Drills</a>
        </div>
      </section>
    `;
  }

  const activityProgress = progress.activities?.[drill.id] || {};
  const bestScore = activityProgress.bestScore;
  const attemptCount = activityProgress.attemptCount || 0;
  const completed = activityProgress.completed || false;
  const passed = activityProgress.passed;

  const index = drills.findIndex((item) => item.id === drill.id);
  const prev = index > 0 ? drills[index - 1] : null;
  const next = index < drills.length - 1 ? drills[index + 1] : null;

  const sessionKey = `drill_result_${drill.id}`;
  const resultData = sessionStorage.getItem(sessionKey);

  if (resultData) {
    const result = JSON.parse(resultData);
    return renderDrillResult(drill, drillQuiz, result, prev, next, completed, attemptCount, bestScore, passed);
  }

  return renderDrillQuestions(drill, drillQuiz, prev, next, completed, attemptCount, bestScore, passed);
};

const renderDrillQuestions = (drill, quiz, prev, next, completed, attemptCount, bestScore, passed) => {
  const navMode = quiz.navigationMode || 'onePerPage';
  const questionCount = quiz.questions.length;
  const timer = quiz.timer;
  const storedIndex = Number(sessionStorage.getItem(`drill_index_${drill.id}`));
  const startIndex = Number.isFinite(storedIndex)
    ? Math.min(Math.max(storedIndex, 0), questionCount - 1)
    : 0;

  return `
    <section class="section drill-section">
      <div class="section-header">
        <p class="eyebrow">Drill ${drill.id}</p>
        <h1>${drill.title}</h1>
        <p>${drill.subtitle}</p>
      </div>

      <div class="quiz-info">
        <div class="quiz-meta">
          <span><strong>Questions:</strong> ${questionCount}</span>
          <span><strong>Mode:</strong> ${navMode === 'autoAdvance' ? 'Auto-advance' : 'Scenario drill'}</span>
          ${quiz.scoringMode === 'bandedAssessment'
            ? `<span><strong>Pass band:</strong> ${quiz.passingScorePercent}%+</span>`
            : '<span><strong>Score:</strong> Accuracy</span>'}
          <span><strong>Attempts:</strong> ${attemptCount}</span>
          ${bestScore !== null && bestScore !== undefined ? `<span><strong>Best:</strong> ${bestScore}%</span>` : ''}
          ${passed !== undefined && passed !== null ? `<span><strong>Status:</strong> ${passed ? 'Passed' : 'Not passed'}</span>` : ''}
        </div>
      </div>

      <div class="drill-progress" data-drill-progress>
        <span>Question <strong data-drill-current>${startIndex + 1}</strong> of ${questionCount}</span>
        ${timer?.enabled ? `<span class="drill-timer" data-drill-timer>Time left: ${timer.durationSeconds}s</span>` : ''}
      </div>

      <form
        id="drill-form"
        data-quiz-id="${quiz.activityId}"
        data-nav-mode="${navMode}"
        data-question-count="${questionCount}"
        data-start-index="${startIndex}"
        ${timer?.enabled ? `data-timer-seconds="${timer.durationSeconds}" data-auto-submit="${timer.autoSubmitOnExpire ? 'true' : 'false'}"` : ''}
      >
        <div class="quiz-questions">
          ${quiz.questions.map((q, idx) => `
            <div class="question-card ${navMode === 'allAtOnce' ? '' : 'is-hidden'}" data-question-id="${q.id}" data-question-index="${idx}">
              <div class="question-header">
                <span class="question-number">Question ${idx + 1} of ${questionCount}</span>
                ${q.scenario ? `<div class="question-scenario">${q.scenario}</div>` : ''}
              </div>
              <div class="question-stem">${q.stem}</div>
              <div class="choices">
                ${q.choices.map(choice => `
                  <label class="choice-item">
                    <input type="radio" name="${q.id}" value="${choice.id}" />
                    <span class="choice-label">${choice.label}</span>
                  </label>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="quiz-submit drill-submit">
          ${navMode === 'onePerPage' ? '<button type="button" class="btn ghost" data-drill-prev>Previous</button>' : ''}
          ${navMode === 'onePerPage' ? '<button type="button" class="btn ghost" data-drill-next>Next</button>' : ''}
          <button type="submit" class="btn primary">Finish Drill</button>
        </div>
      </form>

      <div class="quiz-nav">
        <a class="btn ghost" href="#/course/drills">Back to Drills</a>
        ${prev ? `<a class="btn ghost" href="#/course/drills/${prev.slug}">Previous: ${prev.id}</a>` : ''}
        ${next ? `<a class="btn ghost" href="#/course/drills/${next.slug}">Next: ${next.id}</a>` : '<a class="btn ghost" href="#/course/progress">View Progress</a>'}
      </div>
    </section>
  `;
};

const renderDrillResult = (drill, quiz, result, prev, next, completed, attemptCount, bestScore, passed) => {
  const scorePercent = result.scorePercent;
  const correctCount = result.correctCount;
  const questionCount = result.questionCount;
  const resultBand = result.resultBand || getResultBand(scorePercent, quiz.resultBands || []);
  const metrics = result.metrics || {};

  return `
    <section class="section">
      <div class="section-header">
        <p class="eyebrow">Drill ${drill.id} · Complete</p>
        <h1>${quiz.title} Result</h1>
      </div>

      <div class="quiz-result">
        <div class="result-score ${scorePercent >= 75 ? 'good' : scorePercent >= 50 ? 'okay' : 'needs-work'}">
          <div class="score-number">${scorePercent}%</div>
          <div class="score-label">${correctCount}/${questionCount} correct</div>
        </div>

        <div class="result-stats">
          <div class="stat">
            <span class="stat-label">Status</span>
            <span class="stat-value ${completed ? 'complete' : ''}">${completed ? 'Completed' : 'First attempt'}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Attempts</span>
            <span class="stat-value">${attemptCount}</span>
          </div>
          ${bestScore !== null && bestScore !== undefined ? `
          <div class="stat">
            <span class="stat-label">Best Score</span>
            <span class="stat-value">${bestScore}%</span>
          </div>
          ` : ''}
          ${quiz.scoringMode === 'bandedAssessment' && resultBand ? `
          <div class="stat">
            <span class="stat-label">Band</span>
            <span class="stat-value">${resultBand.label}</span>
          </div>
          ` : ''}
          ${quiz.scoringMode === 'bandedAssessment' ? `
          <div class="stat">
            <span class="stat-label">Pass</span>
            <span class="stat-value ${passed ? 'complete' : ''}">${passed ? 'Yes' : 'No'}</span>
          </div>
          ` : ''}
        </div>
      </div>

      ${quiz.scoringMode === 'accuracyWithTiming' && metrics.totalElapsedMs ? `
        <div class="quiz-meta timing-meta">
          <span><strong>Total time:</strong> ${(metrics.totalElapsedMs / 1000).toFixed(1)}s</span>
          ${metrics.averageResponseMs ? `<span><strong>Avg response:</strong> ${(metrics.averageResponseMs / 1000).toFixed(1)}s</span>` : ''}
        </div>
      ` : ''}

      <div class="quiz-review">
        <h2>Review Your Answers</h2>
        ${quiz.questions.map((q, idx) => {
          const userAnswer = result.answers[q.id];
          const isCorrect = userAnswer === q.correctChoiceId;
          return `
            <div class="review-card ${isCorrect ? 'correct' : 'incorrect'}">
              <div class="review-header">
                <span class="review-number">Question ${idx + 1}</span>
                <span class="review-status ${isCorrect ? 'correct' : 'incorrect'}">
                  ${isCorrect ? '✓ Correct' : '✗ Incorrect'}
                </span>
              </div>
              <div class="review-stem">${q.stem}</div>
              ${q.scenario ? `<div class="review-scenario">${q.scenario}</div>` : ''}
              <div class="review-answers">
                <div class="your-answer ${isCorrect ? 'correct' : 'incorrect'}">
                  <strong>Your answer:</strong> ${q.choices.find(c => c.id === userAnswer)?.label || 'Not answered'}
                </div>
                ${!isCorrect ? `
                  <div class="correct-answer">
                    <strong>Correct answer:</strong> ${q.choices.find(c => c.id === q.correctChoiceId)?.label}
                  </div>
                ` : ''}
              </div>
              <div class="explanation">
                <strong>Explanation:</strong> ${q.explanation}
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <div class="result-actions">
        <button class="btn primary" data-retake-drill="${quiz.activityId}" data-drill="${drill.slug}">
          Retry Drill
        </button>
        <a class="btn ghost" href="#/course/drills">Back to Drills</a>
        ${next ? `<a class="btn primary" href="#/course/drills/${next.slug}">Next Drill: ${next.id}</a>` : '<a class="btn primary" href="#/course/progress">View Progress</a>'}
        <a class="btn ghost" href="#/course/badges">View Badges</a>
      </div>
    </section>
  `;
};

const renderDrillPage = (drill) => renderDrillQuiz(drill);

let drillTimerInterval;

const setDrillQuestionIndex = (form, index) => {
  const total = Number(form.dataset.questionCount || 0);
  const navMode = form.dataset.navMode || 'onePerPage';
  const newIndex = Math.min(Math.max(index, 0), Math.max(total - 1, 0));
  form.dataset.currentIndex = String(newIndex);
  sessionStorage.setItem(`drill_index_${form.dataset.quizId}`, String(newIndex));

  form.querySelectorAll('.question-card').forEach((card) => {
    const cardIndex = Number(card.dataset.questionIndex || 0);
    if (navMode === 'allAtOnce') {
      card.classList.remove('is-hidden');
      return;
    }
    card.classList.toggle('is-hidden', cardIndex !== newIndex);
  });

  const section = form.closest('.drill-section');
  const currentLabel = section?.querySelector('[data-drill-current]');
  if (currentLabel) currentLabel.textContent = String(newIndex + 1);

  const prevButton = form.querySelector('[data-drill-prev]');
  const nextButton = form.querySelector('[data-drill-next]');
  if (prevButton) prevButton.disabled = newIndex === 0;
  if (nextButton) nextButton.disabled = newIndex >= total - 1;
};

const initDrillNavigation = (form) => {
  const navMode = form.dataset.navMode || 'onePerPage';
  if (navMode === 'allAtOnce') {
    return;
  }

  const startIndex = Number(form.dataset.startIndex || 0);
  setDrillQuestionIndex(form, startIndex);

  const prevButton = form.querySelector('[data-drill-prev]');
  const nextButton = form.querySelector('[data-drill-next]');

  if (prevButton) {
    prevButton.addEventListener('click', () => {
      const currentIndex = Number(form.dataset.currentIndex || 0);
      setDrillQuestionIndex(form, currentIndex - 1);
    });
  }

  if (nextButton) {
    nextButton.addEventListener('click', () => {
      const currentIndex = Number(form.dataset.currentIndex || 0);
      const currentCard = form.querySelector(`.question-card[data-question-index="${currentIndex}"]`);
      const currentQuestionId = currentCard?.dataset.questionId;
      const selected = currentQuestionId
        ? form.querySelector(`input[name="${currentQuestionId}"]:checked`)
        : null;
      if (!selected) {
        alert('Choose an answer before moving on.');
        return;
      }
      setDrillQuestionIndex(form, currentIndex + 1);
    });
  }

  if (navMode === 'autoAdvance') {
    form.addEventListener('change', (event) => {
      if (event.target?.matches('input[type="radio"]')) {
        const currentIndex = Number(form.dataset.currentIndex || 0);
        const total = Number(form.dataset.questionCount || 0);
        if (currentIndex >= total - 1) {
          handleDrillSubmit(form, { completionReason: 'finished' });
        } else {
          setTimeout(() => setDrillQuestionIndex(form, currentIndex + 1), 150);
        }
      }
    });
  }
};

const initDrillTimer = (form) => {
  const timerSeconds = Number(form.dataset.timerSeconds || 0);
  if (!timerSeconds) return;

  if (drillTimerInterval) {
    clearInterval(drillTimerInterval);
  }

  const timerKey = `drill_timer_${form.dataset.quizId}`;
  let startedAt = Number(sessionStorage.getItem(timerKey));
  if (!startedAt) {
    startedAt = Date.now();
    sessionStorage.setItem(timerKey, String(startedAt));
  }

  const timerDisplay = form.closest('.drill-section')?.querySelector('[data-drill-timer]');
  const autoSubmit = form.dataset.autoSubmit === 'true';

  drillTimerInterval = setInterval(() => {
    const elapsedMs = Date.now() - startedAt;
    const remainingMs = Math.max(timerSeconds * 1000 - elapsedMs, 0);
    if (timerDisplay) {
      timerDisplay.textContent = `Time left: ${Math.ceil(remainingMs / 1000)}s`;
    }
    if (remainingMs <= 0) {
      clearInterval(drillTimerInterval);
      drillTimerInterval = null;
      if (autoSubmit) {
        handleDrillSubmit(form, { completionReason: 'timerExpired' });
      }
    }
  }, 250);
};

const attachEventHandlers = () => {
  // Quiz form submission
  const quizForm = document.getElementById('quiz-form');
  if (quizForm) {
    quizForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleQuizSubmit(quizForm);
    });
  }

  // Drill form submission
  const drillForm = document.getElementById('drill-form');
  if (drillForm) {
    initDrillNavigation(drillForm);
    initDrillTimer(drillForm);
    drillForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleDrillSubmit(drillForm, { completionReason: 'finished' });
    });
  }

  // Retake quiz buttons
  document.querySelectorAll('[data-retake-quiz]').forEach((button) => {
    button.addEventListener('click', () => {
      const quizId = button.dataset.retakeQuiz;
      const chapterSlug = button.dataset.chapter;
      sessionStorage.removeItem(`quiz_result_${quizId}`);
      window.location.hash = `#/course/chapters/${chapterSlug}/quiz`;
    });
  });

  // Retake drill buttons
  document.querySelectorAll('[data-retake-drill]').forEach((button) => {
    button.addEventListener('click', () => {
      const drillId = button.dataset.retakeDrill;
      const drillSlug = button.dataset.drill;
      sessionStorage.removeItem(`drill_result_${drillId}`);
      sessionStorage.removeItem(`drill_index_${drillId}`);
      sessionStorage.removeItem(`drill_timer_${drillId}`);
      window.location.hash = `#/course/drills/${drillSlug}`;
    });
  });
};

const handleQuizSubmit = (form) => {
  const quizId = form.dataset.quizId;
  const quiz = quizData[quizId];
  const chapterId = quiz.chapterId;
  
  // Collect answers
  const answers = {};
  let allAnswered = true;
  
  quiz.questions.forEach(q => {
    const selected = form.querySelector(`input[name="${q.id}"]:checked`);
    if (selected) {
      answers[q.id] = selected.value;
    } else {
      allAnswered = false;
    }
  });

  if (!allAnswered) {
    alert('Please answer all questions before submitting.');
    return;
  }

  // Calculate score
  let correctCount = 0;
  quiz.questions.forEach(q => {
    if (answers[q.id] === q.correctChoiceId) {
      correctCount++;
    }
  });

  const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
  const submittedAt = new Date().toISOString();
  const attemptId = `att_${chapterId.toLowerCase()}_${Date.now()}`;

  // Initialize progress structure if needed
  const progress = loadProgress();
  if (!progress.activities) progress.activities = {};
  if (!progress.attempts) progress.attempts = {};
  if (!progress.lessons) progress.lessons = {};

  // Get current activity progress
  const activityProgress = progress.activities[quizId] || {
    activityId: quizId,
    type: 'chapterQuiz',
    parentId: chapterId,
    attemptCount: 0,
    completed: false
  };

  const previousBestScore = activityProgress.bestScore;
  let bestScoreImprovedBy = null;

  // Check if first completion
  const isFirstCompletion = !activityProgress.completed;

  // Update activity progress
  activityProgress.latestAttemptAt = submittedAt;
  activityProgress.attemptCount = (activityProgress.attemptCount || 0) + 1;
  activityProgress.latestScore = scorePercent;
  
  if (!activityProgress.firstAttemptAt) {
    activityProgress.firstAttemptAt = submittedAt;
  }
  
  if (isFirstCompletion) {
    activityProgress.completed = true;
    activityProgress.completedAt = submittedAt;
  }
  
  // Update best score
  if (activityProgress.bestScore === undefined || scorePercent > activityProgress.bestScore) {
    if (previousBestScore !== undefined && scorePercent > previousBestScore) {
      bestScoreImprovedBy = scorePercent - previousBestScore;
    }
    activityProgress.bestScore = scorePercent;
    activityProgress.bestAttemptId = attemptId;
  }
  
  activityProgress.latestAttemptId = attemptId;

  // Save activity progress
  progress.activities[quizId] = activityProgress;

  // Mirror lesson completion
  progress.lessons[chapterId] = progress.lessons[chapterId] || { lessonId: chapterId };
  progress.lessons[chapterId].completed = activityProgress.completed;
  progress.lessons[chapterId].completedAt = activityProgress.completedAt;
  progress.lessons[chapterId].linkedQuizActivityId = quizId;

  // Mark chapter complete in main progress
  progress.completed[chapterId] = activityProgress.completed;

  // Create attempt record
  const attemptRecord = {
    attemptId,
    activityId: quizId,
    activityType: 'chapterQuiz',
    submittedAt,
    completionReason: 'submitted',
    answers,
    correctCount,
    questionCount: quiz.questions.length,
    scorePercent
  };

  if (!progress.attempts[quizId]) {
    progress.attempts[quizId] = [];
  }
  progress.attempts[quizId].push(attemptRecord);

  // Keep only latest 5 attempts
  if (progress.attempts[quizId].length > 5) {
    progress.attempts[quizId] = progress.attempts[quizId].slice(-5);
  }

  updateSummary(progress);
  updateBadges(progress, { latestAttempt: attemptRecord, bestScoreImprovedBy });

  saveProgress(progress);

  // Store result for display
  const resultData = {
    scorePercent,
    correctCount,
    questionCount: quiz.questions.length,
    answers,
    attemptId,
    submittedAt
  };
  sessionStorage.setItem(`quiz_result_${quizId}`, JSON.stringify(resultData));

  // Re-render to show results
  render();
};

const handleDrillSubmit = (form, { completionReason = 'finished' } = {}) => {
  const drillId = form.dataset.quizId;
  const quiz = quizData[drillId];
  if (!quiz) return;

  const allowIncomplete = completionReason === 'timerExpired';
  const answers = {};
  let allAnswered = true;

  quiz.questions.forEach((q) => {
    const selected = form.querySelector(`input[name="${q.id}"]:checked`);
    if (selected) {
      answers[q.id] = selected.value;
    } else {
      allAnswered = false;
    }
  });

  if (!allAnswered && !allowIncomplete) {
    alert('Please answer all questions before finishing the drill.');
    return;
  }

  let correctCount = 0;
  quiz.questions.forEach((q) => {
    if (answers[q.id] === q.correctChoiceId) {
      correctCount++;
    }
  });

  const scorePercent = Math.round((correctCount / quiz.questions.length) * 100);
  const submittedAt = new Date().toISOString();
  const attemptId = `att_${drillId.toLowerCase()}_${Date.now()}`;

  const progress = loadProgress();
  if (!progress.activities) progress.activities = {};
  if (!progress.attempts) progress.attempts = {};
  if (!progress.completed) progress.completed = {};
  if (!progress.scores) progress.scores = {};

  const activityProgress = progress.activities[drillId] || {
    activityId: drillId,
    type: 'drill',
    attemptCount: 0,
    completed: false
  };

  const previousBestScore = activityProgress.bestScore;
  let bestScoreImprovedBy = null;

  const isFirstCompletion = !activityProgress.completed;
  activityProgress.latestAttemptAt = submittedAt;
  activityProgress.attemptCount = (activityProgress.attemptCount || 0) + 1;
  activityProgress.latestScore = scorePercent;
  activityProgress.latestAttemptId = attemptId;

  if (!activityProgress.firstAttemptAt) {
    activityProgress.firstAttemptAt = submittedAt;
  }

  if (isFirstCompletion) {
    activityProgress.completed = true;
    activityProgress.completedAt = submittedAt;
  }

  if (activityProgress.bestScore === undefined || scorePercent > activityProgress.bestScore) {
    if (previousBestScore !== undefined && scorePercent > previousBestScore) {
      bestScoreImprovedBy = scorePercent - previousBestScore;
    }
    activityProgress.bestScore = scorePercent;
    activityProgress.bestAttemptId = attemptId;
  }

  let resultBand = null;
  let passed = null;
  if (quiz.scoringMode === 'bandedAssessment') {
    resultBand = getResultBand(scorePercent, quiz.resultBands || []);
    passed = scorePercent >= (quiz.passingScorePercent ?? 0);
    activityProgress.passed = passed;
    if (passed && !activityProgress.passedAt) {
      activityProgress.passedAt = submittedAt;
    }
  }

  const timerKey = `drill_timer_${drillId}`;
  const startedAt = Number(sessionStorage.getItem(timerKey));
  const metrics = {};
  if (startedAt) {
    const totalElapsedMs = Date.now() - startedAt;
    const answeredCount = Object.keys(answers).length || quiz.questions.length;
    metrics.totalElapsedMs = totalElapsedMs;
    metrics.averageResponseMs = Math.round(totalElapsedMs / answeredCount);
  }

  activityProgress.latestMetrics = Object.keys(metrics).length ? metrics : undefined;
  if (activityProgress.bestScore === scorePercent && Object.keys(metrics).length) {
    const previousBestMetrics = activityProgress.bestMetrics;
    const hasFasterAverage =
      previousBestMetrics?.averageResponseMs === undefined ||
      metrics.averageResponseMs < previousBestMetrics.averageResponseMs;
    if (!previousBestMetrics || hasFasterAverage) {
      activityProgress.bestMetrics = metrics;
    }
  }

  progress.activities[drillId] = activityProgress;
  progress.completed[drillId] = true;

  const attemptRecord = {
    attemptId,
    activityId: drillId,
    activityType: 'drill',
    submittedAt,
    completionReason,
    answers,
    correctCount,
    questionCount: quiz.questions.length,
    scorePercent,
    passed,
    resultBandKey: resultBand?.key,
    metrics: Object.keys(metrics).length ? metrics : undefined
  };

  if (!progress.attempts[drillId]) {
    progress.attempts[drillId] = [];
  }
  progress.attempts[drillId].push(attemptRecord);
  if (progress.attempts[drillId].length > 5) {
    progress.attempts[drillId] = progress.attempts[drillId].slice(-5);
  }

  updateSummary(progress);
  updateBadges(progress, { latestAttempt: attemptRecord, bestScoreImprovedBy });

  saveProgress(progress);

  const resultData = {
    scorePercent,
    correctCount,
    questionCount: quiz.questions.length,
    answers,
    attemptId,
    submittedAt,
    passed,
    resultBand,
    metrics,
    completionReason
  };

  sessionStorage.setItem(`drill_result_${drillId}`, JSON.stringify(resultData));
  sessionStorage.removeItem(`drill_index_${drillId}`);
  sessionStorage.removeItem(`drill_timer_${drillId}`);

  render();
};

const render = () => {
  const route = getRoute();

  if (route === '/') {
    window.location.hash = '#/course';
    return;
  }

  if (route === '/course') {
    renderLayout(renderCourseOverview(), route);
    return;
  }

  if (route === '/course/chapters') {
    renderLayout(renderChaptersIndex(), route);
    return;
  }

  if (route === '/course/drills') {
    renderLayout(renderDrillsIndex(), route);
    return;
  }

  if (route === '/course/progress') {
    renderLayout(renderProgressPage(), route);
    return;
  }

  if (route === '/course/badges') {
    renderLayout(renderBadgesPage(), route);
    return;
  }

  if (route.startsWith('/course/chapters/')) {
    const parts = route.split('/').filter(Boolean);
    const slug = parts[2];
    const isQuiz = parts[3] === 'quiz';
    const chapter = getChapterBySlug(slug);
    if (!chapter) {
      renderLayout('<p class="error">Chapter not found.</p>', route);
      return;
    }
    renderLayout(isQuiz ? renderChapterQuiz(chapter) : renderChapterLesson(chapter), route);
    return;
  }

  if (route.startsWith('/course/drills/')) {
    const slug = route.split('/')[3];
    const drill = getDrillBySlug(slug);
    if (!drill) {
      renderLayout('<p class="error">Drill not found.</p>', route);
      return;
    }
    renderLayout(renderDrillPage(drill), route);
    return;
  }

  renderLayout('<p class="error">Page not found.</p>', route);
};

window.addEventListener('hashchange', render);
render();
