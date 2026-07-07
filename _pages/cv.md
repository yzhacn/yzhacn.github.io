---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

<p><a href="{{ base_path }}/files/CV.pdf" class="btn btn--large" target="_blank" rel="noopener noreferrer"><i class="fa fa-download" aria-hidden="true"></i> Download CV (PDF)</a></p>

## Education

* Ph.D. student in Condensed Matter Physics, Graduate School of Science, **Hokkaido University**. Expected graduation: 2029.03.
* **M.S.** in Condensed Matter Physics, Graduate School of Science, **Hokkaido University**, 2024.04--2026.03.
* **B.S.** in Material Science, School of Science, **Yokohama City University**, 2020.04--2024.03.


## Work experience

* **Research Assistant (RA)**, Hokkaido University, 2025.02–2025.03  
  * Supervisor: Prof. Dr. S. Hayami  
  * Responsibilities:
    1. Conducted self-consistent mean-field calculations of skyrmion lattices.
    2. Assembled and maintained high-spec workstations for scientific computation.
  
## Skills

* **Coding**
    * Mathematica
    * Python
* **Languages**
  * Chinese: Native proficiency
  * Japanese: Professional working proficiency (JLPT N1, 152/180; credential ID: N1A180545J)
  * English: Limited working proficiency (TOEIC Listening & Reading, total score 845)
* **Sport**
  * Yokohama City University Table Tennis Club, 2021.09--2024.03
  * Yokohama City University Medical Table Tennis Club, 2022.08--2024.03
* **Photography**
  
## Publications

  <ul>{% for post in site.publications reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}</ul>
  
## Presentations

{% if site.talk_category %}
  {% for category in site.talk_category %}
    {% assign category_talks = site.talks | where: 'talk_category', category[0] | reverse %}
    {% if category_talks.size > 0 %}
### {{ category[1].title }}

  <ul>{% for post in category_talks %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>
    {% endif %}
  {% endfor %}
{% else %}
  <ul>{% for post in site.talks reversed %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>
{% endif %}

## Notes

  <ul>{% assign sorted_notes = site.notes | sort: 'date' | reverse %}{% for post in sorted_notes %}
    {% include archive-single-talk-cv.html  %}
  {% endfor %}</ul>


## Miscellaneous Experience

* **Awards**
  * Distinguished Student Award (in Japanese: 北海道大学理学院優秀研究奨励賞), Graduate School of Science, Hokkaido University (2026)

* **Fundings**
  * JST SPRING (in Japanese: 次世代研究者挑戦的研究プログラム), Grant Number JPMJSP2119JST, 2026.04--2029.03   

* **Fellowships**
  * April 2026 Hokkaido University EXEX Doctoral Fellowship (JST SPRING program at Hokkaido University), Japan Science and Technology Agency (JST), 2026.04--2029.03

* **Scholarships**
  * JEES Scholarship, 40,000 yen/month for 2 years, Japan Educational Exchanges and Services (JEES), 2021.04--2023.03

* **Tuition Fee Waivers**
  * HU Tuition Fee Waiver (1/4 of the full amount), Hokkaido University, 2025.10--2026.03
  * HU Tuition Fee Waiver (1/4 of the full amount), Hokkaido University, 2025.04--2025.09
  * HU Tuition Fee Waiver (full amount, maximum), Hokkaido University, 2024.10--2025.03
  * YCU Tuition Fee Reduction (1/2 of the full amount, maximum), Yokohama City University, 2023.04--2024.03
  * YCU Tuition Fee Reduction (1/2 of the full amount, maximum), Yokohama City University, 2022.04--2023.04
  * YCU Tuition Fee Reduction (1/2 of the full amount, maximum), Yokohama City University, 2021.04--2022.03
  * YCU Tuition Fee Reduction (full amount, maximum), Yokohama City University, 2020.04--2021.03


