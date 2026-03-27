/**
 * models.js — Central model registry
 *
 * Each entry defines a backend resource with:
 *   - apiEndpoint: REST path
 *   - label/labelPlural: display names
 *   - icon: emoji shorthand
 *   - fields: schema-driven form + list config
 *   - roles: which roles can access ('' = all authenticated)
 *
 * Adding a new model = one new entry here. No other files change.
 */

export const FIELD_TYPES = {
  TEXT: "text",
  TEXTAREA: "textarea",
  NUMBER: "number",
  EMAIL: "email",
  PASSWORD: "password",
  SELECT: "select",
  MULTI_SELECT: "multi_select",
  BOOLEAN: "boolean",
  DATE: "date",
  DATETIME: "datetime",
  FILE: "file",
  IMAGE: "image",
  RELATION: "relation",
  RICH_TEXT: "rich_text",
};

/**
 * Field definition shape:
 * {
 *   key: string           — maps to API field name
 *   label: string         — UI display label
 *   type: FIELD_TYPES.*   — determines input widget
 *   required?: boolean
 *   showInList?: boolean  — render in table column
 *   searchable?: boolean  — include in search filter
 *   sortable?: boolean
 *   options?: Array<{value, label}>   — for SELECT types
 *   relationModel?: string            — for RELATION type
 *   accept?: string                   — for FILE/IMAGE (MIME)
 *   readonly?: boolean                — display only
 *   placeholder?: string
 *   defaultValue?: any
 * }
 */

const MODELS = {
  // ── 1. Users ─────────────────────────────────────────────
  users: {
    apiEndpoint: "/users",
    label: "User",
    labelPlural: "Users",
    icon: "👤",
    roles: ["admin"],
    fields: [
      { key: "id", label: "ID", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true },
      { key: "name", label: "Full Name", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true, sortable: true },
      { key: "email", label: "Email", type: FIELD_TYPES.EMAIL, required: true, showInList: true, searchable: true, sortable: true },
      { key: "password", label: "Password", type: FIELD_TYPES.PASSWORD, required: true, showInList: false },
      {
        key: "role", label: "Role", type: FIELD_TYPES.SELECT, required: true, showInList: true, sortable: true,
        options: [
          { value: "admin", label: "Admin" },
          { value: "editor", label: "Editor" },
          { value: "viewer", label: "Viewer" },
        ],
      },
      { key: "avatar", label: "Avatar", type: FIELD_TYPES.IMAGE, showInList: true, accept: "image/*" },
      { key: "created_at", label: "Created", type: FIELD_TYPES.DATETIME, showInList: true, readonly: true, sortable: true },
    ],
  },

  // ── 2. Posts ─────────────────────────────────────────────
  posts: {
    apiEndpoint: "/posts",
    label: "Post",
    labelPlural: "Posts",
    icon: "📝",
    roles: ["admin", "editor"],
    fields: [
      { key: "id", label: "ID", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true },
      { key: "title", label: "Title", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true, sortable: true, placeholder: "Post title..." },
      { key: "slug", label: "Slug", type: FIELD_TYPES.TEXT, showInList: true, searchable: true, placeholder: "url-friendly-slug" },
      { key: "content", label: "Content", type: FIELD_TYPES.RICH_TEXT, required: true, showInList: false },
      { key: "excerpt", label: "Excerpt", type: FIELD_TYPES.TEXTAREA, showInList: false, placeholder: "Short description..." },
      {
        key: "status", label: "Status", type: FIELD_TYPES.SELECT, required: true, showInList: true, sortable: true, defaultValue: "draft",
        options: [
          { value: "draft", label: "Draft" },
          { value: "published", label: "Published" },
          { value: "archived", label: "Archived" },
        ],
      },
      { key: "cover_image", label: "Cover Image", type: FIELD_TYPES.IMAGE, showInList: true, accept: "image/*" },
      { key: "category_id", label: "Category", type: FIELD_TYPES.RELATION, showInList: true, relationModel: "categories" },
      { key: "tags", label: "Tags", type: FIELD_TYPES.MULTI_SELECT, showInList: false, options: [] },
      { key: "author_id", label: "Author", type: FIELD_TYPES.RELATION, showInList: true, relationModel: "users" },
      { key: "published_at", label: "Published At", type: FIELD_TYPES.DATETIME, showInList: true, sortable: true },
      { key: "created_at", label: "Created", type: FIELD_TYPES.DATETIME, showInList: false, readonly: true },
    ],
  },

  // ── 3. Categories ────────────────────────────────────────
  categories: {
    apiEndpoint: "/categories",
    label: "Category",
    labelPlural: "Categories",
    icon: "🗂️",
    roles: ["admin", "editor"],
    fields: [
      { key: "id", label: "ID", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true },
      { key: "name", label: "Name", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true, sortable: true },
      { key: "slug", label: "Slug", type: FIELD_TYPES.TEXT, showInList: true, searchable: true },
      { key: "description", label: "Description", type: FIELD_TYPES.TEXTAREA, showInList: false },
      { key: "parent_id", label: "Parent Category", type: FIELD_TYPES.RELATION, showInList: true, relationModel: "categories" },
      { key: "order", label: "Order", type: FIELD_TYPES.NUMBER, showInList: true, sortable: true, defaultValue: 0 },
      { key: "is_active", label: "Active", type: FIELD_TYPES.BOOLEAN, showInList: true, defaultValue: true },
    ],
  },

  // ── 4. Products ──────────────────────────────────────────
  products: {
    apiEndpoint: "/products",
    label: "Product",
    labelPlural: "Products",
    icon: "📦",
    roles: ["admin", "editor"],
    fields: [
      { key: "id", label: "ID", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true },
      { key: "name", label: "Name", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true, sortable: true },
      { key: "sku", label: "SKU", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true },
      { key: "description", label: "Description", type: FIELD_TYPES.TEXTAREA, showInList: false },
      { key: "price", label: "Price ($)", type: FIELD_TYPES.NUMBER, required: true, showInList: true, sortable: true },
      { key: "stock", label: "Stock", type: FIELD_TYPES.NUMBER, showInList: true, sortable: true, defaultValue: 0 },
      { key: "category_id", label: "Category", type: FIELD_TYPES.RELATION, showInList: true, relationModel: "categories" },
      { key: "image", label: "Image", type: FIELD_TYPES.IMAGE, showInList: true, accept: "image/*" },
      {
        key: "status", label: "Status", type: FIELD_TYPES.SELECT, showInList: true, defaultValue: "active",
        options: [
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "out_of_stock", label: "Out of Stock" },
        ],
      },
    ],
  },

  // ── 5. Orders ────────────────────────────────────────────
  orders: {
    apiEndpoint: "/orders",
    label: "Order",
    labelPlural: "Orders",
    icon: "🛒",
    roles: ["admin"],
    fields: [
      { key: "id", label: "Order #", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true, sortable: true },
      { key: "customer_name", label: "Customer", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true },
      { key: "customer_email", label: "Email", type: FIELD_TYPES.EMAIL, required: true, showInList: true, searchable: true },
      { key: "total", label: "Total ($)", type: FIELD_TYPES.NUMBER, showInList: true, sortable: true, readonly: true },
      {
        key: "status", label: "Status", type: FIELD_TYPES.SELECT, required: true, showInList: true, sortable: true, defaultValue: "pending",
        options: [
          { value: "pending", label: "Pending" },
          { value: "processing", label: "Processing" },
          { value: "shipped", label: "Shipped" },
          { value: "delivered", label: "Delivered" },
          { value: "cancelled", label: "Cancelled" },
        ],
      },
      { key: "notes", label: "Notes", type: FIELD_TYPES.TEXTAREA, showInList: false },
      { key: "created_at", label: "Date", type: FIELD_TYPES.DATETIME, showInList: true, readonly: true, sortable: true },
    ],
  },

  // ── 6. Media / Files ─────────────────────────────────────
  media: {
    apiEndpoint: "/media",
    label: "Media",
    labelPlural: "Media",
    icon: "🖼️",
    roles: ["admin", "editor"],
    fields: [
      { key: "id", label: "ID", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true },
      { key: "name", label: "File Name", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true, sortable: true },
      { key: "file", label: "File", type: FIELD_TYPES.FILE, required: true, showInList: false, accept: "*/*" },
      { key: "url", label: "URL", type: FIELD_TYPES.TEXT, showInList: true, readonly: true },
      { key: "mime_type", label: "Type", type: FIELD_TYPES.TEXT, showInList: true, readonly: true, sortable: true },
      { key: "size", label: "Size (bytes)", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true, sortable: true },
      { key: "alt_text", label: "Alt Text", type: FIELD_TYPES.TEXT, showInList: false },
      { key: "folder", label: "Folder", type: FIELD_TYPES.TEXT, showInList: true, searchable: true },
      { key: "created_at", label: "Uploaded", type: FIELD_TYPES.DATETIME, showInList: true, readonly: true, sortable: true },
    ],
  },

  // ── 7. Comments ──────────────────────────────────────────
  comments: {
    apiEndpoint: "/comments",
    label: "Comment",
    labelPlural: "Comments",
    icon: "💬",
    roles: ["admin", "editor"],
    fields: [
      { key: "id", label: "ID", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true },
      { key: "author_name", label: "Author", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true, sortable: true },
      { key: "author_email", label: "Email", type: FIELD_TYPES.EMAIL, showInList: true, searchable: true },
      { key: "content", label: "Content", type: FIELD_TYPES.TEXTAREA, required: true, showInList: true, searchable: true },
      { key: "post_id", label: "Post", type: FIELD_TYPES.RELATION, showInList: true, relationModel: "posts" },
      {
        key: "status", label: "Status", type: FIELD_TYPES.SELECT, required: true, showInList: true, sortable: true, defaultValue: "pending",
        options: [
          { value: "pending", label: "Pending" },
          { value: "approved", label: "Approved" },
          { value: "spam", label: "Spam" },
          { value: "trash", label: "Trash" },
        ],
      },
      { key: "created_at", label: "Date", type: FIELD_TYPES.DATETIME, showInList: true, readonly: true, sortable: true },
    ],
  },

  // ── 8. Tags ──────────────────────────────────────────────
  tags: {
    apiEndpoint: "/tags",
    label: "Tag",
    labelPlural: "Tags",
    icon: "🏷️",
    roles: ["admin", "editor"],
    fields: [
      { key: "id", label: "ID", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true },
      { key: "name", label: "Name", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true, sortable: true },
      { key: "slug", label: "Slug", type: FIELD_TYPES.TEXT, showInList: true, searchable: true },
      { key: "color", label: "Color", type: FIELD_TYPES.TEXT, showInList: true, placeholder: "#7C6BFF" },
      { key: "count", label: "Usage Count", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true, sortable: true, defaultValue: 0 },
    ],
  },

  // ── 9. Settings ──────────────────────────────────────────
  settings: {
    apiEndpoint: "/settings",
    label: "Setting",
    labelPlural: "Settings",
    icon: "⚙️",
    roles: ["admin"],
    fields: [
      { key: "id", label: "ID", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true },
      { key: "key", label: "Key", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true, sortable: true },
      { key: "value", label: "Value", type: FIELD_TYPES.TEXTAREA, required: true, showInList: true },
      {
        key: "group", label: "Group", type: FIELD_TYPES.SELECT, showInList: true, sortable: true,
        options: [
          { value: "general", label: "General" },
          { value: "email", label: "Email" },
          { value: "payment", label: "Payment" },
          { value: "seo", label: "SEO" },
          { value: "social", label: "Social" },
        ],
      },
      { key: "type", label: "Type", type: FIELD_TYPES.TEXT, showInList: true, readonly: true },
      { key: "description", label: "Description", type: FIELD_TYPES.TEXT, showInList: false },
    ],
  },

  // ── 10. Customers ────────────────────────────────────────
  customers: {
    apiEndpoint: "/customers",
    label: "Customer",
    labelPlural: "Customers",
    icon: "🧑‍💼",
    roles: ["admin", "editor"],
    fields: [
      { key: "id", label: "ID", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true },
      { key: "first_name", label: "First Name", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true, sortable: true },
      { key: "last_name", label: "Last Name", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true, sortable: true },
      { key: "email", label: "Email", type: FIELD_TYPES.EMAIL, required: true, showInList: true, searchable: true, sortable: true },
      { key: "phone", label: "Phone", type: FIELD_TYPES.TEXT, showInList: true, searchable: true },
      { key: "address", label: "Address", type: FIELD_TYPES.TEXTAREA, showInList: false },
      { key: "city", label: "City", type: FIELD_TYPES.TEXT, showInList: true, searchable: true, sortable: true },
      { key: "country", label: "Country", type: FIELD_TYPES.TEXT, showInList: true, sortable: true },
      { key: "notes", label: "Notes", type: FIELD_TYPES.TEXTAREA, showInList: false },
      { key: "created_at", label: "Joined", type: FIELD_TYPES.DATETIME, showInList: true, readonly: true, sortable: true },
    ],
  },

  // ── 11. Roles & Permissions ──────────────────────────────
  roles: {
    apiEndpoint: "/roles",
    label: "Role",
    labelPlural: "Roles",
    icon: "🔐",
    roles: ["admin"],
    fields: [
      { key: "id", label: "ID", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true },
      { key: "name", label: "Name", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true, sortable: true },
      { key: "slug", label: "Slug", type: FIELD_TYPES.TEXT, required: true, showInList: true, searchable: true },
      { key: "description", label: "Description", type: FIELD_TYPES.TEXTAREA, showInList: false },
      { key: "permissions", label: "Permissions", type: FIELD_TYPES.MULTI_SELECT, showInList: false,
        options: [
          { value: "create", label: "Create" },
          { value: "read", label: "Read" },
          { value: "update", label: "Update" },
          { value: "delete", label: "Delete" },
          { value: "publish", label: "Publish" },
          { value: "manage_users", label: "Manage Users" },
        ],
      },
      { key: "is_system", label: "System Role", type: FIELD_TYPES.BOOLEAN, showInList: true, readonly: true, defaultValue: false },
      { key: "created_at", label: "Created", type: FIELD_TYPES.DATETIME, showInList: true, readonly: true, sortable: true },
    ],
  },

  // ── 12. Audit Logs ───────────────────────────────────────
  audit_logs: {
    apiEndpoint: "/audit-logs",
    label: "Audit Log",
    labelPlural: "Audit Logs",
    icon: "📋",
    roles: ["admin"],
    fields: [
      { key: "id", label: "ID", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true },
      { key: "user_id", label: "User", type: FIELD_TYPES.RELATION, showInList: true, relationModel: "users", readonly: true },
      { key: "action", label: "Action", type: FIELD_TYPES.TEXT, showInList: true, searchable: true, readonly: true, sortable: true },
      { key: "resource", label: "Resource", type: FIELD_TYPES.TEXT, showInList: true, searchable: true, readonly: true, sortable: true },
      { key: "resource_id", label: "Resource ID", type: FIELD_TYPES.NUMBER, showInList: true, readonly: true },
      { key: "changes", label: "Changes (JSON)", type: FIELD_TYPES.TEXTAREA, showInList: false, readonly: true },
      { key: "ip_address", label: "IP Address", type: FIELD_TYPES.TEXT, showInList: true, readonly: true },
      { key: "created_at", label: "Timestamp", type: FIELD_TYPES.DATETIME, showInList: true, readonly: true, sortable: true },
    ],
  },
};

export default MODELS;
