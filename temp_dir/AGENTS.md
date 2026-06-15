# Project Standards & Guidelines

## 1. Modularity & Performance
- **Sub-component Extraction:** Every major page or complex component must be broken down into smaller, manageable sub-files. This prevents UI lag, improves maintainability, and facilitates easier debugging.
- **Lazy Loading:** Use dynamic imports for large components or routes where applicable to keep the initial bundle size small.

## 2. Shared Components (Centralized System)
All reusable logic and UI patterns must be moved to `src/components/shared/`.

### KPI Cards System
- Use a standardized `KpiCard` component for all dashboard metrics.
- Support for icons, trends, and dynamic color palettes.

### Drag & Drop System
- Implement `DraggableModal` using `react-draggable`.
- Ensure all modals and PDF previewers are movable by the user for better workspace flexibility.

### Bulk CSV Upload System
- **Performance:** Must handle large datasets efficiently using web workers or chunked processing.
- **User Guidance:** Provide clear instructions on required headers and data formats.
- **Preview:** Always show a data preview table before final confirmation.

### CSV Export System
- **Speed:** Fast generation of CSV files.
- **Depth:** Support exporting data from both the main table and associated modal details simultaneously.

### PDF Printing System
- Standardized header format (Logo, Company Name, Document Title).
- Consistent layout and styling for all printable reports.

## 3. Infrastructure & Deployment
- **Source Control:** All code must be maintained in **GitHub**.
- **Deployment:** **Vercel** is the primary deployment platform.
- **Database:** **Google Sheets** acts as the central database via Google Apps Script (GAS).
- **Communication:** Use **JSON** format for all Frontend-Backend communication as defined in the API service.

## 5. Performance & Concurrency (Real-world Usage)
- **LockService (GAS):** Always use `LockService` in Google Apps Script to prevent data corruption when multiple users write simultaneously.
- **Data Pagination:** For large datasets, implement server-side filtering or limit the initial data load to avoid browser lag.
- **Optimistic UI:** Show immediate feedback (loading states/skeletons) to the user while waiting for Google Sheets to respond (which typically takes 1-2 seconds).
- **Batch Operations:** When writing multiple rows, send them in a single `write` request instead of multiple individual calls.
- **Caching:** Use `localStorage` or state management to cache static data (like User Lists or Category Lists) to reduce redundant API calls.

## 6. Layout & UI Standards
- **Page Container Spacing:** Every new page must follow the base container structure: `<div className="flex flex-1 w-full flex-col animate-fadeIn bg-transparent space-y-4">`. **NEVER** add `pb-6` or any bottom padding to the main container.
- **Page Background:** New pages must not have a redundant background; use the main layout's background directly (`bg-transparent` on containers).
- **Footer Spacing Rules:** The space at the bottom is universally managed by the unified component in `Layout.tsx` (using `mt-auto pt-8 pb-3.5`). Individual pages must not manage their own bottom margins/padding to prevent overlapping or layout issues.
- **User Guide Component:** Anytime a `UserGuidePanel` is added or modified in a module, its explanation must accurately match the specific functional icons and capabilities present on that exact page.

## 7. Typography Standards
- **JetBrains Mono:** Use for numbers and English text requiring a technical look.
- **Noto Sans Thai:** Use for Thai text for a modern and clean appearance.
- **Inter:** Use for basic UI text and overall layout.

## 8. Specific UI Component Rules
### Page Headers (ส่วนหัวของหน้าจอ)
- **Background:** Must be fully transparent, placed directly on the page background without extra cards.
- **Title Text:** Font size `24px` / `text-2xl`, `font-black`, `leading-none` (tightly spaced). Use theme colors.
- **Description Text:** Font size `11px` / `text-[11px]`, `font-medium`, color `text-slate-500`.
- **Internal Spacing:** Gap between Title and Description should be `mt-0.5` (~2px).
- **Icon Box:** Outer shape `w-10 h-10` (40px square) and `rounded-2xl` (16px border radius) to naturally fit the height of 2 text lines. Add a subtle border for dimension.
- **Icon Size:** Inner icon size should be roughly `20px` to `22px`.

### Data Tables (ตารางข้อมูล)
- **Container Card:** The entire wrapper encompassing the Toolbar, Table, and Pagination should have slightly rounded corners (e.g., `rounded-xl` or `rounded-2xl`) and shadow if appropriate.
- **Toolbar (Top Actions / Search / Filter):** Height `py-4` with `bg-white`. Look and feel should match the User Permissions page.
- **Header Row:** Padding `py-4` with bottom border `border-b-2`. Font size `12px`.
- **Data Rows:** Padding `py-2.5 px-4`. Font size `12px` for main content.
- **Badges/Tags:** Should be downsized to `11px`.
- **Action Buttons:** Small square buttons `w-8 h-8` with spacing `gap-[1px]`.
- **Pagination Footer:** Padding `py-3`, background `bg-[#F0EAE1]/80`, with top border `border-t-[1.5px]`.