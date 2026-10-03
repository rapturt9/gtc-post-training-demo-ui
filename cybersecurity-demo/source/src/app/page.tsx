'use client';

import { useEffect, useState } from 'react';
import rlData from '@/lib/rl-data.json';
import rlMatrix from '@/lib/rl-matrix.json';
import './rl.css';

type RunKey = 'base' | 'final';
type CaseKey = 'openfire' | 'cosmos' | 'setvalue';
interface CodeFile { file: string; description: string; code_url?: string }
interface StageSide { title: string; detail: string; files?: CodeFile[] }
interface Run { label: string; known_bug_matched: boolean; proposal_count: number; tokens: { total: number }; estimated_detector_cost_usd: number; json_file: string }
interface Case { name: string; task_id: string; headline: string; risk: string; summary: string; runs: Record<RunKey, Run>; stages: { phase: string; base: StageSide; final: StageSide }[] }
interface MatrixRow { entry_id: string; base_mean_reward: number; final_mean_reward: number; base_successful_attempts: number; final_successful_attempts: number; mean_reward_change: number }
const data = rlData as unknown as { tasks: Record<string, Case>; cost_scenario: { boundary: string } };
const rows = (rlMatrix as unknown as { rows: MatrixRow[] }).rows;
const cases: CaseKey[] = ['openfire', 'cosmos', 'setvalue'];
const ASSET_ROOT = process.env.NEXT_PUBLIC_RL_ASSET_BASE || '/cybersecurity-demo';
const GITHUB = 'https://github.com/rapturt9/gtc-post-training-demo-ui/tree/codex/cybersecurity-demo/cybersecurity-demo';
const WEIGHTS = 'https://huggingface.co/depthfirstlabs/Nemotron-3.5-Lightning-RL-NVD-Final-Step-200';
const names: Record<string, string> = {
  'CVE-2015-8103': 'Jenkins', 'CVE-2016-2141': 'JGroups', 'CVE-2016-3088': 'ActiveMQ',
  'CVE-2018-18389': 'Neo4j', 'CVE-2018-21234': 'Jodd', 'CVE-2018-8013': 'Batik',
  'CVE-2019-10747': 'set-value', 'CVE-2019-18394': 'Openfire', 'CVE-2021-23555': 'vm2',
  'CVE-2021-30454': 'outer_cgi', 'CVE-2021-41411': 'Drools', 'CVE-2023-29509': 'XWiki',
  'CVE-2024-28175': 'Argo CD', 'CVE-2024-45337': 'Go SSH', 'CVE-2025-27603': 'Confluence Migrator',
  'CVE-2025-50538': 'Flowise', 'CVE-2025-68271': 'OpenC3 COSMOS', 'CVE-2025-7783': 'form-data',
  'CVE-2025-9287': 'cipher-base', 'CVE-2026-44542': 'Filebrowser',
};
const number = (value: number) => new Intl.NumberFormat('en-US').format(value);
const cost = (value: number) => `$${value.toFixed(4)}`;

function TrafficLights() { return <div className="traffic-lights" aria-hidden="true"><i /><i /><i /></div>; }

export default function Page() {
  const [selected, setSelected] = useState<CaseKey>('openfire');
  const [stage, setStage] = useState(0);
  const task = data.tasks[selected];
  const current = task.stages[stage];
  useEffect(() => {
    const move = (event: KeyboardEvent) => {
      if ((event.target as HTMLElement)?.closest('input,textarea,select,[contenteditable]')) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        event.preventDefault();
        setStage((value) => Math.max(0, Math.min(2, value + (event.key === 'ArrowRight' ? 1 : -1))));
      }
    };
    window.addEventListener('keydown', move);
    return () => window.removeEventListener('keydown', move);
  }, []);

  return <div className="app-shell rl-page">
    <header className="topbar">
      <a className="brand" href={ASSET_ROOT} aria-label="NVIDIA Nemotron cybersecurity demo"><span className="rl-nvidia">NVIDIA</span><span className="rl-brand-divider" /><strong>Nemotron</strong></a>
      <div className="topbar-center"><span className="crumb-muted">Post-training</span><span>/</span><span>Reinforcement learning</span></div>
      <nav className="topbar-actions" aria-label="Resources"><a href="https://probable-dollop-9mnynl6.pages.github.io/demos/nvidia/">Distillation</a><a href={GITHUB} target="_blank" rel="noreferrer">GitHub ↗</a><a href={WEIGHTS} target="_blank" rel="noreferrer">Model weights ↗</a><a href={`${ASSET_ROOT}/rl-demo.pdf`}>PDF</a><a href={`${ASSET_ROOT}/rl-demo.docx`}>Word</a></nav>
    </header>
    <main className="page-wrap">
      <section className="intro-row">
        <div><p className="rl-eyebrow">NEMOTRON · REINFORCEMENT LEARNING</p><h1>Watch the agent<br /><em>learn to find bugs.</em></h1><p className="rl-intro">Real code. Real reports. The same tasks, before and after more training.</p><p className="rl-subtle">Early RL (step 5) → Final RL (step 200). Early RL was already trained. A fresh untouched-model comparison is pending.</p></div>
        <div className="rl-summary"><div><span>Mean report reward</span><strong>0.169 <span>→</span> 0.263</strong><small>20 tasks × 4 reports per checkpoint</small></div><div><span>Tasks with a known-bug match</span><strong>9/20 <span>→</span> 7/20</strong><small>Results vary across tasks</small></div><div><span>Pipeline failures</span><strong>18 <span>→</span> 6</strong><small>Out of 80 attempts each</small></div></div>
      </section>
      <section className="rl-evidence" aria-label="Full evaluation summary">
        <div className="rl-curve"><div className="rl-section-heading"><h2>Reward across training</h2><span>Historical periodic evaluations</span></div><img src={`${ASSET_ROOT}/results/rl-reward-dark.svg`} alt="Recorded reinforcement learning reward across training, with historical evaluation points" /></div>
        <div className="rl-cohort"><h2>The whole comparison</h2><p>Mean report reward increased by 0.094. The paired 95% confidence interval is −0.009 to +0.213, so the measured increase remains uncertain.</p><p>Known-bug matches: <strong>19 → 22 reports</strong>. Task coverage: <strong>9 → 7 of 20</strong>. Reward and known-bug coverage measure different things.</p><details><summary>View all 20 tasks</summary><div className="rl-table-wrap"><table><thead><tr><th>Software / task</th><th>Early reward</th><th>Final reward</th><th>Known-bug matches</th></tr></thead><tbody>{rows.map((row) => <tr key={row.entry_id}><td>{names[row.entry_id] || 'Software task'}<small>{row.entry_id}</small></td><td>{row.base_mean_reward.toFixed(3)}</td><td>{row.final_mean_reward.toFixed(3)}</td><td>{row.base_successful_attempts}/4 → {row.final_successful_attempts}/4</td></tr>)}</tbody></table></div></details></div>
      </section>
      <section className="workspace" aria-label="Compare real agent runs">
        <div className="window-bar"><TrafficLights /><span className="window-meta">REAL TRACES · SIDE-BY-SIDE COMPARISON</span></div>
        <div className="workspace-body rl-workspace-body">
          <aside className="rl-case-dock" aria-label="Choose a software example"><div className="rl-dock-label">THREE EXAMPLES</div>{cases.map((key) => { const item = data.tasks[key]; return <button key={key} type="button" className={`model-tile rl-case ${selected === key ? 'is-selected' : ''}`} onClick={() => { setSelected(key); setStage(0); }} aria-pressed={selected === key}><div className="mini-window-bar"><TrafficLights /></div><div className="tile-copy"><strong>{item.name}</strong><small>{key === 'setvalue' ? 'Same match, lower cost' : 'Missed → matched'}</small></div><div className="tile-score"><span>Known bug</span><strong>{item.runs.base.known_bug_matched ? '1' : '0'} → {item.runs.final.known_bug_matched ? '1' : '0'}</strong></div><div className="tile-footer">{item.task_id}</div></button>; })}</aside>
          <div className="expanded-model rl-expanded">
            <div className="expanded-header"><div className="expanded-identity"><div className="expanded-icon" aria-hidden="true">⌘</div><div><small>ACTUAL COMPLETED RUNS</small><h2>{task.name}</h2></div></div><span className="status-pill">Source-backed comparison</span></div>
            <div className="rl-case-intro"><h3>{task.headline}</h3><p>{task.risk}</p><p className="rl-subtle">{task.summary}</p>{selected === 'cosmos' && <p className="rl-subtle">This paired run improved; across all four attempts, COSMOS matched the known bug once at each checkpoint.</p>}</div>
            <div className="comparison-grid rl-run-tops">{(['base', 'final'] as RunKey[]).map((key) => { const run = task.runs[key]; return <section className={`output-panel ${key === 'final' ? 'tuned' : ''}`} key={key}><header><div className="model-mark" aria-hidden="true">{key === 'final' ? '↗' : '○'}</div><div><small>{key === 'base' ? 'ALREADY TRAINED' : 'FINAL CHECKPOINT'}</small><strong>{key === 'base' ? 'Early RL · step 5' : 'Final RL · step 200'}</strong></div></header><dl className="run-metrics"><div><dt>Known bug</dt><dd>{run.known_bug_matched ? '1/1' : '0/1'}</dd></div><div><dt>Est. cost</dt><dd>{cost(run.estimated_detector_cost_usd)}</dd></div><div><dt>Tokens</dt><dd>{number(run.tokens.total)}</dd></div></dl><div className="rl-trace-links"><a target="_blank" rel="noreferrer" href={`https://github.com/rapturt9/gtc-post-training-demo-ui/blob/codex/cybersecurity-demo/cybersecurity-demo/traces/${run.json_file}`}>View trace ↗</a><a href={`${ASSET_ROOT}/traces/${run.json_file}`} download>Download JSON ↓</a></div></section>; })}</div>
            <div className="rl-stage-navigation"><div className="rl-stage-tabs" role="tablist" aria-label="Investigation phase">{task.stages.map((item, index) => <button type="button" key={item.phase} role="tab" aria-selected={stage === index} onClick={() => setStage(index)} className={stage === index ? 'active' : ''}><span>{index + 1}</span>{index === 0 ? 'Read the code' : index === 1 ? 'Report' : 'Check'}</button>)}</div><div className="header-actions"><button className="ghost-button" disabled={stage === 0} onClick={() => setStage((value) => value - 1)} aria-label="Previous phase">← Prev</button><button className="run-button" disabled={stage === 2} onClick={() => setStage((value) => value + 1)} aria-label="Next phase">Next →</button></div></div>
            <div className="comparison-grid rl-stage-panels" aria-live="polite">{(['base', 'final'] as RunKey[]).map((key) => { const side = current[key]; return <section key={key} className={`output-panel ${key === 'final' ? 'tuned' : ''}`}><div className="response-copy"><span className="rl-eyebrow">{current.phase.toUpperCase()}</span><h3>{side.title}</h3><p>{side.detail}</p>{side.files && <ul className="rl-code-files">{side.files.map((file) => <li key={file.file}>{file.code_url ? <a href={file.code_url} target="_blank" rel="noreferrer">{file.file} ↗</a> : <strong>{file.file}</strong>}<span>{file.description}</span></li>)}</ul>}</div></section>; })}</div>
            <p className="rl-run-note">Use ← / → to move through the investigation. “Known bug matched” means the recorded checker credited the target finding; it is not an independent reproduction.</p>
          </div>
        </div>
      </section>
      <footer className="rl-footer"><p>Costs are estimates for detector generation only, using $0.039 per million input tokens and $0.18 per million output + reasoning tokens, assuming uncached input. They are not actual spend and exclude judging and infrastructure.</p><p>Trace downloads preserve safe visible text, tool activity and source metadata. Private reasoning, secrets and operational exploit details are omitted or summarized with explicit labels.</p><p>These are selected examples from historical evaluations, not proof that every task improved. Jenkins is a counterexample: known-bug matches decreased from 2/4 to 0/4. The complete task table is above.</p></footer>
    </main>
  </div>;
}
