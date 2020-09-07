import React from "react";
import PCX from "../assets/tokens/pcx.png";
import BTC from "../assets/tokens/btc.png";
import SDOT from "../assets/tokens/sdot.png";
import LBTC from "../assets/tokens/lbtc.png";
import { useAppContext } from "./AppContext";

const iconMap = {
    PCX,
    BTC,
    LBTC,
    SDOT,
    "L-BTC": LBTC
};

export default function TokenName(props) {
    const { value } = props;
    const findIcon = iconMap[value.toUpperCase()];

    const [{ tokens }] = useAppContext();

    const token = tokens.find(t => t.token === value || t.token_name === value);

    return (
        <div>
            {findIcon ? (
                <img src={findIcon} style={{ marginTop: -9, marginRight: 8, marginBottom: -8, height: 16 }} alt="token" />
            ) : null}
            {token.token_name}({token.token === "BTC" ? "X-BTC" : token.token})
        </div>
    );
}
