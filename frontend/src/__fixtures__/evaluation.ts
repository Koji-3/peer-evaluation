import { Evaluation, AvarageEvaluation } from 'types/types'

export const fixtureEvaluation: Evaluation = {
  id: 'a',
  evaluateeId: 'evaluatee',
  evaluatorName: 'miyabi',
  relationship: '飼われた',
  comment:
    'わん！わぉ～～～ん！わん！わんわんっ！わん！う”う”う”う”～わん！！わん！わぉ～～～ん！わん！わんわんっ！わん！わん！”う”うう”う”う',
  e1: {
    point: 5,
    reason: '',
  },
  e2: {
    point: 3,
    reason: 'ああああああ',
  },
  e3: {
    point: 2.8,
    reason: 'ああああああ',
  },
  e4: {
    point: 4.4,
    reason: 'ああああああ',
  },
  e5: {
    point: 0.3,
    reason:
      'ああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ',
  },
  e6: {
    point: 5,
    reason: 'ああああああ',
  },
  is_published: true,
  is_deleted: false,
  created: '',
}

export const fixtureEvaluations: Evaluation[] = [
  {
    id: 'a',
    evaluateeId: 'evaluatee',
    evaluatorName: 'miyabi',
    relationship: '飼われた',
    comment: '短い',
    e1: {
      point: 5,
      reason: 'ああああああ',
    },
    e2: {
      point: 5,
      reason: 'ああああああ',
    },
    e3: {
      point: 5,
      reason: 'ああああああ',
    },
    e4: {
      point: 5,
      reason: 'ああああああ',
    },
    e5: {
      point: 5,
      reason: 'ああああああ',
    },
    e6: {
      point: 5,
      reason: 'ああああああ',
    },

    is_published: false,
    is_deleted: false,
    created: '',
  },
  {
    id: 'aa',
    evaluateeId: 'evaluatee',
    evaluatorName: 'miyabi',
    relationship: '飼われた',
    comment:
      'わん！わぉ～～～ん！わん！わんわんっ！わん！う”う”う”う”～わん！！わん！わぉ～～～ん！わん！わんわんっ！わん！わん！”う”うう”う”う',
    e1: {
      point: 5,
      reason: 'ああああああ',
    },
    e2: {
      point: 5,
      reason: 'ああああああ',
    },
    e3: {
      point: 5,
      reason: 'ああああああ',
    },
    e4: {
      point: 5,
      reason: 'ああああああ',
    },
    e5: {
      point: 5,
      reason: 'ああああああ',
    },
    e6: {
      point: 5,
      reason: 'ああああああ',
    },

    is_published: true,
    is_deleted: false,
    created: '',
  },
  {
    id: 'aaa',
    evaluateeId: 'evaluatee',
    evaluatorName: 'miyabi',
    relationship: '飼われた',
    comment:
      'わん！わぉ～～～ん！わん！わんわんっ！わん！う”う”う”う”～わん！！わん！わぉ～～～ん！わん！わんわんっ！わん！わん！”う”うう”う”うわん！わぉ～～～ん！わん！わんわんっ！わん！う”う”う”う”～わん！！わん！わぉ～～～ん！わん！わんわんっ！わん！わん！”う”うう”う”うわん！わぉ～～～ん！わん！わんわんっ！わん！う”う”う”う”～わん！！わん！わぉ～～～ん！わん！わんわんっ！わん！わん！”う”うう”う”うわん！わぉ～～～ん！わん！わんわんっ！わん！う”う”う”う”～わん！！わん！わぉ～～～ん！わん！わんわんっ！わん！わん！”う”うう”う”う',
    e1: {
      point: 5,
      reason: 'ああああああ',
    },
    e2: {
      point: 5,
      reason: 'ああああああ',
    },
    e3: {
      point: 5,
      reason: 'ああああああ',
    },
    e4: {
      point: 5,
      reason: 'ああああああ',
    },
    e5: {
      point: 5,
      reason: 'ああああああ',
    },
    e6: {
      point: 5,
      reason: 'ああああああ',
    },

    is_published: false,
    is_deleted: false,
    created: '',
  },
  {
    id: 'aaaa',
    evaluateeId: 'evaluatee',
    evaluatorName: 'miyabi',
    relationship: '飼われた',
    comment:
      'わん！わぉ～～～ん！わん！わんわんっ！わん！う”う”う”う”～わん！！わん！わぉ～～～ん！わん！わんわんっ！わん！わん！”う”うう”う”う',

    e1: {
      point: 5,
      reason: 'ああああああ',
    },
    e2: {
      point: 5,
      reason: 'ああああああ',
    },
    e3: {
      point: 5,
      reason: 'ああああああ',
    },
    e4: {
      point: 5,
      reason: 'ああああああ',
    },
    e5: {
      point: 5,
      reason: 'ああああああ',
    },
    e6: {
      point: 5,
      reason: 'ああああああ',
    },

    is_published: true,
    is_deleted: false,
    created: '',
  },
]

export const fixtureAvarageEvaluation: AvarageEvaluation = {
  evaluateeId: 'evaluatee',
  e1: 3,
  e2: 2.9,
  e3: 4.3,
  e4: 0.2,
  e5: 1.4,
  e6: 5,
}
