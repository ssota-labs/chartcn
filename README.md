# chartcn

shadcn/ui charts + Recharts 기반 차트 컴포넌트를 **shadcn registry**로 모아 배포하는 프로젝트입니다.

area / bar / line / scatter / geo / sankey / treemap과 그 variant, pie / radial / radar, 애널리틱스·금융·그래프 차트까지 **127개**를 다룹니다.  
**Mark 레이어는 쓰지 않습니다.** 대부분은 shadcn `ChartContainer` + Recharts를 직접 조합하고, 금융·그래프·지도 계열은 캔버스나 Pixi로 직접 그립니다.

## 다른 프로젝트에서 쓰기

설치하면 **소스가 복사**됩니다. 의존할 `chartcn` 패키지 같은 건 없습니다.

### 차트를 직접 고를 때

```bash
npx shadcn@latest add https://chartcn-web.vercel.app/r/chart-area-stacked.json
```

이름은 [문서](https://chartcn-web.vercel.app/docs)에서 보고 고르거나, 전체 목록을 한 번에:

```bash
curl -s https://chartcn-web.vercel.app/r/registry.json | jq -r '.items[].name'
```

### 에이전트에게 맡길 때

스킬을 **한 번만** 설치해두면 됩니다.

```bash
npx skills add tyohnn/chartcn --skill chartcn
```

그다음부터는 그냥 말하면 됩니다 — 에이전트가 레지스트리를 조회해서 고르고, `shadcn add`까지 실행합니다.

> "결제 퍼널 차트 하나 붙여줘"  
> "이 OHLCV 데이터에 맞는 캔들 차트에 RSI까지 얹어줘"

스킬에는 어떤 계열을 언제 쓸지, 데이터 모양, 렌더러가 무엇인지(전부 Recharts가 아닙니다), 캔들 차트 엔진 설정법이 들어 있습니다.

## Why

- 차트마다 예시를 다시 짜지 않고, `npx shadcn add …`로 설치해 바로 쓰기
- 테마는 shadcn 토큰(`--chart-1` … `--chart-5`)을 그대로 사용
- 사람뿐 아니라 **에이전트**가 필요한 차트를 찾고, 서버/클라이언트 렌더 파이프라인에 붙일 수 있게 하기

## Agent-first distribution

Registry + search CLI + agent skill are available (Phase 6). Agents can use Vercel Labs–style [json-render](https://github.com/vercel-labs/json-render) trees or MDX/RSC.

| 제공물 | 역할 |
| --- | --- |
| **Registry** | `apps/web/registry/` — `npx shadcn add https://chartcn-web.vercel.app/r/<name>.json` (local: `/r/<name>.json`) |
| **Skill** | `skills/chartcn/SKILL.md` — variant choice, data shapes, MDX + json-render |
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

## 이 저장소에서 개발할 때

`pnpm dev`를 띄우면 Next 앱이 배포본과 **같은 페이로드**를 `http://localhost:3000`에서 서빙합니다. 레지스트리 자체를 손볼 때는 그쪽을 가리키세요.

```bash
pnpm dlx shadcn@latest add http://localhost:3000/r/chart-bar-grouped.json

# 검색은 저장소 안에서만 동작합니다 (로컬 registry.json을 읽음)
pnpm chartcn-search stacked
pnpm chartcn-search --category analytics --json
```

`CHARTCN_REGISTRY_URL`은 **생성되는 install 명령의 호스트만** 바꿉니다. 서빙에는 영향이 없고, 포크나 프리뷰 배포에서만 필요합니다.

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

우리가 배포하는 스킬은 `skills/chartcn/`에 있습니다. `.agents/skills/`는 [skills.sh](https://skills.sh)로 설치해 쓰는 남의 스킬들 자리입니다.

## Project status

All 127 chart variants are registered in the shadcn registry (`status: ready`) and installable via `npx shadcn add`. Remaining polish items follow [Roadmap.md](./Roadmap.md).
## License

MIT (예정)
