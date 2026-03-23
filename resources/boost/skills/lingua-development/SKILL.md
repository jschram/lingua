---
name: lingua-development
description: Work with Lingua — the Laravel-to-frontend translation bridge for React, Vue, and Svelte via Inertia.js.
---

# Lingua Development

## When to use this skill
Use this skill when working with translations in a Laravel + Inertia.js application that uses the `cyberwolfstudio/lingua` package, or when setting up, configuring, or using `@cyberwolf.studio/lingua-react`, `@cyberwolf.studio/lingua-vue`, or `@cyberwolf.studio/lingua-svelte`.

## Overview

Lingua compiles Laravel translation files (PHP and JSON) into a JavaScript file, then provides framework-specific bindings so you can use `trans()` and `transChoice()` on the frontend just like in Laravel.

## Generating translations

Run this command to compile all `lang/` files into a JS file:

```bash
php artisan lingua:generate
# Outputs to ./resources/js/lingua.js by default
# Custom path:
php artisan lingua:generate path/to/lingua.js
```

The output file exports a `Lingua` object:

```js
const Lingua = { translations: { en: { php: {...}, json: {...} }, fr: {...} } }
export { Lingua }
```

Import this file in your frontend entrypoint and pass it to the framework binding.

## Sharing locale via Inertia

Add `locale` to the Inertia shared data so the frontend knows the active locale:

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'locale' => fn() => app()->getLocale(),
    ]);
}
```

## Automating generation with Vite

Install `vite-plugin-run` and add to `vite.config.js` so translations regenerate on file change:

```js
import { run } from 'vite-plugin-run';

export default {
  plugins: [
    run({
      name: 'generate translations',
      run: ['php', 'artisan', 'lingua:generate'],
      pattern: ['resources/lang/**', 'lang/**'],
    }),
  ],
};
```

## React setup

```jsx
// entrypoint (app.jsx)
import { LinguaProvider } from '@cyberwolf.studio/lingua-react';
import { Lingua } from './lingua';

root.render(
  <LinguaProvider locale={page.props.locale} Lingua={Lingua}>
    <App />
  </LinguaProvider>
);
```

```jsx
// In any component
import { useLingua } from '@cyberwolf.studio/lingua-react';

function MyComponent() {
  const { trans, transChoice, __, locale } = useLingua();

  return (
    <div>
      <p>{trans('messages.welcome')}</p>
      <p>{trans('messages.hello', { name: 'Alice' })}</p>
      <p>{transChoice('messages.apples', 3)}</p>
    </div>
  );
}
```

- `trans(key, replacements?)` — simple translation
- `transChoice(key, count, replacements?)` — pluralized translation
- `__` — alias for `trans`
- `useLingua()` must be called inside `<LinguaProvider>`; it throws otherwise

## Vue setup

```js
// main.js
import { createApp } from 'vue';
import { LinguaVue } from '@cyberwolf.studio/lingua-vue';
import { Lingua } from './lingua';

createApp(App).use(LinguaVue, { Lingua }).mount('#app');
```

The plugin reads `locale` from Inertia's shared page props automatically.

```vue
<!-- Options API -->
<template>
  <p>{{ trans('messages.welcome') }}</p>
  <p>{{ __('messages.hello', { name: 'Alice' }) }}</p>
  <p>{{ transChoice('messages.apples', 3) }}</p>
</template>

<!-- Composition API -->
<script setup>
import { inject } from 'vue';
const trans = inject('trans');
const transChoice = inject('transChoice');
const locale = inject('locale');
</script>
```

## Svelte setup

```js
// main.js
import { setLingua } from '@cyberwolf.studio/lingua-svelte';
import { Lingua } from './lingua';

setLingua(page.props.locale, Lingua);
```

```svelte
<script>
  import { trans, transChoice, __, currentLocale } from '@cyberwolf.studio/lingua-svelte';
</script>

<p>{trans('messages.welcome')}</p>
<p>{trans('messages.hello', { name: 'Alice' })}</p>
<p>{transChoice('messages.apples', 3)}</p>
<p>Locale: {$currentLocale}</p>
```

When locale changes, call `setLingua(newLocale, Lingua)` again to update the stores.

## Translation key format

Keys follow Laravel conventions:

- **PHP file keys**: `filename.key` or `filename.nested.key` (maps to `lang/{locale}/filename.php`)
- **JSON keys**: exact string (maps to `lang/{locale}.json`)
- **Dot notation**: `sidebar.dashboard` resolves `{ sidebar: { dashboard: '...' } }`
- **Literal dot keys**: exact key match is tried first, so `"Please confirm."` works as-is
- **Replacements**: `:placeholder` syntax — `trans('hello', { name: 'Alice' })` → `'Hello Alice'`
- **Pluralization**: `'apple|apples'` or `'{1}one item|[2,*]:count items'`

## Available artisan commands

- `php artisan lingua:generate [path]` — compile translations to JS
- `php artisan lingua:install` — interactive setup (selects framework, installs npm package)
