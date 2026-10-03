import json,hashlib
from pathlib import Path
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import numpy as np
root=Path(__file__).resolve().parents[1];raw=json.loads((root/'results/metric-inputs.json').read_text());series=[]
for d in raw:
 g=d['groups'];assert len(g)==20 and all(len(t['rewards'])==4 for t in g);series.append({'step':d['policy_step'],'mean_reward':sum(sum(t['rewards']) for t in g)/80,'manifest_uri':d['manifest_uri'],'manifest_sha256':d['manifest_sha256']})
assert len(series)==40 and series[0]['step']==5 and series[-1]['step']==200
first=raw[0];last=raw[-1];left={g['entry_id']:np.mean(g['rewards']) for g in first['groups']};right={g['entry_id']:np.mean(g['rewards']) for g in last['groups']};assert left.keys()==right.keys();diff=np.array([right[k]-left[k] for k in sorted(left)]);rng=np.random.default_rng(17);boot=diff[rng.integers(0,20,(20000,20))].mean(axis=1);interval=np.quantile(boot,[.025,.975]).tolist()
plt.rcParams.update({'font.family':'DejaVu Sans','font.size':10,'svg.fonttype':'none','text.color':'#1e1e1e','axes.labelcolor':'#5a5b65','xtick.color':'#5a5b65','ytick.color':'#5a5b65'})
fig,ax=plt.subplots(figsize=(7.6,3.9),dpi=150);fig.set_facecolor('#ffffff');ax.set_facecolor('#ffffff');fig.subplots_adjust(left=.10,right=.94,top=.77,bottom=.22);fig.text(.045,.91,'How report scores changed during RL',fontsize=16,weight='bold');fig.text(.045,.845,'Same 20 held-out cases · four attempts per checkpoint',fontsize=10,color='#5a5b65')
ax.plot([x['step'] for x in series],[x['mean_reward'] for x in series],color='#84848b',lw=1.7);ax.scatter([5,200],[series[0]['mean_reward'],series[-1]['mean_reward']],c=['#84848b','#76b900'],s=45,zorder=3)
ax.annotate('Early RL  0.169',(5,series[0]['mean_reward']),xytext=(7,-20),textcoords='offset points',fontsize=10);ax.annotate('Final  0.263',(200,series[-1]['mean_reward']),xytext=(-95,13),textcoords='offset points',fontsize=10,weight='bold');ax.set_xlim(0,208);ax.set_ylim(0,.40);ax.set_xticks([5,50,100,150,200]);ax.set_yticks([0,.1,.2,.3,.4]);ax.set_xlabel('RL policy step',labelpad=8);ax.set_ylabel('Mean report reward (0–1)',labelpad=8);ax.grid(axis='y',color='#e4e4e7',linewidth=.7);ax.set_axisbelow(True)
for sp in ax.spines.values():sp.set_visible(False)
fig.text(.045,.05,'Early RL is step 5, already RL-trained. Reward includes partial credit; it is not accuracy.',fontsize=8.5,color='#5a5b65')
fig.savefig(root/'rl-reward.svg',facecolor=fig.get_facecolor());fig.savefig(root/'rl-reward.png',facecolor=fig.get_facecolor());plt.close(fig)
meta={'schema_version':1,'cohort':'20 identical ghsa_holdout CVEs, four rollouts per checkpoint, 40 policies from 5 to 200','labels':{'Early RL':'Policy step 5, already RL-trained','Final':'Policy step 200'},'metric':'Mean recorded reward across all 80 scheduled rollouts; reward is not accuracy or recall','reward_difference':float(diff.mean()),'paired_20_case_bootstrap_95_interval':interval,'bootstrap':{'seed':17,'resamples':20000,'unit':'CVE case, containing four rollouts'},'series':series,'chart_sha256':hashlib.sha256((root/'rl-reward.svg').read_bytes()).hexdigest(),'reproduction':'MPLCONFIGDIR=/private/tmp/rl-nvidia-mpl python demos/rl-nvidia/results/build_chart.py'}
(root/'results/chart-provenance.json').write_text(json.dumps(meta,indent=2)+'\n');(root/'results/training-series.json').write_text(json.dumps(series,indent=2)+'\n');print(json.dumps({'points':len(series),'reward_change':meta['reward_difference'],'interval':interval}))
