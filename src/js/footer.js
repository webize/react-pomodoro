import React from 'react';

const Footer = React.createClass({
  render() {
    return (
      <footer className="credits">
        Shorcuts: Ctrl+L = login | Ctrl+S = save | Ctrl+O = load <br/>
        Made with <span className="heart"></span> by <a href="https://github.com/afonsopacifer" className="link" target="_blank">@afonsopacifer</a> and by <a href="https://github.com/melvincarvalho" className="link" target="_blank">@melvincarvalho</a>
      </footer>
    )
  }
});

export default Footer;
