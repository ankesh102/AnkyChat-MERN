import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginUser } from "../../apicalls/users";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { HideLoader, ShowLoader } from "../../redux/loaderSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const login = async () => {
    try {
      dispatch(ShowLoader());
      const response = await LoginUser(user);
      dispatch(HideLoader());
      if (response.success) {
        toast.success(response.message);
        window.localStorage.setItem("token", response.data);
        console.log(response.data);
        window.location.href = "/";
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoader());
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      // window.location.href = "/";
      navigate("/");
    }
  }, []);

  return (
    <div className="h-screen login-col flex justify-center items-center">
      <div className="login-col-body shadow-md p-5 flex flex-col gap-5 w-96 rounded-xl">
        <div className="flex gap-2">
        <i className="ri-message-3-line text-2xl text-primary"></i>
        <h1 className="text-2xl uppercase font-semibold text-primary">
          AnkyTalk Login{" "}
        </h1>
        
        </div>

        <hr />
        <input
        className="inp-col"
          type="email"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Enter your email"
        />
        <input
        className="inp-col"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Enter your password"
        />
        <button className={
          user.email && user.password ? "contained-btn" : "disabled-btn"

        } onClick={login}>
          {" "}
          Login{" "}
        </button>

        <Link to="/register" className="underline">
          Not an existing user? Register
        </Link>
      </div>
    </div>
  );
}

export default Login;
