import React from 'react';

const Section = ({
  children,
  withContainer = false,
  ...props
}: {
  children: React.ReactNode;
  withContainer?: boolean;
  [key: string]: any;
}) => (
  <section
    className={`${withContainer && 'container max-w-7xl mx-auto'} mb-4`}
    {...props}>
    {children}
  </section>
);

export default Section;
