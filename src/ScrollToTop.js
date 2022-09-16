import React from "react"
import { useEffect } from 'react';
import { useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';

function withRouter(Component) {
  function ComponentWithRouterProp(props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}

const ScrollToTop = (props) => {


    let location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [location]);

    return props.children;
}

export default withRouter(ScrollToTop);


