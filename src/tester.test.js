import {directoryExists} from '@form8ion/core';

import any from '@travi/any';
import {when} from 'jest-when';
import {describe, expect, it, vi} from 'vitest';

import projectIsVersionedOnGithub from './tester.js';

vi.mock('@form8ion/core');

describe('github predicate', () => {
  const projectRoot = any.string();

  it('should return `true` when the `.github` directory is present', async () => {
    when(directoryExists).calledWith(`${projectRoot}/.github`).mockResolvedValue(true);

    expect(await projectIsVersionedOnGithub({projectRoot})).toBe(true);
  });

  it('should return `false` when the `.github` directory is not present', async () => {
    when(directoryExists).calledWith(`${projectRoot}/.github`).mockResolvedValue(false);

    expect(await projectIsVersionedOnGithub({projectRoot})).toBe(false);
  });
});
