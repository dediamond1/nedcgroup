import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert } from 'react-native';
import { api } from '../api/api';


export default function useAuthenticate() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState();
    const [errorCount, setErrorCount] = useState(0);

    const navigation = useNavigation();

    const authenticate = async (email, password) => {
        setLoading(true);
        const response = await api.post('/api/manager/login', {
            email: email,
            password: password
        });
        console.log(response.data)
        if (!response.ok) {
            setLoading(false);
            console.log(response.problem);

        }

        if (!response?.data?.token) {
            setError(true);
            setErrorCount(errorCount + 1)

        }
        if (response?.data?.message === 'invalid email or password') {
            setLoading(false);
            if (errorCount > 2) {
                setError(false)
                setLoading(false)
                Alert.alert('Hej!', "Behöver du hjälp med att komma igång?", [
                    {
                        text: "Försök igen",
                        onPress: () => setErrorCount(errorCount - 2)
                    },
                    {
                        text: "Få hjälp",
                        onPress: () => {
                            setErrorCount(0)
                            navigation.navigate('HELP')
                        }
                    },

                ])
            }
        }


        if (response?.data?.message == 'login verified. Provide token in next request. ') {
            setLoading(false)
            navigation.navigate('PINSCREEN', {
                loginInfo: { email: email, password: password, login: true },
            });
        }
        setLoading(false)
    };

    return {
        authenticate,
        data,
        error,
        loading,
        setError
    };
}
