export type TagName =
  | 'SUN_RIGHT'
  | 'SUN_LEFT'
  | 'PENNANT_LEFT'
  | 'PENNANT_RIGHT'
  | 'SCRATCH_RIGHT'
  | 'SCRATH_LEFT'
  | 'NEW_RIGHT'
  | 'NEW_LEFT';

export type TagsCombo =
  | 'none'
  | 'combo_a'
  | 'combo_b'
  | 'combo_c'
  | 'combo_d'
  | 'combo_e'
  | 'combo_f';


export type Combination = {
  [key in TagsCombo]: TagName[];
};

export const TagComboMap: Combination = {
  none: [],
  combo_a: ['SUN_LEFT', 'NEW_RIGHT'],
  combo_b: ['PENNANT_LEFT'],
  combo_c: ['SUN_RIGHT'],
  combo_d: ['PENNANT_RIGHT'],
  combo_e: ['NEW_LEFT'],
  combo_f: ['SCRATCH_RIGHT', 'NEW_LEFT'],
};