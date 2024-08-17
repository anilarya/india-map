import React from 'react';

function Footer() {
    return (
        <footer style={footerStyle}>
            <p>&copy; 2024 My React App. All rights reserved.</p>
        </footer>
    );
}

const footerStyle = {
    backgroundColor: '#282c34',
    padding: '10px',
    color: 'white',
    textAlign: 'center',
    position: 'fixed',
    left: '0',
    bottom: '0',
    width: '100%'
};

export default Footer;
