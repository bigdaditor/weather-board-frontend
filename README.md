# Weather Board 📊☀️

날씨 데이터와 판매 데이터를 연관시켜 관리하고 분석하는 판매 관리 대시보드

## 프로젝트 소개

Weather Board는 날씨와 매출의 상관관계를 분석할 수 있는 웹 애플리케이션입니다. 달력 기반의 직관적인 UI를 통해 일별 매출을 입력하고, 날씨 데이터와 연계하여 통계를 시각화합니다.

소상공인이나 매장 운영자가 날씨 변화에 따른 매출 패턴을 파악하여 더 나은 경영 의사결정을 내릴 수 있도록 돕습니다.

## 주요 기능

### 📅 매출 입력 (Sales Input)
- 달력 기반의 직관적한 매출 입력 인터페이스
- 결제 수단별 매출 관리 (카드, 현금, 온라인, 기타)
- 하나의 날짜에 여러 결제 수단별 매출 데이터 입력 가능
- 달력 셀에 일별 합산 매출액 배지 표시
- 입력된 데이터 조회 및 수정 기능

### 📈 통계 분석 (Statistics)
- 일별 매출액 추이 라인 차트
- 일별 평균 기온 바 차트
- 날씨-매출 데이터 동기화 기능
- 날씨와 판매의 상관관계 시각화

### 📋 매출 리스트 (Sales List)
- 전체 매출 데이터 테이블 뷰
- 날짜, 매출액, 결제 타입, 날씨 정보 통합 표시
- 금액 포맷팅 (천 단위 구분)

## 기술 스택

### Frontend
![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.2.4-646CFF?logo=vite&logoColor=white)
![Material-UI](https://img.shields.io/badge/MUI-7.3.5-007FFF?logo=mui&logoColor=white)

- **React 19.2.0** - 컴포넌트 기반 UI 라이브러리
- **Vite 7.2.4** - 빌드 도구 및 개발 서버
- **Material-UI 7.3.5** - Material Design 컴포넌트
- **Chart.js 4.5.1** - 데이터 시각화
- **react-router-dom 7.9.6** - 클라이언트 사이드 라우팅
- **Emotion** - CSS-in-JS 스타일링

### Code Quality
- **ESLint** - 코드 품질 검사
- **TypeScript** 타입 지원

## 주요 구현 내용

### 1. 결제 수단별 매출 관리
하나의 날짜에 여러 결제 수단(카드, 현금, 온라인, 기타)별로 매출을 입력할 수 있으며, 달력에는 해당 날짜의 모든 매출을 합산하여 표시합니다.

### 2. 커스텀 훅을 통한 상태 관리
`useSalesCalendar` 훅을 통해 매출 데이터 CRUD, 월별 필터링, 다이얼로그 상태 관리 등의 비즈니스 로직을 캡슐화했습니다.

### 3. Chart.js를 활용한 데이터 시각화
매출 추이와 날씨 데이터를 직관적으로 파악할 수 있도록 반응형 차트를 구현했습니다.

## 라이선스

Private Project

---

**개발자**: bigdaditor