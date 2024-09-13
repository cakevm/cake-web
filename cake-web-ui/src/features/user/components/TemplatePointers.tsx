import React from 'react';

const TemplatePointers: React.FC = () => {
  return (
    <>
      <h1 className="mt-8 text-2xl font-bold">Admin Dashboard Starter Kit</h1>
      <p className="mt-4 py-2">
        ✓ <span className="font-semibold">Light/dark</span> mode toggle
      </p>
      <p className="py-2">
        ✓ <span className="font-semibold">Redux toolkit</span> and other utility
        libraries configured
      </p>
      <p className="py-2">
        ✓ <span className="font-semibold">Calendar, Modal, Sidebar </span>{" "}
        components
      </p>
      <p className="py-2">
        ✓ User-friendly <span className="font-semibold">documentation</span>
      </p>
      <p className="mb-4 py-2">
        ✓ <span className="font-semibold">Daisy UI</span> components,{" "}
        <span className="font-semibold">Tailwind CSS</span> support
      </p>
    </>
  );
}

export default TemplatePointers;
