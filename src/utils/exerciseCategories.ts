export enum ExerciseCategory {
  CHEST = '가슴',
  BACK = '등',
  SHOULDERS = '어깨',
  ARMS = '팔',
  LEGS = '하체',
  CORE = '코어',
  CARDIO = '유산소',
  FULL_BODY = '전신',
}

// 운동 이름으로 카테고리 자동 감지를 위한 키워드
export const EXERCISE_KEYWORDS: Record<ExerciseCategory, string[]> = {
  [ExerciseCategory.CHEST]: [
    '벤치프레스', '벤치', '체스트프레스', '체스트', '가슴',
    '푸시업', '팔굽혀펴기', '덤벨프레스', '인클라인', '디클라인',
    '펙덱', '플라이', '딥스', '케이블크로스오버', 'bench', 'chest',
    'press', 'pushup', 'push-up', 'fly', 'dip'
  ],
  [ExerciseCategory.BACK]: [
    '데드리프트', '데드', '풀업', '턱걸이', '로우', '렛풀다운',
    '바벨로우', '덤벨로우', '시티드로우', '등', '티바로우',
    'deadlift', 'pullup', 'pull-up', 'row', 'lat', 'back'
  ],
  [ExerciseCategory.SHOULDERS]: [
    '숄더프레스', '숄더', '어깨', '레터럴레이즈', '프론트레이즈',
    '리어델트', '밀리터리프레스', '오버헤드프레스', '사이드레터럴',
    'shoulder', 'press', 'raise', 'lateral', 'overhead', 'military'
  ],
  [ExerciseCategory.ARMS]: [
    '컬', '바이셉', '트라이셉', '이두', '삼두', '팔',
    '덤벨컬', '바벨컬', '해머컬', '익스텐션', '킥백',
    '프리쳐컬', '케이블컬', 'curl', 'bicep', 'tricep', 'extension',
    'hammer', 'preacher', 'kickback'
  ],
  [ExerciseCategory.LEGS]: [
    '스쿼트', '레그프레스', '런지', '레그익스텐션', '레그컬',
    '카프레이즈', '종아리', '힙쓰러스트', '하체', '다리',
    '프론트스쿼트', '백스쿼트', '불가리안', '레그', 'squat',
    'leg', 'lunge', 'calf', 'hip', 'thrust', 'extension'
  ],
  [ExerciseCategory.CORE]: [
    '플랭크', '크런치', '복근', '레그레이즈', '러시안트위스트',
    '사이드플랭크', '윗몸일으키기', '코어', '싯업', '행잉레그레이즈',
    'plank', 'crunch', 'abs', 'core', 'sit-up', 'situp',
    'leg raise', 'russian twist', 'hanging'
  ],
  [ExerciseCategory.CARDIO]: [
    '러닝', '달리기', '사이클', '자전거', '로잉',
    '유산소', '트레드밀', '일립티컬', '조깅', '워킹',
    'running', 'cardio', 'cycling', 'rowing', 'treadmill',
    'elliptical', 'jogging', 'walking'
  ],
  [ExerciseCategory.FULL_BODY]: [
    '버피', '클린', '스내치', '전신', '크로스핏',
    '스윙', '케틀벨스윙', '클린앤저크',
    'burpee', 'clean', 'snatch', 'swing', 'crossfit', 'full body'
  ],
};

/**
 * 운동 이름을 분석하여 카테고리 자동 감지
 */
export const detectCategory = (exerciseName: string): ExerciseCategory => {
  const normalized = exerciseName.toLowerCase().trim();

  // 각 카테고리의 키워드를 순회하며 매칭
  for (const [category, keywords] of Object.entries(EXERCISE_KEYWORDS)) {
    if (keywords.some(keyword => normalized.includes(keyword.toLowerCase()))) {
      return category as ExerciseCategory;
    }
  }

  // 매칭되지 않으면 전신 운동으로 분류
  return ExerciseCategory.FULL_BODY;
};

/**
 * 모든 카테고리 목록 반환 (필터용)
 */
export const getAllCategories = (): Array<{
  key: ExerciseCategory;
  label: string;
  emoji: string;
}> => {
  return [
    { key: ExerciseCategory.CHEST, label: '가슴', emoji: '💪' },
    { key: ExerciseCategory.BACK, label: '등', emoji: '🦾' },
    { key: ExerciseCategory.SHOULDERS, label: '어깨', emoji: '🤸' },
    { key: ExerciseCategory.ARMS, label: '팔', emoji: '💪' },
    { key: ExerciseCategory.LEGS, label: '하체', emoji: '🦵' },
    { key: ExerciseCategory.CORE, label: '코어', emoji: '🧘' },
    { key: ExerciseCategory.CARDIO, label: '유산소', emoji: '🏃' },
    { key: ExerciseCategory.FULL_BODY, label: '전신', emoji: '🏋️' },
  ];
};
