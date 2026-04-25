import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";

import { getMcpSetupPrompt } from "@/features/docs/mcp-setup-prompt";

type Props = {
  locale?: "en" | "de";
};

export function McpSetupPrompt({ locale = "en" }: Props) {
  return <DynamicCodeBlock code={getMcpSetupPrompt(locale)} lang="markdown" />;
}
