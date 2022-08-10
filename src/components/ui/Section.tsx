const Section = ({ children, withContainer = false, ...props }) => (
  <section
    className={`${withContainer && 'container max-w-7xl mx-auto'} mb-4`}
    {...props}
  >
    {children}
  </section>
);

export default Section;
