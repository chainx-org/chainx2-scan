module.exports = {
  "xassets": {
    "getAssetsByAccount": {
      "description": "get all assets balance for an account",
      "params": [
        {
          "name": "who",
          "type": "AccountId"
        },
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<AssetId, BTreeMap<AssetType, String>>"
    },
    "getAssets": {
      "description": "get all assets balance and infos",
      "params": [
        {
          "name": "at",
          "type": "Hash",
          "isOptional": true
        }
      ],
      "type": "BTreeMap<AssetId, TotalAssetInfoForRpc>"
    }
  }
};
