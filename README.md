# chartcn

shadcn/ui charts + Recharts 기반 차트 컴포넌트를 **shadcn registry**로 모아 배포하는 프로젝트입니다.

[chartcn.dev](https://chartcn.dev)의 예시·variant를 최대한 재현하고, pie / radial / radar·애널리틱스·금융·Recharts 잔여 차트까지 확장합니다.  
**Mark 레이어는 쓰지 않습니다.** shadcn `ChartContainer` + Recharts를 직접 조합하는 방식을 따릅니다.

## Why

- 차트마다 예시를 다시 짜지 않고, `npx shadcn add …`로 설치해 바로 쓰기
- 테마는 shadcn 토큰(`--chart-1` … `--chart-5`)을 그대로 사용
- 사람뿐 아니라 **에이전트**가 필요한 차트를 찾고, 서버/클라이언트 렌더 파이프라인에 붙일 수 있게 하기

## Agent-first distribution (planned)

Registry로 차트 블록을 배포한 뒤에는, 에이전트가 Vercel Labs의 [json-render](https://github.com/vercel-labs/json-render) 같은 **동적 렌더링**에서도 쓸 수 있도록 다음을 제공할 예정입니다.

| 제공물 | 역할 |
| --- | --- |
| **Skill** | 어떤 차트/variant를 고를지, props·data shape·설치 명령까지 에이전트에게 안내 |
| **Search CLI** | registry 아이템을 이름·카테고리·키워드로 검색 (`chart-area-stacked`, `cohort-heatmap` 등) |

이 조합이면 에이전트가 예를 들어:

1. CLI/스킬로 필요한 registry item을 찾고  
2. 소스 또는 스펙을 가져온 뒤  
3. **서버 사이드 MDX**에 붙이거나  
4. **클라이언트 사이드 JSON render** 트리에 차트 노드로 넣을 수 있습니다.

즉 registry는 “사람이 복사해 쓰는 컴포넌트 저장소”이면서, 동시에 “에이전트가 조립하는 차트 카탈로그”가 됩니다.

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
| Parity | chartcn.dev의 공개 예시·variant를 체크리스트로 재현 |
| Package | 각 variant = shadcn registry item |
| Theme | shadcn CSS 변수, light/dark 호환 |

chartcn과의 관계: **룩·커버리지는 chartcn을 참고**하고, **배포·구성 방식은 shadcn charts**를 따릅니다. chartcn의 `LineMark` / `BarMark` 같은 자체 Mark 추상화는 도입하지 않습니다.

## Scope (high level)

1. **chartcn 패리티** — area, bar, line, scatter, geo (choropleth), sankey, treemap 및 각 variant  
2. **Polar 확장** — pie, radial, radar를 chartcn 수준의 다양한 variant로  
3. **Analytics** — Mixpanel류 (cohort heatmap, funnel, retention 등)  
4. **Analysis / Finance** — histogram, waterfall, candlestick, bands 등  
5. **Recharts 잔여** — Funnel, Brush, ErrorBar, ReferenceArea 등 미사용  primitive 보강  

세부 일정·아이템 목록은 [Roadmap.md](./Roadmap.md)를 참고하세요.

## Install (목표 형태)

프로젝트 초기화 후 registry가 공개되면 대략 다음처럼 사용할 예정입니다.

```bash
# base
pnpm dlx shadcn@latest add chart

# example variants (URLs TBD)
pnpm dlx shadcn@latest add https://<registry-host>/r/chart-area-stacked.json
pnpm dlx shadcn@latest add https://<registry-host>/r/chart-analytics-cohort-heatmap.json
```

에이전트용 검색 CLI·스킬은 registry 안정화 이후 같은 저장소(또는 인접 패키지)에서 제공합니다.

## Project status

현재는 **문서·로드맵 단계**입니다. 컴포넌트 구현과 registry 배포는 Roadmap Phase 순서대로 진행합니다.

## License

MIT (예정)
