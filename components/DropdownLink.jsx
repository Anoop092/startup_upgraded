import Link from "next/link";
import React from "react";
/* eslint-disable react/display-name */
const DropdownLink = React.forwardRef(({ href, children, ...rest }, ref) => {
  return (
    <Link href={href} passHref>
      <a {...rest}>{children}</a>
    </Link>
  );
});

export default DropdownLink;
