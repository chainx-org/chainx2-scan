const { u8aToHex } = require("@polkadot/util");
const { sleep } = require("./util");
const {
  getExtrinsicCollection,
  getBlockCollection,
  getFirstScanHeight,
  updateScanHeight,
  deleteDataFrom
} = require("./mongoClient");
const { getApi } = require("./api");
const {
  updateHeight,
  getLatestHeight,
  unsubscribeNewHead
} = require("./latestHead");

async function main() {
  await updateHeight();
  const api = await getApi();

  let scanHeight = await getFirstScanHeight();
  await deleteDataFrom(scanHeight);

  while (true) {
    const chainHeight = getLatestHeight();
    if (scanHeight > chainHeight) {
      // 如果要检索的高度大于现在的最大高度，那么等一等
      await sleep(1000);
      continue;
    }

    let blockHash;
    try {
      blockHash = await api.rpc.chain.getBlockHash(scanHeight);
    } catch (e) {
      console.log(e.message);
      await sleep(1000);
      continue;
    }

    if (!blockHash) {
      await sleep(1000);
      continue;
    }

    const block = await api.rpc.chain.getBlock(blockHash);
    // TODO: 如果发现区块分叉，回滚数据库中的区块和交易
    await handleBlock(block.block);

    await updateScanHeight(scanHeight++);
  }
}

async function handleBlock(block) {
  const hash = block.hash.toHex();
  const blockJson = block.toJSON();
  const blockHeight = block.header.number.toNumber();

  const blockCol = await getBlockCollection();
  const result = await blockCol.insertOne({ hash, ...blockJson });
  if (result.result && !result.result.ok) {
    // FIXME: 处理插入不成功的情况
  }

  let index = 0;
  for (const extrinsic of block.extrinsics) {
    await handleExtrinsic(extrinsic, {
      blockHeight,
      blockHash: hash,
      index: index++
    });
  }

  console.log(`block ${blockHeight} inserted.`);
}

async function handleExtrinsic(extrinsic, indexer) {
  const callIndex = u8aToHex(extrinsic.callIndex);
  const { args } = extrinsic.method.toJSON();
  const name = extrinsic.method.methodName;
  const section = extrinsic.method.sectionName;
  if (section.toLowerCase() === "xassets") {
    console.log(section);
  }
  const version = extrinsic.version;
  const data = u8aToHex(extrinsic.data); // 原始数据
  const doc = { indexer, section, name, callIndex, version, args, data };

  const exCol = await getExtrinsicCollection();
  const result = await exCol.insertOne(doc);
  if (result.result && !result.result.ok) {
    // FIXME: 处理交易插入不成功的情况
  }
}

main()
  .then(r => {
    // TODO:
  })
  .catch(err => {
    // TODO:
  })
  .finally(() => {
    unsubscribeNewHead();
  });
