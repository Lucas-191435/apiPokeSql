type EffectChange = {
  effect_entries: Array<{
    effect: string;
    language: {
      name: string;
      url: string;
    };
  }>;
  version_group: {
    name: string;
    url: string;
  };
};

type Machine = {
  machine: {
    url: string;
  };
  version_group: {
    name: string;
    url: string;
  };
};

type PastValue = {
  accuracy: number | null;
  effect_chance: number | null;
  power: number | null;
  pp: number | null;
  effect_entries: Array<{
    effect: string;
    language: {
      name: string;
      url: string;
    };
    short_effect: string;
  }>;
  type: {
    name: string;
    url: string;
  } | null;
  version_group: {
    name: string;
    url: string;
  };
};

type StatChange = {
  change: number;
  stat: {
    name: string;
    url: string;
  };
};

export interface Move {
  accuracy: number | null;
  contest_combos: {
    normal: {
      use_after: null | Array<{ name: string; url: string }>;
      use_before: null | Array<{ name: string; url: string }>;
    };
    super: {
      use_after: null | Array<{ name: string; url: string }>;
      use_before: null | Array<{ name: string; url: string }>;
    };
  };
  contest_effect: { url: string };
  contest_type: { name: string; url: string };
  damage_class: { name: string; url: string };
  effect_chance: number | null;
  effect_changes: Array<EffectChange>;
  effect_entries: Array<{
    effect: string;
    language: { name: string; url: string };
    short_effect: string;
  }>;
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string; url: string };
    version_group: { name: string; url: string };
  }>;
  generation: { name: string; url: string };
  id: number;
  learned_by_pokemon: Array<{ name: string; url: string }>;
  machines: Array<Machine>;
  meta: {
    ailment: { name: string; url: string };
    ailment_chance: number;
    category: { name: string; url: string };
    crit_rate: number;
    drain: number;
    flinch_chance: number;
    healing: number;
    max_hits: number | null;
    max_turns: number | null;
    min_hits: number | null;
    min_turns: number | null;
    stat_chance: number;
  };
  name: string;
  names: Array<{
    language: { name: string; url: string };
    name: string;
  }>;
  past_values: Array<PastValue>;
  power: number | null;
  pp: number;
  priority: number;
  stat_changes: Array<StatChange>;
  super_contest_effect: { url: string };
  target: { name: string; url: string };
  type: { name: string; url: string };
}