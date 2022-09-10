const SectionTitle = ({ title, subtitle, fancyText = null }, props) => (
  <div className="section-title mt-4 px-4 xl:px-0" {...props}>
    <h2 className="lg:text-4xl md:text-2xl text-xl font-bold">{title}</h2>
    <div className="mini-header-separator">
      <span className="mr-2 text-orange-400">{subtitle}</span>
      {fancyText && (
        <>
          {' '}
          <span className="before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-orange-400 relative inline-block">
            <span className="relative text-white m-1">{fancyText}</span>
          </span>
        </>
      )}
    </div>
  </div>
);

export default SectionTitle;
