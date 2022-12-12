import type { TagName } from './types';

export type RenderableTagMap = {
  [key in TagName]?: boolean
};

export const normalizeTagsListToMap = (tagNames: TagName[]): { [key in TagName]?: boolean } => {
  const shouldRenderTags: RenderableTagMap = tagNames.reduce((prev, curr, index) => ({
    ...prev,
    [curr]: true,
  }), {});

  return shouldRenderTags;
}