import { EvaluationLabels, RadioButton } from 'types/types'

export const getE1Options = (
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
): { label: EvaluationLabels; buttons: RadioButton[] } => ({
  label: EvaluationLabels['e1'],
  buttons: [
    {
      id: 'e1_5',
      name: 'e1',
      value: 5,
      label: 'とてもポジティブである',
      onChange,
    },
    {
      id: 'e1_4',
      name: 'e1',
      value: 4,
      label: 'ポジティブである',
      onChange,
    },
    {
      id: 'e1_3',
      name: 'e1',
      value: 3,
      label: '普通',
      onChange,
    },
    {
      id: 'e1_2',
      name: 'e1',
      value: 2,
      label: 'あまりポジティブでない',
      onChange,
    },
    {
      id: 'e1_1',
      name: 'e1',
      value: 1,
      label: '全くポジティブでない',
      onChange,
    },
  ],
})
export const getE2Options = (
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
): { label: EvaluationLabels; buttons: RadioButton[] } => ({
  label: EvaluationLabels['e2'],
  buttons: [
    {
      id: 'e2_5',
      name: 'e2',
      value: 5,
      label: 'とてもユーモアがある',
      onChange,
    },
    {
      id: 'e2_4',
      name: 'e2',
      value: 4,
      label: 'ユーモアがある',
      onChange,
    },
    {
      id: 'e2_3',
      name: 'e2',
      value: 3,
      label: '普通',
      onChange,
    },
    {
      id: 'e2_2',
      name: 'e2',
      value: 2,
      label: 'あまりユーモアがない',
      onChange,
    },
    {
      id: 'e2_1',
      name: 'e2',
      value: 1,
      label: '全くユーモアがない',
      onChange,
    },
  ],
})
export const getE3Options = (
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
): { label: EvaluationLabels; buttons: RadioButton[] } => ({
  label: EvaluationLabels['e3'],
  buttons: [
    {
      id: 'e3_5',
      name: 'e3',
      value: 5,
      label: 'とてもおしゃれである',
      onChange,
    },
    {
      id: 'e3_4',
      name: 'e3',
      value: 4,
      label: 'おしゃれである',
      onChange,
    },
    {
      id: 'e3_3',
      name: 'e3',
      value: 3,
      label: '普通',
      onChange,
    },
    {
      id: 'e3_2',
      name: 'e3',
      value: 2,
      label: 'あまりおしゃれでない',
      onChange,
    },
    {
      id: 'e3_1',
      name: 'e3',
      value: 1,
      label: '全くおしゃれでない',
      onChange,
    },
  ],
})
export const getE4Options = (
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
): { label: EvaluationLabels; buttons: RadioButton[] } => ({
  label: EvaluationLabels['e4'],
  buttons: [
    {
      id: 'e4_5',
      name: 'e4',
      value: 5,
      label: 'とてもクリエイティブである',
      onChange,
    },
    {
      id: 'e4_4',
      name: 'e4',
      value: 4,
      label: 'クリエイティブである',
      onChange,
    },
    {
      id: 'e4_3',
      name: 'e4',
      value: 3,
      label: '普通',
      onChange,
    },
    {
      id: 'e4_2',
      name: 'e4',
      value: 2,
      label: 'あまりクリエイティブでない',
      onChange,
    },
    {
      id: 'e4_1',
      name: 'e4',
      value: 1,
      label: '全くクリエイティブでない',
      onChange,
    },
  ],
})
export const getE5Options = (
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
): { label: EvaluationLabels; buttons: RadioButton[] } => ({
  label: EvaluationLabels['e5'],
  buttons: [
    {
      id: 'e5_5',
      name: 'e5',
      value: 5,
      label: 'とても優しい',
      onChange,
    },
    {
      id: 'e5_4',
      name: 'e5',
      value: 4,
      label: '優しい',
      onChange,
    },
    {
      id: 'e5_3',
      name: 'e5',
      value: 3,
      label: '普通',
      onChange,
    },
    {
      id: 'e5_2',
      name: 'e5',
      value: 2,
      label: 'あまり優しくない',
      onChange,
    },
    {
      id: 'e5_1',
      name: 'e5',
      value: 1,
      label: '全く優しくない',
      onChange,
    },
  ],
})
export const getE6Options = (
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
): { label: EvaluationLabels; buttons: RadioButton[] } => ({
  label: EvaluationLabels['e6'],
  buttons: [
    {
      id: 'e6_5',
      name: 'e6',
      value: 5,
      label: 'とても親しみやすい',
      onChange,
    },
    {
      id: 'e6_4',
      name: 'e6',
      value: 4,
      label: '親しみやすい',
      onChange,
    },
    {
      id: 'e6_3',
      name: 'e6',
      value: 3,
      label: '普通',
      onChange,
    },
    {
      id: 'e6_2',
      name: 'e6',
      value: 2,
      label: 'あまり親しみやすくない',
      onChange,
    },
    {
      id: 'e6_1',
      name: 'e6',
      value: 1,
      label: '全く親しみやすくない',
      onChange,
    },
  ],
})
