import React, {useState, useEffect, useMemo} from "react";

import { Table, Amount, ValidatorLink, NumberFormat } from "../../../components";
import api from "../../../services/api";
import $t from '../../../locale'
import { FormattedMessage } from "react-intl";
import { useLoad } from "../../../utils/hooks";
import {useParams} from "react-router-dom";
import DateShow from "../../../components/DateShow";

export default function AccountNomination(props) {
    const [list, setList] = useState([]);
    const [page, setPage] = useState(1)
    const [pageSize, setPageSize] = useState(20)

    const { address } = useParams()

    const params = useMemo(() => {
        return address
            ? { address: address, page, pageSize }
            : { page, pageSize }
    }, [address, page, pageSize])

    const { items: nominationList, loading } = useLoad(
        api.fetchAccountNominations,
        params
    )

    const getRevocations = revocations => {
        return JSON.parse(revocations)
            .flat()
            .reduce((a, b) => a + b, 0);
    };

    return (
        <Table
            loading={loading}
            pagination={false}
            dataSource={
                nominationList &&
                nominationList.map(data => {
                    return {
                        key: data.id,
                        id: data.id,
                        pair: `${data["pair.currency_pair"][0]}/${data["pair.currency_pair"][1]}`,
                        price: (
                            <Amount
                                value={data.price}
                                precision={data["pair.precision"]}
                                minDigits={data["pair.precision"] - data["pair.unit_precision"]}
                                symbol={data["pair.currency_pair"][0]}
                                hideSymbol
                            />
                        ),
                        class: <OrderClass value={data.class} />,
                        direction: <OrderDirection value={data.direction} />,
                        status: <OrderStatus value={data.status} />,
                        createTime: <DateShow value={data["block.time"]} />,
                        updateTime: <DateShow value={data["updateBlock.time"]} />,
                        amount: <Amount value={data.amount} symbol={data["pair.currency_pair"][0]} hideSymbol />,
                        hasFillAmount: (
                            <HasFill fill={data.hasfill_amount} total={data.amount} symbol={data["pair.currency_pair"][0]} />
                        )
                    };
                })
            }
            columns={[
                {
                    title: <FormattedMessage id="ORDERNUMBER" />,
                    dataIndex: "id"
                },
                {
                    title: <FormattedMessage id="TRADINGPAIR" />,
                    dataIndex: "pair"
                },
                {
                    title: <FormattedMessage id="PRICE" />,
                    dataIndex: "price"
                },
                {
                    title: <FormattedMessage id="CATEGORY" />,
                    dataIndex: "class"
                },
                {
                    title: <FormattedMessage id="TYPE" />,
                    dataIndex: "direction"
                },
                {
                    title: <FormattedMessage id="AMOUNT" />,
                    dataIndex: "amount"
                },
                {
                    title: (
                        <>
                            <FormattedMessage id="FILLED" />/<FormattedMessage id="FILLEDPERCENT" />
                        </>
                    ),
                    dataIndex: "hasFillAmount"
                },
                {
                    title: <FormattedMessage id="STATUS" />,
                    dataIndex: "status"
                },
                {
                    title: <FormattedMessage id="CREATEAT" />,
                    dataIndex: "createTime"
                },
                {
                    title: <FormattedMessage id="LASTUPDATE" />,
                    dataIndex: "updateTime"
                }
            ]}
        />
    );
}
