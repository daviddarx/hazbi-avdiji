export default function Footer() {
  const date = new Date();

  return (
    <footer className='layout-grid mt-auto'>
      <div className='col-start-1 col-end-13'>©{date.getFullYear()} Hazbi Avdiji</div>
    </footer>
  );
}
