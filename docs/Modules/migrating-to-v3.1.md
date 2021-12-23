# Migrating modules to Nexus Wallet v3.1

Nexus Wallet v3.1 comes with a lot of breaking changes to the module API. This article will walk you through those changes so that you can make your modules compatible with Nexus Wallet v3.1.

## Some libraries are no longer provided

These libraries will no longer be found at `NEXUS.libraries`:

- `Redux` (from redux)
- `ReactRedux` (from react-redux)
- `ReactRouterDOM` (from react-router-dom)
- `ReduxForm` (from redux-form)

If you still want to use these libraries in your module, you can add them as direct dependencies of your module project.

Removing these from `NEXUS.libraries` reduces the size of the preload script which is loaded every time you open a module, making the loading process a bit faster.

Only 3 libraries `react`, `react-dom` and `emotion` remain to be passed through `NEXUS.libraries`. They are common dependencies of the components at `NEXUS.components`, so they are always loaded anyway, passing them through won't make any difference in loading time.

## ThemeController was added, `color.getMixer` was removed

Before v3.1, in order to make the wallet theme work on your module, you had to use `color.getMixer()` to produce the complete `theme` object and pass it to `ThemeProvider`. For example:

```
const themeWithMixer = {
  ...theme,
  mixer: color.getMixer(theme.background, theme.foreground),
};

return (
  <ThemeProvider theme={themeWithMixer}>
    {/* your app */}
  </ThemeProvider>
)
```

Since v3.1, you can just simply pass the original theme object to the new `ThemeController` component from `NEXUS.components`.

```
return (
  <ThemeController theme={theme}>
    {/* your app */}
  </ThemeController>
)
```

## RF adapter components were removed

Before v3.1, many components in `NEXUS.components` have a 'sub-component' called RF (e.g. `TextField` has `TextField.RF`) which is the adapter for `redux-form`'s interface.

Since v3.1, `redux-form` is no longer be passed through `NEXUS.libraries`, and the choice of form library is completely up to you to decide. Therefore, these RF components are removed. If you still want to use them, you should implement them in your modules. It would be just a few lines of code for each component, for example:

```
const TextFieldReduxForm = ({ input, meta, ...rest }) => (
  <TextField error={meta.touched && meta.error} {...input} {...rest} />
);
```

## DateTimePicker component is removed

## `options` param for `send()` now has a slightly different shape

## Default right click menu now works on modules

## Clicking on a link (an `a` tag with `href` attribute) in a module now opens it up on browser