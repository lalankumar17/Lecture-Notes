const BrandLogo = ({ className = "" }) => {
  return (
    <span
      className={`cursor-pointer text-3xl font-medium leading-none tracking-tight text-black ${className}`.trim()}
    >
      <span>Lecture</span>
      <span className="text-blue-500">Notes</span>
    </span>
  );
};

export default BrandLogo;
