/* phoenix-systems.ch

BLUEPRINT WEBPACK PROJECT
(entry point)

VERSION: 1.0
--------------------------------------------------------------------------------------------------------- */

import 'jquery';
import {render, html} from 'lit-html';


// css
import '../css/variables.css';
import '../css/page.css';



const template = html`
    <h1>TEST</h1>
`;


render(template, $('crumbl-os')[0]);