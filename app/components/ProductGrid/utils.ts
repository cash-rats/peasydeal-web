import type { TagName } from './types';

export const normalizeTagsListToMap = (tagNames: TagName[]) => {
  const shouldRenderTags: {
    [key in TagName]?: boolean
  } = tagNames.reduce((prev, curr, index) => ({
    ...prev,
    [curr]: true,
  }), {});

  return shouldRenderTags;
}