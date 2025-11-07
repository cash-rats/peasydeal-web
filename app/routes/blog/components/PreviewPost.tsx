import { Link } from 'react-router';
import { Badge } from '@chakra-ui/react'

const PreviewPost = ({ post }: { post: any }) => {
  return (
    <article className="hentry post">
      <Link to={`/blog/post/${post.slug}`}>
        <div className="featured-image">
          <img src={post.featuredImage?.url} alt={post.featuredImage?.fileName} className="rounded-xl" />
        </div>
        <header className="entry-header">
          <div className="entry-meta">
            <div className="flex-wrap flex-direction">
              {post.tags.map((tag: any) => (
                <Badge className="mr-2 mb-2 px-2 rounded-xl" key={`tags_${tag}`} colorScheme='green'>{tag}</Badge>
              ))}
            </div>
          </div>
          <h2 className="entry-title font-poppins font-medium text-[#333]">
            { post.postName }
          </h2>
        </header>

        <div className="entry-content">
          <p className='text-base text-[#555]'>
            {post.excerpt}
          </p>

          <div className="entry-meta">
            <span className="entry-date mb-2">
              <time className="font-poppins" dateTime={post.publishedDate}>
                {
                  // format the date to MM, DD, YYYY
                  new Date(post.publishedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })
                }
              </time>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default PreviewPost;
