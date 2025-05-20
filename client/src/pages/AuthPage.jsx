import SignUp from './SignUp';
import Login from './Login';
import { useSearchParams } from "react-router-dom";

const AuthPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const mode = searchParams.get("mode") || "sign_up";

    function switchForms(event, newMode) {
        if (newMode !== null) {
            setSearchParams({ mode: newMode });
        }
    }

    return (
        <div>
            {mode === "sign_up" ? <SignUp mode={mode} switchForms={switchForms} /> : <Login mode={mode} switchForms={switchForms} />}
        </div>
    );
};

export default AuthPage;