import {directoryExists} from '@form8ion/core';

export default function ({projectRoot}) {
  return directoryExists(`${projectRoot}/.github`);
}
