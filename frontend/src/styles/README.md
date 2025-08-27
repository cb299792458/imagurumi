# CSS Modules & Design System

This project uses CSS Modules for component-scoped styling along with a shared design system.

## Structure

- `global.css` - Global styles, CSS variables, and utility classes
- `components.module.css` - Shared component styles (buttons, forms, cards, etc.)
- Component-specific CSS modules (e.g., `NavBar.module.css`)

## Usage

### 1. Import CSS Module
```tsx
import styles from './MyComponent.module.css';
```

### 2. Apply Classes
```tsx
<div className={styles.container}>
  <button className={styles.button}>Click me</button>
</div>
```

### 3. Multiple Classes
```tsx
// Using template literals
<div className={`${styles.card} ${styles.highlighted}`}>

// Using array join
<div className={[styles.card, styles.highlighted].join(' ')}>
```

### 4. Composing Styles
```tsx
// In your CSS module
.myButton {
  composes: button buttonPrimary from '../styles/components.module.css';
  /* Additional styles */
}
```

## Design System

### Colors
- **Primary**: Blue scale (`--primary-50` to `--primary-900`)
- **Neutral**: Gray scale (`--neutral-50` to `--neutral-900`)
- **Semantic**: Success, Warning, Error, Info

### Spacing
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **sm**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

### Typography
- **Font Family**: Inter (with system fallbacks)
- **Sizes**: xs, sm, base, lg, xl, 2xl, 3xl
- **Weights**: 400, 500, 600, 700

### Shadows
- **sm**: Subtle shadows
- **md**: Medium shadows
- **lg**: Large shadows
- **xl**: Extra large shadows

## Available Components

### Buttons
- `.button` - Base button styles
- `.buttonPrimary` - Primary button
- `.buttonSecondary` - Secondary button
- `.buttonGhost` - Ghost button
- `.buttonSmall`, `.buttonLarge` - Size variants

### Forms
- `.formGroup` - Form field container
- `.formLabel` - Form labels
- `.formInput` - Text inputs
- `.formTextarea` - Textarea inputs
- `.formSelect` - Select dropdowns

### Cards
- `.card` - Base card
- `.cardHeader` - Card header
- `.cardBody` - Card content
- `.cardFooter` - Card footer

### Layout Utilities
- `.flex`, `.flexCol` - Flexbox utilities
- `.itemsCenter`, `.justifyCenter` - Alignment utilities
- `.gapSm`, `.gapMd`, `.gapLg` - Gap utilities

## Best Practices

1. **Use CSS Variables**: Always use design system variables for consistency
2. **Component Scoping**: Keep styles scoped to components
3. **Composition**: Use `composes` to inherit shared styles
4. **Naming**: Use descriptive class names (e.g., `.buttonPrimary` not `.btn`)
5. **Responsive**: Include mobile-first responsive design

## Example Component

```tsx
import styles from './MyComponent.module.css';
import sharedStyles from '../styles/components.module.css';

export function MyComponent() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>My Title</h2>
      <button className={sharedStyles.buttonPrimary}>
        Primary Action
      </button>
    </div>
  );
}
```

```css
/* MyComponent.module.css */
.container {
  padding: var(--space-lg);
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.title {
  font-size: var(--font-size-2xl);
  color: var(--neutral-900);
  margin-bottom: var(--space-md);
}
```




