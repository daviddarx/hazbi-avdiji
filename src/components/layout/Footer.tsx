export default function Footer() {
  const date = new Date();

  return (
    <footer className='layout-grid'>
      <div className='col-start-6 col-end-13'>©{date.getFullYear()} Hazbi Avdiji</div>
    </footer>
  );
}
