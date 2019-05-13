

export interface iResultInner {
    queried: number;
    mapped: number;
}

export interface iQueryResults {
    K?: iResultInner;
    A?: iResultInner;
    B?: iResultInner;
    C?: iResultInner;
    P?: iResultInner;
    O?: iResultInner;
}

export const crashSevList = ['K', 'A', 'B', 'C', 'P', 'O'];