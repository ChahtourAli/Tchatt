import { Route as R, Redirect as RD } from "react-router-dom";
const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <R
      {...rest}
      render={(props) =>
        localStorage.getItem("token") ? <Component {...props} /> : <RD to="/" />
      }
    />
  );
};
export default PrivateRoute;