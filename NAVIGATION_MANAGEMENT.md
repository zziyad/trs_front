# Navigation Management Guide

This document provides step-by-step instructions for managing navigation links, moving them between sections, and updating the sidebar in the TRS Frontend application.

## 🚨 Why It's Complex

The navigation system involves **4 different files** that must be updated together:
1. **`src/config/navigation.ts`** - Defines the navigation structure
2. **`src/config/routes.ts`** - Defines the routing configuration
3. **`src/config/sitemap.ts`** - Defines SEO sitemap structure
4. **`src/components/layout/Sidebar.tsx`** - The actual sidebar component

If you update only some files, the navigation won't work properly!

## 📋 Step-by-Step Process

### **Step 1: Plan Your Changes**

Before making any changes, decide:
- **What link** you want to move/change
- **Where** you want to move it to
- **What the new path** should be
- **What section** it should belong to

### **Step 2: Update Navigation Structure**

**File**: `src/config/navigation.ts`

**What to do**:
1. **Remove** the link from its current location
2. **Add** it to the new location
3. **Update** the `href` path if needed

**Example - Moving VAPP from Fleet Management to Main Navigation**:

```typescript
// BEFORE: VAPP was under Fleet Management
{
  id: 'fleet-management',
  title: 'Fleet Management',
  items: [
    // ... other items ...
    {
      id: 'vapp',
      title: 'VAPP',
      href: '/events/[eventId]/fleet-management/vapp', // OLD PATH
      icon: ClipboardList,
      description: 'Vehicle Assignment and Planning Protocol'
    }
  ]
}

// AFTER: VAPP moved to Main Navigation
{
  id: 'main',
  title: 'Main Navigation',
  items: [
    // ... other items ...
    {
      id: 'vapp',
      title: 'VAPP',
      href: '/events/[eventId]/vapp', // NEW PATH
      icon: ClipboardList,
      description: 'Vehicle Assignment and Planning Protocol'
    }
  ]
}
```

### **Step 3: Update Routes Configuration**

**File**: `src/config/routes.ts`

**What to do**:
1. **Find** the route entry for your link
2. **Update** the `path` to match the new location
3. **Update** the `breadcrumbs` array

**Example**:

```typescript
// BEFORE
'vapp': {
  path: '/events/[eventId]/fleet-management/vapp', // OLD PATH
  component: 'VAPPage',
  title: 'VAPP',
  description: 'Vehicle Assignment and Planning Protocol',
  icon: 'ClipboardList',
  layout: 'default',
  breadcrumbs: ['Fleet Management', 'VAPP'] // OLD BREADCRUMBS
},

// AFTER
'vapp': {
  path: '/events/[eventId]/vapp', // NEW PATH
  component: 'VAPPage',
  title: 'VAPP',
  description: 'Vehicle Assignment and Planning Protocol',
  icon: 'ClipboardList',
  layout: 'default',
  breadcrumbs: ['VAPP'] // NEW BREADCRUMBS
},
```

### **Step 4: Update Sitemap Configuration**

**File**: `src/config/sitemap.ts`

**What to do**:
1. **Find** the sitemap entry for your link
2. **Update** the `url` to match the new path
3. **Update** the `section` and `subsection` if needed

**Example**:

```typescript
// BEFORE
{
  url: '/events/[eventId]/fleet-management/vapp', // OLD URL
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.7,
  title: 'VAPP',
  description: 'Vehicle Assignment and Planning Protocol',
  section: 'Fleet Management', // OLD SECTION
  subsection: 'VAPP',
  icon: 'ClipboardList'
},

// AFTER
{
  url: '/events/[eventId]/vapp', // NEW URL
  lastModified: new Date(),
  changeFrequency: 'weekly',
  priority: 0.7,
  title: 'VAPP',
  description: 'Vehicle Assignment and Planning Protocol',
  section: 'Main Navigation', // NEW SECTION
  subsection: 'VAPP',
  icon: 'ClipboardList'
},
```

### **Step 5: Update Global Constants (if needed)**

**File**: `src/config/index.ts`

**What to do**:
1. **Find** the route constant for your link
2. **Update** the path value

**Example**:

```typescript
// BEFORE
VAPP: '/events/[eventId]/fleet-management/vapp',

// AFTER
VAPP: '/events/[eventId]/vapp',
```

### **Step 6: Update Sidebar Component**

**File**: `src/components/layout/Sidebar.tsx`

**What to do**:
1. **Remove** the link from its current location in `defaultItems`
2. **Add** it to the new location
3. **Update** the `href` path
4. **Update** auto-expand logic if needed

**Example - Moving VAPP**:

```typescript
// BEFORE: VAPP was under Fleet Management
{
  icon: Truck,
  label: 'Fleet Management',
  active: pathname.includes('/fleet-management'),
  isExpanded: expandedSections.has('fleet-management'),
  subItems: [
    // ... other subItems ...
    {
      icon: FileText,
      label: 'VAPP',
      href: `/events/${eventId}/fleet-management/vapp`, // OLD PATH
      active: pathname === `/events/${eventId}/fleet-management/vapp`
    }
  ]
},

// AFTER: VAPP moved to main navigation
// Add VAPP as main item after Real-Time Status
{
  icon: ClipboardList,
  label: 'VAPP',
  href: `/events/${eventId}/vapp`, // NEW PATH
  active: pathname === `/events/${eventId}/vapp`
},

// Fleet Management no longer has VAPP subItem
{
  icon: Truck,
  label: 'Fleet Management',
  active: pathname.includes('/fleet-management'),
  isExpanded: expandedSections.has('fleet-management'),
  subItems: [
    // ... other subItems ...
    // VAPP removed from here
  ]
},
```

### **Step 7: Move Page Files (if path changed)**

**What to do**:
1. **Create** new directory structure if needed
2. **Move** the page file to the new location
3. **Update** any internal imports if necessary

**Example**:

```bash
# Create new directory
mkdir -p "src/app/events/[eventId]/vapp"

# Move page file
cp "src/app/events/[eventId]/fleet-management/vapp/page.tsx" "src/app/events/[eventId]/vapp/page.tsx"
```

### **Step 8: Test Your Changes**

**What to do**:
1. **Restart** your development server
2. **Navigate** to the new URL
3. **Check** the sidebar shows the link in the right place
4. **Verify** breadcrumbs work correctly
5. **Test** navigation between pages

## 🔧 Common Scenarios

### **Scenario 1: Moving a Link to Main Navigation**

**Example**: Moving "VAPP" from Fleet Management to main navigation

**Steps**:
1. Remove from Fleet Management in `navigation.ts`
2. Add to Main Navigation in `navigation.ts`
3. Update path in `routes.ts` (remove `/fleet-management`)
4. Update breadcrumbs in `routes.ts`
5. Update URL in `sitemap.ts`
6. Update section in `sitemap.ts`
7. Update constant in `index.ts`
8. Remove from Fleet Management in `Sidebar.tsx`
9. Add to main navigation in `Sidebar.tsx`
10. Move page file to new location

### **Scenario 2: Moving a Link Between Sections**

**Example**: Moving "Visa" from Travel to Main Navigation

**Steps**:
1. Remove from Travel in `navigation.ts`
2. Add to Main Navigation in `navigation.ts`
3. Update path in `routes.ts` (remove `/travel`)
4. Update breadcrumbs in `routes.ts`
5. Update URL in `sitemap.ts`
6. Update section in `sitemap.ts`
7. Update constant in `index.ts`
8. Remove from Travel in `Sidebar.tsx`
9. Add to main navigation in `Sidebar.tsx`
10. Move page file to new location

### **Scenario 3: Adding a New Link**

**Example**: Adding "Reports" to Main Navigation

**Steps**:
1. Add to Main Navigation in `navigation.ts`
2. Add route entry in `routes.ts`
3. Add sitemap entry in `sitemap.ts`
4. Add constant in `index.ts`
5. Add to main navigation in `Sidebar.tsx`
6. Create page file in new location

## ⚠️ Important Notes

### **File Order Matters**
Always update files in this order:
1. `navigation.ts` (structure)
2. `routes.ts` (routing)
3. `sitemap.ts` (SEO)
4. `index.ts` (constants)
5. `Sidebar.tsx` (UI)

### **Path Consistency**
Make sure the path is **identical** across all files:
- `navigation.ts` → `href`
- `routes.ts` → `path`
- `sitemap.ts` → `url`
- `Sidebar.tsx` → `href`

### **Breadcrumbs**
Update breadcrumbs to reflect the new navigation structure:
- **Main Navigation**: `['Page Name']`
- **Sub Navigation**: `['Section', 'Page Name']`

### **Testing**
After making changes:
1. **Restart** dev server
2. **Clear** browser cache
3. **Test** all navigation paths
4. **Verify** sidebar updates

## 🆘 Troubleshooting

### **Link Not Showing in Sidebar**
- Check `Sidebar.tsx` has the link in the right place
- Verify the `href` path matches exactly
- Restart the development server

### **Page Not Found (404)**
- Check `routes.ts` has the correct path
- Verify the page file exists in the right location
- Check `navigation.ts` href matches the route

### **Sidebar Not Updating**
- Clear browser cache
- Restart development server
- Check for JavaScript errors in console

### **Breadcrumbs Wrong**
- Update `routes.ts` breadcrumbs array
- Check `sitemap.ts` section/subsection
- Verify navigation structure in `navigation.ts`

## 📝 Quick Reference

| File | Purpose | What to Update |
|------|---------|----------------|
| `navigation.ts` | Navigation structure | `href`, `items` array |
| `routes.ts` | Routing configuration | `path`, `breadcrumbs` |
| `sitemap.ts` | SEO sitemap | `url`, `section`, `subsection` |
| `index.ts` | Global constants | Route path values |
| `Sidebar.tsx` | UI component | `defaultItems` array, `href` |

## 🎯 Best Practices

1. **Always update all 4 config files** together
2. **Keep paths consistent** across all files
3. **Test navigation** after each change
4. **Use descriptive names** for navigation items
5. **Group related items** logically
6. **Document changes** in commit messages
7. **Test on different devices** for responsive design

This guide should help you manage navigation changes independently! 🚀
