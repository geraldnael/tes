import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  asyncReceiveThreadsAndUsers,
  asyncUpVoteThread,
  asyncDownVoteThread,
  asyncNeutralVoteThread,
} from '../redux/actions/threadsActions';
import ThreadCard from '../components/threads/ThreadCard';
import { getUniqueCategories } from '../utils/helpers';
import { Link } from 'react-router-dom';
import '../styles/homepage.css'; // Buat file styling ini

function HomePage() {
  const dispatch = useDispatch();
  // Ambil semua thread dan user dari Redux store
  const { list: threads } = useSelector((state) => state.threads);
  const { authUser } = useSelector((state) => state.authUser);
  const users = useSelector((state) => state.users);
  const loading = useSelector((state) => state.loadingBar.loading); // Ambil status loading dari Redux store

  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Dispatch action untuk mengambil threads dan users saat komponen dimuat
    // Ini akan memicu panggilan API getAllThreads dan getAllUsers
    dispatch(asyncReceiveThreadsAndUsers());
  }, [dispatch]);

  // --- Penanganan Kondisi Loading dan Data Belum Tersedia ---
  // Jika aplikasi sedang dalam status loading (misalnya dari Redux loadingBar)
  // ATAU jika data threads atau users belum tersedia (null atau array kosong),
  // tampilkan pesan loading untuk mencegah error render.
  if (loading || !threads || users.length === 0) {
    return <p>Loading threads and users data...</p>;
  }
  // --------------------------------------------------------

  // Gabungkan informasi owner ke dalam setiap thread
  // Pastikan users sudah ada dan bukan array kosong sebelum melakukan find
  const threadList = threads
    .map((thread) => ({
      ...thread,
      owner: users.find((user) => user.id === thread.ownerId),
    }))
    .filter((thread) => thread.owner); // Filter thread yang ownernya tidak ditemukan

  const categories = getUniqueCategories(threads);

  const filteredThreads = selectedCategory === 'all' ?
    threadList :
    threadList.filter((thread) => thread.category === selectedCategory);

  const onUpVoteThread = (threadId) => {
    dispatch(asyncUpVoteThread(threadId));
  };

  const onDownVoteThread = (threadId) => {
    dispatch(asyncDownVoteThread(threadId));
  };

  const onNeutralVoteThread = (threadId) => {
    dispatch(asyncNeutralVoteThread(threadId));
  };

  return (
    <div className="homepage">
      <div className="category-filter">
        <h3>Kategori:</h3>
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={selectedCategory === 'all' ? 'active-category' : ''}
        >
          Semua
        </button>
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={selectedCategory === category ? 'active-category' : ''}
          >
            #
            {category}
          </button>
        ))}
      </div>

      <div className="threads-list">
        {filteredThreads.length > 0 ? (
          filteredThreads.map((thread) => (
            <ThreadCard
              key={thread.id}
              {...thread}
              authUser={authUser}
              onUpVote={onUpVoteThread}
              onDownVote={onDownVoteThread}
              onNeutralVote={onNeutralVoteThread}
            />
          ))
        ) : (
          <p>Tidak ada thread yang tersedia.</p>
        )}
      </div>
      {authUser && (
        <Link to="/new" className="add-thread-button">
          + Buat Thread
        </Link>
      )}
    </div>
  );
}

export default HomePage;
