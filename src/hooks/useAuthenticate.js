import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { login } from '../redux/features/auth/authActions';

/**
 * Login hook — now a thin wrapper over the redux `login` thunk.
 * Navigation flow preserved: a successful step-1 login (token present or
 * requiresPin) navigates to PINSCREEN with the loginInfo params.
 */
export default function useAuthenticate() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [data, setData] = useState();
    const [errorCount, setErrorCount] = useState(0);

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const authenticate = async (email, password) => {
        setLoading(true);
        setError(false);
        try {
            const resultAction = await dispatch(login({ email, password }));

            if (resultAction.type.endsWith('/rejected')) {
                const message = String(
                    resultAction.payload || resultAction.error?.message || ''
                ).toLowerCase();
                setError(true);
                setErrorCount(errorCount + 1);

                // Preserve the current "invalid credentials" behavior (incl. the
                // quick-support alert after repeated failures).
                if (message.includes('invalid email or password') && errorCount > 2) {
                    setError(false);
                    setLoading(false);
                    Alert.alert('Hej!', "Behöver du hjälp med att komma igång?", [
                        {
                            text: "Försök igen",
                            onPress: () => setErrorCount(errorCount - 2)
                        },
                        {
                            text: "Få Snabbsupport",
                            onPress: () => {
                                setErrorCount(0);
                                navigation.navigate('QUICK_SUPPORT');
                            }
                        },
                    ]);
                }
                return;
            }

            const result = resultAction.payload;
            // Preserve the current behavior: navigate to PINSCREEN when the
            // step-1 login returned a token (or the backend asked for a PIN).
            if (result?.token || result?.requiresPin) {
                navigation.navigate('PINSCREEN', {
                    loginInfo: { email: email, password: password, login: true },
                });
            }
        } catch (err) {
            console.log(err);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    return {
        authenticate,
        data,
        error,
        loading,
        setError,
        setLoading
    };
}
