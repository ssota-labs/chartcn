# Roadmap

Core charts → polar → analytics → finance/analysis → Recharts 잔여 → **registry + agent skill/CLI** 순으로 진행합니다.

공통 원칙:

- shadcn `chart` + Recharts 직접 조합 (**Mark 레이어 없음**)
- variant 하나 = registry item 하나
- 네이밍: `chart-<family>-<variant>` (예: `chart-area-stacked-expand`)

---

## Phase 0 — Foundation

- [x] shadcn `chart` 베이스 정착 (`ChartContainer`, `ChartConfig`, Tooltip, Legend)
- [x] 모노레포/앱 스캐폴드 (`apps/web` — Next.js 16 + Fumadocs)
- [ ] `registry.json` / `registry-item.json` 스키마·빌드 파이프라인
- [x] 네이밍·카테고리 컨벤션 고정 (docs 구조 초안)
- [ ] 공통 유틸 (선택): tick format, % stack transform, sample data helpers
- [x] light/dark + `--chart-1`…`5` 토큰 검증

**완료 기준:** `npx shadcn add`로 base chart 설치·렌더 스모크 통과

---

## Phase 1 — Core charts (cartesian + layout + geo)

### 1.1 Area — `chart-area-*`

- [x] basic *(demo in `apps/web`)*
- [ ] multi-series
- [x] stacked *(demo in `apps/web`)*
- [ ] stacked-expand (100%)
- [ ] curve interpolation (linear / monotone / step*)
- [ ] fill opacity / gradient
- [ ] clip-to-active *(호버 + clipPath 근사)*
- [ ] linger
- [ ] with-line overlay
- [ ] dual-axis

### 1.2 Bar — `chart-bar-*`

- [x] basic *(demo in `apps/web`)*
- [x] grouped *(demo in `apps/web`)*
- [ ] stacked
- [ ] stacked-expand
- [ ] styling (radius, active/inactive opacity)
- [ ] cursor band / line + highlight
- [ ] mixed bar + line
- [ ] dual-axis bar + line
- [ ] area + bar combo
- [ ] custom tooltip
- [ ] reference line / annotation

### 1.3 Line — `chart-line-*`

- [x] basic *(demo in `apps/web`)*
- [x] multi-series *(demo in `apps/web`)*
- [ ] curve / step variants
- [ ] dots / activeDot
- [ ] dual-axis
- [ ] crosshair + axis labels
- [ ] closest-series highlight
- [ ] synced multi-panel
- [ ] brush / zoom
- [ ] custom tooltip
- [ ] inverted axis

### 1.4 Scatter — `chart-scatter-*`

- [ ] basic
- [ ] crosshair
- [ ] highlight
- [ ] multi-series
- [ ] bubble (size encoding)
- [ ] with trend line

### 1.5 Treemap — `chart-treemap-*`

- [ ] basic
- [ ] grouped
- [ ] color-by-category
- [ ] highlight
- [ ] reverse
- [ ] custom tooltip
- [ ] styled (gap / radius)

### 1.6 Sankey — `chart-sankey-*`

- [ ] basic
- [ ] traffic flow
- [ ] gradient links
- [ ] custom stroke
- [ ] custom tooltip
- [ ] compact

### 1.7 Geo — `chart-geo-*`

- [ ] choropleth basic (`d3-geo`)
- [ ] choropleth drill-down + breadcrumb
- [ ] point layer
- [ ] tile layer — *후순위*

**완료 기준:** 위 variant가 registry item으로 설치·렌더 가능

---

## Phase 2 — Polar (pie / radial / radar)

### Pie — `chart-pie-*`

- [ ] basic / donut
- [ ] labeled / legend
- [ ] nested / two-level
- [ ] interactive active sector
- [ ] center KPI label
- [ ] percent vs absolute tooltip

### Radial — `chart-radial-*`

- [ ] basic / stacked
- [ ] text / label
- [ ] progress / gauge
- [ ] grid / shape variants

### Radar — `chart-radar-*`

- [ ] basic / multi-series
- [ ] dots / lines-only
- [ ] filled vs stroke
- [ ] grid circle / polygon
- [ ] interactive legend

**완료 기준:** shadcn 기본 polar 대비 충분한 variant 밀도

---

## Phase 3 — Analytics (Mixpanel류)

우선순위 높은 것부터:

- [x] **Cohort heatmap** — 가입 코호트 × period retention 격자
- [x] **Retention curve** — D1 / D7 / D30 곡선
- [x] **Funnel steps** — 단계별 전환·이탈 (`FunnelChart`)
- [x] **Funnel trend** — 전환율 시계열
- [x] **Flow / path** — Sankey 재사용
- [x] Insights line / stacked line
- [x] Segment comparison bar
- [x] Metric + sparkline KPI
- [x] Period comparison overlay (이번 주 vs 지난 주)
- [x] Conversion dual-axis (volume + rate)
- [x] Stickiness (DAU/WAU/MAU)
- [x] Event frequency histogram

**완료 기준:** 코호트·퍼널·리텐션·KPI가 registry로 설치 가능, data shape 문서 포함

---

## Phase 4 — Analysis / Finance

### Data analysis

- [ ] Histogram
- [ ] Box plot *(custom shapes)*
- [ ] Heatmap (calendar / correlation)
- [ ] Waterfall
- [ ] Pareto (bar + cumulative line)
- [ ] Slope chart
- [ ] Small multiples / sparkline grid
- [ ] Bullet chart

### Markets / time series

- [ ] OHLC / Candlestick *(custom shape + ComposedChart)*
- [ ] Volume under price
- [ ] Moving average overlay
- [ ] Bollinger bands
- [ ] MACD / RSI synced panels
- [ ] Drawdown
- [ ] High-low range

**완료 기준:** 분석·금융 대표 차트 설치 가능, Recharts 한계는 custom shape로 문서화

---

## Phase 5 — Recharts leftovers

- [ ] `FunnelChart` 템플릿 정리 (Phase 3과 통합 가능)
- [ ] `Brush` 전용 zoom items
- [ ] `ReferenceArea` / `ReferenceDot`
- [ ] `ErrorBar`
- [ ] Positive / negative (diverging) bar
- [ ] Horizontal / range bar
- [ ] 기타 미사용 cartesian/polar 보강

**의도적 후순위:** full nested Treemap drill, map tile layer

---

## Phase 6 — Registry publish + Agent surface

README에 명시한 agent-first 배포 단계입니다.

### 6.1 Registry

- [ ] 공개 registry 호스트 (또는 GitHub Pages / Vercel static)
- [ ] 카테고리별 `registry.json` 인덱스
- [ ] 설치 URL 안정화 + docs의 Copy/Install 연동
- [ ] namespace (예: `@chartcn/...`) 검토

### 6.2 Search CLI

- [ ] registry 인덱스를 대상으로 이름·태그·카테고리 검색
- [ ] 출력: item name, description, deps, install command, data shape 요약
- [ ] 머신 리드 가능 포맷 (`--json`) 지원 → 에이전트 파이프라인용

### 6.3 Agent skill

- [ ] “어떤 차트를 고를지” 의사결정 가이드
- [ ] variant별 props / sample data / 금기 패턴
- [ ] 서버 MDX·RSC 삽입 패턴
- [ ] 클라이언트 **json-render** (Vercel Labs 등) 노드 매핑 가이드
  - registry item → JSON schema / component map
  - 에이전트가 트리에 차트 노드를 넣고 런타임이 렌더

### 6.4 Integration targets

- [ ] Server: MDX / RSC에 차트 블록 삽입 예시
- [ ] Client: json-render 스타일 동적 트리 예시
- [ ] 동일 registry item이 양쪽에서 재사용됨을 데모

**완료 기준:** 에이전트가 CLI/스킬만으로 차트를 고르고, MDX 또는 json-render에 붙이는 E2E 데모 1개 이상

---

## Suggested build order

```text
0 Foundation
1 Area → Bar → Line
2 Scatter → Treemap → Sankey
3 Pie / Radial / Radar
4 Analytics (cohort → funnel → retention → KPI)
5 Geo choropleth
6 Finance (candle → bands → oscillators)
7 Recharts leftovers
8 Registry publish + Search CLI + Agent skill
```

각 묶음마다: 데모 → registry item 등록 → `shadcn add` 스모크 → (가능하면) 스크린샷/docs 갱신

---

## Out of scope (for now)

- 자체 Mark API (`LineMark`, `BarMark`, …) 재구현
- npm 단일 패키지로 API를 고정하는 배포 (우선 **소스 copy registry**)

---

## Tracking

이 파일의 체크박스를 구현 진행에 맞게 갱신합니다.  
큰 방향 변경이 있으면 README의 Approach / Agent-first 섹션과 함께 업데이트합니다.
