import Dialog from '@mui/material/Dialog';
import type { DialogProps } from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import type { LinksFunction } from '@remix-run/node';

// import type { SearchSuggest } from '~/routes/hooks/auto-complete-search';

import SearchBar from '~/components/SearchBar';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import styles from './styles/MobileSearchDialog.css';

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: styles },
  ];
};

type SearchItem = {
  title: string;
  id: string;
};

interface MobileSearchDialogProps extends DialogProps {
  onBack?: () => void,

  // useSearchSuggests?: () => [SuggestItem[], SearchSuggest];

  items?: SearchItem[],
}

export default function MobileSearchDialog({
  onBack = () => { },
  items = [],
  ...args
}: MobileSearchDialogProps) {
  return (
    <Dialog
      fullScreen
      {...args}
    >
      <div className="SearchDialog__wrapper">
        <div className="MobileSearch__wrapper">
          <IconButton onClick={onBack} >
            <ArrowBackIcon fontSize='32' />
          </IconButton>

          <div className="MobileSearch__searchbar">
            <SearchBar
              placeholder='Search a product by name'
            // onSearch={}
            />
          </div>
        </div>

        <div className="MobileSearch__result-wrapper">
          <ul className="MobileSearch__result-list">
            <li className="MobileSearch__result-item">
              Item A
            </li>

            <li className="MobileSearch__result-item">
              Item B
            </li>
          </ul>
        </div>
      </div>
    </Dialog>
  );
}