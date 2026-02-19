import { pipe, split, last } from 'ramda';

const normalizePath  = (path: string) => path.replace(/^\/+/, '');
const getImgFileName = (path: string) => path.replace(/^images\//, '');

const getFileNameFromPath = pipe(
  split('/'),
  arr => last(arr) ?? '',
);

const resolveProjectImage = (imagesMap: Record<string, string>) => pipe(
  normalizePath,
  getImgFileName,
  name => imagesMap[name] ?? ''
);

export { resolveProjectImage, getFileNameFromPath }