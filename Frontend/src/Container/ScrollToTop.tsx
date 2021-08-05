/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';

interface Props{
    history: any;
    children?: unknown
}
const ScrollToTop = (props: Props) => {
  const { history, children } = props;
  useEffect(() => {
    const unlisten = history.listen(() => {
      window.scrollTo(0, 0);
    });
    return () => {
      unlisten();
    };
  }, []);

  return <>{children}</>;
};

export default withRouter(ScrollToTop);
