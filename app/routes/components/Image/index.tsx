import type { LoaderFunction } from '@remix-run/node';

export const loader: LoaderFunction = ({ request }) => { 
  // Receive image src url, width and height. 
  const url = new URL(request.url);
  const src = url.searchParams.get('src');
  const width = url.searchParams.get('w');
  const height = url.searchParams.get('h');
  const quality = url.searchParams.get('')
  
  
  
  return null
};

function Image() {

}

export default Image;