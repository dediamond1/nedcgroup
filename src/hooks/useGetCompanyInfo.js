import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { removeToken } from "../helper/storage";
import {
  selectToken,
  selectInActive,
  setInActive as setInActiveAction,
  logout,
} from "../redux/features/auth/authSlice";
import { useGetCompanyInfoQuery } from "../redux/api/companyApi";

/**
 * Company info hook — data flows through the RTK Query companyApi
 * (no direct fetch here). `inActive`/`token` are owned by the authSlice;
 * `companyInfo` comes from the query cache; `closed` is local UI state.
 * The surface (companyInfo, loading, getCompanyInfo, userToken, ...) is
 * unchanged so every consumer keeps working.
 */
export const useGetCompanyInfo = () => {
  const [closed, setClosed] = useState(false);

  const dispatch = useDispatch();
  const token = useSelector(selectToken);
  const inActive = useSelector(selectInActive);
  const setInActive = (value) => dispatch(setInActiveAction(value));

  const {
    data: companyInfo,
    isLoading,
    refetch,
    error,
  } = useGetCompanyInfoQuery(undefined, {
    skip: !token,
  });

  // Invalid-token handling (preserved from the legacy hook — requireAuth 401).
  useEffect(() => {
    if (error?.data?.message !== "invalid token in the request.") {
      return;
    }
    Alert.alert("OBS", "Du har blivit utloggad, vänligen logga in igen", [
      {
        text: "Logga in igen",
        onPress: () => dispatch(logout()),
      },
    ]);
    removeToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  // Deactivation / credit-limit handling (preserved from the legacy hook).
  useEffect(() => {
    // A deactivated account gets 401 "Account deactivated" on the company-info
    // call — show the deactivated screen even when the app opens mid-deactivation.
    // "Försök igen" (refetch) re-checks: once support reactivates the account,
    // the same token still works (no re-login needed) and the app resumes.
    if (error?.data?.message === "Account deactivated. Please contact support.") {
      setInActive(true);
      return;
    }
    if (!companyInfo) return;
    if (
      companyInfo.manager?.IsActive === false ||
      companyInfo.message ===
        "Company deactivated because you have reached Credit Limit"
    ) {
      setInActive(true);
    } else {
      setInActive(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companyInfo, error]);

  return {
    loading: isLoading,
    inActive,
    getCompanyInfo: refetch,
    setToken: () => {},
    userToken: token,
    closed,
    setClosed,
    setInActive,
    companyInfo,
  };
};
