import React, { useEffect, useRef } from 'react';

const NATIVE_BANNER_SCRIPT_SRC = 'https://bauval.org/21/3db12b05f256fb52dd17a633065c0800';
const NATIVE_BANNER_CONTAINER_ID = 'container-3db12b05f256fb52dd17a633065c0800';

export const NativeBannerAd: React.FC = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const existingScript = document.querySelector(`script[src="${NATIVE_BANNER_SCRIPT_SRC}"]`);
    if (existingScript) return;

    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src = NATIVE_BANNER_SCRIPT_SRC;
    wrapper.appendChild(script);
  }, []);

  return (
    <div ref={wrapperRef} className="mt-6 w-full flex justify-center">
      <div id={NATIVE_BANNER_CONTAINER_ID} className="w-full" />
    </div>
  );
};
