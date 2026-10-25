import katex from 'katex';
import { useMemo } from 'react';

interface Props {
  tex: string;
  block?: boolean;
  className?: string;
}

/** KaTeX арқылы формуланы көрсету */
export default function Tex({ tex, block = false, className }: Props) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: block,
        throwOnError: false,
        strict: 'ignore',
        output: 'htmlAndMathml',
      }),
    [tex, block],
  );
  const Tag = block ? 'div' : 'span';
  return <Tag className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
