import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { App } from './bin/App';
import {library} from "@fortawesome/fontawesome-svg-core";
import { fal } from '@fortawesome/pro-light-svg-icons';
import { fas } from '@fortawesome/pro-solid-svg-icons';
import { far } from '@fortawesome/pro-regular-svg-icons';
import { fad } from '@fortawesome/pro-duotone-svg-icons';

library.add(fas, far, fad, fal)

function Root () {
    return (
        <div >
            <App />
        </div>
    );
}

ReactDOM.render( <Root />, document.getElementById('safer-app'));

