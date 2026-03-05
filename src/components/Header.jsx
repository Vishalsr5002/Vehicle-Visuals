const Header = () => {
  return (
    <div className="header">

      <div className="header-left">
        Vehicle Visual API
      </div>
        <div className="url-box">
          <span>URL</span>
          <input
            type="text"
            placeholder="https://api.vehiclevisuals.com"/>
        </div>
        <button className="btn">
          Get API
        </button>
      </div>
  );
};

export default Header;