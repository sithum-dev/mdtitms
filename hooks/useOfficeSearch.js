import axios from "axios";
import { useEffect, useState } from "react";

function useOfficeSearch(query, pageNumber) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [offices, setOffices] = useState([]);
  const [hasMore, setHasMore] = useState();

  useEffect(() => {
    setOffices([]);
  }, [query]);

  useEffect(async () => {
    setLoading(true);
    setError(false);
    let cancel;

    await axios({
      method: "POST",
      url: "/api/offices/getOffices",
      params: { query: query, pageNumber: pageNumber, pageSize: 10 },
      cancelToken: new axios.CancelToken((c) => (cancel = c)),
    })
      .then((res) => {
        if (res.data.data.length > 0) {
          setOffices((prevUsers) => {
            return [...new Set([...prevUsers, ...res.data.data])];
          });
          setHasMore(true);
        } else {
          setHasMore(false);
          // setOffices([]);
        }
        setLoading(false);
      })
      .catch((e) => {
        if (axios.isCancel(e)) return;
        setError(true);
      });

    return () => cancel();
  }, [query, pageNumber]);

  return {
    loading,
    error,
    offices,
    hasMore,
  };
}

export default useOfficeSearch;
