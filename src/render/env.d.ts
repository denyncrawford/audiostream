interface ImportMetaEnv {
  readonly VITE_APP_API_BASE: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}