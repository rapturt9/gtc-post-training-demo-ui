# Cybersecurity demo

**Recorded Nemotron code-review runs, with both checkpoints shown side by side.** Open the [interactive demo](index.html), review the [results](results/quant-evidence.json), or download the [PDF](rl-demo.pdf) and [Word document](rl-demo.docx).

This folder sits beside `healthcare-demo/` in the actual Amelia demo repository. It includes the standalone presentation, chart data, trace exports, documents and editable [build source](source/).

## Rebuild

Requires Node.js 20.9 or later. From the repository root:

```sh
python3 cybersecurity-demo/source/build.py
```

The build project uses the cloned repository’s Next.js template and pinned dependency lock.

## Preview

From the repository root:

```sh
python3 -m http.server 8766 --bind 127.0.0.1
```

Open [localhost:8766/cybersecurity-demo/](http://localhost:8766/cybersecurity-demo/).

Choose a case to see both recorded runs together. Use the **Right** and **Left** arrow keys to move through the presentation phases. The replay shows what each run read, what it reported and whether the checker matched the known problem. It displays recorded evidence; opening it does not launch a scan or model inference.

## What changed

The comparison is **Early RL step 5 → Final RL step 200**. Early step 5 was already trained. A fresh evaluation against untouched Nemotron is pending and has no result here yet.

| Historical measure | Early RL step 5 | Final RL step 200 |
| --- | ---: | ---: |
| Mean graded reward | 0.169 | 0.263 |
| Attempts earning full credit | 10/80 | 20/80 |
| Cases with any positive reward | 9/20 | 7/20 |
| Incomplete attempts, reported separately | 18 | 6 |

The 20 held-out cases have four attempts per checkpoint. Reward measures graded credit for matching known defects, not accuracy or successful attacks. The 95% interval for the reward change is **−0.009 to +0.213**, which includes zero. More full-credit attempts did not mean broader case coverage.

Three featured pairs show two selected misses becoming matches and one equally successful run using fewer tokens. In the latter pair, illustrative detector cost falls from **$0.020219 to $0.002572**, about **87.3% lower**. This uses an uncached OpenRouter price scenario of $0.039/M input and $0.18/M output plus reasoning. It excludes judges, training and infrastructure and is not an invoice.

## Results and evidence

| File | Contents |
| --- | --- |
| [Metric series](results/metric-series.json) | Historical evaluation measurements across RL steps. |
| [Paired task matrix](results/paired-task-matrix.json) | Case-level early and final results, including declines. |
| [Quantitative evidence](results/quant-evidence.json) | Aggregates, denominators, uncertainty and measurement limits. |
| [Paired replay data](results/viewer-data.json) | Plain explanations, source citations, token totals and checker outcomes. |
| [Trace manifest](traces/manifest.json) | Identities and provenance for the eight exported traces. |
| [Package provenance](provenance.json) | Repository source, checkpoint identity and package inventory. |
| [Editable source](source/) | Build project used to produce the standalone presentation. |

### Local trace JSON

The filenames retain `base` for compatibility. Every `base` file below is **Early RL step 5**, already trained.

| Case | Early RL step 5 | Final RL step 200 |
| --- | --- | --- |
| Openfire, icon fetching | [Early JSON](traces/openfire-base.json) | [Final JSON](traces/openfire-final.json) |
| Cosmos, access control | [Early JSON](traces/cosmos-base.json) | [Final JSON](traces/cosmos-final.json) |
| set-value, token efficiency | [Early JSON](traces/setvalue-base.json) | [Final JSON](traces/setvalue-final.json) |
| Jenkins, additional comparison | [Early JSON](traces/jenkins-base.json) | [Final JSON](traces/jenkins-final.json) |

## Model weights

[Download the final RL step 200 adapter on Hugging Face](https://huggingface.co/depthfirstlabs/Nemotron-3.5-Lightning-RL-NVD-Final-Step-200).

The public model card links to a **3.59 GB LoRA adapter with manually approved download access**. It requires the NVIDIA Nemotron 3.5 Lightning 30B A3B BF16 base model. Inference with the exported adapter is untested. The training base revision is unknown; the verified revision used for export metadata is recorded separately.

## Documents

- [NVIDIA template PDF](rl-demo.pdf)
- [Editable NVIDIA template Word document](rl-demo.docx)

The overview and graph stay on the first page. Later pages contain a three-minute presentation script, evidence links, technical details and booth setup.

Local presentation and evidence files work through the HTTP server. Hugging Face, original Langfuse traces and other external links require network access. Keep this folder and its assets together when sharing it.
