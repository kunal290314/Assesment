import React, { useEffect, useState } from 'react';
import useDebounce from '../hooks/useDebounce';
import PaginationButton from './PaginationButton';

const ITEMS_PER_PAGE = 5;

export default function UserTable() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const debouncedSearch = useDebounce(search, 500);

  // for fetch the users from the api
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setErrorMsg('');
      try {
        const res = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!res.ok) throw new Error(`Failed with status ${res.status}`);
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // reset page on search change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // filter data on search
  const searchTerm = debouncedSearch.trim().toLowerCase();
  const visibleUsers = searchTerm
    ? users.filter((u) => {
        const target = [u.name, u.email].join(' ').toLowerCase();
        return target.includes(searchTerm);
      })
    : users;

  // pagination
  const totalPages = Math.ceil(visibleUsers.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentPageData = visibleUsers.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email"
        disabled={loading}
      />

      <br />
      <br />

      {errorMsg && <div style={{ color: 'red' }}>Error: {errorMsg}</div>}
      {loading && <div>Loading...</div>}

      {!loading && (
        <table
          style={{ borderCollapse: 'collapse', width: '100%' }}
          border={1}
          cellPadding={10}
        >
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center' }}>
                  No results found
                </td>
              </tr>
            ) : (
              currentPageData.map((u, idx) => (
                <tr key={u.id}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.company?.name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {!loading && visibleUsers.length > 0 && (
        <div
          style={{
            marginTop: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <PaginationButton
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
          >
            Prev
          </PaginationButton>
          <span>
            Page {page} of {totalPages}
          </span>
          <PaginationButton
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </PaginationButton>
        </div>
      )}
    </div>
  );
}
