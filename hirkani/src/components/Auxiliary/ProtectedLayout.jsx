import { Navigate, Outlet } from "react-router-dom";
// import { useContext } from "react";
// import { AuthContext } from "./AuthContext";

const ProtectedLayout = () => {
    const token = localStorage.getItem("access_token");
    // const { token } = useContext(AuthContext);

    return token ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedLayout;
