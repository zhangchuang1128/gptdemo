
import {useNavigate} from 'react-router-dom';
import {useEffect} from "react";

function Redirect({to}) {
    let navigate = useNavigate();
    useEffect(() => {
        navigate(to);
    });
    return null;
}

export default Redirect
