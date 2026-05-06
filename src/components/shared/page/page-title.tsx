const PageTitle = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <h1 className="mb-4 border-b-2 text-xl md:text-2xl">{children}</h1>
    </>
  );
};

export default PageTitle;
