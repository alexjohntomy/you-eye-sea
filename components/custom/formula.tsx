// From Kiran (next-katex)

'use client';

import renderMathInElement from 'katex/dist/contrib/auto-render';
import 'katex/dist/katex.min.css';
import { useEffect, useRef } from 'react';

interface katexTypes {
  text: string
  delegated?: any
}

export default function KatexSpan({ text, ...delegated } : katexTypes) {
  const katexTextRef = useRef(null);
  useEffect(() => {
    if (katexTextRef.current) {
      renderMathInElement(katexTextRef.current, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
        ],
      });
    }
  }, [text]);

  return (
    <div ref={katexTextRef} {...delegated}>
      {text}
    </div>
  );
}