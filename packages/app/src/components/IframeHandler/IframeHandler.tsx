import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

export const IframeHandler = () => {
    return (<h1 >Iframe Handler</h1>);
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url'); // this is the "real" target URL
  console.log('IframeHandler URL:', url);
  const [content, setContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) return;

    fetch(`/api/iframe-handler/iframe?url=${encodeURIComponent(url)}`, { credentials: 'include' })
      .then(async res => {
        if (!res.ok) throw new Error(`Status ${res.status}`);
        return res.text();
      })
      .then(setContent)
      .catch(err => setError(err.message));
  }, [url]);

  if (!url) return <div>No URL provided</div>;
  if (error) return <div>Error: {error}</div>;

  return <div dangerouslySetInnerHTML={{ __html: content }} />;
};
