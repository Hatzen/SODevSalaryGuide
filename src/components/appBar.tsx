import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu'
import { Typography } from '@material-ui/core';

export interface MenuAppBarProps {
  menuClicked: () => void
} 

// https://v1.mui.com/demos/app-bar/
export default class MenuAppBar extends React.Component<MenuAppBarProps> {

  render() {
    // TODO: Info Button explain all relevant aspects to consider the salary. 
    //   CompanyBranch (Banks, Resellers), How old the company is (Backup money), etc.
    return (
      <div>
        <AppBar position="static">
          <Toolbar>
            <IconButton onClick={this.props.menuClicked} color="inherit" aria-label="Menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h5">
              Stackoverflow Developer Salary Guide 
            </Typography>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}
