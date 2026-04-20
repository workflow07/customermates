import { WaveDecoration } from "./wave-decoration";

type Props = {
  title: string;
};

function OpenAILogo() {
  return (
    <div className="flex items-center gap-2 text-foreground">
      <svg aria-hidden="true" className="size-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9 6.0651 6.0651 0 0 0-4.5741-2.0924c-2.6069-.006-4.9167 1.6697-5.7209 4.1595a5.985 5.985 0 0 0-4.0068 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826c-.0051 2.48-2.013 4.4907-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502c-2.1504 1.2387-4.8991.5007-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865C1.8775 12.6789 1.1234 9.9355 2.3408 7.8956zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913c2.1408 1.2354 2.8961 4.0082 1.6824 6.1141a4.4944 4.4944 0 0 1-2.3704 1.9728V12.387a.7948.7948 0 0 0-.3927-.6813zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866c2.1408-1.2354 4.8897-.4998 6.1335 1.6469a4.4932 4.4932 0 0 1 .5346 3.0137zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742c.0033-2.4832 2.0156-4.4941 4.4994-4.4941a4.4708 4.4708 0 0 1 2.875 1.0408l-.1419.0804L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
      </svg>

      <span className="text-xl font-semibold tracking-tight">OpenAI</span>
    </div>
  );
}

function AnthropicLogo() {
  return (
    <div className="flex items-center gap-2 text-foreground">
      <span className="text-xl font-bold uppercase tracking-[0.02em]" style={{ fontFeatureSettings: '"ss01", "cv11"' }}>
        ANTHROP
        <span className="inline-block -translate-y-0.5 px-0.5">\</span>C
      </span>
    </div>
  );
}

function GeminiLogo() {
  return (
    <div className="flex items-center gap-2 text-foreground">
      <svg aria-hidden="true" className="size-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 0c1.012 3.96 3.04 7.344 6.084 10.152C21.127 12.96 24 14.89 24 14.89v.22c0 0-2.873 1.93-5.916 4.738C15.04 22.656 13.012 20.04 12 24c-1.012-3.96-3.04-7.344-6.084-10.152C2.873 11.04 0 9.11 0 9.11v-.22C0 8.89 2.873 6.96 5.916 4.152 8.96 1.344 10.988 0 12 0z" />
      </svg>

      <span className="text-xl font-medium tracking-tight">Gemini</span>
    </div>
  );
}

export function AIModelsSection({ title }: Props) {
  return (
    <section className="relative isolate w-full py-16 md:py-24">
      <WaveDecoration
        className="-top-16 -right-40 w-[min(900px,75%)] md:-top-24 md:-right-48"
        opacity={0.4}
        variant="wave-1"
      />

      <WaveDecoration
        className="hidden md:block -bottom-20 -left-40 w-[min(800px,60%)]"
        opacity={0.3}
        variant="wave-2"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 z-[5] h-[260px] -translate-y-1/2 bg-[radial-gradient(ellipse_55%_85%_at_50%_50%,var(--background)_0%,color-mix(in_oklab,var(--background)_80%,transparent)_40%,transparent_95%)]"
      />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-4 text-center">
        <p className="text-x-md text-subdued">{title}</p>

        <div className="mt-8 flex flex-col items-center justify-center gap-8 md:mt-10 md:flex-row md:gap-14">
          <OpenAILogo />

          <AnthropicLogo />

          <GeminiLogo />
        </div>
      </div>
    </section>
  );
}
