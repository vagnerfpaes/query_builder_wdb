declare function _exports(api: any): {
    presets: string[];
    plugins: (string | (string | {
        helpers: boolean;
    })[] | (string | {
        legacy: boolean;
    })[] | (string | {
        loose: boolean;
    })[])[];
    env: {
        test: {
            plugins: (string | (string | {
                helpers: boolean;
            })[] | (string | {
                legacy: boolean;
            })[] | (string | {
                loose: boolean;
            })[])[];
        };
    };
};
export = _exports;
