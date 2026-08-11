/**
 * Lyca product detail — thin wrapper over the shared OperatorCheckout.
 * All behaviour (PIN confirm, voucher reserve, order create, inline print,
 * voucher modal) is driven by OPERATOR_CONFIGS.lyca.
 */
import React from 'react';
import OperatorCheckout from '../../components/operator/OperatorCheckout';
import { OPERATOR_CONFIGS } from '../../components/operator/operatorConfigs';

export default function LycaDetailsScreen({ route, navigation }) {
  const { subcategory } = route.params;
  return (
    <OperatorCheckout
      config={OPERATOR_CONFIGS.lyca}
      item={subcategory}
      navigation={navigation}
    />
  );
}
