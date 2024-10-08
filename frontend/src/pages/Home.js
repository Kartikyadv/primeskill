import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Posts from '../components/Posts';
import { fetchPosts } from '../redux/post/postThunkReducers';

const Home = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.posts);
  const postStatus = useSelector((state) => state.posts.status);
  const error = useSelector((state) => state.posts.error);

  useEffect(() => {
      dispatch(fetchPosts());
  }, []);

  return (
    <div className="pt-24">
      {postStatus === 'loading' && <div>Loading...</div>}
      {postStatus === 'failed' && <div>{error}</div>}
      {postStatus === 'succeeded' &&
        posts?.map((post) => (
          <Posts key={post._id} post={post} />
        ))}
    </div>
  );
};

export default Home;

