import Tab from '@material-ui/core/Tab';
import {  withStyles } from '@material-ui/core/styles';
import React from 'react';
const StyledTab = withStyles((theme) => ({
    root: {
      textTransform: 'none',
      color: '#fff',
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing(1),
      '&:focus': {
        opacity: 1,
        outline:'none!important',
      },
    },
  }))((props) => <Tab disableRipple {...props} />);
  export default StyledTab;