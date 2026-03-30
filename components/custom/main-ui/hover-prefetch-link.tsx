'use client';

import Link, { LinkProps } from 'next/link';
import React, { useState, ComponentPropsWithoutRef } from 'react';

type HoverPrefetchLinkProps = LinkProps & ComponentPropsWithoutRef<'a'>;

//Custom link component so that prefetching only happens on hover, not on viewport load
export function HoverPrefetchLink({
  href,
  children,
  prefetch: _prefetch,
  onMouseEnter,
  ...props
}: HoverPrefetchLinkProps) {
  const [active, setActive] = useState(false);

  return (
    <Link
      {...props}
      href={href}
      prefetch={active ? null : false}
      onMouseEnter={(e) => {
        setActive(true);
        if (onMouseEnter) {
          onMouseEnter(e);
        }
      }}
    >
      {children}
    </Link>
  );
}
