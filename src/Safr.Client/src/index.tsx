import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './bin/App';


function Root () {
    return (
        <div >
            <App />
        </div>
    );
}

ReactDOM.render( <Root />, document.getElementById('safer-app'));

