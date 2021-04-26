module.exports = {
  rpc: {
    xassets: {
      getAssetsByAccount: {
        description:
          'Return all assets with AssetTypes for an account (exclude native token(PCX)). The returned map would not contains the assets which is not existed for this account but existed in valid assets list.',
        params: [
          {
            name: 'who',
            type: 'AccountId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'BTreeMap<AssetId, BTreeMap<AssetType, RpcBalance<Balance>>>'
      },
      getAssets: {
        description: 'get all assets balance and infos',
        params: [
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'BTreeMap<AssetId, RpcTotalAssetInfo>'
      }
    },
    xspot: {
      getTradingPairs: {
        description: 'Get the overall info of all trading pairs.',
        params: [
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'Vec<FullPairInfo<RpcPrice<Price>, BlockNumber>>'
      },
      getOrdersByAccount: {
        description: 'Get the orders of an account.',
        params: [
          {
            name: 'who',
            type: 'AccountId'
          },
          {
            name: 'page_index',
            type: 'u32'
          },
          {
            name: 'page_size',
            type: 'u32'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type:
          'Page<Vec<RpcOrder<TradingPairId,AccountId,RpcBalance<Balance>,RpcPrice<Price>,BlockNumber>>>'
      },
      getDepth: {
        description: 'Get the depth of a trading pair.',
        params: [
          {
            name: 'pair_id',
            type: 'TradingPairId'
          },
          {
            name: 'depth_size',
            type: 'u32'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'Option<Depth<RpcPrice<Price>, RpcBalance<Balance>>>'
      }
    },
    xgatewaycommon: {
      boundAddrs: {
        description: 'Get bound addrs for an accountid',
        params: [
          {
            name: 'who',
            type: 'AccountId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'BTreeMap<Chain, Vec<String>>'
      },
      withdrawalLimit: {
        description:
          'Get withdrawal limit(minimal_withdrawal&fee) for an AssetId',
        params: [
          {
            name: 'asset_id',
            type: 'AssetId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'WithdrawalLimit<RpcBalance<Balance>>'
      },
      verifyWithdrawal: {
        description:
          'Use the params to verify whether the withdrawal apply is valid. Notice those params is same as the params for call `XGatewayCommon::withdraw(...)`, including checking address is valid or something else. Front-end should use this rpc to check params first, than could create the extrinsic.',
        params: [
          {
            name: 'asset_id',
            type: 'AssetId'
          },
          {
            name: 'value',
            type: 'u64'
          },
          {
            name: 'addr',
            type: 'String'
          },
          {
            name: 'memo',
            type: 'String'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'bool'
      },
      trusteeMultisigs: {
        description: 'Return the trustee multisig address for all chain.',
        params: [
          {
            name: 'at',
            type: 'Option<BlockHash>)'
          }
        ],
        type: 'BTreeMap<Chain, AccountId>'
      },
      bitcoinTrusteeProperties: {
        description:
          'Return bitcoin trustee registered property info for an account(e.g. registered hot/cold address)',
        params: [
          {
            name: 'who',
            type: 'AccountId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'BtcTrusteeIntentionProps'
      },
      bitcoinTrusteeSessionInfo: {
        description:
          'Return bitcoin trustee for current session(e.g. trustee hot/cold address and else)',
        params: [
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'BtcTrusteeSessionInfo<AccountId>'
      },
      bitcoinGenerateTrusteeSessionInfo: {
        description:
          'Try to generate bitcoin trustee info for a list of candidates. (this api is used to check the trustee info which would be generated by those candidates)',
        params: [
          {
            name: 'candidates',
            type: 'Vec<AccountId>'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'BtcTrusteeSessionInfo<AccountId>'
      }
    },
    xgatewayrecords: {
      withdrawalList: {
        description:
          'Return current withdraw list(include Applying and Processing withdraw state)',
        params: [
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type:
          'BTreeMap<WithdrawalRecordId, RpcWithdrawalRecord<AccountId, Balance, BlockNumber>>'
      },
      withdrawalListByChain: {
        description:
          'Return current withdraw list for a chain(include Applying and Processing withdraw state)',
        params: [
          {
            name: 'chain',
            type: 'Chain'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type:
          'BTreeMap<WithdrawalRecordId, RpcWithdrawalRecord<AccountId, Balance, BlockNumber>>'
      },
      pendingWithdrawalListByChain: {
        description: 'Return current pending withdraw list for a chain',
        params: [
          {
            name: 'chain',
            type: 'Chain'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type:
          'BTreeMap<WithdrawalRecordId, RpcWithdrawalRecord<AccountId, Balance, BlockNumber>>'
      }
    },
    xminingasset: {
      getMiningAssets: {
        description: 'Get overall information about all mining assets.',
        params: [
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type:
          'Vec<MiningAssetInfo<AccountId,RpcBalance<Balance>,RpcMiningWeight<MiningWeight>,BlockNumber>>'
      },
      getDividendByAccount: {
        description:
          'Get the asset mining dividends info given the asset miner AccountId.',
        params: [
          {
            name: 'who',
            type: 'AccountId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'BTreeMap<AssetId, RpcMiningDividendInfo>'
      },
      getMinerLedgerByAccount: {
        description:
          'Get the mining ledger details given the asset miner AccountId.',
        params: [
          {
            name: 'who',
            type: 'AccountId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type:
          'BTreeMap<AssetId, MinerLedger<RpcMiningWeight<MiningWeight>, BlockNumber>>'
      }
    },
    xstaking: {
      getValidators: {
        description: 'Get overall information about all potential validators',
        params: [
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type:
          'Vec<ValidatorInfo<AccountId, RpcBalance<Balance>, RpcVoteWeight<VoteWeight>, BlockNumber>>'
      },
      getValidatorByAccount: {
        description: 'Get overall information given the validator AccountId.',
        params: [
          {
            name: 'who',
            type: 'AccountId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type:
          'ValidatorInfo<AccountId, RpcBalance<Balance>, RpcVoteWeight<VoteWeight>, BlockNumber>'
      },
      getDividendByAccount: {
        description:
          'Get the staking dividends info given the staker AccountId.',
        params: [
          {
            name: 'who',
            type: 'AccountId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'BTreeMap<AccountId, RpcBalance<Balance>>'
      },
      getNominationByAccount: {
        description: 'Get the nomination details given the staker AccountId.',
        params: [
          {
            name: 'who',
            type: 'AccountId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type:
          'BTreeMap<AccountId,NominatorLedger<RpcBalance<Balance>, RpcVoteWeight<VoteWeight>, BlockNumber>>'
      },
      getNominatorByAccount: {
        description:
          'Get individual nominator information given the nominator AccountId.',
        params: [
          {
            name: 'who',
            type: 'AccountId'
          },
          {
            name: 'at',
            type: 'Hash',
            isOptional: true
          }
        ],
        type: 'NominatorInfo<BlockNumber>'
      }
    },
    xfee: {
      queryDetails: {
        description: 'get the fee details of extrinsic',
        params: [
          {
            name: 'encoded_xt',
            type: 'Bytes'
          },
          {
            name: 'at',
            type: 'Option<BlockHash>'
          }
        ],
        type: 'RpcFeeDetails'
      }
    }
  },
  types: {
    OrderStatus: {
      _enum: [
        'Created',
        'PartialFill',
        'Filled',
        'PartialFillAndCanceled',
        'Canceled'
      ]
    },
    Chain: {
      _enum: ['ChainX', 'Bitcoin', 'Ethereum', 'Polkadot']
    },
    AssetType: {
      _enum: [
        'Usable',
        'Locked',
        'Reserved',
        'ReservedWithdrawal',
        'ReservedDexSpot'
      ]
    },
    OrderType: {
      _enum: ['Limit', 'Market']
    },
    Side: {
      _enum: ['Buy', 'Sell']
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
    Memo: 'Text',
    AssetInfo: {
      token: 'String',
      tokenName: 'String',
      chain: 'Chain',
      decimals: 'Decimals',
      desc: 'String'
    },
    Handicap: {
      highestBid: 'Price',
      lowestAsk: 'Price'
    },
    CurrencyPair: {
      base: 'AssetId',
      quote: 'AssetId'
    },
    TradingPairProfile: {
      id: 'TradingPairId',
      currencyPair: 'CurrencyPair',
      pipDecimals: 'u32',
      tickDecimals: 'u32',
      tradable: 'bool'
    },
    OrderExecutedInfo: {
      tradingHistoryIdx: 'TradingHistoryIndex',
      pairId: 'TradingPairId',
      price: 'Price',
      maker: 'AccountId',
      taker: 'AccountId',
      makerOrderId: 'OrderId',
      takerOrderId: 'OrderId',
      turnover: 'Balance',
      executedAt: 'BlockNumber'
    },
    BtcRelayedTxInfo: {
      blockHash: 'H256',
      merkleProof: 'BtcPartialMerkleTree'
    },
    BtcHeaderIndex: {
      hash: 'H256',
      height: 'u32'
    },
    BtcTxState: {
      txType: 'BtcTxType',
      result: 'BtcTxResult'
    },
    TrusteeInfoConfig: {
      minTrusteeCount: 'u32',
      maxTrusteeCount: 'u32'
    },
    GenericTrusteeSessionInfo: {
      trusteeList: 'Vec<AccountId>',
      threshold: 'u16',
      hotAddress: 'Vec<u8>',
      coldAddress: 'Vec<u8>'
    },
    GenericTrusteeIntentionProps: {
      about: 'Text',
      hotEntity: 'Vec<u8>',
      coldEntity: 'Vec<u8>'
    },
    WithdrawalRecord: {
      assetId: 'AssetId',
      applicant: 'AccountId',
      balance: 'Balance',
      addr: 'AddrStr',
      ext: 'Memo',
      height: 'BlockNumber'
    },
    ReferralId: 'Text',
    AddrStr: 'Text',
    ChainAddress: 'Vec<u8>',
    Price: 'u128',
    OrderId: 'u64',
    TradingPairId: 'u32',
    PriceFluctuation: 'u32',
    WithdrawalRecordId: 'u32',
    Token: 'Text',
    Decimals: 'u8',
    Desc: 'Text',
    TradingHistoryIndex: 'u64',
    BtcTxType: {
      _enum: [
        'Withdrawal',
        'Deposit',
        'HotAndCold',
        'TrusteeTransition',
        'Irrelevance'
      ]
    },
    BtcTxResult: {
      _enum: ['Success', 'Failure']
    },
    AmountOf: 'Amount',
    AssetRestrictions: {
      bits: 'u32'
    },
    Amount: 'i128',
    CurrencyId: 'AssetId',
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
    NetworkType: {
      _enum: ['Mainnet', 'Testnet']
    },
    OrderProperty: {
      id: 'OrderId',
      side: 'Side',
      price: 'Price',
      amount: 'Amount',
      pairId: 'TradingPairId',
      submitter: 'AccountId',
      orderType: 'OrderType',
      createdAt: 'BlockNumber'
    },
    TotalAssetInfo: {
      info: 'AssetInfo',
      balance: 'BTreeMap<AssetType, Balance>',
      isOnline: 'bool',
      restrictions: 'AssetRestrictions'
    },
    NominatorLedger: {
      nomination: 'Balance',
      lastVoteWeight: 'VoteWeight',
      lastVoteWeightUpdate: 'BlockNumber',
      unbondedChunks: 'Vec<Unbonded>'
    },
    Unbonded: {
      value: 'Balance',
      lockedUntil: 'BlockNumber'
    },
    WithdrawalLimit: {
      minimalWithdrawal: 'Balance',
      fee: 'Balance'
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
    BtcNetwork: {
      _enum: ['Mainnet', 'Testnet']
    },
    BtcHeader: 'Vec<u8>',
    BtcTransaction: 'Vec<u8>',
    BtcPartialMerkleTree: 'Vec<u8>',
    BtcDepositCache: {
      txid: 'H256',
      balance: 'u64'
    },
    BtcVoteResult: {
      _enum: ['Unfinish', 'Finish']
    },
    BtcWithdrawalProposal: {
      sigState: 'BtcVoteResult',
      withdrawalIdList: 'Vec<u32>',
      tx: 'BtcTransaction',
      trusteeList: 'Vec<(AccountId, bool)>'
    },
    BtcTxVerifier: {
      _enum: ['Recover', 'RuntimeInterface']
    },
    RpcTotalAssetInfo: {
      info: 'AssetInfo',
      balance: 'BTreeMap<AssetType, RpcBalance>',
      isOnline: 'bool',
      restrictions: 'AssetRestrictions'
    },
    RpcOrder: {
      id: 'OrderId',
      side: 'Side',
      price: 'RpcPrice',
      amount: 'RpcBalance',
      pairId: 'TradingPairId',
      submitter: 'AccountId',
      orderType: 'OrderType',
      createdAt: 'BlockNumber',
      status: 'OrderStatus',
      remaining: 'RpcBalance',
      executedIndices: 'Vec<TradingHistoryIndex>',
      alreadyFilled: 'RpcBalance',
      reservedBalance: 'RpcBalance',
      lastUpdateAt: 'BlockNumber'
    },
    RpcWithdrawalRecord: {
      assetId: 'AssetId',
      applicant: 'AccountId',
      balance: 'RpcBalance',
      addr: 'String',
      ext: 'String',
      height: 'BlockNumber',
      state: 'WithdrawalState'
    },
    RpcMiningDividendInfo: {
      own: 'RpcBalance',
      other: 'RpcBalance',
      insufficientStake: 'RpcBalance'
    },
    RpcInclusionFee: {
      baseFee: 'RpcBalance',
      lenFee: 'RpcBalance',
      adjustedWeightFee: 'RpcBalance'
    },
    RpcFeeDetails: {
      inclusionFee: 'Option<RpcInclusionFee>',
      tip: 'RpcBalance',
      extraFee: 'RpcBalance',
      finalFee: 'RpcBalance'
    },
    ValidatorInfo: {
      account: 'AccountId',
      registeredAt: 'BlockNumber',
      isChilled: 'bool',
      lastChilled: 'Option<BlockNumber>',
      totalNomination: 'RpcBalance',
      lastTotalVoteWeight: 'RpcVoteWeight',
      lastTotalVoteWeightUpdate: 'BlockNumber',
      isValidating: 'bool',
      selfBonded: 'RpcBalance',
      referralId: 'String',
      rewardPotAccount: 'AccountId',
      rewardPotBalance: 'RpcBalance'
    },
    FullPairInfo: {
      baseCurrency: 'AssetId',
      highestBid: 'RpcPrice',
      id: 'TradingPairId',
      latestPrice: 'RpcPrice',
      latestPriceUpdatedAt: 'BlockNumber',
      lowestAsk: 'RpcPrice',
      maxValidBid: 'RpcPrice',
      minValidAsk: 'RpcPrice',
      pipDecimals: 'u32',
      quoteCurrency: 'AssetId',
      tickDecimals: 'u32',
      tradable: 'bool'
    },
    MiningAssetInfo: {
      assetId: 'AssetId',
      miningPower: 'FixedAssetPower',
      rewardPot: 'AccountId',
      rewardPotBalance: 'RpcBalance',
      lastTotalMiningWeight: 'RpcMiningWeight',
      lastTotalMiningWeightUpdate: 'BlockNumber'
    },
    Depth: {
      asks: 'Vec<(RpcPrice, RpcBalance)>',
      bids: 'Vec<(RpcPrice, RpcBalance)>'
    },
    Page: {
      pageIndex: 'u32',
      pageSize: 'u32',
      data: 'Vec<RpcOrder>'
    },
    String: 'Text',
    MiningWeight: 'u128',
    RpcPrice: 'String',
    RpcBalance: 'String',
    RpcMiningWeight: 'String',
    RpcVoteWeight: 'String',
    OrderInfo: 'Order',
    HandicapInfo: 'Handicap',
    WithdrawalRecordOf: 'WithdrawalRecord'
  }
}
