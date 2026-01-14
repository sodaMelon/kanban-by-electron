# Kanban Board

Trello 스타일의 칸반 보드 데스크톱 애플리케이션입니다.

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Desktop**: Electron 28
- **Styling**: Tailwind CSS 4
- **Drag & Drop**: @dnd-kit
- **Icons**: Lucide React

## Features

- 드래그 앤 드롭으로 카드 이동
- 컬럼 추가/삭제
- 카드 추가/편집/삭제
- 깔끔한 macOS 스타일 UI

## Getting Started

### Prerequisites

- Node.js 18+
- npm 또는 yarn

### Installation

```bash
# 의존성 설치
npm install
```

### Development

```bash
# Next.js 개발 서버만 실행
npm run dev

# Electron + Next.js 동시 실행 (개발 모드)
npm run electron:dev
```

## Build

### macOS 빌드

```bash
# 빌드 실행
npm run electron:build

# 빌드 결과물 위치
# dist/mac-arm64/Kanban Board.app (Apple Silicon)
# dist/mac/Kanban Board.app (Intel)
```

### Windows 빌드

Windows에서 빌드하거나 크로스 컴파일이 필요합니다.

```bash
# Windows에서 실행
npm run electron:build

# 또는 macOS/Linux에서 Windows용 빌드 (Wine 필요)
npx electron-builder --win

# 빌드 결과물 위치
# dist/Kanban Board Setup x.x.x.exe (NSIS 인스톨러)
```

**Windows 크로스 컴파일 요구사항:**
- macOS: `brew install wine-stable`
- Linux: `sudo apt install wine`

### Linux 빌드

```bash
npx electron-builder --linux

# 빌드 결과물 위치
# dist/Kanban Board-x.x.x.AppImage
```

## Project Structure

```
├── electron/          # Electron 메인 프로세스
│   ├── main.js        # 메인 엔트리
│   └── preload.js     # 프리로드 스크립트
├── src/
│   ├── app/           # Next.js App Router
│   ├── components/    # React 컴포넌트
│   ├── hooks/         # 커스텀 훅
│   ├── lib/           # 유틸리티
│   └── types/         # TypeScript 타입
├── public/            # 정적 파일
└── package.json
```

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Next.js 개발 서버 |
| `npm run build` | Next.js 프로덕션 빌드 |
| `npm run electron:dev` | Electron 개발 모드 |
| `npm run electron:build` | Electron 앱 빌드 |
| `npm run electron:start` | Electron 앱 실행 |

## License

MIT
