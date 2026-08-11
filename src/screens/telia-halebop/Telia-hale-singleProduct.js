/**
 * Telia/Halebop single product — thin wrapper over the shared OperatorCheckout.
 * The operator (Telia vs Halebop) comes from the redux auth slice, exactly as the
 * legacy screen read it; the config supplies the per-operator colors, routes
 * and print screen.
 */
import React from 'react';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import OperatorCheckout from '../../components/operator/OperatorCheckout';
import { getOperatorConfig } from '../../components/operator/operatorConfigs';
import { selectTeliaHalebop } from '../../redux/features/auth/authSlice';

const TeliaHalebopSingleProductScreen = () => {
  const route = useRoute();
  const { product } = route.params || {};
  const teliaHalebop = useSelector(selectTeliaHalebop);

  return (
    <OperatorCheckout
      config={getOperatorConfig(teliaHalebop)}
      item={product}
    />
  );
};

export default TeliaHalebopSingleProductScreen;
