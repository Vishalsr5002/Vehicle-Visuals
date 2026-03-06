const Header = ({ baseUrl, setBaseUrl }) => {

  return (
    <div className="header">
      <div className="header-left">
        Vehicle Visual API
        <div className="url-box">
          URL
          <input
            value={baseUrl}
            onChange={(e) => setBaseUrl(e.target.value)}
            placeholder="Enter API URL"
          />
        </div>
      </div>
      <div className="header-right">
        <button className="btn">GET API</button>
      </div>
    </div>
  );
};

export default Header;
