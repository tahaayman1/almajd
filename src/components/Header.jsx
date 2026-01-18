function Header() {
  return (
    <header className="topbar">
      <div className="container nav" dir="ltr">
        <div className="brand">
          <img src="/logo.png" alt="M" className="brand-logo" />
          <span className="brand-text">Al‑Majd Europe</span>
        </div>
        <button className="menu-btn" aria-label="القائمة" id="menuBtn">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </header>
  );
}

export default Header;
