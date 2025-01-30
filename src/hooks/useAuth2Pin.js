import { useNavigation } from "@react-navigation/native";
import { useContext, useEffect, useState } from "react";
import { Alert } from "react-native";
import { api } from "../api/api";
import { AuthContext } from "../context/auth.context";
import { removeToken } from "../helper/storage";
import { useGetCompanyInfo } from "./useGetCompanyInfo";


export const useAuth2Pin = () => {
    const [loading, setLoading] = useState(false);
    const { user, setInActive, setUser } = useContext(AuthContext);
    const { companyInfo, getCompanyInfo } = useGetCompanyInfo()
    const navigation = useNavigation()


    useEffect(() => {
        getCompanyInfo()
    }, [])


    const verifyPincode = async ({ pinCode, data, title, moreInfo, navigateTo }) => {
        try {
            setLoading(true);
            const response = await api.post(`/api/manager/confirmpinCheck`, {
                pincode: pinCode,
            }, {
                headers: {
                    Authorization: `Bearer ${user}`
                }
            });
            console.log(response?.data);
            switch (response?.data?.message) {
                case 'Company deativted because you have reached Credit Limit':
                    setInActive(true);
                    setLoading(false)
                    break;
                case 'pin code is required':
                case 'invalid email or pin.':
                    Alert.alert('OBS', 'Ange rätt pinkod');
                    setLoading(false)
                    break;
                case 'invalid token in the request.':
                    Alert.alert('OBS', 'Du har blivit utloggad, vänligen logga in igen', [{
                        text: 'Logga in igen',
                        onPress: () => setUser(null),
                    }]);
                    await removeToken();
                    setUser(null);
                    break;
                case 'Pin code is Correct':
                    setLoading(false);
                    return navigation.navigate(navigateTo ? navigateTo : 'CHECKOUT', {
                        data: data,
                        title: title,
                        moreInfo: moreInfo,
                        compInformation: response?.data?.employee ? response?.data?.employee : null,
                        companyInfo: companyInfo,
                    });
                default:
                    break;
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error.message);
        }
    };

    return {
        loading,
        verifyPincode,
    };
};