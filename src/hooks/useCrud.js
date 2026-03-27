/**
 * useCrud.js — Generic data-fetching & mutation hook
 *
 * Encapsulates: list, create, update, delete state + loading/error.
 * Every model page uses this hook — no duplicated data logic.
 *
 * Usage:
 *   const crud = useCrud('/posts', { page: 1, per_page: 20 });
 *   crud.items        — current page items
 *   crud.meta         — { total, page, per_page, last_page }
 *   crud.loading      — true while fetching
 *   crud.error        — error message or null
 *   crud.create(data) — POST + refresh
 *   crud.update(id, data)
 *   crud.remove(id)
 *   crud.setParams(p) — change page/search/sort → triggers refetch
 */

import { useState, useEffect, useCallback, useRef } from "react";
import createCrudService from "../services/crudService";

export default function useCrud(endpoint, initialParams = {}) {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 20, last_page: 1 });
  const [params, setParamsState] = useState({ page: 1, per_page: 20, ...initialParams });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stable service ref — recreated only when endpoint changes
  const service = useRef(createCrudService(endpoint));
  useEffect(() => {
    service.current = createCrudService(endpoint);
  }, [endpoint]);

  // ── Fetch list ────────────────────────────────────────
  const fetchList = useCallback(async (fetchParams) => {
    setLoading(true);
    setError(null);
    try {
      const result = await service.current.list(fetchParams);
      // Support both { data, meta } and flat array responses
      if (Array.isArray(result)) {
        setItems(result);
        setMeta((m) => ({ ...m, total: result.length }));
      } else {
        setItems(result.data || result.items || []);
        setMeta(result.meta || result.pagination || meta);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Refetch whenever params change
  useEffect(() => {
    fetchList(params);
  }, [params, fetchList]);

  const setParams = useCallback((updates) => {
    setParamsState((prev) => ({ ...prev, ...updates }));
  }, []);

  const refresh = useCallback(() => {
    fetchList(params);
  }, [fetchList, params]);

  // ── Create ────────────────────────────────────────────
  const create = useCallback(async (data) => {
    setError(null);
    const result = await service.current.create(data);
    refresh();
    return result;
  }, [refresh]);

  // ── Update ────────────────────────────────────────────
  const update = useCallback(async (id, data) => {
    setError(null);
    const result = await service.current.update(id, data);
    refresh();
    return result;
  }, [refresh]);

  // ── Delete ────────────────────────────────────────────
  const remove = useCallback(async (id) => {
    setError(null);
    await service.current.remove(id);
    refresh();
  }, [refresh]);

  // ── File upload ───────────────────────────────────────
  const upload = useCallback(async (file, fieldName, extraData) => {
    return service.current.upload(file, fieldName, extraData);
  }, []);

  return {
    items,
    meta,
    params,
    loading,
    error,
    setParams,
    refresh,
    create,
    update,
    remove,
    upload,
  };
}
