import React, { useState, useCallback } from "react";
import theme from "../../config/theme";
import MODELS, { FIELD_TYPES } from "../../config/models";
import { useAuth } from "../../context/AuthContext";
import useCrud from "../../hooks/useCrud";
import useDisclosure from "../../hooks/useDisclosure";
import { buildInitialValues, extractApiErrors } from "../../utils/helpers";

import DataTable from "../../components/common/DataTable";
import Pagination from "../../components/common/Pagination";
import SearchBar from "../../components/common/SearchBar";
import Button from "../../components/common/Button";
import Modal, { ConfirmModal } from "../../components/common/Modal";
import DynamicForm from "../../components/forms/DynamicForm";
import { useToast } from "../../components/common/Toast";

export default function ModelPage({ modelKey }) {
  const model = MODELS[modelKey];
  const { hasAccess } = useAuth();
  const showToast = useToast();

  // ── Access guard ──────────────────────────────────────
  if (!model) {
    return (
      <div style={{ padding: "48px", textAlign: "center", color: theme.colors.text.tertiary }}>
        Model "{modelKey}" not found.
      </div>
    );
  }

  if (!hasAccess(model.roles)) {
    return (
      <div style={{ padding: "48px", textAlign: "center" }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔒</div>
        <div style={{ fontSize: theme.font.size.base, color: theme.colors.text.secondary }}>
          You don't have permission to access {model.labelPlural}.
        </div>
      </div>
    );
  }

  return <ModelPageInner model={model} modelKey={modelKey} showToast={showToast} />;
}

// ── Inner component (after access check) ─────────────────
function ModelPageInner({ model, modelKey, showToast }) {
  const { role } = useAuth();

  // Only audit_logs is truly read-only; respect readonly fields per-model
  const canCreate = modelKey !== "audit_logs";
  const canEdit = modelKey !== "audit_logs";
  const canDelete = modelKey !== "audit_logs" && role === "admin";

  // ── CRUD state ────────────────────────────────────────
  const crud = useCrud(model.apiEndpoint, { page: 1, per_page: 20 });

  // ── Sort state ────────────────────────────────────────
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState("asc");

  const handleSort = useCallback((fieldKey) => {
    const newDir = sortBy === fieldKey && sortDir === "asc" ? "desc" : "asc";
    setSortBy(fieldKey);
    setSortDir(newDir);
    crud.setParams({ sort_by: fieldKey, sort_dir: newDir, page: 1 });
  }, [sortBy, sortDir, crud]);

  // ── Search ────────────────────────────────────────────
  const handleSearch = useCallback((value) => {
    crud.setParams({ search: value, page: 1 });
  }, [crud]);

  // ── Create/Edit modal ─────────────────────────────────
  const formModal = useDisclosure();
  const [editingRecord, setEditingRecord] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);

  const openCreate = () => {
    setEditingRecord(null);
    setFormValues(buildInitialValues(model.fields));
    setFormErrors({});
    formModal.open();
  };

  const openEdit = (record) => {
    setEditingRecord(record);
    setFormValues(buildInitialValues(model.fields, record));
    setFormErrors({});
    formModal.open();
  };

  const handleFieldChange = useCallback((key, value) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
    setFormErrors((prev) => ({ ...prev, [key]: undefined }));
  }, []);

  // ── Client-side required validation ──────────────────
  const validate = () => {
    const errs = {};
    model.fields
      .filter((f) => f.required && !f.readonly)
      .forEach((f) => {
        const val = formValues[f.key];
        if (val === "" || val === null || val === undefined) {
          errs[f.key] = `${f.label} is required.`;
        }
      });
    return errs;
  };

  const handleFormSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    setFormLoading(true);
    try {
      // Handle file fields: upload first, then replace with URL
      const payload = { ...formValues };
      for (const field of model.fields) {
        if (
          (field.type === FIELD_TYPES.FILE || field.type === FIELD_TYPES.IMAGE) &&
          payload[field.key] instanceof File
        ) {
          const uploadResult = await crud.upload(payload[field.key], field.key);
          payload[field.key] = uploadResult.url || uploadResult.path || uploadResult.data?.url;
        }
      }

      if (editingRecord) {
        await crud.update(editingRecord.id, payload);
        showToast(`${model.label} updated successfully.`, "success");
      } else {
        await crud.create(payload);
        showToast(`${model.label} created successfully.`, "success");
      }
      formModal.close();
    } catch (err) {
      const msg = extractApiErrors(err);
      showToast(msg, "error");
      // Try to map API errors back to fields
      if (err?.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
    } finally {
      setFormLoading(false);
    }
  };

  // ── Delete confirm modal ──────────────────────────────
  const deleteModal = useDisclosure();
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const openDelete = (record) => {
    setDeletingRecord(record);
    deleteModal.open();
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await crud.remove(deletingRecord.id);
      showToast(`${model.label} deleted.`, "success");
      deleteModal.close();
    } catch (err) {
      showToast(extractApiErrors(err), "error");
    } finally {
      setDeleteLoading(false);
    }
  };

  // ── Searchable fields hint ────────────────────────────
  const searchableFields = model.fields.filter((f) => f.searchable).map((f) => f.label);

  // ── Name of deleting record (for confirm dialog) ──────
  const deletingName = deletingRecord
    ? deletingRecord.name || deletingRecord.title || deletingRecord.key || `#${deletingRecord.id}`
    : "";

  return (
    <>
      {/* ── Toolbar ─────────────────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}>
        <SearchBar
          onChange={handleSearch}
          placeholder={searchableFields.length > 0 ? `Search ${searchableFields.slice(0, 2).join(", ")}…` : "Search…"}
        />

        <div style={{ flex: 1 }} />

        {/* Row count badge */}
        {!crud.loading && (
          <span style={{
            fontSize: theme.font.size.xs,
            color: theme.colors.text.tertiary,
            padding: "4px 10px",
            background: theme.colors.bg.base,
            borderRadius: theme.radius.full,
            border: `1px solid ${theme.colors.border.subtle}`,
          }}>
            {crud.meta.total ?? crud.items.length} records
          </span>
        )}

        {canCreate && (
          <Button onClick={openCreate} icon="+" size="md">
            New {model.label}
          </Button>
        )}
      </div>

      {/* ── Error banner ────────────────────────────── */}
      {crud.error && (
        <div style={{
          padding: "12px 16px",
          background: theme.colors.accent.dangerLight,
          color: theme.colors.accent.danger,
          borderRadius: theme.radius.md,
          fontSize: theme.font.size.sm,
          marginBottom: "16px",
          border: `1px solid ${theme.colors.accent.danger}30`,
        }}>
          ⚠ {crud.error}
        </div>
      )}

      {/* ── Data table ──────────────────────────────── */}
      <DataTable
        fields={model.fields}
        items={crud.items}
        loading={crud.loading}
        sortBy={sortBy}
        sortDir={sortDir}
        onSort={handleSort}
        onEdit={openEdit}
        onDelete={openDelete}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      {/* ── Pagination ──────────────────────────────── */}
      <Pagination
        meta={crud.meta}
        onChange={(page) => crud.setParams({ page })}
      />

      {/* ── Create/Edit Modal ───────────────────────── */}
      <Modal
        isOpen={formModal.isOpen}
        onClose={formModal.close}
        title={editingRecord ? `Edit ${model.label}` : `New ${model.label}`}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={formModal.close} disabled={formLoading}>
              Cancel
            </Button>
            <Button onClick={handleFormSubmit} disabled={formLoading}>
              {formLoading ? "Saving…" : editingRecord ? "Save Changes" : `Create ${model.label}`}
            </Button>
          </>
        }
      >
        <DynamicForm
          fields={model.fields}
          values={formValues}
          onChange={handleFieldChange}
          errors={formErrors}
          disabled={formLoading}
        />
      </Modal>

      {/* ── Delete Confirm Modal ────────────────────── */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={deleteModal.close}
        onConfirm={handleDelete}
        itemName={deletingName}
        loading={deleteLoading}
      />
    </>
  );
}
