/* phoenix-systems.ch

BLUEPRINT WEBPACK PROJECT
(entry point)

VERSION: 1.0
--------------------------------------------------------------------------------------------------------- */

import {render, html} from 'lit-html';


// css
import '../css/variables.css';
import '../css/page.css';




const template = (title, text) =>  html`
    <h1>${title}</h1>
    <p>${text}</p>
`;


const t = 'Webpack Setup Project'
const txt = 'This is a bootstrap for webpack based projects with hot-deployment server and prod/dev output options.'
render(template(t, txt), $('crumbl-os')[0]);