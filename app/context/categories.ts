import { createContext } from 'react';

import type { Category } from '~/shared/types';

const CategoryContext = createContext<Category[]>([]);
CategoryContext.displayName = 'CategoryContext'
export default CategoryContext;