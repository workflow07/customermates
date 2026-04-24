import type { PropsWithChildren } from "react";

import { Body, Container, Head, Heading, Hr, Html, Preview, Tailwind, Text } from "@react-email/components";

import { EmailImage } from "./email-image";

import { IS_CLOUD_HOSTED } from "@/constants/env";
import { colorPalettes } from "@/styles/color-palettes";

const config = {
  theme: {
    extend: {
      colors: {
        ...colorPalettes.light,
      },
    },
  },
};

type Props = PropsWithChildren<{
  preview?: string;
  title?: string;
}>;

export function EmailLayout({ preview, title, children }: Props) {
  return (
    <Html>
      <Tailwind config={config}>
        <Head>
          <style>{`body { font-family: -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif; }`}</style>
        </Head>

        {preview ? <Preview>{preview}</Preview> : null}

        <Body className="m-0 py-2.5 font-sans bg-content1">
          <Container className="mx-auto p-[45px]">
            <EmailImage
              alt="Customermates"
              className="mb-8"
              height={40}
              src="https://www.customermates.com/images/light/customermates.svg"
              width={150}
            />

            {title ? <Heading className="text-2xl font-semibold tracking-tight mb-2">{title}</Heading> : null}

            {children}

            {IS_CLOUD_HOSTED ? (
              <>
                <Hr className="my-7" />

                <Text className="text-xs leading-5 text-default-700">
                  <span>Customermates</span>

                  <br />

                  <span>Benjamin Wagner</span>

                  <br />

                  <span>An den Kasernen 25</span>

                  <br />

                  <span>68167 Mannheim</span>

                  <br />

                  <span>mail@customermates.com</span>

                  <br />

                  <span>USt-IdNr: DE335193602</span>
                </Text>
              </>
            ) : null}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
