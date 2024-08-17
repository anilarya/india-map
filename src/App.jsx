import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

import Map from './components/Map';

function App() { 
    return (
        <div style={appStyle}>
            {/* <Header /> */}
            <main style={mainStyle}>
                <h2>Temeratures of Capital cities of Indian States</h2> 
                <Map />
            </main>
            <Footer />
        </div>
    );
}

const appStyle = {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '10vh'
};

const mainStyle = {
    flex: '1',
    padding: '20px',
    textAlign: 'center'
};

export default App;
