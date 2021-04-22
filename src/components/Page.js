import React from 'react';
import PropTypes from 'utils/propTypes';

import bn from 'utils/bemnames';


import Typography from './Typography';

const bem = bn.create('page');

const Page = ({
  title,
  breadcrumbs,
  tag: Tag,
  className,
  children,
  ...restProps
}) => {
  const classes = bem.b('px-3', className);

  return (
    <Tag className={classes} {...restProps}>
      <div className={bem.e('header')}>
        {title && typeof title === 'string' ? (
          <Typography type="h4" className={bem.e('title')}>
            {title}
          </Typography>
        ) : (
            title
          )}
        {breadcrumbs && (
              breadcrumbs
        )}
      </div>
      {children}
    </Tag>
  );
};

Page.propTypes = {
  tag: PropTypes.component,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  className: PropTypes.string,
  children: PropTypes.node,
  breadcrumbs: PropTypes.object
  
};

Page.defaultProps = {
  tag: 'div',
  title: '',
};

export default Page;
