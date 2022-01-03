import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu'

export interface MenuAppBarProps {
  menuClicked: () => void
} 

// https://v1.mui.com/demos/app-bar/
export default class MenuAppBar extends React.Component<MenuAppBarProps> {

  render() {
    // TODO: Onclick toggle control pane
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={this.props.menuClicked} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
