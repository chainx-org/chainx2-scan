import React, { useContext, useReducer, useEffect } from "react";
import api from "../services/api";
import { AntSpinner as Spinner } from "./index";

const AppContext = React.createContext();

const initialState = { tokens: [], intentions: [] };

function reducer(state, action) {
    switch (action.type) {
        case "setToken":
            return { ...state, tokens: action.payload };
        case "setIntentions":
            return { ...state, intentions: action.payload };
        default:
            throw new Error("cant found type");
    }
}

export function AppContextProvider(props) {
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        const token = api.fetchTokens$().subscribe(
            result => {
                dispatch({ type: "setToken", payload: result });
            },
            () => {
                dispatch({ type: "setToken", payload: [] });
            }
        );
        const intentions = api.fetchIntentions$({ pageSize: 200 }).subscribe(
            result => {
                dispatch({ type: "setIntentions", payload: result && result.items ? result.items : [] });
            },
            () => {
                dispatch({ type: "setIntentions", payload: [] });
            }
        );
        return () => {
            token.unsubcription();
            intentions.unsubcription();
        };
    }, [api]);
    const { tokens = [], intentions = [] } = state;
    if (!tokens.length || !intentions.length) {
        return (
            <div className="main-content" style={{ height: "100%", padding: "20% 0" }}>
                <Spinner />
            </div>
        );
    }
    return <AppContext.Provider value={[state, dispatch]}>{props.children}</AppContext.Provider>;
}

export const useAppContext = () => useContext(AppContext);

export default AppContext;
