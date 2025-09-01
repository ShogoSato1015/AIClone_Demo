import { QAQuestion, Work, CloneProfile, PersonaVector, User } from '@/types';

// Mock User Data
export const mockUser: User = {
  userId: 'user_001',
  nickname: 'ショウゴ',
  anonymityLevel: 'medium',
  createdAt: '2024-01-01T00:00:00Z',
  lastActive: new Date().toISOString()
};

// Mock Persona Vector
export const mockPersona: PersonaVector = {
  userId: 'user_001',
  scores: [
    { tag: '共感', value: 65 },
    { tag: '論理', value: 45 },
    { tag: '冒険', value: 78 },
    { tag: '保守', value: 32 },
    { tag: 'ユーモア', value: 88 },
    { tag: 'ロマン', value: 71 }
  ],
  lastUpdated: new Date().toISOString()
};

// Mock Clone Profile
export const mockClone: CloneProfile = {
  cloneId: 'clone_001',
  ownerId: 'user_001',
  personaSnapshot: mockPersona,
  look: {
    hair: 'Aicon名',
    eye: 'クール',
    acc: '丸メガネ',
    mood: 'にっこり',
    style: 'カジュアル'
  },
  titleBadges: ['新人コメディアン', 'センス抜群'],
  level: 3,
  experience: 1250,
  createdAt: '2024-01-01T00:00:00Z',
  lastUpdated: new Date().toISOString()
};

// Q&A Questions for 漫才 theme
export const mockQuestionsComedy: QAQuestion[] = [
  {
    id: 'q1',
    theme: '漫才',
    label: '初デートで絶対NGは？',
    choices: ['遅刻', '無言', '割り勘拒否', 'スマホばかり見る'],
    type: 'choice'
  },
  {
    id: 'q2',
    theme: '漫才',
    label: 'ツッコミで大事なのは？',
    choices: ['論理', '温かさ', 'スピード', '声の大きさ'],
    type: 'choice'
  },
  {
    id: 'q3',
    theme: '漫才',
    label: 'あなたの恋愛失敗談を一言で教えて！',
    choices: [],
    type: 'text'
  }
];

// Q&A Questions for ラブソング theme
export const mockQuestionsLove: QAQuestion[] = [
  {
    id: 'ql1',
    theme: 'ラブソング',
    label: '雨の日の思い出といえば？',
    choices: ['静かな喫茶店', '二人の傘', '窓辺の読書', '映画館デート'],
    type: 'choice'
  },
  {
    id: 'ql2',
    theme: 'ラブソング',
    label: '愛を表現するなら？',
    choices: ['言葉で伝える', '行動で示す', '歌で歌う', '手紙を書く'],
    type: 'choice'
  },
  {
    id: 'ql3',
    theme: 'ラブソング',
    label: '大切な人に贈りたい一言',
    choices: [],
    type: 'text'
  }
];

// Mock Works (Generated Content)
export const mockWorks: Work[] = [
  {
    workId: 'work_001',
    theme: '漫才',
    pairingId: 'pair_001',
    script: {
      tsukami: 'A「昨日初デート行ってきたんですよ」 B「おお、どうでした？」',
      tenkai:
        'A「完璧だったんです！時間通りに来て、スマホも見ずに...」 B「素晴らしいじゃないですか！」 A「ええ、相手は来ませんでしたけど」',
      ochi: 'B「え？！それ一人で完璧にしただけじゃないですか！」'
    },
    ogMeta: {
      title: '初デートの完璧な準備 - Aicon漫才',
      desc: '完璧すぎる準備が生んだ予想外のオチ！',
      image: '/api/og/work_001'
    },
    stats: {
      plays: 1245,
      likes: 892,
      comments: 67,
      shares: 234
    },
    createdAt: '2024-01-01T10:30:00Z'
  },
  {
    workId: 'work_002',
    theme: 'ラブソング',
    pairingId: 'pair_002',
    lyrics: {
      aMelody: ['雨の音が窓を叩いて', '君の声を思い出す', 'あの日の約束まだ胸に', '大切に抱えてる'],
      chorus: ['傘一つで寄り添って', '歩いた道を今も', '心の中で歌ってる', '君への愛を']
    },
    ogMeta: {
      title: '雨音の約束 - Aiconデュエット',
      desc: '雨の日の思い出を歌った心温まるラブソング',
      image: '/api/og/work_002'
    },
    stats: {
      plays: 2108,
      likes: 1654,
      comments: 89,
      shares: 445
    },
    createdAt: '2024-01-01T14:20:00Z'
  }
];

// Mini Game Scenarios
export const mockDramaScenario = {
  title: '初デートシミュレーション',
  steps: [
    {
      step: 1,
      situation: '待ち合わせ場所に到着！相手はまだ来ていません。',
      choices: ['早めに到着して周りを見渡す', 'カフェで待つ', 'スマホをいじって時間をつぶす']
    },
    {
      step: 2,
      situation: '相手が到着！第一声は？',
      choices: ['「お疲れさま！」', '「今日はありがとう！」', '「遅くない？」']
    },
    {
      step: 3,
      situation: '食事の場所を決めることに。あなたは？',
      choices: ['相手に選んでもらう', '事前に調べた店を提案', '近くの店を適当に']
    }
  ]
};

export const mockRhythmGame = {
  title: 'ハートビート・シンフォニー',
  description: '音楽のリズムに合わせて感情を表現しよう！',
  beats: [
    { time: 1000, type: 'love', intensity: 'gentle' },
    { time: 2000, type: 'excitement', intensity: 'medium' },
    { time: 3000, type: 'tenderness', intensity: 'soft' },
    { time: 4000, type: 'passion', intensity: 'strong' }
  ]
};

// Daily Themes
export const dailyThemes = [
  { theme: '漫才', title: '初デートの失敗談', subtitle: '笑いに変える恋愛あるある' },
  { theme: 'ラブソング', title: '雨の日の記憶', subtitle: '濡れた心を歌に込めて' },
  { theme: '漫才', title: '家族の不思議', subtitle: '身近すぎて気づかない面白さ' },
  { theme: 'ラブソング', title: '星空の約束', subtitle: '永遠を願う二人の想い' }
];

// Clone Appearance Options
export const appearanceOptions = {
  hair: ['黒髪ロング', '茶色ショート', '金髪ボブ', 'ピンクツイン', 'シルバーカール'],
  eye: ['優しい茶色', '鋭い黒', '澄んだ青', '神秘的な紫', '温かい緑'],
  acc: ['丸メガネ', 'サングラス', '帽子', 'イヤリング', 'ネックレス'],
  mood: ['にっこり', 'クール', '元気', 'おっとり', 'いたずらっ子'],
  style: ['カジュアル', 'フォーマル', 'ボヘミアン', 'スポーティ', 'ゴシック']
};

// Badge/Title Options
export const availableBadges = [
  '新人コメディアン',
  'センス抜群',
  'ハートフル作家',
  'リズムマスター',
  '感動プロデューサー',
  '笑いの天才',
  '恋愛マエストロ',
  'クリエイター',
  '人気者',
  'バイラルスター'
];

// Celebrity collaboration data
export const celebrities = [
  {
    id: 'celebrity_001',
    name: 'みなみ',
    profession: 'アイドル',
    style: 'キュート&エネルギッシュ',
    look: { 
      hair: 'ツインテール', 
      eye: 'キラキラした瞳', 
      mood: '元気いっぱい', 
      style: 'アイドル衣装' 
    },
    specialty: ['歌とダンス', 'ファンとの交流', 'ポジティブエネルギー'],
    description: '明るくて元気なアイドル。ファンのみんなと一緒に楽しい作品を作りたい！',
    collaborationThemes: [
      {
        theme: 'アイドルソング' as const,
        title: 'キラキラ☆ドリーム',
        description: 'みんなの夢を応援する元気な楽曲を一緒に作ろう！'
      }
    ]
  },
  {
    id: 'celebrity_002', 
    name: 'たかし',
    profession: 'お笑い芸人',
    style: 'ベテラン芸人',
    look: {
      hair: '坊主頭',
      eye: '優しい目',
      mood: 'ユーモラス',
      style: 'カジュアル'
    },
    specialty: ['漫才', 'コント', '間の取り方'],
    description: '長年の経験を活かした笑いのプロ。一緒に最高の漫才を作りましょう！',
    collaborationThemes: [
      {
        theme: '漫才' as const,
        title: 'プロ直伝！爆笑漫才',
        description: 'ベテラン芸人との本格的な漫才コラボレーション'
      }
    ]
  },
  {
    id: 'celebrity_003',
    name: 'ゆい',
    profession: 'シンガーソングライター', 
    style: 'エモーショナル',
    look: {
      hair: '黒髪ロング',
      eye: '深い瞳',
      mood: '感情的',
      style: 'アーティスティック'
    },
    specialty: ['作詞作曲', '感情表現', 'メロディメイク'],
    description: '心に響く楽曲作りが得意。あなたの想いを歌に込めましょう。',
    collaborationThemes: [
      {
        theme: 'ラブソング' as const,
        title: '心をつなぐメロディ',
        description: '深い感情を込めた特別なラブソングを共作しよう'
      }
    ]
  },
  {
    id: 'celebrity_004',
    name: 'けんじ',
    profession: 'コメディアン',
    style: 'バラエティ番組の人気者',
    look: {
      hair: 'パーマヘア',
      eye: 'いたずらっぽい目',
      mood: 'ノリノリ',
      style: 'カラフル'
    },
    specialty: ['一発ギャグ', 'アドリブ', '場を盛り上げる'],
    description: 'テレビで大人気！一緒に視聴者を笑わせる企画を考えよう！',
    collaborationThemes: [
      {
        theme: '漫才' as const,
        title: 'バラエティ風コント',
        description: 'テレビ番組みたいな面白いコントを一緒に作ろう！'
      }
    ]
  }
];
