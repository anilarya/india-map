import React from 'react';

function Header() {
    return (
        <header style={headerStyle}>
            <h1>My React App</h1>
        </header>
    );
}

const headerStyle = {
    backgroundColor: '#282c34',
    height: '100px', // Set the height to 100px
    padding: '20px',
    color: 'white',
    textAlign: 'center',
    // width: '100%', // Ensures full width
    // boxSizing: 'border-box' // Includes padding in the element's width/height
};

export default Header;
