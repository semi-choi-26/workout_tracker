# 💪 운동 기록 앱 v2.0

TypeScript + Expo Router로 재구성된 프로페셔널 운동 기록 애플리케이션입니다.

## ✨ 주요 기능

### 기본 기능
- ✅ 운동 이름, 무게, 개수 기록
- ✅ 같은 운동 이름이면 세트를 추가
- ✅ 새로운 운동이면 새로 생성
- ✅ 로컬 저장소(AsyncStorage) 사용으로 오프라인 동작
- ✅ 운동별 세트 관리 및 삭제
- ✅ 깔끔한 UI/UX

### 🆕 v2.0 신규 기능
- 🏆 **개인 기록(PR) 추적**
  - 운동별 최고 중량 자동 기록
  - 최고 볼륨(무게 × 횟수) 추적
  - 신기록 달성 시 🏆 배지 표시
  - 총 볼륨 및 세트 통계
- 📱 **탭 네비게이션**
  - 운동 기록 탭
  - 개인 기록 탭
- 💻 **TypeScript 지원**
  - 완전한 타입 안정성
  - 더 나은 개발자 경험
- 🏗️ **모듈화된 구조**
  - 컴포넌트 분리
  - 커스텀 훅
  - 유틸리티 함수

## 시작하기

### 필수 요구사항

- Node.js (v18 이상)
- npm 또는 yarn
- Expo Go 앱 (모바일 테스트용)

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 시작
npm start
```

### 실행 방법

1. **Android 에뮬레이터**
   ```bash
   npm run android
   ```

2. **iOS 시뮬레이터** (macOS만 가능)
   ```bash
   npm run ios
   ```

3. **웹 브라우저**
   ```bash
   npm run web
   ```

4. **실제 기기 (Expo Go 앱)**
   - Expo Go 앱 설치 ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) / [iOS](https://apps.apple.com/app/expo-go/id982107779))
   - `npm start` 실행 후 QR 코드 스캔

## GitHub Actions 자동 빌드

이 프로젝트는 GitHub Actions를 사용하여 자동으로 Android APK를 빌드합니다.

### 설정 방법

1. **Expo 계정 생성**
   - [Expo.dev](https://expo.dev)에서 계정 생성

2. **Expo 액세스 토큰 생성**
   ```bash
   npx eas-cli login
   npx eas-cli build:configure
   ```
   - [Expo Access Tokens](https://expo.dev/accounts/[username]/settings/access-tokens)에서 토큰 생성

3. **GitHub Secrets 설정**
   - GitHub 저장소 → Settings → Secrets and variables → Actions
   - `EXPO_TOKEN` 이름으로 위에서 생성한 토큰 추가

4. **빌드 실행**
   - `main` 또는 `master` 브랜치에 푸시하면 자동으로 빌드 시작
   - 또는 GitHub Actions 탭에서 수동으로 실행

5. **APK 다운로드**
   - [Expo 대시보드](https://expo.dev)에서 빌드 상태 확인
   - 빌드 완료 후 APK 다운로드

## 프로젝트 구조

```
workout-tracker/
├── src/
│   ├── app/                    # Expo Router (화면)
│   │   ├── _layout.tsx         # 루트 레이아웃
│   │   └── (tabs)/             # 탭 네비게이션
│   │       ├── _layout.tsx     # 탭 레이아웃
│   │       ├── index.tsx       # 운동 기록 화면
│   │       └── records.tsx     # 개인 기록 화면
│   ├── components/             # 재사용 컴포넌트
│   │   ├── WorkoutInput.tsx    # 운동 입력 폼
│   │   ├── WorkoutCard.tsx     # 운동 카드
│   │   ├── SetRow.tsx          # 세트 행
│   │   ├── PRBadge.tsx         # 신기록 배지
│   │   └── PersonalRecordCard.tsx  # PR 카드
│   ├── hooks/                  # 커스텀 훅
│   │   ├── useWorkouts.ts      # 운동 관리
│   │   └── usePersonalRecords.ts  # PR 계산
│   ├── utils/                  # 유틸리티
│   │   └── workoutUtils.ts     # 계산 함수
│   └── types/                  # TypeScript 타입
│       └── workout.ts          # 데이터 타입
├── app.json                    # Expo 설정
├── tsconfig.json               # TypeScript 설정
├── eas.json                    # EAS Build 설정
└── package.json                # 의존성 관리
```

## 데이터 저장 구조

```javascript
{
  "벤치프레스": {
    "name": "벤치프레스",
    "sets": [
      { "weight": 60, "reps": 10, "timestamp": "2026-10-13T..." },
      { "weight": 70, "reps": 8, "timestamp": "2026-10-13T..." }
    ]
  },
  "스쿼트": {
    "name": "스쿼트",
    "sets": [
      { "weight": 100, "reps": 10, "timestamp": "2026-10-13T..." }
    ]
  }
}
```

## 사용 방법

1. **운동 기록 추가**
   - 운동 이름 입력 (예: 벤치프레스)
   - 무게(kg)와 개수(회) 입력
   - "기록 추가" 버튼 클릭

2. **같은 운동 세트 추가**
   - 이미 기록된 운동 이름 입력
   - 새로운 무게와 개수 입력
   - 자동으로 기존 운동에 세트 추가됨

3. **기록 삭제**
   - 운동 카드의 🗑️ 아이콘: 해당 운동의 모든 세트 삭제
   - 세트별 × 버튼: 특정 세트만 삭제

## 기술 스택

- **TypeScript 6.0.3** - 타입 안전성
- **React 19.2.3** - UI 라이브러리
- **React Native 0.86.3** - 크로스 플랫폼 모바일 프레임워크
- **Expo SDK 57** - React Native 개발 플랫폼
- **Expo Router** - 파일 기반 라우팅
- **AsyncStorage** - 로컬 데이터 저장
- **GitHub Actions** - CI/CD 자동화
- **EAS Build** - Expo 클라우드 빌드 서비스

## 개발 도구

```bash
# TypeScript 타입 체크
npm run typecheck

# Expo 진단
npx expo-doctor
```

## 라이선스

MIT

## 기여

이슈와 풀 리퀘스트는 언제나 환영합니다!
