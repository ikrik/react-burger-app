import React from 'react';

import MyAux from '../../hoc/MyAux';
import classes from './Layout.css';

const layout = (props) => (
    <MyAux>
        <div>Toolbar, Sidebar, Backdrop</div>
        <main className={classes.Content}>
            {props.children}
        </main>
    </MyAux>
);

export default layout;
