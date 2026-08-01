# chartcn

shadcn/ui charts + Recharts 기반 차트 컴포넌트를 **shadcn registry**로 모아 배포하는 프로젝트입니다.

area / bar / line / scatter / geo / sankey / treemap과 그 variant, pie / radial / radar, 애널리틱스·금융·Recharts 잔여 차트까지 확장합니다.  
**Mark 레이어는 쓰지 않습니다.** shadcn `ChartContainer` + Recharts를 직접 조합하는 방식을 따릅니다.

## Why

- 차트마다 예시를 다시 짜지 않고, `npx shadcn add …`로 설치해 바로 쓰기
- 테마는 shadcn 토큰(`--chart-1` … `--chart-5`)을 그대로 사용
- 사람뿐 아니라 **에이전트**가 필요한 차트를 찾고, 서버/클라이언트 렌더 파이프라인에 붙일 수 있게 하기

## Agent-first distribution

Registry + search CLI + agent skill are available (Phase 6). Agents can use Vercel Labs–style [json-render](https://github.com/vercel-labs/json-render) trees or MDX/RSC.

| 제공물 | 역할 |
| --- | --- |
| **Registry** | `apps/web/registry/` — `npx shadcn add https://<CHARTCN_REGISTRY_HOST>/r/<name>.json` (local: `/r/<name>.json`) |
| **Skill** | `.agents/skills/chartcn/SKILL.md` — variant choice, data shapes, MDX + json-render |
| **Search CLI** | `pnpm chartcn-search` — name / tag / category; `--json` for agents |

```text
Agent
  ├─ search CLI  →  registry item 선택
  ├─ skill       →  data shape / props / 설치 방법
  └─ render
        ├─ Server: MDX / RSC에 차트 블록 삽입
        └─ Client: json-render 등 동적 트리에 차트 노드 매핑
```
## Approach

| 원칙 | 내용 |
| --- | --- |
| Base | 공식 shadcn `chart` (`ChartContainer`, `ChartConfig`, Tooltip, Legend) |
| Engine | Recharts를 감싸지 않고 직접 조합 (Mark API 없음) |
| Package | 각 variant = shadcn registry item |
| Theme | shadcn CSS 변수, light/dark 호환 |

## Scope (high level)

1. **Core charts** — area, bar, line, scatter, geo (choropleth), sankey, treemap 및 각 variant  
2. **Polar** — pie, radial, radar의 다양한 variant  
3. **Analytics** — Mixpanel류 (cohort heatmap, funnel, retention 등)  
4. **Analysis / Finance** — histogram, waterfall, candlestick, bands 등  
5. **Recharts 잔여** — Funnel, Brush, ErrorBar, ReferenceArea 등 미사용 primitive 보강  

세부 일정·아이템 목록은 [Roadmap.md](./Roadmap.md)를 참고하세요.

## Install

Host is TBD — use `CHARTCN_REGISTRY_URL` or the placeholder below. Local demo serves the same payloads from the Next app.

```bash
# base
pnpm dlx shadcn@latest add chart

# foundation variants
pnpm dlx shadcn@latest add https://<CHARTCN_REGISTRY_HOST>/r/chart-area-stacked.json
pnpm dlx shadcn@latest add http://localhost:3000/r/chart-bar-grouped.json

# search (in-repo index)
pnpm chartcn-search stacked
pnpm chartcn-search --category analytics --json
```
## Demo app

Next.js 16 + Fumadocs 데모는 `apps/web`에 있습니다.

```bash
pnpm install
pnpm dev
```

- Home: `/`
- Charts docs: `/docs/charts` (area / bar / line starter demos)
- Registry docs: `/docs/registry` (install, CLI, skill, MDX + json-render demos)
- Registry API: `/r/registry.json`, `/r/<name>.json`

Agent skills live under `.agents/skills/` (chartcn + [skills.sh](https://skills.sh) helpers).

## Project status

All 117 chart variants are registered in the shadcn registry (`status: ready`) and installable via `npx shadcn add`. Remaining polish items follow [Roadmap.md](./Roadmap.md).
## License

MIT (예정)
