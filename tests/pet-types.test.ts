import assert from 'node:assert/strict';
import test from 'node:test';

import {
  getPetTypeLabel,
  parsePetTypes,
  serializePetTypes,
} from '../src/lib/pet-types';
import { PetType } from '../src/types/enums';

test('pet type parsing rejects unknown and inherited object keys', () => {
  assert.deepEqual(
    parsePetTypes('["CAT","toString","__proto__","DOG"]'),
    [PetType.CAT, PetType.DOG]
  );
  assert.equal(getPetTypeLabel('__proto__'), '__proto__');
});

test('pet type parsing supports legacy CSV and removes duplicates', () => {
  assert.deepEqual(parsePetTypes('CAT, DOG, CAT'), [PetType.CAT, PetType.DOG]);
  assert.equal(serializePetTypes([PetType.DOG, PetType.DOG]), '["DOG"]');
});