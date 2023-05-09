import axios from "axios";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";

function useUserSearch(query, pageNumber, tags, dateFilter) {
  const cookies = parseCookies();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [users, setUsers] = useState([]);
  const [hasMore, setHasMore] = useState();
  const [tagsList, setTagsList] = useState([]);

  useEffect(() => {
    setUsers([]);
  }, [query, tags, dateFilter]);

  useEffect(async () => {
    setLoading(true);
    setError(false);
    let cancel;

    await axios({
      method: "POST",
      url: "/api/users/getUsers",
      params: {
        query: query,
        pageNumber: pageNumber,
        pageSize: 10,
        officeId: cookies.loginOfficeId,
      },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        if (res.data.data.length > 0) {
          setUsers((prevUsers) => {
            return [...new Set([...prevUsers, ...res.data.data])];
          });
          setHasMore(true);
        } else {
          setHasMore(false);
          // setUsers([]);
        }
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });

    return () => cancel();
  }, [query, pageNumber, tags, dateFilter]);

  return {
    loading,
    error,
    users,
    hasMore,
  };
}

export default useUserSearch;
