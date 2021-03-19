const { ApiPromise } = require('@polkadot/api')
const { WsProvider } = require('@polkadot/rpc-provider')
const { options } = require('@chainx-v2/api')
const { logger } = require('../util')

let provider = null
let api = null

async function getApi() {
  if (!api) {
    const ws_endpoint = process.env.WS_ENDPOINT
      ? process.env.WS_ENDPOINT
      : 'ws://47.114.131.193:9000'
    provider = new WsProvider(ws_endpoint)
    api = await ApiPromise.create(
      options({
        provider,
        types: {
          CurrencyIdOf: 'u32',
          BlockLength: 'u32',
          BtcAddress: 'Text',
          BlockWeights: {
            baseBlock: 'Weight',
            maxBlock: 'Weight',
            perClass: 'PerDispatchClass'
          },
          PerDispatchClass: {
            normal: 'WeightPerClass',
            operational: 'WeightPerClass',
            mandatory: 'WeightPerClass'
          },
          WeightPerClass: {
            baseExtrinsic: 'Weight',
            maxExtrinsic: 'Weight',
            maxTotal: 'Option<Weight>',
            reserved: 'Option<Weight>'
          },
          Address: 'MultiAddress',
          LookupSource: 'MultiAddress',
          RequestId: 'u128',
          BlockNumberFor: 'BlockNumber',
          Vault: {
            id: 'AccountId',
            toBeIssuedTokens: 'Balance',
            issuedTokens: 'Balance',
            toBeRedeemedTokens: 'Balance',
            wallet: 'Text',
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
          TypeU: {
            _enum: ['TP2PKH', 'TP2SH']
          },
          Network: {
            _enum: ['Mainnet', 'Testnet']
          },
          AddressHash: 'H160',
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
      })
    )
  }

  return api
}

async function disconnect() {
  if (provider) {
    provider.disconnect()
  }
}

module.exports = {
  getApi,
  disconnect
}
