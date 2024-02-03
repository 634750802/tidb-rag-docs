'use client';

import React, { type ReactNode } from 'react';

export { default as ScrollSpy } from 'react-ui-scrollspy';

export function HeaderAnchors ({ children }: { children: ReactNode }) {
  return (
    <div className="pl-2 text-xs">
      {children}
    </div>
  );
}

export function HeaderAnchor ({ href, children }: { href: string, children: ReactNode }) {
  const id = decodeURIComponent(href.slice(1));
  return (
    <div
      className="block py-1.5 opacity-50 hover:opacity-100 cursor-pointer"
      onClick={() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      {children}
    </div>
  );
}
