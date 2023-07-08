import { Evaluation, AvarageEvaluation } from 'types/types'
import { fixtureUser } from '__fixtures__/user'

export const fixtureEvaluation: Evaluation = {
  id: 'a',
  evaluatee: fixtureUser,
  evaluatorName: 'miyabi',
  evaluatorIconUrl: 'https://picsum.photos/id/237/200/200.jpg',
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
  isPublished: true,
  isDeleted: false,
}

export const fixtureEvaluations: Evaluation[] = [
  {
    id: 'a',
    evaluatee: fixtureUser,
    evaluatorName: 'miyabi',
    evaluatorIconUrl: 'https://picsum.photos/id/237/200/200.jpg',
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

    isPublished: false,
    isDeleted: false,
  },
  {
    id: 'aa',
    evaluatee: fixtureUser,
    evaluatorName: 'miyabi',
    evaluatorIconUrl: 'https://picsum.photos/id/237/200/200.jpg',
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

    isPublished: true,
    isDeleted: false,
  },
  {
    id: 'aaa',
    evaluatee: fixtureUser,
    evaluatorName: 'miyabi',
    evaluatorIconUrl: 'https://picsum.photos/id/237/200/200.jpg',
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

    isPublished: false,
    isDeleted: false,
  },
  {
    id: 'aaaa',
    evaluatee: fixtureUser,
    evaluatorName: 'miyabi',
    evaluatorIconUrl: 'https://picsum.photos/id/237/200/200.jpg',
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

    isPublished: true,
    isDeleted: false,
  },
]

export const fixtureAvarageEvaluation: AvarageEvaluation = {
  evaluatee: fixtureUser,
  e1: 3,
  e2: 2.9,
  e3: 4.3,
  e4: 0.2,
  e5: 1.4,
  e6: 5,
}
