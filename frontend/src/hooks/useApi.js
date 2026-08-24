import { useState, useEffect, useCallback } from 'react';
import client from '../api/client';

export default function useApi(url, options = {}) {
  const { immediate = true, params = null } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (overrideUrl, overrideParams) => {
      const requestUrl = overrideUrl || url;
      if (typeof requestUrl !== 'string' || !requestUrl) {
        console.error('useApi: URL must be a non-empty string, got:', requestUrl);
        setError('Invalid API URL');
        return null;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await client.get(requestUrl, {
          params: overrideParams || params,
        });
        setData(response.data);
        return response.data;
      } catch (err) {
        const message =
          err.response?.data?.message || err.message || 'An error occurred';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [url, params]
  );

  useEffect(() => {
    if (immediate && typeof url === 'string' && url) {
      execute().catch(() => {});
    }
  }, [immediate, execute, url]);

  const mutate = (newData) => {
    if (typeof newData === 'function') {
      setData((prev) => newData(prev));
    } else {
      setData(newData);
    }
  };

  return { data, loading, error, execute, mutate, setData };
}
