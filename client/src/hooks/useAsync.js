import { useState, useCallback } from 'react';

/**
 * Generic async request hook.
 * Usage: const { data, loading, error, execute } = useAsync(myServiceFn);
 */
export function useAsync(asyncFn) {
  const [data, setData]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFn(...args);
      setData(result.data);
      return result.data;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFn]);

  return { data, loading, error, execute };
}
