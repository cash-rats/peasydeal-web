import FollowUs from './FollowUs';
import PreviewPost from './PreviewPost';
import { Link } from "@remix-run/react";

const BlogLayout = ({
  postSummaries,
  currentPage,
  totalPages,
}) => {
  const totalPageArray = Array.from(Array(totalPages).keys());

  return (
    <div className="layout-medium">
      <div id="primary" className="content-area with-sidebar">
        <div id="content" className="site-content" role="main">
          <h2 className="pb-2 font-poppins border-b-4 border-[#000]">Latest posts</h2>
          <div className="
            masonry blog-masonry
            mt-4
            grid
            gap-2 md:gap-3 lg:gap-4
            grid-cols-1 md:grid-cols-1 lg:grid-cols-2
          " data-layout="fitRows" data-item-width="340">
            {
              postSummaries.map((post: any) => (
                <PreviewPost post={post} key={`post_${post.sys.id}`}/>
              ))
            }
          </div>
        </div>

        <nav className="post-pagination">
          <ul className="pagination flex gap-2">
            {
              totalPageArray.map((_: any, index: any) => (
                <Link to={`/blog/page/${index + 1}`} key={`pagination_${index + 1}`}>
                  <li
                    className="inline-flex px-2 py-1 border-2 rounded-md"

                    style={{
                      backgroundColor: parseInt(currentPage) === index + 1 ? '#f8f8f8' : '#fff',
                      borderColor: parseInt(currentPage) === index + 1 ? '#38A169' : '#ccc',
                      color: parseInt(currentPage) === index + 1 ? '#38A169' : '#ccc',
                    }}
                  >
                    {index + 1}
                  </li>
                </Link>
              ))
            }
          </ul>
        </nav>
      </div>

      <div id="secondary" className="widget-area sidebar" role="complementary">
        <FollowUs />
      </div>
    </div>
  )
}

export default BlogLayout;