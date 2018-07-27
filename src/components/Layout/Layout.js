import React from 'react';

import MyAux from '../../hoc/MyAux';
import classes from './Layout.css';
import Toolbar from '../Navigation/Toolbar/Toolbar';
import SideDrawer from '../Navigation/SideDrawer/SideDrawer';

const layout = (props) => (
    <MyAux>
        <Toolbar />   
        <SideDrawer />   
        <main className={classes.Content}>
            {props.children}
        </main>
    </MyAux>
);

export default layout;
