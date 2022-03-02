import React, { FC } from "react";

export default function App({
  Page,
  pageProps,
}: {
  Page: FC;
  pageProps: Record<string, unknown>;
}) {
  return (
    <main className="argyle">
      <head>
        <meta name="viewport" content="width=device-width" />
      </head>
      <Page {...pageProps} />
    </main>
  );
}
