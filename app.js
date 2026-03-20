/* ============================================================
   CodeMentor AI – app.js
   Full application logic: state management, AI mentor engine,
   charts, memory persistence, problem recommendations.
   ============================================================ */

'use strict';

// ============================================================
// DEFAULT MEMORY STATE
// ============================================================
const DEFAULT_MEMORY = {
  student: {
    name: 'Arjun Kumar',
    level: 'Intermediate',
    lang: 'Python',
    streak: 12,
    joinDate: '2024-09-01'
  },
  performance: {
    solved: 87,
    correct: 33,
    wrong: 31,
    tle: 14,
    runtimeError: 9,
    avgTime: 24,
    firstTryRate: 38,
    weeklyTarget: 10,
    weeklySolved: 6
  },
  readiness: 63,
  topicScores: {
    'Arrays': 78,
    'Strings': 70,
    'Binary Search': 65,
    'Trees': 55,
    'Graphs': 40,
    'Dynamic Programming': 32,
    'Backtracking': 48,
    'Greedy': 60
  },
  mistakes: [
    { text: 'Misses edge cases (empty array, single element)', count: 23, color: '#ef4444' },
    { text: 'Wrong base case in recursion/DP', count: 18, color: '#f59e0b' },
    { text: 'Off-by-one index errors', count: 14, color: '#8b5cf6' },
    { text: 'Incorrect time complexity (brute force)', count: 11, color: '#06b6d4' },
    { text: 'TLE on large inputs – no optimization', count: 9, color: '#10b981' }
  ],
  languages: [
    { name: 'Python', pct: 65, color: '#8b5cf6' },
    { name: 'C++', pct: 25, color: '#06b6d4' },
    { name: 'JavaScript', pct: 10, color: '#f59e0b' }
  ],
  history: [
    { date: '2024-09-10', event: 'Started Array mastery module', type: 'start' },
    { date: '2024-10-05', event: 'Completed 30 problems — first milestone!', type: 'milestone' },
    { date: '2024-11-12', event: 'Improved avg solve time by 8 minutes', type: 'improvement' },
    { date: '2024-12-01', event: 'Began Graphs & Trees track', type: 'start' },
    { date: '2025-01-20', event: 'Solved first Hard problem (LRU Cache)', type: 'milestone' },
    { date: '2025-02-15', event: 'First-try accuracy rose from 28%→38%', type: 'improvement' },
    { date: '2025-03-10', event: 'Started DP foundations – ongoing struggle', type: 'note' },
    { date: '2025-03-20', event: 'Current 12-day streak (personal best)', type: 'milestone' }
  ],
  weeklyActivity: {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    correct: [2, 1, 3, 2, 1, 2, 0],
    wrong: [1, 2, 0, 1, 2, 0, 1],
    tle: [0, 1, 1, 0, 0, 1, 0]
  },
  recentSubmissions: [
    { name: 'Coin Change', topic: 'DP', result: 'wrong', diff: 'Medium', time: 38 },
    { name: 'Number of Islands', topic: 'Graph', result: 'correct', diff: 'Medium', time: 22 },
    { name: 'LCS', topic: 'DP', result: 'tle', diff: 'Medium', time: 45 },
    { name: 'Valid Parentheses', topic: 'String', result: 'correct', diff: 'Easy', time: 8 },
    { name: 'Word Break', topic: 'DP', result: 'wrong', diff: 'Hard', time: 55 },
    { name: 'Binary Tree Level Order', topic: 'Tree', result: 'correct', diff: 'Medium', time: 18 }
  ]
};

// ============================================================
// PROBLEM BANK (AI recommended)
// ============================================================
const PROBLEM_BANK = [
  {
    id: 1, title: 'Climbing Stairs', difficulty: 'easy', topic: 'dp',
    desc: 'Classic DP intro. Identify overlapping subproblems and memoize. Perfect for building DP intuition from scratch.',
    tags: ['DP', 'Memoization', 'Fibonacci'],
    reason: 'Targets your DP weakness with a gentle start',
    aiWeight: 98
  },
  {
    id: 2, title: 'Coin Change', difficulty: 'medium', topic: 'dp',
    desc: "You\'ve attempted this but got it wrong. Try the bottom-up tabulation approach this time. Focus on your base case setup.",
    tags: ['DP', 'Bottom-up', 'Unbounded Knapsack'],
    reason: 'Recurring mistake: wrong base case',
    aiWeight: 97
  },
  {
    id: 3, title: 'Longest Common Subsequence', difficulty: 'medium', topic: 'dp',
    desc: '2D DP table problem. Your TLE on this suggests O(2^n) recursion. Build the dp[][] grid iteratively.',
    tags: ['DP', '2D Table', 'String'],
    reason: 'You got TLE — optimization fix needed',
    aiWeight: 95
  },
  {
    id: 4, title: 'Number of Provinces', difficulty: 'medium', topic: 'graph',
    desc: 'Union-Find or DFS on adjacency matrix. Great for solidifying graph traversal on connected components.',
    tags: ['Graph', 'Union-Find', 'DFS'],
    reason: 'Reinforces Graph (your 2nd weakest topic)',
    aiWeight: 90
  },
  {
    id: 5, title: 'Course Schedule II', difficulty: 'medium', topic: 'graph',
    desc: 'Topological sort. Detect cycle + find ordering. Builds on your Number of Islands knowledge.',
    tags: ['Graph', 'Topological Sort', 'BFS'],
    reason: 'Bridges Graphs with real-world problems',
    aiWeight: 88
  },
  {
    id: 6, title: 'House Robber', difficulty: 'medium', topic: 'dp',
    desc: 'Linear DP. Classic state machine pattern: rob or skip. Excellent for understanding DP state transitions.',
    tags: ['DP', '1D Array', 'State Machine'],
    reason: 'Builds DP state transition intuition',
    aiWeight: 92
  },
  {
    id: 7, title: 'Subsets', difficulty: 'medium', topic: 'array',
    desc: 'Backtracking or bit masking. Common interview problem. You\'ve been avoiding backtracking — face it here!',
    tags: ['Backtracking', 'Bit Masking', 'Array'],
    reason: 'Addresses backtracking avoidance pattern',
    aiWeight: 85
  },
  {
    id: 8, title: 'Search in Rotated Array', difficulty: 'medium', topic: 'array',
    desc: 'Modified binary search. You\'re decent at Binary Search (65%) — this stretches it. Watch the mid calculation boundary.',
    tags: ['Binary Search', 'Array', 'Two Pointers'],
    reason: 'Builds on existing Binary Search strength',
    aiWeight: 82
  },
  {
    id: 9, title: 'Decode Ways', difficulty: 'medium', topic: 'dp',
    desc: 'DP on string parsing. Similar to climbing stairs but with conditional transitions. Watch the "00" edge case.',
    tags: ['DP', 'String', 'Counting'],
    reason: 'Edge case training + DP string patterns',
    aiWeight: 89
  },
  {
    id: 10, title: 'Word Ladder', difficulty: 'hard', topic: 'graph',
    desc: 'BFS shortest path in an implicit graph. Advanced problem for when you reach 70%+ graph score.',
    tags: ['BFS', 'Graph', 'Hard', 'String'],
    reason: 'Stretch goal for your graph mastery',
    aiWeight: 78
  },
  {
    id: 11, title: 'Binary Tree Max Path Sum', difficulty: 'hard', topic: 'tree',
    desc: 'Post-order traversal with global max tracking. Your Trees score (55%) makes this the right challenge.',
    tags: ['Tree', 'DFS', 'Hard'],
    reason: 'Pushes your tree comprehension further',
    aiWeight: 80
  },
  {
    id: 12, title: 'Valid Sudoku', difficulty: 'medium', topic: 'array',
    desc: 'Uses hash sets for validation. Great for practicing structured constraint checking without backtracking.',
    tags: ['Array', 'Hash Set', 'Matrix'],
    reason: 'Medium difficulty refresher for Arrays (78%)',
    aiWeight: 75
  }
];

// ============================================================
// STATE
// ============================================================
let memory = JSON.parse(localStorage.getItem('cm_memory') || 'null') || JSON.parse(JSON.stringify(DEFAULT_MEMORY));
let chatHistory = [];

// ============================================================
// UTILITIES
// ============================================================
function saveMemory() {
  localStorage.setItem('cm_memory', JSON.stringify(memory));
}

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.style.borderColor = type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)';
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').substring(0, 2).toUpperCase();
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

// ============================================================
// NAVIGATION
// ============================================================
function switchView(viewId) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('view' + viewId.charAt(0).toUpperCase() + viewId.slice(1))?.classList.add('active');
  document.getElementById('nav' + viewId.charAt(0).toUpperCase() + viewId.slice(1))?.classList.add('active');

  // Lazy init
  if (viewId === 'dashboard') { initDashboard(); }
  if (viewId === 'mentor') { initMentorContext(); }
  if (viewId === 'problems') { renderProblems(); }
  if (viewId === 'progress') { initProgress(); }
  if (viewId === 'memory') { initMemoryView(); }
}

document.querySelectorAll('.nav-item').forEach(btn => {
  btn.addEventListener('click', () => switchView(btn.dataset.view));
});

// ============================================================
// DASHBOARD
// ============================================================
let activityChart = null;
let radarChart = null;

function initDashboard() {
  // Update profile sidebar
  document.getElementById('avatarEl').textContent = getInitials(memory.student.name);
  document.getElementById('profileName').textContent = memory.student.name;
  document.getElementById('profileLevel').textContent = memory.student.level;
  document.getElementById('statSolved').textContent = memory.performance.solved;
  document.getElementById('statStreak').textContent = memory.student.streak;
  const acc = Math.round((memory.performance.correct / memory.performance.solved) * 100);
  document.getElementById('statAccuracy').textContent = acc + '%';

  // KPIs
  document.getElementById('kpiSolved').textContent = memory.performance.solved;
  document.getElementById('kpiTime').textContent = memory.performance.avgTime + 'm';
  document.getElementById('kpiCorrect').textContent = memory.performance.firstTryRate + '%';
  document.getElementById('kpiStreak').textContent = memory.student.streak + ' days';

  // Readiness
  const score = memory.readiness;
  document.getElementById('readinessScore').textContent = score;
  document.getElementById('readinessFill').style.width = score + '%';
  document.getElementById('readinessLabel').textContent =
    score < 40 ? 'Keep Practicing 💡' :
    score < 60 ? 'Getting There 🚀' :
    score < 80 ? 'Looking Good! 🎯' : 'Interview Ready! 🏆';

  renderMistakes();
  renderSubmissions();
  renderActivityChart();
  renderRadarChart();
}

function renderMistakes() {
  const list = document.getElementById('mistakeList');
  const maxCount = Math.max(...memory.mistakes.map(m => m.count));
  list.innerHTML = memory.mistakes.map(m => `
    <div class="mistake-item" style="border-left-color:${m.color}">
      <div class="mistake-bar-wrap">
        <div class="mistake-label">${m.text}</div>
        <div class="mistake-bar" style="width:${(m.count/maxCount)*100}%;background:${m.color}20;border:1px solid ${m.color}50"></div>
      </div>
      <span class="mistake-count" style="color:${m.color}">${m.count}×</span>
    </div>
  `).join('');
  // Animate bars
  setTimeout(() => {
    list.querySelectorAll('.mistake-bar').forEach((bar, i) => {
      bar.style.width = (memory.mistakes[i].count / maxCount * 100) + '%';
    });
  }, 50);
}

function renderSubmissions() {
  const list = document.getElementById('submissionList');
  const statusConfig = {
    correct: { color: '#10b981', label: 'AC', bgColor: 'rgba(16,185,129,0.1)' },
    wrong: { color: '#ef4444', label: 'WA', bgColor: 'rgba(239,68,68,0.1)' },
    tle: { color: '#f59e0b', label: 'TLE', bgColor: 'rgba(245,158,11,0.1)' },
    runtime: { color: '#8b5cf6', label: 'RE', bgColor: 'rgba(139,92,246,0.1)' }
  };
  list.innerHTML = memory.recentSubmissions.map(s => {
    const cfg = statusConfig[s.result] || statusConfig.wrong;
    return `
      <div class="sub-item">
        <div class="sub-status" style="background:${cfg.color};box-shadow:0 0 6px ${cfg.color}60"></div>
        <div class="sub-name">${s.name}</div>
        <span class="sub-meta">${s.time}m</span>
        <span class="sub-tag" style="background:${cfg.bgColor};color:${cfg.color}">${cfg.label}</span>
      </div>
    `;
  }).join('');
}

function renderActivityChart() {
  const ctx = document.getElementById('activityChart').getContext('2d');
  if (activityChart) activityChart.destroy();
  const d = memory.weeklyActivity;
  activityChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: d.labels,
      datasets: [
        { label: 'Correct', data: d.correct, backgroundColor: 'rgba(139,92,246,0.7)', borderRadius: 6, borderSkipped: false },
        { label: 'Wrong', data: d.wrong, backgroundColor: 'rgba(239,68,68,0.6)', borderRadius: 6, borderSkipped: false },
        { label: 'TLE', data: d.tle, backgroundColor: 'rgba(245,158,11,0.6)', borderRadius: 6, borderSkipped: false }
      ]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false }, tooltip: { backgroundColor: '#13132a', borderColor: 'rgba(139,92,246,0.3)', borderWidth: 1, titleColor: '#f1f0ff', bodyColor: '#a0a0c0' } },
      scales: {
        x: { stacked: true, grid: { display: false }, ticks: { color: '#6b6b9a', font: { family: 'Inter', size: 12 } } },
        y: { stacked: true, grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#6b6b9a', stepSize: 1, font: { family: 'Inter' } } }
      },
      animation: { duration: 800, easing: 'easeInOutQuart' }
    }
  });
}

function renderRadarChart() {
  const ctx = document.getElementById('radarChart').getContext('2d');
  if (radarChart) radarChart.destroy();
  const topics = Object.keys(memory.topicScores);
  const scores = Object.values(memory.topicScores);
  radarChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: topics,
      datasets: [{
        label: 'Mastery %',
        data: scores,
        backgroundColor: 'rgba(139,92,246,0.15)',
        borderColor: 'rgba(139,92,246,0.8)',
        borderWidth: 2,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        r: {
          min: 0, max: 100,
          grid: { color: 'rgba(255,255,255,0.06)' },
          angleLines: { color: 'rgba(255,255,255,0.06)' },
          ticks: { display: false },
          pointLabels: { color: '#a0a0c0', font: { family: 'Inter', size: 11 } }
        }
      },
      animation: { duration: 1000 }
    }
  });
}

// ============================================================
// MENTOR CHAT ENGINE
// ============================================================
function initMentorContext() {
  // Memory Snapshot
  const snap = document.getElementById('memorySnapshot');
  const weakTopics = Object.entries(memory.topicScores).sort((a,b)=>a[1]-b[1]).slice(0,2).map(e=>e[0]).join(', ');
  const strongTopics = Object.entries(memory.topicScores).sort((a,b)=>b[1]-a[1]).slice(0,2).map(e=>e[0]).join(', ');
  snap.innerHTML = [
    { k: '🎯 Weak Areas', v: weakTopics },
    { k: '💪 Strong Areas', v: strongTopics },
    { k: '📅 Streak', v: memory.student.streak + ' days' },
    { k: '✅ Accuracy', v: Math.round((memory.performance.correct/memory.performance.solved)*100) + '%' },
    { k: '⏱ Avg Time', v: memory.performance.avgTime + ' min' },
    { k: '🏆 Readiness', v: memory.readiness + '/100' }
  ].map(item => `
    <div class="mem-item"><span class="mem-key">${item.k}</span><span class="mem-val">${item.v}</span></div>
  `).join('');

  // Language Bars
  const langBars = document.getElementById('langBars');
  langBars.innerHTML = memory.languages.map(l => `
    <div class="lang-item">
      <div class="lang-header">
        <span class="lang-name">${l.name}</span>
        <span class="lang-pct">${l.pct}%</span>
      </div>
      <div class="lang-bar">
        <div class="lang-fill" style="width:${l.pct}%;background:${l.color}"></div>
      </div>
    </div>
  `).join('');
}

// Quick prompts
document.querySelectorAll('.quick-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.getElementById('mentorInput').value = btn.dataset.prompt;
    document.getElementById('mentorInput').focus();
  });
});

// Auto-resize textarea
const mentorInput = document.getElementById('mentorInput');
mentorInput.addEventListener('input', () => {
  mentorInput.style.height = 'auto';
  mentorInput.style.height = Math.min(mentorInput.scrollHeight, 120) + 'px';
});
mentorInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
});

document.getElementById('sendBtn').addEventListener('click', sendMessage);

function sendMessage() {
  const input = mentorInput.value.trim();
  if (!input) return;
  mentorInput.value = '';
  mentorInput.style.height = 'auto';

  appendUserMessage(input);
  const typingId = appendTyping();

  // Simulate AI analysis delay
  setTimeout(() => {
    removeTyping(typingId);
    const response = generateMentorResponse(input);
    appendMentorResponse(response);
  }, 1800 + Math.random() * 600);
}

function appendUserMessage(text) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'message user-message';
  div.innerHTML = `
    <div class="message-avatar">${getInitials(memory.student.name)}</div>
    <div class="message-bubble"><p>${escapeHtml(text)}</p><span class="message-time">${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span></div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function appendTyping() {
  const msgs = document.getElementById('chatMessages');
  const id = 'typing-' + Date.now();
  const div = document.createElement('div');
  div.className = 'message mentor-message'; div.id = id;
  div.innerHTML = `
    <div class="message-avatar">AI</div>
    <div class="message-bubble">
      <div class="typing-indicator">
        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
      </div>
    </div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
  return id;
}

function removeTyping(id) {
  document.getElementById(id)?.remove();
}

function appendMentorResponse(html) {
  const msgs = document.getElementById('chatMessages');
  const div = document.createElement('div');
  div.className = 'message mentor-message';
  div.innerHTML = `
    <div class="message-avatar">AI</div>
    <div class="message-bubble">${html}<span class="message-time">${new Date().toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'})}</span></div>
  `;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function escapeHtml(t) {
  return t.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

// ============================================================
// AI MENTOR RESPONSE ENGINE
// ============================================================
function generateMentorResponse(query) {
  const q = query.toLowerCase();
  const m = memory;
  const sorted = Object.entries(m.topicScores).sort((a,b)=>a[1]-b[1]);
  const weakest = sorted[0];
  const second = sorted[1];
  const strongest = Object.entries(m.topicScores).sort((a,b)=>b[1]-a[1])[0];
  const acc = Math.round((m.performance.correct / m.performance.solved) * 100);
  const topMistake = m.mistakes[0];

  // Routing keywords
  const isWeakness = /weak|struggle|bad|worst|improve|focus|plan|study/i.test(q);
  const isNext = /next|recommend|suggest|problem|practice|what should/i.test(q);
  const isReadiness = /ready|interview|readiness|job|hiring|score|assess/i.test(q);
  const isMistake = /mistake|error|bug|wrong|mess|fix/i.test(q);
  const isDp = /dp|dynamic programming/i.test(q);
  const isGraph = /graph|bfs|dfs/i.test(q);
  const isProgress = /progress|improve|better|trend|grow/i.test(q);

  if (isDp) return generateDpResponse(m);
  if (isGraph) return generateGraphResponse(m);
  if (isReadiness) return generateReadinessResponse(m, acc);
  if (isMistake) return generateMistakeResponse(m);
  if (isNext) return generateNextProblemResponse(m, weakest);
  if (isWeakness || q.includes('7-day') || q.includes('plan')) return generateWeaknessResponse(m, weakest, second);
  if (isProgress) return generateProgressResponse(m, acc);

  // Default: full analysis
  return generateFullAnalysis(m, weakest, strongest, acc, topMistake);
}

function generateFullAnalysis(m, weakest, strongest, acc, topMistake) {
  const rec = PROBLEM_BANK.filter(p => p.topic === 'dp').slice(0, 1)[0];
  return `
    <div class="response-section">
      <h4>📊 Performance Insight</h4>
      <p>You've solved <strong>${m.performance.solved} problems</strong> with a <strong>${acc}% accuracy</strong> rate. Your ${m.student.streak}-day streak shows great consistency! This week you solved ${m.performance.weeklySolved}/${m.performance.weeklyTarget} targets — keep going.</p>
    </div>
    <div class="response-section">
      <h4>⚠️ Weakness Summary</h4>
      <p><strong>${weakest[0]} (${weakest[1]}%)</strong> is your critical gap. You're also struggling with <strong>${Object.entries(m.topicScores).sort((a,b)=>a[1]-b[1])[1][0]}</strong>. Your top recurring mistake: <em>"${topMistake.text}"</em> — this has appeared <strong>${topMistake.count} times</strong>.</p>
    </div>
    <div class="response-section">
      <h4>🎯 Recommended Next Problem</h4>
      <p><strong>${rec.title}</strong> (Medium · ${rec.tags.join(', ')})</p>
      <p style="margin-top:4px">${rec.desc}</p>
    </div>
    <div class="response-section">
      <h4>💡 Hint Strategy for DP</h4>
      <p><strong>1.</strong> Define the state clearly — what does dp[i] represent?<br>
      <strong>2.</strong> Write the recurrence relation on paper before coding.<br>
      <strong>3.</strong> Set base cases explicitly: dp[0], dp[1].<br>
      <strong>4.</strong> Test on example: trace through the table manually.</p>
    </div>
    <div class="response-section">
      <h4>📅 7-Day Focus Plan</h4>
      <p>Days 1–3: DP fundamentals (Climbing Stairs → Coin Change → House Robber)<br>
      Days 4–5: Graph BFS/DFS (Islands → Provinces)<br>
      Day 6: Review mistakes — re-attempt wrong attempts<br>
      Day 7: Timed mock session (2 problems in 45 min)</p>
    </div>
    <div class="response-section">
      <h4>🏆 Interview Readiness</h4>
      <div class="score-display">
        <div>
          <div class="score-number">${m.readiness}/100</div>
          <div style="font-size:0.75rem;color:#a0a0c0">${m.readiness < 60 ? 'Getting There' : m.readiness < 80 ? 'Good Progress' : 'Interview Ready!'}</div>
        </div>
        <div style="font-size:0.8rem;color:#a0a0c0;max-width:180px">Fix DP (${weakest[1]}%) and Graphs (${Object.entries(m.topicScores).sort((a,b)=>a[1]-b[1])[1][1]}%) to jump to 75+.</div>
      </div>
    </div>
  `;
}

function generateWeaknessResponse(m, weakest, second) {
  return `
    <div class="response-section">
      <h4>🎯 Your Critical Weaknesses</h4>
      <p>Based on your history, I see two major gaps:<br>
      <strong>1. ${weakest[0]} (${weakest[1]}%)</strong> — You're missing core patterns. Most of your recent wrong answers were DP-related.<br>
      <strong>2. ${second[0]} (${second[1]}%)</strong> — Graph traversal is inconsistent, though you solved Number of Islands correctly.</p>
    </div>
    <div class="response-section">
      <h4>📅 7-Day Improvement Plan</h4>
      <p>
        <strong>Day 1:</strong> Climbing Stairs + Fibonacci DP (memoization)<br>
        <strong>Day 2:</strong> Coin Change (bottom-up tabulation)<br>
        <strong>Day 3:</strong> House Robber (state machine DP)<br>
        <strong>Day 4:</strong> Decode Ways (DP with string edge cases)<br>
        <strong>Day 5:</strong> Number of Provinces (graph, union-find)<br>
        <strong>Day 6:</strong> Course Schedule (topological sort)<br>
        <strong>Day 7:</strong> Re-attempt any 2 problems you got wrong this week — untimed first, then timed.
      </p>
    </div>
    <div class="response-section">
      <h4>⚡ Quick Win Strategy</h4>
      <p>Before each DP problem: write on paper → <em>"dp[i] means..."</em>. This single habit will reduce your wrong answers by an estimated 30%. You've been jumping to code too quickly — I can see it in your TLE patterns.</p>
    </div>
    <div class="response-section">
      <h4>📈 Expected Improvement</h4>
      <p>Following this plan consistently for 2 weeks should move your readiness from <strong>${m.readiness} → ~75</strong>, assuming ~6 problems/week.</p>
    </div>
  `;
}

function generateNextProblemResponse(m, weakest) {
  const rec = PROBLEM_BANK.sort((a,b) => b.aiWeight - a.aiWeight)[0];
  const rec2 = PROBLEM_BANK.sort((a,b) => b.aiWeight - a.aiWeight)[1];
  return `
    <div class="response-section">
      <h4>🎯 AI-Recommended Next Problem</h4>
      <p>Based on your history, the optimal next problem is:</p>
      <p style="margin-top:8px"><strong>🥇 ${rec.title}</strong> <span style="color:#fbbf24;font-size:0.8rem">[${rec.difficulty.toUpperCase()}]</span></p>
      <p style="font-size:0.8rem;margin-top:4px;color:#67e8f9">Why: ${rec.reason}</p>
      <p style="margin-top:6px">${rec.desc}</p>
    </div>
    <div class="response-section">
      <h4>🥈 Alternate: ${rec2.title}</h4>
      <p>${rec2.desc}</p>
      <p style="font-size:0.8rem;color:#67e8f9;margin-top:4px">Why: ${rec2.reason}</p>
    </div>
    <div class="response-section">
      <h4>💡 Before You Start</h4>
      <p>Given your <strong>"wrong base case"</strong> pattern (18 times!), before coding:<br>
      ✅ Write the base cases explicitly<br>
      ✅ Trace through a small example manually<br>
      ✅ Set a 30-minute timer — if stuck, look at the approach (not solution)</p>
    </div>
  `;
}

function generateReadinessResponse(m, acc) {
  const score = m.readiness;
  const status = score < 50 ? '🔴 Not Ready Yet' : score < 70 ? '🟡 Getting Closer' : score < 85 ? '🟢 Good Shape' : '🏆 Ready!';
  return `
    <div class="response-section">
      <h4>🏆 Honest Interview Readiness Assessment</h4>
      <div class="score-display">
        <div class="score-number">${score}/100</div>
        <div style="font-size:1rem;margin-left:8px">${status}</div>
      </div>
    </div>
    <div class="response-section">
      <h4>What's Holding You Back</h4>
      <p>
        <strong>Critical gaps:</strong><br>
        ❌ Dynamic Programming (${m.topicScores['Dynamic Programming']}%) — most FAANG companies heavily test this<br>
        ❌ Graphs (${m.topicScores['Graphs']}%) — Graph BFS/DFS appears in ~40% of interviews<br>
        ⚠️ Edge case handling — "${m.mistakes[0].text}" (${m.mistakes[0].count}× pattern)
      </p>
    </div>
    <div class="response-section">
      <h4>✅ Your Strengths for Interviews</h4>
      <p>
        ✅ Arrays (${m.topicScores['Arrays']}%) — solid foundation<br>
        ✅ Strings (${m.topicScores['Strings']}%) — above average<br>
        ✅ ${m.student.streak}-day streak shows strong consistency<br>
        ✅ First-try accuracy improved to ${m.performance.firstTryRate}% (up from 28%)
      </p>
    </div>
    <div class="response-section">
      <h4>📍 Path to 80+ Readiness</h4>
      <p>
        1. Solve 15 more DP problems (focus on 1D and 2D tabulation)<br>
        2. Complete graph fundamentals + 10 graph problems<br>
        3. Practice 3 timed mock sessions (45 min, 2 problems each)<br>
        4. Estimated: <strong>3–4 weeks</strong> at your current pace
      </p>
    </div>
  `;
}

function generateMistakeResponse(m) {
  return `
    <div class="response-section">
      <h4>🐛 Your Top Mistake Patterns (Ranked by Frequency)</h4>
      ${m.mistakes.map((mk, i) => `<p style="border-left:3px solid ${mk.color};padding-left:10px;margin:6px 0"><strong>#${i+1}: ${mk.text}</strong> — appeared <span style="color:${mk.color}">${mk.count}×</span></p>`).join('')}
    </div>
    <div class="response-section">
      <h4>🔧 Fix Strategy for #1 Mistake</h4>
      <p><strong>"${m.mistakes[0].text}"</strong></p>
      <p style="margin-top:6px">Create a <strong>pre-submission checklist</strong>:<br>
      ☐ What if input is empty? ([], "", 0)<br>
      ☐ What if it has only 1 element?<br>
      ☐ What if all elements are the same?<br>
      ☐ What about negative numbers?<br>
      Run through this in 90 seconds before every submission.</p>
    </div>
    <div class="response-section">
      <h4>🔧 Fix Strategy for #2 Mistake</h4>
      <p><strong>"${m.mistakes[1].text}"</strong></p>
      <p style="margin-top:6px">Before recursing or building a DP table:<br>
      1. <em>Write the base case on paper first</em><br>
      2. Ask: "what's the smallest valid input for my recurrence?"<br>
      3. Test base case independently before testing the full function.</p>
    </div>
    <div class="response-section">
      <h4>📈 Progress Note</h4>
      <p>Despite these patterns, you've improved your first-try accuracy from <strong>28% → ${m.performance.firstTryRate}%</strong>. That's real growth. Fixing the top 2 patterns can push you to <strong>50%+ first-try</strong>.</p>
    </div>
  `;
}

function generateDpResponse(m) {
  return `
    <div class="response-section">
      <h4>📊 Your DP Performance</h4>
      <p>DP is your <strong>weakest topic at ${m.topicScores['Dynamic Programming']}%</strong>. Looking at your history: Coin Change (WA), LCS (TLE), Word Break (WA). The pattern is clear — you're attempting the right problems but missing the fundamentals.</p>
    </div>
    <div class="response-section">
      <h4>🧠 DP Mastery Framework</h4>
      <p>
        <strong>Step 1 – Define the state:</strong> What does dp[i] represent?<br>
        <strong>Step 2 – Write the recurrence:</strong> dp[i] = f(dp[i-1], dp[i-2], ...)<br>
        <strong>Step 3 – Set base cases:</strong> dp[0] = ?, dp[1] = ?<br>
        <strong>Step 4 – Decide direction:</strong> Top-down (memo) or Bottom-up (table)?<br>
        <strong>Step 5 – Optimize space:</strong> Can you reduce O(n) → O(1)?
      </p>
    </div>
    <div class="response-section">
      <h4>📋 3-Week DP Roadmap</h4>
      <p>
        <strong>Week 1 (1D DP):</strong> Climbing Stairs, House Robber, Decode Ways, Jump Game<br>
        <strong>Week 2 (2D DP):</strong> LCS, Edit Distance, Unique Paths, Coin Change<br>
        <strong>Week 3 (Advanced):</strong> Word Break, Partition DP, Matrix Chain, Burst Balloons
      </p>
    </div>
    <div class="response-section">
      <h4>⚡ Quick Start: Coin Change — Correct Approach</h4>
      <p>
        State: <code>dp[i]</code> = min coins to make amount i<br>
        Base: <code>dp[0] = 0</code>, <code>dp[1..amount] = Infinity</code><br>
        Recurrence: <code>dp[i] = min(dp[i], dp[i - coin] + 1)</code> for each coin<br>
        Direction: Bottom-up, O(amount × coins) time.
      </p>
    </div>
  `;
}

function generateGraphResponse(m) {
  return `
    <div class="response-section">
      <h4>📊 Your Graph Performance</h4>
      <p>Graphs are your <strong>second weakest area at ${m.topicScores['Graphs']}%</strong>. You solved Number of Islands correctly (great!) but struggle with more complex traversals.</p>
    </div>
    <div class="response-section">
      <h4>🗺️ Graph Mental Model</h4>
      <p>
        <strong>BFS</strong> → Shortest path, level-order, minimum steps<br>
        <strong>DFS</strong> → Connected components, cycle detection, path existence<br>
        <strong>Topological Sort</strong> → Dependency ordering (Course Schedule)<br>
        <strong>Union-Find</strong> → Dynamic connectivity (Provinces, Redundant Connection)
      </p>
    </div>
    <div class="response-section">
      <h4>📋 Graph Problem Ladder</h4>
      <p>
        <strong>Level 1:</strong> Number of Islands ✅, Flood Fill, Max Area of Island<br>
        <strong>Level 2:</strong> Number of Provinces, Clone Graph, Pacific Atlantic<br>
        <strong>Level 3:</strong> Course Schedule I & II, Word Ladder<br>
        <strong>Level 4:</strong> Alien Dictionary, Critical Connections
      </p>
    </div>
  `;
}

function generateProgressResponse(m, acc) {
  return `
    <div class="response-section">
      <h4>📈 Your Progress Story</h4>
      <p>You've come a long way! Here's what the data shows:</p>
      <p>✅ <strong>87 problems</strong> solved (started from 0 in Sep 2024)<br>
      ✅ <strong>First-try accuracy:</strong> 28% → ${m.performance.firstTryRate}% (+${m.performance.firstTryRate - 28}%)<br>
      ✅ <strong>Avg solve time:</strong> reduced by ~8 minutes<br>
      ✅ <strong>Streak:</strong> ${m.student.streak} days (personal best!)</p>
    </div>
    <div class="response-section">
      <h4>🎯 What's Working</h4>
      <p>Your consistency is your superpower. The daily habit has compounded — you've gone from basic Arrays to attempting Hard DP and Graph problems. More importantly, your accuracy is trending upward despite tackling harder content.</p>
    </div>
    <div class="response-section">
      <h4>🚀 Next Milestones</h4>
      <p>
        → Reach <strong>100 problems</strong> (only 13 away!)<br>
        → Improve accuracy to <strong>45%+</strong><br>
        → Get DP score above <strong>50%</strong><br>
        → Hit readiness score of <strong>75</strong>
      </p>
    </div>
  `;
}

// ============================================================
// PROBLEMS VIEW
// ============================================================
function renderProblems(filter = {}) {
  const grid = document.getElementById('problemsGrid');
  let problems = [...PROBLEM_BANK].sort((a, b) => b.aiWeight - a.aiWeight);

  const diff = document.getElementById('diffFilter')?.value || 'all';
  const topic = document.getElementById('topicFilter')?.value || 'all';

  if (diff !== 'all') problems = problems.filter(p => p.difficulty === diff);
  if (topic !== 'all') problems = problems.filter(p => p.topic === topic);

  grid.innerHTML = problems.map(p => `
    <div class="problem-card ${p.difficulty}" data-id="${p.id}">
      <div class="problem-header">
        <div class="problem-title">${p.title}</div>
        <span class="difficulty-badge ${p.difficulty}">${p.difficulty.charAt(0).toUpperCase() + p.difficulty.slice(1)}</span>
      </div>
      <p class="problem-desc">${p.desc}</p>
      <div class="problem-tags">
        ${p.tags.map(t => `<span class="tag">${t}</span>`).join('')}
      </div>
      <div class="problem-footer">
        <span class="ai-reason">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          ${p.reason}
        </span>
        <button class="problem-action" onclick="solveNow(${p.id})">Solve Now →</button>
      </div>
    </div>
  `).join('');
}

function solveNow(id) {
  const p = PROBLEM_BANK.find(pr => pr.id === id);
  showToast(`Opening: ${p.title} (${p.difficulty}) — Good luck! 🎯`);
}

document.getElementById('diffFilter')?.addEventListener('change', renderProblems);
document.getElementById('topicFilter')?.addEventListener('change', renderProblems);

// ============================================================
// PROGRESS VIEW
// ============================================================
function initProgress() {
  renderHeatmap();
  renderTopicProgress();
  renderTimeline();
}

function renderHeatmap() {
  const container = document.getElementById('heatmapContainer');
  const grid = document.createElement('div');
  grid.className = 'heatmap-grid';

  const days = 84; // 12 weeks
  for (let i = 0; i < days; i++) {
    const cell = document.createElement('div');
    cell.className = 'heatmap-cell';
    const rand = Math.random();
    if (rand > 0.7) {
      const lvl = rand > 0.95 ? 4 : rand > 0.85 ? 3 : rand > 0.75 ? 2 : 1;
      cell.classList.add('lvl-' + lvl);
      cell.title = `${lvl} submission${lvl > 1 ? 's' : ''}`;
    } else {
      cell.title = 'No submissions';
    }
    grid.appendChild(cell);
  }
  container.innerHTML = '';
  container.appendChild(grid);
}

function renderTopicProgress() {
  const list = document.getElementById('topicProgressList');
  const colorMap = {
    'Arrays': '#10b981', 'Strings': '#06b6d4', 'Binary Search': '#8b5cf6',
    'Trees': '#f59e0b', 'Graphs': '#ef4444', 'Dynamic Programming': '#ec4899',
    'Backtracking': '#6366f1', 'Greedy': '#14b8a6'
  };
  const entries = Object.entries(memory.topicScores).sort((a, b) => b[1] - a[1]);
  list.innerHTML = entries.map(([topic, score]) => {
    const solved = Math.round((score / 100) * 15);
    const total = 15;
    return `
      <div class="topic-row">
        <div class="topic-row-header">
          <span class="topic-name">${topic}</span>
          <span class="topic-stats">${solved}/${total} solved · ${score}%</span>
        </div>
        <div class="topic-bar-bg">
          <div class="topic-bar-fill" style="width:${score}%;background:${colorMap[topic] || '#8b5cf6'}"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderTimeline() {
  const list = document.getElementById('timelineList');
  list.innerHTML = [...memory.history].reverse().map(item => `
    <div class="timeline-item">
      <div class="timeline-date">${formatDate(item.date)}</div>
      <div class="timeline-title">${item.event}</div>
    </div>
  `).join('');
}

// ============================================================
// MEMORY VIEW
// ============================================================
function initMemoryView() {
  // Profile Form
  const profileForm = document.getElementById('profileForm');
  profileForm.innerHTML = [
    { id: 'memName', label: 'Student Name', val: memory.student.name, type: 'text' },
    { id: 'memLevel', label: 'Level', val: memory.student.level, type: 'select', opts: ['Beginner', 'Intermediate', 'Advanced'] },
    { id: 'memLang', label: 'Primary Language', val: memory.student.lang, type: 'select', opts: ['Python', 'C++', 'Java', 'JavaScript', 'Go'] },
    { id: 'memStreak', label: 'Current Streak (days)', val: memory.student.streak, type: 'number' }
  ].map(f => {
    if (f.type === 'select') {
      return `<div class="mem-field"><label>${f.label}</label><select id="${f.id}" class="form-input">${f.opts.map(o => `<option ${o===f.val?'selected':''}>${o}</option>`).join('')}</select></div>`;
    }
    return `<div class="mem-field"><label>${f.label}</label><input id="${f.id}" type="${f.type}" value="${f.val}" class="form-input" /></div>`;
  }).join('');

  // Perf Form
  const perfForm = document.getElementById('perfForm');
  perfForm.innerHTML = [
    { id: 'memSolved', label: 'Problems Solved', val: memory.performance.solved },
    { id: 'memCorrect', label: 'Correct Submissions', val: memory.performance.correct },
    { id: 'memWrong', label: 'Wrong Answers', val: memory.performance.wrong },
    { id: 'memTle', label: 'TLE', val: memory.performance.tle },
    { id: 'memAvgTime', label: 'Avg Solve Time (min)', val: memory.performance.avgTime },
    { id: 'memReadiness', label: 'Readiness Score (0–100)', val: memory.readiness }
  ].map(f => `<div class="mem-field"><label>${f.label}</label><input id="${f.id}" type="number" value="${f.val}" class="form-input" /></div>`).join('');

  // Mistake Tags
  renderMistakeTags();

  // Raw Memory
  document.getElementById('rawMemory').value = JSON.stringify(memory, null, 2);
}

function renderMistakeTags() {
  const editor = document.getElementById('mistakeEditor');
  editor.innerHTML = memory.mistakes.map((m, i) => `
    <div class="mistake-tag" id="mtag-${i}">
      <span>${m.text} (${m.count}×)</span>
      <button class="remove-tag" onclick="removeMistake(${i})">✕</button>
    </div>
  `).join('') + `
    <div class="add-mistake-row">
      <input class="add-mistake-input" id="newMistakeInput" placeholder="Add new mistake pattern..." />
      <button class="add-mistake-btn" onclick="addMistake()">Add</button>
    </div>
  `;
}

function removeMistake(i) {
  memory.mistakes.splice(i, 1);
  renderMistakeTags();
  document.getElementById('rawMemory').value = JSON.stringify(memory, null, 2);
}

function addMistake() {
  const input = document.getElementById('newMistakeInput');
  const text = input.value.trim();
  if (!text) return;
  memory.mistakes.push({ text, count: 1, color: '#8b5cf6' });
  input.value = '';
  renderMistakeTags();
  document.getElementById('rawMemory').value = JSON.stringify(memory, null, 2);
}

document.getElementById('saveMemoryBtn')?.addEventListener('click', () => {
  // Collect profile
  memory.student.name = document.getElementById('memName')?.value || memory.student.name;
  memory.student.level = document.getElementById('memLevel')?.value || memory.student.level;
  memory.student.lang = document.getElementById('memLang')?.value || memory.student.lang;
  memory.student.streak = parseInt(document.getElementById('memStreak')?.value) || memory.student.streak;

  // Collect perf
  memory.performance.solved = parseInt(document.getElementById('memSolved')?.value) || memory.performance.solved;
  memory.performance.correct = parseInt(document.getElementById('memCorrect')?.value) || memory.performance.correct;
  memory.performance.wrong = parseInt(document.getElementById('memWrong')?.value) || memory.performance.wrong;
  memory.performance.tle = parseInt(document.getElementById('memTle')?.value) || memory.performance.tle;
  memory.performance.avgTime = parseInt(document.getElementById('memAvgTime')?.value) || memory.performance.avgTime;
  memory.readiness = parseInt(document.getElementById('memReadiness')?.value) || memory.readiness;

  // Try parse raw memory
  try {
    const raw = document.getElementById('rawMemory').value;
    memory = JSON.parse(raw);
  } catch(e) { /* keep existing if invalid JSON */ }

  saveMemory();
  showToast('✅ Memory profile saved successfully!');

  // Refresh current view
  initDashboard();
  initMentorContext();
  renderMistakeTags();
});

// ============================================================
// SUBMISSION LOG MODAL
// ============================================================
document.getElementById('logSubmissionBtn')?.addEventListener('click', () => {
  document.getElementById('submissionModal').classList.add('active');
});
document.getElementById('modalClose')?.addEventListener('click', closeModal);
document.getElementById('cancelSubmission')?.addEventListener('click', closeModal);
document.getElementById('submissionModal')?.addEventListener('click', e => {
  if (e.target.id === 'submissionModal') closeModal();
});

function closeModal() {
  document.getElementById('submissionModal').classList.remove('active');
}

document.getElementById('submitLog')?.addEventListener('click', () => {
  const problem = document.getElementById('subProblem').value.trim();
  const topic = document.getElementById('subTopic').value;
  const result = document.getElementById('subResult').value;
  const diff = document.getElementById('subDiff').value;
  const time = parseInt(document.getElementById('subTime').value) || 25;
  const notes = document.getElementById('subNotes').value.trim();

  if (!problem) { showToast('Please enter a problem name', 'error'); return; }

  // Update memory
  memory.performance.solved++;
  if (result === 'correct') memory.performance.correct++;
  else if (result === 'wrong') memory.performance.wrong++;
  else if (result === 'tle') memory.performance.tle++;
  else memory.performance.runtimeError++;

  // Recalculate first try rate
  memory.performance.firstTryRate = Math.round((memory.performance.correct / memory.performance.solved) * 100);

  // Add to recent submissions
  memory.recentSubmissions.unshift({ name: problem, topic, result, diff, time });
  if (memory.recentSubmissions.length > 10) memory.recentSubmissions.pop();

  // Add mistake if applicable
  if (notes && result !== 'correct') {
    memory.mistakes.push({ text: notes, count: 1, color: '#ef4444' });
    if (memory.mistakes.length > 8) memory.mistakes.pop();
  }

  // Update activity chart data
  const today = new Date().getDay();
  const dayIdx = today === 0 ? 6 : today - 1;
  if (result === 'correct') memory.weeklyActivity.correct[dayIdx]++;
  else if (result === 'wrong') memory.weeklyActivity.wrong[dayIdx]++;
  else if (result === 'tle') memory.weeklyActivity.tle[dayIdx]++;

  // Recalculate readiness
  memory.readiness = Math.min(100, Math.round(
    (memory.performance.firstTryRate * 0.4) +
    (Object.values(memory.topicScores).reduce((a,b)=>a+b,0) / Object.keys(memory.topicScores).length * 0.6)
  ));

  saveMemory();
  closeModal();
  showToast(`✅ Submission logged: ${problem} [${result.toUpperCase()}]`);

  // Reset form
  document.getElementById('subProblem').value = '';
  document.getElementById('subTime').value = '';
  document.getElementById('subNotes').value = '';

  // Refresh dashboard
  initDashboard();
});

// ============================================================
// VIEW ALL SUBMISSIONS
// ============================================================
document.getElementById('viewAllBtn')?.addEventListener('click', () => switchView('progress'));

// ============================================================
// INIT
// ============================================================
function init() {
  initDashboard();
}

init();
