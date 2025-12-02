"use client";

import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { useServerInsertedHTML } from 'next/navigation';
import { useState, useRef } from 'react';

export default function EmotionCacheProvider({ children }: { children: React.ReactNode }) {
  const [cache] = useState(() => {
    const cache = createCache({ 
      key: 'css',
      prepend: true,
    });
    cache.compat = true;
    return cache;
  });

  const insertedRef = useRef<string[]>([]);

  useServerInsertedHTML(() => {
    const names = Object.keys(cache.inserted);
    if (names.length === 0) {
      return null;
    }
    
    // Filtrar solo los estilos que aún no se han insertado
    const newNames = names.filter(name => !insertedRef.current.includes(name));
    if (newNames.length === 0) {
      return null;
    }
    
    let styles = '';
    for (const name of newNames) {
      const style = cache.inserted[name];
      if (typeof style !== 'boolean' && style !== undefined && style !== null) {
        styles += style;
      }
    }
    
    // Marcar como insertados
    insertedRef.current = [...insertedRef.current, ...newNames];
    
    if (!styles) {
      return null;
    }
    
    return (
      <style
        data-emotion={`${cache.key} ${newNames.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

