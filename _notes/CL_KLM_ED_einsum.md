---
title: "Kondo Lattice Model 的精确对角化 - 本征值 · 本征能量 · 有效场 · einsum · square‑lattice KLM，正则与巨正则系综"
date: 2026-07-11
categories: ["ECNN for Kondo Lattice Model"]
---

本笔记从 Yu Miyazaki 的 ecnn4klm 代码库中的klmsq2d /
klmtri2d_gc 两段代码出发（后者由我根据巨正则系综的
三角晶格版本 klmtri2d_gc 改写，以满足巨正则系综），
推导零温下的占据、 基态能量与局域有效场，
并系统讲解 torch.einsum 的语义与张量缩并实现。
本笔记由 Anthropic Claude 提供 .tex 模板，并且进行辅助创作。
推导部分由作者 Yan S. Zha 本人进行或确认。
笔记可在 [https://github.com/yzhacn/condensed-matter-ML-notes/blob/main/CL_KLM_ED_einsum/CL_KLM_ED_einsum.pdf](https://github.com/yzhacn/condensed-matter-ML-notes/blob/main/CL_KLM_ED_einsum/CL_KLM_ED_einsum.pdf)  进行查看。

完整源代码见附录或 Yu Miyazaki 的 GitHub 代码仓库。
