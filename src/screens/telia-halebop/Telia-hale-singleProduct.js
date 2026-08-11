/**
 * Telia/Halebop single product — thin wrapper over the shared OperatorCheckout.
 * The operator (Telia vs Halebop) comes from the auth context, exactly as the
 * legacy screen read it; the config supplies the per-operator colors, routes
 * and print screen.
 */
import React, { useContext } from 'react';
import { useRoute } from '@react-navigation/native';
import { AuthContext } from '../../context/auth.context';
import OperatorCheckout from '../../components/operator/OperatorCheckout';
import { getOperatorConfig } from '../../components/operator/operatorConfigs';

const TeliaHalebopSingleProductScreen = () => {
  const route = useRoute();
  const { product } = route.params || {};
  const { teliaHalebop } = useContext(AuthContext);

  return (
    <OperatorCheckout
      config={getOperatorConfig(teliaHalebop)}
      item={product}
    />
  );
};

export default TeliaHalebopSingleProductScreen;
