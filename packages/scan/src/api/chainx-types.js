module.exports = {
  SignedBalance: {
    _enum: {
      Negative: 'Balance',
      Positive: 'Balance'
    }
  },
  // eslint-disable-next-line sort-keys
  AssetType: {
    _enum: [
      'Free',
      'ReservedStaking',
      'ReservedStakingRevocation',
      'ReservedWithdrawal',
      'ReservedDexSpot',
      'ReservedDexFuture',
      'ReservedCurrency',
      'ReservedXRC20',
      'LockedFee'
    ]
  },
  XRC20Selector: {
    _enum: [
      'BalanceOf',
      'TotalSupply',
      'Name',
      'Symbol',
      'Decimals',
      'Issue',
      'Destroy'
    ]
  },
  // eslint-disable-next-line sort-keys
  OrderType: {
    _enum: ['Limit', 'Market']
  },
  Side: {
    _enum: ['Buy', 'Sell']
  },
  // eslint-disable-next-line sort-keys
  String: 'Text',
  // eslint-disable-next-line sort-keys
  Memo: 'Text',
  // eslint-disable-next-line sort-keys
  AssetInfo: {
    token: 'Token',
    tokenName: 'Token',
    // eslint-disable-next-line sort-keys
    chain: 'Chain',
    precision: 'Precision',
    // eslint-disable-next-line sort-keys
    desc: 'Desc'
  },
  BTCHeaderInfo: {
    header: 'BTCHeader',
    height: 'u32',
    // eslint-disable-next-line sort-keys
    confirmed: 'bool',
    txidList: 'Vec<H256>'
  },
  BTCTxInfo: {
    rawTx: 'BTCTransaction',
    txType: 'BTCTxType',
    // eslint-disable-next-line sort-keys
    height: 'u32'
  },
  // eslint-disable-next-line sort-keys
  BTCParams: {
    maxBits: 'u32',
    // eslint-disable-next-line sort-keys
    blockMaxFuture: 'u32',
    targetTimespanSeconds: 'u32',
    // eslint-disable-next-line sort-keys
    targetSpacingSeconds: 'u32',
    // eslint-disable-next-line sort-keys
    retargetingFactor: 'u32',
    retargetingInterval: 'u32',
    // eslint-disable-next-line sort-keys
    minTimespan: 'u32',
    // eslint-disable-next-line sort-keys
    maxTimespan: 'u32'
  },
  TradingPairProfile: {
    id: 'TradingPairId',
    // eslint-disable-next-line sort-keys
    currencyPair: 'CurrencyPair',
    pipPrecision: 'u32',
    tickPrecision: 'u32',
    // eslint-disable-next-line sort-keys
    online: 'bool'
  },
  // eslint-disable-next-line sort-keys
  Order: {
    props: 'OrderProperty',
    status: 'OrderStatus',
    // eslint-disable-next-line sort-keys
    remaining: 'Balance',
    // eslint-disable-next-line sort-keys
    executedIndices: 'Vec<TradingHistoryIndex>',
    // eslint-disable-next-line sort-keys
    alreadyFilled: 'Balance',
    lastUpdateAt: 'BlockNumber'
  },
  TradingPairInfo: {
    latestPrice: 'Price',
    // eslint-disable-next-line sort-keys
    lastUpdated: 'BlockNumber'
  },
  // eslint-disable-next-line sort-keys
  OrderExecutedInfo: {
    tradingHistoryIdx: 'TradingHistoryIndex',
    // eslint-disable-next-line sort-keys
    pairId: 'TradingPairId',
    price: 'Price',
    // eslint-disable-next-line sort-keys
    maker: 'AccountId',
    taker: 'AccountId',
    // eslint-disable-next-line sort-keys
    makerOrderId: 'OrderId',
    takerOrderId: 'OrderId',
    turnover: 'Balance',
    // eslint-disable-next-line sort-keys
    executedAt: 'BlockNumber'
  },
  // eslint-disable-next-line sort-keys
  AssetLedger: {
    lastTotalMiningWeight: 'MiningWeight',
    lastTotalMiningWeightUpdate: 'BlockNumber'
  },
  MinerLedger: {
    lastMiningWeight: 'MiningWeight',
    lastMiningWeightUpdate: 'BlockNumber',
    // eslint-disable-next-line sort-keys
    lastClaim: 'Option<BlockNumber>'
  },
  // eslint-disable-next-line sort-keys
  ClaimRestriction: {
    stakingRequirement: 'StakingRequirement',
    // eslint-disable-next-line sort-keys
    frequencyLimit: 'BlockNumber'
  },
  // eslint-disable-next-line sort-keys
  BondRequirement: {
    selfBonded: 'Balance',
    total: 'Balance'
  },
  ValidatorLedger: {
    total: 'Balance',
    // eslint-disable-next-line sort-keys
    lastTotalVoteWeight: 'WeightType',
    lastTotalVoteWeightUpdate: 'BlockNumber'
  },
  // eslint-disable-next-line sort-keys
  NominatorLedger: {
    nomination: 'Balance',
    // eslint-disable-next-line sort-keys
    lastVoteWeight: 'WeightType',
    lastVoteWeightUpdate: 'BlockNumber'
  },
  ValidatorProfile: {
    registeredAt: 'BlockNumber',
    // eslint-disable-next-line sort-keys
    isChilled: 'bool',
    lastChilled: 'Option<BlockNumber>'
  },
  // eslint-disable-next-line sort-keys
  NominatorProfile: {
    lastRebond: 'Option<BlockNumber>',
    unbondedChunks: 'Vec<Unbonded>'
  },
  // eslint-disable-next-line sort-keys
  GlobalDistribution: {
    treasury: 'u32',
    // eslint-disable-next-line sort-keys
    mining: 'u32'
  },
  MiningDistribution: {
    asset: 'u32',
    staking: 'u32'
  },
  UnbondedIndex: 'u32',
  // eslint-disable-next-line sort-keys
  Desc: 'Text',
  Token: 'Text',
  // eslint-disable-next-line sort-keys
  AddrStr: 'Text',
  Selector: '[u8; 4]',
  // eslint-disable-next-line sort-keys
  HandicapInfo: 'Handicap',
  Price: 'Balance',
  // eslint-disable-next-line sort-keys
  OrderId: 'u64',
  TradingPairId: 'u32',
  // eslint-disable-next-line sort-keys
  TradingHistoryIndex: 'u64',
  // eslint-disable-next-line sort-keys
  PriceFluctuation: 'u32',
  // eslint-disable-next-line sort-keys
  FixedAssetPower: 'u32',
  StakingRequirement: 'u32',
  // eslint-disable-next-line sort-keys
  Precision: 'u8',
  // eslint-disable-next-line sort-keys
  BTCTxType: {
    _enum: [
      'Withdrawal',
      'Deposit',
      'HotAndCold',
      'TrusteeTransition',
      'Lock',
      'Unlock',
      'Irrelevance'
    ]
  },
  CurrencyPair: {
    base: 'AssetId',
    quote: 'AssetId'
  },
  OrderStatus: {
    _enum: [
      'Created',
      'ParitialFill',
      'Filled',
      'ParitialFillAndCanceled',
      'Canceled'
    ]
  },
  // eslint-disable-next-line sort-keys
  MiningWeight: 'u128',
  WeightType: 'u128',
  // eslint-disable-next-line sort-keys
  AssetId: 'u32',
  Chain: {
    _enum: ['ChainX', 'Bitcoin', 'Ethereum', 'Polkadot']
  },
  // eslint-disable-next-line sort-keys
  AssetRestriction: {
    _enum: [
      'Move',
      'Transfer',
      'Deposit',
      'Withdraw',
      'DestroyWithdrawal',
      'DestroyFree'
    ]
  },
  AssetRestrictions: {
    mask: 'u32'
  },
  BTCAddress: {
    kind: 'Type',
    network: 'Network',
    // eslint-disable-next-line sort-keys
    hash: 'AddressHash'
  },
  BTCHeader: {
    version: 'u32',
    // eslint-disable-next-line sort-keys
    previousHeaderHash: 'H256',
    // eslint-disable-next-line sort-keys
    merkleRootHash: 'H256',
    time: 'u32',
    // eslint-disable-next-line sort-keys
    bits: 'BTCCompact',
    nonce: 'u32'
  },
  BTCNetwork: {
    _enum: ['Mainnet', 'Testnet']
  },
  NetworkType: {
    _enum: ['Mainnet', 'Testnet']
  },
  OrderInfo: 'Order',
  // eslint-disable-next-line sort-keys
  AssetInfoForRpc: {
    token: 'Text',
    tokenName: 'Text',
    // eslint-disable-next-line sort-keys
    chain: 'Chain',
    precision: 'Precision',
    // eslint-disable-next-line sort-keys
    desc: 'Text'
  },
  Handicap: {
    highestBid: 'Price',
    lowestOffer: 'Price'
  },
  OrderProperty: {
    id: 'OrderId',
    side: 'Side',
    // eslint-disable-next-line sort-keys
    price: 'Price',
    // eslint-disable-next-line sort-keys
    amount: 'Amount',
    pairId: 'TradingPairId',
    submitter: 'AccountId',
    // eslint-disable-next-line sort-keys
    orderType: 'OrderType',
    // eslint-disable-next-line sort-keys
    createdAt: 'BlockNumber'
  },
  TotalAssetInfoForRpc: {
    info: 'AssetInfoForRpc',
    // eslint-disable-next-line sort-keys
    balance: 'BTreeMap<AssetType, Text>',
    isOnline: 'bool',
    restrictions: 'AssetRestrictions'
  },

  // eslint-disable-next-line sort-keys
  OutPoint: {
    hash: 'H256',
    index: 'u32'
  },
  TransactionInput: {
    previous_output: 'OutPoint',
    script_sig: 'Bytes',
    sequence: 'u32',
    // eslint-disable-next-line sort-keys
    scriptWitness: 'Vec<Bytes>'
  },
  TransactionOutput: {
    value: 'u64',
    // eslint-disable-next-line sort-keys
    scriptPubkey: 'Bytes'
  },
  // eslint-disable-next-line sort-keys
  BTCTransaction: {
    version: 'i32',
    // eslint-disable-next-line sort-keys
    inputs: 'Vec<TransactionInput>',
    outputs: 'Vec<TransactionOutput>',
    // eslint-disable-next-line sort-keys
    lock_time: 'u32'
  },
  // eslint-disable-next-line sort-keys
  BTCAddrType: {
    _enum: ['P2PKH', 'P2SH']
  },
  Unbonded: {
    lockedUntil: 'BlockNumber',
    value: 'Balance'
  },
  WithdrawalState: {
    _enum: [
      'Applying',
      'Processing',
      'NormalFinish',
      'RootFinish',
      'NormalCancel',
      'RootCancel'
    ]
  },
  WithdrawalRecord: {
    assetId: 'AssetId',
    applicant: 'AccountId',
    balance: 'Balance',
    addr: 'AddrStr',
    ext: 'Memo',
    height: 'BlockNumber'
  },
  WithdrawalLimit: {
    minimalWithdrawal: 'Balance',
    fee: 'Balance'
  },
  TrusteeInfoConfig: {
    minTrusteeCount: 'u32',
    maxTrusteeCount: 'u32'
  },
  GenericTrusteeIntentionProps: {
    about: 'Text',
    hotEntity: 'Vec<u8>',
    coldEntity: 'Vec<u8>'
  },
  GenericTrusteeSessionInfo: {
    trusteeList: 'Vec<AccountId>',
    threshold: 'u16',
    hotAddress: 'Vec<u8>',
    coldAddress: 'Vec<u8>'
  },
  BtcTrusteeType: 'Vec<u8>',
  BtcTrusteeAddrInfo: {
    addr: 'BtcAddress',
    redeemScript: 'Vec<u8>'
  },
  BtcTrusteeIntentionProps: {
    about: 'Text',
    hotEntity: 'BtcTrusteeType',
    coldEntity: 'BtcTrusteeType'
  },
  BtcTrusteeSessionInfo: {
    trusteeList: 'Vec<AccountId>',
    threshold: 'u16',
    hotAddress: 'BtcTrusteeAddrInfo',
    coldAddress: 'BtcTrusteeAddrInfo'
  },

  BtcTxType: {
    _enum: [
      'Withdrawal',
      'Deposit',
      'HotAndCold',
      'TrusteeTransition',
      'Irrelevance'
    ]
  },
  // eslint-disable-next-line sort-keys
  BtcHeaderIndex: {
    hash: 'H256',
    height: 'u32'
  },
  BtcTxResult: {
    _enum: ['Success', 'Failed']
  },
  BtcTxState: {
    result: 'BtcTxResult',
    txType: 'BtcTxType'
  },
  // eslint-disable-next-line sort-keys
  BtcDepositCache: {
    txid: 'H256',
    // eslint-disable-next-line sort-keys
    balance: 'u64'
  },
  BtcVoteResult: {
    _enum: ['Unfinish', 'Finish']
  },
  BtcWithdrawalProposal: {
    sigState: 'BtcVoteResult',
    withdrawalIdList: 'Vec<u32>',
    // eslint-disable-next-line sort-keys
    tx: 'BtcTransaction',
    // eslint-disable-next-line sort-keys
    trusteeList: 'Vec<(AccountId, bool)>'
  },
  MiningPower: 'u128',
  // eslint-disable-next-line sort-keys
  AddressHash: 'H160',
  ValidatorInfo: {
    account: 'AccountId',
    registeredAt: 'BlockNumber',
    // eslint-disable-next-line sort-keys
    isChilled: 'bool',
    lastChilled: 'Option<BlockNumber>',
    total: 'RpcBalance',
    // eslint-disable-next-line sort-keys
    lastTotalVoteWeight: 'RpcWeightType',
    lastTotalVoteWeightUpdate: 'BlockNumber',
    // eslint-disable-next-line sort-keys
    isValidating: 'bool',
    selfBonded: 'RpcBalance',
    // eslint-disable-next-line sort-keys
    rewardPotAccount: 'AccountId',
    rewardPotBalance: 'RpcBalance'
  },
  // eslint-disable-next-line sort-keys
  RpcBalance: 'String',
  RpcWeightType: 'String'
}
