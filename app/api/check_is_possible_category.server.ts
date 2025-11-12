import { resolveCategoryName } from './resolve-category-name.server';

const checkIsPossibleCategory = async (url: URL): Promise<[boolean, string]> => {
  try {
    const segments = url.pathname.split('/').filter(Boolean)

    // User input more than 1 url segments, it's not possible that the
    // url is intended for requesting category.
    if (segments.length !== 1) {
      return [false, ''];
    }

    // Ok, segment is 1, this segment might be category name.
    const catName = await resolveCategoryName(segments[segments.length - 1]);

    return [true, catName];
  } catch (e: any) {
    // If status code does not equal 2xx. this segment is not our category.
    return [false, ''];
  }
}

export default checkIsPossibleCategory;
