# AdminPanel — Generic CRUD Frontend

Frontend quản trị cho hệ thống backend 12 models. Được xây dựng với **React + TypeScript-ready JavaScript**, kiến trúc component-based, schema-driven CRUD.

---

## Hướng dẫn chạy

### Yêu cầu
- Node.js >= 16
- npm hoặc yarn

### Cài đặt

```bash
cd admin-system
cp .env.example .env          # Cấu hình API URL
npm install
npm start                     # Chạy tại http://localhost:3000
```

### Biến môi trường

```env
REACT_APP_API_URL=http://localhost:3000/api   # URL backend của bạn
```

---

## Cấu trúc thư mục

```
src/
├── config/
│   ├── models.js          # ← Schema 12 models (ĐIỂM MẤU CHỐT)
│   └── theme.js           # Design tokens (màu, font, spacing)
│
├── services/
│   ├── api.js             # Axios instance + JWT interceptors
│   ├── crudService.js     # Generic CRUD factory (list/create/update/delete/upload)
│   └── authService.js     # Login / logout / me
│
├── context/
│   └── AuthContext.jsx    # JWT auth state global (login, logout, hasAccess)
│
├── hooks/
│   ├── useCrud.js         # Generic data hook — dùng cho tất cả models
│   └── useDisclosure.js   # Toggle open/close cho modal
│
├── utils/
│   └── helpers.js         # formatDate, debounce, buildInitialValues, extractApiErrors...
│
├── components/
│   ├── common/
│   │   ├── Button.jsx        # variants: primary | secondary | danger | ghost
│   │   ├── Badge.jsx         # Status chip với color map tự động
│   │   ├── Spinner.jsx       # Loading indicator + LoadingOverlay
│   │   ├── Modal.jsx         # Dialog + ConfirmModal
│   │   ├── DataTable.jsx     # Generic table (sort, empty state, loading)
│   │   ├── Pagination.jsx    # Page controls với ellipsis
│   │   ├── SearchBar.jsx     # Debounced search input
│   │   └── Toast.jsx         # Notification toasts (success/error/info)
│   │
│   ├── forms/
│   │   └── DynamicForm.jsx   # Schema-driven form (render widget theo field type)
│   │
│   └── layout/
│       ├── AppLayout.jsx     # Root layout: Sidebar + main
│       ├── Sidebar.jsx       # Left nav (models nhóm theo section)
│       └── Topbar.jsx        # Top bar với user menu + logout
│
├── pages/
│   ├── auth/
│   │   └── LoginPage.jsx     # Form đăng nhập
│   └── dashboard/
│       ├── DashboardPage.jsx # Trang tổng quan (model cards)
│       └── ModelPage.jsx     # ← Generic CRUD page cho TẤT CẢ models
│
├── App.jsx     # Root router (login ↔ authenticated shell)
└── index.js    # React entry point
```

---

## Kiến trúc & Nguyên tắc

### 1. Schema-driven — Thêm model = 1 object trong `models.js`

```js
// src/config/models.js
const MODELS = {
  products: {
    apiEndpoint: "/products",
    label: "Product",
    labelPlural: "Products",
    icon: "📦",
    roles: ["admin", "editor"],     // phân quyền
    fields: [
      { key: "name",  type: "text",   required: true, showInList: true, searchable: true },
      { key: "price", type: "number", required: true, showInList: true, sortable: true },
      { key: "status",type: "select", showInList: true,
        options: [{ value: "active", label: "Active" }, ...] },
      { key: "image", type: "image",  showInList: true, accept: "image/*" },
    ],
  },
};
```

Kết quả tự động:
- ✅ Bảng danh sách với đúng columns
- ✅ Form create/edit với đúng input widget
- ✅ Tìm kiếm theo searchable fields
- ✅ Sort theo sortable fields
- ✅ File upload với preview
- ✅ Validation required fields
- ✅ Phân quyền theo roles

### 2. Service Layer — Không gọi API trong component

```js
// services/crudService.js — factory pattern
const postService = createCrudService("/posts");
await postService.list({ page: 1, search: "hello", sort_by: "title" });
await postService.create({ title: "New post" });
await postService.update(5, { status: "published" });
await postService.remove(5);
await postService.upload(file, "cover_image");
```

### 3. Generic Hook — 1 hook cho tất cả models

```js
// hooks/useCrud.js
const crud = useCrud("/posts", { page: 1, per_page: 20 });

crud.items        // danh sách records
crud.meta         // { total, page, per_page, last_page }
crud.loading      // boolean
crud.error        // string | null
crud.setParams()  // thay đổi page/search/sort → tự động refetch
crud.create(data)
crud.update(id, data)
crud.remove(id)
```

### 4. Authorization

```js
// context/AuthContext.jsx
const { hasAccess } = useAuth();
hasAccess(["admin"])           // true nếu user.role === "admin"
hasAccess(["admin", "editor"]) // true nếu user là admin hoặc editor
hasAccess([])                  // true nếu đã đăng nhập (bất kỳ role)
```

---

## 12 Models được hỗ trợ

| # | Model | Icon | Roles | Endpoint |
|---|-------|------|-------|----------|
| 1 | Users | 👤 | admin | /users |
| 2 | Posts | 📝 | admin, editor | /posts |
| 3 | Categories | 🗂️ | admin, editor | /categories |
| 4 | Products | 📦 | admin, editor | /products |
| 5 | Orders | 🛒 | admin | /orders |
| 6 | Media | 🖼️ | admin, editor | /media |
| 7 | Comments | 💬 | admin, editor | /comments |
| 8 | Tags | 🏷️ | admin, editor | /tags |
| 9 | Settings | ⚙️ | admin | /settings |
| 10 | Customers | 🧑‍💼 | admin, editor | /customers |
| 11 | Roles | 🔐 | admin | /roles |
| 12 | Audit Logs | 📋 | admin | /audit-logs |

---

## API Contract (Backend phải trả về)

### Login
```
POST /api/auth/login
Body: { email, password }
Response: { token: "jwt...", user: { id, name, email, role } }
```

### List
```
GET /api/{endpoint}?page=1&per_page=20&search=&sort_by=&sort_dir=
Response: {
  data: [...],
  meta: { total, page, per_page, last_page }
}
```

### CRUD
```
POST   /api/{endpoint}          → create
PUT    /api/{endpoint}/:id      → update
DELETE /api/{endpoint}/:id      → delete
POST   /api/{endpoint}/upload   → file upload (multipart)
```

---

## Field Types hỗ trợ

| Type | Widget | Mô tả |
|------|--------|-------|
| `text` | Input text | |
| `email` | Input email | |
| `password` | Input password (masked) | |
| `number` | Input number | |
| `textarea` | Textarea | |
| `rich_text` | Textarea lớn | Nếu cần WYSIWYG thì tích hợp Quill/TipTap |
| `select` | Dropdown | Cần `options: [{value, label}]` |
| `multi_select` | Toggle chips | Cần `options` |
| `boolean` | Toggle switch | |
| `date` | Date picker | |
| `datetime` | Datetime picker | |
| `image` | File drop + preview | `accept: "image/*"` |
| `file` | File drop | `accept: "*/*"` |
| `relation` | Dropdown (hiện tại dùng select) | `relationModel: "categories"` |

---

## Mở rộng

### Thêm model mới
Chỉ cần thêm 1 entry vào `src/config/models.js` → tất cả còn lại tự động.

### Đổi API URL
Chỉnh `REACT_APP_API_URL` trong `.env`.

### Thêm phân quyền
Thêm role mới vào `AuthContext` và cập nhật `roles` trong model config.

### Tích hợp rich text editor
Thay `TextareaInput` trong `DynamicForm.jsx` case `RICH_TEXT` bằng Quill hoặc TipTap.

### Tích hợp react-router
Thay state router trong `App.jsx` bằng `<BrowserRouter>` + `<Route>` nếu cần deep linking.

---

## Tech Stack

- **React 18** — UI framework
- **Axios** — HTTP client (service layer)
- **Context API** — Auth state
- **CSS-in-JS (inline styles)** — No Tailwind / CSS modules needed
- **No other dependencies** — Lean & portable
