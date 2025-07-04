import { NextPage } from 'next';
import { useCallback, useMemo } from 'react';
import { useEffect, useState } from 'react';
import { FiPlusCircle } from 'react-icons/fi';

import Layout from '../components/Layout';
import PostItem, { IPostItem } from '../components/PostItem';
import CoolLoader from '../components/shared/CoolLoader';
import { api } from '../utils/api';

const pageSize = 10;

const fetchItems = async (page: number) => {
  const {
    data: { resources, count },
  } = await api.get("resources", {
    params: {
      page,
      page_size: pageSize,
    },
  });

  const _resources = resources?.map((e: any) => {
    e.tags = e?.tags?.map((e: any) => e.title);
    e.category = e?.category?.title;
    return e;
  });

  return { resources: _resources, count };
};

const Home: NextPage = () => {
  const [posts, setPosts] = useState<IPostItem[]>([]);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [initialLoad, setInitialLoad] = useState(true);
  const [page, setPage] = useState(0);

  const loadItems = useCallback(async (page: number, isInitialLoad = false) => {
    setLoading(true);

    try {
      const { resources, count } = await fetchItems(page);
      if (isInitialLoad) {
        setPosts(resources);
      } else {
        setPosts((oldPosts) => [...oldPosts, ...resources]);
      }
      setPage(page);

      setTotalPages(Math.ceil(count / pageSize));
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    if (totalPages) {
      if (page + 1 < totalPages) {
        setHasNext(true);
      } else {
        setHasNext(false);
      }
    }
  }, [totalPages, page]);

  useEffect(() => {
    loadItems(0, true);
  }, [loadItems]);

  const onNext = async () => {
    loadItems(page + 1);
  };

  if (initialLoad) {
    return (
      <Layout>
        <CoolLoader 
          message="Loading latest resources..." 
          size="lg"
        />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col space-y-8">
        {posts?.map((post, index) => (
          <PostItem key={index} post={post} />
        ))}
      </div>

      {hasNext && (
        <button
          className="text-primary dark:text-primary-dark flex items-center font-semibold text-xs uppercase hover:underline mx-auto mt-12 disabled:cursor-not-allowed disabled:opacity-75"
          onClick={onNext}
          disabled={loading}
        >
          <FiPlusCircle className="pr-1 text-2xl" /> {loading ? "Loading..." : "Load More resources"}
        </button>
      )}

      {/* <div className={`mt-8 ${loading && "pointer-events-none opacity-75"}`}>
        <Pagination hasNext={hasNext} hasPrevious={hasPrevious} onPrevious={onPrevious} onNext={onNext} page={page} />
      </div> */}
    </Layout>
  );
};

export default Home;
