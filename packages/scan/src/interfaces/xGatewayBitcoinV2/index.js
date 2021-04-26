module.exports = {
  types: {
    CurrencyIdOf: 'u32',
    BtcAddress: 'Text',

    PerDispatchClass: {
      normal: 'WeightPerClass',
      operational: 'WeightPerClass',
      mandatory: 'WeightPerClass'
    },
    RequestId: 'u128',
    BlockNumberFor: 'BlockNumber',
    Vault: {
      id: 'AccountId',
      toBeIssuedTokens: 'Balance',
      issuedTokens: 'Balance',
      toBeRedeemedTokens: 'Balance',
      wallet: 'BtcAddress',
      bannedUntil: 'BlockNumber',
      status: 'VaultStatus'
    },
    VaultStatus: {
      _enum: ['Active', 'Liquidated', 'CommittedTheft']
    },
    TradingPrice: {
      price: 'u128',
      decimal: 'u8'
    },

    IssueRequest: {
      vault: 'AccountId',
      openTime: 'BlockNumber',
      requester: 'AccountId',
      btcAddress: 'BtcAddress',
      btcAmount: 'Balance',
      griefingCollateral: 'Balance'
    },
    RpcVaultInfo: {
      account: 'AccountId',
      btcAddr: 'BtcAddress'
    },
    RedeemRequest: {
      vault: 'AccountId',
      openTime: 'BlockNumber',
      requester: 'AccountId',
      btcAddress: 'BtcAddress',
      amount: 'Balance',
      redeemFee: 'Balance',
      reimburse: 'bool'
    },
    Status: {
      _enum: {
        Running: null,
        Error: 'ErrorCode',
        Shutdown: null
      }
    },
    ErrorCode: {
      _enum: [
        'Liquidating',
        'Liquidating_ExchangeRateExpired',
        'ExchangeRateExpired'
      ]
    }
  }
}
