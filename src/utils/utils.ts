import { alg, Edge, Graph } from 'graphlib';
import { Dictionary, Err } from './types';

const errBase: Err = {
  fork: false,
  duplicate: false,
  chain: false,
  cycle: false
};

// Validator function
export function checkConsistency(dict: Dictionary) {
  let errors = new Map<string, any>();
  let g = new Graph({ directed: true, multigraph: true });

  dict.data.forEach(pair => {
    g.setEdge(pair.key, pair.value, pair.id, pair.id);
  });

  dict.data.forEach(pair => {
    errors.set(pair.id, errBase);

    // Duplicates
    if (
      dict.data.filter(x => x.value == pair.value && x.key == pair.key).length >
      1
    ) {
      errors.set(pair.id, { ...errors.get(pair.id), duplicate: true });
    }

    // Forks
    if (
      dict.data.filter(x => x.value != pair.value && x.key == pair.key).length >
      0
    ) {
      errors.set(pair.id, { ...errors.get(pair.id), fork: true });
    }
  });

  // Chains
  const chains = alg.components(g);
  chains.forEach(chain => {
    dict.data.forEach(pair => {
      if (
        chain.includes(pair.key) &&
        chain.includes(pair.value) &&
        !(
          (g.inEdges(pair.key) as Edge[]).length == 0 &&
          (g.outEdges(pair.value) as Edge[]).length == 0
        )
      ) {
        errors.set(pair.id, {
          ...errBase,
          ...errors.get(pair.id),
          chain: true
        });
      }
    });
  });

  // Cycles
  const cycles = alg.findCycles(g);
  cycles.forEach(cycle => {
    dict.data.forEach(pair => {
      if (cycle.includes(pair.key) && cycle.includes(pair.value)) {
        errors.set(pair.id, {
          ...errBase,
          ...errors.get(pair.id),
          cycle: true
        });
      }
    });
  });

  return errors;
}

export const getPriority = (e: Err) => {
  return (
    (e.cycle ? 7 : 0) +
    (e.chain ? 3 : 0) +
    (e.fork ? 2 : 0) +
    (e.duplicate ? 1 : 0)
  );
};

export const compareErrors = (a: Err, b: Err) => {
  return getPriority(a) < getPriority(b) ? 1 : -1;
};
