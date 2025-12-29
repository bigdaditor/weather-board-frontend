# Weather Board Frontend

날씨 데이터와 판매 데이터를 연관시켜 관리하고 분석하는 판매 관리 대시보드

## 프로젝트 개요

Weather Board Frontend는 React 기반의 판매 관리 웹 애플리케이션입니다. 달력 인터페이스를 통해 일별 매출을 입력하고, 날씨 데이터와 연계하여 통계를 분석할 수 있습니다.

## 주요 기능

### 1. 매출 입력 (Sale Input)
- 달력 기반 직관적인 매출 입력 인터페이스
- 날짜를 클릭하여 결제 수단별 매출 정보 입력/수정
- 결제 수단 선택 (카드, 현금, 온라인, 기타)
- 하나의 날짜에 여러 결제 수단별 매출 입력 가능
- 달력 셀에는 해당 날짜의 결제 수단별 합산 매출액을 배지로 표시

### 2. 매출 리스트 (Sale List)
- 전체 매출 데이터를 테이블 형식으로 조회
- 날짜, 매출액, 결제 타입, 날씨 정보 표시
- 금액 포맷팅 (천 단위 구분)

### 3. 통계 분석 (Stats)
- 일별 매출액 추이 라인 차트
- 일별 평균 기온 바 차트
- 날씨-매출 데이터 동기화 기능
- 날씨와 판매의 상관관계 시각화

## 기술 스택

### 프론트엔드 프레임워크
- **React** 19.2.0 - 컴포넌트 기반 UI 라이브러리
- **Vite** 7.2.4 - 빌드 도구 및 개발 서버

### UI 라이브러리
- **Material-UI (MUI)** 7.3.5 - Material Design 컴포넌트
- **MUI Icons Material** 7.3.5 - 아이콘
- **Emotion** - CSS-in-JS 스타일링

### 데이터 시각화
- **Chart.js** 4.5.1 - 차트 라이브러리
- **react-chartjs-2** 5.3.1 - React 바인딩

### 라우팅
- **react-router-dom** 7.9.6 - 클라이언트 사이드 라우팅

### 개발 도구
- **ESLint** 9.39.1 - 코드 품질 검사
- **TypeScript** 타입 지원

## 프로젝트 구조

```
weather-board-frontend/
├── src/
│   ├── api/
│   │   └── sale.js                          # API 엔드포인트 정의
│   ├── components/
│   │   ├── calendar/
│   │   │   └── SalesCalendarWithSales.jsx   # 매출 입력 캘린더
│   │   ├── layout/
│   │   │   └── TopNav.jsx                   # 상단 네비게이션
│   │   ├── Calendar.jsx                     # 캘린더 유틸리티
│   │   └── SaleDialog.jsx                   # 매출 입력 다이얼로그
│   ├── hooks/
│   │   └── useSalesCalendar.js              # 매출 캘린더 로직
│   ├── pages/
│   │   ├── SaleInputPage.jsx                # 매출 입력 페이지
│   │   ├── StatsPage.jsx                    # 통계 분석 페이지
│   │   ├── SaleListPage.jsx                 # 매출 리스트 페이지
│   │   └── SalesCalendarPage.jsx            # 캘린더 컴포넌트
│   ├── styles/
│   │   └── weatherboard.css                 # 전역 스타일
│   ├── App.jsx                              # 라우팅 설정
│   └── main.jsx                             # 엔트리 포인트
├── package.json
├── vite.config.js
└── index.html
```

## 아키텍처 패턴

### 관심사 분리 (Separation of Concerns)
- **비즈니스 로직**: 커스텀 훅 (`useSalesCalendar.js`)에서 관리
- **UI 컴포넌트**: 순수 렌더링만 담당
- **API 통신**: 별도 모듈 (`api/sale.js`)로 분리

### 주요 컴포넌트

#### SalesCalendarWithSales
매출 입력을 위한 통합 컴포넌트
- `useSalesCalendar` 훅으로 비즈니스 로직 관리
- `SalesCalendarPage`와 `SaleDialog` 조합

#### useSalesCalendar Hook
매출 데이터 관리를 위한 커스텀 훅
- 월별 데이터 필터링
- 결제 수단별 매출 생성/수정 로직
- 동일 날짜의 여러 결제 수단 매출 관리
- 일별 합산 매출 계산
- 다이얼로그 상태 관리

#### 주요 함수
- `formatDateKey()`: 날짜를 "YYYY-MM-DD" 형식으로 변환
- `handleDayClick()`: 날짜 클릭 시 다이얼로그 열기
- `handleSave()`: 매출 생성/수정
- `fetchSales()`: 매출 데이터 조회

## API 엔드포인트

### Base URL
```
기본값: http://localhost:8000
환경 변수: VITE_API_BASE_URL
```

### 엔드포인트

```
GET  /sale              # 매출 목록 조회
POST /sale              # 매출 생성
PATCH /sale/{id}        # 매출 수정

GET  /stats/sales       # 통계 데이터 조회
POST /sync/weather      # 날씨 데이터 동기화
```

### 데이터 구조

#### 매출 데이터 (Sale)
```javascript
{
  id: number,
  input_date: string,      // "YYYY-MM-DD"
  amount: number,
  payment_type: string     // "card" | "cash" | "online" | "etc"
}
```

**참고**: 하나의 날짜에 여러 결제 수단별 매출 레코드가 존재할 수 있습니다. 달력에는 동일 날짜의 모든 매출을 합산하여 표시합니다.

#### 통계 데이터 (Stats)
```javascript
{
  date: string,           // "YYYY-MM-DD"
  total_amount: number,
  avg_temp: number
}
```

## 라우팅

```
/                    → 매출 입력 페이지 (리다이렉트)
/sales-input         → 매출 입력 페이지
/stats               → 통계 분석 페이지
/sales-list          → 매출 리스트 페이지
```

## 개발 가이드

### 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 린트
npm run lint

# 프리뷰
npm run preview
```

### 환경 변수

`.env` 파일을 생성하여 API 서버 주소를 설정할 수 있습니다:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 코드 스타일

- ESLint 설정을 따릅니다
- 함수형 컴포넌트와 React Hooks를 사용합니다
- CSS-in-JS (Emotion) 또는 전역 CSS 파일을 사용합니다
- 비즈니스 로직은 커스텀 훅으로 분리합니다

## 주요 개발 히스토리

```
ab54e8e → 글씨 크기 수정
6e907a0 → API 분리
01f2096 → 비즈니스 로직과 UI 분리
4799e49 → 커스텀 훅 추가 (useSalesCalendar)
5af1ca8 → 매출 입력 날짜 표시 달력 컴포넌트 생성
```

### 주요 개선 사항
1. **API 분리**: API 호출 로직을 별도 모듈로 관리
2. **관심사 분리**: 비즈니스 로직과 UI 컴포넌트 분리
3. **커스텀 훅 도입**: 상태 관리 로직의 재사용성 향상
4. **UI/UX 개선**: 글씨 크기 최적화
5. **결제 수단별 매출 관리**: 하나의 날짜에 여러 결제 수단별 매출 입력 및 합산 표시 (기타 옵션 추가)

## 주요 기능 상세

### 달력 기반 매출 입력
- 월별 달력 뷰에서 날짜 클릭
- 결제 수단별 매출 입력 (카드, 현금, 온라인, 기타)
- 하나의 날짜에 여러 결제 수단의 매출 데이터를 각각 입력
- 달력 셀에는 해당 날짜의 결제 수단별 합산 매출액을 배지로 표시
- 이미 입력된 날짜를 클릭하면 해당 날짜의 결제 수단별 매출 조회 및 수정 가능
- MUI Dialog를 사용한 입력 폼

### 데이터 시각화
- Chart.js 라인 차트: 일별 매출 추이
- Chart.js 바 차트: 일별 평균 기온
- 반응형 차트 렌더링

### 매출 리스트
- MUI Table 컴포넌트 사용
- 날짜, 매출액, 결제 타입, 날씨 요약 표시
- 금액 3자리 쉼표 구분 포맷팅

## 향후 개선 사항

### 미구현 기능
- 통계 API 엔드포인트 연동
- 날씨 데이터 동기화 기능 완성
- 날짜 범위 선택 필터
- 엑셀 내보내기 기능

### 개선 가능한 부분
- TypeScript 마이그레이션
- 테스트 코드 작성
- 에러 바운더리 추가
- 로딩 상태 개선
- 반응형 디자인 최적화

## 라이선스

Private Project

## 연락처

프로젝트 관련 문의는 리포지토리 이슈를 통해 해주세요.
