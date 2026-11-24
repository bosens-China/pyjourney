declare module "*.mdx" {
  import type { ComponentType } from "react";

  const Document: ComponentType<{
    components?: ReturnType<
      typeof import("@rspress/core/theme").getCustomMDXComponent
    >;
  }>;
  export default Document;
}
