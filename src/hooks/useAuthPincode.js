import { useEffect, useState } from 'react'
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { verifyPin, verifyCodePin } from '../redux/features/auth/authActions';

/**
 * PIN verification hook (login PIN screen) — wraps the redux `verifyPin` thunk
 * (password flow) or `verifyCodePin` (passwordless flow, when a stepToken is
 * present). On success the thunk persists the token and updates the store, so
 * App.js automatically switches from AuthNavigation to AppSideNavigation.
 */
export const useAuthPincode = () => {
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const verifyPincode = async ({ pinCode, email, password, stepToken }) => {
        setLoading(true);
        try {
            const resultAction = await dispatch(
                stepToken
                    ? verifyCodePin({ stepToken, pinCode })
                    : verifyPin({ email, password, pinCode })
            );

            if (resultAction.type.endsWith('/rejected')) {
                const message = String(resultAction.payload || '').toLowerCase();
                // Preserve the current "invalid pin" alert behavior
                if (message.includes('invalid')) {
                    Alert.alert('Fel pinkod', 'Försök igen.');
                }
            }
        } catch (error) {
            console.log(error);
            Alert.alert('Fel', error?.message || 'Något gick fel. Försök igen.');
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
