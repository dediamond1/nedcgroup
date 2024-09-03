import { useContext, useEffect, useState } from 'react'
import { Alert } from 'react-native';
import { api } from '../api/api';
import { AuthContext } from '../context/auth.context';
import { storeToken } from '../helper/storage';
import { useNavigation } from '@react-navigation/native';
export const useAuthPincode = () => {
    const [loading, setLoading] = useState(false);
    const { setUser } = useContext(AuthContext);
    const naviagtion = useNavigation()
    const verifyPincode = async ({ pinCode, email, password }) => {

        setLoading(true);
        try {
            const response = await api.post(`/api/manager/pinCheck`, {
                email: email,
                password: password,
                pin: pinCode,
            });

            if (response?.data?.message === "invalid email or pin.") {
                Alert.alert("fel pinkod", "Försök igen!");
                // naviagtion.goBack()
            } else {
                await storeToken(response?.data?.token);
                setUser(response?.data?.token);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        return () => setLoading(false);
    }, []);

    return {
        loading,
        verifyPincode,
    };
};
