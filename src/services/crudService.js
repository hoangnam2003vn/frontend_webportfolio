/**
 * crudService.js — Generic CRUD service factory
 *
 * Usage:
 *   import createCrudService from './crudService';
 *   const postService = createCrudService('/posts');
 *   const { data } = await postService.list({ page: 1, search: 'hello' });
 *
 * Every model gets the same API surface automatically.
 */

import api from "./api";

/**
 * Build query string from params object, filtering null/undefined
 */
function buildQuery(params = {}) {
  const filtered = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== null && v !== undefined && v !== "")
  );
  return new URLSearchParams(filtered).toString();
}

/**
 * createCrudService
 * @param {string} endpoint — e.g. "/posts"
 * @returns {Object} service with list, getById, create, update, remove, upload
 */
function createCrudService(endpoint) {
  return {
    /**
     * GET /endpoint?page=&per_page=&search=&sort_by=&sort_dir=&[filters]
     * @returns {{ data: [], meta: { total, page, per_page, last_page } }}
     */
    list: async (params = {}) => {
      const qs = buildQuery(params);
      const url = qs ? `${endpoint}?${qs}` : endpoint;
      const res = await api.get(url);
      return res.data;
    },

    /**
     * GET /endpoint/:id
     */
    getById: async (id) => {
      const res = await api.get(`${endpoint}/${id}`);
      return res.data;
    },

    /**
     * POST /endpoint
     */
    create: async (payload) => {
      const res = await api.post(endpoint, payload);
      return res.data;
    },

    /**
     * PUT /endpoint/:id
     */
    update: async (id, payload) => {
      const res = await api.put(`${endpoint}/${id}`, payload);
      return res.data;
    },

    /**
     * DELETE /endpoint/:id
     */
    remove: async (id) => {
      const res = await api.delete(`${endpoint}/${id}`);
      return res.data;
    },

    /**
     * POST /endpoint/upload — multipart/form-data
     * Used by FILE and IMAGE field types
     */
    upload: async (file, fieldName = "file", extraData = {}) => {
      const formData = new FormData();
      formData.append(fieldName, file);
      Object.entries(extraData).forEach(([k, v]) => formData.append(k, v));
      const res = await api.post(`${endpoint}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },

    /**
     * PATCH /endpoint/:id — partial update
     */
    patch: async (id, payload) => {
      const res = await api.patch(`${endpoint}/${id}`, payload);
      return res.data;
    },
  };
}

export default createCrudService;
