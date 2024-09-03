import { useContext, useState } from "react";
import { Alert } from "react-native";
import { api } from "../api/api";
import { AuthContext } from "../context/auth.context";
import { getToken, removeToken } from "../helper/storage";


export const useGetCompanyInfo = () => {
    const [userToken, setToken] = useState(null);
    const [closed, setClosed] = useState(false);
    const [loading, setLoading] = useState(false);
    const [inActive, setInActive] = useState();
    const [companyInfo, setCompanyInfo] = useState()


    const getCompanyInfo = async () => {
        setLoading(true);
        const jsontoken = await getToken();
        const token = JSON.parse(jsontoken);
        setToken(token);
        if (token) {
            const response = await api.get('/api/manager/details', {}, {
                headers: {
                    authorization: `Bearer ${token}`,
                }
            })

            if (response?.data?.message === 'invalid token in the request.') {
                Alert.alert('OBS', "Du har blivit utloggad, vänligen logga in igen", [{
                    text: "Logga in igen",
                    onPress: () => setUser(null)
                }])
                await removeToken();
                setToken(null)
            }
            if (
                response?.data?.manager?.IsActive === false ||
                response?.data?.message ===
                'Company deativted because you have reached Credit Limit'
            ) {
                setInActive(true);
                setLoading(false);
            } else {
                setCompanyInfo(response?.data)
                setLoading(false);
                setInActive(false);
            }
            setLoading(false);
        } else {
            setLoading(false);
            return null;
        }
        setLoading(false);
    };
    return {
        loading,
        inActive,
        getCompanyInfo,
        setToken,
        userToken,
        closed,
        setClosed,
        setInActive,
        companyInfo
    }
}