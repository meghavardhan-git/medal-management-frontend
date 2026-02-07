import { Navigate } from "react-router-dom";
function DefaultRoute() {
    const token = localStorage.getItem("token");
    //if logged in ->go to home
    if (token) {
        return <Navigate to="/home" />;
    }
    return <Navigate to="/login" />

}
export default DefaultRoute;