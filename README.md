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

### 빌드 프로세스 개요

electron-builder를 사용하여 각 플랫폼별 배포 파일을 생성합니다.
빌드 설정은 `package.json`의 `build` 필드에 정의되어 있습니다.

```
npm run electron:build
  └─> next build (Next.js 정적 파일 생성)
  └─> electron-builder (플랫폼별 패키징)
```

---

### macOS 빌드

#### 빌드 환경
- **필수**: macOS 환경 (크로스 컴파일 불가)
- **권장**: Xcode Command Line Tools 설치

#### 빌드 타겟 옵션 (`package.json` > `build.mac.target`)

| Target | 설명 | 결과물 |
|--------|------|--------|
| `dmg` | 디스크 이미지 (배포용 권장) | `Kanban Board-x.x.x-arm64.dmg` |
| `dir` | 앱 폴더만 생성 (테스트용) | `mac-arm64/Kanban Board.app` |
| `zip` | ZIP 압축 파일 | `Kanban Board-x.x.x-arm64-mac.zip` |
| `pkg` | 설치 패키지 | `Kanban Board-x.x.x.pkg` |

#### 빌드 명령어

```bash
# 기본 빌드 (package.json 설정 사용)
npm run electron:build

# 특정 타겟 지정
npx electron-builder --mac dmg
npx electron-builder --mac dir
npx electron-builder --mac zip

# 아키텍처 지정
npx electron-builder --mac --arm64    # Apple Silicon (M1/M2/M3)
npx electron-builder --mac --x64      # Intel
npx electron-builder --mac --universal # 유니버설 바이너리 (둘 다 포함)
```

#### 빌드 결과물 위치
```
dist/
├── mac-arm64/Kanban Board.app      # Apple Silicon 앱
├── mac/Kanban Board.app            # Intel 앱
├── Kanban Board-1.0.0-arm64.dmg    # DMG 파일
└── Kanban Board-1.0.0-arm64.dmg.blockmap
```

#### 코드 서명 (배포 시 필수)

코드 서명 없이 빌드하면 다른 Mac에서 "확인되지 않은 개발자" 경고가 표시됩니다.

```bash
# 서명 없이 빌드 (개발/테스트용)
CSC_IDENTITY_AUTO_DISCOVERY=false npm run electron:build

# Apple Developer 인증서로 서명 (배포용)
# 1. Apple Developer Program 가입 필요 ($99/년)
# 2. "Developer ID Application" 인증서 발급
# 3. Keychain에 인증서 설치 후 빌드하면 자동 서명
```

#### macOS 특이사항
- **APFS vs HFS+**: arm64에서는 APFS 포맷의 DMG만 생성 가능 (macOS 10.12+ 지원)
- **Gatekeeper**: 서명되지 않은 앱은 `시스템 환경설정 > 보안`에서 수동 허용 필요
- **Notarization**: App Store 외부 배포 시 Apple 공증 권장 (`electron-notarize` 패키지 사용)

---

### Windows 빌드

#### 빌드 환경

| 빌드 환경 | 가능 여부 | 비고 |
|----------|----------|------|
| Windows | **권장** | 모든 기능 정상 작동 |
| macOS | 가능 | Wine 설치 필요 |
| Linux | 가능 | Wine 설치 필요 |

#### 빌드 타겟 옵션 (`package.json` > `build.win.target`)

| Target | 설명 | 결과물 |
|--------|------|--------|
| `nsis` | 설치 마법사 (권장) | `Kanban Board Setup x.x.x.exe` |
| `nsis-web` | 웹 인스톨러 (작은 용량) | 설치 시 다운로드 |
| `portable` | 설치 불필요 실행 파일 | `Kanban Board x.x.x.exe` |
| `msi` | Windows Installer | `Kanban Board x.x.x.msi` |
| `zip` | ZIP 압축 | `Kanban Board-x.x.x-win.zip` |

#### 빌드 명령어

```bash
# Windows에서 실행
npm run electron:build

# macOS/Linux에서 크로스 컴파일
npx electron-builder --win

# 특정 타겟 지정
npx electron-builder --win nsis
npx electron-builder --win portable
npx electron-builder --win --x64     # 64비트
npx electron-builder --win --ia32    # 32비트
```

#### 크로스 컴파일 설정 (macOS/Linux에서 Windows 빌드)

```bash
# macOS - Wine 설치
brew install --cask wine-stable

# Ubuntu/Debian - Wine 설치
sudo dpkg --add-architecture i386
sudo apt update
sudo apt install wine64 wine32

# 설치 확인
wine --version
```

#### 빌드 결과물 위치
```
dist/
├── Kanban Board Setup 1.0.0.exe       # NSIS 인스톨러
├── Kanban Board Setup 1.0.0.exe.blockmap
└── win-unpacked/                       # 압축 해제된 앱 폴더
```

#### 코드 서명 (배포 시 권장)

서명되지 않은 EXE는 Windows SmartScreen 경고가 표시됩니다.

```bash
# 환경 변수로 인증서 설정
export CSC_LINK="path/to/certificate.pfx"
export CSC_KEY_PASSWORD="인증서비밀번호"
npm run electron:build

# 또는 package.json에서 설정
# "build": {
#   "win": {
#     "certificateFile": "path/to/cert.pfx",
#     "certificatePassword": "password"
#   }
# }
```

#### Windows 특이사항
- **SmartScreen**: 새 인증서는 다운로드 횟수가 쌓여야 경고가 사라짐
- **관리자 권한**: NSIS 기본 설치 경로는 `Program Files` (관리자 권한 필요)
- **Per-User 설치**: `"nsis": { "perMachine": false }` 설정 시 사용자 폴더에 설치

---

### Linux 빌드

```bash
# AppImage 빌드 (대부분의 배포판에서 실행 가능)
npx electron-builder --linux AppImage

# Debian 패키지
npx electron-builder --linux deb

# RPM 패키지 (Fedora/RHEL)
npx electron-builder --linux rpm
```

#### 빌드 결과물 위치
```
dist/
├── Kanban Board-1.0.0.AppImage
├── kanban-board-electron_1.0.0_amd64.deb
└── kanban-board-electron-1.0.0.x86_64.rpm
```

---

### 멀티 플랫폼 동시 빌드

```bash
# 모든 플랫폼 빌드 (각 플랫폼의 네이티브 환경 필요)
npx electron-builder -mwl

# macOS + Windows (macOS에서 실행, Wine 필요)
npx electron-builder --mac --win

# 특정 타겟 조합
npx electron-builder --mac dmg --win nsis --linux AppImage
```

---

### 빌드 문제 해결

| 문제 | 원인 | 해결 방법 |
|------|------|----------|
| `Cannot find module` | 의존성 누락 | `rm -rf node_modules && npm install` |
| `ENOENT .next/standalone` | Next.js 빌드 실패 | `next.config.ts`에 `output: 'standalone'` 확인 |
| Wine 관련 오류 | Wine 미설치/버전 | Wine 재설치 또는 Windows에서 빌드 |
| 코드 서명 실패 | 인증서 없음 | `CSC_IDENTITY_AUTO_DISCOVERY=false` 설정 |
| DMG 생성 실패 | 디스크 공간 부족 | `dist/` 폴더 정리 후 재시도 |

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
