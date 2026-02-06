import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";

const API_BASE = "http://localhost:5051/api";

function ResetPassword() {
    const [params] = useSearchParams();
    const token = params.get("token");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const submit = async () => {
        const res = await fetch(`${API_BASE}/auth/reset-password`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                token,
                newPassword: password,
            }),
        });

        if (res.ok) {
            alert("Password reset successful");
            navigate("/login");
        } else {
            alert("Invalid or expired link");
        }
    };

    return (
        <>
            <input type="password"
                placeholder="New Password"
                onChange={e => setPassword(e.target.value)} />
            <button onClick={submit}>Reset Password</button>
        </>
    );
}

export default ResetPassword;
