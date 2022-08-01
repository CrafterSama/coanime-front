const SectionTitle = ({ title, subtitle }) => (
  <div className="section-title mt-4">
    <h2 className="lg:text-4xl md:text-2xl sm:text-lg font-bold">{title}</h2>
    <div className="mini-header-separator">
      <span>{subtitle}</span>
    </div>
  </div>
);

export default SectionTitle;
