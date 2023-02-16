import type { LoaderFunction } from '@remix-run/node';

/*
  Responsive images transforms

  <Image
    src=""
    responsive={[
      {
        size: { width: 100, height: 100 },
        maxWidth: 500,
      },
      {
        size: { width: 600, height: 600 },
        maxWidth
      }
    ]}
  />


<img
  src="/api/image?src=https%3A%2F%2Fi.imgur.com%2F5cQnAQC.png&width=600&height=600"
  srcset="/api/image?src=https%3A%2F%2Fi.imgur.com%2F5cQnAQC.png&width=100&height=100 100w, /api/image?src=https%3A%2F%2Fi.imgur.com%2F5cQnAQC.png&width=600&height=600 600w, /api/image?src=https%3A%2F%2Fi.imgur.com%2F5cQnAQC.png&width=300&height=300 300w, /api/image?src=https%3A%2F%2Fi.imgur.com%2F5cQnAQC.png&width=1800&height=1800 1800w"
  sizes="(max-width: 500px) 100px, 600px"
>
*/
export const loader: LoaderFunction = ({ request }) => {
  // Receive image src url, width and height.
  const url = new URL(request.url);
  const src = url.searchParams.get('src');
  const width = url.searchParams.get('w');
  const height = url.searchParams.get('h');
  const quality = url.searchParams.get('')

  // If src


  return null
};

function Image() {

}

export default Image;